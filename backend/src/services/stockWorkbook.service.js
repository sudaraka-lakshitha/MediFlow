import ExcelJS from 'exceljs';
import { checkWorkbookArchive } from './deliveryWorkbook.service.js';
import { AppError } from '../utils/AppError.js';
import { workbookLimits } from '../utils/workbookLimits.js';

export const stockColumns = [
  'action',
  'sku',
  'batch_number',
  'quantity',
  'purchase_price',
  'expiry_date',
  'supplier_name',
  'reason',
  'current_stock',
  'unit',
  'product_name',
];

export const resolveHeader = (header) => {
  const clean = String(header ?? '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.includes('sku') || clean.includes('code') || clean.includes('barcode')) return 'sku';
  if (clean.includes('batch') || clean.includes('lot')) return 'batch_number';
  if (clean.includes('qty') || clean.includes('quantity')) return 'quantity';
  if (clean.includes('cost') || clean.includes('price')) return 'purchase_price';
  if (clean.includes('expir')) return 'expiry_date';
  if (clean.includes('supplier')) return 'supplier_name';
  if (clean.includes('reason') || clean.includes('note')) return 'reason';
  if (clean.includes('action')) return 'action';
  if (clean.includes('unit')) return 'unit';
  if (clean.includes('stock')) return 'current_stock';
  if (clean.includes('product name')) return 'product_name';
  return null;
};

export async function createStockTemplateWorkbook(batches = [], { examples = true } = {}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MediFlow Pharmacy System';
  workbook.lastModifiedBy = 'MediFlow Inventory Engine';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet('Stock', {
    properties: { tabColor: { argb: 'FF0F766E' } },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 10, showGridLines: true }],
  });

  // Banner Row 1
  sheet.mergeCells('A1:K1');
  const banner = sheet.getCell('A1');
  banner.value = 'MediFlow Pharmacy Inventory - Bulk Stock Batch Update';
  banner.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  banner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF18354B' } };
  banner.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(1).height = 32;

  // Instructions in Rows 2-8
  const instructions = [
    'INSTRUCTIONS: Follow the guidance below to receive new batches or update stock counts.',
    '• ACTION: RECEIVE/RESTOCK adds stock; ADJUST is a signed change; SET_COUNT is the total physically counted.',
    '• SKU: Product code or barcode matching an active item in your MediFlow Product Catalogue.',
    '• QUANTITY: Whole numbers for countable items; measured units such as mL/g allow up to 3 decimal places. Leave reference columns unchanged.',
    '• EXPIRY DATE: Enter in YYYY-MM-DD format (e.g. 2027-12-31). New receipts must have future expiry dates.',
    '• SUPPLIER: Match one active supplier exactly. Blank preserves the current supplier; [CLEAR] removes it. No supplier is assumed for a new batch.',
    '• AMBER (A-H): Editable. Blank cost/expiry preserves existing values; both are required for a new batch. Replace example rows before upload.',
  ];

  instructions.forEach((text, idx) => {
    const rowNum = idx + 2;
    sheet.mergeCells(`A${rowNum}:K${rowNum}`);
    const cell = sheet.getCell(`A${rowNum}`);
    cell.value = text;
    cell.font = { name: 'Arial', size: 9, bold: idx === 0, color: { argb: idx === 0 ? 'FF0F766E' : 'FF334155' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    cell.alignment = { vertical: 'middle', indent: 1 };
    sheet.getRow(rowNum).height = 18;
  });

  sheet.getRow(9).height = 8; // Spacer

  // Header Row 10
  const headers = [
    { label: 'Action', width: 22, col: 1 },
    { label: 'Product SKU / Code', width: 24, col: 2 },
    { label: 'Batch Number', width: 20, col: 3 },
    { label: 'Quantity', width: 16, col: 4 },
    { label: 'Purchase Price (Rs.)', width: 20, col: 5 },
    { label: 'Expiry Date (YYYY-MM-DD)', width: 24, col: 6 },
    { label: 'Supplier Name', width: 34, col: 7 },
    { label: 'Reason / Note', width: 28, col: 8 },
    { label: 'Current Stock (Ref)', width: 18, col: 9 },
    { label: 'Unit (Ref)', width: 14, col: 10 },
    { label: 'Product Name (Ref)', width: 36, col: 11 },
  ];

  const headerRow = sheet.getRow(10);
  headerRow.height = 28;
  headers.forEach(({ label, width, col }) => {
    sheet.getColumn(col).width = width;
    const cell = headerRow.getCell(col);
    cell.value = label;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: col <= 8 ? 'FF78350F' : 'FF334155' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col <= 8 ? 'FFFDE68A' : 'FFE2E8F0' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    };
  });

  // Data rows
  const rowsData = batches.length || !examples ? batches : [
    {
      action: 'RECEIVE',
      sku: 'MED-AMOXICILLIN-ML',
      batchNumber: 'AMX-ML-2026-N1',
      quantity: 2500,
      purchasePrice: 3.50,
      expiryDate: '2027-12-31',
      supplierName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
      reason: 'Paediatric syrup stock receipt',
      currentStock: 2500,
      unit: 'ml',
      productName: 'Amoxicillin Paediatric Oral Suspension 125mg/5mL',
    },
    {
      action: 'RECEIVE',
      sku: 'MED-AMOXICILLIN-500-MG',
      batchNumber: 'AMX-2026-N1',
      quantity: 1000,
      purchasePrice: 8.50,
      expiryDate: '2028-06-30',
      supplierName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
      reason: 'Wholesale antibiotic restock',
      currentStock: 500,
      unit: 'capsule',
      productName: 'Amoxicillin 500mg Capsules',
    },
    {
      action: 'ADJUST',
      sku: 'MED-PARACETAMOL-ML',
      batchNumber: 'ML-PAN-2601',
      quantity: 100,
      purchasePrice: 1.50,
      expiryDate: '2028-10-26',
      supplierName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
      reason: 'Stocktake count adjustment (+100 mL)',
      currentStock: 2500,
      unit: 'ml',
      productName: 'Paracetamol Paediatric Oral Suspension 120mg/5mL',
    },
  ];

  rowsData.forEach((item, index) => {
    const rowNum = index + 11;
    const row = sheet.getRow(rowNum);
    row.height = 24;
    row.values = [
      item.action || 'RECEIVE',
      item.sku,
      item.batchNumber,
      item.quantity,
      item.purchasePrice,
      typeof item.expiryDate === 'string' ? item.expiryDate : (item.expiryDate?.toISOString?.()?.split('T')[0] || ''),
      item.supplierName || '',
      item.reason || '',
      item.currentStock ?? '',
      item.unit || '',
      item.productName || '',
    ];

    for (let col = 1; col <= 11; col++) {
      const cell = row.getCell(col);
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF18354B' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: col <= 8 ? 'FFFFF4D6' : 'FFEDF1F4' },
      };
      cell.alignment = { vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      if (col === 4 || col === 5 || col === 9) {
        cell.numFmt = col === 5 ? '#,##0.00' : '#,##0.###';
      }
      if (col === 6) {
        cell.numFmt = 'yyyy-mm-dd';
      }
    }

    // Dropdown for Action
    row.getCell(1).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"RECEIVE,ADJUST,SET_COUNT,RESTOCK"'],
      showErrorMessage: true,
      errorTitle: 'Select Action',
      error: 'Select RECEIVE, ADJUST, SET_COUNT, or RESTOCK from the dropdown.',
    };
  });

  sheet.autoFilter = { from: 'A10', to: `K${Math.max(11, rowsData.length + 10)}` };
  return workbook;
}

