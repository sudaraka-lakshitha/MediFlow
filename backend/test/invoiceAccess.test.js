import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { saleService } from '../src/services/sale.service.js';
import { customerInvoice } from '../src/utils/customerInvoice.js';
import { billingPreview } from '../src/utils/billingPreview.js';
import { createInvoicePdf } from '../src/utils/invoicePdf.js';

const { db } = vi.hoisted(() => ({ db: { sale: { findMany: vi.fn(), findFirst: vi.fn() } } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
const d = (value) => new Prisma.Decimal(value);
const invoice = () => ({
  id: 1, invoiceNumber: 'INV-QA', patientId: 5, cashierId: 7, dispensingId: 3,
  createdAt: new Date('2026-10-10T05:00:00Z'), status: 'PAID', subtotal: d(100), discount: d(0), tax: d(0), total: d(100), amountPaid: d(100),
  internalMemo: 'Not customer data', financials: { cost: 30 },
  patient: { fullName: 'Customer' }, pharmacist: { fullName: 'Pharmacist' }, cashier: { fullName: 'Cashier' },
  dispensing: { internalMemo: 'Hidden', prescription: { prescriptionNumber: 'RX-QA' } },
  items: [{ id: 2, quantity: d(1), unitPrice: d(100), lineTotal: d(100), unitCost: d(30),
    product: { genericName: 'Test item', strength: 'N/A', unit: 'piece', prescriptionRequired: false, internalProductField: 'Hidden' },
    batch: { batchNumber: 'QA-BATCH', purchasePrice: d(30), supplierId: 77, quantityAvailable: d(50), restricted: false } }],
  refunds: [{ id: 4, amount: d(20), reason: 'Customer return', status: 'PENDING', createdById: 7, internalMemo: 'Hidden', lines: [{ id: 8, name: 'Test item', quantity: d(1), amount: d(20), stockReason: 'Internal inspection' }] }],
  discountApplications: [{ id: 6, ruleName: 'Offer', amount: d(0), ruleValue: 70, ruleId: 8 }],
});

beforeEach(() => vi.resetAllMocks());
describe('invoice read access and customer field allowlist', () => {
  it('cashier can open another cashier invoice exposed by the sales list', async () => {
    db.sale.findFirst.mockResolvedValue(invoice());
    const result = await saleService.getForUser(1, { id: 99, role: 'CASHIER' });
    expect(db.sale.findFirst.mock.calls[0][0].where).toEqual({ id: 1 });
    expect(result.cashierId).toBe(7);
  });
  it('patient list and detail retain ownership filtering and hide costs', async () => {
    db.sale.findMany.mockResolvedValue([invoice()]); db.sale.findFirst.mockResolvedValue(invoice());
    const user = { id: 5, role: 'PATIENT' };
    const [listed] = await saleService.list(user); const detail = await saleService.getForUser(1, user);
    expect(db.sale.findMany.mock.calls[0][0].where).toEqual({ patientId: 5 });
    expect(db.sale.findFirst.mock.calls[0][0].where).toEqual({ id: 1, patientId: 5 });
    for (const result of [listed, detail]) {
      expect(result).not.toHaveProperty('financials'); expect(result).not.toHaveProperty('internalMemo');
      expect(result.items[0]).not.toHaveProperty('unitCost');
      expect(result.items[0].batch).toEqual({ batchNumber: 'QA-BATCH' });
      expect(result.items[0].product).not.toHaveProperty('internalProductField');
      expect(result.refunds[0]).not.toHaveProperty('createdById');
      expect(result.refunds[0].reason).toBe('Customer return');
      expect(result.discountApplications[0]).not.toHaveProperty('ruleValue');
    }
  });
  it('does not fall back to an unscoped query when a patient invoice is not found', async () => {
    db.sale.findFirst.mockResolvedValue(null);
    await expect(saleService.getForUser(1, { id: 99, role: 'PATIENT' })).rejects.toThrow('Invoice not found');
    expect(db.sale.findFirst).toHaveBeenCalledTimes(1);
    expect(db.sale.findFirst.mock.calls[0][0].where).toEqual({ id: 1, patientId: 99 });
  });
  it('keeps staff financial reporting fields intact', async () => {
    db.sale.findMany.mockResolvedValue([invoice()]);
    const [result] = await saleService.list({ id: 7, role: 'ADMIN' });
    expect(result.items[0].unitCost.toString()).toBe('30'); expect(result.financials.cost).toBe(30);
  });
  it('renders customer previews and PDFs from sanitized fields', async () => {
    const safe = customerInvoice(invoice());
    const preview = billingPreview(safe);
    expect(preview.prescription).toBe('RX-QA'); expect(preview.items[0].batch).toBe('QA-BATCH');
    expect(preview.refunds[0].reason).toBe('Customer return');
    const pdf = await createInvoicePdf(safe);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  });
});
