const money = (value) => Number(Number(value || 0).toFixed(2));

export const itemFinancials = (item, sale) => {
  const grossSales = Number(item.lineTotal);
  const subtotal = Number(sale.subtotal);
  const discount = subtotal > 0 ? Number(sale.discount) * (grossSales / subtotal) : 0;
  const containerFee = subtotal > 0 ? Number(sale.containerFee || 0) * (grossSales / subtotal) : 0;
  const netRevenue = grossSales - discount + containerFee;
  const cost = Number(item.quantity) * Number(item.batch.purchasePrice);
  const profit = netRevenue - cost;
  return {
    grossSales: money(grossSales), discount: money(discount), containerFee: money(containerFee), netRevenue: money(netRevenue),
    cost: money(cost), profit: money(profit), margin: netRevenue ? money((profit / netRevenue) * 100) : 0,
  };
};

export const saleFinancials = (sale) => {
  const grossSales = Number(sale.subtotal);
  const discount = Number(sale.discount);
  const containerFee = Number(sale.containerFee || 0);
  const netRevenue = grossSales - discount + containerFee;
  const cost = sale.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.batch.purchasePrice), 0);
  const profit = netRevenue - cost;
  return {
    grossSales: money(grossSales), discount: money(discount), containerFee: money(containerFee), netRevenue: money(netRevenue),
    cost: money(cost), profit: money(profit), margin: netRevenue ? money((profit / netRevenue) * 100) : 0,
  };
};

export const combineFinancials = (values) => {
  const total = values.reduce((result, value) => ({
    grossSales: result.grossSales + value.grossSales,
    discount: result.discount + value.discount,
    containerFee: result.containerFee + (value.containerFee || 0),
    netRevenue: result.netRevenue + value.netRevenue,
    cost: result.cost + value.cost,
    profit: result.profit + value.profit,
  }), { grossSales: 0, discount: 0, containerFee: 0, netRevenue: 0, cost: 0, profit: 0 });
  Object.keys(total).forEach((key) => { total[key] = money(total[key]); });
  return { ...total, margin: total.netRevenue ? money((total.profit / total.netRevenue) * 100) : 0 };
};
