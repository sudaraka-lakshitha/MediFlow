import { prisma } from '../config/prisma.js';

export const userRepository = {
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  findSafeById: (id) => prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, fullName: true, phone: true, role: true, cashierAccess: true, pharmacyReconciliationAccess: true, active: true,
      mustChangePassword: true, lastLoginAt: true, passwordChangedAt: true, patientProfile: true, createdAt: true,
      deliveryRefundApprovalAccess: true,
    },
  }),
  list: (search = '') => prisma.user.findMany({
    where: { role: { not: 'PATIENT' }, OR: [{ email: { contains: search } }, { fullName: { contains: search } }] },
    select: {
      id: true, email: true, fullName: true, phone: true, role: true, cashierAccess: true, pharmacyReconciliationAccess: true, active: true,
      mustChangePassword: true, lastLoginAt: true, passwordChangedAt: true, createdAt: true,
      deliveryRefundApprovalAccess: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  }),
};
