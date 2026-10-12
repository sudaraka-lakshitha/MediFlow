import { describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';
import { invoiceMaterialChanged, invoiceSnapshot } from '../src/utils/invoiceRevision.js';
import { prescriptionMaterialChanged } from '../src/utils/prescriptionRevision.js';
import { listPagination } from '../src/utils/listPagination.js';

describe('invoice revision comparison', () => {
  const bill = { total: 100, subtotal: 100, tax: 0, items: [{ productId: 2, prescriptionItemId: 1, quantity: 2, unitPrice: 50, lineTotal: 100, product: { genericName: 'Medicine' } }] };
  it('ignores representation differences and unrelated metadata', () => {
    expect(invoiceMaterialChanged(bill, { ...bill, total: new Prisma.Decimal(100), notes: 'New note', items: [{ ...bill.items[0], name: 'Renamed', quantity: '2.000' }] })).toBe(false);
  });
  it.each([{ tax: 2 }, { couponCode: 'NEW' }, { total: 99 }, { items: [] }])('detects changed charges or items: %j', (change) => {
    expect(invoiceMaterialChanged(bill, { ...bill, ...change })).toBe(true);
  });
  it('retains the medicine name in historical snapshots', () => {
    expect(invoiceSnapshot(bill).items[0].name).toBe('Medicine');
  });
});

describe('clinical revision comparison', () => {
  const rx = { patientId: 2, orderedForSelf: true, prescriptionDate: new Date('2026-01-01'), items: [{ productId: 1, prescribedQuantity: 2, dosageInstructions: 'Original directions' }], retailItems: [] };
  it('preserves verification for collection metadata only', () => {
    expect(prescriptionMaterialChanged(rx, { ...rx, pickupNote: 'Collect tomorrow', plannedPickupAt: new Date(), items: [{ ...rx.items[0], prescribedQuantity: new Prisma.Decimal(2) }] })).toBe(false);
  });
  it.each([{ patientId: 3 }, { refillsAllowed: 2 }, { notes: 'Clinical note' }, { items: [{ ...rx.items[0], dosageInstructions: 'Changed directions' }] }])('requires verification for clinical change: %j', (change) => {
    expect(prescriptionMaterialChanged(rx, { ...rx, ...change })).toBe(true);
  });
});

describe('bounded accessible list pages', () => {
  it('supports pages beyond the previous hard limit', () => expect(listPagination({ page: '2', pageSize: '300' })).toMatchObject({ page: 2, pageSize: 300 }));
  it.each([{ page: 0 }, { page: 'abc' }, { pageSize: 301 }, { page: 1.5 }, { status: 'UNKNOWN' }])('rejects invalid paging: %j', (query) => expect(() => listPagination(query)).toThrow());
});
