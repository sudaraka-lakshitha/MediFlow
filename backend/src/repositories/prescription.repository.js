import { prisma } from '../config/prisma.js';

const include = {
  patient: { include: { user: { select: { id: true, fullName: true, email: true } } } },
  items: { include: { product: true } },
  retailItems: { include: { product: true } },
  createdBy: { select: { id: true, fullName: true, role: true } },
  verifiedBy: { select: { id: true, fullName: true, role: true } },
  dispensings: { include: { sale: true, pharmacist: { select: { id:true, fullName:true, email:true, role:true } }, items:{ include:{ prescriptionItem:{ include:{ product:true } } } } }, orderBy: { dispensedAt: 'desc' } },
  sourceUpload: { select: { id: true, originalName: true, mimeType: true, status: true } },
  paymentRequest: { include: { cashier: { select: { id: true, fullName: true } }, items: { include: { product: true } }, sale: { select: { id: true, invoiceNumber: true } } } },
};

export const prescriptionRepository = {
  list: (where = {}) => prisma.prescription.findMany({ where, include, orderBy: { createdAt: 'desc' }, take: 300 }),
  findById: (id) => prisma.prescription.findUnique({ where: { id }, include }),
};
