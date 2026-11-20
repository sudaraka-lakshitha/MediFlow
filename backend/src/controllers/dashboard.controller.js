// DASHBOARD
// Works out the numbers and charts on the dashboard (today's sales, prescriptions by status, stock warnings,
// recent activity). Unlike most features, the queries are written directly in this file, not in a service.
// "Today" and "this month" use Sri Lanka days (see REPORT_TIMEZONE_OFFSET_MINUTES).

import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { operationSettingsService } from '../services/operationSettings.service.js';
import { buildAuditWhere } from '../services/audit.service.js';
import { localMonthStart } from '../utils/localDate.js';
import { reconciliationService } from '../services/reconciliation.service.js';
import { reportEvents, eventSummary } from '../services/reportEvents.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;
const localKey = (date) => new Date(date.getTime() + offsetMs).toISOString().slice(0, 10);
const localStart = (daysAgo = 0) => {
  const local = new Date(Date.now() + offsetMs); const date = local.toISOString().slice(0, 10);
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day - daysAgo) - offsetMs);
};
const localWeekStart = (date = new Date()) => {
  const local = new Date(date.getTime() + offsetMs);
  const weekday = local.getUTCDay();
  const daysSinceMonday = (weekday + 6) % 7;
  return localStart(daysSinceMonday);
};

const recentActivity = (user) => prisma.auditLog.findMany({
  where: {
    ...buildAuditWhere(),
    success: true,
    ...(user.role === 'ADMIN' ? {} : { userId: user.id }),
  },
  select: { id: true, action: true, createdAt: true, success: true, user: { select: { fullName: true } } },
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  take: 8,
});

