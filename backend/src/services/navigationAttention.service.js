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
      const [prescriptions, uploads, sales] = await Promise.all([
        prisma.prescription.count({
          where: {
            patientId: profile?.id || -1,
            status: { in: ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'] },
          },
        }),
        prisma.prescriptionUpload.count({
          where: { patientId: user.id, status: 'PENDING' },
        }),
        prisma.sale.count({
          where: { patientId: user.id, status: 'PENDING' },
        }),
      ]);
      return {
        prescriptions: badge(prescriptions, 'Active prescriptions', 'info'),
        prescriptionUploads: badge(uploads, 'Uploads awaiting pharmacy review', 'warning'),
        sales: badge(sales, 'Invoices with a remaining balance', 'danger'),
      };
    }

    if (user.role === 'CASHIER') {
      const awaitingPayment = await prisma.paymentRequest.count({
        where: { status: 'AWAITING_PAYMENT' },
      });
      return {
        cashier: badge(awaitingPayment, 'Payments awaiting cashier action', 'danger'),
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
      expiredBatches,
      nearExpiryBatches,
      products,
      failedAudits,
    ] = await Promise.all([
      prisma.prescription.count({
        where: {
          status: { in: ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'] },
        },
      }),
      prisma.prescriptionUpload.count({ where: { status: 'PENDING' } }),
      user.role === 'ADMIN' || user.cashierAccess
        ? prisma.paymentRequest.count({ where: { status: 'AWAITING_PAYMENT' } })
        : Promise.resolve(0),
      prisma.sale.count({ where: { status: 'PENDING' } }),
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
        'New uploaded prescriptions awaiting review',
        uploads ? 'danger' : 'neutral',
      ),
      cashier: badge(
        awaitingPayment,
        'Payments awaiting cashier action',
        awaitingPayment ? 'danger' : 'neutral',
      ),
      inventory: badge(
        inventoryAttention,
        `${expiredBatches} expired, ${nearExpiryBatches} near expiry, ${lowStockProducts} low stock`,
        expiredBatches ? 'danger' : inventoryAttention ? 'warning' : 'neutral',
      ),
      sales: badge(
        pendingSales,
        'Invoices with a remaining balance',
        pendingSales ? 'warning' : 'neutral',
      ),
      audit: badge(
        failedAudits,
        'Unread staff or patient errors recorded in the last 24 hours',
        failedAudits ? 'danger' : 'neutral',
      ),
    };
  },
};
