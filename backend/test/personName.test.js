import { describe, expect, it } from 'vitest';
import { personNameSchema, optionalPersonNameSchema } from '../src/validators/personName.js';
import { registerSchema, staffSchema, staffUpdateSchema } from '../src/validators/auth.validator.js';
import { createPatientSchema, updatePatientSchema, updateOwnProfileSchema } from '../src/validators/patient.validator.js';
import { prescriptionSchema } from '../src/validators/prescription.validator.js';
import { uploadPrescriptionSchema } from '../src/validators/prescriptionUpload.validator.js';
import { normalizePersonName, personNamePattern, personNameInputProps } from '../../frontend/src/utils/personName';

const browserPattern = new RegExp(`^(?:${personNamePattern})$`, 'v');
const validNames = [
  ['  john   smith  ', 'John Smith'],
  ['anne-marie', 'Anne-Marie'],
  ["o'connor", "O'Connor"],
  ['o’connor', 'O’Connor'],
  ['a. b. perera', 'A. B. Perera'],
  ['a.b.perera', 'A.B.Perera'],
  ['McDonald', 'McDonald'],
  ['de Silva', 'De Silva'],
];
const invalidNames = ['John123', '123', 'John@Smith', 'John#Smith', 'John/Smith', 'John_Smith', 'José', 'සුදාරක', 'தமிழ்', '李', '...', "---", "'John", 'John--Smith', 'John\nSmith', 'John\tSmith'];

describe('English person names', () => {
  it.each(validNames)('normalizes %s consistently without lowercasing existing letters', (input, expected) => {
    expect(personNameSchema.parse(input)).toBe(expected);
    expect(normalizePersonName(input)).toBe(expected);
    expect(browserPattern.test(expected)).toBe(true);
  });
  it.each(invalidNames)('rejects %s in both browser and backend validation', value => {
    expect(personNameSchema.safeParse(value).success).toBe(false);
    expect(browserPattern.test(value)).toBe(false);
  });
  it('validates type and length and permits empty optional recipient fields', () => {
    for (const value of [123, {}, '', ' ', 'A', 'A'.repeat(151)]) expect(personNameSchema.safeParse(value).success).toBe(false);
    for (const value of [null, undefined, '']) expect(optionalPersonNameSchema.safeParse(value).success).toBe(true);
  });
  it('normalizes on blur without rewriting each keystroke', () => {
    let value = 'john smith';
    const props = personNameInputProps(next => { value = next; });
    expect(props).not.toHaveProperty('onChange');
    props.onBlur({ currentTarget: { value } });
    expect(value).toBe('John Smith');
  });
});

describe('name validation across write endpoints', () => {
  const fields = [
    registerSchema.shape.fullName, staffSchema.shape.fullName, staffUpdateSchema.shape.fullName,
    createPatientSchema.shape.fullName, updatePatientSchema.shape.fullName, updateOwnProfileSchema.shape.fullName,
    prescriptionSchema.shape.prescriberName, prescriptionSchema.shape.recipientName, uploadPrescriptionSchema.shape.recipientName,
  ];
  it.each(fields.map((schema, index) => ({ schema, index })))('enforces and normalizes name field $index', ({ schema }) => {
    expect(schema.safeParse('John123').success).toBe(false);
    expect(schema.safeParse('தமிழ்').success).toBe(false);
    expect(schema.parse('jane doe')).toBe('Jane Doe');
  });
  it('still requires a recipient name for uploads on behalf of someone else', () => {
    const result = uploadPrescriptionSchema.safeParse({
      originalName: 'sample.txt', mimeType: 'text/plain', fileBase64: 'dGVzdA==', prepareRequested: true,
      orderedForSelf: false, recipientName: ' ', recipientRelationship: 'Child', recipientDateOfBirth: '2000-01-01',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues.some(issue => issue.path[0] === 'recipientName')).toBe(true);
  });
});
