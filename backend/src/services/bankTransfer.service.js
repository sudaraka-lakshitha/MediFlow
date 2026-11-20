// CONFIRMED BANK TRANSFERS
// When the cashier sees money arrive in the pharmacy's bank account, they record it here.
// That money can then be used to pay one or more of the customer's bills.
// The same transfer (same account, reference and date) can never be recorded twice.

import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { serializable } from '../utils/serializable.js';
import { assertUnusedBankReference } from '../utils/bankReference.js';
import { AppError } from '../utils/AppError.js';
import { bankAccountIdentity } from '../utils/bankAccountIdentity.js';
const include = { bankAccount: { select: { bankName: true, accountNumber: true } }, patient: { select: { fullName: true } }, allocations: { include: { paymentRequest: { select: { requestNumber: true, status: true } } }, orderBy: { id: 'asc' } } };
// Only cashier-level staff can record transfers.
const cashier = user => { if (!(user.role === 'ADMIN' || user.role === 'CASHIER' || (user.role === 'PHARMACIST' && user.cashierAccess))) throw new AppError(403, 'Cashier access is required.'); };
export const bankTransferService = {
  // List recorded transfers.
  async list(user, { page = 1, pageSize = 50, search } = {}) {
    cashier(user);
    return prisma.bankTransfer.findMany({ where: search ? { OR: [{ reference: { contains: search } }, { patient: { fullName: { contains: search } } }, { bankAccount: { accountNumber: { contains: search } } }] } : {}, include, orderBy: { id: 'desc' }, skip: (page - 1) * pageSize, take: pageSize });
  },
  // Record a transfer that the cashier has confirmed on the bank statement.
  async create(input, user) {
    cashier(user);
    if (input.bankVerified !== true) throw new AppError(400, 'Confirm receipt against the bank statement, not only the uploaded slip.');
    const reference = input.reference.trim().toUpperCase();
    return serializable(async tx => {
      const bank = await tx.bankAccount.findUnique({ where: { id: input.bankAccountId } });
      const patient = await tx.user.findFirst({ where: { id: input.patientId, role: 'PATIENT' } });
      if (!bank || !patient) throw new AppError(400, 'Choose an existing bank account and customer.');
      const identity = { bankAccountId_reference_paidOn: { bankAccountId: input.bankAccountId, reference, paidOn: new Date(`${input.paidOn}T00:00:00Z`) } };
      // Older installations can already contain duplicate account entries.
      // Recognize their receipts together without merging or rewriting history.
      const accounts = await tx.bankAccount.findMany({ select: { id: true, bankName: true, accountNumber: true } });
      const accountIds = accounts.filter(account => bankAccountIdentity(account) === bankAccountIdentity(bank)).map(account => account.id);
      const existing = await tx.bankTransfer.findFirst({ where: { bankAccountId: { in: accountIds }, reference, paidOn: identity.bankAccountId_reference_paidOn.paidOn } });
      if (existing) {
        if (existing.patientId !== input.patientId || !existing.amount.equals(input.amount)) throw new AppError(409, 'This bank transaction is already recorded with different details. Review it instead of creating another.');
        return tx.bankTransfer.findUnique({ where: { id: existing.id }, include });
      }
      // Legacy payments lack reliable destination-account metadata. Keep their
      // duplicate guard; never guess an account or silently re-credit old money.
      await assertUnusedBankReference(tx, reference, { registeringLedger: true });
      const transfer = await tx.bankTransfer.create({ data: { ...identity.bankAccountId_reference_paidOn, patientId: input.patientId, amount: new Prisma.Decimal(input.amount), availableAmount: new Prisma.Decimal(input.amount), verifiedById: user.id }, include });
      await tx.auditLog.create({ data: { userId: user.id, action: 'BANK_TRANSFER_VERIFIED', entityType: 'BANK_TRANSFER', entityId: transfer.id, details: { reference, bankAccountId: input.bankAccountId, amount: String(input.amount), paidOn: input.paidOn } } });
      return transfer;
    });
  },
  // Unpaid bills of the same customer that this transfer could pay.
  async invoices(transferId, search, user) {
    cashier(user);
    const transfer = await prisma.bankTransfer.findUnique({ where: { id: transferId } });
    if (!transfer) throw new AppError(404, 'Bank transfer not found.');
    return prisma.paymentRequest.findMany({ where: { patientId: transfer.patientId, status: { in: ['AWAITING_PAYMENT', 'SLIP_SUBMITTED'] }, ...(search ? { requestNumber: { contains: search } } : {}) },
      select: { id: true, revision: true, requestNumber: true, total: true, status: true }, orderBy: { id: 'desc' }, take: 50 });
  },
};
