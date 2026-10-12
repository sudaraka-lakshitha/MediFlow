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

  it('requires a recipient birth date when medicines are for someone else', () => {
    const result = uploadPrescriptionSchema.safeParse({
      originalName: 'child-prescription.txt',
      mimeType: 'text/plain',
      fileBase64: Buffer.from('Paracetamol prescription').toString('base64'),
      prepareRequested: true,
      orderedForSelf: false,
      recipientName: 'Test Child',
      recipientRelationship: 'Child',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'recipientDateOfBirth')).toBe(true);
  });

  it('accepts third-party uploads with recipient age, allergies, and chronic conditions', () => {
    const result = uploadPrescriptionSchema.safeParse({
      originalName: 'child-prescription.txt',
      mimeType: 'text/plain',
      fileBase64: Buffer.from('Paracetamol prescription').toString('base64'),
      prepareRequested: true,
      orderedForSelf: false,
      recipientName: 'Test Child',
      recipientRelationship: 'Child',
      recipientDateOfBirth: '2018-06-15',
      recipientAllergies: 'Penicillin, Peanuts',
      recipientConditions: 'Asthma',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recipientAllergies).toBe('Penicillin, Peanuts');
      expect(result.data.recipientConditions).toBe('Asthma');
    }
  });
});
