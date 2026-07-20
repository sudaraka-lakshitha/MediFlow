import { describe, expect, it } from 'vitest';
import { reviewUploadSchema, uploadPrescriptionSchema } from '../src/validators/prescriptionUpload.validator.js';

describe('prescription upload workflow validation', () => {
  it('accepts typed prescription and retail-item requests', () => {
    const text = 'Amoxicillin 500 mg twice daily\nRetail: thermometer x 1';
    const result = uploadPrescriptionSchema.safeParse({
      originalName: 'typed-prescription.txt',
      mimeType: 'text/plain',
      fileBase64: Buffer.from(text).toString('base64'),
      patientNote: 'Please quote everything together.',
      prepareRequested: true,
    });
    expect(result.success).toBe(true);
  });

  it('accepts a pharmacist rejection with a reason and no estimate', () => {
    const result = reviewUploadSchema.safeParse({
      status: 'REJECTED',
      availabilityNotes: 'The submitted text is not a valid prescription.',
      estimatedTotal: null,
    });
    expect(result.success).toBe(true);
  });
});
