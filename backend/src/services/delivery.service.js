import crypto from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
import { performPrescriptionDispense } from '../utils/prescriptionDispense.js';
import { paymentRequestService } from './paymentRequest.service.js';

const feeSelect = { id: true, requestNumber: true, status: true, total: true, amountPaid: true, refundedAmount: true, customerCancellationReason: true, refunds: { where: { status: 'PENDING' }, select: { id: true } } };
const include = { feePaymentRequest: { select: feeSelect }, paymentRequest: { select: { ...feeSelect, patientId: true, prescriptionId: true, patient: { select: { fullName: true } } } } };
export const deliveryService = {
  list(user, { page = 1, pageSize = 300 } = {}) {
    return prisma.deliveryRequest.findMany({ where: user.role === 'PATIENT' ? { paymentRequest: { patientId: user.id } } : {}, include, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize });
  },
  request(id, input, user) {
    return serializable(async tx => {
      const bill = await tx.paymentRequest.findUnique({ where: { id } });
      if (!bill || bill.patientId !== user.id) throw new AppError(404, 'Prescription invoice not found.');
      if (bill.status !== 'PAID' || !bill.prescriptionId || bill.customerCancellationReason || Number(bill.amountPaid) - Number(bill.refundedAmount) < Number(bill.total)) throw new AppError(409, 'Delivery requires a fully paid, uncollected prescription with no cancellation pending.');
      if (await tx.deliveryRequest.findUnique({ where: { paymentRequestId: id } })) throw new AppError(409, 'This prescription already has a delivery request.');
      const delivery = await tx.deliveryRequest.create({ data: { paymentRequestId: id, address: input.address, phone: input.phone }, include });
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: bill.revision, actorId: user.id, kind: 'DELIVERY_REQUESTED', details: { deliveryId: delivery.id } } });
      return delivery;
    });
  },
  async act(id, input, user) {
    if (!['ADMIN', 'PHARMACIST'].includes(user.role)) throw new AppError(403, 'Only pharmacy staff can arrange dispatch.');
    if (['DISPATCH', 'UPDATE_TRACKING'].includes(input.action) && (!input.courierService?.trim() || !input.trackingReference?.trim())) throw new AppError(400, 'Courier service and tracking number are required.');
    return serializable(async tx => {
      const delivery = await tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include: { paymentRequest: true, feePaymentRequest: true } });
      if (!delivery) throw new AppError(404, 'Delivery request not found.');
      const bill = delivery.paymentRequest;
      if (input.action === 'CANCEL') {
        if (!['REQUESTED', 'AWAITING_FEE'].includes(delivery.status)) throw new AppError(409, 'Only an undispatched delivery can be cancelled.');
        if (delivery.feePaymentRequest && delivery.feePaymentRequest.status !== 'CANCELLED') await paymentRequestService.cancel(delivery.feePaymentRequest.id, 'Home delivery cancelled; collect medicines at the pharmacy.', user, tx);
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'CANCELLED' } });
      } else if (input.action === 'CONFIRM') {
        if (delivery.status !== 'REQUESTED' || bill.status !== 'PAID' || bill.customerCancellationReason || Number(bill.amountPaid) - Number(bill.refundedAmount) < Number(bill.total)) throw new AppError(409, 'Refresh: this delivery is no longer awaiting confirmation or medicines are not fully paid.');
        const setting = await tx.systemSetting.findUnique({ where: { key: 'standardDeliveryFee' } });
        const fee = Number(setting?.value);
        if (!setting || !Number.isFinite(fee) || fee <= 0 || fee > 1000000) throw new AppError(409, 'Ask the administrator to configure a standard delivery fee first.');
        const feeBill = await tx.paymentRequest.create({ data: {
          type: 'RETAIL', requestNumber: `DEL-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
          patientId: bill.patientId, pharmacistId: user.id, subtotal: fee, total: fee,
          pharmacyNote: `Home delivery service for ${bill.requestNumber}. Pay before dispatch. This invoice contains no medicines.`,
        } });
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { feePaymentRequestId: feeBill.id, status: 'AWAITING_FEE' } });
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
        if (delivery.status !== 'DISPATCHED') throw new AppError(409, 'Tracking can only be updated for dispatched deliveries.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { trackingReference: input.trackingReference, courierService: input.courierService } });
      } else {
        if (delivery.status !== 'DISPATCHED') throw new AppError(409, 'Only a dispatched delivery can be marked delivered.');
        await tx.deliveryRequest.update({ where: { id: delivery.id }, data: { status: 'DELIVERED', deliveredAt: new Date() } });
      }
      await tx.paymentRequestEvent.create({ data: { paymentRequestId: id, revision: bill.revision, actorId: user.id, kind: `DELIVERY_${input.action}`, details: { trackingReference: input.trackingReference || null, courierService: input.courierService || null, previousTrackingReference: delivery.trackingReference || null, previousCourierService: delivery.courierService || null } } });
      return tx.deliveryRequest.findUnique({ where: { paymentRequestId: id }, include });
    });
  },
};
