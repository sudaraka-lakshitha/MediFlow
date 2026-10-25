// Explicit opt-in local integration checks. Business fixtures always roll back.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { prisma } from '../src/config/prisma.js';
import { deliveryService } from '../src/services/delivery.service.js';
import { workflowLeaseService as locks } from '../src/services/workflowLease.service.js';
import { assertUnusedBankReference } from '../src/utils/bankReference.js';
import { reportEvents } from '../src/services/reportEvents.js';

const url = new URL(process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL);
assert(['localhost', '127.0.0.1', '::1'].includes(url.hostname), 'Local database only');
assert(process.argv.includes('--confirm-local'), 'Pass --confirm-local to run');
const tag = `QA-${crypto.randomUUID().slice(0, 12)}`;
const rollback = new Error('QA_ROLLBACK');
const resource = `qa:${crypto.randomUUID()}`;
const owner = { userId: 1, sessionId: crypto.randomUUID(), clientId: crypto.randomUUID() };
try {
  const staff = await prisma.user.findFirst({ where: { active: true, role: 'ADMIN' }, select: { id: true, role: true } });
  assert(staff, 'An existing administrator is required'); owner.userId = staff.id;
  const results = await Promise.allSettled([locks.begin(resource, owner), locks.begin(resource, { ...owner, clientId: crypto.randomUUID() })]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter(result => result.status === 'rejected').length, 1);
  console.log('PASS: concurrent lease claims have exactly one winner');
  try {
    await prisma.$transaction(async tx => {
      const invoice = await tx.paymentRequest.create({ data: { requestNumber: tag, type: 'RETAIL', pharmacistId: staff.id, subtotal: 100, total: 100, amountPaid: 100, status: 'FULFILLED', paymentMethod: 'BANK_TRANSFER', paymentReference: tag, paidAt: new Date() } });
      const delivery = await tx.deliveryRequest.create({ data: { paymentRequestId: invoice.id, address: 'QA rollback address', recipientName: 'Quality Test', phone: '0701234567', status: 'DISPATCHED', courierService: 'QA Courier', trackingReference: tag, dispatchedAt: new Date() } });
      let current = delivery;
      for (const action of ['DELIVERY_FAILED', 'RETRY_DELIVERY', 'DELIVERED', 'CORRECT_DELIVERED', 'RETURNING', 'RETURNED']) {
        current = await deliveryService.act(invoice.id, { action, reason: 'Rollback integration check', expectedUpdatedAt: current.updatedAt.toISOString() }, staff, tx);
      }
      assert.equal(current.status, 'RETURNED');
      assert(current.returnedAt);
      assert.equal(current.deliveredAt, null);
      await assert.rejects(() => assertUnusedBankReference(tx, tag), /already been used/);
      assert.equal(await tx.paymentRequestEvent.count({ where: { paymentRequestId: invoice.id } }), 6);
      console.log('PASS: real delivery transitions, correction history, and duplicate bank-reference rejection');
      await reportEvents({ start: new Date('2020-01-01'), end: new Date('2035-01-01') }, tx);
      console.log('PASS: reporting relations execute against MySQL');
      throw rollback;
    }, { isolationLevel: 'Serializable', timeout: 30000 });
  } catch (error) { if (error !== rollback) throw error; }
  assert.equal(await prisma.paymentRequest.count({ where: { requestNumber: tag } }), 0);
  console.log('PASS: business fixtures and events rolled back');
} finally {
  await prisma.workflowLease.deleteMany({ where: { resourceKey: resource } });
  await prisma.$disconnect();
}
