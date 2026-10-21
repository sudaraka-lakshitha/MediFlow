import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: {
  workflowLease: { create: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn(), findUnique: vi.fn() },
  prescriptionUpload: { findUnique: vi.fn() }, prescription: { findUnique: vi.fn() },
  paymentRequest: { findUnique: vi.fn() }, sale: { findUnique: vi.fn() },
} }));
import { prisma } from '../src/config/prisma.js';
import { workflowLeaseService as leases, requestResource } from '../src/services/workflowLease.service.js';
let records;
const matches = (record, where) => Object.entries(where).every(([key, value]) => {
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    if (value.gt) return record[key] > value.gt;
    if (value.lte) return record[key] <= value.lte;
  }
  return record[key] === value;
});
const staff = { userId: 1, sessionId: 'staff-session', clientId: 'staff-tab' };
const patient = { userId: 2, sessionId: 'patient-session', clientId: 'patient-tab' };
beforeEach(() => {
  vi.clearAllMocks(); records = new Map();
  prisma.workflowLease.findUnique.mockImplementation(async ({ where }) => records.get(where.resourceKey) || null);
  prisma.workflowLease.create.mockImplementation(async ({ data }) => {
    if (records.has(data.resourceKey)) throw Object.assign(new Error('duplicate'), { code: 'P2002' });
    records.set(data.resourceKey, { processing: false, ...data }); return data;
  });
  prisma.workflowLease.updateMany.mockImplementation(async ({ where, data }) => {
    const record = records.get(where.resourceKey);
    if (!record || !matches(record, where)) return { count: 0 };
    Object.assign(record, data); return { count: 1 };
  });
  prisma.workflowLease.deleteMany.mockImplementation(async ({ where }) => {
    const record = records.get(where.resourceKey);
    if (!record || !matches(record, where)) return { count: 0 };
    records.delete(where.resourceKey); return { count: 1 };
  });
});
it('allows exactly one simultaneous staff claim', async () => {
  const results = await Promise.allSettled([leases.acquire('upload:1', staff), leases.acquire('upload:1', { ...staff, userId: 3, sessionId: 'other' })]);
  expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
  expect(results.find(result => result.status === 'rejected').reason.statusCode).toBe(409);
});
it('blocks staff while the patient edits and blocks the patient while staff process', async () => {
  const patientLease = await leases.acquire('upload:1', patient);
  await expect(leases.begin('upload:1', staff)).rejects.toMatchObject({ statusCode: 409 });
  await leases.release('upload:1', patient, patientLease.token);
  const staffLease = await leases.begin('upload:1', staff);
  await expect(leases.acquire('upload:1', patient)).rejects.toMatchObject({ statusCode: 409 });
  await leases.finish(staffLease, staff);
  await expect(leases.acquire('upload:1', patient)).resolves.toHaveProperty('token');
});
it('blocks a second tab even when it belongs to the same staff member', async () => {
  await leases.acquire('payment:1', staff);
  await expect(leases.acquire('payment:1', { ...staff, clientId: 'another-tab' })).rejects.toMatchObject({ statusCode: 409 });
});
it('admits only one mutating request per editor at a time', async () => {
  const editor = await leases.acquire('payment:1', staff);
  const results = await Promise.allSettled([leases.begin('payment:1', staff, editor.token), leases.begin('payment:1', staff, editor.token)]);
  expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
  const running = results.find(result => result.status === 'fulfilled').value;
  await leases.finish(running, staff);
  await expect(leases.begin('payment:1', staff, editor.token)).resolves.toHaveProperty('token', editor.token);
});
it('cannot release a running operation or another user’s lease', async () => {
  const editor = await leases.acquire('upload:1', staff);
  await leases.begin('upload:1', staff, editor.token);
  await leases.release('upload:1', staff, editor.token);
  await leases.release('upload:1', patient, editor.token);
  expect(records.has('upload:1')).toBe(true);
});
it('expires abandoned leases without allowing the old owner to overwrite the replacement', async () => {
  const old = await leases.acquire('upload:1', staff);
  records.get('upload:1').expiresAt = new Date(0);
  const fresh = await leases.acquire('upload:1', patient);
  await expect(leases.begin('upload:1', staff, old.token)).rejects.toMatchObject({ statusCode: 409 });
  await expect(leases.acquire('upload:1', staff, old.token)).rejects.toMatchObject({ statusCode: 409 });
  await leases.release('upload:1', staff, old.token);
  expect(records.get('upload:1').token).toBe(fresh.token);
});
it('uses the same lock for a linked upload, prescription, payment and sale', async () => {
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 2 });
  prisma.prescription.findUnique.mockResolvedValue({ sourceUploadId: 1, patient: { userId: 2 } });
  prisma.paymentRequest.findUnique.mockResolvedValue({ prescriptionId: 20, patientId: 2 });
  prisma.sale.findUnique.mockResolvedValue({ paymentRequestId: 30, patientId: 2 });
  const user = { id: 2, role: 'PATIENT' };
  for (const [kind, id] of [['upload', 1], ['prescription', 20], ['payment', 30], ['sale', 40]]) {
    expect(await leases.resource(kind, id, user)).toBe('upload:1');
  }
  await expect(leases.resource('upload', 1, { id: 3, role: 'PATIENT' })).rejects.toMatchObject({ statusCode: 403 });
});
it('protects processing an upload into a new prescription and existing request actions', () => {
  expect(requestResource({ originalUrl: '/api/prescriptions', body: { sourceUploadId: 1 } })).toEqual({ kind: 'upload', id: 1 });
  expect(requestResource({ originalUrl: '/api/payment-requests/30/slips/5/review' })).toEqual({ kind: 'payment', id: 30 });
  expect(requestResource({ originalUrl: '/api/PRESCRIPTIONS/', body: { sourceUploadId: 1 } })).toEqual({ kind: 'upload', id: 1 });
  expect(requestResource({ originalUrl: '/api/payment-requests/%33%30/pay/' })).toEqual({ kind: 'payment', id: 30 });
});
