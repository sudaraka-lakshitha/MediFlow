import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../src/config/prisma.js', () => ({ prisma: {
  prescriptionUpload: { create: vi.fn(), findUnique: vi.fn() }, systemSetting: { findUnique: vi.fn() },
} }));
import { prisma } from '../src/config/prisma.js';
import { prescriptionUploadService } from '../src/services/prescriptionUpload.service.js';
import { uploadPrescriptionSchema } from '../src/validators/prescriptionUpload.validator.js';
const input = { submissionKey: '11111111-1111-4111-8111-111111111111', originalName: 'test.txt', mimeType: 'text/plain', fileBase64: Buffer.from('Test prescription details').toString('base64'), prepareRequested: true, orderedForSelf: true };
let saved;
beforeEach(() => {
  vi.resetAllMocks(); saved = null;
  prisma.prescriptionUpload.findUnique.mockImplementation(async () => saved);
  prisma.prescriptionUpload.create.mockImplementation(async ({ data }) => {
    if (saved) throw Object.assign(new Error('duplicate'), { code: 'P2002' });
    saved = { id: 10, submissionHash: data.submissionHash, originalName: data.originalName };
    return { id: 10, originalName: data.originalName };
  });
});
it('returns the existing upload after a lost response instead of creating another', async () => {
  await prescriptionUploadService.create(input, 7);
  expect(await prescriptionUploadService.create(input, 7)).toMatchObject({ id: 10, replayed: true });
  expect(prisma.prescriptionUpload.create).toHaveBeenCalledTimes(1);
});
it('resolves simultaneous creation to a single upload', async () => {
  const results = await Promise.all([prescriptionUploadService.create(input, 7), prescriptionUploadService.create(input, 7)]);
  expect(results.map(result => result.id)).toEqual([10, 10]);
  expect(results.filter(result => result.replayed)).toHaveLength(1);
});
it('does not reuse a key with changed prescription content', async () => {
  await prescriptionUploadService.create(input, 7);
  await expect(prescriptionUploadService.create({ ...input, patientNote: 'Changed request' }, 7)).rejects.toMatchObject({ statusCode: 409 });
});
it('scopes retry lookups to the authenticated patient', async () => {
  await prescriptionUploadService.create(input, 7);
  expect(prisma.prescriptionUpload.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { patientId_submissionKey: { patientId: 7, submissionKey: input.submissionKey } } }));
});
it('requires a valid retry key at the public input boundary', () => {
  expect(uploadPrescriptionSchema.safeParse(input).success).toBe(true);
  expect(uploadPrescriptionSchema.safeParse({ ...input, submissionKey: undefined }).success).toBe(false);
});
