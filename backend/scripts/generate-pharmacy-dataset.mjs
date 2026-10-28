import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');
mkdirSync(resolve(rootDir, 'data/catalogs'), { recursive: true });

export const realSuppliers = [
  {
    name: 'Hemas Pharmaceuticals (Pvt) Ltd',
    contactPerson: 'Sanjeewa Samaranayake',
    phone: '+94 11 473 1731',
    email: 'inquiries@hemaspharmaceuticals.com',
    address: 'Hemas House, No. 75, Braybrooke Place, Colombo 02, Sri Lanka',
  },
  {
    name: 'A. Baur & Co. (Pvt) Ltd',
    contactPerson: 'Dr. Lakshman Weerasena',
    phone: '+94 11 472 8700',
    email: 'healthcare@baurs.com',
    address: 'No. 62, Jethawana Road, Colombo 14, Sri Lanka',
  },
  {
    name: 'Sunshine Healthcare Lanka Ltd',
    contactPerson: 'T. Sayandhan',
    phone: '+94 11 470 2400',
    email: 'info@sunshinehealthcare.net',
    address: 'No. 60, Nawala Road, Narahenpita, Colombo 05, Sri Lanka',
  },
  {
    name: 'George Steuart Health (Pvt) Ltd',
    contactPerson: 'Erandajith Ranasinghe',
    phone: '+94 11 268 2050',
    email: 'health@georgesteuart.lk',
    address: 'No. 19, Janadhipathi Mawatha, Colombo 01, Sri Lanka',
  },
  {
    name: 'Emerchemie NB (Ceylon) Limited',
    contactPerson: 'Lalith Jayawardena',
    phone: '+94 11 269 8812',
    email: 'pharma@emerchemie.lk',
    address: 'No. 46, Sri Deva Ratnadhara Mawatha, Colombo 10, Sri Lanka',
  },
  {
    name: 'State Pharmaceuticals Corporation (SPC)',
    contactPerson: 'Nihal Alwis',
    phone: '+94 11 232 0356',
    email: 'gm@spc.lk',
    address: 'No. 75, Sir Baron Jayathilake Mawatha, Colombo 01, Sri Lanka',
  },
  {
    name: 'Morison PLC',
    contactPerson: 'Dinesh Pathirana',
    phone: '+94 11 244 4760',
    email: 'info@morison.lk',
    address: 'No. 620, Biyagama Road, Pethiyagoda, Kelaniya, Sri Lanka',
  },
  {
    name: 'Ansell Lanka (Pvt) Ltd',
    contactPerson: 'Rohan Fernando',
    phone: '+94 11 482 6800',
    email: 'supplychain.lanka@ansell.com',
    address: 'Ring Road Phase II, Export Processing Zone, Biyagama, Sri Lanka',
  },
];

export const realManufacturers = [
  { name: 'GlaxoSmithKline (GSK) Pharmaceuticals', country: 'United Kingdom', phone: '+44 20 8047 5000', email: 'customer.contact@gsk.com' },
  { name: 'State Pharmaceuticals Manufacturing Corporation (SPMC)', country: 'Sri Lanka', phone: '+94 11 285 2405', email: 'spmc@sltnet.lk' },
  { name: 'Pfizer Laboratories Ltd', country: 'United States', phone: '+1 212 733 2323', email: 'medinfo@pfizer.com' },
  { name: 'Abbott Laboratories', country: 'United States', phone: '+1 847 937 6100', email: 'nutrition@abbott.com' },
  { name: 'Cipla Ltd', country: 'India', phone: '+91 22 2482 6000', email: 'contact@cipla.com' },
  { name: 'Sun Pharmaceutical Industries Ltd', country: 'India', phone: '+91 22 4324 4324', email: 'secretarial@sunpharma.com' },
  { name: 'AstraZeneca Pharmaceuticals', country: 'United Kingdom', phone: '+44 20 3749 5000', email: 'medical.information@astrazeneca.com' },
  { name: 'Roche Diagnostics', country: 'Switzerland', phone: '+41 61 688 1111', email: 'diabetescare@roche.com' },
  { name: 'Omron Healthcare Co., Ltd', country: 'Japan', phone: '+81 75 925 2000', email: 'support@omronhealthcare.com' },
  { name: 'Reckitt Benckiser Healthcare', country: 'United Kingdom', phone: '+44 1753 217800', email: 'consumer.relations@reckitt.com' },
  { name: '3M Healthcare Ltd', country: 'United States', phone: '+1 888 364 3577', email: 'medical@mmm.com' },
  { name: 'Ansell Healthcare', country: 'Australia', phone: '+61 3 9270 7270', email: 'info@ansell.com' },
  { name: 'Unilever Sri Lanka Ltd', country: 'Sri Lanka', phone: '+94 11 269 4901', email: 'consumer.care@unilever.com' },
  { name: 'Johnson & Johnson', country: 'United States', phone: '+1 732 524 0400', email: 'consumerinfo@jnj.com' },
  { name: 'Bayer Consumer Care', country: 'Germany', phone: '+49 214 301', email: 'contact@bayer.com' },
];

export const realCategories = [
  { name: 'Analgesics & Antipyretics', description: 'Pain relief, fever reduction, and anti-inflammatory medications' },
  { name: 'Antibiotics & Antimicrobials', description: 'Bacterial, fungal, and broad-spectrum antimicrobial agents' },
  { name: 'Cardiovascular & Antihypertensives', description: 'Blood pressure control, cholesterol, and cardiac care' },
  { name: 'Endocrine & Diabetes Care', description: 'Oral hypoglycaemics, insulin management, and thyroid hormones' },
  { name: 'Gastrointestinal & Digestive', description: 'Antacids, proton pump inhibitors, antiemetics, and laxatives' },
  { name: 'Respiratory & Anti-Allergy', description: 'Inhalers, bronchodilators, antihistamines, and leukotriene blockers' },
  { name: 'Dermatology & Topical Treatments', description: 'Steroid creams, antifungal ointments, and wound dressings' },
  { name: 'Vitamins, Minerals & Supplements', description: 'Micronutrients, bone health calcium, and essential vitamin complexes' },
  { name: 'First Aid & Surgical Dressings', description: 'Antiseptics, sterile gauze, syringes, bandages, and medical tapes' },
  { name: 'Diagnostic Devices & Monitors', description: 'Blood pressure monitors, glucometers, digital thermometers, and oximeters' },
  { name: 'Personal Hygiene & Sanitization', description: 'Disinfectants, hand sanitizers, sanitary wear, and baby diapers' },
  { name: 'Clinical Nutrition & Infant Care', description: 'Specialized dietary formulas, oral rehydration, and nutritional supplements' },
];

