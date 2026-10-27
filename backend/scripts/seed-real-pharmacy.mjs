import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { realSuppliers, realManufacturers, realCategories, realProducts } from './generate-pharmacy-dataset.mjs';

const isCloud = process.argv.includes('--cloud') || process.argv.includes('--aiven');
const databaseUrl = isCloud
  ? (process.env.AIVEN_PRISMA_URL || process.env.AIVEN_DATABASE_URL)
  : (process.env.DATABASE_URL || process.env.MYSQL_DATABASE_URL);

if (isCloud && !databaseUrl) {
  console.error('Error: AIVEN_DATABASE_URL or AIVEN_PRISMA_URL not found in .env');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl },
  },
});

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function main() {
  console.log(`\n======================================================`);
  console.log(` MediFlow Real Pharmacy Data Seeder`);
  console.log(` Target Database: ${isCloud ? 'Live Cloud (Aiven)' : 'Localhost (XAMPP)'}`);
  console.log(`======================================================\n`);

  // 1. Locate or create an Admin user for stock receipts
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN', active: true } });
  if (!admin) {
    admin = await prisma.user.findFirst({ where: { active: true } });
  }
  if (!admin) {
    console.error('Error: No active user found in the database. Run normal database migration/seed first.');
    process.exit(1);
  }
  console.log(`✓ Audit user linked: ${admin.fullName} (${admin.email}) [ID: ${admin.id}]`);

  // 2. Suppliers
  console.log(`\nSeeding ${realSuppliers.length} real authorized pharmaceutical distributors...`);
  const supplierMap = new Map();
  for (const s of realSuppliers) {
    const record = await prisma.supplier.upsert({
      where: { name: s.name },
      update: { contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, active: true },
      create: { name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, active: true },
    });
    supplierMap.set(s.name, record.id);
  }
  console.log(`✓ ${supplierMap.size} suppliers synchronized.`);

  // 3. Manufacturers
  console.log(`\nSeeding ${realManufacturers.length} international & local manufacturers...`);
  const manufacturerMap = new Map();
  for (const m of realManufacturers) {
    const record = await prisma.manufacturer.upsert({
      where: { name: m.name },
      update: { country: m.country, phone: m.phone, email: m.email, active: true },
      create: { name: m.name, country: m.country, phone: m.phone, email: m.email, active: true },
    });
    manufacturerMap.set(m.name, record.id);
  }
  console.log(`✓ ${manufacturerMap.size} manufacturers synchronized.`);

  // 4. Categories
  console.log(`\nSeeding ${realCategories.length} therapeutic & retail categories...`);
  const categoryMap = new Map();
  for (const c of realCategories) {
    const record = await prisma.category.upsert({
      where: { name: c.name },
      update: { description: c.description, active: true },
      create: { name: c.name, description: c.description, active: true },
    });
    categoryMap.set(c.name, record.id);
  }
  console.log(`✓ ${categoryMap.size} categories synchronized.`);

  // 5. Products & Initial Batches
  console.log(`\nSeeding ${realProducts.length} medicines, retail items & initial stock batches...`);
  let createdCount = 0;
  let batchCount = 0;
  let totalStockPieces = 0;

  for (const p of realProducts) {
    const categoryId = categoryMap.get(p.categoryName);
    const manufacturerId = manufacturerMap.get(p.manufacturerName);
    const supplierId = supplierMap.get(p.supplierName);

    let drugConceptId = null;
    if (p.productType === 'MEDICINE') {
      const ingredient = p.activeIngredient || p.genericName;
      const normalizedName = normalize(ingredient);
      const concept = await prisma.drugConcept.upsert({
        where: { normalizedName },
        update: { displayName: ingredient },
        create: { normalizedName, displayName: ingredient, rxNormCui: p.rxNormCui || null, pubchemCid: p.pubchemCid || null },
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
        manufacturerName: p.manufacturerName,
        manufacturerId: manufacturerId || null,
        activeIngredient: p.activeIngredient || null,
        variantGroup: p.variantGroup || null,
        barcode: p.barcode || null,
        rxNormCui: p.rxNormCui || null,
        pubchemCid: p.pubchemCid || null,
        storageInstructions: p.storageInstructions || null,
        minimumAgeYears: p.minimumAgeYears ?? null,
        maximumAgeYears: p.maximumAgeYears ?? null,
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
        unit: p.unit.toLowerCase(),
        manufacturerName: p.manufacturerName,
        manufacturerId: manufacturerId || null,
        activeIngredient: p.activeIngredient || null,
        variantGroup: p.variantGroup || null,
        barcode: p.barcode || null,
        rxNormCui: p.rxNormCui || null,
        pubchemCid: p.pubchemCid || null,
        storageInstructions: p.storageInstructions || null,
        minimumAgeYears: p.minimumAgeYears ?? null,
        maximumAgeYears: p.maximumAgeYears ?? null,
        sellingPrice: p.sellingPrice,
        reorderLevel: p.reorderLevel,
        prescriptionRequired: p.prescriptionRequired,
        active: true,
        categoryId,
        drugConceptId,
      },
    });
    createdCount++;

    // Check or create batch
    const existingBatch = await prisma.inventoryBatch.findUnique({
      where: {
        productId_batchNumber: {
          productId: product.id,
          batchNumber: p.batchNumber,
        },
      },
    });

    if (!existingBatch) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + p.expiryDays);

      const batch = await prisma.inventoryBatch.create({
        data: {
          productId: product.id,
          supplierId: supplierId || null,
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
          reason: `Opening stock received from ${p.supplierName}`,
          performedById: admin.id,
        },
      });

      batchCount++;
      totalStockPieces += p.initialQty;
    }
  }

  console.log(`\n======================================================`);
  console.log(` SUCCESS: Seeding Completed!`);
  console.log(` - Products seeded/updated:  ${createdCount} (${createdCount - 19} medicines, 19 retail items)`);
  console.log(` - New Batches Created:      ${batchCount}`);
  console.log(` - Stock Units Added:        ${totalStockPieces.toLocaleString()}`);
  console.log(` - Authorized Suppliers:     ${supplierMap.size}`);
  console.log(` - Manufacturers:            ${manufacturerMap.size}`);
  console.log(` - Categories:               ${categoryMap.size}`);
  console.log(`======================================================\n`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
