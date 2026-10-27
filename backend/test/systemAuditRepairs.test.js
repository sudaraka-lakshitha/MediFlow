import { beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
const db = vi.hoisted(() => ({ $transaction: vi.fn(), patientProfile: { findUnique: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() }, user: { update: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/config/logger.js', () => ({ logger: { warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock('../src/services/audit.service.js', () => ({ recordAudit: vi.fn() }));
import { patientService } from '../src/services/patient.service.js';
import { patientRefund } from '../src/utils/patientRefund.js';
import { recordOperation, protectRetryController } from '../src/utils/operationContext.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { updatePatientSchema, updateOwnProfileSchema } from '../src/validators/patient.validator.js';
import { moneySchema } from '../src/validators/money.js';
import { calendarDate, calendarMonth, reportRange } from '../src/validators/calendar.js';
import { itemFinancials, combineFinancials, saleFinancials } from '../src/utils/reportFinancials.js';
import { operationAttempt, finishOperation } from '../../frontend/src/utils/operationAttempt.ts';

beforeEach(() => {
  vi.clearAllMocks(); db.$transaction.mockImplementation(operation => operation(db));
  const storage = new Map();
  vi.stubGlobal('sessionStorage', { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) });
});
describe('retry protection', () => {
  it('replays a committed operation without executing effects again', async () => {
    let receipt;
    const tx = { operationReceipt: {
      findUnique: vi.fn(async () => receipt),
      create: vi.fn(async ({ data }) => { receipt = data; }),
      update: vi.fn(async ({ data }) => { receipt = { ...receipt, ...data }; }),
    } };
    const context = { actorId: 1, key: randomUUID(), hash: 'a' };
    const operation = vi.fn(async () => ({ id: 42, amount: 10 }));
    expect(await recordOperation(tx, context, operation)).toEqual({ id: 42, amount: 10 });
    expect(await recordOperation(tx, context, operation)).toEqual({ id: 42, amount: 10 });
    expect(operation).toHaveBeenCalledTimes(1);
    await expect(recordOperation(tx, { ...context, hash: 'b' }, operation)).rejects.toMatchObject({ statusCode: 409 });
  });
  it('requires a UUID retry key for unsafe operations, but not reads', async () => {
    const action = vi.fn(); const controller = protectRetryController({ action });
    await expect(controller.action({ method: 'POST', originalUrl: '/api/sales/1/pay', get: () => undefined })).rejects.toMatchObject({ statusCode: 400 });
    await controller.action({ method: 'GET', originalUrl: '/api/sales' });
    expect(action).toHaveBeenCalledTimes(1);
  });
  it('keeps the same key after a lost response and isolates users and payloads', async () => {
    const a = await operationAttempt(91, '/sales/1/pay', { amount: 10 });
    expect(await operationAttempt(91, '/sales/1/pay', { amount: 10 })).toEqual(a);
    expect((await operationAttempt(92, '/sales/1/pay', { amount: 10 })).key).not.toBe(a.key);
    expect((await operationAttempt(91, '/sales/1/pay', { amount: 20 })).key).not.toBe(a.key);
    finishOperation(a.storageKey);
    expect((await operationAttempt(91, '/sales/1/pay', { amount: 10 })).key).not.toBe(a.key);
  });
});
describe('patient data safety', () => {
  it('preserves omitted fields but permits explicitly clearing optional details', async () => {
    db.patientProfile.findUniqueOrThrow.mockResolvedValue({ userId: 12 });
    await patientService.update(1, { fullName: 'Test Patient' });
    expect(db.user.update.mock.calls[0][0].data.phone).toBeUndefined();
    expect(db.patientProfile.update.mock.calls[0][0].data.chronicConditions).toBeUndefined();
    await patientService.update(1, { phone: '', chronicConditions: null });
    expect(db.user.update.mock.calls[1][0].data.phone).toBeNull();
    expect(db.patientProfile.update.mock.calls[1][0].data.chronicConditions).toBeNull();
  });
  it('health record applies the same release rules as prescriptions', async () => {
    db.patientProfile.findUnique.mockResolvedValue({ id: 1 });
    const prescription = { id: 2, status: 'DRAFT', notes: 'internal', items: [{ dosageInstructions: 'Unverified', quantityPerDose: 3, notes: 'internal' }] };
    db.patientProfile.findUniqueOrThrow.mockResolvedValue({ prescriptions: [prescription] });
    let result = await patientService.healthRecordForUser(12);
    expect(result.prescriptions[0].items[0].dosageInstructions).toBeNull();
    expect(result.prescriptions[0].notes).toBeUndefined();
    prescription.paymentRequest = { status: 'PAID' };
    result = await patientService.healthRecordForUser(12);
    expect(result.prescriptions[0].items[0].dosageInstructions).toBe('Unverified');
  });
  it('refund responses omit internal evidence, staff identifiers and stock notes', () => {
    expect(patientRefund({ id: 1, amount: 2, reason: 'Returned', evidenceReference: 'internal', approvedById: 55, lines: [{ id: 1, quantity: 2, stockNotes: 'internal', reviewedById: 55 }] })).toEqual({ id: 1, amount: 2, reason: 'Returned', sale: null, paymentRequest: null, lines: [{ id: 1, quantity: 2 }] });
  });
  it('does not disclose database messages in unexpected errors', () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    errorHandler(new Error('prisma user password_hash column'), { method: 'GET', requestId: 'ref-1' }, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].message).not.toMatch(/prisma|password_hash/);
    expect(res.json.mock.calls[0][0].requestId).toBe('ref-1');
  });
});
describe('validation and rounding', () => {
  it.each(['0701234567', '+94701234567'])('accepts and normalizes phone %s on staff and patient forms', phone => {
    expect(updatePatientSchema.parse({ fullName: 'Test Patient', phone, expectedUpdatedAt: '2026-10-26T00:00:00.000Z' }).phone).toBe('0701234567');
    expect(updateOwnProfileSchema.parse({ phone, expectedUpdatedAt: '2026-10-26T00:00:00.000Z' }).phone).toBe('0701234567');
  });
  it.each([0.001, -1, Infinity, 10000000000])('rejects unrepresentable price %s', price => expect(moneySchema.safeParse(price).success).toBe(false));
  it('accepts valid prices and rejects impossible dates and reversed ranges', () => {
    expect(moneySchema.parse(9999999999.99)).toBe(9999999999.99);
    expect(calendarDate.safeParse('2026-02-30').success).toBe(false);
    expect(calendarMonth.safeParse('2026-13').success).toBe(false);
    expect(reportRange.safeParse({ from: '2026-03-01', to: '2026-02-28' }).success).toBe(false);
  });
  it('allocates cents exactly and deterministically across invoice lines', () => {
    const sale = { subtotal: 3, discount: 1, containerFee: 0.01, tax: 0.02, items: [1, 2, 3].map(id => ({ id, lineTotal: 1, quantity: 1, unitCost: 0 })) };
    const sum = combineFinancials(sale.items.map(item => itemFinancials(item, sale)));
    expect(sum).toEqual(saleFinancials(sale));
    const reversed = { ...sale, items: [...sale.items].reverse() };
    expect(itemFinancials(sale.items[0], sale)).toEqual(itemFinancials(sale.items[0], reversed));
  });
});
