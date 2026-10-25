import crypto from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
import { performPrescriptionDispense } from '../utils/prescriptionDispense.js';
import { paymentRequestService } from './paymentRequest.service.js';
import { validateDeliveryAction } from '../utils/deliveryAction.js';
import { billCancellationPolicy } from '../utils/billCancellation.js';
import { assertParcelReshippable, parcelContents, reshipmentSaleSelect } from '../utils/reshipment.js';

const feeSelect = { id: true, requestNumber: true, status: true, total: true, amountPaid: true, paidAt: true, refundedAmount: true, customerCancellationReason: true, refunds: { where: { status: 'PENDING' }, select: { id: true } } };
const include = { feePaymentRequest: { select: feeSelect }, paymentRequest: { select: { ...feeSelect, patientId: true, prescriptionId: true, patient: { select: { fullName: true } }, events: { where: { kind: { in: ['DELIVERY_RETURNED', 'DELIVERY_RESHIP', 'DELIVERY_DISPATCH', 'DELIVERY_DELIVERED', 'DELIVERY_DELIVERY_FAILED', 'DELIVERY_RETURNING', 'DELIVERY_RETRY_DELIVERY', 'DELIVERY_CORRECT_DELIVERED'] } }, orderBy: { createdAt: 'asc' }, select: { kind: true, createdAt: true, details: true } } } } };
export const deliveryService = {
  async list(user, { page = 1, pageSize = 300, search, courier, dateField = 'createdAt', from, to } = {}) {
    const where = { ...(user.role === 'PATIENT' ? { paymentRequest: { patientId: user.id } } : {}),
      ...(courier ? { courierService: courier } : {}),
      ...((from || to) ? { [dateField]: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lt: new Date(to) } : {}) } } : {}),
      ...(search ? { OR: [{ recipientName: { contains: search } }, { courierService: { contains: search } }, { trackingReference: { contains: search } }, { paymentRequest: { requestNumber: { contains: search } } }, { paymentRequest: { patient: { fullName: { contains: search } } } }] } : {}) };
    const records = await prisma.deliveryRequest.findMany({ where, include: { ...include, paymentRequest: { select: { ...include.paymentRequest.select, sale: { select: reshipmentSaleSelect } } } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize });
    return records.map(record => {
      const { sale, ...paymentRequest } = record.paymentRequest;
      const fee = record.feePaymentRequest;
      const canCancelDelivery = ['ADMIN', 'PHARMACIST'].includes(user.role) && ['REQUESTED', 'AWAITING_FEE'].includes(record.status)
        && (!fee || fee.status === 'CANCELLED' || billCancellationPolicy(fee, user).allowed);
      return { ...record, paymentRequest, canCancelDelivery, parcelContents: parcelContents(sale) };
    });
  },
  request(id, input, user) {
    return serializable(async tx => {
      const bill = await tx.paymentRequest.findUnique({ where: { id } });
      if (!bill || bill.patientId !== user.id) throw new AppError(404, 'Prescription invoice not found.');
      if (bill.status !== 'PAID' || !bill.prescriptionId || bill.customerCancellationReason || Number(bill.amountPaid) - Number(bill.refundedAmount) < Number(bill.total)) throw new AppError(409, 'Delivery requires a fully paid, uncollected prescription with no cancellation pending.');
      const previous = await tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include: { feePaymentRequest: true } });
      if (previous && previous.status !== 'CANCELLED') throw new AppError(409, 'This prescription already has a delivery request.');
      if (previous?.dispatchedAt) throw new AppError(409, 'A previously dispatched parcel requires pharmacy review, not a new delivery request.');
      if (previous?.feePaymentRequest && previous.feePaymentRequest.status !== 'CANCELLED') throw new AppError(409, 'Ask the pharmacy to resolve the previous delivery-fee invoice first.');
      const invoiceIds = [id, ...(previous?.feePaymentRequestId ? [previous.feePaymentRequestId] : [])];
      if (await tx.refund.count({ where: { paymentRequestId: { in: invoiceIds }, status: { in: ['PENDING', 'AWAITING_APPROVAL'] } } })) throw new AppError(409, 'Resolve outstanding refunds before requesting delivery again.');
      const details = { recipientName: input.recipientName, address: input.address, phone: input.phone };
      // Retain the cancelled fee link until confirmation replaces it. Never reuse
      // its payment or erase its refund history to fund the new delivery.
      const delivery = previous
        ? await tx.deliveryRequest.update({ where: { id: previous.id }, data: { ...details, status: 'REQUESTED' }, include })
        : await tx.deliveryRequest.create({ data: { paymentRequestId: id, ...details }, include });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: bill.revision, actorId: user.id, kind: previous ? 'DELIVERY_REQUESTED_AGAIN' : 'DELIVERY_REQUESTED', details: { deliveryId: delivery.id, ...details, ...(previous ? { previousFeeInvoiceId: previous.feePaymentRequestId || null, previousRecipientName: previous.recipientName, previousAddress: previous.address, previousPhone: previous.phone, previousStatus: previous.status } : {}) } } });
      return delivery;
    });
  },
  async requestReshipment(id, user, withdraw = false) {
    return serializable(async tx => {
      const delivery = await tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include: { paymentRequest: true } });
      if (!delivery || delivery.paymentRequest.patientId !== user.id) throw new AppError(404, 'Delivery not found.');
      if (withdraw) {
        if (!['RESHIP_REQUESTED', 'RESHIP_READY'].includes(delivery.status)) throw new AppError(409, 'Only a reshipment that has not left the pharmacy can be withdrawn.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'RETURNED' } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: delivery.paymentRequest.revision, actorId: user.id, kind: 'DELIVERY_RESHIP_WITHDRAWN', details: { deliveryId: delivery.id } } });
        return tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include });
      }
      if (delivery.status !== 'RETURNED') throw new AppError(409, 'The pharmacy must first confirm the parcel has returned.');
      await assertParcelReshippable(tx, delivery);
      await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'RESHIP_REQUESTED' } });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: delivery.paymentRequest.revision, actorId: user.id, kind: 'DELIVERY_RESHIP_REQUESTED', details: { deliveryId: delivery.id } } });
      return tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include });
    });
  },
  async act(id, input, user, transaction = null) {
    if (!['ADMIN', 'PHARMACIST'].includes(user.role)) throw new AppError(403, 'Only pharmacy staff can arrange dispatch.');
    if (['DISPATCH', 'UPDATE_TRACKING', 'RESHIP'].includes(input.action) && (!input.courierService?.trim() || !input.trackingReference?.trim())) throw new AppError(400, 'Courier service and tracking number are required.');
    const operation = async tx => {
      const delivery = await tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include: { paymentRequest: true, feePaymentRequest: true } });
      if (!delivery) throw new AppError(404, 'Delivery request not found.');
      if (input.expectedUpdatedAt && delivery.updatedAt.toISOString() !== input.expectedUpdatedAt) throw new AppError(409, 'Delivery details changed. Close this form, refresh and review before saving.');
      const bill = delivery.paymentRequest;
      let manifest;
      await validateDeliveryAction(tx, delivery, input);
      if (input.action === 'REQUEST_FEE_CANCELLATION') {
        const fee = delivery.feePaymentRequest;
        if (!fee || fee.status !== 'PAID') throw new AppError(409, 'Only a paid, undispatched delivery fee needs cashier cancellation review.');
        if (fee.customerCancellationReason) throw new AppError(409, 'A cancellation request already exists. Ask the cashier to review it.');
        if (!input.reason?.trim() || input.reason.trim().length < 3) throw new AppError(400, 'Explain why the delivery fee should be cancelled.');
        const reason = input.reason.trim();
        await tx.paymentRequest.update({ where: { id: fee.id }, data: { customerCancellationReason: reason } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: fee.id, revision: fee.revision, actorId: user.id, kind: 'CANCELLATION_REQUESTED', details: { reason, requestedByStaff: true, deliveryId: delivery.id, medicineInvoiceId: id } } });
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { updatedAt: new Date() } });
      } else if (input.action === 'CORRECT_DELIVERED') {
        if (!input.reason?.trim() || input.reason.trim().length < 3) throw new AppError(400, 'Explain why the delivered status was incorrect.');
        if (await tx.refund.count({ where: { OR: [{ paymentRequestId: id }, { sale: { paymentRequestId: id } }], status: { in: ['PENDING', 'SETTLED'] } } })) throw new AppError(409, 'A product refund exists. Resolve the parcel with an administrator before correcting delivery.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'DISPATCHED', deliveredAt: null } });
      } else if (['DELIVERY_FAILED', 'RETURNING', 'RETRY_DELIVERY'].includes(input.action)) {
        if (!input.reason?.trim() || input.reason.trim().length < 3) throw new AppError(400, 'Record the courier update reason.');
        // Courier updates do not dispense goods again or confirm physical return.
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: input.action === 'RETRY_DELIVERY' ? 'DISPATCHED' : input.action } });
      } else if (input.action === 'RETURNED') {
        if (!input.reason?.trim()) throw new AppError(400, 'Record why the parcel was returned.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'RETURNED', returnedAt: new Date(), returnReason: input.reason } });
      } else if (input.action === 'APPROVE_RESHIPMENT') {
        if (!input.inspectionConfirmed || !input.reason?.trim()) throw new AppError(400, 'Record the pharmacist inspection and confirm the returned parcel is safe to reship.');
        manifest = await assertParcelReshippable(tx, delivery);
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'RESHIP_READY' } });
      } else if (input.action === 'RESHIP') {
        manifest = await assertParcelReshippable(tx, delivery);
        // These are the same returned goods, already dispensed and paid for.
        // Do not consume inventory, create another sale, or charge another fee.
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'DISPATCHED', shipmentAttempt: { increment: 1 }, courierService: input.courierService, trackingReference: input.trackingReference, dispatchedAt: new Date(), deliveredAt: null, returnedAt: null, returnReason: null } });
      } else if (input.action === 'CANCEL') {
        if (!['REQUESTED', 'AWAITING_FEE'].includes(delivery.status)) throw new AppError(409, 'Only an undispatched delivery can be cancelled.');
        if (delivery.feePaymentRequest && delivery.feePaymentRequest.status !== 'CANCELLED') await paymentRequestService.cancel(delivery.feePaymentRequest.id, 'Home delivery cancelled; collect medicines at the pharmacy.', user, tx);
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'CANCELLED' } });
      } else if (input.action === 'CONFIRM') {
        const canConfirm = delivery.status === 'REQUESTED' || (delivery.status === 'AWAITING_FEE' && delivery.feePaymentRequest?.status === 'CANCELLED');
        if (!canConfirm || bill.status !== 'PAID' || bill.customerCancellationReason || Number(bill.amountPaid) - Number(bill.refundedAmount) < Number(bill.total)) throw new AppError(409, 'Refresh: this delivery is no longer awaiting confirmation or medicines are not fully paid.');
        if (delivery.feePaymentRequest && delivery.feePaymentRequest.status !== 'CANCELLED') throw new AppError(409, 'An active delivery-fee invoice already exists. Resolve it before issuing another.');
        if (delivery.feePaymentRequestId && await tx.refund.count({ where: { paymentRequestId: delivery.feePaymentRequestId, status: 'PENDING' } })) throw new AppError(409, 'Settle the previous delivery-fee refund before issuing a replacement invoice.');
        const setting = await tx.systemSetting.findUnique({ where: { key: 'standardDeliveryFee' } });
        const fee = Number(setting?.value);
        if (!setting || !Number.isFinite(fee) || fee <= 0 || fee > 1000000) throw new AppError(409, 'Ask the administrator to configure a standard delivery fee first.');
        const feeBill = await tx.paymentRequest.create({ data: {
          type: 'RETAIL', requestNumber: `DEL-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
          patientId: bill.patientId, pharmacistId: user.id, subtotal: fee, total: fee,
          pharmacyNote: `Home delivery service for ${bill.requestNumber}. Pay before dispatch. This invoice contains no medicines.`,
        } });
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { feePaymentRequestId: feeBill.id, status: 'AWAITING_FEE' } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: bill.revision, actorId: user.id, kind: 'DELIVERY_FEE_ISSUED', details: { previousFeeInvoiceId: delivery.feePaymentRequestId || null, feeInvoiceId: feeBill.id, fee: String(fee) } } });
      } else if (input.action === 'DISPATCH') {
        const fee = delivery.feePaymentRequest;
        if (delivery.status !== 'AWAITING_FEE' || !fee || !['PAID', 'FULFILLED'].includes(fee.status) || Number(fee.amountPaid) - Number(fee.refundedAmount) < Number(fee.total) || fee.customerCancellationReason || bill.status !== 'PAID' || bill.customerCancellationReason || Number(bill.amountPaid) - Number(bill.refundedAmount) < Number(bill.total)) throw new AppError(409, 'Both medicine and delivery invoices must be fully paid and verified before dispatch.');
        if (await tx.refund.count({ where: { paymentRequestId: { in: [id, fee.id] }, status: 'PENDING' } })) throw new AppError(409, 'Resolve pending refunds before dispatch.');
        await performPrescriptionDispense(tx, { prescriptionId: bill.prescriptionId, paymentRequestId: id, performedById: user.id, notes: `Home delivery dispatch: ${input.trackingReference}`, deliveryDispatch: true });
        await tx.paymentRequest.update({ where: { id: fee.id }, data: { status: 'FULFILLED' } });
        await tx.sale.create({ data: {
          invoiceNumber: `INV-DEL-${Date.now()}-${crypto.randomUUID().slice(0, 4)}`,
          paymentRequestId: fee.id, patientId: fee.patientId, pharmacistId: user.id, cashierId: fee.cashierId,
          subtotal: fee.subtotal, discount: fee.discount, containerFee: fee.containerFee, tax: fee.tax,
          total: fee.total, amountPaid: Number(fee.amountPaid) - Number(fee.refundedAmount), paymentMethod: fee.paymentMethod, status: 'PAID',
        } });
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'DISPATCHED', trackingReference: input.trackingReference, courierService: input.courierService, dispatchedAt: new Date() } });
      } else if (input.action === 'UPDATE_TRACKING') {
        if (!['DISPATCHED', 'DELIVERY_FAILED', 'RETURNING'].includes(delivery.status)) throw new AppError(409, 'Tracking can only be updated for dispatched deliveries.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { trackingReference: input.trackingReference, courierService: input.courierService } });
      } else if (input.action === 'UPDATE_DETAILS') {
        const data = Object.fromEntries(['recipientName', 'address', 'phone'].filter(key => input[key] !== undefined).map(key => [key, input[key]]));
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data });
      } else {
        if (!['DISPATCHED', 'DELIVERY_FAILED'].includes(delivery.status)) throw new AppError(409, 'Only a dispatched delivery can be marked delivered.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'DELIVERED', deliveredAt: new Date() } });
      }
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: bill.revision, actorId: user.id, kind: `DELIVERY_${input.action}`, details: { ...input, ...(manifest ? { items: manifest } : {}), shipmentAttempt: (delivery.shipmentAttempt || 1) + (input.action === 'RESHIP' ? 1 : 0), previousStatus: delivery.status, previousDeliveredAt: delivery.deliveredAt?.toISOString() || null, previousDispatchedAt: delivery.dispatchedAt?.toISOString() || null, previousReturnedAt: delivery.returnedAt?.toISOString() || null, previousRecipientName: delivery.recipientName, previousAddress: delivery.address, previousPhone: delivery.phone, previousTrackingReference: delivery.trackingReference || null, previousCourierService: delivery.courierService || null } } });
      return tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include });
    };
    return transaction ? operation(transaction) : serializable(operation);
  },
};
