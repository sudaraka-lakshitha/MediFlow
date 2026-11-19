import { prisma } from '../config/prisma.js';
import { catalogRepository } from '../repositories/catalog.repository.js';
import { normalizeDrugName } from '../utils/drug.js';
import { productBulkService, assertProductIdentity, productHistoryInclude } from './productBulk.service.js';
export { productTemplateColumns, productTemplateRows } from '../utils/productBulkFormat.js';

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

export const catalogService = {
  listCategories: catalogRepository.categories,
  createCategory: (data) => prisma.category.create({ data }),
  updateCategory: (id, data) => prisma.category.update({ where: { id }, data }),
  setCategoryActive: (id, active) => prisma.category.update({ where: { id }, data: { active } }),
  deleteCategory: (id) => prisma.category.delete({ where: { id } }),
  async listProducts(search) {
    const [products, total] = await catalogRepository.products(search);
    const stockBatches = products.length
      ? await prisma.inventoryBatch.findMany({
        where: { productId: { in: products.map((product) => product.id) }, quantityAvailable: { gt: 0 } },
        select: { productId: true, quantityAvailable: true, quantityReserved: true, expiryDate: true, restricted: true },
      })
      : [];
    const stockByProduct = new Map();
    const now = new Date();
    for (const batch of stockBatches) {
      const stock = stockByProduct.get(batch.productId) || { inDateOnHand: 0, reserved: 0, expired: 0, restricted: 0 };
      const quantity = Number(batch.quantityAvailable);
      if (batch.restricted) stock.restricted += quantity;
      else if (batch.expiryDate < now) stock.expired += quantity;
      else {
        stock.inDateOnHand += quantity;
        stock.reserved += Math.min(quantity, Number(batch.quantityReserved || 0));
      }
      stockByProduct.set(batch.productId, stock);
    }
    return {
      rows: products.map((product) => {
        const stock = stockByProduct.get(product.id) || { inDateOnHand: 0, reserved: 0, expired: 0, restricted: 0 };
        return {
          ...product,
          batches: product.batches.map((batch) => ({ ...batch, quantityAvailable: Number(batch.quantityAvailable) })),
          stockSummary: { ...stock, available: Math.max(0, stock.inDateOnHand - stock.reserved) },
        };
      }),
      total,
    };
  },
  createProduct: (data) => prisma.$transaction(async (tx) => tx.product.create({ data: await prepareProductData(tx, data), include: { category: true, manufacturer: true, drugConcept: true } })),
  updateProduct: (id, data) => prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUniqueOrThrow({ where: { id }, include: productHistoryInclude });
    assertProductIdentity(existing, data);
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

  bulkProducts: (rows, dryRun, context) => productBulkService.run(rows, dryRun, context),
};
