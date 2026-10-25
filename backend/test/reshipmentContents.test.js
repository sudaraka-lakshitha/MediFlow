import { it, expect, vi } from 'vitest';
import { parcelContents, assertParcelReshippable, reshipmentSaleSelect } from '../src/utils/reshipment.js';
const item = (id, quantity, restricted = false) => ({ id, quantity, productId: id, batchId: id, product: { genericName: 'Example', strength: '5 mg', unit: 'tablet' }, batch: { batchNumber: `B${id}`, restricted, expiryDate: new Date('2099-01-01') } });
const delivery = { paymentRequestId: 1, paymentRequest: { status: 'FULFILLED' } };
const db = sale => ({ sale: { findUnique: vi.fn().mockResolvedValue(sale) } });
it('subtracts partial refunds and excludes fully refunded lines', async () => {
  const tx = db({ items: [item(1, 10), item(2, 4)], refunds: [{ lines: [{ saleItemId: 1, quantity: 3 }, { saleItemId: 2, quantity: 4 }] }] });
  const contents = await assertParcelReshippable(tx, delivery);
  expect(contents).toHaveLength(1);
  expect(contents[0]).toMatchObject({ saleItemId: 1, quantity: '7', refundedQuantity: '3' });
  expect(tx.sale.findUnique).toHaveBeenCalledWith({ where: { paymentRequestId: 1 }, select: reshipmentSaleSelect });
});
it('loads pending and settled credits, not rejected requests', () => {
  expect(reshipmentSaleSelect.refunds.where.status.in).toEqual(['PENDING', 'SETTLED']);
});
it('adds multiple partial refunds without floating point errors', () => {
  const lines = parcelContents({ items: [item(1, '0.3')], refunds: [{ lines: [{ saleItemId: 1, quantity: '0.1' }] }, { lines: [{ saleItemId: 1, quantity: '0.1' }] }] });
  expect(lines[0]).toMatchObject({ quantity: '0.1', refundedQuantity: '0.2' });
});
it('does not reject remaining items because an excluded item is restricted', async () => {
  const tx = db({ items: [item(1, 1, true), item(2, 2)], refunds: [{ lines: [{ saleItemId: 1, quantity: 1 }] }] });
  await expect(assertParcelReshippable(tx, delivery)).resolves.toEqual([expect.objectContaining({ saleItemId: 2, quantity: '2' })]);
});
it('refuses inconsistent over-refund quantities instead of silently clipping them', () => {
  expect(() => parcelContents({ items: [item(1, 1)], refunds: [{ lines: [{ saleItemId: 1, quantity: 2 }] }] })).toThrow('exceed');
});
it('rechecks restrictions at dispatch rather than trusting an earlier inspection', async () => {
  await expect(assertParcelReshippable(db({ items: [item(1, 2, true)] }), delivery)).rejects.toThrow('cannot be reshipped');
});
