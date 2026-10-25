import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { reportEvents, eventSummary } from './reportEvents.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;

// Converts a local calendar boundary into its UTC instant for database filtering.
const localBoundary = (dateText, extraDays = 0) => {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + extraDays) - offsetMs);
};
const rangeBounds = (from, to) => ({ start: localBoundary(from), end: localBoundary(to, 1) });
const dayBounds = (dateText) => rangeBounds(dateText, dateText);
const localDateKey = (date) => new Date(date.getTime() + offsetMs).toISOString().slice(0, 10);

const saleRows = (events) => events.map(({ sale, item, financials, date, kind, quantity }) => {
  return {
    invoice: sale.invoiceNumber,
    prescription: sale.dispensing?.prescription.prescriptionNumber || '',
    patient: sale.patient?.fullName || 'Walk-in',
    product: item.product.genericName,
    batch: item.batch.batchNumber,
    quantity: String(quantity),
    pharmacist: sale.pharmacist.fullName,
    grossSales: financials.grossSales.toFixed(2),
    discount: financials.discount.toFixed(2),
    containerFee: financials.containerFee.toFixed(2),
    netRevenue: financials.netRevenue.toFixed(2),
    cost: financials.cost.toFixed(2),
    profit: financials.profit.toFixed(2),
    margin: `${financials.margin.toFixed(2)}%`,
    status: kind,
    time: date.toISOString(),
  };
});

const findSales = reportEvents;

const seriesWithEmptyDays = (from, to, values) => {
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (days > 62) return Object.entries(values).map(([date, value]) => ({ date, value }));
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start); date.setUTCDate(date.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { date: key, value: values[key] || 0 };
  });
};

