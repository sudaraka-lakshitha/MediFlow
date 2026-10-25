import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { serializable } from '../utils/serializable.js';

const ensureStaff = async (id, tx = prisma) => {
  const user = await tx.user.findUnique({
    where: { id },
    select: { id: true, role: true, active: true, cashierAccess: true, pharmacyReconciliationAccess: true, deliveryRefundApprovalAccess: true },
  });
  if (!user || user.role === 'PATIENT') throw new AppError(404, 'Staff account not found.');
  return user;
};

const ensureAnotherActiveAdmin = async (user, nextRole = user.role, nextActive = user.active, tx = prisma) => {
  if (user.role !== 'ADMIN' || !user.active || (nextRole === 'ADMIN' && nextActive)) return;
  const activeAdministrators = await tx.user.count({ where: { role: 'ADMIN', active: true } });
  if (activeAdministrators <= 1) throw new AppError(409, 'At least one active administrator must remain in the system.');
};

const staffSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  cashierAccess: true,
  pharmacyReconciliationAccess: true,
  deliveryRefundApprovalAccess: true,
  active: true,
  mustChangePassword: true,
  lastLoginAt: true,
  passwordChangedAt: true,
  createdAt: true,
};

export const userService = {
  list: (search) => userRepository.list(search),
  async createStaff(data) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        fullName: data.fullName,
        phone: data.phone || null,
        role: data.role,
        cashierAccess: data.role === 'CASHIER' || (data.role === 'PHARMACIST' && data.cashierAccess),
        pharmacyReconciliationAccess: Boolean(data.pharmacyReconciliationAccess && (data.role === 'CASHIER' || (data.role === 'PHARMACIST' && data.cashierAccess))),
        mustChangePassword: true,
        deliveryRefundApprovalAccess: Boolean(data.deliveryRefundApprovalAccess),
      },
      select: staffSelect,
    });
  },
  async update(id, data, actorId = null) {
    return serializable(async tx => {
    const current = await ensureStaff(id, tx);
    await ensureAnotherActiveAdmin(current, data.role, current.active, tx);
    const cashierAccess = data.role === 'CASHIER' || (data.role === 'PHARMACIST' && data.cashierAccess);
    const pharmacyReconciliationAccess = Boolean((data.pharmacyReconciliationAccess ?? current.pharmacyReconciliationAccess) && (data.role === 'CASHIER' || (data.role === 'PHARMACIST' && cashierAccess)));
    const deliveryRefundApprovalAccess = Boolean(data.deliveryRefundApprovalAccess ?? current.deliveryRefundApprovalAccess);
    const permissionsChanged = current.role !== data.role || current.cashierAccess !== cashierAccess || Boolean(current.pharmacyReconciliationAccess) !== pharmacyReconciliationAccess || Boolean(current.deliveryRefundApprovalAccess) !== deliveryRefundApprovalAccess;
    const updated = await tx.user.update({
      where: { id },
      data: {
        email: data.email.toLowerCase(),
        fullName: data.fullName,
        phone: data.phone || null,
        role: data.role,
        cashierAccess,
        pharmacyReconciliationAccess,
        deliveryRefundApprovalAccess,
        ...(permissionsChanged ? { tokenVersion: { increment: 1 } } : {}),
      },
      select: staffSelect,
    });
    if (actorId && Boolean(current.pharmacyReconciliationAccess) !== pharmacyReconciliationAccess) {
      await tx.auditLog.create({ data: { userId: actorId, action: 'PHARMACY_RECONCILIATION_ACCESS_CHANGED', entityType: 'USER', entityId: id,
        details: { before: Boolean(current.pharmacyReconciliationAccess), after: pharmacyReconciliationAccess, sessionsRevoked: true } } });
    }
    if (actorId && Boolean(current.deliveryRefundApprovalAccess) !== deliveryRefundApprovalAccess) await tx.auditLog.create({ data: { userId: actorId, action: 'DELIVERY_REFUND_PERMISSION_CHANGED', entityType: 'USER', entityId: id, details: { before: Boolean(current.deliveryRefundApprovalAccess), after: deliveryRefundApprovalAccess, sessionsRevoked: true } } });
    return updated;
    });
  },
  async resetPassword(id, password) {
    await ensureStaff(id);
    const passwordHash = await bcrypt.hash(password, 12);
    return prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true,
        passwordChangedAt: new Date(),
        tokenVersion: { increment: 1 },
      },
      select: staffSelect,
    });
  },
  // User deletion is intentionally a soft delete so prescriptions, sales, and audit history remain valid.
  async remove(id) {
    return serializable(async tx => {
    const current = await ensureStaff(id, tx);
    await ensureAnotherActiveAdmin(current, current.role, false, tx);
    return tx.user.update({
      where: { id },
      data: { active: false, tokenVersion: { increment: 1 } },
      select: staffSelect,
    });
    });
  },
  async setActive(id, active) {
    return serializable(async tx => {
    const current = await ensureStaff(id, tx);
    await ensureAnotherActiveAdmin(current, current.role, active, tx);
    return tx.user.update({
      where: { id },
      data: { active, tokenVersion: { increment: 1 } },
      select: staffSelect,
    });
    });
  },
  async revokeSessions(id) {
    await ensureStaff(id);
    return prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
      select: staffSelect,
    });
  },
};
