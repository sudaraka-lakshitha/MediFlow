import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { buildMasterCatalog } from './build-master-pharmacy.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

async function generateMasterExcelFiles() {
  console.log('\n======================================================');
  console.log(' GENERATING MEDIFLOW MASTER EXCEL SPREADSHEETS');
  console.log('======================================================\n');

  const products = await buildMasterCatalog();
  console.log(`✓ Loaded ${products.length} master products.`);

  // ---------------------------------------------------------
  // 1. MASTER PRODUCTS WORKBOOK (for Catalogue > Bulk upload)
  // ---------------------------------------------------------
  console.log('\nBuilding mediflow_master_products_upload.xlsx...');
  const prodWb = new ExcelJS.Workbook();
  prodWb.creator = 'MediFlow Pharmacy System';
  prodWb.lastModifiedBy = 'MediFlow Product Engine';
  prodWb.created = new Date();
  prodWb.modified = new Date();

  const prodSheet = prodWb.addWorksheet('Products', {
    properties: { tabColor: { argb: 'FF18354B' } },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 9, showGridLines: true }],
  });

  // Top Banner
  prodSheet.mergeCells('A1:U1');
  const prodBanner = prodSheet.getCell('A1');
  prodBanner.value = 'MediFlow Pharmacy Catalogue - Master Product Import Spreadsheet';
  prodBanner.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  prodBanner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF18354B' } };
  prodBanner.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  prodSheet.getRow(1).height = 32;

  // Instructions
  const prodInstructions = [
    'INSTRUCTIONS: Follow the guidance below to bulk create or update medicines, syrups, and retail healthcare supplies.',
    '• SKU: Unique identifier. An existing SKU updates that product; a new SKU creates a new product in the catalogue.',
    '• MEDICINES: Complete generic name, strength (e.g. 500 mg, 120mg/5mL), dosage form (Tablet, Oral suspension), and unit.',
    '• DIVISIBLE UNITS (mL / g): Liquids and syrups use "ml". Prices are per milliliter. Creams/ointments use "gram". Countables use tablet/capsule/bottle.',
    '• SELLING PRICE (Rs.): Retail price per unit. Keep numbers plain without currency symbols. At most 2 decimal places.',
    '• DIRECT UPLOAD: Upload this .xlsx workbook directly in MediFlow at Catalogue > Bulk upload. No CSV export required.',
  ];

  prodInstructions.forEach((text, idx) => {
    const rowNum = idx + 2;
    prodSheet.mergeCells(`A${rowNum}:U${rowNum}`);
    const cell = prodSheet.getCell(`A${rowNum}`);
    cell.value = text;
    cell.font = { name: 'Arial', size: 9, bold: idx === 0, color: { argb: idx === 0 ? 'FF0F766E' : 'FF334155' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    cell.alignment = { vertical: 'middle', indent: 1 };
    prodSheet.getRow(rowNum).height = 18;
  });

  prodSheet.getRow(8).height = 8; // Spacer

  // Header Row 9
  const prodHeaders = [
    { key: 'sku', label: 'SKU', width: 26 },
    { key: 'productType', label: 'Product type', width: 16 },
    { key: 'genericName', label: 'Product name', width: 36 },
    { key: 'strength', label: 'Strength', width: 18 },
    { key: 'dosageForm', label: 'Dosage form', width: 20 },
    { key: 'unit', label: 'Stock unit', width: 14 },
    { key: 'categoryName', label: 'Category', width: 28 },
    { key: 'sellingPrice', label: 'Selling price (Rs.)', width: 20 },
    { key: 'reorderLevel', label: 'Reorder level', width: 16 },
    { key: 'prescriptionRequired', label: 'Prescription required', width: 22 },
    { key: 'active', label: 'Active', width: 12 },
    { key: 'brandName', label: 'Brand name', width: 28 },
    { key: 'activeIngredient', label: 'Active ingredient', width: 32 },
    { key: 'manufacturerName', label: 'Manufacturer', width: 36 },
    { key: 'barcode', label: 'Barcode', width: 22 },
    { key: 'variantGroup', label: 'Variant group', width: 26 },
    { key: 'storageInstructions', label: 'Storage instructions', width: 40 },
    { key: 'minimumAgeYears', label: 'Minimum age (years)', width: 20 },
    { key: 'maximumAgeYears', label: 'Maximum age (years)', width: 20 },
    { key: 'rxNormCui', label: 'RxNorm code', width: 16 },
    { key: 'pubchemCid', label: 'PubChem ID', width: 16 },
  ];

  const prodHeaderRow = prodSheet.getRow(9);
  prodHeaderRow.height = 28;
  prodHeaders.forEach(({ label, width }, idx) => {
    const col = idx + 1;
    prodSheet.getColumn(col).width = width;
    const cell = prodHeaderRow.getCell(col);
    cell.value = label;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF18354B' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col <= 11 ? 'FFFDE68A' : 'FFE2E8F0' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    };
  });

  // Populate Products Data
  products.forEach((p, idx) => {
    const rowNum = idx + 10;
    const row = prodSheet.getRow(rowNum);
    row.height = 22;
    row.values = [
      p.sku,
      p.productType,
      p.genericName,
      p.strength,
      p.dosageForm,
      p.unit,
      p.categoryName,
      p.sellingPrice,
      p.reorderLevel,
      p.prescriptionRequired ? 'Yes' : 'No',
      p.active ? 'Yes' : 'No',
      p.brandName || '',
      p.activeIngredient || '',
      p.manufacturerName || '',
      p.barcode || '',
      p.variantGroup || '',
      p.storageInstructions || '',
      p.minimumAgeYears ?? '',
      p.maximumAgeYears ?? '',
      p.rxNormCui || '',
      p.pubchemCid ?? '',
    ];

    for (let col = 1; col <= 21; col++) {
      const cell = row.getCell(col);
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF18354B' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: col <= 11 ? 'FFFFFBF0' : 'FFF8FAFC' },
      };
      cell.alignment = { vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      if (col === 8) cell.numFmt = '#,##0.00';
    }
  });

  prodSheet.autoFilter = { from: 'A9', to: `U${products.length + 9}` };

  const prodBuffer = await prodWb.xlsx.writeBuffer();
  const prodFileRoot = path.join(rootDir, 'mediflow_master_products_upload.xlsx');
  const prodFilePublic = path.join(rootDir, 'frontend/public/templates/mediflow_master_products_upload.xlsx');
  fs.writeFileSync(prodFileRoot, prodBuffer);
  fs.writeFileSync(prodFilePublic, prodBuffer);
  console.log(`✓ Products Excel file generated: ${products.length} products (${(prodBuffer.length / 1024).toFixed(1)} KB)`);

  // ---------------------------------------------------------
  // 2. MASTER STOCK BATCHES WORKBOOK (for Inventory > Bulk stock update)
  // ---------------------------------------------------------
  console.log('\nBuilding mediflow_master_stock_upload.xlsx...');
  const stockWb = new ExcelJS.Workbook();
  stockWb.creator = 'MediFlow Pharmacy System';
  stockWb.lastModifiedBy = 'MediFlow Inventory Engine';
  stockWb.created = new Date();
  stockWb.modified = new Date();

  const stockSheet = stockWb.addWorksheet('Stock', {
    properties: { tabColor: { argb: 'FF0F766E' } },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 10, showGridLines: true }],
  });

  // Top Banner
  stockSheet.mergeCells('A1:K1');
  const stockBanner = stockSheet.getCell('A1');
  stockBanner.value = 'MediFlow Pharmacy Inventory - Master Stock Batches Ingestion & Update';
  stockBanner.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  stockBanner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  stockBanner.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  stockSheet.getRow(1).height = 32;

  // Instructions
  const stockInstructions = [
    'INSTRUCTIONS: Follow the guidance below to receive new batches or update stock counts.',
    '• ACTION: Select RECEIVE (or RESTOCK) for incoming supplier shipments. Select ADJUST to correct stock after counts/audits.',
    '• SKU: Product code or barcode matching an active item in your MediFlow Product Catalogue.',
    '• QUANTITY: For countable items (tablets, bottles, capsules), use whole integers. For syrups/liquids (mL, g), decimals are supported (e.g. 2500 ml, 75.5 ml).',
    '• EXPIRY DATE: Enter in YYYY-MM-DD format (e.g. 2027-12-31). New receipts must have future expiry dates.',
    '• SUPPLIER: Enter the authorized distributor/manufacturer name. If blank during RECEIVE, system defaults to primary distributor.',
    '• AMBER COLUMNS (A-H): Editable fields applied to inventory. GREY COLUMNS (I-K): Reference values only; keep unchanged.',
  ];

  stockInstructions.forEach((text, idx) => {
    const rowNum = idx + 2;
    stockSheet.mergeCells(`A${rowNum}:K${rowNum}`);
    const cell = stockSheet.getCell(`A${rowNum}`);
    cell.value = text;
    cell.font = { name: 'Arial', size: 9, bold: idx === 0, color: { argb: idx === 0 ? 'FF0F766E' : 'FF334155' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    cell.alignment = { vertical: 'middle', indent: 1 };
    stockSheet.getRow(rowNum).height = 18;
  });

  stockSheet.getRow(9).height = 8; // Spacer

  // Header Row 10
  const stockHeaders = [
    { label: 'Action (RECEIVE/ADJUST)', width: 22 },
    { label: 'Product SKU / Code', width: 26 },
    { label: 'Batch Number', width: 20 },
    { label: 'Quantity', width: 16 },
    { label: 'Purchase Price (Rs.)', width: 20 },
    { label: 'Expiry Date (YYYY-MM-DD)', width: 24 },
    { label: 'Supplier Name', width: 36 },
    { label: 'Reason / Note', width: 32 },
    { label: 'Current Stock (Ref)', width: 18 },
    { label: 'Unit (Ref)', width: 14 },
    { label: 'Product Name (Ref)', width: 36 },
  ];

  const stockHeaderRow = stockSheet.getRow(10);
  stockHeaderRow.height = 28;
  stockHeaders.forEach(({ label, width }, idx) => {
    const col = idx + 1;
    stockSheet.getColumn(col).width = width;
    const cell = stockHeaderRow.getCell(col);
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

  const now = new Date();

  // Populate Stock Batches Data
  products.forEach((p, idx) => {
    const rowNum = idx + 11;
    const row = stockSheet.getRow(rowNum);
    row.height = 24;

    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + (p.expiryDays || 730));
    const expiryStr = expiryDate.toISOString().split('T')[0];

    row.values = [
      'RECEIVE',
      p.sku,
      p.batchNumber || `BATCH-2026-${String(idx + 1).padStart(3, '0')}`,
      p.initialQty || 100,
      p.purchasePrice || Number((p.sellingPrice * 0.7).toFixed(2)),
      expiryStr,
      p.supplierName || 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
      'Wholesale supplier stock receipt',
      0,
      p.unit,
      p.brandName ? `${p.genericName} (${p.brandName})` : p.genericName,
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
        cell.numFmt = '#,##0.00';
      }
      if (col === 6) {
        cell.numFmt = 'yyyy-mm-dd';
      }
    }

    // Dropdown for Action
    row.getCell(1).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"RECEIVE,ADJUST,RESTOCK"'],
      showErrorMessage: true,
      errorTitle: 'Select Action',
      error: 'Select RECEIVE, ADJUST, or RESTOCK from the dropdown.',
    };
  });

  stockSheet.autoFilter = { from: 'A10', to: `K${products.length + 10}` };

  const stockBuffer = await stockWb.xlsx.writeBuffer();
  const stockFileRoot = path.join(rootDir, 'mediflow_master_stock_upload.xlsx');
  const stockFilePublic = path.join(rootDir, 'frontend/public/templates/mediflow_master_stock_upload.xlsx');
  fs.writeFileSync(stockFileRoot, stockBuffer);
  fs.writeFileSync(stockFilePublic, stockBuffer);
  console.log(`✓ Stock Batches Excel file generated: ${products.length} batches (${(stockBuffer.length / 1024).toFixed(1)} KB)`);

  console.log('\n======================================================');
  console.log(' MASTER EXCEL FILES READY FOR UPLOAD');
  console.log(' - Products: mediflow_master_products_upload.xlsx');
  console.log(' - Stock:    mediflow_master_stock_upload.xlsx');
  console.log('======================================================\n');
}

generateMasterExcelFiles().catch((err) => {
  console.error('Fatal error generating Excel files:', err);
  process.exit(1);
});
