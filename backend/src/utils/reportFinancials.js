const money = (value) => Number(Number(value || 0).toFixed(2));

export const itemFinancials = (item, sale) => {
  const returns = (sale.refunds || []).flatMap((refund) => refund.lines || []).filter((line) => line.saleItemId === item.id);
  const creditFraction = Number(item.quantity) > 0 ? Math.min(1, returns.reduce((sum,line) => sum + Number(line.quantity),0) / Number(item.quantity)) : 0;
  const restocked = returns.filter((line) => line.stockStatus === 'RESTOCKED').reduce((sum,line) => sum + Number(line.quantity),0);
  const grossSales = Number(item.lineTotal) * (1 - creditFraction);
  const subtotal = Number(sale.subtotal);
  const discount = subtotal > 0 ? Number(sale.discount) * (grossSales / subtotal) : 0;
  const containerFee = subtotal > 0 ? Number(sale.containerFee || 0) * (grossSales / subtotal) : 0;
  const tax = subtotal > 0 ? Number(sale.tax || 0) * (grossSales / subtotal) : 0;
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
