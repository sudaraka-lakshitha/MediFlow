import { describe, it, expect, vi } from 'vitest';
import { assertUnusedBankReference } from '../src/utils/bankReference.js';

const database = () => Object.fromEntries(['paymentRequest', 'salePayment', 'paymentRequestEvent'].map(name => [name, { findFirst: vi.fn().mockResolvedValue(null) }]));

describe('shared bank payment reference validation', () => {
  it('requires a reference before querying or recording money', async () => {
    const tx = database();
    await expect(assertUnusedBankReference(tx, '  ')).rejects.toMatchObject({ statusCode: 400 });
    expect(tx.paymentRequest.findFirst).not.toHaveBeenCalled();
  });
  it('trims and checks all three payment sources', async () => {
    const tx = database();
    await expect(assertUnusedBankReference(tx, ' BANK-123 ')).resolves.toBe('BANK-123');
    expect(tx.salePayment.findFirst).toHaveBeenCalledWith({ where: { method: 'BANK_TRANSFER', reference: 'BANK-123' }, select: { id: true } });
    expect(tx.paymentRequestEvent.findFirst).toHaveBeenCalledOnce();
  });
  it.each(['paymentRequest', 'salePayment', 'paymentRequestEvent'])('rejects references already credited through %s', async source => {
    const tx = database();
    tx[source].findFirst.mockResolvedValue({ id: 42 });
    await expect(assertUnusedBankReference(tx, 'BANK-123')).rejects.toMatchObject({ statusCode: 409 });
  });
  it('does not exclude cancelled/refunded invoices or the current invoice', async () => {
    const tx = database();
    await assertUnusedBankReference(tx, 'BANK-123');
    expect(tx.paymentRequest.findFirst.mock.calls[0][0].where).toEqual({ paymentMethod: 'BANK_TRANSFER', paymentReference: 'BANK-123', paidAt: { not: null } });
  });
  it('fails closed if a payment source cannot be checked', async () => {
    const tx = database();
    tx.salePayment.findFirst.mockRejectedValue(new Error('database unavailable'));
    await expect(assertUnusedBankReference(tx, 'BANK-123')).rejects.toThrow('database unavailable');
  });
});
