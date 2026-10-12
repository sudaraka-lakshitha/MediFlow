import { describe, expect, it } from 'vitest';
import { itemFinancials, saleFinancials } from '../src/utils/reportFinancials.js';

const sale = {
  subtotal: 1000, discount: 100,
  items: [
    { quantity: 2, lineTotal: 600, batch: { purchasePrice: 180 } },
    { quantity: 1, lineTotal: 400, batch: { purchasePrice: 150 } },
  ],
};

describe('report profit calculations', () => {
  it('calculates net revenue, FIFO cost, gross profit and margin', () => {
    expect(saleFinancials(sale)).toEqual({ grossSales: 1000, discount: 100, containerFee: 0, tax: 0, netRevenue: 900, cost: 510, profit: 390, margin: 43.33 });
  });

  it('allocates a sale discount proportionally to each sold line', () => {
    expect(itemFinancials(sale.items[0], sale)).toEqual({ grossSales: 600, discount: 60, containerFee: 0, tax: 0, netRevenue: 540, cost: 360, profit: 180, margin: 33.33 });
  });

  it('includes bottle fees in revenue and allocates them across invoice lines', () => {
    const withBottleFee = { ...sale, containerFee: 50 };
    expect(saleFinancials(withBottleFee)).toEqual({ grossSales: 1000, discount: 100, containerFee: 50, tax: 0, netRevenue: 950, cost: 510, profit: 440, margin: 46.32 });
    expect(itemFinancials(withBottleFee.items[0], withBottleFee)).toEqual({ grossSales: 600, discount: 60, containerFee: 30, tax: 0, netRevenue: 570, cost: 360, profit: 210, margin: 36.84 });
  });

  it('allocates tax proportionally across invoice lines', () => {
    const withTax = { ...sale, tax: 150 };
    expect(saleFinancials(withTax)).toEqual({ grossSales: 1000, discount: 100, containerFee: 0, tax: 150, netRevenue: 900, cost: 510, profit: 390, margin: 43.33 });
    expect(itemFinancials(withTax.items[0], withTax)).toEqual({ grossSales: 600, discount: 60, containerFee: 0, tax: 90, netRevenue: 540, cost: 360, profit: 180, margin: 33.33 });
  });
});
