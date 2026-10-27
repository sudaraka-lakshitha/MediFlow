import { beforeEach, expect, it, vi } from 'vitest';
const db = vi.hoisted(() => ({ bankAccount: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/utils/serializable.js', () => ({ serializable: operation => operation(db) }));
import { bankAccountService } from '../src/services/bankAccount.service.js';
const account = { id: 1, bankName: 'Test Bank', accountName: 'Pharmacy', accountNumber: '001234', branch: null, active: true };
beforeEach(() => {
  vi.clearAllMocks();
  db.bankAccount.findMany.mockResolvedValue([account]);
  db.bankAccount.findUnique.mockResolvedValue({ ...account, _count: { slips: 0, uploadSlips: 0, transfers: 1 } });
  db.bankAccount.count.mockResolvedValue(1);
});
it('rejects formatted duplicates, including retired accounts', async () => {
  db.bankAccount.findMany.mockResolvedValue([{ ...account, active: false }]);
  await expect(bankAccountService.create({ ...account, bankName: ' test   bank ', accountNumber: '00-1234' }, 2)).rejects.toMatchObject({ statusCode: 409 });
  expect(db.bankAccount.create).not.toHaveBeenCalled();
});
it.each(['bankName', 'accountName', 'accountNumber', 'branch'])('preserves historical %s after payments reference an account', async field => {
  await expect(bankAccountService.update(1, { ...account, [field]: 'Changed' })).rejects.toMatchObject({ statusCode: 409 });
  expect(db.bankAccount.update).not.toHaveBeenCalled();
});
it('still permits instructions and retirement while another account stays active', async () => {
  await bankAccountService.update(1, { ...account, active: false, instructions: 'Use your invoice reference' });
  expect(db.bankAccount.update.mock.calls[0][0].data).toMatchObject({ active: false, instructions: 'Use your invoice reference' });
});
it.each(['update', 'setActive'])('cannot retire the last active account through %s', async method => {
  db.bankAccount.count.mockResolvedValue(0);
  await expect(bankAccountService[method](1, method === 'update' ? { ...account, active: false } : false)).rejects.toMatchObject({ statusCode: 409 });
  expect(db.bankAccount.update).not.toHaveBeenCalled();
});
