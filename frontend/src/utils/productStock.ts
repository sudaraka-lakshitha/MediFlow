// Works out the free stock of a product (on the shelf minus set aside) and shows it in words.

export type ProductStockSummary = {
  available: number;
  inDateOnHand: number;
  reserved: number;
  expired: number;
  restricted: number;
};

type StockProduct = {
  unit?: string;
  batches?: Array<{
    quantityAvailable: number | string;
    quantityReserved?: number | string;
    expiryDate?: string | Date | null;
    restricted?: boolean;
  }>;
  stockSummary?: Partial<ProductStockSummary>;
};

const numberValue = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatQuantity = (value: number) =>
  Number(value.toFixed(3)).toString();

export const productStockSummary = (product?: StockProduct | null): ProductStockSummary => {
  if (product?.stockSummary) {
    const inDateOnHand = numberValue(product.stockSummary.inDateOnHand);
    const reserved = numberValue(product.stockSummary.reserved);
    return {
      available: Math.max(0, numberValue(product.stockSummary.available)),
      inDateOnHand,
      reserved,
      expired: numberValue(product.stockSummary.expired),
      restricted: numberValue(product.stockSummary.restricted),
    };
  }

  const now = new Date();
  const totals = (product?.batches || []).reduce(
    (sum, batch) => {
      const quantity = Math.max(0, numberValue(batch.quantityAvailable));
      if (!quantity) return sum;
      if (batch.restricted) {
        sum.restricted += quantity;
      } else if (batch.expiryDate && new Date(batch.expiryDate) < now) {
        sum.expired += quantity;
      } else {
        sum.inDateOnHand += quantity;
        sum.reserved += Math.min(quantity, Math.max(0, numberValue(batch.quantityReserved)));
      }
      return sum;
    },
    { inDateOnHand: 0, reserved: 0, expired: 0, restricted: 0 },
  );

  return {
    ...totals,
    available: Math.max(0, totals.inDateOnHand - totals.reserved),
  };
};

export const usableProductStock = (product?: StockProduct | null) =>
  productStockSummary(product).available;

export const productStockDescription = (product?: StockProduct | null) => {
  const summary = productStockSummary(product);
  const unit = product?.unit || 'units';
  const details: string[] = [];

  if (summary.available > 0) {
    details.push(`Available: ${formatQuantity(summary.available)} ${unit}`);
  } else if (summary.inDateOnHand > 0 && summary.reserved >= summary.inDateOnHand) {
    details.push(`All in-date stock reserved: ${formatQuantity(summary.inDateOnHand)} ${unit}`);
  } else if (summary.expired > 0 && summary.restricted === 0) {
    details.push(`Expired stock only: ${formatQuantity(summary.expired)} ${unit}`);
  } else if (summary.restricted > 0 && summary.expired === 0) {
    details.push(`Restricted stock only: ${formatQuantity(summary.restricted)} ${unit}`);
  } else if (!summary.inDateOnHand && !summary.expired && !summary.restricted) {
    details.push('Out of stock');
  } else {
    details.push('No usable stock');
  }

  if (summary.available > 0 && summary.reserved > 0) {
    details.push(`Reserved: ${formatQuantity(summary.reserved)} ${unit}`);
  }
  if (summary.expired > 0 && !(summary.expired > 0 && summary.restricted === 0 && summary.available === 0)) {
    details.push(`Expired: ${formatQuantity(summary.expired)} ${unit}`);
  }
  if (summary.restricted > 0 && !(summary.restricted > 0 && summary.expired === 0 && summary.available === 0)) {
    details.push(`Restricted: ${formatQuantity(summary.restricted)} ${unit}`);
  }
  return details.join(' · ');
};

export const productStockTone = (product?: StockProduct | null) =>
  usableProductStock(product) > 0 ? 'text-success' : 'text-danger';
