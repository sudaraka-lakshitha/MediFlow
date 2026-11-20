import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { describeZodError, fieldLabel } from '../src/config/zodMessages.js';

describe('plain-English validation messages', () => {
  it('names the field and the rule that failed', () => {
    const schema = z.object({ trackingReference: z.string().min(3), email: z.string().email(), method: z.enum(['CASH', 'CARD']) });
    const result = schema.safeParse({ trackingReference: 'ab', email: 'x', method: 'CHEQUE' });
    const { message, fields } = describeZodError(result.error);
    expect(message).toContain('Tracking reference must be at least 3 characters');
    expect(message).toContain('Email must be a valid email address');
    expect(message).toContain('Method must be one of: CASH, CARD');
    expect(fields.map((f) => f.field)).toEqual(['trackingReference', 'email', 'method']);
  });

  it('keeps a message written in the schema', () => {
    const result = z.object({ reason: z.string().trim().min(3, 'Enter a reason of at least 3 characters.') }).safeParse({ reason: '' });
    expect(describeZodError(result.error).message).toContain('Enter a reason of at least 3 characters.');
  });

  it('reports a missing value as required and numbers list items from 1', () => {
    const result = z.object({ items: z.array(z.object({ quantity: z.number() })) }).safeParse({ items: [{}] });
    expect(describeZodError(result.error).message).toContain('Item 1 – quantity is required');
    expect(fieldLabel(['deliveryPhone'])).toBe('Delivery phone');
  });
});
