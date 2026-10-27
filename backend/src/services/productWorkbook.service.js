import ExcelJS from 'exceljs';
import { checkWorkbookArchive } from './deliveryWorkbook.service.js';
import { AppError } from '../utils/AppError.js';
import { productBulkFields } from '../utils/productBulkFormat.js';

const fieldAliases = new Map(
  productBulkFields.flatMap((f) => [
    [f.key.toLowerCase(), f.key],
    [f.label.toLowerCase(), f.key],
  ]),
);

export async function readProductWorkbook(buffer) {
  await checkWorkbookArchive(buffer);
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer, {
      ignoreNodes: ['drawing', 'picture', 'extLst', 'conditionalFormatting'],
    });
  } catch {
    throw new AppError(400, 'Cannot read product workbook. Ensure the file is a valid .xlsx spreadsheet.');
  }

  const sheet = workbook.getWorksheet('Products') || workbook.worksheets[0];
  if (!sheet || sheet.rowCount > 3000 || sheet.columnCount > 40) {
    throw new AppError(400, 'Invalid product sheet. Use the MediFlow Product Bulk Import Template.');
  }

  let headerRow = 0;
  let headers = [];

  for (let r = 1; r <= Math.min(sheet.rowCount, 40); r++) {
    const rawValues = sheet.getRow(r).values;
    if (!Array.isArray(rawValues)) continue;
    const values = rawValues.slice(1).map((v) => String(v ?? '').trim().toLowerCase());
    if (values.includes('sku') || values.includes('sku / code')) {
      headerRow = r;
      headers = values;
      break;
    }
  }

  if (!headerRow || !headers.length) {
    throw new AppError(400, 'Could not find header row with SKU in the uploaded workbook.');
  }

  const mappedHeaders = headers.map((rawHeader) => fieldAliases.get(rawHeader) || null);
  const rows = [];

  for (let r = headerRow + 1; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    if (!row.hasValues) continue;
    const data = {};
    for (let c = 0; c < mappedHeaders.length; c++) {
      const key = mappedHeaders[c];
      if (!key) continue;
      const cell = row.getCell(c + 1);
      let val = cell.value;
      if (val && typeof val === 'object' && !(val instanceof Date)) {
        if ('text' in val) val = val.text;
        else if ('result' in val) val = val.result;
        else throw new AppError(400, `Row ${r}: Formulas and hyperlinks are not allowed.`);
      }
      if (val instanceof Date) {
        val = val.toISOString().split('T')[0];
      }
      data[key] = String(val ?? '').trim();
    }

    if (data.sku) {
      rows.push(data);
    }

    if (rows.length > 2000) {
      throw new AppError(400, 'Keep at most 2,000 product rows per upload.');
    }
  }

  if (!rows.length) {
    throw new AppError(400, 'The product workbook has no valid data rows.');
  }

  return rows;
}
