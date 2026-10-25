import { prisma } from '../config/prisma.js';
import { itemFinancials, saleFinancials, combineFinancials } from '../utils/reportFinancials.js';

const include = {
  patient: { select: { id: true, fullName: true } }, pharmacist: { select: { id: true, fullName: true } },
  dispensing: { include: { prescription: { select: { prescriptionNumber: true } } } },
  items: { include: { product: { include: { category: true } }, batch: true } },
};
const signed = (values, factor) => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, key === 'margin' ? value : Number((value * factor).toFixed(2))]));
const event = (sale, item, date, kind, quantity, financials, suffix = '') => ({ sale, item, date, kind, quantity, financials, key: `${kind}-${sale.id}-${item.id}-${suffix}` });
// A reporting row, not an inventory product: service sales have no stock lines.
const serviceItem = { id: 'delivery-service', isService: true, product: { id: 'delivery-service', genericName: 'Delivery service', strength: '', category: { id: 'services', name: 'Services' } }, batch: { id: 'not-applicable', batchNumber: 'Not applicable' } };
const round = value => Number(Number(value).toFixed(2));
const exactCredit = (values, amount, sale) => {
  // Preserve the recorded credit (including the final rounding cent), and
  // allocate tax at the original invoice ratio. Payout is a separate cash event.
  values.tax = -round(Number(sale.total) > 0 ? Number(amount) * Number(sale.tax || 0) / Number(sale.total) : 0);
  values.netRevenue = round(-Number(amount) - values.tax);
  values.grossSales = round(values.netRevenue + values.discount - values.containerFee);
  return values;
};

// Sales, credit authorization and approved stock recovery are distinct dated
// accounting events. Payout date belongs to the separate cash/bank ledger.
export async function reportEvents({ start, end }, tx = prisma) {
  const time = { gte: start, lt: end };
  const [sales, refunds] = await Promise.all([
    tx.sale.findMany({ where: { createdAt: time, OR: [{ status: { not: 'VOIDED' } }, { refunds: { some: {} } }] }, include, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
    tx.refund.findMany({ where: { status: { in: ['PENDING', 'SETTLED'] }, OR: [
      { saleId: { not: null }, OR: [{ createdAt: time }, { lines: { some: { stockStatus: 'RESTOCKED', reviewedAt: time } } }] },
      { category: 'DELIVERY_FEE', decidedAt: time },
    ] }, include: { sale: { include }, paymentRequest: { select: { sale: { include } } }, lines: true }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
  ]);
  const events = sales.flatMap(sale => sale.items.length
    ? sale.items.map(item => event(sale, item, sale.createdAt, 'SALE', Number(item.quantity), itemFinancials(item, { ...sale, refunds: [] })))
    : [event(sale, serviceItem, sale.createdAt, 'SALE', 0, saleFinancials({ ...sale, refunds: [] }))]);
  for (const refund of refunds) {
    if (refund.category === 'DELIVERY_FEE') {
      const sale = refund.paymentRequest?.sale;
      if (!sale || !refund.decidedAt || refund.decidedAt < start || refund.decidedAt >= end || !['PENDING', 'SETTLED'].includes(refund.status)) continue;
      const original = saleFinancials({ ...sale, refunds: [] });
      const values = exactCredit(signed(original, Number(sale.total) > 0 ? -Number(refund.amount) / Number(sale.total) : 0), refund.amount, sale);
      values.cost = 0; values.profit = values.netRevenue; values.margin = values.netRevenue ? 100 : 0;
      events.push(event(sale, serviceItem, refund.decidedAt, 'CREDIT', 0, values, refund.id));
      continue;
    }
    const sale = refund.sale;
    if (!sale) continue;
    for (const line of refund.lines) {
      const item = sale.items.find(item => item.id === line.saleItemId);
      if (!item || !Number(item.quantity)) continue;
      const original = itemFinancials(item, { ...sale, refunds: [] });
      if (refund.createdAt >= start && refund.createdAt < end) {
        const values = signed(original, -Number(line.quantity) / Number(item.quantity));
        // A voided part-paid sale cancels the entire receivable, not only its deposit.
        if (sale.status !== 'VOIDED' && line.amount != null) exactCredit(values, line.amount, sale);
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
