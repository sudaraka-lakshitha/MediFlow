import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { catalogRepository } from '../repositories/catalog.repository.js';
import { AppError } from '../utils/AppError.js';
import { normalizeDrugName } from '../utils/drug.js';

const optionalText = (value) => {
  const text = value == null ? '' : String(value).trim();
  return text || null;
};

const prepareProductData = async (tx, data) => {
  if (data.productType === 'NON_MEDICINAL') return {
    sku: data.sku.trim(), productType: data.productType, genericName: data.genericName.trim(), brandName: optionalText(data.brandName),
    activeIngredient: null, strength: optionalText(data.strength) || 'N/A', dosageForm: optionalText(data.dosageForm) || 'Retail item', unit: data.unit.trim().toLowerCase(),
    variantGroup: optionalText(data.variantGroup), barcode: optionalText(data.barcode), manufacturerId: data.manufacturerId || null,
    manufacturerName: null, sellingPrice: data.sellingPrice, reorderLevel: data.reorderLevel, prescriptionRequired: false,
    minimumAgeYears: null, maximumAgeYears: null,
    categoryId: data.categoryId, rxNormCui: null, pubchemCid: null, smiles: null, storageInstructions: optionalText(data.storageInstructions), drugConceptId: null,
    ...(typeof data.active === 'boolean' ? { active: data.active } : {}),
  };
  const ingredient = optionalText(data.activeIngredient) || data.genericName.trim();
  const normalizedName = normalizeDrugName(ingredient);
  const concept = await tx.drugConcept.upsert({
    where: { normalizedName },
    update: {
      displayName: ingredient,
      ...(data.rxNormCui ? { rxNormCui: data.rxNormCui } : {}),
      ...(data.pubchemCid ? { pubchemCid: data.pubchemCid } : {}),
      ...(data.smiles ? { smiles: data.smiles } : {}),
    },
    create: { normalizedName, displayName: ingredient, rxNormCui: data.rxNormCui || null, pubchemCid: data.pubchemCid || null, smiles: data.smiles || null },
  });
  return {
    sku: data.sku.trim(), productType: data.productType || 'MEDICINE', genericName: data.genericName.trim(), brandName: optionalText(data.brandName),
    activeIngredient: ingredient, strength: data.strength.trim(), dosageForm: data.dosageForm.trim(), unit: data.unit.trim().toLowerCase(),
    variantGroup: optionalText(data.variantGroup), barcode: optionalText(data.barcode), manufacturerId: data.manufacturerId || null,
    manufacturerName: null, sellingPrice: data.sellingPrice, reorderLevel: data.reorderLevel,
    prescriptionRequired: data.prescriptionRequired, categoryId: data.categoryId, rxNormCui: optionalText(data.rxNormCui),
    pubchemCid: data.pubchemCid || null, smiles: optionalText(data.smiles), storageInstructions: optionalText(data.storageInstructions), drugConceptId: concept.id,
    minimumAgeYears: data.minimumAgeYears ?? null, maximumAgeYears: data.maximumAgeYears ?? null,
    ...(typeof data.active === 'boolean' ? { active: data.active } : {}),
  };
};

const bulkRowSchema = z.object({
  sku: z.string().trim().min(2).max(40), productType: z.enum(['MEDICINE', 'NON_MEDICINAL']).optional().default('MEDICINE'), genericName: z.string().trim().min(2).max(150),
  brandName: z.string().trim().max(150).optional().default(''), activeIngredient: z.string().trim().max(180).optional().default(''),
  strength: z.string().trim().max(80).optional().default(''), dosageForm: z.string().trim().max(80).optional().default(''), unit: z.string().trim().min(1).max(40),
  variantGroup: z.string().trim().max(100).optional().default(''), barcode: z.string().trim().max(80).optional().default(''),
  manufacturerName: z.string().trim().max(150).optional().default(''), categoryName: z.string().trim().min(2).max(100),
  sellingPrice: z.coerce.number().nonnegative(), reorderLevel: z.coerce.number().int().nonnegative(),
  prescriptionRequired: z.union([z.boolean(), z.string()]).transform((value) => typeof value === 'boolean' ? value : ['true', 'yes', '1'].includes(value.toLowerCase())),
  rxNormCui: z.string().trim().max(30).optional().default(''), pubchemCid: z.union([z.string(), z.number()]).optional().transform((value) => value === '' || value == null ? null : Number(value)),
  smiles: z.string().trim().max(2000).optional().default(''), storageInstructions: z.string().trim().max(300).optional().default(''),
  active: z.union([z.boolean(), z.string()]).optional().default(true).transform((value) => typeof value === 'boolean' ? value : ['true', 'yes', '1'].includes(value.toLowerCase())),
});

export const productTemplateColumns = [
  'sku', 'productType', 'genericName', 'brandName', 'activeIngredient', 'strength', 'dosageForm', 'unit', 'variantGroup', 'barcode',
  'manufacturerName', 'categoryName', 'sellingPrice', 'reorderLevel', 'prescriptionRequired', 'storageInstructions', 'rxNormCui', 'pubchemCid', 'smiles', 'active',
];

