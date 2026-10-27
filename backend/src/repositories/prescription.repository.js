import { prisma } from '../config/prisma.js';
import { historySearch } from '../utils/historySearch.js';
import { prescriptionSupplySummary } from '../utils/prescriptionSupplySummary.js';

const include = {
  originalPrescription: { select: { refillsAllowed: true, refillsUsed: true } },
  patient: { include: { user: { select: { id: true, fullName: true, email: true } } } },
  items: { include: { product: true } },
  retailItems: { include: { product: true } },
  createdBy: { select: { id: true, fullName: true, role: true } },
  verifiedBy: { select: { id: true, fullName: true, role: true } },
  dispensings: { include: { sale: true, pharmacist: { select: { id:true, fullName:true, email:true, role:true } }, items:{ include:{ prescriptionItem:{ include:{ product:true } } } } }, orderBy: { dispensedAt: 'desc' } },
  sourceUpload: { select: { id: true, originalName: true, mimeType: true, status: true } },
  paymentRequest: { include: { events: { select: { details: true }, orderBy: { createdAt: 'asc' } }, cashier: { select: { id: true, fullName: true } }, items: { include: { product: true } }, sale: { select: { id: true, invoiceNumber: true } } } },
};

export const prescriptionRepository = {
  list: async (where = {}, { page = 1, pageSize = 300, search, status } = {}) => (await prisma.prescription.findMany({ where: { ...where, ...(status ? { status } : {}), ...historySearch(search, ['prescriptionNumber', 'patient.user.fullName', 'recipientName', 'prescriberName']) }, include, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize })).map(withRefillAllowance),
  findById: async (id, db = prisma) => withRefillAllowance(await db.prescription.findUnique({ where: { id }, include })),
};

const withRefillAllowance = (record) => {
  if (!record) return record;
  const { events, ...bill } = record.paymentRequest || {};
  return { ...record,
    ...(record.originalPrescription ? { refillsAllowed: record.originalPrescription.refillsAllowed, refillsUsed: record.originalPrescription.refillsUsed } : {}),
    paymentRequest: record.paymentRequest ? bill : null,
    items: record.items.map(item => ({ ...item, ...prescriptionSupplySummary(item, events) })),
  };
};
