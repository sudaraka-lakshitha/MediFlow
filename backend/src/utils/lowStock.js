// Decides whether a product is low on stock, using free stock (not counting what is set aside).

const stockKey = (value) => Number(value || 0).toFixed(3);

export const usableStockTotal = (product) => product.batches.reduce(
  (total, batch) => total + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0),
  0,
);

export const lowStockState = (product) => {
  const usableStock = usableStockTotal(product);
  const lowStock = usableStock <= Number(product.reorderLevel || 0);
  const acknowledged = lowStock
    && Boolean(product.lowStockAcknowledgement)
    && stockKey(product.lowStockAcknowledgement.stockLevel) === stockKey(usableStock);
  return { usableStock, lowStock, acknowledged, requiresAttention: lowStock && !acknowledged };
};
