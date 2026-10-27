import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { transformToMediFlow } from './crawl-kanapathee.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');

const isCloud = process.argv.includes('--cloud') || process.argv.includes('--aiven');
const databaseUrl = isCloud
  ? (process.env.AIVEN_PRISMA_URL || process.env.AIVEN_DATABASE_URL)
  : (process.env.DATABASE_URL || process.env.MYSQL_DATABASE_URL);

if (isCloud && !databaseUrl) {
  console.error('Error: AIVEN_DATABASE_URL not found in .env');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
});

const normalize = (val) => val.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function main() {
  console.log(`\n======================================================`);
  console.log(` MediFlow Kanapathee Pharmacy Data Seeder`);
  console.log(` Target Database: ${isCloud ? 'Live Cloud (Aiven)' : 'Localhost (XAMPP)'}`);
  console.log(`======================================================\n`);

  // 1. Load crawled JSON
  const rawDataPath = resolve(__dirname, 'kanapathee_raw.json');
  const rawItems = JSON.parse(readFileSync(rawDataPath, 'utf8'));
  const products = transformToMediFlow(rawItems);
  console.log(`Loaded ${products.length} crawled products from kanapathee.com archive.`);

  // 2. Audit user
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN', active: true } });
  if (!admin) admin = await prisma.user.findFirst({ where: { active: true } });
  if (!admin) {
    console.error('No active user found in database.');
    process.exit(1);
  }

  // 3. Supplier: Kanapathee / New Kavery Medical
  const supplier = await prisma.supplier.upsert({
    where: { name: 'Kanapathee Pharmacy / New Kavery Medical' },
    update: { phone: '+94 77 891 4073', active: true },
    create: {
      name: 'Kanapathee Pharmacy / New Kavery Medical',
      contactPerson: 'Dispensary Pharmacist',
      phone: '+94 77 891 4073',
      email: 'info@kanapathee.com',
      address: 'New Kavery Medical, NMRA Reg RL-08261, Sri Lanka',
      active: true,
    },
  });
  console.log(`✓ Supplier synchronized: ${supplier.name}`);

  // 4. Categories & Manufacturers
  const categoryNames = [...new Set(products.map((p) => p.categoryName))];
  const manufacturerNames = [...new Set(products.map((p) => p.manufacturerName))];

  const categoryMap = new Map();
  for (const name of categoryNames) {
    const rec = await prisma.category.upsert({
      where: { name },
      update: { active: true },
      create: { name, description: 'Imported from Kanapathee Pharmacy catalog', active: true },
    });
    categoryMap.set(name, rec.id);
  }
  console.log(`✓ ${categoryMap.size} categories synchronized.`);

  const manufacturerMap = new Map();
  for (const name of manufacturerNames) {
    const rec = await prisma.manufacturer.upsert({
      where: { name },
      update: { active: true },
      create: { name, country: 'Sri Lanka', active: true },
    });
    manufacturerMap.set(name, rec.id);
  }
  console.log(`✓ ${manufacturerMap.size} manufacturers synchronized.`);

  // 5. Products & Batches
  let productCount = 0;
  let batchCount = 0;
  let stockUnits = 0;

  for (const p of products) {
    const categoryId = categoryMap.get(p.categoryName);
    const manufacturerId = manufacturerMap.get(p.manufacturerName);

    let drugConceptId = null;
    if (p.productType === 'MEDICINE') {
      const ingredient = p.activeIngredient || p.genericName;
      const normalizedName = normalize(ingredient);
      const concept = await prisma.drugConcept.upsert({
        where: { normalizedName },
        update: { displayName: ingredient },
        create: { normalizedName, displayName: ingredient },
      });
      drugConceptId = concept.id;
    }

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        productType: p.productType,
        genericName: p.genericName,
        brandName: p.brandName || null,
        strength: p.strength,
        dosageForm: p.dosageForm,
        unit: p.unit,
        manufacturerName: p.manufacturerName,
        manufacturerId: manufacturerId || null,
        activeIngredient: p.activeIngredient || null,
        variantGroup: p.variantGroup || null,
        barcode: p.barcode || null,
        storageInstructions: p.storageInstructions || null,
        sellingPrice: p.sellingPrice,
        reorderLevel: p.reorderLevel,
        prescriptionRequired: p.prescriptionRequired,
        active: true,
        categoryId,
        drugConceptId,
      },
      create: {
        sku: p.sku,
        productType: p.productType,
        genericName: p.genericName,
        brandName: p.brandName || null,
        strength: p.strength,
        dosageForm: p.dosageForm,
        unit: p.unit,
        manufacturerName: p.manufacturerName,
        manufacturerId: manufacturerId || null,
        activeIngredient: p.activeIngredient || null,
        variantGroup: p.variantGroup || null,
        barcode: p.barcode || null,
        storageInstructions: p.storageInstructions || null,
        sellingPrice: p.sellingPrice,
        reorderLevel: p.reorderLevel,
        prescriptionRequired: p.prescriptionRequired,
        active: true,
        categoryId,
        drugConceptId,
      },
    });
    productCount++;

    const existingBatch = await prisma.inventoryBatch.findUnique({
      where: { productId_batchNumber: { productId: product.id, batchNumber: p.batchNumber } },
    });

    if (!existingBatch) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + p.expiryDays);

      const batch = await prisma.inventoryBatch.create({
        data: {
          productId: product.id,
          supplierId: supplier.id,
          batchNumber: p.batchNumber,
          quantityReceived: p.initialQty,
          quantityAvailable: p.initialQty,
          quantityReserved: 0,
          purchasePrice: p.purchasePrice,
          expiryDate,
        },
      });

      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          batchId: batch.id,
          type: 'RECEIPT',
          quantityChange: p.initialQty,
          quantityBefore: 0,
          quantityAfter: p.initialQty,
          referenceType: 'OPENING_STOCK',
          reason: 'Initial stock crawled from Kanapathee Pharmacy catalog',
          performedById: admin.id,
        },
      });

      batchCount++;
      stockUnits += p.initialQty;
    }
  }

  console.log(`\n======================================================`);
  console.log(` SUCCESS: Kanapathee Data Ingestion Completed!`);
  console.log(` - Products seeded/updated:  ${productCount}`);
  console.log(` - Batches created:          ${batchCount}`);
  console.log(` - Stock units added:        ${stockUnits.toLocaleString()}`);
  console.log(` - Categories:               ${categoryMap.size}`);
  console.log(` - Manufacturers:            ${manufacturerMap.size}`);
  console.log(`======================================================\n`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
