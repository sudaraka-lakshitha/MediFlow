// The pharmacy's bank accounts: add, edit, switch on or off. Customers pay bank transfers into the
// active accounts.

import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { serializable } from '../utils/serializable.js';
import { bankAccountIdentity } from '../utils/bankAccountIdentity.js';

const select = {
  id: true, bankName: true, accountName: true, accountNumber: true,
  branch: true, instructions: true, active: true, createdAt: true, updatedAt: true,
};

const assertDistinct = async (tx, data, id) => {
  const accounts = await tx.bankAccount.findMany({ select: { id: true, bankName: true, accountNumber: true } });
  if (accounts.some(account => account.id !== id && bankAccountIdentity(account) === bankAccountIdentity(data))) {
    throw new AppError(409, 'This bank account is already saved. Edit or reactivate the existing account.');
  }
};
const assertActiveRemains = async (tx, id, active) => {
  if (active === false && await tx.bankAccount.count({ where: { active: true, id: { not: id } } }) === 0) {
    throw new AppError(409, 'At least one bank account must stay active, otherwise customers cannot pay online.');
  }
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
    return serializable(async tx => {
      await assertDistinct(tx, data);
      return tx.bankAccount.create({
      data: {
        bankName: data.bankName, accountName: data.accountName, accountNumber: data.accountNumber,
        branch: data.branch || null, instructions: data.instructions || null,
        active: data.active ?? true, createdById: userId,
      },
      select,
      });
    });
  },

  async update(id, data) {
    return serializable(async tx => {
      const existing = await tx.bankAccount.findUnique({ where: { id }, include: { _count: { select: { slips: true, uploadSlips: true, transfers: true } } } });
      if (!existing) throw new AppError(404, 'Bank account not found.');
      const used = Object.values(existing._count).some(count => count > 0);
      if (used && ['bankName', 'accountName', 'accountNumber', 'branch'].some(field => (existing[field] || '') !== (data[field] || ''))) {
        throw new AppError(409, 'This account has payment history. Keep its bank details unchanged and add a new account if needed. Instructions and active status can still be updated.');
      }
      if (bankAccountIdentity(existing) !== bankAccountIdentity(data)) await assertDistinct(tx, data, id);
      await assertActiveRemains(tx, id, data.active);
      return tx.bankAccount.update({
      where: { id },
      data: {
        bankName: data.bankName, accountName: data.accountName, accountNumber: data.accountNumber,
        branch: data.branch || null, instructions: data.instructions || null, active: data.active,
      },
      select,
      });
    });
  },

  // Retired rather than deleted: slips already uploaded still point at the account they
  // were paid into, and that history has to stay readable.
  async setActive(id, active) {
    return serializable(async tx => {
      const existing = await tx.bankAccount.findUnique({ where: { id }, select: { id: true } });
      if (!existing) throw new AppError(404, 'Bank account not found.');
      await assertActiveRemains(tx, id, active);
      return tx.bankAccount.update({ where: { id }, data: { active }, select });
    });
  },
};
