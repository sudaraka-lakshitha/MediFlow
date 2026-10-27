import { beforeEach, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
const db = vi.hoisted(() => ({ bankTransfer: { findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), updateMany: vi.fn() }, bankTransferAllocation: { create: vi.fn() }, bankAccount: { findUnique: vi.fn(), findMany: vi.fn() }, user: { findFirst: vi.fn() }, auditLog: { create: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/utils/serializable.js', () => ({ serializable: operation => operation(db) }));
vi.mock('../src/utils/bankReference.js', () => ({ assertUnusedBankReference: vi.fn() }));
import { bankTransferService } from '../src/services/bankTransfer.service.js';
import { allocateVerifiedTransfer } from '../src/utils/bankAllocation.js';
import { assertUnusedBankReference } from '../src/utils/bankReference.js';
const D = value => new Prisma.Decimal(value);
const bank = { id: 2, bankName: 'Test Bank', accountNumber: '1234' };
beforeEach(() => { vi.clearAllMocks(); db.bankAccount.findMany.mockResolvedValue([bank]); db.bankTransfer.findFirst.mockResolvedValue(null); });
it('allocates one verified transfer across invoices without overspending or re-crediting refunds', async () => {
  let available = D(100);
  db.bankTransfer.findUnique.mockResolvedValue({ id: 1, patientId: 8, reference: 'BANK-1' });
  db.bankTransfer.updateMany.mockImplementation(async ({ where, data }) => {
    if (available.lt(where.availableAmount.gte)) return { count: 0 };
    available = available.sub(data.availableAmount.decrement); return { count: 1 };
  });
  await allocateVerifiedTransfer(db, 1, { id: 10, revision: 1, patientId: 8, total: D(60) }, 3);
  await allocateVerifiedTransfer(db, 1, { id: 11, revision: 1, patientId: 8, total: D(40) }, 3);
  expect(available.toNumber()).toBe(0);
  await expect(allocateVerifiedTransfer(db, 1, { id: 12, revision: 1, patientId: 8, total: D(1) }, 3)).rejects.toMatchObject({ statusCode: 409 });
  expect(db.bankTransferAllocation.create).toHaveBeenCalledTimes(2);
});
it('does not allocate another customer’s money', async () => {
  db.bankTransfer.findUnique.mockResolvedValue({ id: 1, patientId: 8 });
  await expect(allocateVerifiedTransfer(db, 1, { id: 10, revision: 1, patientId: 9, total: D(60) }, 3)).rejects.toMatchObject({ statusCode: 409 });
  expect(db.bankTransfer.updateMany).not.toHaveBeenCalled();
});
it('uses account/reference/date identity and retains legacy duplicate protection', async () => {
  db.bankAccount.findUnique.mockResolvedValue(bank); db.user.findFirst.mockResolvedValue({ id: 8 });
  db.bankTransfer.findUnique.mockResolvedValue(null); db.bankTransfer.create.mockResolvedValue({ id: 1 });
  await bankTransferService.create({ bankAccountId: 2, patientId: 8, reference: 'bank-1', paidOn: '2026-10-01', amount: 100, bankVerified: true }, { id: 3, role: 'CASHIER' });
  expect(db.bankTransfer.create.mock.calls[0][0].data).toMatchObject({ bankAccountId: 2, reference: 'BANK-1', paidOn: new Date('2026-10-01') });
  expect(assertUnusedBankReference).toHaveBeenCalledWith(db, 'BANK-1', { registeringLedger: true });
});
it('requires cashier access, bank confirmation and consistent replay details', async () => {
  const input = { bankAccountId: 2, patientId: 8, reference: 'BANK-1', paidOn: '2026-10-01', amount: 100, bankVerified: true };
  await expect(bankTransferService.create(input, { role: 'PATIENT' })).rejects.toMatchObject({ statusCode: 403 });
  await expect(bankTransferService.create({ ...input, bankVerified: false }, { role: 'CASHIER' })).rejects.toMatchObject({ statusCode: 400 });
  db.bankAccount.findUnique.mockResolvedValue(bank); db.user.findFirst.mockResolvedValue({ id: 8 });
  db.bankTransfer.findFirst.mockResolvedValue({ id: 1, patientId: 8, amount: D(101) });
  await expect(bankTransferService.create(input, { role: 'CASHIER' })).rejects.toMatchObject({ statusCode: 409 });
  expect(db.bankTransfer.create).not.toHaveBeenCalled();
});
it('does not create new funds through an older duplicate bank account entry', async () => {
  db.bankAccount.findUnique.mockResolvedValue(bank); db.user.findFirst.mockResolvedValue({ id: 8 });
  db.bankAccount.findMany.mockResolvedValue([bank, { id: 20, bankName: ' TEST   BANK ', accountNumber: '12-34' }]);
  const existing = { id: 1, patientId: 8, amount: D(100) };
  db.bankTransfer.findFirst.mockResolvedValue(existing); db.bankTransfer.findUnique.mockResolvedValue(existing);
  const receipt = await bankTransferService.create({ bankAccountId: 2, patientId: 8, reference: 'bank-1', paidOn: '2026-10-01', amount: 100, bankVerified: true }, { id: 3, role: 'CASHIER' });
  expect(receipt.id).toBe(1);
  expect(db.bankTransfer.findFirst.mock.calls[0][0].where.bankAccountId.in).toEqual([2, 20]);
  expect(db.bankTransfer.create).not.toHaveBeenCalled();
});
