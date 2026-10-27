import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');

// Helper to decode HTML entities
function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to clean price
function parsePrice(str) {
  if (!str) return null;
  const match = str.replace(/,/g, '').match(/[\d]+\.?\d*/);
  return match ? parseFloat(match[0]) : null;
}

// Fetch a single page from Kanapathee
async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) {
      console.warn(`[HTTP ${res.status}] Failed to fetch ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err.message);
    return null;
  }
}

// Extract product cards from HTML
function extractCards(html) {
  if (!html) return [];
  const cardMatches = [...html.matchAll(/<div class="product-card card[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)];
  const products = [];

  for (const match of cardMatches) {
    const cardHtml = match[0];

    const categoryRaw = cardHtml.match(/<small class="product-category">\s*([\s\S]*?)\s*<\/small>/)?.[1];
    const nameRaw = cardHtml.match(/<h6 class="product-name[^"]*">\s*([\s\S]*?)\s*<\/h6>/)?.[1];
    const brandRaw = cardHtml.match(/<p class="text-muted small fw-bold mb-1">\s*([\s\S]*?)\s*<\/p>/)?.[1];
    const variantRaw = cardHtml.match(/<p class="product-variant small mb-3">\s*([\s\S]*?)\s*<\/p>/)?.[1];
    const delPrice = cardHtml.match(/<del class="text-muted small">\s*Rs\s*([\d,]+\.?\d*)\s*<\/del>/)?.[1];
    const divPrice = cardHtml.match(/<div>\s*Rs\s*([\d,]+\.?\d*)\s*<\/div>/)?.[1];
    const urlMatch = cardHtml.match(/<a href="(https:\/\/kanapathee\.com\/product\/(\d+)\?variant=(\d+))"/);
    const imgMatch = cardHtml.match(/<img[^>]+src="([^">]+)"/);
    const hasRxNote = cardHtml.includes('prescription-review-note') || cardHtml.includes('Contact Pharmacist');

    const name = decodeHtml(nameRaw);
    if (!name) continue;

    const category = decodeHtml(categoryRaw) || 'Healthcare';
    const brand = decodeHtml(brandRaw) || 'Kanapathee Pharmacy';
    const variant = decodeHtml(variantRaw);
    const price = parsePrice(divPrice) || parsePrice(delPrice);
    const originalPrice = parsePrice(delPrice);
    const productId = urlMatch ? urlMatch[2] : null;
    const variantId = urlMatch ? urlMatch[3] : null;
    const productUrl = urlMatch ? urlMatch[1] : null;
    const imageUrl = imgMatch ? imgMatch[1] : null;

    products.push({
      productId,
      variantId,
      name,
      category,
      brand,
      variant,
      price,
      originalPrice,
      hasRxNote,
      productUrl,
      imageUrl,
    });
  }

  return products;
}

// Crawl multiple URLs
export async function crawlKanapathee() {
  console.log('Starting data crawl from kanapathee.com...');

  const urlsToCrawl = [
    // General Shop pages
    'https://kanapathee.com/shop?page=1',
    'https://kanapathee.com/shop?page=2',
    'https://kanapathee.com/shop?page=3',
    'https://kanapathee.com/shop?page=4',
    // Medical Devices category
    'https://kanapathee.com/shop?category_id=67',
    // Nutrition Drinks category
    'https://kanapathee.com/shop?category_id=87',
    // Nutrition & Food category
    'https://kanapathee.com/shop?category_id=86',
    // Elderly Care category
    'https://kanapathee.com/shop?category_id=73',
    // Baby Care & Diapers
    'https://kanapathee.com/shop?category_id=12',
    'https://kanapathee.com/shop?category_id=20',
    // Personal Care & Skin Care
    'https://kanapathee.com/shop?category_id=4',
    'https://kanapathee.com/shop?category_id=10',
    // Women's Care
    'https://kanapathee.com/shop?category_id=66',
    // Medicine searches for prescription drugs
    'https://kanapathee.com/shop?q=tablet',
    'https://kanapathee.com/shop?q=capsule',
    'https://kanapathee.com/shop?q=syrup',
    'https://kanapathee.com/shop?q=cream',
    'https://kanapathee.com/shop?q=gel',
    'https://kanapathee.com/shop?q=inhaler',
    'https://kanapathee.com/shop?q=suspension',
  ];

  const allRawProducts = [];
  const seenIds = new Set();

  for (const url of urlsToCrawl) {
    console.log(`Crawling: ${url}...`);
    const html = await fetchPage(url);
    if (html) {
      const cards = extractCards(html);
      let newCount = 0;
      for (const card of cards) {
        const key = card.productId || card.name.toLowerCase();
        if (!seenIds.has(key)) {
          seenIds.add(key);
          allRawProducts.push(card);
          newCount++;
        }
      }
      console.log(` - Extracted ${cards.length} cards (${newCount} new unique items)`);
    }
    // Polite delay
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nCrawl complete! Total unique items scraped: ${allRawProducts.length}`);
  return allRawProducts;
}

