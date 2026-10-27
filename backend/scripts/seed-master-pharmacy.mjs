import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { buildMasterCatalog } from './build-master-pharmacy.mjs';
import { realSuppliers } from './generate-pharmacy-dataset.mjs';

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
  console.log(` MediFlow Master Pharmacy Full Ingestion`);
  console.log(` Target Database: ${isCloud ? 'Live Cloud (Aiven)' : 'Localhost (XAMPP)'}`);
  console.log(`======================================================\n`);

  const allProducts = await buildMasterCatalog();

  // 1. Audit Admin
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN', active: true } });
  if (!admin) admin = await prisma.user.findFirst({ where: { active: true } });
  if (!admin) {
    console.error('No active user found in database.');
    process.exit(1);
  }

  // 2. Suppliers
  console.log('\nSynchronizing authorized suppliers & distributors...');
  const supplierMap = new Map();
  for (const s of realSuppliers) {
    const rec = await prisma.supplier.upsert({
      where: { name: s.name },
      update: { contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, active: true },
      create: { name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, active: true },
    });
    supplierMap.set(s.name, rec.id);
  }
  const kanapatheeSupplier = await prisma.supplier.upsert({
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
  supplierMap.set(kanapatheeSupplier.name, kanapatheeSupplier.id);
  console.log(`✓ ${supplierMap.size} suppliers synchronized.`);

  // 3. Categories
  console.log('\nSynchronizing catalog categories...');
  const categoryNames = [...new Set(allProducts.map((p) => p.categoryName))];
  const categoryMap = new Map();
  for (const name of categoryNames) {
    const rec = await prisma.category.upsert({
      where: { name },
      update: { active: true },
      create: { name, description: 'MediFlow Master Pharmacy Category', active: true },
    });
    categoryMap.set(name, rec.id);
  }
  console.log(`✓ ${categoryMap.size} categories synchronized.`);

  // 4. Manufacturers
  console.log('\nSynchronizing manufacturers...');
  const manufacturerNames = [...new Set(allProducts.map((p) => p.manufacturerName).filter(Boolean))];
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
  console.log('\nIngesting all master products, stock batches & receipt movements...');
  let productCount = 0;
  let batchCount = 0;
  let stockUnits = 0;

  for (const p of allProducts) {
    const categoryId = categoryMap.get(p.categoryName);
    const manufacturerId = p.manufacturerName ? manufacturerMap.get(p.manufacturerName) : null;
    const supplierId = (p.supplierName && supplierMap.get(p.supplierName)) || kanapatheeSupplier.id;

    let drugConceptId = null;
    if (p.productType === 'MEDICINE') {
      const ingredient = p.activeIngredient || p.genericName;
      const normalizedName = normalize(ingredient);
      const concept = await prisma.drugConcept.upsert({
        where: { normalizedName },
        update: { displayName: ingredient },
        create: {
          normalizedName,
          displayName: ingredient,
          rxNormCui: p.rxNormCui || null,
          pubchemCid: p.pubchemCid || null,
        },
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
        unit: p.unit.toLowerCase(),
        manufacturerName: p.manufacturerName || null,
        manufacturerId: manufacturerId || null,
        activeIngredient: p.activeIngredient || null,
        variantGroup: p.variantGroup || null,
        barcode: p.barcode || null,
        rxNormCui: p.rxNormCui || null,
        pubchemCid: p.pubchemCid || null,
        storageInstructions: p.storageInstructions || null,
        minimumAgeYears: p.minimumAgeYears ?? null,
        maximumAgeYears: p.maximumAgeYears ?? null,
        sellingPrice: Number(p.sellingPrice),
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
        unit: p.unit.toLowerCase(),
        manufacturerName: p.manufacturerName || null,
        manufacturerId: manufacturerId || null,
        activeIngredient: p.activeIngredient || null,
        variantGroup: p.variantGroup || null,
        barcode: p.barcode || null,
        rxNormCui: p.rxNormCui || null,
        pubchemCid: p.pubchemCid || null,
        storageInstructions: p.storageInstructions || null,
        minimumAgeYears: p.minimumAgeYears ?? null,
        maximumAgeYears: p.maximumAgeYears ?? null,
        sellingPrice: Number(p.sellingPrice),
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
      expiryDate.setDate(expiryDate.getDate() + (p.expiryDays || 720));

      const purchasePrice = Number(p.purchasePrice || p.sellingPrice * 0.7);
      const batch = await prisma.inventoryBatch.create({
        data: {
          productId: product.id,
          supplierId,
          batchNumber: p.batchNumber,
          quantityReceived: p.initialQty,
          quantityAvailable: p.initialQty,
          quantityReserved: 0,
          purchasePrice,
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
          reason: 'Initial Opening Stock from Verified Pharmaceutical Distributor',
          performedById: admin.id,
        },
      });

      batchCount++;
      stockUnits += p.initialQty;
    }
  }

  console.log(`\n======================================================`);
  console.log(` MASTER PHARMACY INGESTION FINISHED!`);
  console.log(` - Master Products:         ${productCount}`);
  console.log(` - Inventory Batches:       ${batchCount}`);
  console.log(` - Stock Units Added:       ${stockUnits.toLocaleString()}`);
  console.log(` - Categories:              ${categoryMap.size}`);
  console.log(` - Authorized Suppliers:    ${supplierMap.size}`);
  console.log(` - Registered Mfrs:         ${manufacturerMap.size}`);
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