export const productTemplateRows = [
  { sku: 'MED-PCM-500-TAB', productType: 'MEDICINE', genericName: 'Paracetamol', brandName: 'Example Brand', activeIngredient: 'Paracetamol', strength: '500 mg', dosageForm: 'Tablet', unit: 'tablet', variantGroup: 'Paracetamol oral', barcode: '479000000001', manufacturerName: 'Example Pharma', categoryName: 'Analgesics', sellingPrice: 12.50, reorderLevel: 100, prescriptionRequired: false, storageInstructions: 'Store below 25°C in a dry place. Protect from moisture.', rxNormCui: '', pubchemCid: 1983, smiles: 'CC(=O)NC1=CC=C(C=C1)O', active: true },
  { sku: 'MED-PCM-120-SUS', productType: 'MEDICINE', genericName: 'Paracetamol', brandName: 'Example Paediatric', activeIngredient: 'Paracetamol', strength: '120 mg/5 ml', dosageForm: 'Oral suspension', unit: 'ml', variantGroup: 'Paracetamol oral', barcode: '479000000002', manufacturerName: 'Example Pharma', categoryName: 'Analgesics', sellingPrice: 4.25, reorderLevel: 250, prescriptionRequired: false, storageInstructions: 'Store below 25°C. Do not freeze.', rxNormCui: '', pubchemCid: 1983, smiles: 'CC(=O)NC1=CC=C(C=C1)O', active: true },
  { sku: 'RET-SYR-5ML', productType: 'NON_MEDICINAL', genericName: 'Sterile syringe 5 mL', brandName: '', activeIngredient: '', strength: '', dosageForm: '', unit: 'piece', variantGroup: 'Syringes', barcode: '479000000090', manufacturerName: 'Example Medical', categoryName: 'Medical supplies', sellingPrice: 35, reorderLevel: 50, prescriptionRequired: false, storageInstructions: 'Store in a clean, dry place.', rxNormCui: '', pubchemCid: '', smiles: '', active: true },
];

export const catalogService = {
  listCategories: catalogRepository.categories,
  createCategory: (data) => prisma.category.create({ data }),
  updateCategory: (id, data) => prisma.category.update({ where: { id }, data }),
  setCategoryActive: (id, active) => prisma.category.update({ where: { id }, data: { active } }),
  deleteCategory: (id) => prisma.category.delete({ where: { id } }),
  async listProducts(search) {
    const products = await catalogRepository.products(search);
    return products.map((product) => ({ ...product, batches: product.batches.map((batch) => ({ ...batch, quantityAvailable: Number(batch.quantityAvailable) })) }));
  },
  createProduct: (data) => prisma.$transaction(async (tx) => tx.product.create({ data: await prepareProductData(tx, data), include: { category: true, manufacturer: true, drugConcept: true } })),
  updateProduct: (id, data) => prisma.$transaction(async (tx) => {
    const product = await tx.product.update({ where: { id }, data: await prepareProductData(tx, data), include: { category: true, manufacturer: true, drugConcept: true } });
    await tx.lowStockAcknowledgement.deleteMany({ where: { productId: id } });
    return product;
  }),
  setProductActive: (id, active) => prisma.$transaction(async (tx) => {
    const product = await tx.product.update({ where: { id }, data: { active } });
    await tx.lowStockAcknowledgement.deleteMany({ where: { productId: id } });
    return product;
  }),
  deleteProduct: (id) => prisma.product.delete({ where: { id } }),
  listSuppliers: catalogRepository.suppliers,
  createSupplier: (data) => prisma.supplier.create({ data }),
  updateSupplier: (id, data) => prisma.supplier.update({ where: { id }, data }),
  setSupplierActive: (id, active) => prisma.supplier.update({ where: { id }, data: { active } }),
  deleteSupplier: (id) => prisma.supplier.delete({ where: { id } }),
  listManufacturers: catalogRepository.manufacturers,
  createManufacturer: (data) => prisma.manufacturer.create({ data }),
  updateManufacturer: (id, data) => prisma.manufacturer.update({ where: { id }, data }),
  setManufacturerActive: (id, active) => prisma.manufacturer.update({ where: { id }, data: { active } }),
  deleteManufacturer: (id) => prisma.manufacturer.delete({ where: { id } }),

  async bulkProducts(rows, dryRun) {
    const parsed = []; const errors = [];
    rows.forEach((row, index) => {
      const result = bulkRowSchema.safeParse(row);
      if (result.success) parsed.push({ rowNumber: index + 2, data: result.data });
      else errors.push({ row: index + 2, sku: row.sku || '', errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`) });
    });
    const skus = parsed.map((entry) => entry.data.sku);
    const existing = await prisma.product.findMany({ where: { sku: { in: skus } }, select: { sku: true } });
    const existingSkus = new Set(existing.map((product) => product.sku));
    const summary = { total: rows.length, valid: parsed.length, creates: parsed.filter((entry) => !existingSkus.has(entry.data.sku)).length, updates: parsed.filter((entry) => existingSkus.has(entry.data.sku)).length, errors };
    if (dryRun || errors.length) {
      if (!dryRun && errors.length) throw new AppError(400, 'Bulk import contains invalid rows. Run validation and correct every error before applying.', summary);
      return { ...summary, applied: false };
    }
    await prisma.$transaction(async (tx) => {
      for (const entry of parsed) {
        const row = entry.data;
        const category = await tx.category.upsert({ where: { name: row.categoryName }, update: { active: true }, create: { name: row.categoryName } });
        const manufacturer = row.manufacturerName ? await tx.manufacturer.upsert({ where: { name: row.manufacturerName }, update: { active: true }, create: { name: row.manufacturerName } }) : null;
        const data = await prepareProductData(tx, { ...row, categoryId: category.id, manufacturerId: manufacturer?.id || null });
        const product = await tx.product.upsert({ where: { sku: row.sku }, update: data, create: data });
        await tx.lowStockAcknowledgement.deleteMany({ where: { productId: product.id } });
      }
    });
    return { ...summary, applied: true };
  },
};
