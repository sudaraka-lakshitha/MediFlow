import { z } from 'zod';

// Plain-English validation messages. A message written in a schema
// (for example .min(3, 'Enter a reason')) still takes priority over these.
const units = { string: 'characters', array: 'items', set: 'items', file: 'bytes' };
const plural = (n, word) => `${n} ${n === 1 ? word.replace(/s$/, '') : word}`;

export const friendlyIssue = (issue) => {
  const received = issue.input;
  switch (issue.code) {
    case 'invalid_type':
      if (received === undefined || received === null || received === '') return 'is required';
      return `must be ${issue.expected === 'number' || issue.expected === 'int' ? 'a number' : issue.expected === 'boolean' ? 'yes or no' : issue.expected === 'date' ? 'a valid date' : `a ${issue.expected}`}`;
    case 'too_small': {
      const min = Number(issue.minimum);
      if (issue.origin === 'string') return min <= 1 ? 'is required' : `must be at least ${plural(min, 'characters')}`;
      if (issue.origin === 'array' || issue.origin === 'set') return `needs at least ${plural(min, 'items')}`;
      if (issue.origin === 'date') return 'is too early';
      return issue.inclusive === false ? `must be more than ${min}` : `must be at least ${min}`;
    }
    case 'too_big': {
      const max = Number(issue.maximum);
      if (issue.origin === 'string') return `must be ${plural(max, 'characters')} or fewer`;
      if (issue.origin === 'array' || issue.origin === 'set') return `can have at most ${plural(max, 'items')}`;
      if (issue.origin === 'date') return 'is too late';
      return issue.inclusive === false ? `must be less than ${max}` : `must be ${max} or less`;
    }
    case 'invalid_format':
      if (issue.format === 'email') return 'must be a valid email address';
      if (issue.format === 'url') return 'must be a valid web address';
      if (['date', 'datetime', 'time'].includes(issue.format)) return 'must be a valid date or time';
      return 'is not in the expected format';
    case 'invalid_value':
      return issue.values?.length && issue.values.length <= 8 ? `must be one of: ${issue.values.join(', ')}` : 'has a value that is not allowed';
    case 'not_multiple_of':
      return `must be a multiple of ${issue.divisor}`;
    case 'unrecognized_keys':
      return `contains unexpected field${issue.keys?.length === 1 ? '' : 's'}: ${(issue.keys || []).join(', ')}`;
    case 'invalid_union':
      return 'is not valid';
    default:
      return undefined;
  }
};

z.config({ customError: friendlyIssue });

// "items.0.quantity" -> "Item 1 quantity"; "trackingReference" -> "Tracking reference".
const words = (key) => String(key).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').toLowerCase();
const singular = (word) => word.endsWith('ies') ? `${word.slice(0, -3)}y` : word.endsWith('s') ? word.slice(0, -1) : word;
export const fieldLabel = (path = []) => {
  const parts = [];
  path.forEach((part, index) => {
    if (typeof part === 'number') {
      const previous = parts.pop() || 'item';
      parts.push(`${singular(previous)} ${part + 1}`);
    } else parts.push(words(part));
  });
  const text = parts.join(' – ');
  return text ? text[0].toUpperCase() + text.slice(1) : '';
};

export const describeZodError = (error) => {
  const fields = error.issues.map((issue) => {
    const label = fieldLabel(issue.path);
    return { field: issue.path.join('.'), label, message: issue.message };
  });
  const lines = fields.map(({ label, message }) => label ? `${label} ${message}` : message);
  const unique = [...new Set(lines)];
  const shown = unique.slice(0, 5);
  const more = unique.length > shown.length ? ` (and ${unique.length - shown.length} more)` : '';
  return { message: `Please check: ${shown.join('; ')}${more}.`, fields };
};
