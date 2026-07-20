const protectSpreadsheet = (value) => {
  const text = value == null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
};

const escape = (value) => `"${protectSpreadsheet(value).replaceAll('"', '""')}"`;

export const toCsv = (columns, rows) => {
  const header = columns.map((column) => escape(column.label)).join(',');
  const body = rows.map((row) => columns.map((column) => escape(row[column.key])).join(',')).join('\r\n');
  return `${header}\r\n${body}${body ? '\r\n' : ''}`;
};
