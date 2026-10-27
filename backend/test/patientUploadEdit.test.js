import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: { $transaction: vi.fn(), prescriptionUpload: { findUnique: vi.fn(), updateMany: vi.fn() }, prescriptionUploadAttachment: { findUnique: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() } } }));
import { prisma } from '../src/config/prisma.js';
import { prescriptionUploadService } from '../src/services/prescriptionUpload.service.js';
import { editUploadSchema } from '../src/validators/prescriptionUpload.validator.js';
const patient = { id: 7, role: 'PATIENT' };
const input = { updatedAt: '2026-10-21T08:00:00.000Z', patientNote: 'Updated request', prepareRequested: false, orderedForSelf: true };
beforeEach(() => {
  vi.clearAllMocks();
  prisma.$transaction.mockImplementation(operation => operation(prisma));
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 7 });
  prisma.prescriptionUpload.updateMany.mockResolvedValue({ count: 1 });
});
it('keeps the attachment when only details are edited and checks the saved version', async () => {
  await prescriptionUploadService.edit(1, editUploadSchema.parse(input), patient);
  const query = prisma.prescriptionUpload.updateMany.mock.calls[0][0];
  expect(query.where).toMatchObject({ id: 1, patientId: 7, status: 'PENDING', prescription: { is: null }, attachmentRemovedAt: null, updatedAt: new Date(input.updatedAt) });
  expect(query.data).not.toHaveProperty('fileData');
  expect(query.data.patientNote).toBe(input.patientNote);
  expect(query.data.estimatedTotal).toBeNull();
});
it('rejects other patients and staff', async () => {
  await expect(prescriptionUploadService.edit(1, input, { id: 8, role: 'PATIENT' })).rejects.toMatchObject({ statusCode: 403 });
  await expect(prescriptionUploadService.edit(1, input, { id: 7, role: 'PHARMACIST' })).rejects.toMatchObject({ statusCode: 403 });
  expect(prisma.prescriptionUpload.updateMany).not.toHaveBeenCalled();
});
it('rejects stale or already processed uploads', async () => {
  prisma.prescriptionUpload.updateMany.mockResolvedValue({ count: 0 });
  await expect(prescriptionUploadService.edit(1, input, patient)).rejects.toMatchObject({ statusCode: 409 });
});
it('validates replacement files and recipient details', async () => {
  expect(editUploadSchema.safeParse({ ...input, mimeType: 'image/png' }).success).toBe(false);
  expect(editUploadSchema.safeParse({ ...input, orderedForSelf: false }).success).toBe(false);
  await expect(prescriptionUploadService.edit(1, { ...input, mimeType: 'image/png', fileBase64: Buffer.from('not a png').toString('base64'), originalName: 'image.png' }, patient)).rejects.toMatchObject({ statusCode: 400 });
  expect(prisma.prescriptionUpload.updateMany).not.toHaveBeenCalled();
});
it('replaces a valid file only when explicitly supplied', async () => {
  const content = 'Updated typed prescription';
  await prescriptionUploadService.edit(1, editUploadSchema.parse({ ...input, originalName: 'request.txt', mimeType: 'text/plain', fileBase64: Buffer.from(content).toString('base64') }), patient);
  expect(prisma.prescriptionUpload.updateMany.mock.calls[0][0].data.fileData.toString()).toBe(content);
});
it('adds/removes pages in the same versioned transaction and promotes a retained first page', async () => {
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 7, attachments: [{ id: 8 }, { id: 9 }] });
  prisma.prescriptionUploadAttachment.findUnique.mockResolvedValue({ originalName: 'second.txt', mimeType: 'text/plain', fileData: Buffer.from('second page') });
  await prescriptionUploadService.edit(1, { ...input, removeAttachmentIds: [0, 9], additionalAttachments: [{ originalName: 'third.txt', mimeType: 'text/plain', fileBase64: Buffer.from('new third page').toString('base64') }] }, patient);
  expect(prisma.prescriptionUpload.updateMany.mock.calls[0][0].data.originalName).toBe('second.txt');
  expect(prisma.prescriptionUploadAttachment.deleteMany).toHaveBeenCalledWith({ where: { uploadId: 1, id: { in: [9, 8] } } });
  expect(prisma.prescriptionUploadAttachment.createMany.mock.calls[0][0].data[0]).toMatchObject({ uploadId: 1, originalName: 'third.txt' });
});
it('rejects all-page removal, foreign attachment IDs and totals above five', async () => {
  await expect(prescriptionUploadService.edit(1, { ...input, removeAttachmentIds: [0] }, patient)).rejects.toMatchObject({ statusCode: 400 });
  await expect(prescriptionUploadService.edit(1, { ...input, removeAttachmentIds: [99] }, patient)).rejects.toMatchObject({ statusCode: 409 });
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 7, attachments: [1,2,3,4].map(id => ({ id })) });
  await expect(prescriptionUploadService.edit(1, { ...input, additionalAttachments: [{ originalName: 'extra.txt', mimeType: 'text/plain', fileBase64: Buffer.from('additional page').toString('base64') }] }, patient)).rejects.toMatchObject({ statusCode: 400 });
});
it('does not mutate attachments when the viewed request version is stale', async () => {
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 7, attachments: [{ id: 8 }] });
  prisma.prescriptionUpload.updateMany.mockResolvedValue({ count: 0 });
  await expect(prescriptionUploadService.edit(1, { ...input, removeAttachmentIds: [8] }, patient)).rejects.toMatchObject({ statusCode: 409 });
  expect(prisma.prescriptionUploadAttachment.deleteMany).not.toHaveBeenCalled();
});
