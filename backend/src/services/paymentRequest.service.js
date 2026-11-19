import { invoiceSnapshot, invoiceMaterialChanged } from '../utils/invoiceRevision.js';
import { queueRefund } from './refund.service.js';
import { assertUnusedBankReference } from '../utils/bankReference.js';
import { historySearch } from '../utils/historySearch.js';
import { allocateVerifiedTransfer } from '../utils/bankAllocation.js';
import { synchronizeDeliveryCancellation } from '../utils/deliveryCancellation.js';
import { cleanupExpiredCashReservations } from '../utils/reservationExpiry.js';
import { cancellationQuote } from '../utils/cancellationQuote.js';
import { env } from '../config/env.js';
import { localDateKey } from '../utils/localDate.js';
import { validatePaymentAmounts } from '../utils/paymentAmounts.js';
import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { decryptPickupPin, encryptPickupPin, generatePickupPin, hashPickupPin } from '../utils/pickupPin.js';
import { prescriptionService } from './prescription.service.js';
import { assertCouponMatched, calculateDiscounts } from './discount.service.js';
import { verifyPickupPin } from '../utils/pickupPin.js';
import { batchAllocationOrder, operationSettingsService } from './operationSettings.service.js';
import { billCancellationPolicy } from '../utils/billCancellation.js';
import { withUniqueRetry } from '../utils/withUniqueRetry.js';
import { serializable } from '../utils/serializable.js';
import { assertRetailAgeSuitability } from '../utils/ageSuitability.js';
import { consumePaymentRequestStock, releaseReservations, reserveStock, usableStockTotal } from '../utils/stock.js';
import { performPrescriptionDispense } from '../utils/prescriptionDispense.js';
import { cancelPrescriptionQuantity, remainingPrescriptionQuantity } from '../utils/prescriptionQuantity.js';
import { directionSelect } from '../utils/patientMedicineInstructions.js';

// The slip blob itself is deliberately left out - it is fetched through its own endpoint
// so bill listings stay small.
const slipSelect = {
  id: true, status: true, declaredAmount: true, reference: true, paidOn: true, note: true,
  originalName: true, mimeType: true, rejectionReason: true, reviewedAt: true, createdAt: true,
  uploadedBy: { select: { id: true, fullName: true } },
  reviewedBy: { select: { id: true, fullName: true } },
  bankAccount: { select: { id: true, bankName: true, accountNumber: true } },
};

const include = {
  delivery: { select: { status: true, trackingReference: true, dispatchedAt: true, feePaymentRequest: { select: { status: true, refunds: { select: { id: true } } } } } },
  deliveryFeeFor: { select: { paymentRequestId: true, status: true } },
  refunds: { include: { lines: true }, orderBy: { createdAt: 'asc' } },
  events: { orderBy: { createdAt: 'asc' } },
  patient: { select: { id: true, fullName: true, email: true, phone: true } },
  pharmacist: { select: { id: true, fullName: true } },
  cashier: { select: { id: true, fullName: true } },
  cancelledBy: { select: { id: true, fullName: true } },
  prescription: { select: { id: true, prescriptionNumber: true, status: true, sourceUploadId: true, isOnline: true, createdBy: { select: { fullName: true } }, verifiedBy: { select: { fullName: true } } } },
  items: { include: { prescriptionItem: { select: directionSelect }, product: { select: { id: true, genericName: true, strength: true, unit: true, productType: true, prescriptionRequired: true, storageInstructions: true } } } },
  slips: { select: slipSelect, orderBy: { createdAt: 'desc' } },
  sale: { select: { id: true, invoiceNumber: true } },
};

const canView = (record, user) => user.role !== 'PATIENT' || record.patientId === user.id;
const safeRecord = ({ pickupPinHash, pickupPinEncrypted, ...record }) => record;
const visibleDirections = (record, user) => user.role === 'PATIENT' && !['PAID', 'FULFILLED'].includes(record.status)
  ? { ...record, items: record.items?.map(item => ({ ...item, prescriptionItem: null, dosageInstructions: null, specialInstructions: null })) }
  : record;

// Both ways of paying a bill - cash at the counter, or a verified bank transfer - have to
// end in exactly the same state: a PIN issued and the stock held in reserve. Keeping that
// in one place stops the two routes drifting apart.
const settleAsPaid = async (tx, { id, fromStatus, paymentMethod, paymentReference, cashierId, amountPaid, splitDetails = null, ledgerBill = null, transferId = null }) => {
  if (transferId && ledgerBill) paymentReference = (await allocateVerifiedTransfer(tx, transferId, ledgerBill, cashierId)).reference;
  else if (paymentMethod === 'BANK_TRANSFER') paymentReference = await assertUnusedBankReference(tx, paymentReference);
  if (splitDetails?.isSplit && splitDetails.nonCashMethod === 'BANK_TRANSFER' && Number(splitDetails.nonCashAmount) > 0) {
    splitDetails = { ...splitDetails, nonCashReference: await assertUnusedBankReference(tx, splitDetails.nonCashReference) };
  }
  const pin = generatePickupPin();
  const claimed = await tx.paymentRequest.updateMany({
    where: { id, status: fromStatus },
    data: {
      amountPaid, paymentMethod, paymentReference: paymentReference || null, cashierId,
      paidAt: new Date(), status: 'PAID', reservationExpiresAt: null,
      pickupPinHash: hashPickupPin(id, pin), pickupPinEncrypted: encryptPickupPin(pin), pinAttempts: 0,
    },
  });
  if (claimed.count !== 1) throw new AppError(409, 'This bill was just processed by another staff member. Refresh to see its latest status.');

  const settled = await tx.paymentRequest.findUnique({ where: { id }, select: { revision: true } });
  await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, kind: 'PAYMENT_RECEIVED', amount: amountPaid, revision: settled.revision, actorId: cashierId, details: { paymentMethod, paymentReference: paymentReference || null, splitDetails } } });
  const operationSettings = await operationSettingsService.get(tx);
  const allocationOrder = batchAllocationOrder(operationSettings.allocationMethod);
  const items = await tx.paymentRequestItem.findMany({ where: { paymentRequestId: id } });
  const existingReservations = await tx.stockReservation.count({ where: { paymentRequestId: id } });
  if (!existingReservations) await reserveStock(tx, id, items, allocationOrder);
  return { pin, operationSettings };
};

