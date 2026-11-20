// Ready-made database queries for loading a prescription with its details.

import { prisma } from '../config/prisma.js';
import { historySearch } from '../utils/historySearch.js';
import { prescriptionSupplySummary } from '../utils/prescriptionSupplySummary.js';
import { latestPartialDecisions } from '../utils/prescriptionBalance.js';

const include = {
  originalPrescription: { select: { refillsAllowed: true, refillsUsed: true } },
  patient: { include: { user: { select: { id: true, fullName: true, email: true } } } },
  items: { include: { product: true } },
  retailItems: { include: { product: true } },
  createdBy: { select: { id: true, fullName: true, role: true } },
  verifiedBy: { select: { id: true, fullName: true, role: true } },
  dispensings: { include: { sale: true, pharmacist: { select: { id:true, fullName:true, email:true, role:true } }, items:{ include:{ prescriptionItem:{ include:{ product:true } } } } }, orderBy: { dispensedAt: 'desc' } },
  sourceUpload: { select: { id: true, originalName: true, mimeType: true, status: true, prepareRequested: true, deliveryRequested: true } },
  paymentRequest: { include: { events: { select: { kind: true, details: true }, orderBy: { createdAt: 'asc' } }, cashier: { select: { id: true, fullName: true } }, items: { include: { product: true } }, sale: { select: { id: true, invoiceNumber: true } }, delivery: { select: { status: true } } } },
};

export const prescriptionRepository = {
  list: async (where = {}, { page = 1, pageSize = 300, search, status } = {}) => (await prisma.prescription.findMany({ where: { ...where, ...(status ? { status } : {}), ...historySearch(search, ['prescriptionNumber', 'patient.user.fullName', 'recipientName', 'prescriberName']) }, include, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize })).map(withRefillAllowance),
  findById: async (id, db = prisma) => withRefillAllowance(await db.prescription.findUnique({ where: { id }, include })),
};

const withRefillAllowance = (record) => {
  if (!record) return record;
  // Collection-PIN secrets never leave the server, not even to staff.
  const { events, pickupPinHash, pickupPinEncrypted, ...bill } = record.paymentRequest || {};
  return { ...record,
    ...(record.originalPrescription ? { refillsAllowed: record.originalPrescription.refillsAllowed, refillsUsed: record.originalPrescription.refillsUsed } : {}),
    // The latest walk-in partial-supply decisions, to reopen an unpaid bill with them.
    paymentRequest: record.paymentRequest ? { ...bill, partialSupply: [...latestPartialDecisions(events).values()] } : null,
    items: record.items.map(item => ({ ...item, ...prescriptionSupplySummary(item, events) })),
  };
};
