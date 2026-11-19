import { expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: {} }));
import { prescriptionService } from '../src/services/prescription.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';

const transaction = ({ deliveryRequested, fee = null, bankAccount = { id: 1 } }) => ({
  prescription: { findUnique: vi.fn().mockResolvedValue({ id: 1, status: 'VERIFIED', patient: { userId: 2 }, items: [] }) },
  paymentRequest: {
    create: vi.fn().mockResolvedValueOnce({ id: 3, patientId: 2, requestNumber: 'PAY-1', revision: 1, prescription: { sourceUploadId: 4 } }).mockResolvedValueOnce({ id: 8 }),
    findUnique: vi.fn().mockResolvedValue({ id: 3 }),
  },
  prescriptionUpload: { findUnique: vi.fn().mockResolvedValue({ deliveryRequested, deliveryRecipientName: 'Demo Patient', deliveryAddress: '123 Main Street', deliveryPhone: '0701234567' }), update: vi.fn() },
  deliveryRequest: { create: vi.fn().mockResolvedValue({ id: 6, feePaymentRequestId: null }), update: vi.fn() },
  paymentRequestEvent: { create: vi.fn() },
  systemSetting: { findUnique: vi.fn().mockResolvedValue(fee == null ? null : { value: String(fee) }) },
  bankAccount: { findFirst: vi.fn().mockResolvedValue(bankAccount) },
});

it('leaves the delivery fee for staff when no bank account can receive it', async () => {
  const quote = vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ subtotal: 100, discount: 0, containerFee: 0, tax: 0, total: 100, lines: [] });
  const tx = transaction({ deliveryRequested: true, fee: 350, bankAccount: null });
  try {
    await paymentRequestService.create(1, { items: [] }, 5, tx);
    expect(tx.deliveryRequest.create).toHaveBeenCalledTimes(1);
    expect(tx.paymentRequest.create).toHaveBeenCalledTimes(1);
    expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  } finally { quote.mockRestore(); }
});

it.each([true, false])('carries the upload delivery preference into invoice creation: %s', async deliveryRequested => {
  const quote = vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ subtotal: 100, discount: 0, containerFee: 0, tax: 0, total: 100, lines: [] });
  const tx = transaction({ deliveryRequested });
  try {
    await paymentRequestService.create(1, { items: [] }, 5, tx);
    expect(tx.deliveryRequest.create).toHaveBeenCalledTimes(deliveryRequested ? 1 : 0);
    if (deliveryRequested) expect(tx.deliveryRequest.create).toHaveBeenCalledWith({ data: { paymentRequestId: 3, recipientName: 'Demo Patient', address: '123 Main Street', phone: '0701234567' } });
    // Without a configured standard fee the delivery waits for staff to issue the fee later.
    expect(tx.deliveryRequest.update).not.toHaveBeenCalled();
  } finally { quote.mockRestore(); }
});

it('issues the delivery-fee bill together with the medicine bill when a standard fee is configured', async () => {
  const quote = vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ subtotal: 100, discount: 0, containerFee: 0, tax: 0, total: 100, lines: [] });
  const tx = transaction({ deliveryRequested: true, fee: 350 });
  try {
    await paymentRequestService.create(1, { items: [] }, 5, tx);
    expect(tx.paymentRequest.create).toHaveBeenCalledTimes(2);
    expect(tx.paymentRequest.create.mock.calls[1][0].data).toMatchObject({ type: 'RETAIL', patientId: 2, subtotal: 350, total: 350 });
    expect(tx.deliveryRequest.update).toHaveBeenCalledWith({ where: { id: 6 }, data: { feePaymentRequestId: 8, status: 'AWAITING_FEE' } });
    expect(tx.paymentRequestEvent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ kind: 'DELIVERY_FEE_ISSUED', details: expect.objectContaining({ issuedWithMedicineBill: true, fee: '350' }) }) });
  } finally { quote.mockRestore(); }
});
