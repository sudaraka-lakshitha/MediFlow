import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { combineFinancials, itemFinancials, saleFinancials } from '../utils/reportFinancials.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;

// Converts a local calendar boundary into its UTC instant for database filtering.
const localBoundary = (dateText, extraDays = 0) => {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + extraDays) - offsetMs);
};
const rangeBounds = (from, to) => ({ start: localBoundary(from), end: localBoundary(to, 1) });
const dayBounds = (dateText) => rangeBounds(dateText, dateText);
const localDateKey = (date) => new Date(date.getTime() + offsetMs).toISOString().slice(0, 10);

const saleInclude = {
  patient: true,
  pharmacist: true,
  dispensing: { include: { prescription: true } },
  items: { include: { product: { include: { category: true } }, batch: true } },
};

const saleRows = (sales) => sales.flatMap((sale) => sale.items.map((item) => {
  const financials = itemFinancials(item, sale);
  return {
    invoice: sale.invoiceNumber,
    prescription: sale.dispensing?.prescription.prescriptionNumber || '',
    patient: sale.patient?.fullName || 'Walk-in',
    product: item.product.genericName,
    batch: item.batch.batchNumber,
    quantity: item.quantity.toString(),
    pharmacist: sale.pharmacist.fullName,
    grossSales: financials.grossSales.toFixed(2),
    discount: financials.discount.toFixed(2),
    containerFee: financials.containerFee.toFixed(2),
    netRevenue: financials.netRevenue.toFixed(2),
    cost: financials.cost.toFixed(2),
    profit: financials.profit.toFixed(2),
    margin: `${financials.margin.toFixed(2)}%`,
    status: sale.status,
    time: sale.createdAt.toISOString(),
  };
}));

const findSales = ({ start, end }) => prisma.sale.findMany({
  where: { createdAt: { gte: start, lt: end }, status: { not: 'VOIDED' } },
  include: saleInclude,
  orderBy: { createdAt: 'asc' },
});

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
      prisma.sale.findMany({
        where: { createdAt: { gte: start, lt: end }, status: { not: 'VOIDED' } },
        include: { items: { include: { product: true, batch: true } }, pharmacist: { select: { id: true, fullName: true } } },
      }),
      prisma.prescription.findMany({ where: { prescriptionDate: { gte: start, lt: end } }, select: { status: true } }),
      prisma.dispensing.findMany({ where: { dispensedAt: { gte: start, lt: end } }, include: { pharmacist: { select: { id: true, fullName: true } } } }),
    ]);

    const days = {};
    const products = {};
    const pharmacists = {};
    const statuses = {};
    for (const sale of sales) {
      const financials = saleFinancials(sale);
      const date = localDateKey(sale.createdAt);
      days[date] ??= { revenue: 0, cost: 0, profit: 0 };
      days[date].revenue += financials.netRevenue;
      days[date].cost += financials.cost;
      days[date].profit += financials.profit;
      for (const item of sale.items) {
        const key = item.product.genericName;
        const itemValues = itemFinancials(item, sale);
        products[key] ??= { name: key, quantity: 0, revenue: 0, cost: 0, profit: 0 };
        products[key].quantity += Number(item.quantity);
        products[key].revenue += itemValues.netRevenue;
        products[key].cost += itemValues.cost;
        products[key].profit += itemValues.profit;
      }
    }
    for (const issue of dispensings) pharmacists[issue.pharmacist.fullName] = (pharmacists[issue.pharmacist.fullName] || 0) + 1;
    for (const prescription of prescriptions) statuses[prescription.status] = (statuses[prescription.status] || 0) + 1;

    const summary = combineFinancials(sales.map(saleFinancials));
    return {
      summary: {
        sales: summary.netRevenue,
        grossSales: summary.grossSales,
        discount: summary.discount,
        containerFee: summary.containerFee,
        cogs: summary.cost,
        grossProfit: summary.profit,
        grossMargin: summary.margin,
        invoices: sales.length,
        prescriptions: prescriptions.length,
        dispensings: dispensings.length,
      },
      dailySeries: seriesWithEmptyDays(from, to, days).map((item) => ({ date: item.date, revenue: item.value?.revenue || 0, cost: item.value?.cost || 0, profit: item.value?.profit || 0, value: item.value?.revenue || 0 })),
      topProducts: Object.values(products).sort((a, b) => b.quantity - a.quantity).slice(0, 8),
      pharmacistActivity: Object.entries(pharmacists).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      prescriptionStatuses: Object.entries(statuses).map(([status, count]) => ({ status, count })),
    };
  },

  async custom(from, to, groupBy) {
    const sales = await findSales(rangeBounds(from, to));
    const groups = new Map();
    const itemFields = ['product', 'category', 'batch'];
    const groupLabels = { date: 'Sale date', product: 'Product', category: 'Category', batch: 'Batch', pharmacist: 'Pharmacist', patient: 'Patient', paymentMethod: 'Payment method', saleStatus: 'Sale status' };
    const add = (key, sale, quantity, values) => {
      const group = groups.get(key) || { group: key, saleIds: new Set(), quantity: 0, grossSales: 0, discount: 0, containerFee: 0, netRevenue: 0, cost: 0, profit: 0 };
      group.saleIds.add(sale.id); group.quantity += quantity;
      for (const field of ['grossSales', 'discount', 'containerFee', 'netRevenue', 'cost', 'profit']) group[field] += values[field] || 0;
      groups.set(key, group);
    };
    for (const sale of sales) {
      if (itemFields.includes(groupBy)) {
        for (const item of sale.items) {
          const key = groupBy === 'product' ? `${item.product.genericName} ${item.product.strength}` : groupBy === 'category' ? item.product.category.name : item.batch.batchNumber;
          add(key, sale, Number(item.quantity), itemFinancials(item, sale));
        }
      } else {
        const key = groupBy === 'date' ? localDateKey(sale.createdAt) : groupBy === 'pharmacist' ? sale.pharmacist.fullName : groupBy === 'patient' ? (sale.patient?.fullName || 'Walk-in') : groupBy === 'paymentMethod' ? sale.paymentMethod : sale.status;
        add(key, sale, sale.items.reduce((sum, item) => sum + Number(item.quantity), 0), saleFinancials(sale));
      }
    }
    const rows = [...groups.values()].map((group) => ({
      group: group.group, transactions: group.saleIds.size, quantity: Number(group.quantity.toFixed(3)),
      grossSales: Number(group.grossSales.toFixed(2)), discount: Number(group.discount.toFixed(2)), containerFee: Number(group.containerFee.toFixed(2)), netRevenue: Number(group.netRevenue.toFixed(2)),
      cost: Number(group.cost.toFixed(2)), profit: Number(group.profit.toFixed(2)), margin: group.netRevenue ? Number(((group.profit / group.netRevenue) * 100).toFixed(2)) : 0,
    })).sort((first, second) => second.profit - first.profit);
    return { field: groupBy, fieldLabel: groupLabels[groupBy], summary: combineFinancials(sales.map(saleFinancials)), rows };
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
