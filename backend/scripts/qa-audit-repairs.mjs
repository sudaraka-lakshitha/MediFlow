// Explicit local-only integration checks. Business fixtures are rolled back.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { prisma } from '../src/config/prisma.js';
import { serializable } from '../src/utils/serializable.js';
import { operationContext } from '../src/utils/operationContext.js';
import { bankTransferService } from '../src/services/bankTransfer.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';
import { refundApprovalService } from '../src/services/refundApproval.service.js';
import { patientService } from '../src/services/patient.service.js';
import { deliveryQueuePage } from '../src/utils/deliveryQueue.js';
import { historySearch } from '../src/utils/historySearch.js';
import { bankAccountService } from '../src/services/bankAccount.service.js';
import { reportEvents } from '../src/services/reportEvents.js';

const database = new URL(process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL);
assert(['localhost', '127.0.0.1'].includes(database.hostname) && database.pathname === '/mediflow', 'Authorized local mediflow database only');
assert(process.argv.includes('--confirm-local'), 'Pass --confirm-local');
const tag = `QA-REPAIR-${crypto.randomUUID().slice(0, 8)}`;
const key = crypto.randomUUID(), hash = crypto.createHash('sha256').update(tag).digest('hex');
const transaction = prisma.$transaction.bind(prisma);
const rollback = new Error('ROLLBACK_QA_FIXTURES');
let staff;
try {
  staff = await prisma.user.findFirst({ where: { active: true, role: 'ADMIN' }, select: { id: true, role: true } });
  assert(staff, 'A local administrator is required');
  const attempt = () => operationContext.run({ actorId: staff.id, key, hash }, () => serializable(async tx => {
    const old = await tx.systemSetting.findUnique({ where: { key: tag } });
    await tx.systemSetting.upsert({ where: { key: tag }, create: { key: tag, value: '1' }, update: { value: String(Number(old?.value || 0) + 1) } });
    return { done: true };
  }));
  assert.deepEqual(await Promise.all([attempt(), attempt()]), [{ done: true }, { done: true }]);
  assert.equal((await prisma.systemSetting.findUnique({ where: { key: tag } })).value, '1');
  await assert.rejects(() => operationContext.run({ actorId: staff.id, key, hash: 'changed' }, () => serializable(async () => ({ done: false }))), /different operation/);
  console.log('PASS: concurrent retry commits one effect; changed-payload retry rejected');

  // Read-only query-shape validation against the real generated client/database.
  for (const [model, paths] of [
    ['inventoryBatch', ['batchNumber', 'product.genericName', 'supplier.name']],
    ['stockMovement', ['batch.batchNumber', 'product.genericName', 'performedBy.fullName', 'reason']],
    ['prescription', ['prescriptionNumber', 'patient.user.fullName', 'recipientName', 'prescriberName']],
    ['prescriptionUpload', ['originalName', 'patient.fullName', 'patientNote', 'recipientName']],
    ['paymentRequest', ['requestNumber', 'patient.fullName', 'prescription.prescriptionNumber']],
    ['sale', ['invoiceNumber', 'patient.fullName', 'paymentRequest.requestNumber']],
  ]) await prisma[model].findMany({ where: historySearch(tag, paths), select: { id: true }, take: 1 });
  console.log('PASS: bounded history search relationships execute in MySQL');
  await reportEvents({ start: new Date('1970-01-01'), end: new Date('1970-01-02') });
  console.log('PASS: report queries support cumulative refund history');

  try {
    await transaction(async tx => {
      // Service transactions share this outer rollback, only inside this isolated
      // diagnostic process. No HTTP server or other process is reconfigured.
      prisma.$transaction = operation => operation(tx);
      const patient = await tx.user.create({ data: { email: `${tag}@patients.mediflow.invalid`, fullName: 'Quality Patient', passwordHash: 'disabled-test-account', role: 'PATIENT', active: false, phone: '0701234567' } });
      const reviewer = await tx.user.create({ data: { email: `${tag}-staff@patients.mediflow.invalid`, fullName: 'Quality Staff', passwordHash: 'disabled-test-account', role: 'PHARMACIST', active: false } });
      const profile = await tx.patientProfile.create({ data: { userId: patient.id, patientNumber: tag, chronicConditions: 'Keep this value' } });
      await patientService.update(profile.id, { fullName: 'Quality Patient Updated', expectedUpdatedAt: patient.updatedAt.toISOString() });
      assert.equal((await tx.patientProfile.findUnique({ where: { id: profile.id } })).chronicConditions, 'Keep this value');
      await assert.rejects(() => patientService.update(profile.id, { fullName: 'Stale Name', expectedUpdatedAt: patient.updatedAt.toISOString() }), /record changed/);
      assert.equal((await tx.user.findUnique({ where: { id: patient.id } })).phone, '0701234567');
      console.log('PASS: patient partial update preserves omitted data; stale edit blocked');

      const bank = await tx.bankAccount.create({ data: { bankName: tag, accountName: 'Quality Test', accountNumber: tag, createdById: staff.id } });
      const receipt = { bankAccountId: bank.id, patientId: patient.id, reference: tag, amount: 100, paidOn: '2026-10-01', bankVerified: true };
      const transfer = await bankTransferService.create(receipt, staff);
      assert.equal((await bankTransferService.create(receipt, staff)).id, transfer.id);
      await assert.rejects(() => bankTransferService.create({ ...receipt, amount: 101 }, staff), /different details/);
      await assert.rejects(() => bankAccountService.update(bank.id, { ...bank, accountNumber: `${tag}-changed` }), /payment history/);
      await assert.rejects(() => bankAccountService.create({ ...bank }, staff.id), /already saved/);
      const alias = await tx.bankAccount.create({ data: { bankName: tag.toLowerCase(), accountName: 'Legacy duplicate', accountNumber: tag, createdById: staff.id } });
      assert.equal((await bankTransferService.create({ ...receipt, bankAccountId: alias.id }, staff)).id, transfer.id);
      assert.equal(await tx.bankTransfer.count({ where: { reference: tag } }), 1);
      console.log('PASS: bank history is immutable; old duplicate account entries cannot create extra funds');
      const makeBill = (suffix, amount, extra = {}) => tx.paymentRequest.create({ data: { requestNumber: `${tag}-${suffix}`, type: 'RETAIL', patientId: patient.id, pharmacistId: staff.id, subtotal: amount, total: amount, ...extra } });
      const first = await makeBill('A', 60), second = await makeBill('B', 40), excess = await makeBill('C', 1);
      await paymentRequestService.allocateBankTransfer(first.id, { transferId: transfer.id, revision: 1 }, staff);
      assert.equal((await paymentRequestService.allocateBankTransfer(first.id, { transferId: transfer.id, revision: 1 }, staff)).alreadyAllocated, true);
      await paymentRequestService.allocateBankTransfer(second.id, { transferId: transfer.id, revision: 1 }, staff);
      await assert.rejects(() => paymentRequestService.allocateBankTransfer(excess.id, { transferId: transfer.id, revision: 1 }, staff), /insufficient/);
      assert.equal(Number((await tx.bankTransfer.findUnique({ where: { id: transfer.id } })).availableAmount), 0);
      assert.equal(await tx.bankTransferAllocation.count({ where: { transferId: transfer.id } }), 2);
      assert.equal(await tx.paymentRequestEvent.count({ where: { paymentRequestId: first.id, kind: 'PAYMENT_RECEIVED' } }), 1);
      console.log('PASS: verified receipt replay, split across invoices, allocation replay and overspending protection');

      const selection = { revision: 1, reason: 'Customer cannot collect' };
      const preview = await refundApprovalService.preview(first.id, selection, reviewer);
      const approval = await refundApprovalService.request(first.id, { ...selection, hash: preview.hash }, reviewer);
      await assert.rejects(() => refundApprovalService.decide(first.id, approval.id, { approved: true, reason: 'Self approval' }, { ...reviewer, role: 'ADMIN' }), /cannot approve/);
      await refundApprovalService.decide(first.id, approval.id, { approved: true, reason: 'Approved after review' }, staff);
      assert.equal((await tx.paymentRequest.findUnique({ where: { id: first.id } })).status, 'CANCELLED');
      const refund = await tx.refund.findFirst({ where: { paymentRequestId: first.id } });
      assert.equal(refund.status, 'PENDING'); assert.equal(Number(refund.amount), 60);
      assert.equal(Number((await tx.bankTransfer.findUnique({ where: { id: transfer.id } })).availableAmount), 0);
      await assert.rejects(() => refundApprovalService.decide(first.id, approval.id, { approved: true, reason: 'Retry' }, staff), /already been decided/);
      console.log('PASS: admin approval creates one pending payout; refund does not re-credit the bank transfer');

      const main = await makeBill('D', 100, { status: 'PAID', amountPaid: 100, refundedAmount: 20 });
      const fee = await makeBill('E', 10, { status: 'PAID', amountPaid: 10 });
      const delivery = await tx.deliveryRequest.create({ data: { paymentRequestId: main.id, feePaymentRequestId: fee.id, status: 'AWAITING_FEE', address: 'Quality rollback address', phone: '0701234567', courierService: 'Quality Courier', recipientName: tag } });
      const filters = { page: 1, pageSize: 50, search: tag, courier: 'Quality Courier', from: '2020-01-01T00:00:00Z', to: '2040-01-01T00:00:00Z' };
      assert.equal((await deliveryQueuePage(tx, staff, { ...filters, queue: 'READY' })).length, 0);
      assert((await deliveryQueuePage(tx, staff, { ...filters, queue: 'ATTENTION' })).some(row => row.id === delivery.id));
      await tx.paymentRequest.update({ where: { id: main.id }, data: { refundedAmount: 0 } });
      assert((await deliveryQueuePage(tx, staff, { ...filters, queue: 'READY' })).some(row => row.id === delivery.id));
      assert.equal((await deliveryQueuePage(tx, { role: 'PATIENT', id: -1 }, { ...filters, queue: 'READY' })).length, 0);
      console.log('PASS: delivery queues filter financial readiness and patient ownership before paging');
      throw rollback;
    }, { isolationLevel: 'Serializable', timeout: 60000 });
  } catch (error) { if (error !== rollback) throw error; }
  finally { prisma.$transaction = transaction; }
  assert.equal(await prisma.user.count({ where: { email: { startsWith: tag } } }), 0);
  assert.equal(await prisma.paymentRequest.count({ where: { requestNumber: { startsWith: tag } } }), 0);
  console.log('PASS: all business fixtures rolled back');
} finally {
  prisma.$transaction = transaction;
  if (staff) await prisma.operationReceipt.deleteMany({ where: { actorId: staff.id, key, payloadHash: hash } });
  await prisma.systemSetting.deleteMany({ where: { key: tag } });
  await prisma.$disconnect();
}
