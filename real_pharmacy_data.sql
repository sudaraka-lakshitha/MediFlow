-- MediFlow Real Pharmacy Master Data & Initial Stock
-- Compatible with MySQL 8.0, XAMPP phpMyAdmin, and Aiven Cloud
-- Generated on 2026-10-27
START TRANSACTION;

-- 1. Real Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Hemas Pharmaceuticals (Pvt) Ltd', 'Sanjeewa Samaranayake', '+94 11 473 1731', 'inquiries@hemaspharmaceuticals.com', 'Hemas House, No. 75, Braybrooke Place, Colombo 02, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('A. Baur & Co. (Pvt) Ltd', 'Dr. Lakshman Weerasena', '+94 11 472 8700', 'healthcare@baurs.com', 'No. 62, Jethawana Road, Colombo 14, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Sunshine Healthcare Lanka Ltd', 'T. Sayandhan', '+94 11 470 2400', 'info@sunshinehealthcare.net', 'No. 60, Nawala Road, Narahenpita, Colombo 05, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('George Steuart Health (Pvt) Ltd', 'Erandajith Ranasinghe', '+94 11 268 2050', 'health@georgesteuart.lk', 'No. 19, Janadhipathi Mawatha, Colombo 01, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Emerchemie NB (Ceylon) Limited', 'Lalith Jayawardena', '+94 11 269 8812', 'pharma@emerchemie.lk', 'No. 46, Sri Deva Ratnadhara Mawatha, Colombo 10, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('State Pharmaceuticals Corporation (SPC)', 'Nihal Alwis', '+94 11 232 0356', 'gm@spc.lk', 'No. 75, Sir Baron Jayathilake Mawatha, Colombo 01, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Morison PLC', 'Dinesh Pathirana', '+94 11 244 4760', 'info@morison.lk', 'No. 620, Biyagama Road, Pethiyagoda, Kelaniya, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Ansell Lanka (Pvt) Ltd', 'Rohan Fernando', '+94 11 482 6800', 'supplychain.lanka@ansell.com', 'Ring Road Phase II, Export Processing Zone, Biyagama, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE contact_person = VALUES(contact_person), phone = VALUES(phone), email = VALUES(email), address = VALUES(address), active = 1;

-- 2. Real Manufacturers
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('GlaxoSmithKline (GSK) Pharmaceuticals', 'United Kingdom', '+44 20 8047 5000', 'customer.contact@gsk.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('State Pharmaceuticals Manufacturing Corporation (SPMC)', 'Sri Lanka', '+94 11 285 2405', 'spmc@sltnet.lk', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Pfizer Laboratories Ltd', 'United States', '+1 212 733 2323', 'medinfo@pfizer.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Abbott Laboratories', 'United States', '+1 847 937 6100', 'nutrition@abbott.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Cipla Ltd', 'India', '+91 22 2482 6000', 'contact@cipla.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Sun Pharmaceutical Industries Ltd', 'India', '+91 22 4324 4324', 'secretarial@sunpharma.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('AstraZeneca Pharmaceuticals', 'United Kingdom', '+44 20 3749 5000', 'medical.information@astrazeneca.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Roche Diagnostics', 'Switzerland', '+41 61 688 1111', 'diabetescare@roche.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Omron Healthcare Co., Ltd', 'Japan', '+81 75 925 2000', 'support@omronhealthcare.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Reckitt Benckiser Healthcare', 'United Kingdom', '+44 1753 217800', 'consumer.relations@reckitt.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('3M Healthcare Ltd', 'United States', '+1 888 364 3577', 'medical@mmm.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Ansell Healthcare', 'Australia', '+61 3 9270 7270', 'info@ansell.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Unilever Sri Lanka Ltd', 'Sri Lanka', '+94 11 269 4901', 'consumer.care@unilever.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Johnson & Johnson', 'United States', '+1 732 524 0400', 'consumerinfo@jnj.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;
INSERT INTO manufacturers (name, country, phone, email, active, created_at, updated_at) VALUES ('Bayer Consumer Care', 'Germany', '+49 214 301', 'contact@bayer.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE country = VALUES(country), phone = VALUES(phone), email = VALUES(email), active = 1;

-- 3. Categories
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Analgesics & Antipyretics', 'Pain relief, fever reduction, and anti-inflammatory medications', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Antibiotics & Antimicrobials', 'Bacterial, fungal, and broad-spectrum antimicrobial agents', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Cardiovascular & Antihypertensives', 'Blood pressure control, cholesterol, and cardiac care', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Endocrine & Diabetes Care', 'Oral hypoglycaemics, insulin management, and thyroid hormones', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Gastrointestinal & Digestive', 'Antacids, proton pump inhibitors, antiemetics, and laxatives', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Respiratory & Anti-Allergy', 'Inhalers, bronchodilators, antihistamines, and leukotriene blockers', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Dermatology & Topical Treatments', 'Steroid creams, antifungal ointments, and wound dressings', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Vitamins, Minerals & Supplements', 'Micronutrients, bone health calcium, and essential vitamin complexes', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('First Aid & Surgical Dressings', 'Antiseptics, sterile gauze, syringes, bandages, and medical tapes', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Diagnostic Devices & Monitors', 'Blood pressure monitors, glucometers, digital thermometers, and oximeters', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Personal Hygiene & Sanitization', 'Disinfectants, hand sanitizers, sanitary wear, and baby diapers', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Clinical Nutrition & Infant Care', 'Specialized dietary formulas, oral rehydration, and nutritional supplements', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE description = VALUES(description), active = 1;

-- 4. Products
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PANADOL-500',
  'MEDICINE',
  'Paracetamol',
  'Panadol',
  '500 mg',
  'Tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Paracetamol',
  'Paracetamol Oral',
  '5054563001234',
  '161',
  1983,
  'Store below 30°C in a dry place protected from direct sunlight.',
  6,
  120,
  4.50,
  500,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PANADOL-EXT',
  'MEDICINE',
  'Paracetamol and Caffeine',
  'Panadol Extra',
  '500 mg / 65 mg',
  'Tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Paracetamol',
  'Paracetamol Oral',
  '5054563004562',
  '161',
  1983,
  'Store below 30°C in a dry place.',
  12,
  120,
  7.50,
  300,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PANADOL-SYR',
  'MEDICINE',
  'Paracetamol Paediatric Suspension',
  'Panadol Baby & Infant',
  '120 mg/5 mL',
  'Oral suspension',
  'bottle',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Paracetamol',
  'Paracetamol Oral',
  '5054563007891',
  '161',
  1983,
  'Store below 25°C. Do not freeze. Shake well before use.',
  0,
  12,
  380.00,
  50,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-BRUFEN-400',
  'MEDICINE',
  'Ibuprofen',
  'Brufen',
  '400 mg',
  'Tablet',
  'tablet',
  'Abbott Laboratories',
  'Ibuprofen',
  'Ibuprofen Oral',
  '4010123456789',
  '5640',
  3672,
  'Store below 25°C in a dry place. Take with food or milk.',
  12,
  120,
  14.50,
  300,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Abbott Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-VOLTAREN-50',
  'MEDICINE',
  'Diclofenac Sodium',
  'Voltaren',
  '50 mg',
  'Enteric-coated tablet',
  'tablet',
  'Novartis Pharma AG',
  'Diclofenac',
  'Diclofenac Oral',
  '7680312345012',
  '3355',
  3033,
  'Protect from heat and moisture. Store below 30°C.',
  14,
  120,
  28.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Novartis Pharma AG' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PONSTAN-500',
  'MEDICINE',
  'Mefenamic Acid',
  'Ponstan Forte',
  '500 mg',
  'Tablet',
  'tablet',
  'Pfizer Laboratories Ltd',
  'Mefenamic Acid',
  'Mefenamic Acid',
  '5012345678901',
  '6754',
  4044,
  'Store below 30°C in a dry place.',
  12,
  120,
  32.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-AUGMENTIN-625',
  'MEDICINE',
  'Amoxicillin and Clavulanate Potassium',
  'Augmentin',
  '625 mg',
  'Film-coated tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Amoxicillin',
  'Co-Amoxiclav Oral',
  '5054563009012',
  '18631',
  33613,
  'Store in original desiccated foil pack below 25°C.',
  12,
  120,
  165.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-AMOXIL-500',
  'MEDICINE',
  'Amoxicillin Trihydrate',
  'Amoxil SPMC',
  '500 mg',
  'Capsule',
  'capsule',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Amoxicillin',
  'Amoxicillin Oral',
  '4791234567011',
  '723',
  33613,
  'Store below 25°C in a dry place.',
  10,
  120,
  22.50,
  400,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ZITHROMAX-500',
  'MEDICINE',
  'Azithromycin Dihydrate',
  'Zithromax',
  '500 mg',
  'Tablet',
  'tablet',
  'Pfizer Laboratories Ltd',
  'Azithromycin',
  'Azithromycin Oral',
  '5012345678918',
  '18631',
  447043,
  'Store below 30°C.',
  12,
  120,
  210.00,
  100,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ZINNAT-500',
  'MEDICINE',
  'Cefuroxime Axetil',
  'Zinnat',
  '500 mg',
  'Tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Cefuroxime',
  'Cefuroxime Oral',
  '5054563009456',
  '2193',
  5479529,
  'Store below 30°C in a dry place.',
  12,
  120,
  285.00,
  100,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CIFRAN-500',
  'MEDICINE',
  'Ciprofloxacin Hydrochloride',
  'Cifran',
  '500 mg',
  'Tablet',
  'tablet',
  'Sun Pharmaceutical Industries Ltd',
  'Ciprofloxacin',
  'Ciprofloxacin Oral',
  '8901112223334',
  '2551',
  2764,
  'Store protected from light and moisture at a temperature not exceeding 25°C.',
  18,
  120,
  35.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharmaceutical Industries Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-FLAGYL-400',
  'MEDICINE',
  'Metronidazole',
  'Flagyl',
  '400 mg',
  'Tablet',
  'tablet',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Metronidazole',
  'Metronidazole Oral',
  '3582910001234',
  '6922',
  4173,
  'Store below 25°C protected from light.',
  8,
  120,
  12.00,
  250,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-NORVASC-5',
  'MEDICINE',
  'Amlodipine Besylate',
  'Norvasc',
  '5 mg',
  'Tablet',
  'tablet',
  'Pfizer Laboratories Ltd',
  'Amlodipine',
  'Amlodipine Oral',
  '5012345678925',
  '17767',
  2162,
  'Store below 30°C in a dry place.',
  18,
  120,
  48.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-COZAAR-50',
  'MEDICINE',
  'Losartan Potassium',
  'Cozaar',
  '50 mg',
  'Tablet',
  'tablet',
  'Cipla Ltd',
  'Losartan',
  'Losartan Oral',
  '8901234567890',
  '52175',
  3961,
  'Store below 30°C. Protect from light.',
  18,
  120,
  62.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-LIPITOR-20',
  'MEDICINE',
  'Atorvastatin Calcium',
  'Lipitor',
  '20 mg',
  'Film-coated tablet',
  'tablet',
  'Pfizer Laboratories Ltd',
  'Atorvastatin',
  'Atorvastatin Oral',
  '5012345678932',
  '83367',
  60823,
  'Store at controlled room temperature 20°C to 25°C.',
  18,
  120,
  95.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PLAVIX-75',
  'MEDICINE',
  'Clopidogrel Bisulfate',
  'Plavix',
  '75 mg',
  'Film-coated tablet',
  'tablet',
  'Sanofi-Aventis',
  'Clopidogrel',
  'Clopidogrel Oral',
  '3582910005678',
  '32968',
  60606,
  'Store below 25°C.',
  18,
  120,
  110.00,
  100,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sanofi-Aventis' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CARDIPRIN-100',
  'MEDICINE',
  'Aspirin Low Dose',
  'Cardiprin',
  '100 mg',
  'Dispersible tablet',
  'tablet',
  'Reckitt Benckiser Healthcare',
  'Aspirin',
  'Aspirin Oral',
  '5000158068945',
  '1191',
  2244,
  'Store below 25°C in a dry place.',
  18,
  120,
  8.50,
  300,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Reckitt Benckiser Healthcare' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-GLUCOPHAGE-500',
  'MEDICINE',
  'Metformin Hydrochloride',
  'Glucophage',
  '500 mg',
  'Film-coated tablet',
  'tablet',
  'Merck Healthcare KGaA',
  'Metformin',
  'Metformin Oral',
  '4027453001234',
  '6809',
  4091,
  'Store below 25°C in a dry place.',
  10,
  120,
  18.00,
  400,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Endocrine & Diabetes Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Merck Healthcare KGaA' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-DIAMICRON-60MR',
  'MEDICINE',
  'Gliclazide Modified Release',
  'Diamicron MR',
  '60 mg',
  'Modified-release tablet',
  'tablet',
  'Servier Laboratories',
  'Gliclazide',
  'Gliclazide Oral',
  '3400936854123',
  '4815',
  3476,
  'Store below 30°C.',
  18,
  120,
  42.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Endocrine & Diabetes Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Servier Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-JANUVIA-100',
  'MEDICINE',
  'Sitagliptin Phosphate',
  'Januvia',
  '100 mg',
  'Film-coated tablet',
  'tablet',
  'Organon / MSD',
  'Sitagliptin',
  'Sitagliptin Oral',
  '8901234567999',
  '593411',
  4369359,
  'Store between 20°C and 25°C.',
  18,
  120,
  240.00,
  80,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Endocrine & Diabetes Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Organon / MSD' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ELTROXIN-50',
  'MEDICINE',
  'Levothyroxine Sodium',
  'Eltroxin',
  '50 mcg',
  'Tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Levothyroxine',
  'Levothyroxine Oral',
  '5054563006789',
  '10582',
  5819,
  'Store below 25°C protected from light and moisture.',
  0,
  120,
  9.50,
  300,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Endocrine & Diabetes Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-NEXIUM-20',
  'MEDICINE',
  'Esomeprazole Magnesium',
  'Nexium',
  '20 mg',
  'Gastro-resistant tablet',
  'tablet',
  'AstraZeneca Pharmaceuticals',
  'Esomeprazole',
  'Esomeprazole Oral',
  '7312345678901',
  '283742',
  9568614,
  'Store below 30°C in original package to protect from moisture.',
  12,
  120,
  85.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'AstraZeneca Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-LOSEC-20',
  'MEDICINE',
  'Omeprazole',
  'Losec SPMC',
  '20 mg',
  'Capsule',
  'capsule',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Omeprazole',
  'Omeprazole Oral',
  '4791112223335',
  '7646',
  4594,
  'Store below 25°C. Keep bottle tightly closed.',
  12,
  120,
  25.00,
  300,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-MOTILIUM-10',
  'MEDICINE',
  'Domperidone',
  'Motilium',
  '10 mg',
  'Film-coated tablet',
  'tablet',
  'Johnson & Johnson',
  'Domperidone',
  'Domperidone Oral',
  '5410123456789',
  '3583',
  3153,
  'Store below 30°C.',
  12,
  120,
  16.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Johnson & Johnson' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-GAVISCON-LIQ',
  'MEDICINE',
  'Sodium Alginate and Bicarbonate',
  'Gaviscon Double Action Liquid',
  '200 mL',
  'Oral suspension',
  'bottle',
  'Reckitt Benckiser Healthcare',
  'Sodium Alginate',
  'Antacid Liquid',
  '5000158069003',
  '2053',
  5102882,
  'Do not store above 30°C. Do not refrigerate or freeze.',
  6,
  120,
  1450.00,
  30,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Reckitt Benckiser Healthcare' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-DUPHALAC-SYR',
  'MEDICINE',
  'Lactulose Solution',
  'Duphalac',
  '3.33 g/5 mL (200 mL)',
  'Oral solution',
  'bottle',
  'Abbott Laboratories',
  'Lactulose',
  'Lactulose Solution',
  '4010123459995',
  '6241',
  11333,
  'Store below 25°C. Do not freeze.',
  0,
  120,
  1150.00,
  25,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Abbott Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-VENTOLIN-100',
  'MEDICINE',
  'Salbutamol Inhaler CFC-Free',
  'Ventolin Evohaler',
  '100 mcg/dose (200 doses)',
  'Inhaler',
  'puff',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Salbutamol',
  'Salbutamol Inhaler',
  '5054563008888',
  '435',
  2088,
  'Store below 30°C. Protect from frost and direct sunlight.',
  4,
  120,
  1250.00,
  40,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-SERETIDE-250',
  'MEDICINE',
  'Salmeterol and Fluticasone Propionate',
  'Seretide Evohaler 250',
  '25 mcg / 250 mcg (120 doses)',
  'Inhaler',
  'puff',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Fluticasone Propionate',
  'Combination Inhaler',
  '5054563007777',
  '284635',
  5311101,
  'Store below 30°C. Protect from frost and direct heat.',
  12,
  120,
  4850.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ZYRTEC-10',
  'MEDICINE',
  'Cetirizine Dihydrochloride',
  'Zyrtec',
  '10 mg',
  'Film-coated tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Cetirizine',
  'Cetirizine Oral',
  '5413787012345',
  '20610',
  2678,
  'Store below 25°C in a dry place.',
  6,
  120,
  35.00,
  300,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-SINGULAIR-10',
  'MEDICINE',
  'Montelukast Sodium',
  'Singulair',
  '10 mg',
  'Film-coated tablet',
  'tablet',
  'Organon / MSD',
  'Montelukast',
  'Montelukast Oral',
  '8901234568880',
  '76895',
  5281040,
  'Store in original package at 15°C to 30°C. Protect from moisture and light.',
  15,
  120,
  135.00,
  100,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Organon / MSD' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-BETNOVATE-N',
  'MEDICINE',
  'Betamethasone Valerate and Neomycin Sulfate',
  'Betnovate-N Cream',
  '0.1% / 0.5% (15 g)',
  'Cream',
  'tube',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Betamethasone',
  'Betamethasone Topical',
  '5054563005555',
  '1399',
  9782,
  'Store below 25°C. Do not freeze.',
  2,
  120,
  540.00,
  50,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Dermatology & Topical Treatments' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CANESTEN-1CR',
  'MEDICINE',
  'Clotrimazole Anti-Fungal Cream',
  'Canesten Cream 1%',
  '1% w/w (20 g)',
  'Cream',
  'tube',
  'Bayer Consumer Care',
  'Clotrimazole',
  'Clotrimazole Topical',
  '4008500123456',
  '2598',
  2812,
  'Store below 25°C.',
  2,
  120,
  680.00,
  40,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Dermatology & Topical Treatments' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Bayer Consumer Care' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-BACTROBAN-OIN',
  'MEDICINE',
  'Mupirocin Antibiotic Ointment',
  'Bactroban 2% Ointment',
  '2% (15 g)',
  'Ointment',
  'tube',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Mupirocin',
  'Mupirocin Topical',
  '5054563004444',
  '7154',
  446596,
  'Store below 25°C.',
  1,
  120,
  1120.00,
  30,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Dermatology & Topical Treatments' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-NEUROBION-TAB',
  'MEDICINE',
  'Vitamin B1, B6 and B12 Complex',
  'Neurobion Forte',
  '100 mg / 200 mg / 200 mcg',
  'Coated tablet',
  'tablet',
  'Pfizer Laboratories Ltd',
  'Thiamine Hydrochloride',
  'B-Complex',
  '4027453005555',
  '10582',
  6020,
  'Store below 25°C in a dry place.',
  12,
  120,
  38.00,
  300,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Vitamins, Minerals & Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CECON-500',
  'MEDICINE',
  'Ascorbic Acid (Vitamin C)',
  'C-Econ Chewable',
  '500 mg',
  'Chewable tablet',
  'tablet',
  'Abbott Laboratories',
  'Ascorbic Acid',
  'Vitamin C',
  '4010123454444',
  '1151',
  54670067,
  'Store below 25°C. Protect from moisture.',
  4,
  120,
  12.00,
  400,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Vitamins, Minerals & Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Abbott Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CALTRATE-D',
  'MEDICINE',
  'Calcium Carbonate with Vitamin D3',
  'Caltrate 600 + D3',
  '600 mg / 400 IU',
  'Film-coated tablet',
  'tablet',
  'Pfizer Laboratories Ltd',
  'Calcium Carbonate',
  'Calcium Vitamin D',
  '5012345678949',
  '1895',
  10112,
  'Store below 25°C.',
  12,
  120,
  45.00,
  200,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Vitamins, Minerals & Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-DETTOL-500',
  'NON_MEDICINAL',
  'Dettol Antiseptic Disinfectant Liquid 500 mL',
  'Dettol',
  'N/A',
  'Retail item',
  'bottle',
  'Reckitt Benckiser Healthcare',
  NULL,
  'Antiseptic Liquid',
  '5000158061111',
  NULL,
  NULL,
  'Store below 30°C. For external use only.',
  0,
  120,
  980.00,
  30,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Reckitt Benckiser Healthcare' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-3M-MICROPORE-1',
  'NON_MEDICINAL',
  '3M Micropore Surgical Paper Tape 1 inch x 10 yards',
  '3M Micropore',
  'N/A',
  'Retail item',
  'piece',
  '3M Healthcare Ltd',
  NULL,
  'Medical Tapes',
  '7073870001234',
  NULL,
  NULL,
  'Store at room temperature in a dry location.',
  0,
  120,
  350.00,
  50,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = '3M Healthcare Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-BANDAID-WASH-20',
  'NON_MEDICINAL',
  'Band-Aid Sterile Washproof Adhesive Bandages 20s',
  'Band-Aid',
  'N/A',
  'Retail item',
  'box',
  'Johnson & Johnson',
  NULL,
  'Adhesive Plasters',
  '8901012111222',
  NULL,
  NULL,
  'Store in a cool, dry place.',
  0,
  120,
  420.00,
  40,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Johnson & Johnson' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-BETADINE-100',
  'NON_MEDICINAL',
  'Betadine Antiseptic Solution 10% 100 mL',
  'Betadine',
  'N/A',
  'Retail item',
  'bottle',
  'Reckitt Benckiser Healthcare',
  NULL,
  'Povidone Iodine',
  '4012345001122',
  NULL,
  NULL,
  'Store below 25°C. Protect from light.',
  2,
  120,
  650.00,
  35,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Reckitt Benckiser Healthcare' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-SYRINGE-5ML',
  'NON_MEDICINAL',
  'Sterile Disposable Syringe with Needle 5 mL',
  'B. Braun Injekt',
  'N/A',
  'Retail item',
  'piece',
  '3M Healthcare Ltd',
  NULL,
  'Syringes',
  '4022495001122',
  NULL,
  NULL,
  'Keep sterile package sealed. Store in clean, dry conditions.',
  0,
  120,
  35.00,
  200,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = '3M Healthcare Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-GLOVES-LATEX-M',
  'NON_MEDICINAL',
  'Ansell Examination Gloves Powder-Free Medium Box of 100',
  'Micro-Touch Ansell',
  'N/A',
  'Retail item',
  'box',
  'Ansell Healthcare',
  NULL,
  'Gloves',
  '9312345670011',
  NULL,
  NULL,
  'Store in a cool dry place away from heat and direct sunlight.',
  0,
  120,
  1850.00,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ansell Healthcare' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-FACE-MASK-50',
  'NON_MEDICINAL',
  '3-Ply Surgical Disposable Face Mask with Ear Loops Box of 50',
  'MediShield 3-Ply',
  'N/A',
  'Retail item',
  'box',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  NULL,
  'Face Masks',
  '4791234005566',
  NULL,
  NULL,
  'Keep dry and protected from contamination.',
  3,
  120,
  650.00,
  30,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-COTTON-ROLL-100G',
  'NON_MEDICINAL',
  'Absorbent Surgical Cotton Wool Roll 100 g',
  'Hemas SurgiCare',
  'N/A',
  'Retail item',
  'pack',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  NULL,
  'Cotton Wool',
  '4791000112233',
  NULL,
  NULL,
  'Store in clean dry conditions.',
  0,
  120,
  280.00,
  50,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'First Aid & Surgical Dressings' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-OMRON-M2',
  'NON_MEDICINAL',
  'Omron M2 Basic Automatic Upper Arm Blood Pressure Monitor',
  'Omron Healthcare',
  'N/A',
  'Retail item',
  'piece',
  'Omron Healthcare Co., Ltd',
  NULL,
  'Blood Pressure Monitors',
  '4015672109876',
  NULL,
  NULL,
  'Store in protective pouch at room temperature. Avoid dropping.',
  12,
  120,
  14500.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Diagnostic Devices & Monitors' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Omron Healthcare Co., Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-ACCUCHEK-ACT',
  'NON_MEDICINAL',
  'Accu-Chek Active Blood Glucose Meter Kit',
  'Accu-Chek Active',
  'N/A',
  'Retail item',
  'piece',
  'Roche Diagnostics',
  NULL,
  'Blood Glucose Meters',
  '4015630012345',
  NULL,
  NULL,
  'Store at -25°C to 70°C. Protect device from extreme humidity.',
  12,
  120,
  6800.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Diagnostic Devices & Monitors' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Roche Diagnostics' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-ACCUCHEK-STRIP50',
  'NON_MEDICINAL',
  'Accu-Chek Active Blood Glucose Test Strips 50s',
  'Accu-Chek Active',
  'N/A',
  'Retail item',
  'box',
  'Roche Diagnostics',
  NULL,
  'Test Strips',
  '4015630056789',
  NULL,
  NULL,
  'Store between 2°C and 30°C. Close vial cap tightly immediately after use.',
  0,
  120,
  4200.00,
  25,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Diagnostic Devices & Monitors' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Roche Diagnostics' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-BEURER-THERM',
  'NON_MEDICINAL',
  'Beurer FT 09 Digital Medical Clinical Thermometer',
  'Beurer Germany',
  'N/A',
  'Retail item',
  'piece',
  'Omron Healthcare Co., Ltd',
  NULL,
  'Thermometers',
  '4211125791100',
  NULL,
  NULL,
  'Keep clean in transparent plastic sleeve.',
  0,
  120,
  1450.00,
  15,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Diagnostic Devices & Monitors' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Omron Healthcare Co., Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-ENSURE-GOLD-850',
  'NON_MEDICINAL',
  'Ensure Gold Vanilla Complete Balanced Nutritional Drink 850 g',
  'Ensure Gold',
  'N/A',
  'Retail item',
  'can',
  'Abbott Laboratories',
  NULL,
  'Nutrition Drinks',
  '8886451001234',
  NULL,
  NULL,
  'Store unopened can at room temperature. Once opened, cover and consume within 3 weeks.',
  18,
  120,
  7950.00,
  15,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Clinical Nutrition & Infant Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Abbott Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-GLUCERNA-850',
  'NON_MEDICINAL',
  'Glucerna SR Diabetes Nutritional Formula Vanilla 850 g',
  'Glucerna SR',
  'N/A',
  'Retail item',
  'can',
  'Abbott Laboratories',
  NULL,
  'Nutrition Drinks',
  '8886451005678',
  NULL,
  NULL,
  'Store in a cool dry place. Use within 3 weeks of opening.',
  18,
  120,
  8400.00,
  15,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Clinical Nutrition & Infant Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Abbott Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-ORS-LEMON-10S',
  'NON_MEDICINAL',
  'Oral Rehydration Salts (ORS) WHO Formula Lemon Flavour Pack of 10',
  'Jeevani ORS',
  'N/A',
  'Retail item',
  'box',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  NULL,
  'Oral Rehydration',
  '4791234007788',
  NULL,
  NULL,
  'Store below 30°C in a dry place. Protect from moisture.',
  0,
  120,
  450.00,
  40,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Clinical Nutrition & Infant Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-LIFEBUOY-SAN-100',
  'NON_MEDICINAL',
  'Lifebuoy Total 10 Antibacterial Hand Sanitizer 100 mL',
  'Lifebuoy',
  'N/A',
  'Retail item',
  'bottle',
  'Unilever Sri Lanka Ltd',
  NULL,
  'Sanitizers',
  '8901030001234',
  NULL,
  NULL,
  'Store in cool conditions away from heat and open flame.',
  2,
  120,
  380.00,
  40,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Hygiene & Sanitization' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unilever Sri Lanka Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-KOTEX-MAXI-16',
  'NON_MEDICINAL',
  'Kotex Soft & Smooth Maxi Wings Sanitary Napkins Pack of 16',
  'Kotex',
  'N/A',
  'Retail item',
  'pack',
  'Johnson & Johnson',
  NULL,
  'Sanitary Napkins',
  '9310088012345',
  NULL,
  NULL,
  'Store in clean, dry conditions.',
  10,
  120,
  560.00,
  30,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Hygiene & Sanitization' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Johnson & Johnson' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-SENSODYNE-RAPID',
  'NON_MEDICINAL',
  'Sensodyne Rapid Relief Sensitive Toothpaste 100 g',
  'Sensodyne',
  'N/A',
  'Retail item',
  'tube',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  NULL,
  'Toothpaste',
  '5054563009999',
  NULL,
  NULL,
  'Store below 30°C.',
  12,
  120,
  750.00,
  35,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Hygiene & Sanitization' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-PAMPERS-MIDI-48',
  'NON_MEDICINAL',
  'Pampers Active Baby Diapers Size 3 Midi Pack of 48',
  'Pampers',
  'N/A',
  'Retail item',
  'pack',
  'Pfizer Laboratories Ltd',
  NULL,
  'Baby Diapers',
  '4015400012345',
  NULL,
  NULL,
  'Keep bag away from babies and children. Store in dry place.',
  0,
  3,
  4800.00,
  15,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Hygiene & Sanitization' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pfizer Laboratories Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  barcode = VALUES(barcode),
  active = 1;

-- 5. Inventory Batches & Stock Movements

-- Batch & Stock for MED-PANADOL-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'PAN-2601-A',
  5000,
  5000,
  0,
  2.80,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-PANADOL-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PANADOL-500' AND b.batch_number = 'PAN-2601-A'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PANADOL-EXT
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'PEX-2602-B',
  2400,
  2400,
  0,
  4.80,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-PANADOL-EXT'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PANADOL-EXT' AND b.batch_number = 'PEX-2602-B'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PANADOL-SYR
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'PSY-2603-C',
  180,
  180,
  0,
  260.00,
  DATE_ADD(CURDATE(), INTERVAL 540 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-PANADOL-SYR'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PANADOL-SYR' AND b.batch_number = 'PSY-2603-C'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-BRUFEN-400
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'BRU-2604-D',
  1500,
  1500,
  0,
  9.20,
  DATE_ADD(CURDATE(), INTERVAL 600 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-BRUFEN-400'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-BRUFEN-400' AND b.batch_number = 'BRU-2604-D'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-VOLTAREN-50
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'VOL-2605-E',
  800,
  800,
  0,
  18.50,
  DATE_ADD(CURDATE(), INTERVAL 520 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-VOLTAREN-50'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-VOLTAREN-50' AND b.batch_number = 'VOL-2605-E'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PONSTAN-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'PON-2606-F',
  600,
  600,
  0,
  21.00,
  DATE_ADD(CURDATE(), INTERVAL 640 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-PONSTAN-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PONSTAN-500' AND b.batch_number = 'PON-2606-F'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-AUGMENTIN-625
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'AUG-2607-G',
  1200,
  1200,
  0,
  115.00,
  DATE_ADD(CURDATE(), INTERVAL 480 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-AUGMENTIN-625'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-AUGMENTIN-625' AND b.batch_number = 'AUG-2607-G'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-AMOXIL-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'AMX-2608-H',
  2500,
  2500,
  0,
  14.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'State Pharmaceuticals Corporation (SPC)'
WHERE p.sku = 'MED-AMOXIL-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-AMOXIL-500' AND b.batch_number = 'AMX-2608-H'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ZITHROMAX-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ZIT-2609-I',
  400,
  400,
  0,
  145.00,
  DATE_ADD(CURDATE(), INTERVAL 610 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-ZITHROMAX-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ZITHROMAX-500' AND b.batch_number = 'ZIT-2609-I'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ZINNAT-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ZIN-2610-J',
  350,
  350,
  0,
  198.00,
  DATE_ADD(CURDATE(), INTERVAL 490 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-ZINNAT-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ZINNAT-500' AND b.batch_number = 'ZIN-2610-J'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CIFRAN-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'CIF-2611-K',
  600,
  600,
  0,
  22.50,
  DATE_ADD(CURDATE(), INTERVAL 560 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Emerchemie NB (Ceylon) Limited'
WHERE p.sku = 'MED-CIFRAN-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CIFRAN-500' AND b.batch_number = 'CIF-2611-K'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-FLAGYL-400
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'FLA-2612-L',
  1200,
  1200,
  0,
  7.50,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'State Pharmaceuticals Corporation (SPC)'
WHERE p.sku = 'MED-FLAGYL-400'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-FLAGYL-400' AND b.batch_number = 'FLA-2612-L'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-NORVASC-5
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'NOR-2613-M',
  1000,
  1000,
  0,
  32.00,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-NORVASC-5'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-NORVASC-5' AND b.batch_number = 'NOR-2613-M'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-COZAAR-50
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'COZ-2614-N',
  900,
  900,
  0,
  41.00,
  DATE_ADD(CURDATE(), INTERVAL 650 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'George Steuart Health (Pvt) Ltd'
WHERE p.sku = 'MED-COZAAR-50'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-COZAAR-50' AND b.batch_number = 'COZ-2614-N'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-LIPITOR-20
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'LIP-2615-O',
  750,
  750,
  0,
  64.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-LIPITOR-20'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-LIPITOR-20' AND b.batch_number = 'LIP-2615-O'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PLAVIX-75
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'PLA-2616-P',
  500,
  500,
  0,
  75.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-PLAVIX-75'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PLAVIX-75' AND b.batch_number = 'PLA-2616-P'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CARDIPRIN-100
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'CAR-2617-Q',
  1800,
  1800,
  0,
  5.20,
  DATE_ADD(CURDATE(), INTERVAL 690 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-CARDIPRIN-100'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CARDIPRIN-100' AND b.batch_number = 'CAR-2617-Q'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-GLUCOPHAGE-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'GLU-2618-R',
  3000,
  3000,
  0,
  11.50,
  DATE_ADD(CURDATE(), INTERVAL 710 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-GLUCOPHAGE-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-GLUCOPHAGE-500' AND b.batch_number = 'GLU-2618-R'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-DIAMICRON-60MR
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'DIA-2619-S',
  1200,
  1200,
  0,
  28.00,
  DATE_ADD(CURDATE(), INTERVAL 530 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-DIAMICRON-60MR'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-DIAMICRON-60MR' AND b.batch_number = 'DIA-2619-S'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-JANUVIA-100
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'JAN-2620-T',
  300,
  300,
  0,
  170.00,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-JANUVIA-100'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-JANUVIA-100' AND b.batch_number = 'JAN-2620-T'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ELTROXIN-50
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ELT-2621-U',
  1500,
  1500,
  0,
  6.00,
  DATE_ADD(CURDATE(), INTERVAL 500 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-ELTROXIN-50'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ELTROXIN-50' AND b.batch_number = 'ELT-2621-U'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-NEXIUM-20
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'NEX-2622-V',
  900,
  900,
  0,
  56.00,
  DATE_ADD(CURDATE(), INTERVAL 660 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-NEXIUM-20'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-NEXIUM-20' AND b.batch_number = 'NEX-2622-V'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-LOSEC-20
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'LOS-2623-W',
  2000,
  2000,
  0,
  15.00,
  DATE_ADD(CURDATE(), INTERVAL 550 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'State Pharmaceuticals Corporation (SPC)'
WHERE p.sku = 'MED-LOSEC-20'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-LOSEC-20' AND b.batch_number = 'LOS-2623-W'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-MOTILIUM-10
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'MOT-2624-X',
  1200,
  1200,
  0,
  10.20,
  DATE_ADD(CURDATE(), INTERVAL 610 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-MOTILIUM-10'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-MOTILIUM-10' AND b.batch_number = 'MOT-2624-X'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-GAVISCON-LIQ
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'GAV-2625-Y',
  80,
  80,
  0,
  1020.00,
  DATE_ADD(CURDATE(), INTERVAL 480 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-GAVISCON-LIQ'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-GAVISCON-LIQ' AND b.batch_number = 'GAV-2625-Y'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-DUPHALAC-SYR
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'DUP-2626-Z',
  60,
  60,
  0,
  810.00,
  DATE_ADD(CURDATE(), INTERVAL 570 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-DUPHALAC-SYR'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-DUPHALAC-SYR' AND b.batch_number = 'DUP-2626-Z'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-VENTOLIN-100
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'VEN-2627-A',
  120,
  120,
  0,
  880.00,
  DATE_ADD(CURDATE(), INTERVAL 590 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-VENTOLIN-100'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-VENTOLIN-100' AND b.batch_number = 'VEN-2627-A'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-SERETIDE-250
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'SER-2628-B',
  40,
  40,
  0,
  3500.00,
  DATE_ADD(CURDATE(), INTERVAL 450 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-SERETIDE-250'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-SERETIDE-250' AND b.batch_number = 'SER-2628-B'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ZYRTEC-10
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ZYR-2629-C',
  1500,
  1500,
  0,
  23.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-ZYRTEC-10'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ZYRTEC-10' AND b.batch_number = 'ZYR-2629-C'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-SINGULAIR-10
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'SIN-2630-D',
  500,
  500,
  0,
  92.00,
  DATE_ADD(CURDATE(), INTERVAL 630 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-SINGULAIR-10'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-SINGULAIR-10' AND b.batch_number = 'SIN-2630-D'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-BETNOVATE-N
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'BET-2631-E',
  150,
  150,
  0,
  375.00,
  DATE_ADD(CURDATE(), INTERVAL 520 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-BETNOVATE-N'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-BETNOVATE-N' AND b.batch_number = 'BET-2631-E'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CANESTEN-1CR
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'CAN-2632-F',
  120,
  120,
  0,
  470.00,
  DATE_ADD(CURDATE(), INTERVAL 640 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-CANESTEN-1CR'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CANESTEN-1CR' AND b.batch_number = 'CAN-2632-F'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-BACTROBAN-OIN
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'BAC-2633-G',
  80,
  80,
  0,
  790.00,
  DATE_ADD(CURDATE(), INTERVAL 530 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-BACTROBAN-OIN'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-BACTROBAN-OIN' AND b.batch_number = 'BAC-2633-G'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-NEUROBION-TAB
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'NEU-2634-H',
  2000,
  2000,
  0,
  25.50,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'MED-NEUROBION-TAB'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-NEUROBION-TAB' AND b.batch_number = 'NEU-2634-H'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CECON-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'CEC-2635-I',
  2500,
  2500,
  0,
  7.80,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'MED-CECON-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CECON-500' AND b.batch_number = 'CEC-2635-I'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CALTRATE-D
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'CAL-2636-J',
  1200,
  1200,
  0,
  30.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'MED-CALTRATE-D'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CALTRATE-D' AND b.batch_number = 'CAL-2636-J'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-DETTOL-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'DET-2637-K',
  80,
  80,
  0,
  720.00,
  DATE_ADD(CURDATE(), INTERVAL 800 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'RET-DETTOL-500'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-DETTOL-500' AND b.batch_number = 'DET-2637-K'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-3M-MICROPORE-1
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  '3MM-2638-L',
  150,
  150,
  0,
  230.00,
  DATE_ADD(CURDATE(), INTERVAL 900 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'George Steuart Health (Pvt) Ltd'
WHERE p.sku = 'RET-3M-MICROPORE-1'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-3M-MICROPORE-1' AND b.batch_number = '3MM-2638-L'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-BANDAID-WASH-20
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'BAN-2639-M',
  120,
  120,
  0,
  285.00,
  DATE_ADD(CURDATE(), INTERVAL 850 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'RET-BANDAID-WASH-20'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-BANDAID-WASH-20' AND b.batch_number = 'BAN-2639-M'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-BETADINE-100
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'BET-2640-N',
  90,
  90,
  0,
  450.00,
  DATE_ADD(CURDATE(), INTERVAL 550 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'RET-BETADINE-100'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-BETADINE-100' AND b.batch_number = 'BET-2640-N'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-SYRINGE-5ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'SYR-2641-O',
  1000,
  1000,
  0,
  19.00,
  DATE_ADD(CURDATE(), INTERVAL 950 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'George Steuart Health (Pvt) Ltd'
WHERE p.sku = 'RET-SYRINGE-5ML'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-SYRINGE-5ML' AND b.batch_number = 'SYR-2641-O'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-GLOVES-LATEX-M
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'GLV-2642-P',
  60,
  60,
  0,
  1320.00,
  DATE_ADD(CURDATE(), INTERVAL 900 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Ansell Lanka (Pvt) Ltd'
WHERE p.sku = 'RET-GLOVES-LATEX-M'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-GLOVES-LATEX-M' AND b.batch_number = 'GLV-2642-P'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-FACE-MASK-50
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'MSK-2643-Q',
  100,
  100,
  0,
  420.00,
  DATE_ADD(CURDATE(), INTERVAL 920 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'State Pharmaceuticals Corporation (SPC)'
WHERE p.sku = 'RET-FACE-MASK-50'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-FACE-MASK-50' AND b.batch_number = 'MSK-2643-Q'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-COTTON-ROLL-100G
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'COT-2644-R',
  160,
  160,
  0,
  180.00,
  DATE_ADD(CURDATE(), INTERVAL 990 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'RET-COTTON-ROLL-100G'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-COTTON-ROLL-100G' AND b.batch_number = 'COT-2644-R'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-OMRON-M2
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'OMR-2645-S',
  25,
  25,
  0,
  10800.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'George Steuart Health (Pvt) Ltd'
WHERE p.sku = 'RET-OMRON-M2'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-OMRON-M2' AND b.batch_number = 'OMR-2645-S'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-ACCUCHEK-ACT
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ACC-2646-T',
  30,
  30,
  0,
  4900.00,
  DATE_ADD(CURDATE(), INTERVAL 1200 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'RET-ACCUCHEK-ACT'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-ACCUCHEK-ACT' AND b.batch_number = 'ACC-2646-T'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-ACCUCHEK-STRIP50
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ACS-2647-U',
  80,
  80,
  0,
  3100.00,
  DATE_ADD(CURDATE(), INTERVAL 510 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'RET-ACCUCHEK-STRIP50'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-ACCUCHEK-STRIP50' AND b.batch_number = 'ACS-2647-U'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-BEURER-THERM
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'BEU-2648-V',
  40,
  40,
  0,
  980.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'George Steuart Health (Pvt) Ltd'
WHERE p.sku = 'RET-BEURER-THERM'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-BEURER-THERM' AND b.batch_number = 'BEU-2648-V'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-ENSURE-GOLD-850
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ENS-2649-W',
  35,
  35,
  0,
  6200.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'RET-ENSURE-GOLD-850'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-ENSURE-GOLD-850' AND b.batch_number = 'ENS-2649-W'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-GLUCERNA-850
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'GLC-2650-X',
  30,
  30,
  0,
  6600.00,
  DATE_ADD(CURDATE(), INTERVAL 610 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'RET-GLUCERNA-850'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-GLUCERNA-850' AND b.batch_number = 'GLC-2650-X'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-ORS-LEMON-10S
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'ORS-2651-Y',
  120,
  120,
  0,
  300.00,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'State Pharmaceuticals Corporation (SPC)'
WHERE p.sku = 'RET-ORS-LEMON-10S'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-ORS-LEMON-10S' AND b.batch_number = 'ORS-2651-Y'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-LIFEBUOY-SAN-100
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'LIF-2652-Z',
  150,
  150,
  0,
  260.00,
  DATE_ADD(CURDATE(), INTERVAL 750 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'RET-LIFEBUOY-SAN-100'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-LIFEBUOY-SAN-100' AND b.batch_number = 'LIF-2652-Z'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-KOTEX-MAXI-16
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'KOT-2653-AA',
  90,
  90,
  0,
  390.00,
  DATE_ADD(CURDATE(), INTERVAL 850 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Sunshine Healthcare Lanka Ltd'
WHERE p.sku = 'RET-KOTEX-MAXI-16'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-KOTEX-MAXI-16' AND b.batch_number = 'KOT-2653-AA'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-SENSODYNE-RAPID
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'SEN-2654-AB',
  110,
  110,
  0,
  520.00,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'Hemas Pharmaceuticals (Pvt) Ltd'
WHERE p.sku = 'RET-SENSODYNE-RAPID'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-SENSODYNE-RAPID' AND b.batch_number = 'SEN-2654-AB'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-PAMPERS-MIDI-48
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  s.id,
  'PAM-2655-AC',
  40,
  40,
  0,
  3650.00,
  DATE_ADD(CURDATE(), INTERVAL 950 DAY),
  NOW(),
  0
FROM products p
LEFT JOIN suppliers s ON s.name = 'A. Baur & Co. (Pvt) Ltd'
WHERE p.sku = 'RET-PAMPERS-MIDI-48'
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
  'Verified Opening Stock from Authorized Distributor Invoice',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-PAMPERS-MIDI-48' AND b.batch_number = 'PAM-2655-AC'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);

COMMIT;