export const dashboardController = {
  prescriptionWorkflow: async (req, res) => {
    const period = req.validatedQuery?.period || 'WEEK';
    const now = new Date();
    const start = period === 'DAY'
      ? localStart()
      : period === 'WEEK'
        ? localWeekStart(now)
        : period === 'MONTH'
          ? localMonthStart(now)
          : undefined;
    const createdAt = start ? { gte: start, lte: now } : undefined;
    const [prescriptions, uploadsAwaitingReview] = await Promise.all([
      prisma.prescription.groupBy({
        by: ['status'],
        where: createdAt ? { createdAt } : undefined,
        _count: { _all: true },
      }),
      prisma.prescriptionUpload.count({
        where: {
          status: 'PENDING',
          prescription: { is: null },
          attachmentRemovedAt: null,
          ...(createdAt ? { createdAt } : {}),
        },
      }),
    ]);
    const statusOrder = ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'REJECTED', 'CANCELLED'];
    const prescriptionStatuses = [
      ...(uploadsAwaitingReview ? [{ status: 'UPLOADS_AWAITING_REVIEW', count: uploadsAwaitingReview }] : []),
      ...prescriptions
        .map((entry) => ({ status: entry.status, count: entry._count._all }))
        .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)),
    ];
    res.json({ data: { period, prescriptionStatuses } });
  },

  summary: async (req, res) => {
    if (req.user.role === 'CASHIER') {
      const [awaitingPayment, ledger, recentRequests, recentActions] = await Promise.all([
        prisma.paymentRequest.count({ where: { status: 'AWAITING_PAYMENT' } }),
        reconciliationService.summary(localKey(new Date()), req.user),
        prisma.paymentRequest.findMany({ include: { patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' }, take: 8 }),
        recentActivity(req.user),
      ]);
      return res.json({ data: { cashier: true, awaitingPayment, paidToday: new Set(ledger.entries.filter(entry => entry.direction === 'IN').map(entry => entry.id.replace(/-(cash|other)$/, ''))).size, amountToday: Number(Object.values(ledger.totals).reduce((sum, value) => sum + value.net, 0).toFixed(2)), paymentTotals: ledger.totals, reconciliationWarnings: ledger.warnings, recentRequests, recentActions } });
    }
    if (req.user.role === 'PATIENT') {
      const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } });
      const [activePrescriptions, completedPrescriptions, invoices, recentPrescriptions, recentInvoices] = await Promise.all([
        prisma.prescription.count({ where: { patientId: profile?.id || -1, status: { in: ['PENDING', 'VERIFIED', 'PARTIALLY_DISPENSED'] } } }),
        prisma.prescription.count({ where: { patientId: profile?.id || -1, status: 'DISPENSED' } }),
        prisma.sale.count({ where: { patientId: req.user.id } }),
        prisma.prescription.findMany({ where: { patientId: profile?.id || -1 }, select: { id: true, prescriptionNumber: true, prescriptionDate: true, status: true, prescriberTitle: true, prescriberName: true }, orderBy: { prescriptionDate: 'desc' }, take: 5 }),
        prisma.sale.findMany({ where: { patientId: req.user.id }, select: { id: true, invoiceNumber: true, total: true, amountPaid: true, status: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
      ]);
      return res.json({ data: { activePrescriptions, completedPrescriptions, invoices, recentPrescriptions, recentInvoices } });
    }

    const today = localStart(); const sevenDays = localStart(6); const monthStart = localMonthStart();
    const [ledger, revenueEvents] = await Promise.all([
      reconciliationService.summary(localKey(new Date()), req.user, prisma, true),
      reportEvents({ start: sevenDays, end: new Date(today.getTime() + 86400000) }),
    ]);
    const operationSettings = await operationSettingsService.get();
    const near = new Date(); near.setDate(near.getDate() + operationSettings.nearExpiryDays);
    const [pendingPrescriptions, dispensedToday, expiredBatches, nearExpiryBatches, activeUsers, dispensingWeek, recentActions, recentPrescriptions, recentSales, products, discountMonth] = await Promise.all([
      prisma.prescription.count({ where: { status: 'PENDING' } }),
      prisma.dispensing.count({ where: { dispensedAt: { gte: today } } }),
      prisma.inventoryBatch.count({ where: { expiryDate: { lt: new Date() }, quantityAvailable: { gt: 0 } } }),
      prisma.inventoryBatch.count({ where: { expiryDate: { gte: new Date(), lte: near }, quantityAvailable: { gt: 0 } } }),
      req.user.role === 'ADMIN' ? prisma.user.count({ where: { active: true } }) : Promise.resolve(undefined),
      prisma.dispensing.findMany({ where: { dispensedAt: { gte: sevenDays } }, select: { dispensedAt: true } }),
      recentActivity(req.user),
      prisma.prescription.findMany({ include: { patient: { include: { user: { select: { fullName: true } } } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.sale.findMany({ include: { patient: { select: { fullName: true } }, pharmacist: { select: { fullName: true } }, discountApplications: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.product.findMany({ where: { active: true }, include: { batches: { where: { quantityAvailable: { gt: 0 }, expiryDate: { gte: new Date() }, restricted: false }, select: { quantityAvailable: true, quantityReserved: true } } } }),
      prisma.discountApplication.aggregate({ where: { createdAt: { gte: monthStart } }, _sum: { amount: true }, _count: { _all: true } }),
    ]);

    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(sevenDays); date.setUTCDate(date.getUTCDate() + index); return localKey(date); });
    const salesMap = Object.fromEntries(days.map((day) => [day, 0])); const issueMap = Object.fromEntries(days.map((day) => [day, 0]));
    revenueEvents.forEach((entry) => { const key = localKey(entry.date); salesMap[key] = (salesMap[key] || 0) + entry.financials.netRevenue; });
    dispensingWeek.forEach((issue) => { const key = localKey(issue.dispensedAt); issueMap[key] = (issueMap[key] || 0) + 1; });
    const lowStock = products.map((product) => ({ id: product.id, name: `${product.genericName} ${product.strength}`, stock: product.batches.reduce((sum, batch) => sum + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0), 0), reorderLevel: product.reorderLevel })).filter((product) => product.stock <= product.reorderLevel).sort((a, b) => (a.stock / Math.max(1, a.reorderLevel)) - (b.stock / Math.max(1, b.reorderLevel))).slice(0, 6);

    res.json({ data: {
      pendingPrescriptions, dispensedToday, salesToday: eventSummary(revenueEvents.filter(entry => entry.date >= today)).netRevenue,
      cashCollectedToday: ledger.totals.CASH.net,
      paymentTotals: ledger.totals, reconciliationWarnings: ledger.warnings,
      expiredBatches, nearExpiryBatches, activeUsers,
      operationSettings,
      salesSeries: days.map((date) => ({ date, sales: salesMap[date], dispensings: issueMap[date] })),
      discountMonth: { amount: Number(discountMonth._sum.amount || 0), applications: discountMonth._count._all },
      lowStock, recentActions, recentPrescriptions, recentSales,
    } });
  },
};
