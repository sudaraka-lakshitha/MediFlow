import { it, expect, vi } from 'vitest';
import { refundService } from '../src/services/refund.service.js';

it.each(['DISPATCHED', 'DELIVERY_FAILED', 'RETURNING', 'RESHIP_READY', 'RESHIP_REQUESTED'])('blocks product refund authorization while parcel is %s', async status => {
  const tx = { sale: { findUnique: vi.fn().mockResolvedValue({ status: 'PAID', paymentRequest: { delivery: { status } } }) } };
  await expect(refundService.saleQuote(tx, 1, { items: [], expectedRefundCount: 0 })).rejects.toThrow('Resolve the active shipment');
});
