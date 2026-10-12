const number = (value) => Number(value || 0).toFixed(3);
export const invoiceSnapshot = (bill) => ({
  subtotal: number(bill.subtotal), discount: number(bill.discount), tax: number(bill.tax),
  containerFee: number(bill.containerFee), total: number(bill.total), couponCode: bill.couponCode || null,
  items: (bill.items || bill.lines || []).map((item) => ({
    prescriptionItemId: item.prescriptionItemId ?? null, productId: item.productId,
    name: item.name || item.product?.genericName || '', quantity: number(item.quantity),
    unitPrice: number(item.unitPrice), lineTotal: number(item.lineTotal),
  })).sort((a,b) => a.productId - b.productId || (a.prescriptionItemId || 0) - (b.prescriptionItemId || 0)),
});
export const invoiceMaterialChanged = (before, after) => {
  const canonical = (bill) => {
    const snapshot = invoiceSnapshot(bill);
    return { ...snapshot, items: snapshot.items.map(({ name, ...item }) => item) };
  };
  return JSON.stringify(canonical(before)) !== JSON.stringify(canonical(after));
};
