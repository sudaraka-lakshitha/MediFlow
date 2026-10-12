import { Prisma } from '@prisma/client';
import { once } from 'node:events';

const protectSpreadsheet = (value) => {
  if ((typeof value === 'number' && Number.isFinite(value)) || Prisma.Decimal.isDecimal(value)) return String(value);
  const text = value == null ? '' : String(value);
  return /^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? `'${text}` : text;
};

const escape = (value) => `"${protectSpreadsheet(value).replaceAll('"', '""')}"`;
const cell = (column, value) => column.numeric && typeof value === 'string' && /^-?\d+(\.\d+)?%?$/.test(value)
  ? `"${value}"` : escape(value);

export const toCsv = (columns, rows) => {
  const header = columns.map((column) => escape(column.label)).join(',');
  const body = rows.map((row) => columns.map((column) => cell(column, row[column.key])).join(',')).join('\r\n');
  return `${header}\r\n${body}${body ? '\r\n' : ''}`;
};

export const streamCsv = async (res, columns, pages) => {
  let count = 0;
  const write = async (chunk) => {
    if (res.destroyed) throw new Error('Export download was disconnected.');
    if (!res.write(chunk)) {
      const controller = new AbortController();
      try { await Promise.race([once(res, 'drain', { signal: controller.signal }), once(res, 'close', { signal: controller.signal }).then(() => { throw new Error('Export download was disconnected.'); })]); }
      finally { controller.abort(); }
    }
  };
  await write(`\uFEFF${toCsv(columns, [])}`);
  for await (const rows of pages) {
    if (rows.length) await write(rows.map((row) => columns.map((column) => cell(column, row[column.key])).join(',')).join('\r\n') + '\r\n');
    count += rows.length;
  }
  res.end();
  return count;
};
