import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

const ensureStaff = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, active: true, cashierAccess: true },
  });
  if (!user || user.role === 'PATIENT') throw new AppError(404, 'Staff account not found.');
  return user;
};

const ensureAnotherActiveAdmin = async (user, nextRole = user.role, nextActive = user.active) => {
  if (user.role !== 'ADMIN' || !user.active || (nextRole === 'ADMIN' && nextActive)) return;
  const activeAdministrators = await prisma.user.count({ where: { role: 'ADMIN', active: true } });
  if (activeAdministrators <= 1) throw new AppError(409, 'At least one active administrator must remain in the system.');
};

const staffSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  cashierAccess: true,
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
        mustChangePassword: true,
      },
      select: staffSelect,
    });
  },
  async update(id, data) {
    const current = await ensureStaff(id);
    await ensureAnotherActiveAdmin(current, data.role, current.active);
    const cashierAccess = data.role === 'CASHIER' || (data.role === 'PHARMACIST' && data.cashierAccess);
    const permissionsChanged = current.role !== data.role || current.cashierAccess !== cashierAccess;
    return prisma.user.update({
      where: { id },
      data: {
        email: data.email.toLowerCase(),
        fullName: data.fullName,
        phone: data.phone || null,
        role: data.role,
        cashierAccess,
        ...(permissionsChanged ? { tokenVersion: { increment: 1 } } : {}),
      },
      select: staffSelect,
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
    const current = await ensureStaff(id);
    await ensureAnotherActiveAdmin(current, current.role, false);
    return prisma.user.update({
      where: { id },
      data: { active: false, tokenVersion: { increment: 1 } },
      select: staffSelect,
    });
  },
  async setActive(id, active) {
    const current = await ensureStaff(id);
    await ensureAnotherActiveAdmin(current, current.role, active);
    return prisma.user.update({
      where: { id },
      data: { active, tokenVersion: { increment: 1 } },
      select: staffSelect,
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
