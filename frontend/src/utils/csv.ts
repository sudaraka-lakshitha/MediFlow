export function parseCsv(text: string) {
  const matrix: { cells: string[]; line: number }[] = []; let row: string[] = []; let field = ''; let quoted = false; let closed = false; let line = 1; let startLine = 1;
  text = text.replace(/^\uFEFF/, '');
  const finishField = () => { row.push(field); field = ''; closed = false; };
  const finishRow = () => { finishField(); if (row.some((cell) => cell.trim())) matrix.push({ cells: row, line: startLine }); row = []; };
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (quoted) { quoted = false; closed = true; }
      else if (!field && !closed) quoted = true;
      else throw new Error(`Line ${line}: unexpected quote. Save as CSV UTF-8 with correctly quoted cells.`);
    } else if (character === ',' && !quoted) finishField();
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      finishRow(); line++; startLine = line;
    } else {
      if (closed) { if (character === ' ' || character === '\t') continue; throw new Error(`Line ${line}: unexpected text after a closing quote.`); }
      field += character;
      if (character === '\n') line++;
    }
  }
  if (quoted) throw new Error(`Line ${startLine}: a quoted cell was not closed.`);
  if (field || row.length || closed) finishRow();
  if (!matrix.length) return [];
  const headers = matrix[0].cells.map((header) => header.trim());
  if (headers.some((header) => !header)) throw new Error('The header row contains an empty column name. Remove unused columns.');
  if (new Set(headers.map((header) => header.toLowerCase())).size !== headers.length) throw new Error('The header row contains duplicate column names.');
  if (!headers.some((header) => header.toLowerCase() === 'sku')) throw new Error('The file must contain a SKU column. Use the Products sheet, not the Guide sheet.');
  if (matrix.length > 2001) throw new Error('Upload at most 2,000 product rows per file.');
  return matrix.slice(1).map(({ cells, line: rowLine }) => {
    if (cells.length !== headers.length) throw new Error(`Line ${rowLine}: expected ${headers.length} cells but found ${cells.length}. Check commas and quotes.`);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index].trim()]));
  });
}
