import { describe, expect, it } from 'vitest';
import { cashierPaymentSchema, invoiceAcknowledgementSchema, partialCancelSchema } from '../src/controllers/paymentRequest.controller.js';

describe('Cashier payment schema with cash change and split payment', () => {
  it('validates a standard cash payment with tendered and change amounts', () => {
    const input = {
      paymentMethod: 'CASH',
      tenderedAmount: 2000,
      changeAmount: 650,
    };
    const parsed = cashierPaymentSchema.parse(input);
    expect(parsed.paymentMethod).toBe('CASH');
    expect(parsed.tenderedAmount).toBe(2000);
    expect(parsed.changeAmount).toBe(650);
    expect(parsed.splitDetails).toBeUndefined();
  });

  it('validates a split payment with half cash and half card', () => {
    const input = {
      paymentMethod: 'OTHER',
      paymentReference: 'Split: Cash Rs. 1000.00 + Card Rs. 1000.00 (Ref: AUTH9921)',
      tenderedAmount: 1000,
      changeAmount: 0,
      splitDetails: {
        isSplit: true,
        cashAmount: 1000,
        nonCashMethod: 'CARD',
        nonCashAmount: 1000,
        nonCashReference: 'AUTH9921',
        cashTendered: 1000,
        change: 0,
      },
    };
    const parsed = cashierPaymentSchema.parse(input);
    expect(parsed.paymentMethod).toBe('OTHER');
    expect(parsed.splitDetails.isSplit).toBe(true);
    expect(parsed.splitDetails.cashAmount).toBe(1000);
    expect(parsed.splitDetails.nonCashMethod).toBe('CARD');
    expect(parsed.splitDetails.nonCashAmount).toBe(1000);
  });

  it('validates a split payment with cash change returned on the cash portion', () => {
    const input = {
      paymentMethod: 'OTHER',
      paymentReference: 'Split: Cash Rs. 1250.00 + Transfer Rs. 1250.00 (Ref: BT-44821)',
      splitDetails: {
        isSplit: true,
        cashAmount: 1250,
        nonCashMethod: 'BANK_TRANSFER',
        nonCashAmount: 1250,
        nonCashReference: 'BT-44821',
        cashTendered: 1500,
        change: 250,
      },
    };
    const parsed = cashierPaymentSchema.parse(input);
    expect(parsed.splitDetails.cashTendered).toBe(1500);
    expect(parsed.splitDetails.change).toBe(250);
  });

  it('rejects invalid payment method enum values', () => {
    const result = cashierPaymentSchema.safeParse({
      paymentMethod: 'BITCOIN',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative tendered amounts', () => {
    const result = cashierPaymentSchema.safeParse({
      paymentMethod: 'CASH',
      tenderedAmount: -100,
    });
    expect(result.success).toBe(false);
  });

  it('accepts only the supported online invoice payment choices', () => {
    expect(invoiceAcknowledgementSchema.parse({ revision: 2, paymentChoice: 'CASH' }).paymentChoice).toBe('CASH');
    expect(invoiceAcknowledgementSchema.parse({ revision: 2, paymentChoice: 'BANK_TRANSFER' }).paymentChoice).toBe('BANK_TRANSFER');
    expect(invoiceAcknowledgementSchema.safeParse({ revision: 2, paymentChoice: 'CARD' }).success).toBe(false);
  });

  it('requires a positive invoice revision when acknowledging an edited bill', () => {
    expect(invoiceAcknowledgementSchema.safeParse({ revision: 0, paymentChoice: 'CASH' }).success).toBe(false);
  });

  it('requires customer reconfirmation after a partial cancellation by default', () => {
    const parsed = partialCancelSchema.parse({ revision: 1, itemIds: [11], reason: 'Item is unavailable' });
    expect(parsed.skipCustomerReconfirmation).toBe(false);
  });

  it('allows the cashier to explicitly retain an existing customer confirmation', () => {
    const parsed = partialCancelSchema.parse({
      revision: 1,
      itemIds: [11],
      reason: 'Customer requested removal',
      skipCustomerReconfirmation: true,
    });
    expect(parsed.skipCustomerReconfirmation).toBe(true);
  });
});
