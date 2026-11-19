// "Doctor prescribed 20, only 10 in stock": the bill for 10 must say the other
// 10 are collected later and are not charged.
import { describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';
import { balanceToCollect } from '../src/utils/prescriptionBalance.js';
import { billingPreview } from '../src/utils/billingPreview.js';
import { createPaymentRequestPdf } from '../src/utils/paymentRequestPdf.js';
import { createInvoicePdf } from '../src/utils/invoicePdf.js';

const d = (n) => new Prisma.Decimal(n);
const tablets = { genericName: 'Amoxicillin', strength: '500 mg', unit: 'capsule' };
const rxItem = (extra = {}) => ({ id: 11, prescribedQuantity: d(20), dispensedQuantity: d(0), cancelledQuantity: d(0), product: tablets, ...extra });

describe('balance to collect later', () => {
  it('shows the unbilled 10 on an open bill for 10', () => {
    const bill = { status: 'AWAITING_PAYMENT', items: [{ prescriptionItemId: 11, quantity: d(10) }] };
    expect(balanceToCollect([rxItem()], bill)).toEqual([{ prescriptionItemId: 11, name: 'Amoxicillin 500 mg', quantity: '10', unit: 'capsule', reason: null }]);
  });
  it('keeps showing it after the 10 are dispensed', () => {
    const bill = { status: 'FULFILLED', items: [{ prescriptionItemId: 11, quantity: d(10) }] };
    expect(balanceToCollect([rxItem({ dispensedQuantity: d(10) })], bill)[0].quantity).toBe('10');
    expect(balanceToCollect([rxItem({ dispensedQuantity: d(10) })])[0].quantity).toBe('10');
  });
  it('shows nothing once the balance is supplied, closed, or billed in full', () => {
    expect(balanceToCollect([rxItem({ dispensedQuantity: d(20) })])).toEqual([]);
    expect(balanceToCollect([rxItem({ dispensedQuantity: d(10), cancelledQuantity: d(10) })])).toEqual([]);
    expect(balanceToCollect([rxItem()], { status: 'PAID', items: [{ prescriptionItemId: 11, quantity: d(20) }] })).toEqual([]);
  });
  it('shows nothing for a cancelled bill', () => {
    expect(balanceToCollect([rxItem()], { status: 'CANCELLED', items: [] })).toEqual([]);
  });
  it('lists a medicine left off the bill entirely', () => {
    const bill = { status: 'PAID', items: [{ prescriptionItemId: 11, quantity: d(20) }] };
    const other = rxItem({ id: 12, prescribedQuantity: d(5), product: { genericName: 'Paracetamol', strength: 'N/A', unit: 'tablet' } });
    expect(balanceToCollect([rxItem(), other], bill)).toEqual([{ prescriptionItemId: 12, name: 'Paracetamol', quantity: '5', unit: 'tablet', reason: null }]);
  });
  it('reaches the bill preview', () => {
    const lines = [{ prescriptionItemId: 11, name: 'Amoxicillin', quantity: '10', unit: 'capsule' }];
    expect(billingPreview({ items: [], balanceToCollect: lines }).balanceToCollect).toEqual(lines);
    expect(billingPreview({ items: [] }).balanceToCollect).toEqual([]);
  });
});

describe('printed bills carry the balance', () => {
  const balance = [{ prescriptionItemId: 11, name: 'Amoxicillin 500 mg', quantity: '10', unit: 'capsule' }];
  it('renders the payment request PDF', async () => {
    const request = { requestNumber: 'PAY-1', type: 'PRESCRIPTION', status: 'AWAITING_PAYMENT', createdAt: new Date(), patient: { fullName: 'Walk-in Patient' }, pharmacist: { fullName: 'Pharmacist' }, prescription: { prescriptionNumber: 'RX-1' },
      items: [{ product: { ...tablets, productType: 'MEDICINE' }, quantity: d(10), unitPrice: d(20), lineTotal: d(200) }], subtotal: d(200), discount: d(0), containerFee: d(0), tax: d(0), total: d(200), amountPaid: d(0), refundedAmount: d(0), balanceToCollect: balance };
    const pdf = await createPaymentRequestPdf(request);
    expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
  });
  it('renders the final invoice PDF', async () => {
    const sale = { invoiceNumber: 'INV-1', status: 'PAID', createdAt: new Date(), patient: { fullName: 'Walk-in Patient' }, pharmacist: { fullName: 'Pharmacist' }, cashier: { fullName: 'Cashier' },
      items: [{ id: 1, product: { ...tablets, prescriptionRequired: true }, batch: { batchNumber: 'B1' }, quantity: d(10), unitPrice: d(20), lineTotal: d(200) }],
      subtotal: d(200), discount: d(0), containerFee: d(0), tax: d(0), total: d(200), amountPaid: d(200), refunds: [], balanceToCollect: balance };
    const pdf = await createInvoicePdf(sale);
    expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
  });
});

describe('prescribed against bought', () => {
  it('lists every medicine with what was bought and what was not', async () => {
    const { supplyRows } = await import('../src/utils/prescriptionBalance.js');
    const rows = supplyRows([{ kind: 'PARTIAL_SUPPLY_RECORDED', details: { lines: [
      { prescriptionItemId: 11, name: 'Amoxicillin', unit: 'capsule', prescribedQuantity: '20', suppliedBeforeQuantity: '0', billedQuantity: '10', shortQuantity: '10', reason: 'CANNOT_AFFORD', issueLater: true },
      { prescriptionItemId: 12, name: 'Paracetamol', unit: 'tablet', prescribedQuantity: '10', suppliedBeforeQuantity: '0', billedQuantity: '10', shortQuantity: '0' },
    ] } }]);
    expect(rows[0]).toMatchObject({ prescribed: '20', onThisBill: '10', notBought: '10', rest: 'Collect later on a new bill', reason: 'customer could not pay for all of it now' });
    expect(rows[1]).toMatchObject({ notBought: '0', rest: null, reason: null });
  });
});
