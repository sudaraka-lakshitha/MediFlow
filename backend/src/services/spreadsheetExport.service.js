import ExcelJS from 'exceljs';
import { AppError } from '../utils/AppError.js';

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const readableLabel = key => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
// Text is assigned as text, never interpreted as formulas. Keep identifiers as strings.
export async function createDataWorkbook({ title, sheetName = 'Data', columns, rows = [], pages, notes = [], summary = [] }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MediFlow'; workbook.created = new Date();
  const sheet = workbook.addWorksheet(sheetName, { views: [{ state: 'frozen', ySplit: 0, showGridLines: false }] });
  const width = Math.max(columns.length, 2);
  const instruction = (text, heading = false) => {
    const row = sheet.addRow([text]); sheet.mergeCells(row.number, 1, row.number, width);
    row.font = { name: 'Arial', size: heading ? 16 : 10, bold: heading, color: { argb: heading ? 'FF18354B' : 'FF526779' } };
    row.height = heading ? 32 : 30; row.alignment = { vertical: 'middle', wrapText: true };
  };
  instruction(title, true);
  for (const note of notes) instruction(note);
  for (const item of summary) instruction(`${item.label}: ${item.value}`);
  sheet.addRow([]);
  const header = sheet.addRow(columns.map(c => c.label || readableLabel(c.key)));
  header.height = 32; header.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF18354B' } };
  header.alignment = { vertical: 'middle', wrapText: true };
  sheet.views = [{ state: 'frozen', ySplit: header.number, showGridLines: false }];
  for (const [i, c] of columns.entries()) sheet.getColumn(i + 1).width = c.width || (/reason|address|description|product|name|task/i.test(c.key) ? 36 : 22);
  let count = 0;
  const append = row => {
    if (++count > 50_000) throw new AppError(413, 'Excel exports support up to 50,000 rows. Narrow the filters or use CSV for the complete extract.');
    const excelRow = sheet.addRow(columns.map(c => {
      let value = row[c.key];
      if (value == null) return '';
      if (value instanceof Date) return value;
      if (c.numeric) { const n = Number(value); return Number.isFinite(n) ? n : String(value); }
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return typeof value === 'number' ? value : String(value);
    }));
    excelRow.height = 30; excelRow.font = { name: 'Arial', size: 10, color: { argb: 'FF18354B' } };
    excelRow.alignment = { vertical: 'middle', wrapText: true };
    if (count % 2) excelRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F6F8' } };
    columns.forEach((c, i) => { if (c.numeric) excelRow.getCell(i+1).numFmt = c.numberFormat || (/quantity|stock|opening|received|dispensed|adjustments|closing/i.test(c.key) && !/value|price|cost/i.test(c.key) ? '#,##0.###' : /transactions|reorderLevel/.test(c.key) ? '#,##0' : '#,##0.00'); else if (excelRow.getCell(i+1).value instanceof Date) excelRow.getCell(i+1).numFmt = 'yyyy-mm-dd'; });
  };
  if (pages) { for await (const page of pages) for (const row of page) append(row); }
  else rows.forEach(append);
  sheet.autoFilter = { from: { row: header.number, column: 1 }, to: { row: Math.max(header.number, sheet.rowCount), column: columns.length } };
  return { buffer: Buffer.from(await workbook.xlsx.writeBuffer()), rowCount: count };
}
