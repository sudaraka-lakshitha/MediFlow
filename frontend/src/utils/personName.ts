import type { FocusEvent } from 'react';

export const personNamePattern = "[A-Za-z]+(?:(?: +|[.'’\\x2D] *)[A-Za-z]+)*\\.?";
export const normalizePersonName = (value: string) => value.trim().replace(/ +/g, ' ')
  .replace(/(^|[ .'’-])([a-z])/g, (_, separator: string, letter: string) => separator + letter.toUpperCase());

export const personNameInputProps = (onChange: (value: string) => void) => ({
  minLength: 2,
  maxLength: 150,
  pattern: personNamePattern,
  title: 'Use English letters, spaces, apostrophes, hyphens, or periods only.',
  onBlur: (event: FocusEvent<HTMLInputElement>) => onChange(normalizePersonName(event.currentTarget.value)),
});
