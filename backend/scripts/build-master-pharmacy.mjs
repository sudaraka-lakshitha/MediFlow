import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { realProducts as curatedEssentials, realSuppliers, realManufacturers, realCategories } from './generate-pharmacy-dataset.mjs';
import { transformToMediFlow } from './crawl-kanapathee.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');
mkdirSync(resolve(rootDir, 'data/catalogs'), { recursive: true });

// Additional top-tier well-known household & hospital medicines and pharmaceutical retail goods
const additionalFormulary = [
  // Pain, Fever & Inflammation
  {
    sku: 'MED-PANADOL-ACT', productType: 'MEDICINE', genericName: 'Paracetamol Fast Absorbing', brandName: 'Panadol ActiFast', strength: '500 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 8.50, purchasePrice: 5.50,
    reorderLevel: 400, prescriptionRequired: false, activeIngredient: 'Paracetamol', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563002222', variantGroup: 'Paracetamol Oral',
    storageInstructions: 'Store below 30°C in a dry place.', batchNumber: 'ACT-2601-A', initialQty: 3000, expiryDays: 730,
  },
  {
    sku: 'MED-VOLTAREN-GEL', productType: 'MEDICINE', genericName: 'Diclofenac Diethylamine Gel', brandName: 'Voltaren Emulgel 50 g', strength: '1.16% w/w',
    dosageForm: 'Gel', unit: 'tube', categoryName: 'Analgesics & Antipyretics', sellingPrice: 1650.00, purchasePrice: 1180.00,
    reorderLevel: 30, prescriptionRequired: false, activeIngredient: 'Diclofenac', manufacturerName: 'Novartis Pharma AG',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '7680312005555', variantGroup: 'Diclofenac Topical',
    storageInstructions: 'Store below 30°C. Do not freeze.', batchNumber: 'VOL-2602-B', initialQty: 80, expiryDays: 680,
  },
  {
    sku: 'MED-ARCOXIA-90', productType: 'MEDICINE', genericName: 'Etoricoxib', brandName: 'Arcoxia 90 mg', strength: '90 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 195.00, purchasePrice: 135.00,
    reorderLevel: 100, prescriptionRequired: true, activeIngredient: 'Etoricoxib', manufacturerName: 'Organon / MSD',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '8901234009988', variantGroup: 'Etoricoxib Oral',
    storageInstructions: 'Store in original package below 30°C.', batchNumber: 'ARC-2603-C', initialQty: 500, expiryDays: 650,
  },
  {
    sku: 'MED-TRAMAL-50', productType: 'MEDICINE', genericName: 'Tramadol Hydrochloride', brandName: 'Tramal 50 mg', strength: '50 mg',
    dosageForm: 'Capsule', unit: 'capsule', categoryName: 'Analgesics & Antipyretics', sellingPrice: 28.00, purchasePrice: 18.00,
    reorderLevel: 150, prescriptionRequired: true, activeIngredient: 'Tramadol', manufacturerName: 'Grünenthal GmbH',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4019800123456', variantGroup: 'Tramadol Oral',
    storageInstructions: 'Controlled medicine. Store securely below 25°C.', batchNumber: 'TRM-2604-D', initialQty: 600, expiryDays: 700,
  },

  // Cardiovascular & Cardiac Care
  {
    sku: 'MED-CONCOR-5', productType: 'MEDICINE', genericName: 'Bisoprolol Fumarate', brandName: 'Concor 5 mg', strength: '5 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 46.00, purchasePrice: 31.00,
    reorderLevel: 200, prescriptionRequired: true, activeIngredient: 'Bisoprolol', manufacturerName: 'Merck Healthcare KGaA',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4027453007777', variantGroup: 'Bisoprolol Oral',
    storageInstructions: 'Store below 30°C in a dry place.', batchNumber: 'CON-2605-E', initialQty: 1000, expiryDays: 720,
  },
  {
    sku: 'MED-MICARDIS-40', productType: 'MEDICINE', genericName: 'Telmisartan', brandName: 'Micardis 40 mg', strength: '40 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 78.00, purchasePrice: 52.00,
    reorderLevel: 150, prescriptionRequired: true, activeIngredient: 'Telmisartan', manufacturerName: 'Boehringer Ingelheim',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4013456001234', variantGroup: 'Telmisartan Oral',
    storageInstructions: 'Store in original package to protect from moisture.', batchNumber: 'MIC-2606-F', initialQty: 800, expiryDays: 690,
  },
  {
    sku: 'MED-LASIX-40', productType: 'MEDICINE', genericName: 'Furosemide', brandName: 'Lasix 40 mg', strength: '40 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 8.00, purchasePrice: 4.80,
    reorderLevel: 300, prescriptionRequired: true, activeIngredient: 'Furosemide', manufacturerName: 'Sanofi-Aventis',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '3582910008899', variantGroup: 'Furosemide Oral',
    storageInstructions: 'Store below 25°C protected from light.', batchNumber: 'LAS-2607-G', initialQty: 1500, expiryDays: 640,
  },

  // Diabetes & Endocrine
  {
    sku: 'MED-FORXIGA-10', productType: 'MEDICINE', genericName: 'Dapagliflozin Propanediol', brandName: 'Forxiga 10 mg', strength: '10 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Endocrine & Diabetes Care', sellingPrice: 220.00, purchasePrice: 155.00,
    reorderLevel: 80, prescriptionRequired: true, activeIngredient: 'Dapagliflozin', manufacturerName: 'AstraZeneca Pharmaceuticals',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '7312345009988', variantGroup: 'SGLT2 Inhibitor',
    storageInstructions: 'Store below 30°C.', batchNumber: 'FOR-2608-H', initialQty: 400, expiryDays: 670,
  },
  {
    sku: 'MED-AMARYL-2', productType: 'MEDICINE', genericName: 'Glimepiride', brandName: 'Amaryl 2 mg', strength: '2 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Endocrine & Diabetes Care', sellingPrice: 32.00, purchasePrice: 21.00,
    reorderLevel: 200, prescriptionRequired: true, activeIngredient: 'Glimepiride', manufacturerName: 'Sanofi-Aventis',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '3582910007788', variantGroup: 'Glimepiride Oral',
    storageInstructions: 'Store below 30°C in a dry place.', batchNumber: 'AMA-2609-I', initialQty: 1200, expiryDays: 600,
  },

  // Antibiotics & Antifungals
  {
    sku: 'MED-DIFLUCAN-150', productType: 'MEDICINE', genericName: 'Fluconazole', brandName: 'Diflucan 150 mg Single Dose', strength: '150 mg',
    dosageForm: 'Capsule', unit: 'capsule', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 320.00, purchasePrice: 220.00,
    reorderLevel: 60, prescriptionRequired: true, activeIngredient: 'Fluconazole', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '5012345007766', variantGroup: 'Fluconazole Oral',
    storageInstructions: 'Store below 30°C.', batchNumber: 'DIF-2610-J', initialQty: 250, expiryDays: 710,
  },
  {
    sku: 'MED-DOXY-100', productType: 'MEDICINE', genericName: 'Doxycycline Hyclate', brandName: 'Doxycycline SPMC 100 mg', strength: '100 mg',
    dosageForm: 'Capsule', unit: 'capsule', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 18.00, purchasePrice: 11.00,
    reorderLevel: 250, prescriptionRequired: true, activeIngredient: 'Doxycycline', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791234008899', variantGroup: 'Doxycycline Oral',
    storageInstructions: 'Store below 25°C in a dry place protected from light.', batchNumber: 'DOX-2611-K', initialQty: 1200, expiryDays: 620,
  },
  {
    sku: 'MED-KLARICID-500', productType: 'MEDICINE', genericName: 'Clarithromycin', brandName: 'Klaricid 500 mg', strength: '500 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 260.00, purchasePrice: 180.00,
    reorderLevel: 80, prescriptionRequired: true, activeIngredient: 'Clarithromycin', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '4010123008877', variantGroup: 'Clarithromycin Oral',
    storageInstructions: 'Store in a dry place between 15°C and 30°C.', batchNumber: 'KLA-2612-L', initialQty: 400, expiryDays: 640,
  },

  // Gastrointestinal & Antacids
  {
    sku: 'MED-ENO-LEMON-5G', productType: 'MEDICINE', genericName: 'Sodium Bicarbonate and Citric Acid', brandName: 'Eno Fruit Salt Lemon 5 g Sachet', strength: '5 g',
    dosageForm: 'Powder', unit: 'piece', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 65.00, purchasePrice: 45.00,
    reorderLevel: 200, prescriptionRequired: false, activeIngredient: 'Sodium Bicarbonate', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563003333', variantGroup: 'Antacid Powder',
    storageInstructions: 'Store below 30°C in a dry place. Protect from moisture.', batchNumber: 'ENO-2613-M', initialQty: 800, expiryDays: 700,
  },
  {
    sku: 'MED-BUSCOPAN-10', productType: 'MEDICINE', genericName: 'Hyoscine Butylbromide', brandName: 'Buscopan 10 mg', strength: '10 mg',
    dosageForm: 'Sugar-coated tablet', unit: 'tablet', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 38.00, purchasePrice: 25.00,
    reorderLevel: 150, prescriptionRequired: true, activeIngredient: 'Hyoscine Butylbromide', manufacturerName: 'Sanofi-Aventis',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '3582910006677', variantGroup: 'Antispasmodic',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'BUS-2614-N', initialQty: 900, expiryDays: 660,
  },
  {
    sku: 'MED-IMODIUM-2', productType: 'MEDICINE', genericName: 'Loperamide Hydrochloride', brandName: 'Imodium 2 mg', strength: '2 mg',
    dosageForm: 'Capsule', unit: 'capsule', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 22.00, purchasePrice: 14.00,
    reorderLevel: 200, prescriptionRequired: false, activeIngredient: 'Loperamide', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5410123009988', variantGroup: 'Antidiarrheal',
    storageInstructions: 'Store below 30°C.', batchNumber: 'IMO-2615-O', initialQty: 1000, expiryDays: 680,
  },

  // Respiratory, Cough & Allergy
  {
    sku: 'MED-SYMBICORT-160', productType: 'MEDICINE', genericName: 'Budesonide and Formoterol Fumarate', brandName: 'Symbicort Turbuhaler 160/4.5 (120 doses)', strength: '160 mcg / 4.5 mcg',
    dosageForm: 'Inhaler', unit: 'puff', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 5200.00, purchasePrice: 3800.00,
    reorderLevel: 20, prescriptionRequired: true, activeIngredient: 'Budesonide', manufacturerName: 'AstraZeneca Pharmaceuticals',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '7312345008877', variantGroup: 'Combination Inhaler',
    storageInstructions: 'Store with mouthpiece cover tightly closed below 30°C.', batchNumber: 'SYM-2616-P', initialQty: 50, expiryDays: 580,
  },
  {
    sku: 'MED-ALLEGRA-120', productType: 'MEDICINE', genericName: 'Fexofenadine Hydrochloride', brandName: 'Allegra 120 mg', strength: '120 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 95.00, purchasePrice: 65.00,
    reorderLevel: 150, prescriptionRequired: false, activeIngredient: 'Fexofenadine', manufacturerName: 'Sanofi-Aventis',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '3582910004455', variantGroup: 'Antihistamine Oral',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'ALL-2617-Q', initialQty: 800, expiryDays: 670,
  },
  {
    sku: 'MED-OTRIVIN-01', productType: 'MEDICINE', genericName: 'Xylometazoline Hydrochloride', brandName: 'Otrivin Adult Nasal Drops 0.1% 10 mL', strength: '0.1% w/v',
    dosageForm: 'Drops', unit: 'bottle', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 420.00, purchasePrice: 290.00,
    reorderLevel: 50, prescriptionRequired: false, activeIngredient: 'Xylometazoline', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563008811', variantGroup: 'Nasal Decongestant',
    storageInstructions: 'Store below 30°C. Do not use for more than 7 consecutive days.', batchNumber: 'OTR-2618-R', initialQty: 180, expiryDays: 620,
  },
  {
    sku: 'MED-STREPSILS-HL', productType: 'MEDICINE', genericName: 'Dichlorobenzyl Alcohol & Amylmetacresol', brandName: 'Strepsils Honey & Lemon Lozenges Pack of 24', strength: '1.2 mg / 0.6 mg',
    dosageForm: 'Lozenge', unit: 'box', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 680.00, purchasePrice: 480.00,
    reorderLevel: 40, prescriptionRequired: false, activeIngredient: 'Amylmetacresol', manufacturerName: 'Reckitt Benckiser Healthcare',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5000158002233', variantGroup: 'Throat Lozenges',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'STR-2619-S', initialQty: 150, expiryDays: 730,
  },

  // Ophthalmic & Otic (Eye & Ear Drops)
  {
    sku: 'MED-TEARS-NATURALE', productType: 'MEDICINE', genericName: 'Dextran and Hydroxypropyl Methylcellulose', brandName: 'Tears Naturale II Lubricant Eye Drops 15 mL', strength: '0.1% / 0.3%',
    dosageForm: 'Drops', unit: 'bottle', categoryName: 'Ophthalmic & Otic Care', sellingPrice: 980.00, purchasePrice: 690.00,
    reorderLevel: 30, prescriptionRequired: false, activeIngredient: 'Dextran', manufacturerName: 'Alcon Laboratories',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '3006500123456', variantGroup: 'Artificial Tears',
    storageInstructions: 'Store between 8°C and 30°C. Discard 28 days after first opening.', batchNumber: 'TEA-2620-T', initialQty: 100, expiryDays: 550,
  },
  {
    sku: 'MED-CHLORAM-EYE', productType: 'MEDICINE', genericName: 'Chloramphenicol Eye Drops', brandName: 'Chloramphenicol 0.5% Eye Drops 10 mL', strength: '0.5% w/v',
    dosageForm: 'Drops', unit: 'bottle', categoryName: 'Ophthalmic & Otic Care', sellingPrice: 320.00, purchasePrice: 210.00,
    reorderLevel: 40, prescriptionRequired: true, activeIngredient: 'Chloramphenicol', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791234006677', variantGroup: 'Eye Drops',
    storageInstructions: 'Store refrigerated between 2°C and 8°C. Protect from light.', batchNumber: 'CHL-2621-U', initialQty: 120, expiryDays: 450,
  },

  // Surgical & Diagnostic Devices (Retail Items)
  {
    sku: 'RET-OMRON-HEM7120', productType: 'NON_MEDICINAL', genericName: 'Omron HEM-7120 Digital Automatic Upper Arm BP Monitor', brandName: 'Omron Healthcare', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 13200.00, purchasePrice: 9800.00,
    reorderLevel: 10, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Omron Healthcare Co., Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '4015672007120', variantGroup: 'Blood Pressure Monitors',
    storageInstructions: 'Keep in storage case at room temperature. Avoid moisture.', batchNumber: 'OMR-2622-V', initialQty: 30, expiryDays: 1400,
  },
  {
    sku: 'RET-PULSE-OXIMETER', productType: 'NON_MEDICINAL', genericName: 'Contec LED Fingertip Pulse Oximeter CMS50D', brandName: 'Contec Medical', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 3850.00, purchasePrice: 2650.00,
    reorderLevel: 15, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Omron Healthcare Co., Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '6945040001234', variantGroup: 'Pulse Oximeters',
    storageInstructions: 'Store in dry place. Remove batteries if storing long term.', batchNumber: 'OXI-2623-W', initialQty: 50, expiryDays: 1400,
  },
  {
    sku: 'RET-OMRON-NEB-C28', productType: 'NON_MEDICINAL', genericName: 'Omron CompAIR NE-C28P Compressor Nebulizer System', brandName: 'Omron Healthcare', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 19500.00, purchasePrice: 14800.00,
    reorderLevel: 5, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Omron Healthcare Co., Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '4015672002828', variantGroup: 'Nebulizers',
    storageInstructions: 'Store clean in carrying case.', batchNumber: 'NEB-2624-X', initialQty: 15, expiryDays: 1800,
  },
  {
    sku: 'RET-AEROCHAMBER-ADULT', productType: 'NON_MEDICINAL', genericName: 'AeroChamber Plus Flow-Vu Inhaler Spacer Device with Adult Mask', brandName: 'AeroChamber', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 4200.00, purchasePrice: 2950.00,
    reorderLevel: 15, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '6754020001234', variantGroup: 'Inhaler Spacers',
    storageInstructions: 'Wash with mild soapy water once weekly. Air dry.', batchNumber: 'AER-2625-Y', initialQty: 40, expiryDays: 1400,
  },

  // First Aid, Hospital Consumables & Surgical Supplies (Retail)
  {
    sku: 'RET-SAVLON-500', productType: 'NON_MEDICINAL', genericName: 'Savlon Antiseptic Liquid 500 mL', brandName: 'Savlon', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'bottle', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 850.00, purchasePrice: 620.00,
    reorderLevel: 30, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '8901012005544', variantGroup: 'Antiseptics',
    storageInstructions: 'Store below 30°C. For external use only.', batchNumber: 'SAV-2626-Z', initialQty: 90, expiryDays: 850,
  },
  {
    sku: 'RET-SURG-SPIRIT-500', productType: 'NON_MEDICINAL', genericName: 'Surgical Spirit B.P. (Isopropyl Alcohol 70%) 500 mL', brandName: 'MediFlow SurgiSpirit', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'bottle', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 480.00, purchasePrice: 320.00,
    reorderLevel: 40, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000007788', variantGroup: 'Surgical Spirit',
    storageInstructions: 'Flammable liquid. Store tightly capped below 25°C away from heat.', batchNumber: 'SPI-2627-AA', initialQty: 150, expiryDays: 950,
  },
  {
    sku: 'RET-GAUZE-10X10', productType: 'NON_MEDICINAL', genericName: 'Sterile Surgical Gauze Swabs 10 cm x 10 cm Pack of 5', brandName: 'B. Braun Askina', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'pack', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 120.00, purchasePrice: 75.00,
    reorderLevel: 100, prescriptionRequired: false, activeIngredient: '', manufacturerName: '3M Healthcare Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '4022495007766', variantGroup: 'Gauze Swabs',
    storageInstructions: 'Keep sterile wrapper intact until use.', batchNumber: 'GAU-2628-AB', initialQty: 400, expiryDays: 1100,
  },
  {
    sku: 'RET-CREPE-10CM', productType: 'NON_MEDICINAL', genericName: 'Cotton Crepe Elastic Support Bandage 10 cm x 4.5 m', brandName: 'Flamingo Crepe', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 380.00, purchasePrice: 240.00,
    reorderLevel: 50, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Ansell Healthcare',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '8901234005522', variantGroup: 'Crepe Bandages',
    storageInstructions: 'Store in cool dry conditions. Washable and reusable.', batchNumber: 'CRE-2629-AC', initialQty: 120, expiryDays: 1400,
  },
  {
    sku: 'RET-HOT-WATER-BOTTLE', productType: 'NON_MEDICINAL', genericName: 'Deluxe Rubber Hot Water Bottle 2 Litres with Fleece Cover', brandName: 'MediFlow ComfortCare', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 1250.00, purchasePrice: 820.00,
    reorderLevel: 20, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Ansell Healthcare',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000008899', variantGroup: 'Heat Therapy',
    storageInstructions: 'Drain completely and store in a cool, dark, dry place with stopper removed.', batchNumber: 'HWB-2630-AD', initialQty: 45, expiryDays: 1800,
  },

  // Adult Incontinence & Baby Care (Retail)
  {
    sku: 'RET-FRIENDS-ADULT-M', productType: 'NON_MEDICINAL', genericName: 'Friends Classic Adult Diapers Medium Pack of 10', brandName: 'Friends Diapers', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'pack', categoryName: 'Personal Hygiene & Sanitization', sellingPrice: 2450.00, purchasePrice: 1850.00,
    reorderLevel: 25, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Kimberly-Clark',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '8901030009988', variantGroup: 'Adult Incontinence',
    storageInstructions: 'Store in dry sanitary conditions away from moisture.', batchNumber: 'FRI-2631-AE', initialQty: 75, expiryDays: 1100,
  },
  {
    sku: 'RET-TENA-SLIP-L', productType: 'NON_MEDICINAL', genericName: 'Tena Slip Plus Incontinence Briefs Large Pack of 10', brandName: 'Tena Healthcare', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'pack', categoryName: 'Personal Hygiene & Sanitization', sellingPrice: 3200.00, purchasePrice: 2450.00,
    reorderLevel: 20, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Kimberly-Clark',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '7322540001234', variantGroup: 'Adult Incontinence',
    storageInstructions: 'Store in dry conditions.', batchNumber: 'TEN-2632-AF', initialQty: 50, expiryDays: 1100,
  },
  {
    sku: 'RET-SUSTAGEN-VAN-400', productType: 'NON_MEDICINAL', genericName: 'Sustagen Hospital Formula Nutritional Powder Vanilla 400 g', brandName: 'Sustagen', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'can', categoryName: 'Clinical Nutrition & Infant Care', sellingPrice: 4200.00, purchasePrice: 3250.00,
    reorderLevel: 20, prescriptionRequired: false, activeIngredient: '', manufacturerName: 'Mead Johnson Nutrition',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '9300650001234', variantGroup: 'Clinical Nutrition',
    storageInstructions: 'Store in cool dry place. Use within 4 weeks of opening.', batchNumber: 'SUS-2633-AG', initialQty: 60, expiryDays: 620,
  },

  // Liquid Medicines & Clinical Syrups Measured in Milliliters (unit: 'ml')
  {
    sku: 'MED-PARACETAMOL-ML', productType: 'MEDICINE', genericName: 'Paracetamol Paediatric Oral Suspension', brandName: 'Paracetamol Paediatric Liquid', strength: '120 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Analgesics & Antipyretics', sellingPrice: 2.50, purchasePrice: 1.50,
    reorderLevel: 300, prescriptionRequired: false, activeIngredient: 'Paracetamol', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000001001', variantGroup: 'Paracetamol Liquid Dispensed',
    storageInstructions: 'Store below 25°C. Shake well before measuring dose.', batchNumber: 'ML-PAN-2601', initialQty: 2500, expiryDays: 730,
  },
  {
    sku: 'MED-IBUPROFEN-ML', productType: 'MEDICINE', genericName: 'Ibuprofen Paediatric Oral Suspension', brandName: 'Brufen Paediatric Liquid', strength: '100 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Analgesics & Antipyretics', sellingPrice: 3.00, purchasePrice: 1.80,
    reorderLevel: 250, prescriptionRequired: false, activeIngredient: 'Ibuprofen', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '4791000001002', variantGroup: 'Ibuprofen Liquid Dispensed',
    storageInstructions: 'Store below 25°C. Take with or after food.', batchNumber: 'ML-IBU-2602', initialQty: 2000, expiryDays: 680,
  },
  {
    sku: 'MED-AMOXICILLIN-ML', productType: 'MEDICINE', genericName: 'Amoxicillin Paediatric Oral Suspension', brandName: 'Amoxil Paediatric Liquid', strength: '125 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 3.50, purchasePrice: 2.20,
    reorderLevel: 300, prescriptionRequired: true, activeIngredient: 'Amoxicillin', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000001003', variantGroup: 'Amoxicillin Liquid Dispensed',
    storageInstructions: 'Store below 25°C. After reconstitution keep refrigerated.', batchNumber: 'ML-AMX-2603', initialQty: 2500, expiryDays: 700,
  },
  {
    sku: 'MED-AUGMENTIN-ML', productType: 'MEDICINE', genericName: 'Amoxicillin and Clavulanate Potassium Oral Suspension', brandName: 'Augmentin Paediatric Liquid', strength: '156.25 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 6.80, purchasePrice: 4.50,
    reorderLevel: 200, prescriptionRequired: true, activeIngredient: 'Amoxicillin', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001004', variantGroup: 'Co-Amoxiclav Liquid Dispensed',
    storageInstructions: 'Store powder below 25°C. Reconstituted suspension keep in refrigerator 2-8°C.', batchNumber: 'ML-AUG-2604', initialQty: 1500, expiryDays: 600,
  },
  {
    sku: 'MED-CEFUROXIME-ML', productType: 'MEDICINE', genericName: 'Cefuroxime Axetil Paediatric Oral Suspension', brandName: 'Zinnat Paediatric Liquid', strength: '125 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 8.50, purchasePrice: 5.60,
    reorderLevel: 150, prescriptionRequired: true, activeIngredient: 'Cefuroxime', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001005', variantGroup: 'Cefuroxime Liquid Dispensed',
    storageInstructions: 'Store reconstituted suspension in refrigerator between 2°C and 8°C.', batchNumber: 'ML-CEF-2605', initialQty: 1200, expiryDays: 580,
  },
  {
    sku: 'MED-AZITHROMYCIN-ML', productType: 'MEDICINE', genericName: 'Azithromycin Paediatric Oral Suspension', brandName: 'Zithromax Paediatric Liquid', strength: '200 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 7.20, purchasePrice: 4.80,
    reorderLevel: 150, prescriptionRequired: true, activeIngredient: 'Azithromycin', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4791000001006', variantGroup: 'Azithromycin Liquid Dispensed',
    storageInstructions: 'Store below 30°C. Shake well before each use.', batchNumber: 'ML-AZI-2606', initialQty: 1000, expiryDays: 650,
  },
  {
    sku: 'MED-METRONIDAZOLE-ML', productType: 'MEDICINE', genericName: 'Metronidazole Benzoate Oral Suspension', brandName: 'Flagyl Paediatric Liquid', strength: '200 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 2.80, purchasePrice: 1.70,
    reorderLevel: 250, prescriptionRequired: true, activeIngredient: 'Metronidazole', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000001007', variantGroup: 'Metronidazole Liquid Dispensed',
    storageInstructions: 'Store below 25°C protected from direct light.', batchNumber: 'ML-MET-2607', initialQty: 2000, expiryDays: 720,
  },
  {
    sku: 'MED-CETIRIZINE-ML', productType: 'MEDICINE', genericName: 'Cetirizine Dihydrochloride Oral Solution', brandName: 'Zyrtec Paediatric Liquid', strength: '5 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 4.20, purchasePrice: 2.60,
    reorderLevel: 250, prescriptionRequired: false, activeIngredient: 'Cetirizine', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001008', variantGroup: 'Cetirizine Liquid Dispensed',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'ML-CET-2608', initialQty: 1800, expiryDays: 710,
  },
  {
    sku: 'MED-LORATADINE-ML', productType: 'MEDICINE', genericName: 'Loratadine Paediatric Syrup', brandName: 'Claratyne Paediatric Liquid', strength: '5 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 3.80, purchasePrice: 2.40,
    reorderLevel: 200, prescriptionRequired: false, activeIngredient: 'Loratadine', manufacturerName: 'Bayer Consumer Care',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4791000001009', variantGroup: 'Loratadine Liquid Dispensed',
    storageInstructions: 'Store below 25°C.', batchNumber: 'ML-LOR-2609', initialQty: 1500, expiryDays: 690,
  },
  {
    sku: 'MED-SALBUTAMOL-ML', productType: 'MEDICINE', genericName: 'Salbutamol Sulphate Expectorant Syrup', brandName: 'Ventolin Expectorant Liquid', strength: '2 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 2.50, purchasePrice: 1.50,
    reorderLevel: 300, prescriptionRequired: true, activeIngredient: 'Salbutamol', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001010', variantGroup: 'Salbutamol Liquid Dispensed',
    storageInstructions: 'Store below 30°C protected from light.', batchNumber: 'ML-SAL-2610', initialQty: 2000, expiryDays: 680,
  },
  {
    sku: 'MED-CHLORPHEN-ML', productType: 'MEDICINE', genericName: 'Chlorpheniramine Maleate Syrup (Piriton)', brandName: 'Piriton Paediatric Liquid', strength: '2 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 1.90, purchasePrice: 1.10,
    reorderLevel: 300, prescriptionRequired: false, activeIngredient: 'Chlorpheniramine', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001011', variantGroup: 'Chlorpheniramine Liquid Dispensed',
    storageInstructions: 'Store below 25°C protected from light.', batchNumber: 'ML-CHL-2611', initialQty: 2500, expiryDays: 730,
  },
  {
    sku: 'MED-DIPHENHYD-ML', productType: 'MEDICINE', genericName: 'Diphenhydramine Hydrochloride Cough Linctus', brandName: 'Benadryl Paediatric Liquid', strength: '12.5 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 2.20, purchasePrice: 1.30,
    reorderLevel: 250, prescriptionRequired: false, activeIngredient: 'Diphenhydramine', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001012', variantGroup: 'Cough Linctus Liquid Dispensed',
    storageInstructions: 'Store below 25°C.', batchNumber: 'ML-DIP-2612', initialQty: 2000, expiryDays: 700,
  },
  {
    sku: 'MED-BROMHEXINE-ML', productType: 'MEDICINE', genericName: 'Bromhexine Hydrochloride Mucolytic Elixir', brandName: 'Bisolvon Paediatric Liquid', strength: '4 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 2.60, purchasePrice: 1.60,
    reorderLevel: 250, prescriptionRequired: false, activeIngredient: 'Bromhexine', manufacturerName: 'Boehringer Ingelheim',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4791000001013', variantGroup: 'Bromhexine Liquid Dispensed',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'ML-BRO-2613', initialQty: 1800, expiryDays: 710,
  },
  {
    sku: 'MED-PREDNISOLONE-ML', productType: 'MEDICINE', genericName: 'Prednisolone Paediatric Oral Solution', brandName: 'Prednisolone Paediatric Liquid', strength: '5 mg/5 mL',
    dosageForm: 'Oral solution', unit: 'ml', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 4.50, purchasePrice: 2.80,
    reorderLevel: 150, prescriptionRequired: true, activeIngredient: 'Prednisolone', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000001014', variantGroup: 'Prednisolone Liquid Dispensed',
    storageInstructions: 'Store below 25°C protected from light.', batchNumber: 'ML-PRE-2614', initialQty: 1200, expiryDays: 620,
  },
  {
    sku: 'MED-DOMPERIDONE-ML', productType: 'MEDICINE', genericName: 'Domperidone Paediatric Oral Suspension', brandName: 'Motilium Paediatric Liquid', strength: '5 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 3.80, purchasePrice: 2.30,
    reorderLevel: 200, prescriptionRequired: true, activeIngredient: 'Domperidone', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001015', variantGroup: 'Domperidone Liquid Dispensed',
    storageInstructions: 'Store below 30°C.', batchNumber: 'ML-DOM-2615', initialQty: 1500, expiryDays: 660,
  },
  {
    sku: 'MED-ONDANSETRON-ML', productType: 'MEDICINE', genericName: 'Ondansetron Paediatric Oral Solution', brandName: 'Zofran Paediatric Liquid', strength: '4 mg/5 mL',
    dosageForm: 'Oral solution', unit: 'ml', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 7.50, purchasePrice: 4.90,
    reorderLevel: 120, prescriptionRequired: true, activeIngredient: 'Ondansetron', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000001016', variantGroup: 'Ondansetron Liquid Dispensed',
    storageInstructions: 'Store upright below 30°C. Protect from light.', batchNumber: 'ML-OND-2616', initialQty: 1000, expiryDays: 600,
  },
  {
    sku: 'MED-LACTULOSE-ML', productType: 'MEDICINE', genericName: 'Lactulose Concentrated Oral Solution', brandName: 'Duphalac Bulk Liquid', strength: '3.35 g/5 mL',
    dosageForm: 'Oral solution', unit: 'ml', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 3.60, purchasePrice: 2.20,
    reorderLevel: 400, prescriptionRequired: false, activeIngredient: 'Lactulose', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '4791000001017', variantGroup: 'Lactulose Liquid Dispensed',
    storageInstructions: 'Store between 15°C and 25°C. Do not freeze.', batchNumber: 'ML-LAC-2617', initialQty: 3500, expiryDays: 730,
  },
  {
    sku: 'MED-ANTACID-ML', productType: 'MEDICINE', genericName: 'Aluminium Hydroxide and Magnesium Trisilicate Gel', brandName: 'Antacid Suspension Bulk Liquid', strength: '250 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'ml', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 2.00, purchasePrice: 1.20,
    reorderLevel: 500, prescriptionRequired: false, activeIngredient: 'Aluminium Hydroxide', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000001018', variantGroup: 'Antacid Liquid Dispensed',
    storageInstructions: 'Store below 25°C. Shake well before use.', batchNumber: 'ML-ANT-2618', initialQty: 4000, expiryDays: 730,
  },
  {
    sku: 'MED-MULTIVIT-ML', productType: 'MEDICINE', genericName: 'Paediatric Multivitamin Drops and Syrup', brandName: 'Abidec Paediatric Liquid', strength: '5 mL Formula',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Vitamins, Minerals & Supplements', sellingPrice: 2.70, purchasePrice: 1.60,
    reorderLevel: 200, prescriptionRequired: false, activeIngredient: 'Multivitamin', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4791000001019', variantGroup: 'Multivitamin Liquid Dispensed',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'ML-MUL-2619', initialQty: 1500, expiryDays: 690,
  },
  {
    sku: 'MED-ZINC-ML', productType: 'MEDICINE', genericName: 'Zinc Sulfate Paediatric Oral Solution', brandName: 'Zincovit Paediatric Liquid', strength: '10 mg/5 mL',
    dosageForm: 'Syrup', unit: 'ml', categoryName: 'Vitamins, Minerals & Supplements', sellingPrice: 2.20, purchasePrice: 1.30,
    reorderLevel: 250, prescriptionRequired: false, activeIngredient: 'Zinc Sulfate', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791000001020', variantGroup: 'Zinc Liquid Dispensed',
    storageInstructions: 'Store below 25°C in a dry place.', batchNumber: 'ML-ZIN-2620', initialQty: 1800, expiryDays: 720,
  },
];

