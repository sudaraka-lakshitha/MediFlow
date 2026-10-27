import { Prisma } from '@prisma/client';
const money = (value) => Number(new Prisma.Decimal(value || 0).toDecimalPlaces(2)) || 0;

// Allocate whole cents once for the entire invoice. Largest remainder with an
// ID tie-break keeps totals exact and independent of database result ordering.
export const allocatedMoney = (item, sale, field) => {
  const items = sale.items?.length ? sale.items : [item];
  const total = new Prisma.Decimal(sale[field] || 0).mul(100).round();
  const weight = items.reduce((sum, line) => sum.add(line.lineTotal), new Prisma.Decimal(0));
  const parts = items.map(line => {
    const exact = weight.isZero() ? total.div(items.length) : total.mul(line.lineTotal).div(weight);
    return { line, id: line.id, cents: exact.floor(), remainder: exact.sub(exact.floor()) };
  });
  let remaining = total.sub(parts.reduce((sum, part) => sum.add(part.cents), new Prisma.Decimal(0))).toNumber();
  parts.sort((a, b) => b.remainder.comparedTo(a.remainder) || String(a.id).localeCompare(String(b.id)));
  for (const part of parts) if (remaining-- > 0) part.cents = part.cents.add(1);
  return Number((parts.find(part => part.line === item || (item.id != null && part.id === item.id))?.cents || new Prisma.Decimal(0)).div(100));
};

export const invoiceItemTotal = (item, sale) => new Prisma.Decimal(item.lineTotal)
  .sub(allocatedMoney(item, sale, 'discount')).add(allocatedMoney(item, sale, 'containerFee')).add(allocatedMoney(item, sale, 'tax'));

// Cumulative credits preserve recorded money, including historical rounding.
// Taking differences between cumulative values releases each tax/fee cent once.
export const itemCreditFinancials = (item, sale, quantity, amount) => {
  const fraction = Number(item.quantity) > 0 ? Prisma.Decimal.min(1, new Prisma.Decimal(quantity).div(item.quantity)) : new Prisma.Decimal(0);
  const part = field => new Prisma.Decimal(allocatedMoney(item, sale, field)).mul(fraction).toDecimalPlaces(2);
  const credited = amount == null ? invoiceItemTotal(item, sale).mul(fraction).toDecimalPlaces(2) : new Prisma.Decimal(amount);
  const tax = Prisma.Decimal.min(part('tax'), credited), discount = part('discount'), containerFee = part('containerFee');
  const netRevenue = credited.sub(tax), grossSales = netRevenue.add(discount).sub(containerFee);
  return { grossSales: money(grossSales), discount: money(discount), containerFee: money(containerFee), tax: money(tax), netRevenue: money(netRevenue) };
};

export const itemFinancials = (item, sale) => {
  const returns = (sale.refunds || []).flatMap((refund) => refund.lines || []).filter((line) => line.saleItemId === item.id);
  const returnedQuantity = returns.reduce((sum, line) => sum.add(line.quantity), new Prisma.Decimal(0));
  const creditedAmount = returns.every(line => line.amount != null) ? returns.reduce((sum, line) => sum.add(line.amount), new Prisma.Decimal(0)) : null;
  const credit = itemCreditFinancials(item, sale, returnedQuantity, creditedAmount);
  const restocked = returns.filter((line) => line.stockStatus === 'RESTOCKED').reduce((sum,line) => sum + Number(line.quantity),0);
  const grossSales = Number(item.lineTotal) - credit.grossSales;
  const discount = allocatedMoney(item, sale, 'discount') - credit.discount;
  const containerFee = allocatedMoney(item, sale, 'containerFee') - credit.containerFee;
  const tax = allocatedMoney(item, sale, 'tax') - credit.tax;
  const netRevenue = grossSales - discount + containerFee;
  const cost = Math.max(0, Number(item.quantity) - restocked) * Number(item.unitCost ?? item.batch.purchasePrice);
  const profit = netRevenue - cost;
  return {
    grossSales: money(grossSales), discount: money(discount), containerFee: money(containerFee), tax: money(tax), netRevenue: money(netRevenue),
    cost: money(cost), profit: money(profit), margin: netRevenue ? money((profit / netRevenue) * 100) : 0,
  };
};

export const saleFinancials = (sale) => {
  if (sale.refunds?.some((refund) => refund.lines?.length)) return combineFinancials(sale.items.map((item) => itemFinancials(item,sale)));
  const grossSales = Number(sale.subtotal);
  const discount = Number(sale.discount);
  const containerFee = Number(sale.containerFee || 0);
  const tax = Number(sale.tax || 0);
  const netRevenue = grossSales - discount + containerFee;
  const cost = sale.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost ?? item.batch.purchasePrice), 0);
  const profit = netRevenue - cost;
  return {
    grossSales: money(grossSales), discount: money(discount), containerFee: money(containerFee), tax: money(tax), netRevenue: money(netRevenue),
    cost: money(cost), profit: money(profit), margin: netRevenue ? money((profit / netRevenue) * 100) : 0,
  };
};

export const combineFinancials = (values) => {
  const total = values.reduce((result, value) => ({
    grossSales: result.grossSales + value.grossSales,
    discount: result.discount + value.discount,
    containerFee: result.containerFee + (value.containerFee || 0),
    tax: result.tax + (value.tax || 0),
    netRevenue: result.netRevenue + value.netRevenue,
    cost: result.cost + value.cost,
    profit: result.profit + value.profit,
  }), { grossSales: 0, discount: 0, containerFee: 0, tax: 0, netRevenue: 0, cost: 0, profit: 0 });
  Object.keys(total).forEach((key) => { total[key] = money(total[key]); });
  return { ...total, margin: total.netRevenue ? money((total.profit / total.netRevenue) * 100) : 0 };
};
