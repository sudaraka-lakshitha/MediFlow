import { afterEach, describe, expect, it, vi } from 'vitest';
import { notFutureCalendarDate } from '../src/validators/calendar.js';
import { uploadSlipSchema } from '../src/validators/prescriptionUpload.validator.js';
import { paymentSlipSchema } from '../src/controllers/paymentRequest.controller.js';

// 20 Nov 2026, 00:30 in Sri Lanka is still 19 Nov 2026, 19:00 in UTC.
const justAfterMidnightInColombo = new Date('2026-11-19T19:00:00Z');

describe('dates typed into date boxes use the Sri Lanka calendar day', () => {
  afterEach(() => vi.useRealTimers());

  it('accepts today just after midnight in Colombo', () => {
    vi.useFakeTimers({ now: justAfterMidnightInColombo });
    const result = notFutureCalendarDate('future').safeParse('2026-11-20');
    expect(result.success).toBe(true);
    expect(result.data.toISOString()).toBe('2026-11-20T00:00:00.000Z');
  });

  it('still rejects tomorrow', () => {
    vi.useFakeTimers({ now: justAfterMidnightInColombo });
    const result = notFutureCalendarDate('Cannot be in the future.').safeParse('2026-11-21');
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Cannot be in the future.');
  });

  it('accepts a transfer slip dated today at 00:30 for both slip forms', () => {
    vi.useFakeTimers({ now: justAfterMidnightInColombo });
    const slip = { originalName: 'slip.png', mimeType: 'image/png', fileBase64: 'iVBORw0KGgo=', declaredAmount: 1500, paidOn: '2026-11-20' };
    expect(uploadSlipSchema.safeParse(slip).success).toBe(true);
    expect(paymentSlipSchema.safeParse(slip).success).toBe(true);
  });

  it('keeps optional dates optional and checks the earliest date', () => {
    const schema = notFutureCalendarDate('future', { earliest: '1895-01-01', earliestMessage: 'too old' }).optional().nullable();
    expect(schema.safeParse(null).data).toBeNull();
    expect(schema.safeParse(undefined).data).toBeUndefined();
    expect(schema.safeParse('1890-01-01').error.issues[0].message).toBe('too old');
  });
});
