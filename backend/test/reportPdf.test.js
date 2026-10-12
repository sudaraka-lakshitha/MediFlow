import { describe, expect, it } from 'vitest';
import zlib from 'node:zlib';
import { createPdf } from '../src/utils/pdf.js';

// PDFKit Flate-compresses its content streams and writes text as hex strings, so a raw
// byte search silently never matches - assertions written that way pass for the wrong
// reason. Inflate first, then decode the text operators back to characters.
const readPdfText = (buffer) => {
  const bin = buffer.toString('latin1');
  const streams = [];
  let cursor = 0;
  for (;;) {
    const open = bin.indexOf('stream', cursor);
    if (open < 0) break;
    if (open >= 3 && bin.slice(open - 3, open) === 'end') { cursor = open + 6; continue; }
    let start = open + 'stream'.length;
    if (bin[start] === '\r') start += 1;
    if (bin[start] === '\n') start += 1;
    const end = bin.indexOf('endstream', start);
    if (end < 0) break;
    try {
      streams.push(zlib.inflateSync(Buffer.from(bin.slice(start, end), 'latin1')).toString('latin1'));
    } catch { /* fonts and images are not text streams */ }
    cursor = end + 'endstream'.length;
  }
  const content = streams.join('\n');
  const pieces = [];
  const token = /<([0-9A-Fa-f\s]+)>|\((?:\\.|[^\\()])*\)/g;
  let match;
  while ((match = token.exec(content)) !== null) {
    if (match[1] !== undefined) {
      const hex = match[1].replace(/\s+/g, '');
      let text = '';
      for (let i = 0; i + 1 < hex.length; i += 2) text += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
      pieces.push(text);
    } else {
      pieces.push(match[0].slice(1, -1).replace(/\\(.)/g, '$1'));
    }
  }
  return pieces.join('');
};

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'product', label: 'Product' },
  { key: 'closing', label: 'Closing' },
];
const manyRows = (count) => Array.from({ length: count }, (_, index) => ({
  sku: `MED-A-VERY-LONG-PRODUCT-CODE-${index}`,
  product: `Product number ${index}`,
  closing: 1000 + index,
}));

describe('report PDF rendering', () => {
  it('repeats the column header on every page of a long report', async () => {
    // Regression: only the first page carried a header, so every later page of a
    // multi-page report was an unlabelled wall of numbers.
    const text = readPdfText(await createPdf({
      title: 'MediFlow Monthly Report', subtitle: 'Period: 2026-08', columns, rows: manyRows(120),
    }));
    const pageCount = Number((text.match(/Page 1 of (\d+)/) || [])[1] || 0);
    const headerCount = (text.match(/SKUProductClosing/g) || []).length;
    expect(pageCount).toBeGreaterThan(1);
    expect(headerCount).toBe(pageCount);
  });

  it('marks continuation pages so a printed stack stays in order', async () => {
    const text = readPdfText(await createPdf({
      title: 'MediFlow Monthly Report', subtitle: 'Period: 2026-08', columns, rows: manyRows(120),
    }));
    expect(text).toMatch(/\(continued\)/);
  });

  it('gives wide columns the room they need instead of an equal slice', async () => {
    const text = readPdfText(await createPdf({
      title: 'Report', subtitle: 'Period', columns, rows: manyRows(3),
    }));
    expect(text).toContain('MED-A-VERY-LONG-PRODUCT-CODE-0');
  });

  it('formats large numbers with thousands separators', async () => {
    const text = readPdfText(await createPdf({
      title: 'Report', subtitle: 'Period', columns, rows: [{ sku: 'A', product: 'B', closing: 1573 }],
    }));
    expect(text).toContain('1,573');
  });

  it('says so explicitly when a period has no records', async () => {
    const text = readPdfText(await createPdf({
      title: 'Report', subtitle: 'Period', columns, rows: [],
    }));
    expect(text).toContain('Detailed records (0)');
    expect(text).toMatch(/No records matched/);
  });

  it('numbers every page and never invents a blank trailing one', async () => {
    const text = readPdfText(await createPdf({
      title: 'Report', subtitle: 'Period', columns, rows: manyRows(60),
    }));
    const declared = Number((text.match(/Page 1 of (\d+)/) || [])[1] || 0);
    const footers = (text.match(/Page \d+ of \d+/g) || []).length;
    expect(footers).toBe(declared);
  });
});