export const paymentRequestService = {
  async allocateBankTransfer(id, input, user) {
    if (!(user.role === 'ADMIN' || user.role === 'CASHIER' || (user.role === 'PHARMACIST' && user.cashierAccess))) throw new AppError(403, 'Cashier access is required.');
    return serializable(async tx => {
      const bill = await tx.paymentRequest.findUnique({ where: { id }, include: { prescription: { select: { isOnline: true, sourceUploadId: true } } } });
      const previous = await tx.bankTransferAllocation.findFirst({ where: { transferId: input.transferId, paymentRequestId: id, revision: input.revision } });
      if (previous) return { alreadyAllocated: true, amount: previous.amount };
      if (!bill || bill.revision !== input.revision || !['AWAITING_PAYMENT', 'SLIP_SUBMITTED'].includes(bill.status) || bill.customerCancellationReason) throw new AppError(409, 'Invoice changed or is not ready for payment. Refresh and review it.');
      if (bill.prescription?.isOnline || bill.prescription?.sourceUploadId) {
        if (bill.acknowledgedRevision !== bill.revision || bill.customerPaymentChoice !== 'BANK_TRANSFER') throw new AppError(409, 'The customer must acknowledge this invoice and choose bank transfer first.');
      }
      const transfer = await tx.bankTransfer.findUnique({ where: { id: input.transferId } });
      const slips = await tx.paymentSlip.findMany({ where: { paymentRequestId: id, status: 'PENDING' } });
      if (slips.some(slip => slip.bankAccountId && slip.bankAccountId !== transfer?.bankAccountId)) throw new AppError(409, 'The uploaded receipt names a different bank account. Reject or correct that receipt before allocating.');
      await settleAsPaid(tx, { id, fromStatus: bill.status, paymentMethod: 'BANK_TRANSFER', cashierId: user.id, amountPaid: bill.total, transferId: input.transferId, ledgerBill: bill });
      await tx.paymentSlip.updateMany({ where: { paymentRequestId: id, status: 'PENDING' }, data: { status: 'VERIFIED', reviewedById: user.id, reviewedAt: new Date(), rejectionReason: null } });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: bill.revision, actorId: user.id, kind: 'BANK_TRANSFER_ALLOCATED', details: { transferId: input.transferId, allocatedAmount: String(bill.total), reference: transfer.reference, bankAccountId: transfer.bankAccountId } } });
      await tx.auditLog.create({ data: { userId: user.id, action: 'BANK_TRANSFER_ALLOCATED', entityType: 'PAYMENT_REQUEST', entityId: id, details: { transferId: input.transferId, amount: String(bill.total) } } });
      return { amount: bill.total, data: safeRecord(await tx.paymentRequest.findUnique({ where: { id }, include })) };
    });
  },
  async cancellationPreview(id, input, user) {
    const bill = await prisma.paymentRequest.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    const policy = billCancellationPolicy(bill, user);
    if (!policy.allowed) throw new AppError(policy.statusCode, policy.message);
    const { removed, kept, ...quote } = cancellationQuote(bill, input.itemIds, input.quantities);
    return quote;
  },
  async collectionsToday() {
    const now = new Date();
    const start = new Date(Date.parse(`${localDateKey(now)}T00:00:00Z`) - env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000);
    const events = await prisma.paymentRequestEvent.findMany({ where: { createdAt: { gte: start, lte: now }, kind: { in: ['PAYMENT_RECEIVED', 'REFUND'] } }, select: { kind: true, amount: true } });
    const awaitingPayment = await prisma.paymentRequest.count({ where: { status: 'AWAITING_PAYMENT' } });
    return { awaitingPayment, payments: events.filter((event) => event.kind === 'PAYMENT_RECEIVED').length, netCollected: events.reduce((sum, event) => sum.add(event.amount), new Prisma.Decimal(0)) };
  },
  async resetPickupPin(id, reason, user) {
    if (user.role !== 'ADMIN') throw new AppError(403, 'Only an administrator can reissue a collection PIN.');
    return serializable(async (tx) => {
      const pin = generatePickupPin();
      const claimed = await tx.paymentRequest.updateMany({
        where: { id, status: 'PAID' },
        data: { pickupPinHash: hashPickupPin(id, pin), pickupPinEncrypted: encryptPickupPin(pin), pinAttempts: 0, pinVerifiedAt: null },
      });
      if (claimed.count !== 1) throw new AppError(409, 'Only paid orders awaiting collection can have their PIN reissued.');
      await tx.auditLog.create({ data: { userId: user.id, action: 'PICKUP_PIN_REISSUED', entityType: 'PAYMENT_REQUEST', entityId: id, details: { reason } } });
      return { data: safeRecord(await tx.paymentRequest.findUnique({ where: { id }, include })), pickupPin: pin };
    });
  },
  async list(user, { page = 1, pageSize = 300, status, search, type } = {}) {
    await cleanupExpiredCashReservations();
    return (await prisma.paymentRequest.findMany({
      where: { ...(user.role === 'PATIENT' ? { patientId: user.id } : {}), ...(status ? { status } : {}), ...(type ? { type } : {}), ...historySearch(search, ['requestNumber', 'patient.fullName', 'patient.phone', 'paymentReference', 'prescription.prescriptionNumber']) },
      include,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * pageSize, take: pageSize,
    })).map(record => safeRecord(visibleDirections(record, user)));
  },
  async get(id, user) {
    const record = await prisma.paymentRequest.findUnique({ where: { id }, include });
    if (!record || !canView(record, user)) throw new AppError(404, 'Payment request not found.');
    return visibleDirections(record, user);
  },
  async create(prescriptionId, input, pharmacistId, tx = null) {
    if (!tx) return serializable((transaction) => this.create(prescriptionId, input, pharmacistId, transaction));
    const prescription = await tx.prescription.findUnique({
      where: { id: prescriptionId },
      include: { patient: true, items: true, paymentRequest: true },
    });
    if (!prescription) throw new AppError(404, 'Prescription not found.');
    if (prescription.paymentRequest && await tx.deliveryRequest?.findUnique({ where: { paymentRequestId: prescription.paymentRequest.id } })) throw new AppError(409, 'This invoice is linked to delivery history and cannot be replaced. Record a new prescription for any further supply.');
    if (!['VERIFIED', 'PARTIALLY_DISPENSED'].includes(prescription.status)) throw new AppError(409, 'Verify the prescription before sending it to the cashier.');
    if (prescription.paymentRequest && !['CANCELLED', 'FULFILLED'].includes(prescription.paymentRequest.status)) {
      throw new AppError(409, 'This prescription already has an active cashier payment request.');
    }
    const quantities = new Map(input.items.map((item) => [Number(item.prescriptionItemId), Number(item.quantity)]));
    // Previously supplied or cancelled quantities must not be billed again.
    const remainingItems = prescription.items.filter((item) => remainingPrescriptionQuantity(item).greaterThan(0));
    const incomplete = remainingItems.some((item) => Number(remainingPrescriptionQuantity(item)) !== Number(quantities.get(item.id) || 0));
    if (incomplete) throw new AppError(409, 'Every remaining prescribed item must be included in the cashier request.');
    const quote = await prescriptionService.quoteDispensing(prescriptionId, { ...input, amountPaid: 0, paymentMethod: 'CASH' }, tx);

    // Keep previous bills and their slips/history immutable. A resend gets a
    // new bill belonging to the prescription's current patient.
    if (prescription.paymentRequest) {
      await tx.paymentSlip.updateMany({ where: { paymentRequestId: prescription.paymentRequest.id, status: 'PENDING' }, data: { status: 'REJECTED', rejectionReason: 'The invoice was withdrawn and replaced.' } });
      await tx.paymentRequest.update({ where: { id: prescription.paymentRequest.id }, data: { prescriptionId: null } });
    }

    const created = await withUniqueRetry(() => tx.paymentRequest.create({
      data: {
        requestNumber: `PAY-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        prescriptionId, patientId: prescription.patient.userId, pharmacistId,
        subtotal: quote.subtotal, discount: quote.discount, containerFee: quote.containerFee, tax: quote.tax, total: quote.total,
        couponCode: input.couponCode || null,
        reservationDurationHours: input.reservationHours || null, pharmacyNote: input.notes || null,
        items: { create: quote.lines.map((line) => ({ prescriptionItemId: line.prescriptionItemId, productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice, lineTotal: line.lineTotal, dosageInstructions: line.dosageInstructions ?? null, specialInstructions: line.specialInstructions ?? null })) },
      },
      include,
    }));
    if (created.prescription?.sourceUploadId) {
      const upload = await tx.prescriptionUpload.findUnique({ where: { id: created.prescription.sourceUploadId }, select: { deliveryRequested: true, deliveryAddress: true, deliveryPhone: true, deliveryRecipientName: true } });
      if (upload?.deliveryRequested) {
        await tx.deliveryRequest.create({ data: { paymentRequestId: created.id, recipientName: upload.deliveryRecipientName || created.prescription?.recipientName || null, address: upload.deliveryAddress, phone: upload.deliveryPhone } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: created.id, revision: created.revision, actorId: pharmacistId, kind: 'DELIVERY_REQUESTED', details: { sourceUploadId: created.prescription.sourceUploadId } } });
      }
      await tx.prescriptionUpload.update({ where: { id: created.prescription.sourceUploadId }, data: { status: 'PAYMENT_PENDING' } });
    }
    return created;
  },
  async update(prescriptionId, input, actorId) {
    return serializable(async (tx) => {
      const prescription = await tx.prescription.findUnique({ where: { id: prescriptionId }, include: { items: true, paymentRequest: { include: { items: { include: { product: true } } } } } });
      if (!prescription) throw new AppError(404, 'Prescription not found.');
      const existing = prescription.paymentRequest;
      if (!existing || existing.status !== 'AWAITING_PAYMENT') throw new AppError(409, 'Only an unpaid invoice without a pending bank slip can be edited.');
      if (input.revision !== existing.revision) throw new AppError(409, 'This invoice changed. Refresh before editing.');
      const quantities = new Map(input.items.map((item) => [Number(item.prescriptionItemId), Number(item.quantity)]));
      if (prescription.items.some((item) => Number(remainingPrescriptionQuantity(item)) !== Number(quantities.get(item.id) || 0))) throw new AppError(409, 'Include every remaining prescribed item.');
      // Keep the agreed prices/discounts on metadata-only saves, even if a coupon
      // expired or the catalogue changed since this invoice was issued.
      const submitted = { ...existing, tax: input.tax, containerFee: input.containerFee, couponCode: input.couponCode,
        items: [
          ...input.items.map((item) => ({ ...existing.items.find((line) => line.prescriptionItemId === item.prescriptionItemId), quantity: item.quantity })),
          ...(input.retailItems || []).map((item) => ({ ...existing.items.find((line) => line.prescriptionItemId == null && line.productId === item.productId), productId: item.productId, quantity: item.quantity })),
        ] };
      const contentChanged = invoiceMaterialChanged(existing, submitted);
      const quote = contentChanged ? await prescriptionService.quoteDispensing(prescriptionId, { ...input, amountPaid: 0, paymentMethod: 'CASH' }, tx) : existing;
      const material = contentChanged && invoiceMaterialChanged(existing, { ...quote, couponCode: input.couponCode });
      const pharmacyNote = input.notes === undefined ? existing.pharmacyNote : input.notes || null;
      const hours = input.reservationHours === undefined ? existing.reservationDurationHours : input.reservationHours || null;
      const metadataChanged = pharmacyNote !== existing.pharmacyNote || hours !== existing.reservationDurationHours;
      if (!material && !metadataChanged) return safeRecord(await tx.paymentRequest.findUnique({ where: { id: existing.id }, include }));
      if (material && !input.revisionReason?.trim()) throw new AppError(400, 'Explain what changed so the customer can review the revised invoice.');
      let reservationExpiresAt = existing.reservationExpiresAt;
      if (!material && existing.reservationExpiresAt && hours !== existing.reservationDurationHours) {
        const settings = await operationSettingsService.get(tx);
        const previousHours = existing.reservationDurationHours || settings.cashReservationHours;
        const nextHours = hours || settings.cashReservationHours;
        reservationExpiresAt = new Date(existing.reservationExpiresAt.getTime() + (nextHours - previousHours) * 3600000);
        if (reservationExpiresAt < existing.reservationExpiresAt) throw new AppError(409, 'An accepted cash reservation cannot be shortened silently. Extend it or revise the collection terms with the customer.');
      }
      const fields = { pharmacyNote, reservationDurationHours: hours };
      if (material) {
        await releaseReservations(tx, existing.id);
        Object.assign(fields, { subtotal: quote.subtotal, discount: quote.discount, containerFee: quote.containerFee, tax: quote.tax, total: quote.total,
          couponCode: input.couponCode || null, revision: { increment: 1 }, acknowledgedRevision: null, customerAcknowledgedAt: null,
          customerPaymentChoice: null, reservationExpiresAt: null, paymentMethod: null });
        await tx.paymentRequestItem.deleteMany({ where: { paymentRequestId: existing.id } });
        await tx.paymentRequestItem.createMany({ data: quote.lines.map((line) => ({ paymentRequestId: existing.id, prescriptionItemId: line.prescriptionItemId, productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice, lineTotal: line.lineTotal, dosageInstructions: line.dosageInstructions ?? null, specialInstructions: line.specialInstructions ?? null })) });
      } else if (reservationExpiresAt !== existing.reservationExpiresAt) {
        fields.reservationExpiresAt = reservationExpiresAt;
      }
      await tx.paymentRequest.update({ where: { id: existing.id }, data: fields });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: existing.id, kind: material ? 'INVOICE_REVISED' : 'INVOICE_NOTE_UPDATED', revision: existing.revision + (material ? 1 : 0), actorId,
        details: { reason: input.revisionReason || 'Non-financial invoice details updated', previous: invoiceSnapshot(existing), current: invoiceSnapshot({ ...quote, couponCode: input.couponCode }), previousNote: existing.pharmacyNote, currentNote: pharmacyNote, previousCustomerAcknowledgement: existing.acknowledgedRevision, previousCustomerAcknowledgedAt: existing.customerAcknowledgedAt?.toISOString() || null, confirmationRetained: !material && existing.acknowledgedRevision === existing.revision, reconfirmationRequired: material } } });
      return safeRecord(await tx.paymentRequest.findUnique({ where: { id: existing.id }, include }));
    });
  },
  async applyPatientCoupon(id, { revision, couponCode }, user) {
    const record = await prisma.paymentRequest.findUnique({
      where: { id },
      select: {
        id: true, patientId: true, prescriptionId: true, status: true, revision: true,
        couponCode: true, containerFee: true, tax: true,
        items: { select: { prescriptionItemId: true, productId: true, quantity: true } },
      },
    });
    if (!record) throw new AppError(404, 'Invoice not found.');
    if (record.patientId !== user.id) throw new AppError(403, 'This invoice does not belong to you.');
    if (record.status !== 'AWAITING_PAYMENT') throw new AppError(409, 'A coupon can only be applied before payment is completed.');
    if (record.revision !== revision) throw new AppError(409, 'This invoice changed. Refresh and review the latest version before applying a coupon.');
    const prescription = record.prescriptionId
      ? await prisma.prescription.findUnique({ where: { id: record.prescriptionId }, select: { isOnline: true, sourceUploadId: true } })
      : null;
    if (!prescription?.isOnline && !prescription?.sourceUploadId) throw new AppError(403, 'Coupons can only be applied to your online pharmacy invoices.');

    const medicineItems = record.items.filter(item => item.prescriptionItemId != null)
      .map(item => ({ prescriptionItemId: item.prescriptionItemId, quantity: Number(item.quantity) }));
    const retailItems = record.items.filter(item => item.prescriptionItemId == null)
      .map(item => ({ productId: item.productId, quantity: Number(item.quantity) }));
    return this.update(record.prescriptionId, {
      revision,
      revisionReason: couponCode?.trim() ? `Customer applied coupon ${couponCode.trim()}` : 'Customer removed the coupon',
      items: medicineItems,
      retailItems,
      couponCode: couponCode?.trim() || null,
      containerFee: Number(record.containerFee || 0),
      tax: Number(record.tax || 0),
    }, user.id);
  },
  async cancel(id, reason, user, tx = null) {
    if (!tx) return serializable((transaction) => this.cancel(id, reason, user, transaction));
      const current = await tx.paymentRequest.findUnique({ where: { id }, include: { delivery: true, deliveryFeeFor: true, prescription: { select: { sourceUploadId: true, isOnline: true } } } });
      const policy = billCancellationPolicy(current, user);
      if (!policy.allowed) throw new AppError(policy.statusCode, policy.message);
      const claimed = await tx.paymentRequest.updateMany({
        where: { id, status: current.status },
        data: { status: 'CANCELLED', cancellationReason: reason, cancelledById: user.id, cancelledAt: new Date() },
      });
      if (claimed.count !== 1) throw new AppError(409, 'This bill was just processed by someone else. Refresh to see its latest status.');
      await synchronizeDeliveryCancellation(tx, current, user, reason, this.cancel.bind(this));
      await releaseReservations(tx, id);
      const refund = current.status === 'PAID' ? current.amountPaid.sub(current.refundedAmount || 0) : new Prisma.Decimal(0);
      await tx.paymentRequest.update({ where: { id }, data: { refundedAmount: { increment: refund } } });
      await tx.paymentSlip.updateMany({ where: { paymentRequestId: id, status: 'PENDING' }, data: { status: 'REJECTED', rejectionReason: 'Invoice cancelled.' } });
      const pendingRefund = await queueRefund(tx, { paymentRequestId: id, amount: refund, reason, userId: user.id });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, kind: refund.greaterThan(0) ? 'REFUND_REQUESTED' : 'CANCELLED', amount: 0, revision: current.revision, actorId: user.id, details: { reason, refundId: pendingRefund?.id || null, refundAmount: String(refund), settlement: pendingRefund ? 'PENDING' : null } } });
      const data = await tx.paymentRequest.findUnique({ where: { id }, include });
      return safeRecord({ ...data, refundAmount: Number(refund) });
  },
  async partialCancel(id, { itemIds, quantities, reason, revision, skipCustomerReconfirmation = false }, user, tx = null) {
    if (!tx) return serializable(transaction => this.partialCancel(id, { itemIds, quantities, reason, revision, skipCustomerReconfirmation }, user, transaction));
      const current = await tx.paymentRequest.findUnique({
        where: { id },
        include: {
          items: { include: { product: { include: { category: true } } } },
        },
      });
      if (!current) throw new AppError(404, 'Payment request not found.');
      const policy = billCancellationPolicy(current, user);
      if (!policy.allowed) throw new AppError(policy.statusCode, policy.message);
      if (current.status === 'SLIP_SUBMITTED') {
        throw new AppError(409, 'Reject or cancel the pending bank slip before changing invoice line items.');
      }

      const cashAcknowledgementIsActive = current.customerPaymentChoice !== 'CASH'
        || (current.reservationExpiresAt && current.reservationExpiresAt > new Date());
      const canKeepCustomerAcknowledgement = current.status === 'AWAITING_PAYMENT'
        && current.acknowledgedRevision === current.revision
        && ['CASH', 'BANK_TRANSFER'].includes(current.customerPaymentChoice)
        && cashAcknowledgementIsActive;
      if (skipCustomerReconfirmation && !canKeepCustomerAcknowledgement) {
        throw new AppError(409, 'Customer confirmation can only be retained for the currently acknowledged, unexpired invoice revision.');
      }

      if (revision !== current.revision) throw new AppError(409, 'The invoice changed. Refresh the cancellation preview.');
      const calculation = cancellationQuote(current, itemIds, quantities);
      const { kept: itemsToKeep, removed: itemsToCancel } = calculation;

      if (!itemsToCancel.length) throw new AppError(400, 'Select at least one item to cancel.');

      // If all items are being cancelled, cancel the entire bill
      if (!itemsToKeep.length) {
        return this.cancel(id, `All items cancelled: ${reason}`, user, tx);
      }

      // A cash acknowledgement may already be holding stock. Any unpaid invoice edit
      // withdraws that acknowledgement and hold; the customer must accept the new revision.
      if (current.status === 'AWAITING_PAYMENT') await releaseReservations(tx, id);

      // If bill was paid, release the stock reservations for the cancelled line items
      if (current.status === 'PAID') {
        const reservations = await tx.stockReservation.findMany({
          where: { paymentRequestId: id, paymentRequestItemId: { in: itemsToCancel.map((i) => i.id) } },
        });
        const leftToRelease = new Map(itemsToCancel.map((item) => [item.id, new Prisma.Decimal(item.quantity)]));
        for (const res of reservations) {
          const released = Prisma.Decimal.min(res.quantity, leftToRelease.get(res.paymentRequestItemId) || 0);
          leftToRelease.set(res.paymentRequestItemId, leftToRelease.get(res.paymentRequestItemId).sub(released));
          await tx.inventoryBatch.update({
            where: { id: res.batchId },
            data: { quantityReserved: { decrement: released } },
          });
          if (released.equals(res.quantity)) await tx.stockReservation.deleteMany({ where: { id: res.id } });
          else await tx.stockReservation.update({ where: { id: res.id }, data: { quantity: { decrement: released } } });
        }
      }

      // Delete the cancelled items
      await tx.paymentRequestItem.deleteMany({
        where: { id: { in: itemsToCancel.filter((item) => !itemsToKeep.some((kept) => kept.id === item.id)).map((i) => i.id) } },
      });
      for (const line of itemsToKeep.filter((item) => itemsToCancel.some((removed) => removed.id === item.id))) await tx.paymentRequestItem.update({ where: { id: line.id }, data: { quantity: line.quantity, lineTotal: line.lineTotal } });

      for (const line of itemsToCancel.filter((item) => item.prescriptionItemId != null)) {
        await cancelPrescriptionQuantity(tx, line, reason);
      }

      const { subtotal: newSubtotal, discount, tax, containerFee, total: newTotal, refundAmount: refundDiff } = calculation;

      const cancelledNames = itemsToCancel.map((i) => `${i.product.genericName} (${i.quantity} ${i.product.unit})`).join(', ');
      const auditNote = current.status === 'PAID'
        ? `Partial cancellation (Refund pending Rs. ${Number(refundDiff).toFixed(2)} for ${cancelledNames}): ${reason}`
        : `Partial cancellation (Removed ${cancelledNames}): ${reason}`;

      const updateData = {
        subtotal: newSubtotal,
        discount,
        containerFee,
        tax,
        total: newTotal,
        revision: { increment: 1 },
        cancellationReason: auditNote.slice(0, 500),
      };

      if (current.status === 'AWAITING_PAYMENT') {
        updateData.revision = { increment: 1 };
        if (skipCustomerReconfirmation) {
          updateData.acknowledgedRevision = current.revision + 1;
        } else {
          updateData.acknowledgedRevision = null;
          updateData.customerAcknowledgedAt = null;
          updateData.customerPaymentChoice = null;
          updateData.reservationExpiresAt = null;
        }
      }

      if (current.status === 'PAID') {
        updateData.refundedAmount = { increment: refundDiff };
      }

      await tx.paymentRequest.update({
        where: { id },
        data: updateData,
      });

      if (
        skipCustomerReconfirmation
        && current.status === 'AWAITING_PAYMENT'
        && current.customerPaymentChoice === 'CASH'
      ) {
        const settings = await operationSettingsService.get(tx);
        await reserveStock(
          tx,
          id,
          itemsToKeep,
          batchAllocationOrder(settings.allocationMethod),
        );
      }

      const pendingRefund = await queueRefund(tx, { paymentRequestId: id, amount: refundDiff, reason, userId: user.id });
      await tx.paymentRequestEvent.create({ data: {
        paymentRequestId: id, kind: refundDiff.greaterThan(0) ? 'REFUND_REQUESTED' : 'PARTIAL_CANCELLATION',
        amount: 0, revision: current.revision + 1, actorId: user.id,
        details: { reason, refundId: pendingRefund?.id || null, refundAmount: String(refundDiff), settlement: refundDiff.greaterThan(0) ? 'PENDING' : null, removedItems: itemsToCancel.map((item) => ({ prescriptionItemId: item.prescriptionItemId, productId: item.productId, name: item.product.genericName, quantity: String(item.quantity), unit: item.product.unit })), previousTotal: String(current.total), revisedTotal: String(newTotal), confirmationRetained: skipCustomerReconfirmation,
          previousAcknowledgedRevision: current.acknowledgedRevision ?? null, previousCustomerAcknowledgedAt: current.customerAcknowledgedAt?.toISOString() || null,
          reconfirmationRequired: current.status === 'AWAITING_PAYMENT' && !skipCustomerReconfirmation,
          previous: invoiceSnapshot(current), current: invoiceSnapshot({ ...current, items: itemsToKeep, subtotal: newSubtotal, discount, tax, containerFee, total: newTotal }),
        },
      } });
      const updated = await tx.paymentRequest.findUnique({ where: { id }, include });
      return safeRecord({ ...updated, refundAmount: Number(refundDiff) });
  },
  async requestCancellation(id, reason, user) {
    return serializable(async (tx) => {
      const current = await tx.paymentRequest.findUnique({ where: { id } });
      if (!current) throw new AppError(404, 'Payment request not found.');
      if (user.role === 'PATIENT' && current.patientId !== user.id) throw new AppError(403, 'This bill does not belong to you.');
      if (['CANCELLED', 'FULFILLED'].includes(current.status)) throw new AppError(409, 'This invoice can no longer be cancelled.');
      await tx.paymentRequest.update({ where: { id }, data: { customerCancellationReason: reason } });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, kind: 'CANCELLATION_REQUESTED', revision: current.revision, actorId: user.id, details: { reason } } });
      return safeRecord(await tx.paymentRequest.findUnique({ where: { id }, include }));
    });
  },
  async resolveCancellation(id, { reason, revision, requestReason }, user) {
    if (!['ADMIN', 'PHARMACIST', 'CASHIER'].includes(user.role)) throw new AppError(403, 'Only pharmacy staff can resolve a cancellation request.');
    if (!reason?.trim() || reason.trim().length < 3) throw new AppError(400, 'Explain why the order should continue.');
    return serializable(async (tx) => {
      const current = await tx.paymentRequest.findUnique({ where: { id } });
      if (!current?.customerCancellationReason || current.revision !== revision || current.customerCancellationReason !== requestReason || ['CANCELLED', 'FULFILLED'].includes(current.status)) throw new AppError(409, 'The cancellation request changed. Refresh before resolving it.');
      await tx.paymentRequest.update({ where: { id }, data: { customerCancellationReason: null } });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, kind: 'CANCELLATION_RESOLVED', revision, actorId: user.id, details: { reason, requestReason, resolution: 'CONTINUE_ORDER' } } });
      return safeRecord(await tx.paymentRequest.findUnique({ where: { id }, include }));
    });
  },
  async retailPatients(search = '') {
    return prisma.user.findMany({ where: { role: 'PATIENT',
      AND: [{ OR: [{ active: true }, { email: { endsWith: '@patients.mediflow.invalid' } }] },
        ...(search ? [{ OR: [{ fullName: { contains: search } }, { email: { contains: search } }, { phone: { contains: search.startsWith('+94') ? `0${search.slice(3)}` : search } }, { patientProfile: { patientNumber: { contains: search } } }] }] : [])],
    }, select: { id: true, fullName: true, phone: true, email: true, patientProfile: { select: { patientNumber: true } } }, orderBy: [{ fullName: 'asc' }, { id: 'asc' }], take: 50 });
  },
  async retailOptions() {
    const [products, patients] = await Promise.all([
      prisma.product.findMany({
        where: { active: true, prescriptionRequired: false },
        select: {
          id: true, sku: true, barcode: true, genericName: true, strength: true, unit: true, productType: true, sellingPrice: true,
          batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: new Date() }, restricted: false }, select: { quantityAvailable: true, quantityReserved: true } },
        },
        orderBy: { genericName: 'asc' },
      }),
      this.retailPatients(),
    ]);
    return { products, patients };
  },
  async createRetail(input, pharmacistId) {
    return serializable(async tx => {
    if (input.patientId) {
      const patient = await tx.user.findFirst({ where: { id: input.patientId, role: 'PATIENT', OR: [{ active: true }, { email: { endsWith: '@patients.mediflow.invalid' } }] }, select: { id: true } });
      if (!patient) throw new AppError(400, 'The selected patient account is unavailable.');
    }
    const requestedIds = [...new Set(input.items.map((item) => item.productId))];
    const products = await tx.product.findMany({ where: { id: { in: requestedIds }, active: true, prescriptionRequired: false }, include: { category: true, batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: new Date() }, restricted: false } } } });
    await assertRetailAgeSuitability(input.patientId, products);
    const byId = new Map(products.map((product) => [product.id, product]));
    const lines = []; const allocations = []; let subtotal = new Prisma.Decimal(0);
    for (const requested of input.items) {
      const product = byId.get(requested.productId);
      if (!product) throw new AppError(404, `Retail product ${requested.productId} was not found or requires a prescription.`);
      const quantity = stockQuantity(requested.quantity, product.unit);
      const available = usableStockTotal(product.batches);
      if (available.lessThan(quantity)) throw new AppError(409, `Insufficient usable stock for ${product.genericName}.`);
      const lineTotal = product.sellingPrice.mul(quantity).toDecimalPlaces(2);
      subtotal = subtotal.add(lineTotal);
      lines.push({ productId: product.id, quantity, unitPrice: product.sellingPrice, lineTotal });
      allocations.push({ productId: product.id, categoryId: product.categoryId, quantity, unitPrice: product.sellingPrice, lineTotal });
    }
    subtotal = subtotal.toDecimalPlaces(2);
    const discountResult = assertCouponMatched(await calculateDiscounts(tx, allocations, subtotal, input.couponCode));
    const tax = new Prisma.Decimal(input.tax).toDecimalPlaces(2);
    const total = Prisma.Decimal.max(0, subtotal.sub(discountResult.amount).add(tax)).toDecimalPlaces(2);
    return withUniqueRetry(() => tx.paymentRequest.create({
      data: {
        type: 'RETAIL', requestNumber: `RET-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        patientId: input.patientId || null, pharmacistId, subtotal, discount: discountResult.amount, tax, total, couponCode: input.couponCode || null,
        items: { create: lines },
      },
      include,
    }));
    });
  },
  async pay(id, paymentMethod, cashierId, paymentReference, extraDetails = {}) {
    await cleanupExpiredCashReservations();
    return serializable(async (tx) => {
      const current = await tx.paymentRequest.findUnique({
        where: { id },
        include: { prescription: { select: { sourceUploadId: true, isOnline: true } } },
      });
      if (!current) throw new AppError(404, 'Payment request not found.');
      if (current.status === 'SLIP_SUBMITTED') {
        throw new AppError(409, 'A bank transfer slip is waiting to be checked for this bill. Verify or reject the slip instead of taking payment again.');
      }
      if (current.status !== 'AWAITING_PAYMENT') throw new AppError(409, 'This payment request is not awaiting payment.');
      if (current.customerCancellationReason) throw new AppError(409, 'Resolve the customer cancellation request before accepting payment.');
      if (current.reservationExpiresAt && current.reservationExpiresAt <= new Date()) {
        throw new AppError(409, 'The customer\'s cash stock reservation expired. Refresh the bill and ask them to acknowledge it again.');
      }
      if ((current.prescription?.isOnline || current.prescription?.sourceUploadId) && current.acknowledgedRevision !== current.revision) {
        throw new AppError(409, 'The customer must acknowledge the latest invoice before payment is accepted.');
      }
      if (current.customerPaymentChoice === 'BANK_TRANSFER') {
        throw new AppError(409, 'The customer selected bank transfer. Verify their uploaded bank slip instead of taking a separate cashier payment.');
      }
      if ((current.prescription?.isOnline || current.prescription?.sourceUploadId) && current.customerPaymentChoice === 'CASH' && paymentMethod !== 'CASH') {
        throw new AppError(409, 'The customer acknowledged this online invoice as a cash payment. Edit the invoice and obtain a new acknowledgement before using another payment method.');
      }

      validatePaymentAmounts(current.total, paymentMethod, extraDetails);
      const { pin, operationSettings } = await settleAsPaid(tx, {
        id, fromStatus: 'AWAITING_PAYMENT', paymentMethod, paymentReference, cashierId, amountPaid: current.total,
        splitDetails: extraDetails.splitDetails || null,
      });

      let dispensed = null;
      if (operationSettings.cashierCanDispenseAtPayment && extraDetails.confirmHandover === true && current.prescriptionId) {
        dispensed = await performPrescriptionDispense(tx, {
          prescriptionId: current.prescriptionId, paymentRequestId: id, performedById: cashierId,
          notes: 'Dispensed at payment by the cashier (cashier dispense-at-payment enabled).',
        });
      }
      const data = await tx.paymentRequest.findUnique({ where: { id }, include });
      return {
        data: safeRecord(data),
        pickupPin: dispensed ? null : pin,
        dispensed,
        tenderedAmount: extraDetails.tenderedAmount ?? null,
        changeAmount: extraDetails.changeAmount ?? null,
        splitDetails: extraDetails.splitDetails ?? null,
      };
    });
  },

  async acknowledge(id, input, user, changeChoice = false) {
    return serializable(async (tx) => {
      const request = await tx.paymentRequest.findUnique({
        where: { id },
        include: { items: true, prescription: { select: { sourceUploadId: true, isOnline: true } } },
      });
      if (!request) throw new AppError(404, 'Invoice not found.');
      if (request.patientId !== user.id) throw new AppError(403, 'This invoice does not belong to you.');
      if (request.status !== 'AWAITING_PAYMENT') throw new AppError(409, 'Only an invoice awaiting payment can be acknowledged.');
      if (input.revision !== request.revision) throw new AppError(409, 'The pharmacy updated this invoice. Refresh and acknowledge the latest revision.');
      if (changeChoice && request.acknowledgedRevision !== request.revision) throw new AppError(409, 'Review and acknowledge the latest invoice before changing payment method.');
      const retainAcknowledgement = request.acknowledgedRevision === request.revision;
      const activeCashHold = request.customerPaymentChoice === 'CASH' && request.reservationExpiresAt && request.reservationExpiresAt > new Date();

      await releaseReservations(tx, id);
      let reservationExpiresAt = null;
      if (input.paymentChoice === 'CASH') {
        const settings = await operationSettingsService.get(tx);
        const hours = request.reservationDurationHours || settings.cashReservationHours;
        reservationExpiresAt = activeCashHold ? request.reservationExpiresAt : new Date(Date.now() + hours * 60 * 60 * 1000);
        await reserveStock(tx, id, request.items, batchAllocationOrder(settings.allocationMethod));
      }

      const updated = await tx.paymentRequest.update({
        where: { id },
        data: {
          acknowledgedRevision: request.revision,
          customerAcknowledgedAt: retainAcknowledgement ? request.customerAcknowledgedAt : new Date(),
          customerPaymentChoice: input.paymentChoice,
          customerNote: input.customerNote === undefined ? request.customerNote : input.customerNote || null,
          reservationExpiresAt,
        },
        include,
      });
      await tx.paymentRequestEvent.create({ data: {
        paymentRequestId: id, kind: retainAcknowledgement ? 'PAYMENT_CHOICE_CHANGED' : 'CUSTOMER_ACKNOWLEDGED',
        revision: request.revision, actorId: user.id,
        details: { previousPaymentChoice: request.customerPaymentChoice, paymentChoice: input.paymentChoice, reservationExpiresAt: reservationExpiresAt?.toISOString() || null, acknowledgementRetained: retainAcknowledgement },
      } });
      return safeRecord(updated);
    });
  },

  // ---------------------------------------------------------------- online bank transfer
  async submitSlip(id, input, user) {
    const record = await prisma.paymentRequest.findUnique({ where: { id }, select: { id: true, patientId: true, status: true, total: true, revision: true, acknowledgedRevision: true, customerPaymentChoice: true } });
    if (!record) throw new AppError(404, 'Invoice not found.');
    if (user.role === 'PATIENT' && record.patientId !== user.id) throw new AppError(403, 'This invoice does not belong to you.');
    if (record.status === 'SLIP_SUBMITTED') throw new AppError(409, 'A slip for this invoice is already waiting to be checked.');
    if (record.status !== 'AWAITING_PAYMENT') {
      throw new AppError(409, record.status === 'CANCELLED'
        ? 'This invoice has been cancelled, so it can no longer be paid.'
        : 'This invoice has already been paid.');
    }
    if (record.acknowledgedRevision !== record.revision || record.customerPaymentChoice !== 'BANK_TRANSFER') {
      throw new AppError(409, 'Acknowledge the latest invoice and select bank transfer before uploading a receipt.');
    }
    if (input.bankAccountId) {
      const account = await prisma.bankAccount.findFirst({ where: { id: input.bankAccountId, active: true }, select: { id: true } });
      if (!account) throw new AppError(400, 'Choose one of the pharmacy bank accounts currently listed.');
    }

    return prisma.$transaction(async (tx) => {
      const claimed = await tx.paymentRequest.updateMany({ where: { id, status: 'AWAITING_PAYMENT', revision: record.revision, acknowledgedRevision: record.revision, customerPaymentChoice: 'BANK_TRANSFER', patientId: record.patientId }, data: { status: 'SLIP_SUBMITTED' } });
      if (claimed.count !== 1) throw new AppError(409, 'This invoice was just updated. Refresh to see its latest status.');
      await tx.paymentSlip.create({
        data: {
          paymentRequestId: id, uploadedById: user.id, bankAccountId: input.bankAccountId || null,
          originalName: input.originalName, mimeType: input.mimeType,
          fileData: Buffer.from(input.fileBase64, 'base64'),
          declaredAmount: input.declaredAmount, reference: input.reference || null,
          paidOn: input.paidOn || null, note: input.note || null,
        },
      });
      const data = await tx.paymentRequest.findUnique({ where: { id }, include });
      return safeRecord(data);
    });
  },

  async reviewSlip(id, slipId, decision, user) {
    return serializable(async (tx) => {
      const slip = await tx.paymentSlip.findFirst({ where: { id: slipId, paymentRequestId: id }, include: { paymentRequest: true } });
      if (!slip) throw new AppError(404, 'Payment slip not found.');
      if (slip.status !== 'PENDING' || slip.paymentRequest.status !== 'SLIP_SUBMITTED') throw new AppError(409, 'This slip or invoice has already been processed.');
      if (decision.approved) {
        if (slip.paymentRequest.customerCancellationReason) throw new AppError(409, 'Resolve the customer cancellation request before verifying payment.');
        const received = Number(decision.verifiedAmount);
        if (!Number.isFinite(received) || received <= 0 || !decision.verifiedReference?.trim()) throw new AppError(400, 'Record the bank-verified amount and transaction reference.');
        if (!new Prisma.Decimal(received).equals(slip.paymentRequest.total) || !new Prisma.Decimal(received).equals(slip.declaredAmount)) throw new AppError(409, 'The verified transfer, declared amount and invoice total must match. Reconcile the difference before approving; this invoice has not been marked paid.');
      }
      const claim = await tx.paymentSlip.updateMany({
        where: { id: slipId, status: 'PENDING' },
        data: { status: decision.approved ? 'VERIFIED' : 'REJECTED', reviewedById: user.id, reviewedAt: new Date(), rejectionReason: decision.approved ? null : decision.reason },
      });
      if (claim.count !== 1) throw new AppError(409, 'This slip was just reviewed by someone else.');
      let pin = null;
      if (decision.approved) {
        ({ pin } = await settleAsPaid(tx, { id, fromStatus: 'SLIP_SUBMITTED', paymentMethod: 'BANK_TRANSFER', paymentReference: decision.verifiedReference.trim(), cashierId: user.id, amountPaid: new Prisma.Decimal(decision.verifiedAmount) }));
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, kind: 'TRANSFER_VERIFIED', revision: slip.paymentRequest.revision, actorId: user.id, details: { slipId, declaredAmount: String(slip.declaredAmount), verifiedAmount: String(decision.verifiedAmount), verifiedReference: decision.verifiedReference.trim() } } });
      } else {
        const claimed = await tx.paymentRequest.updateMany({ where: { id, status: 'SLIP_SUBMITTED', revision: slip.paymentRequest.revision }, data: { status: 'AWAITING_PAYMENT' } });
        if (claimed.count !== 1) throw new AppError(409, 'The invoice changed. Refresh before reviewing its slip.');
      }
      return { data: safeRecord(await tx.paymentRequest.findUnique({ where: { id }, include })), pickupPin: pin, dispensed: null };
    });
  },

  async slipFile(id, slipId, user) {
    const slip = await prisma.paymentSlip.findFirst({
      where: { id: slipId, paymentRequestId: id },
      select: { originalName: true, mimeType: true, fileData: true, paymentRequest: { select: { patientId: true } } },
    });
    if (!slip) throw new AppError(404, 'Payment slip not found.');
    if (user.role === 'PATIENT' && slip.paymentRequest.patientId !== user.id) throw new AppError(403, 'This payment slip does not belong to you.');
    return slip;
  },

  // A customer who is not happy with what they have been quoted can turn the invoice down
  // instead of leaving it sitting in the cashier's queue.
  async declineByPatient(id, reason, user, revision) {
    const record = await prisma.paymentRequest.findUnique({ where: { id }, select: { id: true, patientId: true, status: true } });
    if (!record) throw new AppError(404, 'Invoice not found.');
    if (record.patientId !== user.id) throw new AppError(403, 'This invoice does not belong to you.');
    if (record.status !== 'AWAITING_PAYMENT') {
      throw new AppError(409, record.status === 'SLIP_SUBMITTED'
        ? 'You have already sent a payment slip for this invoice. Ask the pharmacy to cancel it instead.'
        : 'This invoice can no longer be declined.');
    }
    return prisma.$transaction(async (tx) => {
      const claimed = await tx.paymentRequest.updateMany({
        where: { id, status: 'AWAITING_PAYMENT', revision: revision ?? -1 },
        data: { status: 'CANCELLED', cancellationReason: `Declined by the customer: ${reason}`, cancelledById: user.id, cancelledAt: new Date() },
      });
      if (claimed.count !== 1) throw new AppError(409, 'This invoice was just updated. Refresh to see its latest status.');
      await releaseReservations(tx, id);
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, kind: 'CANCELLED', revision, actorId: user.id, details: { reason: `Declined by the customer: ${reason}` } } });
      const cancelled = await tx.paymentRequest.findUnique({ where: { id }, include: { delivery: true, deliveryFeeFor: true } });
      await synchronizeDeliveryCancellation(tx, cancelled, user, `Declined by the customer: ${reason}`, this.cancel.bind(this));
      const data = await tx.paymentRequest.findUnique({ where: { id }, include });
      return safeRecord(data);
    });
  },
  async documentData(id, user, requirePaid = false) {
    const record = await this.get(id, user);
    if (requirePaid && !['PAID', 'FULFILLED'].includes(record.status)) throw new AppError(409, 'Payment must be completed before the receipt is available.');
    // The PIN only belongs on a receipt while it can still be used: the order has been paid
    // for, is waiting to be collected, and the pharmacy actually verifies PINs. Once collected
    // (or when PIN checks are switched off entirely) printing it is noise the customer would
    // reasonably mistake for something they still have to present.
    const { requirePickupPin } = await operationSettingsService.get();
    const showPin = requirePaid && record.status === 'PAID' && requirePickupPin && !record.deliveryFeeFor && (!record.delivery || record.delivery.status === 'CANCELLED');
    return { ...record, pickupPin: showPin ? decryptPickupPin(record.pickupPinEncrypted) : null };
  },
  async fulfillRetail(id, pickupPin, pharmacistId) {
    if (await prisma.deliveryRequest?.findUnique({ where: { feePaymentRequestId: id } })) throw new AppError(409, 'Delivery fees are completed through the delivery dispatch workflow, not retail collection.');
    const request = await prisma.paymentRequest.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    if (!request || request.type !== 'RETAIL') throw new AppError(404, 'Retail payment request not found.');
    if (request.status !== 'PAID') throw new AppError(402, 'Cashier payment has not been completed for this retail request.');
    if (request.amountPaid.sub(request.refundedAmount || 0).lessThan(request.total)) throw new AppError(409, 'The net payment does not cover this invoice. Resolve the balance before collection.');
    await assertRetailAgeSuitability(request.patientId, request.items.map((item) => item.product));
    const operationSettings = await operationSettingsService.get();
    if (operationSettings.requirePickupPin) {
      if (request.pinAttempts >= 5) throw new AppError(423, 'The receipt PIN is locked after too many failed attempts.');
      if (!verifyPickupPin(request.id, pickupPin, request.pickupPinHash)) {
        await prisma.paymentRequest.update({ where: { id }, data: { pinAttempts: { increment: 1 } } });
        throw new AppError(400, 'The receipt PIN is incorrect.');
      }
    }
    return serializable(async (tx) => {
      const claimed = await tx.paymentRequest.updateMany({ where: { id, type: 'RETAIL', status: 'PAID', customerCancellationReason: null, ...(operationSettings.requirePickupPin ? { pickupPinHash: request.pickupPinHash, pinAttempts: { lt: 5 } } : {}) }, data: { status: 'FULFILLED', pinVerifiedAt: new Date() } });
      if (claimed.count !== 1) throw new AppError(409, 'This retail order is already being processed or has been fulfilled by another staff member.');
      const fulfillmentSettings = await operationSettingsService.get(tx);
      const allocationOrder = batchAllocationOrder(fulfillmentSettings.allocationMethod);
      const itemById = new Map(request.items.map((item) => [item.id, item]));
      const consumed = await consumePaymentRequestStock(tx, request, allocationOrder);
      const saleItems = [];
      for (const entry of consumed) {
        const requested = itemById.get(entry.paymentRequestItemId);
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: entry.productId } });
        const lineTotal = requested.unitPrice.mul(entry.quantity);
        saleItems.push({ productId: entry.productId, batchId: entry.batchId, quantity: entry.quantity, unitPrice: requested.unitPrice, unitCost: entry.unitCost, lineTotal });
        await tx.stockMovement.create({ data: { productId: entry.productId, batchId: entry.batchId, type: 'RETAIL_SALE', quantityChange: entry.quantity.negated(), quantityBefore: entry.quantityBefore, quantityAfter: entry.quantityAfter, referenceType: 'PAYMENT_REQUEST', referenceId: id, reason: 'Paid pharmacist retail handoff', performedById: pharmacistId } });
      }
      const sale = await withUniqueRetry(() => tx.sale.create({ data: {
        invoiceNumber: `INV-${Date.now()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`, patientId: request.patientId,
        pharmacistId, cashierId: request.cashierId, paymentRequestId: request.id, subtotal: request.subtotal, discount: request.discount, containerFee: request.containerFee,
        tax: request.tax, total: request.total, amountPaid: request.amountPaid.sub(request.refundedAmount || 0), paymentMethod: request.paymentMethod, status: 'PAID',
        items: { create: saleItems },
      } }));
      return sale;
    });
  },
};