export const reportService = {
  async daily(dateText) {
    return saleRows(await findSales(dayBounds(dateText)));
  },

  async range(from, to) {
    return saleRows(await findSales(rangeBounds(from, to)));
  },

  async analytics(from, to) {
    const { start, end } = rangeBounds(from, to);
    const [sales, prescriptions, dispensings] = await Promise.all([
      reportEvents({ start, end }),
      prisma.prescription.findMany({ where: { prescriptionDate: { gte: start, lt: end } }, select: { status: true } }),
      prisma.dispensing.findMany({ where: { dispensedAt: { gte: start, lt: end } }, include: { pharmacist: { select: { id: true, fullName: true } } } }),
    ]);

    const days = {};
    const products = {};
    const pharmacists = {};
    const statuses = {};
    for (const entry of sales) {
      const { financials, item, quantity } = entry;
      const date = localDateKey(entry.date);
      days[date] ??= { revenue: 0, cost: 0, profit: 0 };
      days[date].revenue += financials.netRevenue;
      days[date].cost += financials.cost;
      days[date].profit += financials.profit;
      if (!item.isService) {
        const key = item.product.id;
        const itemValues = financials;
        products[key] ??= { id: key, name: [item.product.genericName, item.product.strength, item.product.dosageForm].filter(Boolean).join(' '), quantity: 0, revenue: 0, cost: 0, profit: 0 };
        products[key].quantity += quantity;
        products[key].revenue += itemValues.netRevenue;
        products[key].cost += itemValues.cost;
        products[key].profit += itemValues.profit;
      }
    }
    for (const issue of dispensings) {
      const person = issue.pharmacist;
      pharmacists[person.id] ??= { id: person.id, name: `${person.fullName} (#${person.id})`, count: 0 };
      pharmacists[person.id].count += 1;
    }
    for (const prescription of prescriptions) statuses[prescription.status] = (statuses[prescription.status] || 0) + 1;

    const summary = eventSummary(sales);
    return {
      summary: {
        sales: summary.netRevenue,
        grossSales: summary.grossSales,
        discount: summary.discount,
        containerFee: summary.containerFee,
        cogs: summary.cost,
        grossProfit: summary.profit,
        grossMargin: summary.margin,
        invoices: new Set(sales.filter(entry => entry.kind === 'SALE').map(entry => entry.sale.id)).size,
        prescriptions: prescriptions.length,
        dispensings: dispensings.length,
      },
      dailySeries: seriesWithEmptyDays(from, to, days).map((item) => ({ date: item.date, revenue: item.value?.revenue || 0, cost: item.value?.cost || 0, profit: item.value?.profit || 0, value: item.value?.revenue || 0 })),
      topProducts: Object.values(products).sort((a, b) => b.quantity - a.quantity).slice(0, 8),
      pharmacistActivity: Object.values(pharmacists).sort((a, b) => b.count - a.count),
      prescriptionStatuses: Object.entries(statuses).map(([status, count]) => ({ status, count })),
    };
  },

  async custom(from, to, groupBy) {
    const sales = await findSales(rangeBounds(from, to));
    const groups = new Map();
    const itemFields = ['product', 'category', 'batch'];
    const groupLabels = { date: 'Activity date', product: 'Product', category: 'Category', batch: 'Batch', pharmacist: 'Pharmacist', patient: 'Patient', paymentMethod: 'Invoice payment method', saleStatus: 'Activity type' };
    const add = (key, sale, quantity, values, label = key) => {
      const group = groups.get(key) || { group: label, saleIds: new Set(), quantity: 0, grossSales: 0, discount: 0, containerFee: 0, netRevenue: 0, cost: 0, profit: 0 };
      group.saleIds.add(sale.id); group.quantity += quantity;
      for (const field of ['grossSales', 'discount', 'containerFee', 'netRevenue', 'cost', 'profit']) group[field] += values[field] || 0;
      groups.set(key, group);
    };
    for (const entry of sales) {
      const { sale, item, quantity, financials } = entry;
      if (itemFields.includes(groupBy)) {
        const key = groupBy === 'product' ? item.product.id : groupBy === 'category' ? item.product.category.id : item.batch.id;
        const label = groupBy === 'product' ? `${item.product.genericName} ${item.product.strength || ''} (#${key})` : groupBy === 'category' ? `${item.product.category.name} (#${key})` : `${item.batch.batchNumber} (#${key})`;
        add(key, sale, quantity, financials, label);
      } else {
        const key = groupBy === 'date' ? localDateKey(entry.date) : groupBy === 'pharmacist' ? `${sale.pharmacist.fullName} (#${sale.pharmacist.id})` : groupBy === 'patient' ? (sale.patient ? `${sale.patient.fullName} (#${sale.patient.id})` : 'Walk-in') : groupBy === 'paymentMethod' ? sale.paymentMethod : entry.kind;
        add(key, sale, quantity, financials);
      }
    }
    const rows = [...groups.values()].map((group) => ({
      group: group.group, transactions: group.saleIds.size, quantity: Number(group.quantity.toFixed(3)),
      grossSales: Number(group.grossSales.toFixed(2)), discount: Number(group.discount.toFixed(2)), containerFee: Number(group.containerFee.toFixed(2)), netRevenue: Number(group.netRevenue.toFixed(2)),
      cost: Number(group.cost.toFixed(2)), profit: Number(group.profit.toFixed(2)), margin: group.netRevenue ? Number(((group.profit / group.netRevenue) * 100).toFixed(2)) : 0,
    })).sort((first, second) => second.profit - first.profit);
    return { field: groupBy, fieldLabel: groupLabels[groupBy], summary: eventSummary(sales), rows };
  },

  async monthly(month) {
    const start = localBoundary(`${month}-01`);
    const [year, monthNumber] = month.split('-').map(Number);
    const end = new Date(Date.UTC(year, monthNumber, 1) - offsetMs);
    const products = await prisma.product.findMany({
      include: { stockMovements: { where: { createdAt: { lt: end } } } },
      orderBy: { genericName: 'asc' },
    });
    return products.map((product) => {
      const before = product.stockMovements.filter((movement) => movement.createdAt < start).reduce((sum, movement) => sum + Number(movement.quantityChange), 0);
      const during = product.stockMovements.filter((movement) => movement.createdAt >= start);
      const received = during.filter((movement) => movement.type === 'RECEIPT').reduce((sum, movement) => sum + Number(movement.quantityChange), 0);
      const dispensed = -during.filter((movement) => ['DISPENSING', 'RETAIL_SALE'].includes(movement.type)).reduce((sum, movement) => sum + Number(movement.quantityChange), 0);
      const adjustments = during.filter((movement) => !['RECEIPT', 'DISPENSING', 'RETAIL_SALE'].includes(movement.type)).reduce((sum, movement) => sum + Number(movement.quantityChange), 0);
      const closing = before + during.reduce((sum, movement) => sum + Number(movement.quantityChange), 0);
      return { sku: product.sku, product: product.genericName, opening: before, received, dispensed, adjustments, closing, reorderLevel: product.reorderLevel, stockValue: product.sellingPrice.mul(closing).toString() };
    });
  },
};
