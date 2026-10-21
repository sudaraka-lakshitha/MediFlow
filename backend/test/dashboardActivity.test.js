import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dashboardController } from '../src/controllers/dashboard.controller.js';

const { db } = vi.hoisted(() => ({ db: {} }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/config/env.js', () => ({ env: { REPORT_TIMEZONE_OFFSET_MINUTES: 330 } }));
vi.mock('../src/services/audit.service.js', () => ({ buildAuditWhere: () => ({ deletedAt: null }) }));
vi.mock('../src/services/operationSettings.service.js', () => ({ operationSettingsService: { get: async () => ({ nearExpiryDays: 90 }) } }));
vi.mock('../src/services/reconciliation.service.js', () => ({ reconciliationService: { summary: async () => ({ entries: [], totals: { CASH: { net: 0 } }, warnings: [] }) } }));
vi.mock('../src/services/reportEvents.js', () => ({ reportEvents: async () => [], eventSummary: () => ({ netRevenue: 0 }) }));

const actions = [
  { id: 1, userId: 1, action: 'STAFF_RECORDS_VIEWED', success: true, deletedAt: null },
  { id: 2, userId: 2, action: 'PRESCRIPTION_VERIFIED', success: true, deletedAt: null },
  { id: 3, userId: 3, action: 'PAYMENT_RECEIVED', success: true, deletedAt: null },
  { id: 4, userId: 2, action: 'REQUEST_FAILED', success: false, deletedAt: null },
  { id: 5, userId: 2, action: 'LOGIN', success: true, deletedAt: new Date() },
];

beforeEach(() => {
  for (const model of ['paymentRequest', 'prescription', 'prescriptionUpload', 'sale', 'dispensing', 'inventoryBatch', 'user', 'product']) {
    db[model] = { count: vi.fn(async () => 0), findMany: vi.fn(async () => []), groupBy: vi.fn(async () => []) };
  }
  db.patientProfile = { findUnique: vi.fn(async () => ({ id: 10 })) };
  db.discountApplication = { aggregate: vi.fn(async () => ({ _sum: { amount: 0 }, _count: { _all: true } })) };
  db.auditLog = { findMany: vi.fn(async ({ where }) => actions.filter(row =>
    (where.userId === undefined || row.userId === where.userId) && row.success === where.success && row.deletedAt === where.deletedAt
  )) };
});

async function dashboard(user, query = {}) {
  const res = { json: vi.fn() };
  await dashboardController.summary({ user, query }, res);
  return res.json.mock.calls[0][0].data;
}

describe('dashboard activity permissions', () => {
  it('includes unprocessed uploads without double-counting linked prescriptions', async () => {
    db.prescriptionUpload.count.mockResolvedValue(3);
    const data = await dashboard({ id: 1, role: 'ADMIN' });
    expect(data.prescriptionStatuses).toContainEqual({ status: 'UPLOADS_AWAITING_REVIEW', count: 3 });
    expect(db.prescriptionUpload.count).toHaveBeenCalledWith({ where: { status: 'PENDING', prescription: { is: null }, attachmentRemovedAt: null } });
  });
  it('allows administrators to see successful active actions across staff', async () => {
    const data = await dashboard({ id: 1, role: 'ADMIN' });
    expect(data.recentActions.map(row => row.id)).toEqual([1, 2, 3]);
    expect(db.auditLog.findMany.mock.calls[0][0].where.userId).toBeUndefined();
  });

  it.each([
    { id: 2, role: 'PHARMACIST' },
    { id: 3, role: 'CASHIER' },
    { id: 2, role: 'PHARMACIST', cashierAccess: true, pharmacyReconciliationAccess: true },
    { id: 3, role: 'CASHIER', pharmacyReconciliationAccess: true },
  ])('restricts $role activity to the authenticated staff member', async user => {
    const data = await dashboard(user, { userId: 1, role: 'ADMIN' });
    expect(data.recentActions.map(row => row.userId)).toEqual([user.id]);
    expect(db.auditLog.findMany.mock.calls[0][0].where.userId).toBe(user.id);
  });

  it('never queries or returns staff audit activity for patients', async () => {
    const data = await dashboard({ id: 4, role: 'PATIENT' }, { role: 'ADMIN' });
    expect(db.auditLog.findMany).not.toHaveBeenCalled();
    expect(data).not.toHaveProperty('recentActions');
  });

  it('requests only the display fields, excluding audit details and network metadata', async () => {
    await dashboard({ id: 2, role: 'PHARMACIST' });
    const query = db.auditLog.findMany.mock.calls[0][0];
    expect(Object.keys(query.select).sort()).toEqual(['action', 'createdAt', 'id', 'success', 'user']);
    expect(query.select.user).toEqual({ select: { fullName: true } });
    expect(query).not.toHaveProperty('include');
    expect(query.take).toBe(8);
  });
});
