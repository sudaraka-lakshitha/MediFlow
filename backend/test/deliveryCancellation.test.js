import { describe, it, expect, vi } from 'vitest';
import { synchronizeDeliveryCancellation } from '../src/utils/deliveryCancellation.js';

const user = { id: 5, role: 'ADMIN' };
const delivery = { id: 1, paymentRequestId: 10, feePaymentRequestId: 20, status: 'AWAITING_FEE' };
const database = () => ({ paymentRequest: { findUnique: vi.fn() }, deliveryRequest: { update: vi.fn() }, paymentRequestEvent: { create: vi.fn() } });
describe('linked delivery cancellation', () => {
  it('leaves unrelated invoices alone', async () => {
    const tx = database();
    await synchronizeDeliveryCancellation(tx, { id: 10 }, user, 'Cancelled', vi.fn());
    expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  });
  it.each(['PAID', 'AWAITING_PAYMENT', 'SLIP_SUBMITTED'])('resolves a %s fee through the existing cancellation/refund policy', async status => {
    const tx = database(); const cancel = vi.fn();
    tx.paymentRequest.findUnique.mockResolvedValue({ id: 20, status });
    await synchronizeDeliveryCancellation(tx, { id: 10, delivery }, user, 'Order cancelled', cancel);
    expect(cancel).toHaveBeenCalledWith(20, 'Medicine invoice cancelled: Order cancelled', user, tx);
    expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'CANCELLED' } });
  });
  it('propagates denied financial authorization rather than silently abandoning a paid fee', async () => {
    const tx = database(); tx.paymentRequest.findUnique.mockResolvedValue({ id: 20, status: 'PAID' });
    await expect(synchronizeDeliveryCancellation(tx, { id: 10, delivery }, user, 'Cancel', vi.fn().mockRejectedValue(new Error('Cashier approval needed')))).rejects.toThrow('Cashier approval');
    expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  });
  it('keeps a cancelled fee linked and moves delivery back for explicit recovery', async () => {
    const tx = database();
    await synchronizeDeliveryCancellation(tx, { id: 20, deliveryFeeFor: delivery }, user, 'Fee declined', vi.fn());
    expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'REQUESTED' } });
    expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ paymentRequestId: 10, kind: 'DELIVERY_FEE_CANCELLED', details: expect.objectContaining({ cancelledInvoiceId: 20 }) }) });
  });
  it.each(['DISPATCHED', 'DELIVERED'])('does not refund dispatched service charges through ordinary cancellation (%s)', async status => {
    const tx = database();
    await expect(synchronizeDeliveryCancellation(tx, { id: 20, deliveryFeeFor: { ...delivery, status } }, user, 'Cancel', vi.fn())).rejects.toMatchObject({ statusCode: 409 });
    expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  });
  it('does not reopen a cancelled delivery when its fee is cancelled', async () => {
    const tx = database();
    await synchronizeDeliveryCancellation(tx, { id: 20, deliveryFeeFor: { ...delivery, status: 'CANCELLED' } }, user, 'Cancel', vi.fn());
    expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  });
});