export async function exportStockWorkbook(batches = [], options = { examples: false }) {
  const workbook = await createStockTemplateWorkbook(batches, options);
  return workbook.xlsx.writeBuffer();
}

export async function readStockWorkbook(buffer) {
  await checkWorkbookArchive(buffer, workbookLimits.stock);
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer, {
      ignoreNodes: ['drawing', 'picture', 'extLst', 'conditionalFormatting'],
    });
  } catch {
    throw new AppError(400, 'Cannot read workbook. Make sure it is a valid .xlsx file.');
  }

  const sheet = workbook.getWorksheet('Stock') || workbook.getWorksheet('Inventory') || workbook.worksheets[0];
  if (!sheet || sheet.rowCount > 2000 || sheet.columnCount > 30) {
    throw new AppError(400, 'Invalid stock update sheet. Use the exported MediFlow template.');
  }

  let headerRow = 0;
  let headers = [];

  for (let r = 1; r <= Math.min(sheet.rowCount, 40); r++) {
    const rawValues = sheet.getRow(r).values;
    if (!Array.isArray(rawValues)) continue;
    const values = rawValues.slice(1).map((v) => String(v ?? '').trim().toLowerCase());
    const hasSku = values.some((v) => v.includes('sku') || v.includes('code') || v.includes('product'));
    const hasBatch = values.some((v) => v.includes('batch') || v.includes('lot'));
    if (hasSku && hasBatch) {
      headerRow = r;
      headers = values;
      break;
    }
  }

  if (!headerRow || !headers.length) {
    throw new AppError(400, 'Could not find column headers with SKU/Code and Batch Number in the uploaded workbook.');
  }

  const mappedHeaders = headers.map(resolveHeader);
  const seen = new Set();
  mappedHeaders.forEach((key, index) => {
    if (!key && headers[index]) throw new AppError(400, `Unknown stock column: ${headers[index]}. Use the exported template.`);
    if (key && seen.has(key)) throw new AppError(400, `Duplicate stock column: ${headers[index]}.`);
    if (key) seen.add(key);
  });
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
        throw new AppError(400, `Row ${r}, column ${c + 1}: use plain values, not formulas or hyperlinks.`);
      }
      if (val instanceof Date) {
        val = val.toISOString().split('T')[0];
      }
      data[key] = String(val ?? '').trim();
    }

    if (data.sku || data.batch_number || data.quantity) {
      rows.push({ ...data, __sourceRow: String(r) });
    }

    if (rows.length > 500) {
      throw new AppError(400, 'Keep at most 500 stock batch rows per upload.');
    }
  }

  if (!rows.length) {
    throw new AppError(400, 'The workbook does not contain any valid stock update rows.');
  }

  return rows;
}