export async function buildMasterCatalog() {
  console.log('\n======================================================');
  console.log(' BUILDING MASTER PHARMACY CATALOG FOR MEDIFLOW');
  console.log('======================================================\n');

  // 1. Load crawled Kanapathee items
  const rawDataPath = resolve(__dirname, 'kanapathee_raw.json');
  let crawledProducts = [];
  try {
    const rawItems = JSON.parse(readFileSync(rawDataPath, 'utf8'));
    crawledProducts = transformToMediFlow(rawItems);
    console.log(`✓ Loaded ${crawledProducts.length} items from live kanapathee.com crawl.`);
  } catch (err) {
    console.warn('Could not load kanapathee_raw.json, proceeding with curated collections.', err.message);
  }

  console.log(`✓ Loaded ${curatedEssentials.length} curated hospital & community essentials.`);
  console.log(`✓ Loaded ${additionalFormulary.length} expanded clinical & retail formulary items.`);

  // Combine all items, deduplicating by SKU
  const masterProductMap = new Map();

  for (const item of [...curatedEssentials, ...additionalFormulary, ...crawledProducts]) {
    if (!masterProductMap.has(item.sku)) {
      masterProductMap.set(item.sku, item);
    }
  }

  const allProducts = Array.from(masterProductMap.values());
  console.log(`\n===> Total Master Products: ${allProducts.length}`);

  // Escape helper
  function escapeCsv(value) {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // 1. Generate Master CSV
  const csvHeaders = [
    'sku', 'productType', 'genericName', 'strength', 'dosageForm', 'unit', 'categoryName',
    'sellingPrice', 'reorderLevel', 'prescriptionRequired', 'active', 'brandName', 'activeIngredient',
    'manufacturerName', 'barcode', 'variantGroup', 'storageInstructions', 'minimumAgeYears',
    'maximumAgeYears', 'rxNormCui', 'pubchemCid', 'smiles'
  ];

  const csvRows = [
    csvHeaders.join(','),
    ...allProducts.map((p) => [
      escapeCsv(p.sku),
      escapeCsv(p.productType),
      escapeCsv(p.genericName),
      escapeCsv(p.strength),
      escapeCsv(p.dosageForm),
      escapeCsv(p.unit),
      escapeCsv(p.categoryName),
      escapeCsv(Number(p.sellingPrice).toFixed(2)),
      escapeCsv(p.reorderLevel),
      escapeCsv(p.prescriptionRequired ? 'Yes' : 'No'),
      escapeCsv('Yes'),
      escapeCsv(p.brandName || ''),
      escapeCsv(p.activeIngredient || ''),
      escapeCsv(p.manufacturerName || ''),
      escapeCsv(p.barcode || ''),
      escapeCsv(p.variantGroup || ''),
      escapeCsv(p.storageInstructions || ''),
      escapeCsv(p.minimumAgeYears ?? ''),
      escapeCsv(p.maximumAgeYears ?? ''),
      escapeCsv(p.rxNormCui || ''),
      escapeCsv(p.pubchemCid || ''),
      escapeCsv(p.smiles || ''),
    ].join(','))
  ].join('\r\n');

  const masterCsvPath = resolve(rootDir, 'data/catalogs/master-catalog.csv');

  writeFileSync(masterCsvPath, `\uFEFF${csvRows}`, 'utf8');

  return allProducts;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  buildMasterCatalog().catch(console.error);
}
