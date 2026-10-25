import { expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: {} }));
import { prescriptionService } from '../src/services/prescription.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';

it.each([true, false])('carries the upload delivery preference into invoice creation: %s', async deliveryRequested => {
  const quote = vi.spyOn(prescriptionService, 'quoteDispensing').mockResolvedValue({ subtotal: 100, discount: 0, containerFee: 0, tax: 0, total: 100, lines: [] });
  const tx = {
    prescription: { findUnique: vi.fn().mockResolvedValue({ id: 1, status: 'VERIFIED', patient: { userId: 2 }, items: [] }) },
    paymentRequest: { create: vi.fn().mockResolvedValue({ id: 3, revision: 1, prescription: { sourceUploadId: 4 } }) },
    prescriptionUpload: { findUnique: vi.fn().mockResolvedValue({ deliveryRequested, deliveryRecipientName: 'Demo Patient', deliveryAddress: '123 Main Street', deliveryPhone: '0701234567' }), update: vi.fn() },
    deliveryRequest: { create: vi.fn() }, paymentRequestEvent: { create: vi.fn() },
  };
  try {
    await paymentRequestService.create(1, { items: [] }, 5, tx);
    expect(tx.deliveryRequest.create).toHaveBeenCalledTimes(deliveryRequested ? 1 : 0);
    if (deliveryRequested) expect(tx.deliveryRequest.create).toHaveBeenCalledWith({ data: { paymentRequestId: 3, recipientName: 'Demo Patient', address: '123 Main Street', phone: '0701234567' } });
  } finally { quote.mockRestore(); }
});