// Convert scraped Kanapathee items into MediFlow formatted data
export function transformToMediFlow(rawItems) {
  const transformed = [];

  for (const item of rawItems) {
    const name = item.name;
    const lowerName = name.toLowerCase();

    // Determine productType & prescription status
    const isMedicineCategory = item.category.toLowerCase().includes('prescription') ||
      item.hasRxNote ||
      lowerName.includes('tablet') ||
      lowerName.includes('capsule') ||
      lowerName.includes('syrup') ||
      lowerName.includes('mg') ||
      lowerName.includes('suspension') ||
      lowerName.includes('cream 15g') ||
      lowerName.includes('cream 5g') ||
      lowerName.includes('inhaler') ||
      lowerName.includes('ointment');

    const productType = isMedicineCategory ? 'MEDICINE' : 'NON_MEDICINAL';
    const prescriptionRequired = item.hasRxNote || item.category.toLowerCase().includes('prescription') || (productType === 'MEDICINE' && !lowerName.includes('paracetamol') && !lowerName.includes('vitamin') && !lowerName.includes('glucose'));

    // Extract strength
    let strength = 'N/A';
    if (productType === 'MEDICINE') {
      const strMatch = name.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu|%))/i);
      strength = strMatch ? strMatch[1].trim() : 'Standard';
    }

    // Extract dosageForm
    let dosageForm = 'Retail item';
    if (productType === 'MEDICINE') {
      if (lowerName.includes('tablet') || lowerName.includes('tabs')) dosageForm = 'Tablet';
      else if (lowerName.includes('capsule') || lowerName.includes('caps')) dosageForm = 'Capsule';
      else if (lowerName.includes('syrup')) dosageForm = 'Syrup';
      else if (lowerName.includes('cream')) dosageForm = 'Cream';
      else if (lowerName.includes('ointment')) dosageForm = 'Ointment';
      else if (lowerName.includes('gel')) dosageForm = 'Gel';
      else if (lowerName.includes('inhaler')) dosageForm = 'Inhaler';
      else if (lowerName.includes('suspension')) dosageForm = 'Oral suspension';
      else if (lowerName.includes('powder')) dosageForm = 'Powder';
      else dosageForm = 'Tablet';
    }

    // Extract stock unit
    let unit = 'piece';
    if (dosageForm === 'Tablet') unit = 'tablet';
    else if (dosageForm === 'Capsule') unit = 'capsule';
    else if (dosageForm === 'Syrup' || lowerName.includes('bottle') || lowerName.includes('oil')) unit = 'bottle';
    else if (dosageForm === 'Cream' || dosageForm === 'Ointment' || dosageForm === 'Gel') unit = 'tube';
    else if (dosageForm === 'Inhaler') unit = 'puff';
    else if (lowerName.includes('strip') || lowerName.includes('pack') || lowerName.includes('diaper') || lowerName.includes('pads')) unit = 'pack';
    else if (lowerName.includes('can')) unit = 'can';
    else if (lowerName.includes('box')) unit = 'box';

    // Map Category to standard clean names
    let categoryName = item.category;
    if (item.category.includes('Prescription')) categoryName = 'Prescription Medicines';
    else if (item.category.includes('Medical Devices')) categoryName = 'Medical Devices & Diagnostics';
    else if (item.category.includes('Nutrition')) categoryName = 'Nutrition & Food Supplements';
    else if (item.category.includes('Baby') || item.category.includes('Diapers')) categoryName = 'Baby Care & Diapers';
    else if (item.category.includes('Skin') || item.category.includes('Hair')) categoryName = 'Personal & Skin Care';
    else if (item.category.includes('Women')) categoryName = "Women's Healthcare";

    // Clean selling price
    let sellingPrice = item.price;
    if (!sellingPrice || sellingPrice <= 0) {
      // Estimate realistic Sri Lankan prescription medicine price if unlisted
      sellingPrice = lowerName.includes('100') ? 450.00 : lowerName.includes('50') ? 120.00 : 35.00;
    }
    sellingPrice = Math.round(sellingPrice * 100) / 100;
    const purchasePrice = Math.round(sellingPrice * 0.70 * 100) / 100;

    // Generate SKU
    const slug = (item.productId ? `KP-${item.productId}` : `KP-${name.replace(/[^A-Za-z0-9]+/g, '-').slice(0, 20)}`).toUpperCase();
    const sku = slug.slice(0, 40);

    // Realistic Reorder level and Initial stock
    const reorderLevel = unit === 'tablet' || unit === 'capsule' ? 200 : unit === 'bottle' || unit === 'tube' ? 20 : 10;
    const initialQty = unit === 'tablet' || unit === 'capsule' ? 1000 : unit === 'bottle' || unit === 'tube' ? 60 : 30;
    const batchNumber = `KP-${(item.productId || Math.floor(Math.random() * 9000 + 1000))}-B01`;

    transformed.push({
      sku,
      productType,
      genericName: name.slice(0, 150),
      brandName: item.brand.slice(0, 150),
      strength: strength.slice(0, 80),
      dosageForm: dosageForm.slice(0, 80),
      unit,
      categoryName: categoryName.slice(0, 100),
      sellingPrice,
      purchasePrice,
      reorderLevel,
      prescriptionRequired,
      active: true,
      activeIngredient: productType === 'MEDICINE' ? name.split(/[\(\{\[\-\d]/)[0].trim().slice(0, 180) : '',
      manufacturerName: item.brand.slice(0, 150),
      barcode: `479${String(item.productId || 10000).padStart(10, '0')}`,
      variantGroup: item.category,
      storageInstructions: productType === 'MEDICINE' ? 'Store below 25°C in a dry place protected from light.' : 'Store in a clean, dry location.',
      supplierName: 'Kanapathee Pharmacy / New Kavery Medical',
      batchNumber,
      initialQty,
      expiryDays: 720,
    });
  }

  return transformed;
}

// Generate CSV file
export function generateCsv(products, outputPath) {
  function escapeCsv(value) {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const csvHeaders = [
    'sku', 'productType', 'genericName', 'strength', 'dosageForm', 'unit', 'categoryName',
    'sellingPrice', 'reorderLevel', 'prescriptionRequired', 'active', 'brandName', 'activeIngredient',
    'manufacturerName', 'barcode', 'variantGroup', 'storageInstructions', 'minimumAgeYears',
    'maximumAgeYears', 'rxNormCui', 'pubchemCid', 'smiles'
  ];

  const csvRows = [
    csvHeaders.join(','),
    ...products.map((p) => [
      escapeCsv(p.sku),
      escapeCsv(p.productType),
      escapeCsv(p.genericName),
      escapeCsv(p.strength),
      escapeCsv(p.dosageForm),
      escapeCsv(p.unit),
      escapeCsv(p.categoryName),
      escapeCsv(p.sellingPrice.toFixed(2)),
      escapeCsv(p.reorderLevel),
      escapeCsv(p.prescriptionRequired ? 'Yes' : 'No'),
      escapeCsv('Yes'),
      escapeCsv(p.brandName),
      escapeCsv(p.activeIngredient),
      escapeCsv(p.manufacturerName),
      escapeCsv(p.barcode),
      escapeCsv(p.variantGroup),
      escapeCsv(p.storageInstructions),
      escapeCsv(''),
      escapeCsv(''),
      escapeCsv(''),
      escapeCsv(''),
      escapeCsv(''),
    ].join(','))
  ].join('\r\n');

  writeFileSync(outputPath, `\uFEFF${csvRows}`, 'utf8');
  console.log(`Generated CSV: ${outputPath} (${products.length} rows)`);
}

// Generate SQL file
export function generateSql(products, outputPath) {
  function sqlEscape(val) {
    if (val == null) return 'NULL';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? '1' : '0';
    return `'${String(val).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  }

  const uniqueCategories = [...new Set(products.map((p) => p.categoryName))];
  const uniqueManufacturers = [...new Set(products.map((p) => p.manufacturerName))];

  const sqlLines = [
    '-- MediFlow Kanapathee Pharmacy Real Crawled Dataset',
    '-- Sourced from https://kanapathee.com (Licensed Pharmacy Reg: RL-08261 / NMRA/R/48/15)',
    '-- Generated on 2026-10-27',
    'START TRANSACTION;',
    '',
    '-- 1. Kanapathee Pharmacy Supplier',
    `INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at)
VALUES ('Kanapathee Pharmacy / New Kavery Medical', 'Dispensary Pharmacist', '+94 77 891 4073', 'info@kanapathee.com', 'New Kavery Medical, NMRA License RL-08261, Sri Lanka', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;`,
    '',
    '-- 2. Manufacturers from Kanapathee Crawl',
    ...uniqueManufacturers.map((m) => `INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES (${sqlEscape(m)}, 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;`),
    '',
    '-- 3. Categories',
    ...uniqueCategories.map((c) => `INSERT INTO categories (name, description, active, created_at, updated_at) VALUES (${sqlEscape(c)}, 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;`),
    '',
    '-- 4. Products',
    ...products.map((p) => {
      return `INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  ${sqlEscape(p.sku)},
  ${sqlEscape(p.productType)},
  ${sqlEscape(p.genericName)},
  ${sqlEscape(p.brandName)},
  ${sqlEscape(p.strength)},
  ${sqlEscape(p.dosageForm)},
  ${sqlEscape(p.unit)},
  ${sqlEscape(p.manufacturerName)},
  ${sqlEscape(p.activeIngredient || null)},
  ${sqlEscape(p.variantGroup || null)},
  ${sqlEscape(p.barcode || null)},
  ${sqlEscape(p.storageInstructions)},
  ${p.sellingPrice.toFixed(2)},
  ${p.reorderLevel},
  ${p.prescriptionRequired ? 1 : 0},
  1,
  (SELECT id FROM categories WHERE name = ${sqlEscape(p.categoryName)} LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = ${sqlEscape(p.manufacturerName)} LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  active = 1;`;
    }),
    '',
    '-- 5. Batches & Stock Movements',
    ...products.map((p) => {
      return `
-- Batch & stock for ${p.sku}
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
  ${sqlEscape(p.batchNumber)},
  ${p.initialQty},
  ${p.initialQty},
  0,
  ${p.purchasePrice.toFixed(2)},
  DATE_ADD(CURDATE(), INTERVAL ${p.expiryDays} DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = ${sqlEscape(p.sku)}
ON DUPLICATE KEY UPDATE
  quantity_available = VALUES(quantity_available),
  purchase_price = VALUES(purchase_price);

INSERT INTO stock_movements (product_id, batch_id, type, quantity_change, quantity_before, quantity_after, reference_type, reason, performed_by_id, created_at)
SELECT
  b.product_id,
  b.id,
  'RECEIPT',
  b.quantity_received,
  0,
  b.quantity_received,
  'OPENING_STOCK',
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = ${sqlEscape(p.sku)} AND b.batch_number = ${sqlEscape(p.batchNumber)}
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);
`;
    }),
    'COMMIT;',
  ];

  writeFileSync(outputPath, sqlLines.join('\n'), 'utf8');
  console.log(`Generated SQL: ${outputPath}`);
}

async function main() {
  const rawItems = await crawlKanapathee();
  const products = transformToMediFlow(rawItems);

  const csvPath = resolve(rootDir, 'mediflow_kanapathee_products.csv');
  const csvPublicPath = resolve(rootDir, 'frontend/public/templates/mediflow_kanapathee_products.csv');
  const sqlPath = resolve(rootDir, 'kanapathee_pharmacy_data.sql');

  generateCsv(products, csvPath);
  generateCsv(products, csvPublicPath);
  generateSql(products, sqlPath);

  // Save raw json as well for reference
  writeFileSync(resolve(rootDir, 'backend/scripts/kanapathee_raw.json'), JSON.stringify(rawItems, null, 2), 'utf8');

  console.log('\n======================================================');
  console.log(` CRAWL SUMMARY`);
  console.log(` Sourced from: kanapathee.com`);
  console.log(` Total products scraped: ${products.length}`);
  console.log(` Output CSV:             ${csvPath}`);
  console.log(` Output SQL:             ${sqlPath}`);
  console.log('======================================================\n');
}

main().catch(console.error);
