import { prisma } from '../config/prisma.js';
import { itemFinancials, combineFinancials } from '../utils/reportFinancials.js';

const include = {
  patient: { select: { fullName: true } }, pharmacist: { select: { id: true, fullName: true } },
  dispensing: { include: { prescription: { select: { prescriptionNumber: true } } } },
  items: { include: { product: { include: { category: true } }, batch: true } },
};
const signed = (values, factor) => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, key === 'margin' ? value : Number((value * factor).toFixed(2))]));
const event = (sale, item, date, kind, quantity, financials, suffix = '') => ({ sale, item, date, kind, quantity, financials, key: `${kind}-${sale.id}-${item.id}-${suffix}` });

// Sales, credit authorization and approved stock recovery are distinct dated
// accounting events. Payout date belongs to the separate cash/bank ledger.
export async function reportEvents({ start, end }, tx = prisma) {
  const time = { gte: start, lt: end };
  const [sales, refunds] = await Promise.all([
    tx.sale.findMany({ where: { createdAt: time, OR: [{ status: { not: 'VOIDED' } }, { refunds: { some: {} } }] }, include, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
    tx.refund.findMany({ where: { saleId: { not: null }, OR: [{ createdAt: time }, { lines: { some: { stockStatus: 'RESTOCKED', reviewedAt: time } } }] }, include: { sale: { include }, lines: true }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
  ]);
  const events = sales.flatMap(sale => sale.items.map(item => event(sale, item, sale.createdAt, 'SALE', Number(item.quantity), itemFinancials(item, { ...sale, refunds: [] }))));
  for (const refund of refunds) {
    const sale = refund.sale;
    if (!sale) continue;
    for (const line of refund.lines) {
      const item = sale.items.find(item => item.id === line.saleItemId);
      if (!item || !Number(item.quantity)) continue;
      const original = itemFinancials(item, { ...sale, refunds: [] });
      if (refund.createdAt >= start && refund.createdAt < end) {
        const values = signed(original, -Number(line.quantity) / Number(item.quantity));
        // Returning money alone does not recover the cost of goods.
        values.cost = 0; values.profit = values.netRevenue; values.margin = values.netRevenue ? 100 : 0;
        events.push(event(sale, item, refund.createdAt, 'CREDIT', -Number(line.quantity), values, line.id));
      }
      if (line.stockStatus === 'RESTOCKED' && line.reviewedAt >= start && line.reviewedAt < end) {
        const cost = Number((Number(line.quantity) * Number(item.unitCost ?? item.batch.purchasePrice)).toFixed(2));
        events.push(event(sale, item, line.reviewedAt, 'STOCK_RECOVERY', 0, { grossSales: 0, discount: 0, containerFee: 0, tax: 0, netRevenue: 0, cost: -cost, profit: cost, margin: 0 }, line.id));
      }
    }
  }
  return events.sort((a, b) => a.date - b.date || a.key.localeCompare(b.key));
}

export const eventSummary = events => combineFinancials(events.map(event => event.financials));
