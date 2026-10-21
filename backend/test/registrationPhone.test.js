import { describe, expect, it } from 'vitest';
import { registerSchema } from '../src/validators/auth.validator.js';

describe('registration phone formats', () => {
  it.each(['0701234567', '+94701234567'])('accepts %s and stores the existing local format', value => {
    expect(registerSchema.shape.phone.parse(value)).toBe('0701234567');
  });
  it.each(['+940701234567', '94701234567', '070123456', '07012345678', '+9470123456', '070 1234567', '070-1234567', 'abcdefghi', ''])('rejects invalid format %s', value => {
    expect(registerSchema.shape.phone.safeParse(value).success).toBe(false);
  });
});
