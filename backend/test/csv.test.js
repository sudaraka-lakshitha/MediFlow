import { describe, expect, it } from 'vitest';
import { toCsv } from '../src/utils/csv.js';

describe('CSV export', () => {
  it('quotes cells and neutralizes spreadsheet formulas', () => {
    const output = toCsv([{ key: 'name', label: 'Name' }], [{ name: '=cmd()' }, { name: 'A "quoted" value' }]);
    expect(output).toContain("\"'=cmd()\"");
    expect(output).toContain('"A ""quoted"" value"');
  });
});
