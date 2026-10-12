// Integration checks run entirely in a transaction that is always rolled back.
// No test invoices, reservations, or patient changes are retained.
import assert from 'node:assert/strict';
import { prisma } from '../src/config/prisma.js';
import { prescriptionService } from '../src/services/prescription.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';

const transaction = prisma.$transaction.bind(prisma);
const marker = `TEST-REV-${Date.now()}`;
const rollback = new Error('ROLLBACK_VERIFICATION_FIXTURES');
let checked = false;
try {
  await transaction(async (tx) => {
    // Services share the enclosing rollback-only transaction.
    prisma.$transaction = (operation) => operation(tx);
    const staff = await tx.user.findFirst({ where: { role: 'ADMIN', active: true } });
    const patient = await tx.patientProfile.findFirst({ where: { dateOfBirth: { lt: new Date('2000-01-01') } } });
    const products = await tx.product.findMany({ where: { active: true, productType: 'MEDICINE', minimumAgeYears: null, maximumAgeYears: null }, include: { batches: { where: { expiryDate: { gt: new Date() }, restricted: false } } } });
    const product = products.find((entry) => entry.batches.some((batch) => Number(batch.quantityAvailable) - Number(batch.quantityReserved) > 2));
    assert(staff && patient && product, 'A staff account, adult patient and stocked medicine are needed for rollback checks.');
    const clinical = { patientId: patient.id, prescriberName: 'Rollback verification fixture', prescriptionDate: new Date(), orderedForSelf: true, refillsAllowed: 0, retailItems: [],
      items: [{ productId: product.id, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, dosageInstructions: 'Test fixture only', administrationRoute: 'Oral', mealTiming: 'ANY_TIME', asNeeded: false }] };
    const rx = await tx.prescription.create({ data: { ...clinical, retailItems: undefined, prescriptionNumber: marker, createdById: staff.id, isOnline: true,
      items: { create: clinical.items.map((item) => ({ ...item, prescribedQuantity: 1, calculatedQuantity: 1 })) } }, include: { items: true } });
    const input = { items: [{ prescriptionItemId: rx.items[0].id, quantity: 1 }], retailItems: [], couponCode: null, tax: 5, containerFee: 0, notes: 'Original collection note', reservationHours: 24 };
    const sent = await prescriptionService.sendToCashier(rx.id, staff.id, input);
    assert.equal(sent.status, 'VERIFIED');
    assert.equal(Number(sent.paymentRequest.tax), 5);
    assert.equal(sent.paymentRequest.pharmacyNote, input.notes);
    let bill = sent.paymentRequest;
    const customer = { id: patient.userId, role: 'PATIENT' };
    bill = await paymentRequestService.acknowledge(bill.id, { revision: bill.revision, paymentChoice: 'BANK_TRANSFER', customerNote: 'Please call before collection' }, customer);
    const approvedAt = bill.customerAcknowledgedAt;
    bill = await paymentRequestService.update(rx.id, { ...input, revision: bill.revision }, staff.id);
    assert.equal(bill.acknowledgedRevision, bill.revision);
    assert.equal(bill.customerAcknowledgedAt.getTime(), approvedAt.getTime());
    assert.equal(bill.events.filter((event) => event.kind === 'INVOICE_REVISED').length, 0);
    bill = await paymentRequestService.update(rx.id, { ...input, revision: bill.revision, notes: 'Updated collection note' }, staff.id);
    assert.equal(bill.acknowledgedRevision, bill.revision);
    assert.equal(bill.customerNote, 'Please call before collection');
    const collectionEdit = await prescriptionService.update(rx.id, { ...clinical, pickupNote: 'Collect at front desk' }, staff.id);
    assert.equal(collectionEdit.status, 'VERIFIED');
    assert.equal(collectionEdit.items[0].id, rx.items[0].id);
    bill = await paymentRequestService.update(rx.id, { ...input, revision: bill.revision, tax: 9, revisionReason: 'Corrected invoice tax' }, staff.id);
    assert.equal(bill.acknowledgedRevision, null);
    const change = bill.events.find((event) => event.kind === 'INVOICE_REVISED');
    assert.equal(change.details.reason, 'Corrected invoice tax');
    assert.equal(change.details.previous.tax, '5.000');
    assert.equal(change.details.current.tax, '9.000');
    await assert.rejects(paymentRequestService.acknowledge(bill.id, { revision: bill.revision - 1, paymentChoice: 'CASH' }, customer), /latest revision/);
    bill = await paymentRequestService.acknowledge(bill.id, { revision: bill.revision, paymentChoice: 'CASH', customerNote: 'Keep my note' }, customer);
    assert(await tx.stockReservation.count({ where: { paymentRequestId: bill.id } }) > 0);
    const renewedApproval = bill.customerAcknowledgedAt;
    bill = await paymentRequestService.acknowledge(bill.id, { revision: bill.revision, paymentChoice: 'BANK_TRANSFER', customerNote: 'Keep my note' }, customer, true);
    assert.equal(bill.customerAcknowledgedAt.getTime(), renewedApproval.getTime());
    assert.equal(await tx.stockReservation.count({ where: { paymentRequestId: bill.id } }), 0);
    await paymentRequestService.cancel(bill.id, 'Withdraw for clinical correction', { id: staff.id, role: 'ADMIN' });
    const revised = await prescriptionService.update(rx.id, { ...clinical, items: [{ ...clinical.items[0], dosageInstructions: 'Revised test fixture instructions' }] }, staff.id);
    assert.equal(revised.status, 'PENDING');
    assert.equal(revised.verifiedAt, null);
    const audit = await tx.auditLog.findFirst({ where: { entityId: rx.id, action: 'PRESCRIPTION_REVISED' } });
    assert.equal(audit.details.previous.items[0].dosageInstructions, 'Test fixture only');
    assert.equal(audit.details.current.items[0].dosageInstructions, 'Revised test fixture instructions');
    checked = true;
    throw rollback;
  }, { timeout: 30000 });
} catch (error) {
  if (error !== rollback) throw error;
} finally {
  prisma.$transaction = transaction;
  const leftover = await prisma.prescription.count({ where: { prescriptionNumber: marker } });
  await prisma.$disconnect();
  assert.equal(leftover, 0, 'Rollback verification fixture must not persist.');
}
assert(checked);
console.log('PASS: verify/bill, unchanged and note-only edits, revised tax, stale approval, payment choice, stock release, clinical revision history; all fixtures rolled back.');
