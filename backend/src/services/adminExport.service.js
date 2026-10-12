import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { exportPages } from '../utils/exportPages.js';
import { productBulkFields } from '../utils/productBulkFormat.js';

const yesNo = (value) => value ? 'Yes' : 'No';
const date = (value) => value ? new Date(value).toISOString() : '';
export const stockExportTotals = (batches, now = new Date()) => {
  const result = Object.fromEntries(['stockOnHand', 'stockReserved', 'stockExpired', 'stockRestricted', 'stockAvailable'].map((key) => [key, new Prisma.Decimal(0)]));
  for (const b of batches) {
    const quantity = new Prisma.Decimal(b.quantityAvailable); const reserved = new Prisma.Decimal(b.quantityReserved || 0);
    result.stockOnHand = result.stockOnHand.add(quantity); result.stockReserved = result.stockReserved.add(reserved);
    if (b.expiryDate < now) result.stockExpired = result.stockExpired.add(quantity);
    if (b.restricted) result.stockRestricted = result.stockRestricted.add(quantity);
    if (b.expiryDate >= now && !b.restricted) result.stockAvailable = result.stockAvailable.add(Prisma.Decimal.max(0, quantity.sub(reserved)));
  }
  return result;
};
// Reversible spreadsheet-text escape. The importer decodes one prefix, including literal apostrophes and [CLEAR].
const updateCell = (v) => typeof v === 'string' && (/^['=+\-@\t\r\n]/.test(v) || /^[\s\u0000-\u001f]*[=+\-@]/.test(v) || v === '[CLEAR]') ? `'${v}` : v;
export const productUpdateRow = (row) => Object.fromEntries(productBulkFields.map(({ key }) => [key, updateCell(
  key === 'categoryName' ? row.category.name : key === 'manufacturerName' ? row.manufacturer?.name || row.manufacturerName || ''
    : ['active', 'prescriptionRequired'].includes(key) ? yesNo(row[key]) : row[key] ?? '')]));
const definition = (model, filename, columns, include, map) => ({ filename, columns, pages: () => exportPages(prisma[model], { include }, map) });
export const productUpdateExport = definition('product', 'products-for-update', productBulkFields, { category: true, manufacturer: true }, productUpdateRow);
export const exportDefinitions = {
  products: definition('product', 'products', ['id','sku','productType','name','brand','category','manufacturer','strength','form','unit','barcode','sellingPrice','reorderLevel','prescriptionRequired','active','stockOnHand','stockReserved','stockExpired','stockRestricted','stockAvailable','createdAt'],
    { category: true, manufacturer: true, batches: { select: { quantityAvailable: true, quantityReserved: true, expiryDate: true, restricted: true } } },
    (r) => ({ id: r.id, sku: r.sku, productType: r.productType, name: r.genericName, brand: r.brandName, category: r.category.name, manufacturer: r.manufacturer?.name, strength: r.strength, form: r.dosageForm, unit: r.unit, barcode: r.barcode, sellingPrice: r.sellingPrice, reorderLevel: r.reorderLevel, prescriptionRequired: yesNo(r.prescriptionRequired), active: yesNo(r.active), ...stockExportTotals(r.batches), createdAt: date(r.createdAt) })),
  categories: definition('category', 'categories', ['id','name','description','active','createdAt'], undefined, (r) => ({ ...r, active: yesNo(r.active), createdAt: date(r.createdAt) })),
  manufacturers: definition('manufacturer', 'manufacturers', ['id','name','country','website','phone','email','active','createdAt'], undefined, (r) => ({ ...r, active: yesNo(r.active), createdAt: date(r.createdAt) })),
  suppliers: definition('supplier', 'suppliers', ['id','name','contactPerson','phone','email','address','active','createdAt'], undefined, (r) => ({ ...r, active: yesNo(r.active), createdAt: date(r.createdAt) })),
  inventory: definition('inventoryBatch', 'inventory-batches', ['id','sku','product','productType','batchNumber','supplier','quantityReceived','quantityAvailable','quantityReserved','restricted','usableQuantity','purchasePrice','expiryDate','receivedAt'], { product: true, supplier: true },
    (r) => ({ id: r.id, sku: r.product.sku, product: r.product.genericName, productType: r.product.productType, batchNumber: r.batchNumber, supplier: r.supplier?.name, quantityReceived: r.quantityReceived, quantityAvailable: r.quantityAvailable, quantityReserved: r.quantityReserved, restricted: yesNo(r.restricted), usableQuantity: stockExportTotals([r]).stockAvailable, purchasePrice: r.purchasePrice, expiryDate: date(r.expiryDate).slice(0, 10), receivedAt: date(r.receivedAt) })),
  stockMovements: definition('stockMovement', 'stock-movements', ['id','createdAt','sku','product','batchNumber','type','quantityChange','quantityBefore','quantityAfter','referenceType','referenceId','reason','performedBy'], { product: true, batch: true, performedBy: { select: { fullName: true } } },
    (r) => ({ id: r.id, createdAt: date(r.createdAt), sku: r.product.sku, product: r.product.genericName, batchNumber: r.batch.batchNumber, type: r.type, quantityChange: r.quantityChange, quantityBefore: r.quantityBefore, quantityAfter: r.quantityAfter, referenceType: r.referenceType, referenceId: r.referenceId, reason: r.reason, performedBy: r.performedBy.fullName })),
  patients: definition('patientProfile', 'patients', ['patientNumber','fullName','email','phone','dateOfBirth','address','allergies','registrationSource','registeredBy','active','createdAt'], { user: { select: { fullName: true, email: true, phone: true, active: true } }, registeredBy: { select: { fullName: true } } },
    (r) => ({ patientNumber: r.patientNumber, fullName: r.user.fullName, email: r.user.email, phone: r.user.phone, dateOfBirth: r.dateOfBirth ? date(r.dateOfBirth).slice(0,10) : '', address: r.address, allergies: r.allergies, registrationSource: r.registrationSource, registeredBy: r.registeredBy?.fullName, active: yesNo(r.user.active), createdAt: date(r.createdAt) })),
};
