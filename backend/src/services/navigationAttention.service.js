// Counts the items that need attention for each menu entry (new uploads, bills to check, deliveries
// to dispatch...).

import { prisma } from '../config/prisma.js';
import { operationSettingsService } from './operationSettings.service.js';
import { lowStockState } from '../utils/lowStock.js';

const badge = (count, label, tone = 'warning') => ({
  count: Number(count || 0),
  label,
  tone,
});

export const navigationAttentionService = {
  async get(user) {
    if (user.role === 'PATIENT') {
      const profile = await prisma.patientProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      const [prescriptions, uploads, quotationsAwaitingDecision, invoicesAwaitingAction, sales, activeDeliveries] = await Promise.all([
        prisma.prescription.count({
          where: {
            patientId: profile?.id || -1,
            status: { in: ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'] },
          },
        }),
        prisma.prescriptionUpload.count({
          where: { patientId: user.id, status: 'PENDING' },
        }),
        prisma.prescriptionUpload.count({
          where: { patientId: user.id, status: 'QUOTE_SENT' },
        }),
        prisma.paymentRequest.count({
          where: { patientId: user.id, status: { in: ['AWAITING_PAYMENT', 'SLIP_SUBMITTED'] } },
        }),
        prisma.sale.count({
          where: { patientId: user.id, status: 'PENDING' },
        }),
        prisma.deliveryRequest.count({
          where: { paymentRequest: { patientId: user.id }, status: { notIn: ['DELIVERED', 'CANCELLED'] } },
        }),
      ]);
      const uploadTotal = uploads + quotationsAwaitingDecision;
      const uploadLabel = quotationsAwaitingDecision
        ? 'Quotation received — your decision is required'
        : 'Uploads awaiting pharmacy review';
      return {
        prescriptions: badge(prescriptions, 'Active prescriptions', 'info'),
        prescriptionUploads: badge(uploadTotal, uploadLabel, quotationsAwaitingDecision ? 'danger' : 'warning'),
        sales: badge(sales + invoicesAwaitingAction, invoicesAwaitingAction ? 'Invoices awaiting payment, including delivery fees' : 'Invoices with a remaining balance', 'danger'),
        deliveries: badge(activeDeliveries, 'Home deliveries in progress', activeDeliveries ? 'warning' : 'neutral'),
      };
    }

    if (user.role === 'CASHIER') {
      const [awaitingPayment, slipsToReview, pendingPayouts, activeDeliveries] = await Promise.all([
        prisma.paymentRequest.count({ where: { status: { in: ['AWAITING_PAYMENT', 'SLIP_SUBMITTED'] } } }),
        prisma.uploadPaymentSlip.count({ where: { status: 'PENDING' } }),
        prisma.refund.count({ where: { status: 'PENDING' } }),
        prisma.deliveryRequest.count({ where: { status: { notIn: ['DELIVERED', 'CANCELLED'] } } }),
      ]);
      return {
        cashier: badge(awaitingPayment + pendingPayouts, `${awaitingPayment} payments, ${pendingPayouts} refund payouts awaiting cashier action`, awaitingPayment + pendingPayouts ? 'danger' : 'neutral'),
        prescriptionUploads: badge(slipsToReview, 'Bank transfer receipts awaiting verification', slipsToReview ? 'warning' : 'neutral'),
        sales: badge(awaitingPayment, 'Invoices awaiting payment, including delivery fees', awaitingPayment ? 'warning' : 'neutral'),
        deliveries: badge(activeDeliveries, 'Home deliveries in progress', activeDeliveries ? 'warning' : 'neutral'),
      };
    }

    const settings = await operationSettingsService.get();
    const now = new Date();
    const nearExpiry = new Date(now);
    nearExpiry.setDate(nearExpiry.getDate() + settings.nearExpiryDays);
    const failedSince = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      prescriptions,
      uploads,
      awaitingPayment,
      pendingSales,
      salesInvoicesAwaitingAction,
      activeDeliveries,
      expiredBatches,
      nearExpiryBatches,
      products,
      failedAudits,
      pendingApprovals,
      pendingPayouts,
    ] = await Promise.all([
      prisma.prescription.count({
        where: {
          status: { in: ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'] },
        },
      }),
      prisma.prescriptionUpload.count({
        where: {
          prescription: null,
          OR: [
            { status: 'PENDING' },
            { status: 'QUOTE_SENT' },
            {
              prepareRequested: true,
              status: {
                in: [
                  'AVAILABLE',
                  'PARTIALLY_AVAILABLE',
                  'QUOTE_ACCEPTED',
                  'PAYMENT_PENDING',
                  'PAYMENT_SUBMITTED',
                  'READY_TO_PREPARE',
                ],
              },
            },
          ],
        },
      }),
      user.role === 'ADMIN' || user.cashierAccess
        ? prisma.paymentRequest.count({ where: { status: { in: ['AWAITING_PAYMENT', 'SLIP_SUBMITTED'] } } })
        : Promise.resolve(0),
      prisma.sale.count({ where: { status: 'PENDING' } }),
      prisma.paymentRequest.count({ where: { status: { in: ['AWAITING_PAYMENT', 'SLIP_SUBMITTED'] } } }),
      prisma.deliveryRequest.count({ where: { status: { notIn: ['DELIVERED', 'CANCELLED'] } } }),
      prisma.inventoryBatch.count({
        where: { expiryDate: { lt: now }, quantityAvailable: { gt: 0 } },
      }),
      prisma.inventoryBatch.count({
        where: {
          expiryDate: { gte: now, lte: nearExpiry },
          quantityAvailable: { gt: 0 },
        },
      }),
      prisma.product.findMany({
        where: { active: true },
        select: {
          reorderLevel: true,
          lowStockAcknowledgement: { select: { stockLevel: true } },
          batches: {
            where: { expiryDate: { gte: now }, quantityAvailable: { gt: 0 }, restricted: false },
            select: { quantityAvailable: true, quantityReserved: true },
          },
        },
      }),
      user.role === 'ADMIN'
        ? prisma.auditLog.count({
            where: {
              success: false,
              readAt: null,
              deletedAt: null,
              createdAt: { gte: failedSince },
            },
          })
        : Promise.resolve(0),
      user.role === 'ADMIN' ? prisma.refundApproval.count({ where: { status: 'PENDING' } }) : Promise.resolve(0),
      user.role === 'ADMIN' || user.cashierAccess ? prisma.refund.count({ where: { status: 'PENDING' } }) : Promise.resolve(0),
    ]);

    const lowStockProducts = products.filter(
      (product) => lowStockState(product).requiresAttention,
    ).length;
    const inventoryAttention =
      expiredBatches + nearExpiryBatches + lowStockProducts;

    return {
      prescriptions: badge(
        prescriptions,
        'Pending, verified, or partially dispensed prescriptions',
        prescriptions ? 'warning' : 'neutral',
      ),
      prescriptionUploads: badge(
        uploads,
        'New uploads or quotations requiring pharmacy action',
        uploads ? 'danger' : 'neutral',
      ),
      cashier: badge(
        awaitingPayment + pendingApprovals + pendingPayouts,
        `${awaitingPayment} payments, ${pendingApprovals} admin approvals, ${pendingPayouts} refund payouts awaiting action`,
        awaitingPayment + pendingApprovals + pendingPayouts ? 'danger' : 'neutral',
      ),
      inventory: badge(
        inventoryAttention,
        `${expiredBatches} expired, ${nearExpiryBatches} near expiry, ${lowStockProducts} low stock`,
        expiredBatches ? 'danger' : inventoryAttention ? 'warning' : 'neutral',
      ),
      sales: badge(
        pendingSales + salesInvoicesAwaitingAction,
        'Invoices awaiting payment or sales requiring completion',
        pendingSales + salesInvoicesAwaitingAction ? 'warning' : 'neutral',
      ),
      deliveries: badge(activeDeliveries, 'Home deliveries in progress', activeDeliveries ? 'warning' : 'neutral'),
      audit: badge(
        failedAudits,
        'Unread staff or patient errors recorded in the last 24 hours',
        failedAudits ? 'danger' : 'neutral',
      ),
    };
  },
};
