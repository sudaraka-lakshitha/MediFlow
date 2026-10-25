import ExcelJS from 'exceljs';
import yauzl from 'yauzl';
import { AppError } from '../utils/AppError.js';
import { fileURLToPath } from 'node:url';

export const deliveryColumns = ['invoice_number', 'version', 'action', 'recipient_name', 'address', 'phone', 'courier', 'tracking', 'current_status', 'dispatched_at', 'delivered_at'];
const template = new URL('../../assets/delivery-template.xlsx', import.meta.url);

export async function exportDeliveryWorkbook(deliveries) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fileURLToPath(template));
  const sheet = workbook.getWorksheet('Deliveries');
  sheet.views = [{ state: 'frozen', xSplit: 2, ySplit: 17, showGridLines: false, topLeftCell: 'C18' }];
  sheet.autoFilter = { from: 'A17', to: `K${Math.max(18, deliveries.length + 17)}` };
  for (const [index, delivery] of deliveries.entries()) {
    const row = sheet.getRow(index + 18);
    row.values = [delivery.paymentRequest.requestNumber, delivery.updatedAt.toISOString(), '', delivery.recipientName || delivery.paymentRequest.patient?.fullName || '', delivery.address, delivery.phone, delivery.courierService || '', delivery.trackingReference || '', delivery.status, delivery.dispatchedAt || '', delivery.deliveredAt || ''];
    row.height = 36;
    for (let col = 1; col <= 11; col++) {
      const cell = row.getCell(col);
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF18354B' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col >= 3 && col <= 8 ? 'FFFFF4D6' : 'FFEDF1F4' } };
      cell.numFmt = col >= 10 ? 'yyyy-mm-dd hh:mm' : '@';
      cell.alignment = { vertical: 'middle', wrapText: [4, 5].includes(col) };
    }
    row.getCell(3).dataValidation = { type: 'list', allowBlank: true, formulae: ['"DISPATCH,DELIVERED,UPDATE_TRACKING,UPDATE_DETAILS"'], showErrorMessage: true, errorTitle: 'Choose a delivery action', error: 'Select one of the actions in the dropdown.' };
  }
  return workbook.xlsx.writeBuffer();
}

// XLSX is a ZIP archive. Bound actual decompression before handing it to ExcelJS.
export async function checkWorkbookArchive(buffer) {
  if (!buffer.length || buffer.length > 1000000) throw new AppError(400, 'Excel file must be 1 MB or smaller.');
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (error, zip) => {
      if (error) return reject(new AppError(400, 'Invalid Excel file. Save as .xlsx and try again.'));
      let total = 0, count = 0, failed = false;
      const fail = message => { if (!failed) { failed = true; zip.close(); reject(new AppError(400, message)); } };
      zip.on('error', () => fail('Invalid Excel archive.'));
      zip.on('end', () => { if (!failed) resolve(); });
      zip.on('entry', entry => {
        if (++count > 150 || entry.uncompressedSize > 5_000_000 || /vbaProject|externalLinks|\.bin$/i.test(entry.fileName)) return fail('This workbook is too large or contains unsupported macros/external links.');
        zip.openReadStream(entry, (readError, stream) => {
          if (readError) return fail('Cannot read Excel archive.');
          let bytes = 0;
          const sheetXml = /^xl\/worksheets\/[^/]+\.xml$/.test(entry.fileName) ? [] : null;
          stream.on('data', chunk => {
            bytes += chunk.length; total += chunk.length;
            sheetXml?.push(chunk);
            if (bytes > 5_000_000 || total > 10_000_000) { stream.destroy(); fail('Workbook expands beyond the safe upload limit.'); }
          });
          stream.on('error', () => fail('Invalid Excel archive contents.'));
          stream.on('end', () => {
            if (sheetXml && !failed) {
              const xml = Buffer.concat(sheetXml).toString('utf8');
              for (const match of xml.matchAll(/<(?:row|c)\b[^>]*\br=["']([A-Z]*)(\d+)["']/g)) {
                if (Number(match[2]) > 1000 || (match[1] && (match[1].length > 1 || match[1] > 'T'))) return fail('Workbook contains cells outside the supported delivery table size.');
              }
              for (const range of xml.matchAll(/\b(?:ref|sqref)=["']([^"']+)["']/g)) {
                for (const match of range[1].matchAll(/([A-Z]+)\$?(\d+)/g)) {
                  if (Number(match[2]) > 1000 || match[1].length > 1 || match[1] > 'T') return fail('Workbook contains oversized ranges. Use the exported template without full-column rules.');
                }
              }
            }
            if (!failed) zip.readEntry();
          });
        });
      });
      zip.readEntry();
    });
  });
}

export async function readDeliveryWorkbook(buffer) {
  await checkWorkbookArchive(buffer);
  const workbook = new ExcelJS.Workbook();
  try { await workbook.xlsx.load(buffer, { ignoreNodes: ['drawing', 'picture', 'extLst', 'conditionalFormatting'] }); }
  catch { throw new AppError(400, 'Cannot read workbook. Use the exported .xlsx template.'); }
  const sheet = workbook.getWorksheet('Deliveries');
  if (!sheet || sheet.rowCount > 1000 || sheet.columnCount > 20) throw new AppError(400, 'Use the Deliveries sheet from the exported template.');
  let headerRow = 0, headers;
  for (let index = 1; index <= Math.min(sheet.rowCount, 40); index++) {
    const values = sheet.getRow(index).values.slice(1).map(value => String(value ?? '').trim());
    if (values.includes('invoice_number') && values.includes('version')) { headerRow = index; headers = values; break; }
  }
  if (!headers || headers.some(header => !deliveryColumns.includes(header)) || new Set(headers).size !== headers.length || !headers.includes('action')) throw new AppError(400, 'Delivery column headers are missing, duplicated or invalid.');
  const rows = [];
  for (let index = headerRow + 1; index <= sheet.rowCount; index++) {
    const row = sheet.getRow(index);
    if (!row.hasValues) continue;
    const data = {};
    for (const [col, header] of headers.entries()) {
      const value = row.getCell(col + 1).value;
      if (value && typeof value === 'object' && !(value instanceof Date)) throw new AppError(400, `Row ${index}: use plain values, not formulas or hyperlinks.`);
      data[header] = value instanceof Date ? value.toISOString() : String(value ?? '').trim();
    }
    if (Object.values(data).some(Boolean)) rows.push({ ...data, __sourceRow: String(index) });
    if (rows.length > 50) throw new AppError(400, 'Keep at most 50 delivery data rows per upload.');
  }
  if (!rows.length) throw new AppError(400, 'The workbook has no delivery rows.');
  return rows;
}
