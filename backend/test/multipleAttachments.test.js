import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: {
  prescriptionUpload: { create: vi.fn(), findUnique: vi.fn() },
  prescriptionUploadAttachment: { findFirst: vi.fn() }, systemSetting: { findUnique: vi.fn() },
} }));
import { prisma } from '../src/config/prisma.js';
import { prescriptionUploadService } from '../src/services/prescriptionUpload.service.js';
import { uploadPrescriptionSchema } from '../src/validators/prescriptionUpload.validator.js';
const file = { originalName: 'page.pdf', mimeType: 'application/pdf', fileBase64: Buffer.from('%PDF-1.4 sample').toString('base64') };
const input = { ...file, prepareRequested: true, orderedForSelf: true };
beforeEach(() => vi.resetAllMocks());
it('accepts five files and rejects six', () => {
  expect(uploadPrescriptionSchema.safeParse({ ...input, additionalAttachments: Array(4).fill(file) }).success).toBe(true);
  expect(uploadPrescriptionSchema.safeParse({ ...input, additionalAttachments: Array(5).fill(file) }).success).toBe(false);
});
it('saves all five files atomically under one request', async () => {
  await prescriptionUploadService.create({ ...input, additionalAttachments: Array(4).fill(file) }, 7);
  expect(prisma.prescriptionUpload.create).toHaveBeenCalledTimes(1);
  expect(prisma.prescriptionUpload.create.mock.calls[0][0].data.attachments.create).toHaveLength(4);
});
it('rejects invalid additional content before saving any file', async () => {
  await expect(prescriptionUploadService.create({ ...input, additionalAttachments: [{ ...file, mimeType: 'image/png' }] }, 7)).rejects.toMatchObject({ statusCode: 400 });
  expect(prisma.prescriptionUpload.create).not.toHaveBeenCalled();
});
it('rejects oversized additional files', async () => {
  await expect(prescriptionUploadService.create({ ...input, additionalAttachments: [{ ...file, fileBase64: Buffer.alloc(2500001).toString('base64') }] }, 7)).rejects.toMatchObject({ statusCode: 413 });
});
it('authorizes the parent before accessing any attachment', async () => {
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 8, fileData: Buffer.from('file') });
  await expect(prescriptionUploadService.file(1, { id: 7, role: 'PATIENT' }, 3)).rejects.toMatchObject({ statusCode: 403 });
  expect(prisma.prescriptionUploadAttachment.findFirst).not.toHaveBeenCalled();
});
it('scopes attachment access to the requested parent', async () => {
  prisma.prescriptionUpload.findUnique.mockResolvedValue({ patientId: 7, fileData: Buffer.from('file') });
  prisma.prescriptionUploadAttachment.findFirst.mockResolvedValue(null);
  await expect(prescriptionUploadService.file(1, { id: 7, role: 'PATIENT' }, 99)).rejects.toMatchObject({ statusCode: 404 });
  expect(prisma.prescriptionUploadAttachment.findFirst).toHaveBeenCalledWith({ where: { id: 99, uploadId: 1 } });
});
