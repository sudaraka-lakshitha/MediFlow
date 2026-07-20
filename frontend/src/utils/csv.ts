export function parseCsv(text: string) {
  const matrix: string[][] = []; let row: string[] = []; let field = ''; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') { field += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { row.push(field); field = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) { if (character === '\r' && text[index + 1] === '\n') index += 1; row.push(field); field = ''; if (row.some((cell) => cell.trim())) matrix.push(row); row = []; }
    else field += character;
  }
  if (field || row.length) { row.push(field); if (row.some((cell) => cell.trim())) matrix.push(row); }
  if (!matrix.length) return [];
  const headers = matrix[0].map((header) => header.trim().replace(/^\uFEFF/, ''));
  return matrix.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ''])));
}