export const realProducts = [
  // Analgesics & Antipyretics
  {
    sku: 'MED-PANADOL-500', productType: 'MEDICINE', genericName: 'Paracetamol', brandName: 'Panadol', strength: '500 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 4.50, purchasePrice: 2.80,
    reorderLevel: 500, prescriptionRequired: false, active: true, activeIngredient: 'Paracetamol', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563001234', variantGroup: 'Paracetamol Oral',
    storageInstructions: 'Store below 30°C in a dry place protected from direct sunlight.', minimumAgeYears: 6, maximumAgeYears: 120,
    rxNormCui: '161', pubchemCid: 1983, batchNumber: 'PAN-2601-A', initialQty: 5000, expiryDays: 720,
  },
  {
    sku: 'MED-PANADOL-EXT', productType: 'MEDICINE', genericName: 'Paracetamol and Caffeine', brandName: 'Panadol Extra', strength: '500 mg / 65 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 7.50, purchasePrice: 4.80,
    reorderLevel: 300, prescriptionRequired: false, active: true, activeIngredient: 'Paracetamol', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563004562', variantGroup: 'Paracetamol Oral',
    storageInstructions: 'Store below 30°C in a dry place.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '161', pubchemCid: 1983, batchNumber: 'PEX-2602-B', initialQty: 2400, expiryDays: 680,
  },
  {
    sku: 'MED-PANADOL-SYR', productType: 'MEDICINE', genericName: 'Paracetamol Paediatric Suspension', brandName: 'Panadol Baby & Infant', strength: '120 mg/5 mL',
    dosageForm: 'Oral suspension', unit: 'bottle', categoryName: 'Analgesics & Antipyretics', sellingPrice: 380.00, purchasePrice: 260.00,
    reorderLevel: 50, prescriptionRequired: false, active: true, activeIngredient: 'Paracetamol', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563007891', variantGroup: 'Paracetamol Oral',
    storageInstructions: 'Store below 25°C. Do not freeze. Shake well before use.', minimumAgeYears: 0, maximumAgeYears: 12,
    rxNormCui: '161', pubchemCid: 1983, batchNumber: 'PSY-2603-C', initialQty: 180, expiryDays: 540,
  },
  {
    sku: 'MED-BRUFEN-400', productType: 'MEDICINE', genericName: 'Ibuprofen', brandName: 'Brufen', strength: '400 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 14.50, purchasePrice: 9.20,
    reorderLevel: 300, prescriptionRequired: false, active: true, activeIngredient: 'Ibuprofen', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '4010123456789', variantGroup: 'Ibuprofen Oral',
    storageInstructions: 'Store below 25°C in a dry place. Take with food or milk.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '5640', pubchemCid: 3672, batchNumber: 'BRU-2604-D', initialQty: 1500, expiryDays: 600,
  },
  {
    sku: 'MED-VOLTAREN-50', productType: 'MEDICINE', genericName: 'Diclofenac Sodium', brandName: 'Voltaren', strength: '50 mg',
    dosageForm: 'Enteric-coated tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 28.00, purchasePrice: 18.50,
    reorderLevel: 200, prescriptionRequired: true, active: true, activeIngredient: 'Diclofenac', manufacturerName: 'Novartis Pharma AG',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '7680312345012', variantGroup: 'Diclofenac Oral',
    storageInstructions: 'Protect from heat and moisture. Store below 30°C.', minimumAgeYears: 14, maximumAgeYears: 120,
    rxNormCui: '3355', pubchemCid: 3033, batchNumber: 'VOL-2605-E', initialQty: 800, expiryDays: 520,
  },
  {
    sku: 'MED-PONSTAN-500', productType: 'MEDICINE', genericName: 'Mefenamic Acid', brandName: 'Ponstan Forte', strength: '500 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Analgesics & Antipyretics', sellingPrice: 32.00, purchasePrice: 21.00,
    reorderLevel: 150, prescriptionRequired: true, active: true, activeIngredient: 'Mefenamic Acid', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '5012345678901', variantGroup: 'Mefenamic Acid',
    storageInstructions: 'Store below 30°C in a dry place.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '6754', pubchemCid: 4044, batchNumber: 'PON-2606-F', initialQty: 600, expiryDays: 640,
  },

  // Antibiotics & Antimicrobials
  {
    sku: 'MED-AUGMENTIN-625', productType: 'MEDICINE', genericName: 'Amoxicillin and Clavulanate Potassium', brandName: 'Augmentin', strength: '625 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 165.00, purchasePrice: 115.00,
    reorderLevel: 200, prescriptionRequired: true, active: true, activeIngredient: 'Amoxicillin', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563009012', variantGroup: 'Co-Amoxiclav Oral',
    storageInstructions: 'Store in original desiccated foil pack below 25°C.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '18631', pubchemCid: 33613, batchNumber: 'AUG-2607-G', initialQty: 1200, expiryDays: 480,
  },
  {
    sku: 'MED-AMOXIL-500', productType: 'MEDICINE', genericName: 'Amoxicillin Trihydrate', brandName: 'Amoxil SPMC', strength: '500 mg',
    dosageForm: 'Capsule', unit: 'capsule', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 22.50, purchasePrice: 14.00,
    reorderLevel: 400, prescriptionRequired: true, active: true, activeIngredient: 'Amoxicillin', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791234567011', variantGroup: 'Amoxicillin Oral',
    storageInstructions: 'Store below 25°C in a dry place.', minimumAgeYears: 10, maximumAgeYears: 120,
    rxNormCui: '723', pubchemCid: 33613, batchNumber: 'AMX-2608-H', initialQty: 2500, expiryDays: 580,
  },
  {
    sku: 'MED-ZITHROMAX-500', productType: 'MEDICINE', genericName: 'Azithromycin Dihydrate', brandName: 'Zithromax', strength: '500 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 210.00, purchasePrice: 145.00,
    reorderLevel: 100, prescriptionRequired: true, active: true, activeIngredient: 'Azithromycin', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '5012345678918', variantGroup: 'Azithromycin Oral',
    storageInstructions: 'Store below 30°C.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '18631', pubchemCid: 447043, batchNumber: 'ZIT-2609-I', initialQty: 400, expiryDays: 610,
  },
  {
    sku: 'MED-ZINNAT-500', productType: 'MEDICINE', genericName: 'Cefuroxime Axetil', brandName: 'Zinnat', strength: '500 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 285.00, purchasePrice: 198.00,
    reorderLevel: 100, prescriptionRequired: true, active: true, activeIngredient: 'Cefuroxime', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563009456', variantGroup: 'Cefuroxime Oral',
    storageInstructions: 'Store below 30°C in a dry place.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '2193', pubchemCid: 5479529, batchNumber: 'ZIN-2610-J', initialQty: 350, expiryDays: 490,
  },
  {
    sku: 'MED-CIFRAN-500', productType: 'MEDICINE', genericName: 'Ciprofloxacin Hydrochloride', brandName: 'Cifran', strength: '500 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 35.00, purchasePrice: 22.50,
    reorderLevel: 150, prescriptionRequired: true, active: true, activeIngredient: 'Ciprofloxacin', manufacturerName: 'Sun Pharmaceutical Industries Ltd',
    supplierName: 'Emerchemie NB (Ceylon) Limited', barcode: '8901112223334', variantGroup: 'Ciprofloxacin Oral',
    storageInstructions: 'Store protected from light and moisture at a temperature not exceeding 25°C.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '2551', pubchemCid: 2764, batchNumber: 'CIF-2611-K', initialQty: 600, expiryDays: 560,
  },
  {
    sku: 'MED-FLAGYL-400', productType: 'MEDICINE', genericName: 'Metronidazole', brandName: 'Flagyl', strength: '400 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Antibiotics & Antimicrobials', sellingPrice: 12.00, purchasePrice: 7.50,
    reorderLevel: 250, prescriptionRequired: true, active: true, activeIngredient: 'Metronidazole', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '3582910001234', variantGroup: 'Metronidazole Oral',
    storageInstructions: 'Store below 25°C protected from light.', minimumAgeYears: 8, maximumAgeYears: 120,
    rxNormCui: '6922', pubchemCid: 4173, batchNumber: 'FLA-2612-L', initialQty: 1200, expiryDays: 620,
  },

  // Cardiovascular & Antihypertensives
  {
    sku: 'MED-NORVASC-5', productType: 'MEDICINE', genericName: 'Amlodipine Besylate', brandName: 'Norvasc', strength: '5 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 48.00, purchasePrice: 32.00,
    reorderLevel: 200, prescriptionRequired: true, active: true, activeIngredient: 'Amlodipine', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '5012345678925', variantGroup: 'Amlodipine Oral',
    storageInstructions: 'Store below 30°C in a dry place.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '17767', pubchemCid: 2162, batchNumber: 'NOR-2613-M', initialQty: 1000, expiryDays: 700,
  },
  {
    sku: 'MED-COZAAR-50', productType: 'MEDICINE', genericName: 'Losartan Potassium', brandName: 'Cozaar', strength: '50 mg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 62.00, purchasePrice: 41.00,
    reorderLevel: 200, prescriptionRequired: true, active: true, activeIngredient: 'Losartan', manufacturerName: 'Cipla Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '8901234567890', variantGroup: 'Losartan Oral',
    storageInstructions: 'Store below 30°C. Protect from light.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '52175', pubchemCid: 3961, batchNumber: 'COZ-2614-N', initialQty: 900, expiryDays: 650,
  },
  {
    sku: 'MED-LIPITOR-20', productType: 'MEDICINE', genericName: 'Atorvastatin Calcium', brandName: 'Lipitor', strength: '20 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 95.00, purchasePrice: 64.00,
    reorderLevel: 150, prescriptionRequired: true, active: true, activeIngredient: 'Atorvastatin', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '5012345678932', variantGroup: 'Atorvastatin Oral',
    storageInstructions: 'Store at controlled room temperature 20°C to 25°C.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '83367', pubchemCid: 60823, batchNumber: 'LIP-2615-O', initialQty: 750, expiryDays: 670,
  },
  {
    sku: 'MED-PLAVIX-75', productType: 'MEDICINE', genericName: 'Clopidogrel Bisulfate', brandName: 'Plavix', strength: '75 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 110.00, purchasePrice: 75.00,
    reorderLevel: 100, prescriptionRequired: true, active: true, activeIngredient: 'Clopidogrel', manufacturerName: 'Sanofi-Aventis',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '3582910005678', variantGroup: 'Clopidogrel Oral',
    storageInstructions: 'Store below 25°C.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '32968', pubchemCid: 60606, batchNumber: 'PLA-2616-P', initialQty: 500, expiryDays: 580,
  },
  {
    sku: 'MED-CARDIPRIN-100', productType: 'MEDICINE', genericName: 'Aspirin Low Dose', brandName: 'Cardiprin', strength: '100 mg',
    dosageForm: 'Dispersible tablet', unit: 'tablet', categoryName: 'Cardiovascular & Antihypertensives', sellingPrice: 8.50, purchasePrice: 5.20,
    reorderLevel: 300, prescriptionRequired: false, active: true, activeIngredient: 'Aspirin', manufacturerName: 'Reckitt Benckiser Healthcare',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5000158068945', variantGroup: 'Aspirin Oral',
    storageInstructions: 'Store below 25°C in a dry place.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '1191', pubchemCid: 2244, batchNumber: 'CAR-2617-Q', initialQty: 1800, expiryDays: 690,
  },

  // Endocrine & Diabetes Care
  {
    sku: 'MED-GLUCOPHAGE-500', productType: 'MEDICINE', genericName: 'Metformin Hydrochloride', brandName: 'Glucophage', strength: '500 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Endocrine & Diabetes Care', sellingPrice: 18.00, purchasePrice: 11.50,
    reorderLevel: 400, prescriptionRequired: true, active: true, activeIngredient: 'Metformin', manufacturerName: 'Merck Healthcare KGaA',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4027453001234', variantGroup: 'Metformin Oral',
    storageInstructions: 'Store below 25°C in a dry place.', minimumAgeYears: 10, maximumAgeYears: 120,
    rxNormCui: '6809', pubchemCid: 4091, batchNumber: 'GLU-2618-R', initialQty: 3000, expiryDays: 710,
  },
  {
    sku: 'MED-DIAMICRON-60MR', productType: 'MEDICINE', genericName: 'Gliclazide Modified Release', brandName: 'Diamicron MR', strength: '60 mg',
    dosageForm: 'Modified-release tablet', unit: 'tablet', categoryName: 'Endocrine & Diabetes Care', sellingPrice: 42.00, purchasePrice: 28.00,
    reorderLevel: 200, prescriptionRequired: true, active: true, activeIngredient: 'Gliclazide', manufacturerName: 'Servier Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '3400936854123', variantGroup: 'Gliclazide Oral',
    storageInstructions: 'Store below 30°C.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '4815', pubchemCid: 3476, batchNumber: 'DIA-2619-S', initialQty: 1200, expiryDays: 530,
  },
  {
    sku: 'MED-JANUVIA-100', productType: 'MEDICINE', genericName: 'Sitagliptin Phosphate', brandName: 'Januvia', strength: '100 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Endocrine & Diabetes Care', sellingPrice: 240.00, purchasePrice: 170.00,
    reorderLevel: 80, prescriptionRequired: true, active: true, activeIngredient: 'Sitagliptin', manufacturerName: 'Organon / MSD',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '8901234567999', variantGroup: 'Sitagliptin Oral',
    storageInstructions: 'Store between 20°C and 25°C.', minimumAgeYears: 18, maximumAgeYears: 120,
    rxNormCui: '593411', pubchemCid: 4369359, batchNumber: 'JAN-2620-T', initialQty: 300, expiryDays: 620,
  },
  {
    sku: 'MED-ELTROXIN-50', productType: 'MEDICINE', genericName: 'Levothyroxine Sodium', brandName: 'Eltroxin', strength: '50 mcg',
    dosageForm: 'Tablet', unit: 'tablet', categoryName: 'Endocrine & Diabetes Care', sellingPrice: 9.50, purchasePrice: 6.00,
    reorderLevel: 300, prescriptionRequired: true, active: true, activeIngredient: 'Levothyroxine', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563006789', variantGroup: 'Levothyroxine Oral',
    storageInstructions: 'Store below 25°C protected from light and moisture.', minimumAgeYears: 0, maximumAgeYears: 120,
    rxNormCui: '10582', pubchemCid: 5819, batchNumber: 'ELT-2621-U', initialQty: 1500, expiryDays: 500,
  },

  // Gastrointestinal & Digestive
  {
    sku: 'MED-NEXIUM-20', productType: 'MEDICINE', genericName: 'Esomeprazole Magnesium', brandName: 'Nexium', strength: '20 mg',
    dosageForm: 'Gastro-resistant tablet', unit: 'tablet', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 85.00, purchasePrice: 56.00,
    reorderLevel: 150, prescriptionRequired: true, active: true, activeIngredient: 'Esomeprazole', manufacturerName: 'AstraZeneca Pharmaceuticals',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '7312345678901', variantGroup: 'Esomeprazole Oral',
    storageInstructions: 'Store below 30°C in original package to protect from moisture.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '283742', pubchemCid: 9568614, batchNumber: 'NEX-2622-V', initialQty: 900, expiryDays: 660,
  },
  {
    sku: 'MED-LOSEC-20', productType: 'MEDICINE', genericName: 'Omeprazole', brandName: 'Losec SPMC', strength: '20 mg',
    dosageForm: 'Capsule', unit: 'capsule', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 25.00, purchasePrice: 15.00,
    reorderLevel: 300, prescriptionRequired: true, active: true, activeIngredient: 'Omeprazole', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791112223335', variantGroup: 'Omeprazole Oral',
    storageInstructions: 'Store below 25°C. Keep bottle tightly closed.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '7646', pubchemCid: 4594, batchNumber: 'LOS-2623-W', initialQty: 2000, expiryDays: 550,
  },
  {
    sku: 'MED-MOTILIUM-10', productType: 'MEDICINE', genericName: 'Domperidone', brandName: 'Motilium', strength: '10 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 16.00, purchasePrice: 10.20,
    reorderLevel: 200, prescriptionRequired: true, active: true, activeIngredient: 'Domperidone', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5410123456789', variantGroup: 'Domperidone Oral',
    storageInstructions: 'Store below 30°C.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '3583', pubchemCid: 3153, batchNumber: 'MOT-2624-X', initialQty: 1200, expiryDays: 610,
  },
  {
    sku: 'MED-GAVISCON-LIQ', productType: 'MEDICINE', genericName: 'Sodium Alginate and Bicarbonate', brandName: 'Gaviscon Double Action Liquid', strength: '200 mL',
    dosageForm: 'Oral suspension', unit: 'bottle', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 1450.00, purchasePrice: 1020.00,
    reorderLevel: 30, prescriptionRequired: false, active: true, activeIngredient: 'Sodium Alginate', manufacturerName: 'Reckitt Benckiser Healthcare',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5000158069003', variantGroup: 'Antacid Liquid',
    storageInstructions: 'Do not store above 30°C. Do not refrigerate or freeze.', minimumAgeYears: 6, maximumAgeYears: 120,
    rxNormCui: '2053', pubchemCid: 5102882, batchNumber: 'GAV-2625-Y', initialQty: 80, expiryDays: 480,
  },
  {
    sku: 'MED-DUPHALAC-SYR', productType: 'MEDICINE', genericName: 'Lactulose Solution', brandName: 'Duphalac', strength: '3.33 g/5 mL (200 mL)',
    dosageForm: 'Oral solution', unit: 'bottle', categoryName: 'Gastrointestinal & Digestive', sellingPrice: 1150.00, purchasePrice: 810.00,
    reorderLevel: 25, prescriptionRequired: false, active: true, activeIngredient: 'Lactulose', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '4010123459995', variantGroup: 'Lactulose Solution',
    storageInstructions: 'Store below 25°C. Do not freeze.', minimumAgeYears: 0, maximumAgeYears: 120,
    rxNormCui: '6241', pubchemCid: 11333, batchNumber: 'DUP-2626-Z', initialQty: 60, expiryDays: 570,
  },

  // Respiratory & Anti-Allergy
  {
    sku: 'MED-VENTOLIN-100', productType: 'MEDICINE', genericName: 'Salbutamol Inhaler CFC-Free', brandName: 'Ventolin Evohaler', strength: '100 mcg/dose (200 doses)',
    dosageForm: 'Inhaler', unit: 'puff', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 1250.00, purchasePrice: 880.00,
    reorderLevel: 40, prescriptionRequired: true, active: true, activeIngredient: 'Salbutamol', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563008888', variantGroup: 'Salbutamol Inhaler',
    storageInstructions: 'Store below 30°C. Protect from frost and direct sunlight.', minimumAgeYears: 4, maximumAgeYears: 120,
    rxNormCui: '435', pubchemCid: 2088, batchNumber: 'VEN-2627-A', initialQty: 120, expiryDays: 590,
  },
  {
    sku: 'MED-SERETIDE-250', productType: 'MEDICINE', genericName: 'Salmeterol and Fluticasone Propionate', brandName: 'Seretide Evohaler 250', strength: '25 mcg / 250 mcg (120 doses)',
    dosageForm: 'Inhaler', unit: 'puff', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 4850.00, purchasePrice: 3500.00,
    reorderLevel: 20, prescriptionRequired: true, active: true, activeIngredient: 'Fluticasone Propionate', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563007777', variantGroup: 'Combination Inhaler',
    storageInstructions: 'Store below 30°C. Protect from frost and direct heat.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '284635', pubchemCid: 5311101, batchNumber: 'SER-2628-B', initialQty: 40, expiryDays: 450,
  },
  {
    sku: 'MED-ZYRTEC-10', productType: 'MEDICINE', genericName: 'Cetirizine Dihydrochloride', brandName: 'Zyrtec', strength: '10 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 35.00, purchasePrice: 23.00,
    reorderLevel: 300, prescriptionRequired: false, active: true, activeIngredient: 'Cetirizine', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5413787012345', variantGroup: 'Cetirizine Oral',
    storageInstructions: 'Store below 25°C in a dry place.', minimumAgeYears: 6, maximumAgeYears: 120,
    rxNormCui: '20610', pubchemCid: 2678, batchNumber: 'ZYR-2629-C', initialQty: 1500, expiryDays: 670,
  },
  {
    sku: 'MED-SINGULAIR-10', productType: 'MEDICINE', genericName: 'Montelukast Sodium', brandName: 'Singulair', strength: '10 mg',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Respiratory & Anti-Allergy', sellingPrice: 135.00, purchasePrice: 92.00,
    reorderLevel: 100, prescriptionRequired: true, active: true, activeIngredient: 'Montelukast', manufacturerName: 'Organon / MSD',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '8901234568880', variantGroup: 'Montelukast Oral',
    storageInstructions: 'Store in original package at 15°C to 30°C. Protect from moisture and light.', minimumAgeYears: 15, maximumAgeYears: 120,
    rxNormCui: '76895', pubchemCid: 5281040, batchNumber: 'SIN-2630-D', initialQty: 500, expiryDays: 630,
  },

  // Dermatology & Topical Treatments
  {
    sku: 'MED-BETNOVATE-N', productType: 'MEDICINE', genericName: 'Betamethasone Valerate and Neomycin Sulfate', brandName: 'Betnovate-N Cream', strength: '0.1% / 0.5% (15 g)',
    dosageForm: 'Cream', unit: 'tube', categoryName: 'Dermatology & Topical Treatments', sellingPrice: 540.00, purchasePrice: 375.00,
    reorderLevel: 50, prescriptionRequired: true, active: true, activeIngredient: 'Betamethasone', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563005555', variantGroup: 'Betamethasone Topical',
    storageInstructions: 'Store below 25°C. Do not freeze.', minimumAgeYears: 2, maximumAgeYears: 120,
    rxNormCui: '1399', pubchemCid: 9782, batchNumber: 'BET-2631-E', initialQty: 150, expiryDays: 520,
  },
  {
    sku: 'MED-CANESTEN-1CR', productType: 'MEDICINE', genericName: 'Clotrimazole Anti-Fungal Cream', brandName: 'Canesten Cream 1%', strength: '1% w/w (20 g)',
    dosageForm: 'Cream', unit: 'tube', categoryName: 'Dermatology & Topical Treatments', sellingPrice: 680.00, purchasePrice: 470.00,
    reorderLevel: 40, prescriptionRequired: false, active: true, activeIngredient: 'Clotrimazole', manufacturerName: 'Bayer Consumer Care',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4008500123456', variantGroup: 'Clotrimazole Topical',
    storageInstructions: 'Store below 25°C.', minimumAgeYears: 2, maximumAgeYears: 120,
    rxNormCui: '2598', pubchemCid: 2812, batchNumber: 'CAN-2632-F', initialQty: 120, expiryDays: 640,
  },
  {
    sku: 'MED-BACTROBAN-OIN', productType: 'MEDICINE', genericName: 'Mupirocin Antibiotic Ointment', brandName: 'Bactroban 2% Ointment', strength: '2% (15 g)',
    dosageForm: 'Ointment', unit: 'tube', categoryName: 'Dermatology & Topical Treatments', sellingPrice: 1120.00, purchasePrice: 790.00,
    reorderLevel: 30, prescriptionRequired: true, active: true, activeIngredient: 'Mupirocin', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563004444', variantGroup: 'Mupirocin Topical',
    storageInstructions: 'Store below 25°C.', minimumAgeYears: 1, maximumAgeYears: 120,
    rxNormCui: '7154', pubchemCid: 446596, batchNumber: 'BAC-2633-G', initialQty: 80, expiryDays: 530,
  },

  // Vitamins, Minerals & Supplements
  {
    sku: 'MED-NEUROBION-TAB', productType: 'MEDICINE', genericName: 'Vitamin B1, B6 and B12 Complex', brandName: 'Neurobion Forte', strength: '100 mg / 200 mg / 200 mcg',
    dosageForm: 'Coated tablet', unit: 'tablet', categoryName: 'Vitamins, Minerals & Supplements', sellingPrice: 38.00, purchasePrice: 25.50,
    reorderLevel: 300, prescriptionRequired: false, active: true, activeIngredient: 'Thiamine Hydrochloride', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4027453005555', variantGroup: 'B-Complex',
    storageInstructions: 'Store below 25°C in a dry place.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '10582', pubchemCid: 6020, batchNumber: 'NEU-2634-H', initialQty: 2000, expiryDays: 680,
  },
  {
    sku: 'MED-CECON-500', productType: 'MEDICINE', genericName: 'Ascorbic Acid (Vitamin C)', brandName: 'C-Econ Chewable', strength: '500 mg',
    dosageForm: 'Chewable tablet', unit: 'tablet', categoryName: 'Vitamins, Minerals & Supplements', sellingPrice: 12.00, purchasePrice: 7.80,
    reorderLevel: 400, prescriptionRequired: false, active: true, activeIngredient: 'Ascorbic Acid', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '4010123454444', variantGroup: 'Vitamin C',
    storageInstructions: 'Store below 25°C. Protect from moisture.', minimumAgeYears: 4, maximumAgeYears: 120,
    rxNormCui: '1151', pubchemCid: 54670067, batchNumber: 'CEC-2635-I', initialQty: 2500, expiryDays: 730,
  },
  {
    sku: 'MED-CALTRATE-D', productType: 'MEDICINE', genericName: 'Calcium Carbonate with Vitamin D3', brandName: 'Caltrate 600 + D3', strength: '600 mg / 400 IU',
    dosageForm: 'Film-coated tablet', unit: 'tablet', categoryName: 'Vitamins, Minerals & Supplements', sellingPrice: 45.00, purchasePrice: 30.00,
    reorderLevel: 200, prescriptionRequired: false, active: true, activeIngredient: 'Calcium Carbonate', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '5012345678949', variantGroup: 'Calcium Vitamin D',
    storageInstructions: 'Store below 25°C.', minimumAgeYears: 12, maximumAgeYears: 120,
    rxNormCui: '1895', pubchemCid: 10112, batchNumber: 'CAL-2636-J', initialQty: 1200, expiryDays: 670,
  },

  // First Aid & Surgical Dressings (Retail Items)
  {
    sku: 'RET-DETTOL-500', productType: 'NON_MEDICINAL', genericName: 'Dettol Antiseptic Disinfectant Liquid 500 mL', brandName: 'Dettol', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'bottle', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 980.00, purchasePrice: 720.00,
    reorderLevel: 30, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Reckitt Benckiser Healthcare',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5000158061111', variantGroup: 'Antiseptic Liquid',
    storageInstructions: 'Store below 30°C. For external use only.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'DET-2637-K', initialQty: 80, expiryDays: 800,
  },
  {
    sku: 'RET-3M-MICROPORE-1', productType: 'NON_MEDICINAL', genericName: '3M Micropore Surgical Paper Tape 1 inch x 10 yards', brandName: '3M Micropore', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 350.00, purchasePrice: 230.00,
    reorderLevel: 50, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: '3M Healthcare Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '7073870001234', variantGroup: 'Medical Tapes',
    storageInstructions: 'Store at room temperature in a dry location.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: '3MM-2638-L', initialQty: 150, expiryDays: 900,
  },
  {
    sku: 'RET-BANDAID-WASH-20', productType: 'NON_MEDICINAL', genericName: 'Band-Aid Sterile Washproof Adhesive Bandages 20s', brandName: 'Band-Aid', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'box', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 420.00, purchasePrice: 285.00,
    reorderLevel: 40, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '8901012111222', variantGroup: 'Adhesive Plasters',
    storageInstructions: 'Store in a cool, dry place.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'BAN-2639-M', initialQty: 120, expiryDays: 850,
  },
  {
    sku: 'RET-BETADINE-100', productType: 'NON_MEDICINAL', genericName: 'Betadine Antiseptic Solution 10% 100 mL', brandName: 'Betadine', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'bottle', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 650.00, purchasePrice: 450.00,
    reorderLevel: 35, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Reckitt Benckiser Healthcare',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4012345001122', variantGroup: 'Povidone Iodine',
    storageInstructions: 'Store below 25°C. Protect from light.', minimumAgeYears: 2, maximumAgeYears: 120,
    batchNumber: 'BET-2640-N', initialQty: 90, expiryDays: 550,
  },
  {
    sku: 'RET-SYRINGE-5ML', productType: 'NON_MEDICINAL', genericName: 'Sterile Disposable Syringe with Needle 5 mL', brandName: 'B. Braun Injekt', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 35.00, purchasePrice: 19.00,
    reorderLevel: 200, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: '3M Healthcare Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '4022495001122', variantGroup: 'Syringes',
    storageInstructions: 'Keep sterile package sealed. Store in clean, dry conditions.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'SYR-2641-O', initialQty: 1000, expiryDays: 950,
  },
  {
    sku: 'RET-GLOVES-LATEX-M', productType: 'NON_MEDICINAL', genericName: 'Ansell Examination Gloves Powder-Free Medium Box of 100', brandName: 'Micro-Touch Ansell', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'box', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 1850.00, purchasePrice: 1320.00,
    reorderLevel: 20, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Ansell Healthcare',
    supplierName: 'Ansell Lanka (Pvt) Ltd', barcode: '9312345670011', variantGroup: 'Gloves',
    storageInstructions: 'Store in a cool dry place away from heat and direct sunlight.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'GLV-2642-P', initialQty: 60, expiryDays: 900,
  },
  {
    sku: 'RET-FACE-MASK-50', productType: 'NON_MEDICINAL', genericName: '3-Ply Surgical Disposable Face Mask with Ear Loops Box of 50', brandName: 'MediShield 3-Ply', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'box', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 650.00, purchasePrice: 420.00,
    reorderLevel: 30, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791234005566', variantGroup: 'Face Masks',
    storageInstructions: 'Keep dry and protected from contamination.', minimumAgeYears: 3, maximumAgeYears: 120,
    batchNumber: 'MSK-2643-Q', initialQty: 100, expiryDays: 920,
  },
  {
    sku: 'RET-COTTON-ROLL-100G', productType: 'NON_MEDICINAL', genericName: 'Absorbent Surgical Cotton Wool Roll 100 g', brandName: 'Hemas SurgiCare', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'pack', categoryName: 'First Aid & Surgical Dressings', sellingPrice: 280.00, purchasePrice: 180.00,
    reorderLevel: 50, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '4791000112233', variantGroup: 'Cotton Wool',
    storageInstructions: 'Store in clean dry conditions.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'COT-2644-R', initialQty: 160, expiryDays: 990,
  },

  // Diagnostic Devices & Monitors (Retail Items)
  {
    sku: 'RET-OMRON-M2', productType: 'NON_MEDICINAL', genericName: 'Omron M2 Basic Automatic Upper Arm Blood Pressure Monitor', brandName: 'Omron Healthcare', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 14500.00, purchasePrice: 10800.00,
    reorderLevel: 10, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Omron Healthcare Co., Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '4015672109876', variantGroup: 'Blood Pressure Monitors',
    storageInstructions: 'Store in protective pouch at room temperature. Avoid dropping.', minimumAgeYears: 12, maximumAgeYears: 120,
    batchNumber: 'OMR-2645-S', initialQty: 25, expiryDays: 1400,
  },
  {
    sku: 'RET-ACCUCHEK-ACT', productType: 'NON_MEDICINAL', genericName: 'Accu-Chek Active Blood Glucose Meter Kit', brandName: 'Accu-Chek Active', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 6800.00, purchasePrice: 4900.00,
    reorderLevel: 10, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Roche Diagnostics',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4015630012345', variantGroup: 'Blood Glucose Meters',
    storageInstructions: 'Store at -25°C to 70°C. Protect device from extreme humidity.', minimumAgeYears: 12, maximumAgeYears: 120,
    batchNumber: 'ACC-2646-T', initialQty: 30, expiryDays: 1200,
  },
  {
    sku: 'RET-ACCUCHEK-STRIP50', productType: 'NON_MEDICINAL', genericName: 'Accu-Chek Active Blood Glucose Test Strips 50s', brandName: 'Accu-Chek Active', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'box', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 4200.00, purchasePrice: 3100.00,
    reorderLevel: 25, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Roche Diagnostics',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4015630056789', variantGroup: 'Test Strips',
    storageInstructions: 'Store between 2°C and 30°C. Close vial cap tightly immediately after use.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'ACS-2647-U', initialQty: 80, expiryDays: 510,
  },
  {
    sku: 'RET-BEURER-THERM', productType: 'NON_MEDICINAL', genericName: 'Beurer FT 09 Digital Medical Clinical Thermometer', brandName: 'Beurer Germany', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'piece', categoryName: 'Diagnostic Devices & Monitors', sellingPrice: 1450.00, purchasePrice: 980.00,
    reorderLevel: 15, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Omron Healthcare Co., Ltd',
    supplierName: 'George Steuart Health (Pvt) Ltd', barcode: '4211125791100', variantGroup: 'Thermometers',
    storageInstructions: 'Keep clean in transparent plastic sleeve.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'BEU-2648-V', initialQty: 40, expiryDays: 1400,
  },

  // Clinical Nutrition & Infant Care (Retail Items)
  {
    sku: 'RET-ENSURE-GOLD-850', productType: 'NON_MEDICINAL', genericName: 'Ensure Gold Vanilla Complete Balanced Nutritional Drink 850 g', brandName: 'Ensure Gold', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'can', categoryName: 'Clinical Nutrition & Infant Care', sellingPrice: 7950.00, purchasePrice: 6200.00,
    reorderLevel: 15, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '8886451001234', variantGroup: 'Nutrition Drinks',
    storageInstructions: 'Store unopened can at room temperature. Once opened, cover and consume within 3 weeks.', minimumAgeYears: 18, maximumAgeYears: 120,
    batchNumber: 'ENS-2649-W', initialQty: 35, expiryDays: 580,
  },
  {
    sku: 'RET-GLUCERNA-850', productType: 'NON_MEDICINAL', genericName: 'Glucerna SR Diabetes Nutritional Formula Vanilla 850 g', brandName: 'Glucerna SR', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'can', categoryName: 'Clinical Nutrition & Infant Care', sellingPrice: 8400.00, purchasePrice: 6600.00,
    reorderLevel: 15, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Abbott Laboratories',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '8886451005678', variantGroup: 'Nutrition Drinks',
    storageInstructions: 'Store in a cool dry place. Use within 3 weeks of opening.', minimumAgeYears: 18, maximumAgeYears: 120,
    batchNumber: 'GLC-2650-X', initialQty: 30, expiryDays: 610,
  },
  {
    sku: 'RET-ORS-LEMON-10S', productType: 'NON_MEDICINAL', genericName: 'Oral Rehydration Salts (ORS) WHO Formula Lemon Flavour Pack of 10', brandName: 'Jeevani ORS', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'box', categoryName: 'Clinical Nutrition & Infant Care', sellingPrice: 450.00, purchasePrice: 300.00,
    reorderLevel: 40, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'State Pharmaceuticals Manufacturing Corporation (SPMC)',
    supplierName: 'State Pharmaceuticals Corporation (SPC)', barcode: '4791234007788', variantGroup: 'Oral Rehydration',
    storageInstructions: 'Store below 30°C in a dry place. Protect from moisture.', minimumAgeYears: 0, maximumAgeYears: 120,
    batchNumber: 'ORS-2651-Y', initialQty: 120, expiryDays: 700,
  },

  // Personal Hygiene & Sanitization (Retail Items)
  {
    sku: 'RET-LIFEBUOY-SAN-100', productType: 'NON_MEDICINAL', genericName: 'Lifebuoy Total 10 Antibacterial Hand Sanitizer 100 mL', brandName: 'Lifebuoy', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'bottle', categoryName: 'Personal Hygiene & Sanitization', sellingPrice: 380.00, purchasePrice: 260.00,
    reorderLevel: 40, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Unilever Sri Lanka Ltd',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '8901030001234', variantGroup: 'Sanitizers',
    storageInstructions: 'Store in cool conditions away from heat and open flame.', minimumAgeYears: 2, maximumAgeYears: 120,
    batchNumber: 'LIF-2652-Z', initialQty: 150, expiryDays: 750,
  },
  {
    sku: 'RET-KOTEX-MAXI-16', productType: 'NON_MEDICINAL', genericName: 'Kotex Soft & Smooth Maxi Wings Sanitary Napkins Pack of 16', brandName: 'Kotex', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'pack', categoryName: 'Personal Hygiene & Sanitization', sellingPrice: 560.00, purchasePrice: 390.00,
    reorderLevel: 30, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Johnson & Johnson',
    supplierName: 'Sunshine Healthcare Lanka Ltd', barcode: '9310088012345', variantGroup: 'Sanitary Napkins',
    storageInstructions: 'Store in clean, dry conditions.', minimumAgeYears: 10, maximumAgeYears: 120,
    batchNumber: 'KOT-2653-AA', initialQty: 90, expiryDays: 850,
  },
  {
    sku: 'RET-SENSODYNE-RAPID', productType: 'NON_MEDICINAL', genericName: 'Sensodyne Rapid Relief Sensitive Toothpaste 100 g', brandName: 'Sensodyne', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'tube', categoryName: 'Personal Hygiene & Sanitization', sellingPrice: 750.00, purchasePrice: 520.00,
    reorderLevel: 35, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'GlaxoSmithKline (GSK) Pharmaceuticals',
    supplierName: 'Hemas Pharmaceuticals (Pvt) Ltd', barcode: '5054563009999', variantGroup: 'Toothpaste',
    storageInstructions: 'Store below 30°C.', minimumAgeYears: 12, maximumAgeYears: 120,
    batchNumber: 'SEN-2654-AB', initialQty: 110, expiryDays: 680,
  },
  {
    sku: 'RET-PAMPERS-MIDI-48', productType: 'NON_MEDICINAL', genericName: 'Pampers Active Baby Diapers Size 3 Midi Pack of 48', brandName: 'Pampers', strength: 'N/A',
    dosageForm: 'Retail item', unit: 'pack', categoryName: 'Personal Hygiene & Sanitization', sellingPrice: 4800.00, purchasePrice: 3650.00,
    reorderLevel: 15, prescriptionRequired: false, active: true, activeIngredient: '', manufacturerName: 'Pfizer Laboratories Ltd',
    supplierName: 'A. Baur & Co. (Pvt) Ltd', barcode: '4015400012345', variantGroup: 'Baby Diapers',
    storageInstructions: 'Keep bag away from babies and children. Store in dry place.', minimumAgeYears: 0, maximumAgeYears: 3,
    batchNumber: 'PAM-2655-AC', initialQty: 40, expiryDays: 950,
  },
];

// Function to generate CSV and SQL files
export function generateDatasets() {
  // Helper to escape CSV cell according to RFC 4180
  function escapeCsv(value) {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // 1. Generate CSV
  const csvHeaders = [
    'sku', 'productType', 'genericName', 'strength', 'dosageForm', 'unit', 'categoryName',
    'sellingPrice', 'reorderLevel', 'prescriptionRequired', 'active', 'brandName', 'activeIngredient',
    'manufacturerName', 'barcode', 'variantGroup', 'storageInstructions', 'minimumAgeYears',
    'maximumAgeYears', 'rxNormCui', 'pubchemCid', 'smiles'
  ];

  const csvRows = [
    csvHeaders.join(','),
    ...realProducts.map((p) => [
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
      escapeCsv(''),
    ].join(','))
  ].join('\r\n');

  // Keep catalogue data separate from application sources.
  const csvRootPath = resolve(rootDir, 'data/catalogs/curated-catalog.csv');
  writeFileSync(csvRootPath, `\uFEFF${csvRows}`, 'utf8');


}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  generateDatasets();
}
