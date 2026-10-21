import crypto from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

const TTL = 90_000;
const conflict = () => new AppError(409, 'This request is currently being edited or processed by another user or window. Close this form and refresh before trying again.', { code: 'WORKFLOW_BUSY' });
const missing = () => new AppError(404, 'Request not found.');
const authorize = (patientId, user) => {
  if (user.role === 'PATIENT' && patientId !== user.id) throw new AppError(403, 'This request does not belong to you.');
  if (!['PATIENT', 'ADMIN', 'PHARMACIST', 'CASHIER'].includes(user.role)) throw new AppError(403, 'Access denied.');
};

export const workflowLeaseService = {
  async resource(kind, id, user) {
    id = Number(id);
    if (!Number.isSafeInteger(id) || id <= 0) throw missing();
    if (kind === 'upload') {
      const record = await prisma.prescriptionUpload.findUnique({ where: { id }, select: { patientId: true } });
      if (!record) throw missing(); authorize(record.patientId, user);
      return `upload:${id}`;
    }
    if (kind === 'prescription') {
      const record = await prisma.prescription.findUnique({ where: { id }, select: { sourceUploadId: true, patient: { select: { userId: true } } } });
      if (!record) throw missing(); authorize(record.patient.userId, user);
      return record.sourceUploadId ? `upload:${record.sourceUploadId}` : `prescription:${id}`;
    }
    if (kind === 'payment') {
      const record = await prisma.paymentRequest.findUnique({ where: { id }, select: { prescriptionId: true, patientId: true } });
      if (!record) throw missing(); authorize(record.patientId, user);
      return record.prescriptionId ? this.resource('prescription', record.prescriptionId, user) : `payment:${id}`;
    }
    if (kind === 'sale') {
      const record = await prisma.sale.findUnique({ where: { id }, select: { paymentRequestId: true, patientId: true, dispensing: { select: { prescriptionId: true } } } });
      if (!record) throw missing(); authorize(record.patientId, user);
      return record.paymentRequestId ? this.resource('payment', record.paymentRequestId, user)
        : record.dispensing ? this.resource('prescription', record.dispensing.prescriptionId, user) : `sale:${id}`;
    }
    throw missing();
  },
  owner(req) {
    const clientId = req.get('X-Workflow-Client');
    if (!clientId || !/^[a-f0-9-]{36}$/i.test(clientId) || !req.authSession?.id) throw new AppError(400, 'Refresh the page before processing this request.');
    return { userId: req.user.id, sessionId: req.authSession.id, clientId };
  },
  async acquire(resourceKey, owner, expectedToken = null) {
    const now = new Date(), expiresAt = new Date(now.getTime() + TTL);
    if (expectedToken) {
      const renewed = await prisma.workflowLease.updateMany({ where: { resourceKey, ...owner, token: expectedToken, expiresAt: { gt: now } }, data: { expiresAt } });
      if (!renewed.count) throw conflict();
      return { resourceKey, token: expectedToken, expiresAt };
    }
    const token = crypto.randomUUID();
    // Unique key and compare-and-swap prevent competing claims across servers.
    try {
      await prisma.workflowLease.create({ data: { resourceKey, ...owner, token, expiresAt } });
      return { resourceKey, token, expiresAt };
    } catch (error) { if (error.code !== 'P2002') throw error; }
    const claimed = await prisma.workflowLease.updateMany({ where: { resourceKey, expiresAt: { lte: now } },
      data: { ...owner, token, expiresAt, processing: false } });
    if (!claimed.count) throw conflict();
    return { resourceKey, token, expiresAt };
  },
  async release(resourceKey, owner, token) {
    await prisma.workflowLease.deleteMany({ where: { resourceKey, ...owner, token, processing: false } });
  },
  async begin(resourceKey, owner, token) {
    const transient = !token;
    const lease = token ? { resourceKey, token } : await this.acquire(resourceKey, owner);
    const claimed = await prisma.workflowLease.updateMany({ where: { resourceKey, ...owner, token: lease.token, processing: false, expiresAt: { gt: new Date() } },
      data: { processing: true, expiresAt: new Date(Date.now() + TTL) } });
    if (!claimed.count) {
      const current = await prisma.workflowLease.findUnique({ where: { resourceKey } });
      if (current?.token === lease.token && current.userId === owner.userId && current.sessionId === owner.sessionId && current.clientId === owner.clientId && current.processing && current.expiresAt > new Date()) {
        throw new AppError(409, 'Your previous operation is still finishing. Wait for it to complete, then try again.', { code: 'WORKFLOW_OPERATION_PENDING' });
      }
      throw conflict();
    }
    return { ...lease, transient };
  },
  async finish(lease, owner) {
    if (lease.transient) await prisma.workflowLease.deleteMany({ where: { resourceKey: lease.resourceKey, ...owner, token: lease.token } });
    else await prisma.workflowLease.updateMany({ where: { resourceKey: lease.resourceKey, ...owner, token: lease.token }, data: { processing: false, expiresAt: new Date(Date.now() + TTL) } });
  },
};

export function requestResource(req) {
  // Express accepts trailing slashes, case variations and encoded route params.
  // Normalize the same forms so a URL spelling cannot bypass the workflow lock.
  const path = decodeURIComponent(req.originalUrl.split('?')[0]).replace(/\/+$/, '').toLowerCase();
  const match = path.match(/^\/api\/(prescription-uploads|prescriptions|payment-requests|sales)\/(\d+)(?:\/|$)/);
  if (match) return { kind: ({ 'prescription-uploads': 'upload', prescriptions: 'prescription', 'payment-requests': 'payment', sales: 'sale' })[match[1]], id: Number(match[2]) };
  if (path === '/api/prescriptions' && req.body?.sourceUploadId) return { kind: 'upload', id: Number(req.body.sourceUploadId) };
  return null;
}
