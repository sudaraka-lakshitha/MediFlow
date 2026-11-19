import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/config/prisma.js', () => ({
  prisma: {
    prescriptionUpload: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { prisma } from '../src/config/prisma.js';
import { prescriptionUploadService } from '../src/services/prescriptionUpload.service.js';

const patient = { id: 7, role: 'PATIENT' };

beforeEach(() => vi.clearAllMocks());

describe('customer cancellation of an uploaded prescription', () => {
  it('records a customer cancellation as CANCELLED, separately from pharmacist rejection', async () => {
    prisma.prescriptionUpload.findUnique
      .mockResolvedValueOnce({ id: 12, patientId: patient.id, status: 'PENDING', prescription: null })
      .mockResolvedValueOnce({ id: 12, patientId: patient.id, status: 'CANCELLED', availabilityNotes: 'Cancelled by customer: Uploaded the wrong file.' });
    prisma.prescriptionUpload.updateMany.mockResolvedValue({ count: 1 });

    const result = await prescriptionUploadService.cancelByPatient(12, 'Uploaded the wrong file.', patient);

    expect(prisma.prescriptionUpload.updateMany).toHaveBeenCalledWith({
      where: { id: 12, status: 'PENDING', prescription: { is: null } },
      data: { status: 'CANCELLED', availabilityNotes: 'Cancelled by customer: Uploaded the wrong file.' },
    });
    expect(result.status).toBe('CANCELLED');
  });

  it('does not allow a cancelled request to be cancelled again', async () => {
    prisma.prescriptionUpload.findUnique.mockResolvedValue({ id: 12, patientId: patient.id, status: 'CANCELLED', prescription: null });

    await expect(prescriptionUploadService.cancelByPatient(12, 'Again', patient)).rejects.toMatchObject({ statusCode: 409 });
    expect(prisma.prescriptionUpload.updateMany).not.toHaveBeenCalled();
  });
});
