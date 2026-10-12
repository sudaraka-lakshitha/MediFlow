import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

const select = {
  id: true, bankName: true, accountName: true, accountNumber: true,
  branch: true, instructions: true, active: true, createdAt: true, updatedAt: true,
};

export const bankAccountService = {
  // Customers only ever see accounts that are currently in use; administrators need the
  // retired ones too so they can bring one back rather than re-typing it.
  async list(user) {
    const staffAdmin = user?.role === 'ADMIN';
    return prisma.bankAccount.findMany({
      where: staffAdmin ? {} : { active: true },
      select,
      orderBy: [{ active: 'desc' }, { bankName: 'asc' }],
    });
  },

  async create(data, userId) {
    return prisma.bankAccount.create({
      data: {
        bankName: data.bankName, accountName: data.accountName, accountNumber: data.accountNumber,
        branch: data.branch || null, instructions: data.instructions || null,
        active: data.active ?? true, createdById: userId,
      },
      select,
    });
  },

  async update(id, data) {
    const existing = await prisma.bankAccount.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new AppError(404, 'Bank account not found.');
    return prisma.bankAccount.update({
      where: { id },
      data: {
        bankName: data.bankName, accountName: data.accountName, accountNumber: data.accountNumber,
        branch: data.branch || null, instructions: data.instructions || null, active: data.active,
      },
      select,
    });
  },

  // Retired rather than deleted: slips already uploaded still point at the account they
  // were paid into, and that history has to stay readable.
  async setActive(id, active) {
    const existing = await prisma.bankAccount.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new AppError(404, 'Bank account not found.');
    if (!active) {
      const remaining = await prisma.bankAccount.count({ where: { active: true, id: { not: id } } });
      if (remaining === 0) throw new AppError(409, 'At least one bank account must stay active, otherwise customers cannot pay online.');
    }
    return prisma.bankAccount.update({ where: { id }, data: { active }, select });
  },
};
