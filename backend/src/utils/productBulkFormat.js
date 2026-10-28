// One definition feeds the API, CSV template, update export and Excel guide.
export const CLEAR_VALUE = '[CLEAR]';
export const productBulkFields = [
  ['sku', 'SKU', 'Always required. Existing SKU updates that product; a new SKU creates one. Keep identifiers as text.', false],
  ['productType', 'Product type', 'New: MEDICINE or NON_MEDICINAL. Defaults to MEDICINE.', false],
  ['genericName', 'Product name', 'Required for a new product. Generic medicine name or retail item name.', false],
  ['strength', 'Strength', 'Required for a new medicine, e.g. 500 mg. Retail items default to N/A.', false],
  ['dosageForm', 'Dosage form', 'Required for a new medicine, e.g. Tablet. Retail items default to Retail item.', false],
  ['unit', 'Stock unit', 'Required for a new product, e.g. tablet, capsule, piece, bottle, ml or gram. Price is per this unit.', false],
  ['categoryName', 'Category', 'Required for a new product. Existing category is matched by name; a missing category is created.', false],
  ['sellingPrice', 'Selling price (Rs.)', 'Required for a new product. 0 to 9999999999.99, at most 2 decimal places. Zero is a real price.', false],
  ['reorderLevel', 'Reorder level', 'Whole number from 0 to 2147483647. New products default to 0.', false],
  ['prescriptionRequired', 'Prescription required', 'Yes or No. New medicines default to Yes; retail items to No.', false],
  ['active', 'Active', 'Yes or No. New products default to Yes. Blank never reactivates an existing product.', false],
  ['brandName', 'Brand name', 'Optional brand.', true],
  ['activeIngredient', 'Active ingredient', 'Medicine identity. New medicines default to the product name. Not applicable to retail items.', false],
  ['manufacturerName', 'Manufacturer', 'Optional. Match by name or create a new manufacturer. [CLEAR] removes the link only.', true],
  ['barcode', 'Barcode', 'Optional unique barcode. Keep as text to preserve leading zeros.', true],
  ['variantGroup', 'Variant group', 'Optional grouping, e.g. Paracetamol oral.', true],
  ['storageInstructions', 'Storage instructions', 'Optional product-specific storage instructions, up to 300 characters.', true],
  ['minimumAgeYears', 'Minimum age (years)', 'Optional verified whole-number age from 0 to 130. [CLEAR] removes this restriction.', true],
  ['maximumAgeYears', 'Maximum age (years)', 'Optional verified whole-number age from 0 to 130, not below the minimum.', true],
  ['rxNormCui', 'RxNorm code', 'Optional medicine reference code. Keep as text.', true],
  ['pubchemCid', 'PubChem ID', 'Optional positive whole number, at most 2147483647.', true],
  ['smiles', 'SMILES', 'Optional molecular structure text, up to 2000 characters.', true],
].map(([key, label, help, clearable]) => ({ key, label, help, clearable }));
export const productTemplateColumns = productBulkFields.map((f) => f.key);
export const productTemplateRows = [
  { sku: 'EXAMPLE-MED-500', productType: 'MEDICINE', genericName: 'Example medicine', strength: '500 mg', dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Example category', sellingPrice: 12.5, reorderLevel: 100, prescriptionRequired: true, active: true, activeIngredient: 'Example ingredient' },
  { sku: 'EXAMPLE-RETAIL', productType: 'NON_MEDICINAL', genericName: 'Example syringe 5 mL', unit: 'piece', categoryName: 'Example supplies', sellingPrice: 35, reorderLevel: 50, prescriptionRequired: false, active: true },
];
export const bulkInstructions = [
  'Replace or delete every example row before uploading. Examples are fictional and are not clinical guidance.',
  'One row represents one product. Keep the header row unchanged. Maximum 2,000 product rows and 2 MB CSV per upload.',
  'For an existing SKU, a missing column or blank cell keeps the saved value. Zero and No are real updates, not blanks.',
  'To remove an optional saved value, enter [CLEAR] in that cell. This exact uppercase marker is reserved. Required fields cannot be cleared.',
  'For new products, complete the fields marked required in the field guide. Blank optional values use the documented defaults.',
  'To change prices only, use the existing SKU and Selling price (Rs.) columns. Leave other cells blank or omit those columns.',
  'Stock units and medicine identity cannot change after stock, orders or sales exist. Create a new SKU instead.',
  'Upload the .xlsx workbook directly, or save only the Products sheet as CSV UTF-8. Do not upload the Guide sheet as CSV.',
  'Choose the file in Products > Bulk upload, validate, review changed and cleared fields, then apply. Validation saves no products.',
  'Use Export for update to start from saved records. Do not change an existing SKU to rename it: a different SKU creates a different product.',
];
