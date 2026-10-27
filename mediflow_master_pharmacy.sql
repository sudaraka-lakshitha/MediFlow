-- MediFlow Master Pharmacy & Healthcare Catalog (Real & Crawled Data)
-- Total Products: 349
-- Generated on 2026-10-27
START TRANSACTION;

-- 1. Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Hemas Pharmaceuticals (Pvt) Ltd', 'Sanjeewa Samaranayake', '+94 11 473 1731', 'inquiries@hemaspharmaceuticals.com', 'Hemas House, No. 75, Braybrooke Place, Colombo 02, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('A. Baur & Co. (Pvt) Ltd', 'Dr. Lakshman Weerasena', '+94 11 472 8700', 'healthcare@baurs.com', 'No. 62, Jethawana Road, Colombo 14, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Sunshine Healthcare Lanka Ltd', 'T. Sayandhan', '+94 11 470 2400', 'info@sunshinehealthcare.net', 'No. 60, Nawala Road, Narahenpita, Colombo 05, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('George Steuart Health (Pvt) Ltd', 'Erandajith Ranasinghe', '+94 11 268 2050', 'health@georgesteuart.lk', 'No. 19, Janadhipathi Mawatha, Colombo 01, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Emerchemie NB (Ceylon) Limited', 'Lalith Jayawardena', '+94 11 269 8812', 'pharma@emerchemie.lk', 'No. 46, Sri Deva Ratnadhara Mawatha, Colombo 10, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('State Pharmaceuticals Corporation (SPC)', 'Nihal Alwis', '+94 11 232 0356', 'gm@spc.lk', 'No. 75, Sir Baron Jayathilake Mawatha, Colombo 01, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Morison PLC', 'Dinesh Pathirana', '+94 11 244 4760', 'info@morison.lk', 'No. 620, Biyagama Road, Pethiyagoda, Kelaniya, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Ansell Lanka (Pvt) Ltd', 'Rohan Fernando', '+94 11 482 6800', 'supplychain.lanka@ansell.com', 'Ring Road Phase II, Export Processing Zone, Biyagama, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at) VALUES ('Kanapathee Pharmacy / New Kavery Medical', 'Dispensary Pharmacist', '+94 77 891 4073', 'info@kanapathee.com', 'New Kavery Medical, NMRA License RL-08261, Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;

-- 2. Manufacturers
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('GlaxoSmithKline (GSK) Pharmaceuticals', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Abbott Laboratories', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Novartis Pharma AG', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pfizer Laboratories Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('State Pharmaceuticals Manufacturing Corporation (SPMC)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Sun Pharmaceutical Industries Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Cipla Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Sanofi-Aventis', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Reckitt Benckiser Healthcare', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Merck Healthcare KGaA', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Servier Laboratories', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Organon / MSD', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('AstraZeneca Pharmaceuticals', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Johnson & Johnson', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Bayer Consumer Care', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('3M Healthcare Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Ansell Healthcare', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Omron Healthcare Co., Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Roche Diagnostics', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Unilever Sri Lanka Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Grünenthal GmbH', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Boehringer Ingelheim', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Alcon Laboratories', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Kimberly-Clark', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Mead Johnson Nutrition', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Wettasinghe Pharmaceuticals', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('ZIFAM OTC (Alaris)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Hexagon', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('VILLOGEN PHARMA', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('George Steuart Health Pvt ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('HAXAGON (Sun Shine)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Tranz pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pampers', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Sun', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Whisper', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Ariel', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pantene', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Olay', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Ms', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Tide', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('MP', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Head & Shoulders', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Old Spice', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Vicks', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Gillette', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Robert Hall & Co.Ltd.', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Hi Care Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Sun Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Tabrane', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pettah Pharmacy (Jansen))', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Emerchemie', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Ceyoka', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Slim Pharma Vanikaa', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Raptakos Brett &Co.Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pharma Associates', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('GLOBE(Tabrane)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Mankind Pharma Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('ABC Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('KAMAZU PVT LTD', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Neem Glow Pharmars', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Avenierr Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Cipla Pharmaceuticals', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Generic Divison (Alaris)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Cmps Pharma (Alaris)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pharma Associates Generic', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Sun Shine (Genaric)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Soflogic(Part)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Pharma Health Lanka (PVT) LTD', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Axia ( PVT ) Ltd', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Agio Pharmaceuticals(Dermo)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Agio Pharmaceuticals', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Unijules Life Scienc(Softlogi)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Nem Laboratories(Softlogic)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Mitsubishi Tanabe', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Hemas', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Appletree Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Unicure Remedies', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Wallace Pharmaceuticals Ltd.', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('KONIX', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Cipla', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Midascare Pharma (Softlog)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Getz Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('ZIFAM PHARMA(Alaris)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Madras Pharmaceutica (Branded)', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('A M N Life', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('tranz', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('Emer Pharma', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO manufacturers (name, country, active, created_at, updated_at) VALUES ('ASTRON', 'Sri Lanka', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;

-- 3. Categories
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Analgesics & Antipyretics', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Antibiotics & Antimicrobials', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Cardiovascular & Antihypertensives', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Endocrine & Diabetes Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Gastrointestinal & Digestive', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Respiratory & Anti-Allergy', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Dermatology & Topical Treatments', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Vitamins, Minerals & Supplements', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('First Aid & Surgical Dressings', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Diagnostic Devices & Monitors', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Clinical Nutrition & Infant Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Personal Hygiene & Sanitization', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Ophthalmic & Otic Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Nutrition & Food Supplements', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Baby Care & Diapers', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Personal & Skin Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Medical Devices & Diagnostics', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('General Products', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Laundry Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Personal Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Grocery', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Snacks', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Home Care', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Shaving & Grooming', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Women''s Healthcare', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Prescription Medicines', 'MediFlow Master Pharmacy Category', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;

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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PANADOL-ACT',
  'MEDICINE',
  'Paracetamol Fast Absorbing',
  'Panadol ActiFast',
  '500 mg',
  'Film-coated tablet',
  'tablet',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Paracetamol',
  'Paracetamol Oral',
  '5054563002222',
  NULL,
  NULL,
  'Store below 30°C in a dry place.',
  NULL,
  NULL,
  8.50,
  400,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-VOLTAREN-GEL',
  'MEDICINE',
  'Diclofenac Diethylamine Gel',
  'Voltaren Emulgel 50 g',
  '1.16% w/w',
  'Gel',
  'tube',
  'Novartis Pharma AG',
  'Diclofenac',
  'Diclofenac Topical',
  '7680312005555',
  NULL,
  NULL,
  'Store below 30°C. Do not freeze.',
  NULL,
  NULL,
  1650.00,
  30,
  0,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ARCOXIA-90',
  'MEDICINE',
  'Etoricoxib',
  'Arcoxia 90 mg',
  '90 mg',
  'Film-coated tablet',
  'tablet',
  'Organon / MSD',
  'Etoricoxib',
  'Etoricoxib Oral',
  '8901234009988',
  NULL,
  NULL,
  'Store in original package below 30°C.',
  NULL,
  NULL,
  195.00,
  100,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Organon / MSD' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-TRAMAL-50',
  'MEDICINE',
  'Tramadol Hydrochloride',
  'Tramal 50 mg',
  '50 mg',
  'Capsule',
  'capsule',
  'Grünenthal GmbH',
  'Tramadol',
  'Tramadol Oral',
  '4019800123456',
  NULL,
  NULL,
  'Controlled medicine. Store securely below 25°C.',
  NULL,
  NULL,
  28.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Grünenthal GmbH' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CONCOR-5',
  'MEDICINE',
  'Bisoprolol Fumarate',
  'Concor 5 mg',
  '5 mg',
  'Film-coated tablet',
  'tablet',
  'Merck Healthcare KGaA',
  'Bisoprolol',
  'Bisoprolol Oral',
  '4027453007777',
  NULL,
  NULL,
  'Store below 30°C in a dry place.',
  NULL,
  NULL,
  46.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Merck Healthcare KGaA' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-MICARDIS-40',
  'MEDICINE',
  'Telmisartan',
  'Micardis 40 mg',
  '40 mg',
  'Tablet',
  'tablet',
  'Boehringer Ingelheim',
  'Telmisartan',
  'Telmisartan Oral',
  '4013456001234',
  NULL,
  NULL,
  'Store in original package to protect from moisture.',
  NULL,
  NULL,
  78.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Cardiovascular & Antihypertensives' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Boehringer Ingelheim' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-LASIX-40',
  'MEDICINE',
  'Furosemide',
  'Lasix 40 mg',
  '40 mg',
  'Tablet',
  'tablet',
  'Sanofi-Aventis',
  'Furosemide',
  'Furosemide Oral',
  '3582910008899',
  NULL,
  NULL,
  'Store below 25°C protected from light.',
  NULL,
  NULL,
  8.00,
  300,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-FORXIGA-10',
  'MEDICINE',
  'Dapagliflozin Propanediol',
  'Forxiga 10 mg',
  '10 mg',
  'Film-coated tablet',
  'tablet',
  'AstraZeneca Pharmaceuticals',
  'Dapagliflozin',
  'SGLT2 Inhibitor',
  '7312345009988',
  NULL,
  NULL,
  'Store below 30°C.',
  NULL,
  NULL,
  220.00,
  80,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Endocrine & Diabetes Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'AstraZeneca Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-AMARYL-2',
  'MEDICINE',
  'Glimepiride',
  'Amaryl 2 mg',
  '2 mg',
  'Tablet',
  'tablet',
  'Sanofi-Aventis',
  'Glimepiride',
  'Glimepiride Oral',
  '3582910007788',
  NULL,
  NULL,
  'Store below 30°C in a dry place.',
  NULL,
  NULL,
  32.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Endocrine & Diabetes Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sanofi-Aventis' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-DIFLUCAN-150',
  'MEDICINE',
  'Fluconazole',
  'Diflucan 150 mg Single Dose',
  '150 mg',
  'Capsule',
  'capsule',
  'Pfizer Laboratories Ltd',
  'Fluconazole',
  'Fluconazole Oral',
  '5012345007766',
  NULL,
  NULL,
  'Store below 30°C.',
  NULL,
  NULL,
  320.00,
  60,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-DOXY-100',
  'MEDICINE',
  'Doxycycline Hyclate',
  'Doxycycline SPMC 100 mg',
  '100 mg',
  'Capsule',
  'capsule',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Doxycycline',
  'Doxycycline Oral',
  '4791234008899',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  18.00,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-KLARICID-500',
  'MEDICINE',
  'Clarithromycin',
  'Klaricid 500 mg',
  '500 mg',
  'Film-coated tablet',
  'tablet',
  'Abbott Laboratories',
  'Clarithromycin',
  'Clarithromycin Oral',
  '4010123008877',
  NULL,
  NULL,
  'Store in a dry place between 15°C and 30°C.',
  NULL,
  NULL,
  260.00,
  80,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Antibiotics & Antimicrobials' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Abbott Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ENO-LEMON-5G',
  'MEDICINE',
  'Sodium Bicarbonate and Citric Acid',
  'Eno Fruit Salt Lemon 5 g Sachet',
  '5 g',
  'Powder',
  'piece',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Sodium Bicarbonate',
  'Antacid Powder',
  '5054563003333',
  NULL,
  NULL,
  'Store below 30°C in a dry place. Protect from moisture.',
  NULL,
  NULL,
  65.00,
  200,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-BUSCOPAN-10',
  'MEDICINE',
  'Hyoscine Butylbromide',
  'Buscopan 10 mg',
  '10 mg',
  'Sugar-coated tablet',
  'tablet',
  'Sanofi-Aventis',
  'Hyoscine Butylbromide',
  'Antispasmodic',
  '3582910006677',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  38.00,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sanofi-Aventis' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-IMODIUM-2',
  'MEDICINE',
  'Loperamide Hydrochloride',
  'Imodium 2 mg',
  '2 mg',
  'Capsule',
  'capsule',
  'Johnson & Johnson',
  'Loperamide',
  'Antidiarrheal',
  '5410123009988',
  NULL,
  NULL,
  'Store below 30°C.',
  NULL,
  NULL,
  22.00,
  200,
  0,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-SYMBICORT-160',
  'MEDICINE',
  'Budesonide and Formoterol Fumarate',
  'Symbicort Turbuhaler 160/4.5 (120 doses)',
  '160 mcg / 4.5 mcg',
  'Inhaler',
  'puff',
  'AstraZeneca Pharmaceuticals',
  'Budesonide',
  'Combination Inhaler',
  '7312345008877',
  NULL,
  NULL,
  'Store with mouthpiece cover tightly closed below 30°C.',
  NULL,
  NULL,
  5200.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'AstraZeneca Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ALLEGRA-120',
  'MEDICINE',
  'Fexofenadine Hydrochloride',
  'Allegra 120 mg',
  '120 mg',
  'Film-coated tablet',
  'tablet',
  'Sanofi-Aventis',
  'Fexofenadine',
  'Antihistamine Oral',
  '3582910004455',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  95.00,
  150,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sanofi-Aventis' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-OTRIVIN-01',
  'MEDICINE',
  'Xylometazoline Hydrochloride',
  'Otrivin Adult Nasal Drops 0.1% 10 mL',
  '0.1% w/v',
  'Drops',
  'bottle',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Xylometazoline',
  'Nasal Decongestant',
  '5054563008811',
  NULL,
  NULL,
  'Store below 30°C. Do not use for more than 7 consecutive days.',
  NULL,
  NULL,
  420.00,
  50,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-STREPSILS-HL',
  'MEDICINE',
  'Dichlorobenzyl Alcohol & Amylmetacresol',
  'Strepsils Honey & Lemon Lozenges Pack of 24',
  '1.2 mg / 0.6 mg',
  'Lozenge',
  'box',
  'Reckitt Benckiser Healthcare',
  'Amylmetacresol',
  'Throat Lozenges',
  '5000158002233',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  680.00,
  40,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Reckitt Benckiser Healthcare' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-TEARS-NATURALE',
  'MEDICINE',
  'Dextran and Hydroxypropyl Methylcellulose',
  'Tears Naturale II Lubricant Eye Drops 15 mL',
  '0.1% / 0.3%',
  'Drops',
  'bottle',
  'Alcon Laboratories',
  'Dextran',
  'Artificial Tears',
  '3006500123456',
  NULL,
  NULL,
  'Store between 8°C and 30°C. Discard 28 days after first opening.',
  NULL,
  NULL,
  980.00,
  30,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Ophthalmic & Otic Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Alcon Laboratories' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CHLORAM-EYE',
  'MEDICINE',
  'Chloramphenicol Eye Drops',
  'Chloramphenicol 0.5% Eye Drops 10 mL',
  '0.5% w/v',
  'Drops',
  'bottle',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Chloramphenicol',
  'Eye Drops',
  '4791234006677',
  NULL,
  NULL,
  'Store refrigerated between 2°C and 8°C. Protect from light.',
  NULL,
  NULL,
  320.00,
  40,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Ophthalmic & Otic Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-OMRON-HEM7120',
  'NON_MEDICINAL',
  'Omron HEM-7120 Digital Automatic Upper Arm BP Monitor',
  'Omron Healthcare',
  'N/A',
  'Retail item',
  'piece',
  'Omron Healthcare Co., Ltd',
  NULL,
  'Blood Pressure Monitors',
  '4015672007120',
  NULL,
  NULL,
  'Keep in storage case at room temperature. Avoid moisture.',
  NULL,
  NULL,
  13200.00,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-PULSE-OXIMETER',
  'NON_MEDICINAL',
  'Contec LED Fingertip Pulse Oximeter CMS50D',
  'Contec Medical',
  'N/A',
  'Retail item',
  'piece',
  'Omron Healthcare Co., Ltd',
  NULL,
  'Pulse Oximeters',
  '6945040001234',
  NULL,
  NULL,
  'Store in dry place. Remove batteries if storing long term.',
  NULL,
  NULL,
  3850.00,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-OMRON-NEB-C28',
  'NON_MEDICINAL',
  'Omron CompAIR NE-C28P Compressor Nebulizer System',
  'Omron Healthcare',
  'N/A',
  'Retail item',
  'piece',
  'Omron Healthcare Co., Ltd',
  NULL,
  'Nebulizers',
  '4015672002828',
  NULL,
  NULL,
  'Store clean in carrying case.',
  NULL,
  NULL,
  19500.00,
  5,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-AEROCHAMBER-ADULT',
  'NON_MEDICINAL',
  'AeroChamber Plus Flow-Vu Inhaler Spacer Device with Adult Mask',
  'AeroChamber',
  'N/A',
  'Retail item',
  'piece',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  NULL,
  'Inhaler Spacers',
  '6754020001234',
  NULL,
  NULL,
  'Wash with mild soapy water once weekly. Air dry.',
  NULL,
  NULL,
  4200.00,
  15,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Diagnostic Devices & Monitors' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-SAVLON-500',
  'NON_MEDICINAL',
  'Savlon Antiseptic Liquid 500 mL',
  'Savlon',
  'N/A',
  'Retail item',
  'bottle',
  'Johnson & Johnson',
  NULL,
  'Antiseptics',
  '8901012005544',
  NULL,
  NULL,
  'Store below 30°C. For external use only.',
  NULL,
  NULL,
  850.00,
  30,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-SURG-SPIRIT-500',
  'NON_MEDICINAL',
  'Surgical Spirit B.P. (Isopropyl Alcohol 70%) 500 mL',
  'MediFlow SurgiSpirit',
  'N/A',
  'Retail item',
  'bottle',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  NULL,
  'Surgical Spirit',
  '4791000007788',
  NULL,
  NULL,
  'Flammable liquid. Store tightly capped below 25°C away from heat.',
  NULL,
  NULL,
  480.00,
  40,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-GAUZE-10X10',
  'NON_MEDICINAL',
  'Sterile Surgical Gauze Swabs 10 cm x 10 cm Pack of 5',
  'B. Braun Askina',
  'N/A',
  'Retail item',
  'pack',
  '3M Healthcare Ltd',
  NULL,
  'Gauze Swabs',
  '4022495007766',
  NULL,
  NULL,
  'Keep sterile wrapper intact until use.',
  NULL,
  NULL,
  120.00,
  100,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-CREPE-10CM',
  'NON_MEDICINAL',
  'Cotton Crepe Elastic Support Bandage 10 cm x 4.5 m',
  'Flamingo Crepe',
  'N/A',
  'Retail item',
  'piece',
  'Ansell Healthcare',
  NULL,
  'Crepe Bandages',
  '8901234005522',
  NULL,
  NULL,
  'Store in cool dry conditions. Washable and reusable.',
  NULL,
  NULL,
  380.00,
  50,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-HOT-WATER-BOTTLE',
  'NON_MEDICINAL',
  'Deluxe Rubber Hot Water Bottle 2 Litres with Fleece Cover',
  'MediFlow ComfortCare',
  'N/A',
  'Retail item',
  'piece',
  'Ansell Healthcare',
  NULL,
  'Heat Therapy',
  '4791000008899',
  NULL,
  NULL,
  'Drain completely and store in a cool, dark, dry place with stopper removed.',
  NULL,
  NULL,
  1250.00,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-FRIENDS-ADULT-M',
  'NON_MEDICINAL',
  'Friends Classic Adult Diapers Medium Pack of 10',
  'Friends Diapers',
  'N/A',
  'Retail item',
  'pack',
  'Kimberly-Clark',
  NULL,
  'Adult Incontinence',
  '8901030009988',
  NULL,
  NULL,
  'Store in dry sanitary conditions away from moisture.',
  NULL,
  NULL,
  2450.00,
  25,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Hygiene & Sanitization' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Kimberly-Clark' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-TENA-SLIP-L',
  'NON_MEDICINAL',
  'Tena Slip Plus Incontinence Briefs Large Pack of 10',
  'Tena Healthcare',
  'N/A',
  'Retail item',
  'pack',
  'Kimberly-Clark',
  NULL,
  'Adult Incontinence',
  '7322540001234',
  NULL,
  NULL,
  'Store in dry conditions.',
  NULL,
  NULL,
  3200.00,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Hygiene & Sanitization' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Kimberly-Clark' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'RET-SUSTAGEN-VAN-400',
  'NON_MEDICINAL',
  'Sustagen Hospital Formula Nutritional Powder Vanilla 400 g',
  'Sustagen',
  'N/A',
  'Retail item',
  'can',
  'Mead Johnson Nutrition',
  NULL,
  'Clinical Nutrition',
  '9300650001234',
  NULL,
  NULL,
  'Store in cool dry place. Use within 4 weeks of opening.',
  NULL,
  NULL,
  4200.00,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Clinical Nutrition & Infant Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Mead Johnson Nutrition' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PARACETAMOL-ML',
  'MEDICINE',
  'Paracetamol Paediatric Oral Suspension',
  'Paracetamol Paediatric Liquid',
  '120 mg/5 mL',
  'Oral suspension',
  'ml',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Paracetamol',
  'Paracetamol Liquid Dispensed',
  '4791000001001',
  NULL,
  NULL,
  'Store below 25°C. Shake well before measuring dose.',
  NULL,
  NULL,
  2.50,
  300,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Analgesics & Antipyretics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-IBUPROFEN-ML',
  'MEDICINE',
  'Ibuprofen Paediatric Oral Suspension',
  'Brufen Paediatric Liquid',
  '100 mg/5 mL',
  'Oral suspension',
  'ml',
  'Abbott Laboratories',
  'Ibuprofen',
  'Ibuprofen Liquid Dispensed',
  '4791000001002',
  NULL,
  NULL,
  'Store below 25°C. Take with or after food.',
  NULL,
  NULL,
  3.00,
  250,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-AMOXICILLIN-ML',
  'MEDICINE',
  'Amoxicillin Paediatric Oral Suspension',
  'Amoxil Paediatric Liquid',
  '125 mg/5 mL',
  'Oral suspension',
  'ml',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Amoxicillin',
  'Amoxicillin Liquid Dispensed',
  '4791000001003',
  NULL,
  NULL,
  'Store below 25°C. After reconstitution keep refrigerated.',
  NULL,
  NULL,
  3.50,
  300,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-AUGMENTIN-ML',
  'MEDICINE',
  'Amoxicillin and Clavulanate Potassium Oral Suspension',
  'Augmentin Paediatric Liquid',
  '156.25 mg/5 mL',
  'Oral suspension',
  'ml',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Amoxicillin',
  'Co-Amoxiclav Liquid Dispensed',
  '4791000001004',
  NULL,
  NULL,
  'Store powder below 25°C. Reconstituted suspension keep in refrigerator 2-8°C.',
  NULL,
  NULL,
  6.80,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CEFUROXIME-ML',
  'MEDICINE',
  'Cefuroxime Axetil Paediatric Oral Suspension',
  'Zinnat Paediatric Liquid',
  '125 mg/5 mL',
  'Oral suspension',
  'ml',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Cefuroxime',
  'Cefuroxime Liquid Dispensed',
  '4791000001005',
  NULL,
  NULL,
  'Store reconstituted suspension in refrigerator between 2°C and 8°C.',
  NULL,
  NULL,
  8.50,
  150,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-AZITHROMYCIN-ML',
  'MEDICINE',
  'Azithromycin Paediatric Oral Suspension',
  'Zithromax Paediatric Liquid',
  '200 mg/5 mL',
  'Oral suspension',
  'ml',
  'Pfizer Laboratories Ltd',
  'Azithromycin',
  'Azithromycin Liquid Dispensed',
  '4791000001006',
  NULL,
  NULL,
  'Store below 30°C. Shake well before each use.',
  NULL,
  NULL,
  7.20,
  150,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-METRONIDAZOLE-ML',
  'MEDICINE',
  'Metronidazole Benzoate Oral Suspension',
  'Flagyl Paediatric Liquid',
  '200 mg/5 mL',
  'Oral suspension',
  'ml',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Metronidazole',
  'Metronidazole Liquid Dispensed',
  '4791000001007',
  NULL,
  NULL,
  'Store below 25°C protected from direct light.',
  NULL,
  NULL,
  2.80,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CETIRIZINE-ML',
  'MEDICINE',
  'Cetirizine Dihydrochloride Oral Solution',
  'Zyrtec Paediatric Liquid',
  '5 mg/5 mL',
  'Syrup',
  'ml',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Cetirizine',
  'Cetirizine Liquid Dispensed',
  '4791000001008',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  4.20,
  250,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-LORATADINE-ML',
  'MEDICINE',
  'Loratadine Paediatric Syrup',
  'Claratyne Paediatric Liquid',
  '5 mg/5 mL',
  'Syrup',
  'ml',
  'Bayer Consumer Care',
  'Loratadine',
  'Loratadine Liquid Dispensed',
  '4791000001009',
  NULL,
  NULL,
  'Store below 25°C.',
  NULL,
  NULL,
  3.80,
  200,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Bayer Consumer Care' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-SALBUTAMOL-ML',
  'MEDICINE',
  'Salbutamol Sulphate Expectorant Syrup',
  'Ventolin Expectorant Liquid',
  '2 mg/5 mL',
  'Syrup',
  'ml',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Salbutamol',
  'Salbutamol Liquid Dispensed',
  '4791000001010',
  NULL,
  NULL,
  'Store below 30°C protected from light.',
  NULL,
  NULL,
  2.50,
  300,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-CHLORPHEN-ML',
  'MEDICINE',
  'Chlorpheniramine Maleate Syrup (Piriton)',
  'Piriton Paediatric Liquid',
  '2 mg/5 mL',
  'Syrup',
  'ml',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Chlorpheniramine',
  'Chlorpheniramine Liquid Dispensed',
  '4791000001011',
  NULL,
  NULL,
  'Store below 25°C protected from light.',
  NULL,
  NULL,
  1.90,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-DIPHENHYD-ML',
  'MEDICINE',
  'Diphenhydramine Hydrochloride Cough Linctus',
  'Benadryl Paediatric Liquid',
  '12.5 mg/5 mL',
  'Syrup',
  'ml',
  'Johnson & Johnson',
  'Diphenhydramine',
  'Cough Linctus Liquid Dispensed',
  '4791000001012',
  NULL,
  NULL,
  'Store below 25°C.',
  NULL,
  NULL,
  2.20,
  250,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Johnson & Johnson' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-BROMHEXINE-ML',
  'MEDICINE',
  'Bromhexine Hydrochloride Mucolytic Elixir',
  'Bisolvon Paediatric Liquid',
  '4 mg/5 mL',
  'Syrup',
  'ml',
  'Boehringer Ingelheim',
  'Bromhexine',
  'Bromhexine Liquid Dispensed',
  '4791000001013',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  2.60,
  250,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Boehringer Ingelheim' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-PREDNISOLONE-ML',
  'MEDICINE',
  'Prednisolone Paediatric Oral Solution',
  'Prednisolone Paediatric Liquid',
  '5 mg/5 mL',
  'Oral solution',
  'ml',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Prednisolone',
  'Prednisolone Liquid Dispensed',
  '4791000001014',
  NULL,
  NULL,
  'Store below 25°C protected from light.',
  NULL,
  NULL,
  4.50,
  150,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Respiratory & Anti-Allergy' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-DOMPERIDONE-ML',
  'MEDICINE',
  'Domperidone Paediatric Oral Suspension',
  'Motilium Paediatric Liquid',
  '5 mg/5 mL',
  'Oral suspension',
  'ml',
  'Johnson & Johnson',
  'Domperidone',
  'Domperidone Liquid Dispensed',
  '4791000001015',
  NULL,
  NULL,
  'Store below 30°C.',
  NULL,
  NULL,
  3.80,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ONDANSETRON-ML',
  'MEDICINE',
  'Ondansetron Paediatric Oral Solution',
  'Zofran Paediatric Liquid',
  '4 mg/5 mL',
  'Oral solution',
  'ml',
  'GlaxoSmithKline (GSK) Pharmaceuticals',
  'Ondansetron',
  'Ondansetron Liquid Dispensed',
  '4791000001016',
  NULL,
  NULL,
  'Store upright below 30°C. Protect from light.',
  NULL,
  NULL,
  7.50,
  120,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Gastrointestinal & Digestive' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GlaxoSmithKline (GSK) Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-LACTULOSE-ML',
  'MEDICINE',
  'Lactulose Concentrated Oral Solution',
  'Duphalac Bulk Liquid',
  '3.35 g/5 mL',
  'Oral solution',
  'ml',
  'Abbott Laboratories',
  'Lactulose',
  'Lactulose Liquid Dispensed',
  '4791000001017',
  NULL,
  NULL,
  'Store between 15°C and 25°C. Do not freeze.',
  NULL,
  NULL,
  3.60,
  400,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ANTACID-ML',
  'MEDICINE',
  'Aluminium Hydroxide and Magnesium Trisilicate Gel',
  'Antacid Suspension Bulk Liquid',
  '250 mg/5 mL',
  'Oral suspension',
  'ml',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Aluminium Hydroxide',
  'Antacid Liquid Dispensed',
  '4791000001018',
  NULL,
  NULL,
  'Store below 25°C. Shake well before use.',
  NULL,
  NULL,
  2.00,
  500,
  0,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-MULTIVIT-ML',
  'MEDICINE',
  'Paediatric Multivitamin Drops and Syrup',
  'Abidec Paediatric Liquid',
  '5 mL Formula',
  'Syrup',
  'ml',
  'Pfizer Laboratories Ltd',
  'Multivitamin',
  'Multivitamin Liquid Dispensed',
  '4791000001019',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  2.70,
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'MED-ZINC-ML',
  'MEDICINE',
  'Zinc Sulfate Paediatric Oral Solution',
  'Zincovit Paediatric Liquid',
  '10 mg/5 mL',
  'Syrup',
  'ml',
  'State Pharmaceuticals Manufacturing Corporation (SPMC)',
  'Zinc Sulfate',
  'Zinc Liquid Dispensed',
  '4791000001020',
  NULL,
  NULL,
  'Store below 25°C in a dry place.',
  NULL,
  NULL,
  2.20,
  250,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Vitamins, Minerals & Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'State Pharmaceuticals Manufacturing Corporation (SPMC)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4976',
  'NON_MEDICINAL',
  'Glucose M 100g',
  'Wettasinghe Pharmaceuticals',
  'N/A',
  'Retail item',
  'piece',
  'Wettasinghe Pharmaceuticals',
  NULL,
  'Nutrition & Food',
  '4790000004976',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  173.76,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4977',
  'NON_MEDICINAL',
  'Glucose M 500g',
  'Wettasinghe Pharmaceuticals',
  'N/A',
  'Retail item',
  'piece',
  'Wettasinghe Pharmaceuticals',
  NULL,
  'Nutrition & Food',
  '4790000004977',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  728.67,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4530',
  'NON_MEDICINAL',
  'SWABHA BABY oil 100ml',
  'ZIFAM OTC (Alaris)',
  'N/A',
  'Retail item',
  'bottle',
  'ZIFAM OTC (Alaris)',
  NULL,
  'Baby Care',
  '4790000004530',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  394.67,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'ZIFAM OTC (Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4306',
  'NON_MEDICINAL',
  'Pentasure hepatic(em) 1s''',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004306',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3786.61,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4307',
  'NON_MEDICINAL',
  'Pentasure pedia gold(em) 1s''',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004307',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4418.07,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4308',
  'NON_MEDICINAL',
  'Pentasure immunomax (em) 1s''',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004308',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  5686.46,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4309',
  'NON_MEDICINAL',
  'Pentasure 2.0 (em) 400G',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004309',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  8502.93,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4310',
  'NON_MEDICINAL',
  'Pentasure DLS(em) 6*42G',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004310',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4132.58,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4311',
  'NON_MEDICINAL',
  'Pentasure DM(em) 400G',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004311',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  5652.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4312',
  'NON_MEDICINAL',
  'Pentasure Renal(em) 182G',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004312',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3752.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4313',
  'NON_MEDICINAL',
  'Pentasure critipep(em) 1s''',
  'Hexagon',
  'N/A',
  'Retail item',
  'piece',
  'Hexagon',
  NULL,
  'Nutrition Drinks',
  '4790000004313',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  5567.38,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hexagon' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4169',
  'NON_MEDICINAL',
  'VILLOGEL {Ultra Strength Pain Relievergel} 30g',
  'VILLOGEN PHARMA',
  'N/A',
  'Retail item',
  'piece',
  'VILLOGEN PHARMA',
  NULL,
  'Skin Care',
  '4790000004169',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  641.25,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'VILLOGEN PHARMA' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3930',
  'NON_MEDICINAL',
  'S-26 GOLD 1 Powder 400g (1''s)',
  'George Steuart Health Pvt ltd',
  'N/A',
  'Retail item',
  'piece',
  'George Steuart Health Pvt ltd',
  NULL,
  'Nutrition & Food',
  '4790000003930',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3297.17,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'George Steuart Health Pvt ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3441',
  'NON_MEDICINAL',
  'Pentasure 2.0 400g',
  'HAXAGON (Sun Shine)',
  'N/A',
  'Retail item',
  'piece',
  'HAXAGON (Sun Shine)',
  NULL,
  'Nutrition Drinks',
  '4790000003441',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6213.05,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HAXAGON (Sun Shine)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3442',
  'NON_MEDICINAL',
  'Pentasure DM (Vanila) 400g',
  'HAXAGON (Sun Shine)',
  'N/A',
  'Retail item',
  'piece',
  'HAXAGON (Sun Shine)',
  NULL,
  'Nutrition Drinks',
  '4790000003442',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  5184.51,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HAXAGON (Sun Shine)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3443',
  'NON_MEDICINAL',
  'Pentasure Hepatic (Sachets) 25g x 6',
  'HAXAGON (Sun Shine)',
  'N/A',
  'Retail item',
  'piece',
  'HAXAGON (Sun Shine)',
  NULL,
  'Nutrition Drinks',
  '4790000003443',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3455.12,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HAXAGON (Sun Shine)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3444',
  'NON_MEDICINAL',
  'Pentasure HP 30g x 6',
  'HAXAGON (Sun Shine)',
  'N/A',
  'Retail item',
  'piece',
  'HAXAGON (Sun Shine)',
  NULL,
  'Nutrition Drinks',
  '4790000003444',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3352.88,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HAXAGON (Sun Shine)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2828',
  'NON_MEDICINAL',
  'Glucose monitoring system (Exactive Easy) 1',
  'Tranz pharma',
  'N/A',
  'Retail item',
  'piece',
  'Tranz pharma',
  NULL,
  'Nutrition & Food',
  '4790000002828',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  5225.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Nutrition & Food Supplements' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tranz pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2829',
  'NON_MEDICINAL',
  'Glucose Test strips (Exactive Easy) 50 Strips',
  'Tranz pharma',
  'N/A',
  'Retail item',
  'pack',
  'Tranz pharma',
  NULL,
  'Medical Devices',
  '4790000002829',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4735.75,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Medical Devices & Diagnostics' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tranz pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2238',
  'NON_MEDICINAL',
  'PAMPERS PANTS MD 12''S(24)-1350/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002238',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1282.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2239',
  'NON_MEDICINAL',
  'PAMPERS PANTS LG 10''S(24)-1300/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002239',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1235.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2240',
  'NON_MEDICINAL',
  'PAMPERS PANTS XL 20''S(12)-2550/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002240',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2422.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2241',
  'NON_MEDICINAL',
  'PAMPERS PANTS XXL 16''S(12)-2100',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002241',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1995.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2242',
  'NON_MEDICINAL',
  'PAMPERS PANTS MD 40''S(6)-4500/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002242',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4275.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2243',
  'NON_MEDICINAL',
  'PAMPERS PANTS LG 36''S(6)-4350/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002243',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4132.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2244',
  'NON_MEDICINAL',
  'PAMPERS PANTS LG 64''S(4)-7700/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002244',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  7315.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2245',
  'NON_MEDICINAL',
  'PAMPERS PANTS XL 56''S(4)-7000/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002245',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6650.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2246',
  'NON_MEDICINAL',
  'PAMPERS PANTS XXL 42''S(4)-5500/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002246',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  5225.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2247',
  'NON_MEDICINAL',
  'SUN UP COCONUT OIL 1L+TK 100G FR(6)-1590/',
  'Sun',
  'N/A',
  'Retail item',
  'bottle',
  'Sun',
  NULL,
  'General Products',
  '4790000002247',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1510.50,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'General Products' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2248',
  'NON_MEDICINAL',
  'PAMPERS PANTS SM31(12)-3050/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002248',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2897.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2249',
  'NON_MEDICINAL',
  'PAMPERS PANTS MD 76''S(4)-8300/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002249',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  7885.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2250',
  'NON_MEDICINAL',
  'WHISPER SOFT XL15+SOFT XL 6 FREE(24)595/',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Diapers & Nappies',
  '4790000002250',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  565.25,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2251',
  'NON_MEDICINAL',
  'SUN UP COCONUT OIL 1L+TK 50G FR(6)-1590/=',
  'Sun',
  'N/A',
  'Retail item',
  'bottle',
  'Sun',
  NULL,
  'General Products',
  '4790000002251',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1510.50,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'General Products' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2254',
  'NON_MEDICINAL',
  'ARIEL LIQUID FRONT LOAD 500g(12)-625/=',
  'Ariel',
  'N/A',
  'Retail item',
  'piece',
  'Ariel',
  NULL,
  'Laundry Care',
  '4790000002254',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  593.75,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ariel' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2255',
  'NON_MEDICINAL',
  'ARIEL LIQUID TOP LOAD 500g(12)-570/=',
  'Ariel',
  'N/A',
  'Retail item',
  'piece',
  'Ariel',
  NULL,
  'Laundry Care',
  '4790000002255',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  541.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ariel' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2256',
  'NON_MEDICINAL',
  'ARIEL LIQUID FRONT LOAD POUCH 1KG(12)-1150/=',
  'Ariel',
  'N/A',
  'Retail item',
  'piece',
  'Ariel',
  NULL,
  'Laundry Care',
  '4790000002256',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1092.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ariel' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2257',
  'NON_MEDICINAL',
  'ARIEL LIQUID TOP LOAD POUCH 1KG(12)-1050/=',
  'Ariel',
  'N/A',
  'Retail item',
  'piece',
  'Ariel',
  NULL,
  'Laundry Care',
  '4790000002257',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  997.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ariel' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2258',
  'NON_MEDICINAL',
  'PANTENE SHM H/F CONTROL 75ML(48)-460/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002258',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  437.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2259',
  'NON_MEDICINAL',
  'PANTENE SHM H/F CONTROL 180ML(56)-900/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002259',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  855.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2260',
  'NON_MEDICINAL',
  'PANTENE SHM H/F CONTRL 340ML(30)-1700/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002260',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1615.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2261',
  'NON_MEDICINAL',
  'PANTENE HAIR FALL CON 100ML(24)-740/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002261',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  703.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2262',
  'NON_MEDICINAL',
  'PANTENE HAIR FALL CON 200ML(24)-1400/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002262',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1330.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2263',
  'NON_MEDICINAL',
  'PAMPERS PANTS SM 10''S(40)-1090/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002263',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1035.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2264',
  'NON_MEDICINAL',
  'PAMPERS PANTS SM 52''S(6)-5100/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002264',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4845.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2265',
  'NON_MEDICINAL',
  'PAMPERS PANTS LG 21''S(12)-2550/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002265',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2422.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2266',
  'NON_MEDICINAL',
  'OLAY MOISTURIZING LOTION 150ML(12)-1400/',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Personal Care',
  '4790000002266',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1330.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2267',
  'NON_MEDICINAL',
  'WHISPER UL BIN NGT XXL15 B2G1(20)-1600/=',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Diapers & Nappies',
  '4790000002267',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1520.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2182',
  'NON_MEDICINAL',
  'PAMPERS PANTS MD 22''s(12)-2400/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002182',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2280.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2183',
  'NON_MEDICINAL',
  'PAMPERS PANTS XL 16''S(12)-2000/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002183',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1900.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2184',
  'NON_MEDICINAL',
  'PAMPERS PANTS XXL14''S(12)-1900/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002184',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1805.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2185',
  'NON_MEDICINAL',
  'PAMPERS PANTS SM 52''S(6)-4300/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002185',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4085.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2186',
  'NON_MEDICINAL',
  'PAMPERS PANTS MD 42''S(6)-4300/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002186',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4085.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2187',
  'NON_MEDICINAL',
  'PAMPERS PANTS XL 30''S(6)-3700/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002187',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3515.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2188',
  'NON_MEDICINAL',
  'PAMPERS PANTS SM 86''S(4)-6650/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002188',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6317.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2189',
  'NON_MEDICINAL',
  'PAMPERS PANTS MD 76''S(4)-6650/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002189',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6317.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2190',
  'NON_MEDICINAL',
  'PAMPERS PANTS LG 64''S(4)-6650/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002190',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6317.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2191',
  'NON_MEDICINAL',
  'PAMPERS PANTS XL 56''S(4)-6650/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002191',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6317.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2192',
  'NON_MEDICINAL',
  'PAMPERS PANTS XXL 42''S(4)-5000/=',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002192',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  4750.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2193',
  'NON_MEDICINAL',
  'MS COFFEE BLEND BEANS CLASSIC MEDI DR 500G',
  'Ms',
  'N/A',
  'Retail item',
  'piece',
  'Ms',
  NULL,
  'Grocery',
  '4790000002193',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  120.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ms' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2194',
  'NON_MEDICINAL',
  'MS COFFEE BLEND BEANS GOLD MEDIUM DR 500G',
  'Ms',
  'N/A',
  'Retail item',
  'piece',
  'Ms',
  NULL,
  'Grocery',
  '4790000002194',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  120.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ms' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2195',
  'NON_MEDICINAL',
  'MS COFFEE BEANS 100% ARABICA-MEDI DR 500G',
  'Ms',
  'N/A',
  'Retail item',
  'piece',
  'Ms',
  NULL,
  'Grocery',
  '4790000002195',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  450.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ms' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2196',
  'NON_MEDICINAL',
  'TIDE DETERGENT J- ROSE 500G(48)-300/=',
  'Tide',
  'N/A',
  'Retail item',
  'piece',
  'Tide',
  NULL,
  'Laundry Care',
  '4790000002196',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  285.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tide' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2197',
  'NON_MEDICINAL',
  'TIDE DETERGENT J-ROSE 1KG (24)-540/=',
  'Tide',
  'N/A',
  'Retail item',
  'piece',
  'Tide',
  NULL,
  'Laundry Care',
  '4790000002197',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  513.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tide' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2199',
  'NON_MEDICINAL',
  'TIDE DETERGENT J-ROSE 500G*4 BUCKET 1200/=',
  'Tide',
  'N/A',
  'Retail item',
  'piece',
  'Tide',
  NULL,
  'Laundry Care',
  '4790000002199',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1140.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Laundry Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tide' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2200',
  'NON_MEDICINAL',
  'MP CRISPS ORIGINAL 40G(20)-500/=',
  'MP',
  'N/A',
  'Retail item',
  'piece',
  'MP',
  NULL,
  'Grocery',
  '4790000002200',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  475.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'MP' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2201',
  'NON_MEDICINAL',
  'MP CRISPS ORIGINAL 100G(14)-980/=',
  'MP',
  'N/A',
  'Retail item',
  'piece',
  'MP',
  NULL,
  'Grocery',
  '4790000002201',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  931.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'MP' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2202',
  'NON_MEDICINAL',
  'H&S SHM A/H FALL 2IN1 180ML (56)-1020/=',
  'Head & Shoulders',
  'N/A',
  'Retail item',
  'piece',
  'Head & Shoulders',
  NULL,
  'Grocery',
  '4790000002202',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  969.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Head & Shoulders' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2203',
  'NON_MEDICINAL',
  'H&S SHM A/H FALL 2IN1 340ML (30)-1925/=',
  'Head & Shoulders',
  'N/A',
  'Retail item',
  'piece',
  'Head & Shoulders',
  NULL,
  'Grocery',
  '4790000002203',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1828.75,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Head & Shoulders' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2204',
  'NON_MEDICINAL',
  'WHISPER ULTRA S/LOVE SOFT XL6 (72)-260/=',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Diapers & Nappies',
  '4790000002204',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  247.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2205',
  'NON_MEDICINAL',
  'WHISPER ULTRA S/LOVE SOFT XL15(36)-595/=',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Diapers & Nappies',
  '4790000002205',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  565.25,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2206',
  'NON_MEDICINAL',
  'WHISPER UL BIN NGT XXL15 B2G1(18)-1600/=',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Diapers & Nappies',
  '4790000002206',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1520.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2207',
  'NON_MEDICINAL',
  'SUN UP COFFEE GR (48) 100G Rs.450/=',
  'Sun',
  'N/A',
  'Retail item',
  'piece',
  'Sun',
  NULL,
  'Snacks',
  '4790000002207',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  427.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Snacks' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2208',
  'NON_MEDICINAL',
  'SUN UP COCONUT OIL 500ML(6)-795/=',
  'Sun',
  'N/A',
  'Retail item',
  'bottle',
  'Sun',
  NULL,
  'General Products',
  '4790000002208',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  755.25,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'General Products' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2209',
  'NON_MEDICINAL',
  'PAMPERS PANT M11+H&S LF72ML FREE(12)1300',
  'Pampers',
  'N/A',
  'Retail item',
  'piece',
  'Pampers',
  NULL,
  'Diapers & Nappies',
  '4790000002209',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1235.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pampers' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2210',
  'NON_MEDICINAL',
  'WHISPER UL XL+ 15''S B2G1(18)-1450/=',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Diapers & Nappies',
  '4790000002210',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1377.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2211',
  'NON_MEDICINAL',
  'SUN UP COCONUT OIL 1000ML(6)-1590/=',
  'Sun',
  'N/A',
  'Retail item',
  'bottle',
  'Sun',
  NULL,
  'General Products',
  '4790000002211',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1510.50,
  20,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'General Products' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2212',
  'NON_MEDICINAL',
  'OLD SPICE MUSK AS LOTION 100ML (48) 1400',
  'Old Spice',
  'N/A',
  'Retail item',
  'piece',
  'Old Spice',
  NULL,
  'Personal Care',
  '4790000002212',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1330.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Old Spice' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2213',
  'NON_MEDICINAL',
  'OLD SPICE ORIGINAL AS LOTION GB 100ML (48)1400',
  'Old Spice',
  'N/A',
  'Retail item',
  'piece',
  'Old Spice',
  NULL,
  'Personal Care',
  '4790000002213',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1330.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Old Spice' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2214',
  'NON_MEDICINAL',
  'OLD SPICE ORIGINAL AS LOTION PB 100ML(96)1250',
  'Old Spice',
  'N/A',
  'Retail item',
  'piece',
  'Old Spice',
  NULL,
  'Personal Care',
  '4790000002214',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1187.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Old Spice' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2215',
  'MEDICINE',
  'VICKS JUMBO INHALER 0.5ML (650)-280/=',
  'Vicks',
  '0.5ML',
  'Inhaler',
  'puff',
  'Vicks',
  'VICKS JUMBO INHALER',
  'Personal Care',
  '4790000002215',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  266.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-93',
  'NON_MEDICINAL',
  'GIL F/P+Cad 4S+S/F 196M RS.135 OFF',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Home Care',
  '4790000000093',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2469.05,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Home Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2089',
  'NON_MEDICINAL',
  'VICKS BABYRUB 25ML(216)-500/=',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000002089',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  475.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2090',
  'NON_MEDICINAL',
  'VICKS BABYRUB 50ML(120)-700/=',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000002090',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  665.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1839',
  'NON_MEDICINAL',
  'VICKS BABYRUB 10ML(1080)-275/= (12*90)',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000001839',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  261.25,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1840',
  'NON_MEDICINAL',
  'VICKS BABYRUB 25ML(216)-620/= (9*24)',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000001840',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  589.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1841',
  'NON_MEDICINAL',
  'VICKS BABYRUB 50ML(120)-1025/= (5*24)',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000001841',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  973.75,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1862',
  'NON_MEDICINAL',
  'VICKS BABYRUB 10ML(12*30)-275/=',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000001862',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  261.25,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1863',
  'NON_MEDICINAL',
  'VICKS BABYRUB 25ML(9*12)-620/=',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000001863',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  589.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1864',
  'NON_MEDICINAL',
  'VICKS BABYRUB 50ML(5*6)-1025/=',
  'Vicks',
  'N/A',
  'Retail item',
  'piece',
  'Vicks',
  NULL,
  'Baby Care',
  '4790000001864',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  973.75,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Baby Care & Diapers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2217',
  'NON_MEDICINAL',
  'GILLETTE M3 REF RAZ+S/F REG 196G(6)1840/',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Hair Care',
  '4790000002217',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1748.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2218',
  'NON_MEDICINAL',
  'GILLETTE M3 REF RAZ+S/F LMN 196G(6)1840/',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Hair Care',
  '4790000002218',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1748.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2219',
  'NON_MEDICINAL',
  'GILLETTE M3 REF RAZ+S/F MIN 196G(6)1840/',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Hair Care',
  '4790000002219',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1748.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2141',
  'NON_MEDICINAL',
  'GIL.MACH3 TURBO CART 4''S(10)-4200/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Shaving & Grooming',
  '4790000002141',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3990.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Shaving & Grooming' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2142',
  'NON_MEDICINAL',
  'GIL.MACH3 TURBO CART 8''S(10)-7350/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Shaving & Grooming',
  '4790000002142',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  6982.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Shaving & Grooming' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2145',
  'NON_MEDICINAL',
  'OLAY MOISTURIZING LOTION 150ML(12)-2000/',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Personal Care',
  '4790000002145',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1900.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2146',
  'NON_MEDICINAL',
  'OLAY T/E FOAMING CLEANSER 100G (12)-1550',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Personal Care',
  '4790000002146',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1472.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2157',
  'NON_MEDICINAL',
  'PANTENE SHM DEEP REPAIR 75ML(48)-460/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002157',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  437.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2158',
  'NON_MEDICINAL',
  'PANTENE SHM SMOOTH SILKY 75ML(48)-460/=',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Personal Care',
  '4790000002158',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  437.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1788',
  'NON_MEDICINAL',
  'GIL SERIESGEL MOIS 195G(6)-2800/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Skin Care',
  '4790000001788',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2660.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1122',
  'NON_MEDICINAL',
  'GIL SERIESGEL MOIS 195G(6)-1630/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Skin Care',
  '4790000001122',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1548.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1024',
  'NON_MEDICINAL',
  'GIL SERIESGEL MOIS 195G(6)-1200/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Skin Care',
  '4790000001024',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  1140.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-930',
  'NON_MEDICINAL',
  'GIL SERIESGEL MOIS 195G(6)-999/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Skin Care',
  '4790000000930',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  949.05,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-671',
  'NON_MEDICINAL',
  'GIL SERIESGEL MOIS 195G(6)-910',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Skin Care',
  '4790000000671',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  864.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-672',
  'NON_MEDICINAL',
  'GIL SERIESGEL SENST 195G(6)-910/=',
  'Gillette',
  'N/A',
  'Retail item',
  'piece',
  'Gillette',
  NULL,
  'Skin Care',
  '4790000000672',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  864.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Gillette' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-393',
  'NON_MEDICINAL',
  'Pantene AD 170 ML + Olay 3in1 Serum 20G',
  'Pantene',
  'N/A',
  'Retail item',
  'piece',
  'Pantene',
  NULL,
  'Skin Care',
  '4790000000393',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  437.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pantene' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-256',
  'NON_MEDICINAL',
  'Olay Moistureizing Lotion 150m',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Skin Care',
  '4790000000256',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  997.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-235',
  'NON_MEDICINAL',
  'Olay Reg. Micro Sculpting Serum 50M',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Skin Care',
  '4790000000235',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3220.50,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-236',
  'NON_MEDICINAL',
  'Olay Regeneris Serum 50ML',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Skin Care',
  '4790000000236',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  2493.75,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-245',
  'NON_MEDICINAL',
  'Olay Reg. Micro Scul. Serum 50M @ 3400',
  'Olay',
  'N/A',
  'Retail item',
  'piece',
  'Olay',
  NULL,
  'Skin Care',
  '4790000000245',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  3230.00,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Olay' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-127',
  'NON_MEDICINAL',
  'H&S AHF 170ML + Olay 3in1 Serum 20G',
  'Head & Shoulders',
  'N/A',
  'Retail item',
  'piece',
  'Head & Shoulders',
  NULL,
  'Skin Care',
  '4790000000127',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  401.85,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Head & Shoulders' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-512',
  'NON_MEDICINAL',
  'Whisper Regular Flow Wings 10 s @ 199',
  'Whisper',
  'N/A',
  'Retail item',
  'piece',
  'Whisper',
  NULL,
  'Women''s Care',
  '4790000000512',
  NULL,
  NULL,
  'Store in a clean, dry location.',
  NULL,
  NULL,
  189.05,
  10,
  0,
  1,
  (SELECT id FROM categories WHERE name = 'Women''s Healthcare' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Whisper' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-5011',
  'MEDICINE',
  'Prazosin 1mg Tablet (Prazoright) NOVAGEN 100''S',
  'Wettasinghe Pharmaceuticals',
  '1mg',
  'Tablet',
  'tablet',
  'Wettasinghe Pharmaceuticals',
  'Prazosin',
  'Prescription Medicines',
  '4790000005011',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4812',
  'MEDICINE',
  'Udihep Fort Tablets 50 ''s',
  'Robert Hall & Co.Ltd.',
  'Standard',
  'Tablet',
  'tablet',
  'Robert Hall & Co.Ltd.',
  'Udihep Fort Tablets',
  'Prescription Medicines',
  '4790000004812',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Robert Hall & Co.Ltd.' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4450',
  'MEDICINE',
  'Lia Gold tablet 30''s',
  'Hi Care Pharma',
  'Standard',
  'Tablet',
  'tablet',
  'Hi Care Pharma',
  'Lia Gold tablet',
  'Personal Care',
  '4790000004450',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hi Care Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3988',
  'MEDICINE',
  'Citopam 10mg Tablet 3x10''s',
  'Sun Pharma',
  '10mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Citopam',
  'Prescription Medicines',
  '4790000003988',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3991',
  'MEDICINE',
  'Famocid 40mg Tablets 10x10''s',
  'Sun Pharma',
  '40mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Famocid',
  'Prescription Medicines',
  '4790000003991',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3992',
  'MEDICINE',
  'Levipil 250mg Tablet 3x10''s',
  'Sun Pharma',
  '250mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Levipil',
  'Prescription Medicines',
  '4790000003992',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3993',
  'MEDICINE',
  'Lithosun SR 400mg Tablet 3x10''s',
  'Sun Pharma',
  '400mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Lithosun SR',
  'Prescription Medicines',
  '4790000003993',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3994',
  'MEDICINE',
  'Rosuvas Tablets 5mg 50''s',
  'Sun Pharma',
  '5mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Rosuvas Tablets',
  'Prescription Medicines',
  '4790000003994',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3995',
  'MEDICINE',
  'Rosuvas Tablets 10mg 50''s',
  'Sun Pharma',
  '10mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Rosuvas Tablets',
  'Prescription Medicines',
  '4790000003995',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3996',
  'MEDICINE',
  'Zosert 25mg Tablet 5x10''s',
  'Sun Pharma',
  '25mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Zosert',
  'Prescription Medicines',
  '4790000003996',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3997',
  'MEDICINE',
  'Rosuvas Tablets 5mg 30''s',
  'Sun Pharma',
  '5mg',
  'Tablet',
  'tablet',
  'Sun Pharma',
  'Rosuvas Tablets',
  'Prescription Medicines',
  '4790000003997',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3998',
  'MEDICINE',
  'AL-DS (Albendazole Tablets) 20S',
  'Tabrane',
  'Standard',
  'Tablet',
  'tablet',
  'Tabrane',
  'AL',
  'Prescription Medicines',
  '4790000003998',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tabrane' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3955',
  'MEDICINE',
  'Motilium tablets 100''s',
  'Pettah Pharmacy (Jansen))',
  'Standard',
  'Tablet',
  'tablet',
  'Pettah Pharmacy (Jansen))',
  'Motilium tablets',
  'Prescription Medicines',
  '4790000003955',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pettah Pharmacy (Jansen))' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3791',
  'MEDICINE',
  'Ciprobiotic Forte 500mg Tablets 100''s',
  'Emerchemie',
  '500mg',
  'Tablet',
  'tablet',
  'Emerchemie',
  'Ciprobiotic Forte',
  'Prescription Medicines',
  '4790000003791',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3796',
  'MEDICINE',
  'Deflux Tablets 10mg 150''s',
  'Emerchemie',
  '10mg',
  'Tablet',
  'tablet',
  'Emerchemie',
  'Deflux Tablets',
  'Prescription Medicines',
  '4790000003796',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3812',
  'MEDICINE',
  'Neurobion Tablets 5x10''s',
  'Emerchemie',
  'Standard',
  'Tablet',
  'tablet',
  'Emerchemie',
  'Neurobion Tablets',
  'Prescription Medicines',
  '4790000003812',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3817',
  'MEDICINE',
  'Pan 20mg Tablets 10x10''s',
  'Emerchemie',
  '20mg',
  'Tablet',
  'tablet',
  'Emerchemie',
  'Pan',
  'Prescription Medicines',
  '4790000003817',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3821',
  'MEDICINE',
  'Tizorel 2mg tablets 30''s',
  'Emerchemie',
  '2mg',
  'Tablet',
  'tablet',
  'Emerchemie',
  'Tizorel',
  'Prescription Medicines',
  '4790000003821',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3824',
  'MEDICINE',
  'Zocef 250mg Tablets 1x6''s',
  'Emerchemie',
  '250mg',
  'Tablet',
  'tablet',
  'Emerchemie',
  'Zocef',
  'Prescription Medicines',
  '4790000003824',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3751',
  'MEDICINE',
  'Pantoprazole(Ultop) Tablet 40mg 30''s',
  'Ceyoka',
  '40mg',
  'Tablet',
  'tablet',
  'Ceyoka',
  'Pantoprazole',
  'Prescription Medicines',
  '4790000003751',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ceyoka' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4601',
  'MEDICINE',
  'Pepsol (Digestive Enzymes Capsules) 3x10''s',
  'Slim Pharma Vanikaa',
  'Standard',
  'Capsule',
  'capsule',
  'Slim Pharma Vanikaa',
  'Pepsol',
  'Prescription Medicines',
  '4790000004601',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Slim Pharma Vanikaa' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4278',
  'MEDICINE',
  'Isoflav Capsules 10*10',
  'Raptakos Brett &Co.Ltd',
  'Standard',
  'Capsule',
  'capsule',
  'Raptakos Brett &Co.Ltd',
  'Isoflav Capsules',
  'Prescription Medicines',
  '4790000004278',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Raptakos Brett &Co.Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4281',
  'MEDICINE',
  'Siderfol Capsules 10*10s',
  'Raptakos Brett &Co.Ltd',
  'Standard',
  'Capsule',
  'capsule',
  'Raptakos Brett &Co.Ltd',
  'Siderfol Capsules',
  'Prescription Medicines',
  '4790000004281',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Raptakos Brett &Co.Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4158',
  'MEDICINE',
  'BIFI Probiotic Capsules 30''s',
  'VILLOGEN PHARMA',
  'Standard',
  'Capsule',
  'capsule',
  'VILLOGEN PHARMA',
  'BIFI Probiotic Capsules',
  'Prescription Medicines',
  '4790000004158',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'VILLOGEN PHARMA' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3977',
  'MEDICINE',
  'Vitamin A & D Capsules (Retcal) 1000''s',
  'Pharma Associates',
  'Standard',
  'Capsule',
  'capsule',
  'Pharma Associates',
  'Vitamin A & D Capsules',
  'Prescription Medicines',
  '4790000003977',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Associates' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3990',
  'MEDICINE',
  'Duzela 30mg Capsule 3x10''s',
  'Sun Pharma',
  '30mg',
  'Capsule',
  'capsule',
  'Sun Pharma',
  'Duzela',
  'Prescription Medicines',
  '4790000003990',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3788',
  'MEDICINE',
  'Anemidox Capsules 3x10''s',
  'Emerchemie',
  'Standard',
  'Capsule',
  'capsule',
  'Emerchemie',
  'Anemidox Capsules',
  'Prescription Medicines',
  '4790000003788',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3794',
  'MEDICINE',
  'Cox B 200 Capsule 50''s',
  'Emerchemie',
  'Standard',
  'Capsule',
  'capsule',
  'Emerchemie',
  'Cox B',
  'Prescription Medicines',
  '4790000003794',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3795',
  'MEDICINE',
  'Cox B 100 Capsule 5 x 10''s',
  'Emerchemie',
  'Standard',
  'Capsule',
  'capsule',
  'Emerchemie',
  'Cox B',
  'Prescription Medicines',
  '4790000003795',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3798',
  'MEDICINE',
  'Evion 400mg Capsules 3x10''s',
  'Emerchemie',
  '400mg',
  'Capsule',
  'capsule',
  'Emerchemie',
  'Evion',
  'Prescription Medicines',
  '4790000003798',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3814',
  'MEDICINE',
  'Omastin Capsule 150mg 20''s',
  'Emerchemie',
  '150mg',
  'Capsule',
  'capsule',
  'Emerchemie',
  'Omastin Capsule',
  'Prescription Medicines',
  '4790000003814',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3703',
  'MEDICINE',
  'chelferron Capsules 30s',
  'Ceyoka',
  'Standard',
  'Capsule',
  'capsule',
  'Ceyoka',
  'chelferron Capsules',
  'Prescription Medicines',
  '4790000003703',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Ceyoka' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3333',
  'MEDICINE',
  'Ecovit (Vitamin E Capsules) S 200mg 100''s',
  'GLOBE(Tabrane)',
  '200mg',
  'Capsule',
  'capsule',
  'GLOBE(Tabrane)',
  'Ecovit',
  'Prescription Medicines',
  '4790000003333',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GLOBE(Tabrane)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3334',
  'MEDICINE',
  'Ecovit (Vitamin E Capsules) (Natural Vitamin E Capsules BP 400mg) 100''s',
  'GLOBE(Tabrane)',
  '400mg',
  'Capsule',
  'capsule',
  'GLOBE(Tabrane)',
  'Ecovit',
  'Prescription Medicines',
  '4790000003334',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GLOBE(Tabrane)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2838',
  'MEDICINE',
  'Multi vitamins & Multiminarals (Maxeval Capsules) 2*15''s',
  'Tranz pharma',
  'Standard',
  'Capsule',
  'capsule',
  'Tranz pharma',
  'Multi vitamins & Multiminarals',
  'Prescription Medicines',
  '4790000002838',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tranz pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2684',
  'MEDICINE',
  'Cefastar 500mg Capsules 6X10s',
  'Mankind Pharma Ltd',
  '500mg',
  'Capsule',
  'capsule',
  'Mankind Pharma Ltd',
  'Cefastar',
  'Prescription Medicines',
  '4790000002684',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  200,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Mankind Pharma Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-5008',
  'MEDICINE',
  'Phenycof Cough Syrup(GAMMA) 100ml',
  'Wettasinghe Pharmaceuticals',
  '100ml',
  'Syrup',
  'bottle',
  'Wettasinghe Pharmaceuticals',
  'Phenycof Cough Syrup',
  'Prescription Medicines',
  '4790000005008',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4878',
  'MEDICINE',
  'Cetirizine ( Zecet Oral Syrup ) 10+1 60Ml',
  'ABC Pharma',
  '60Ml',
  'Syrup',
  'bottle',
  'ABC Pharma',
  'Cetirizine',
  'Prescription Medicines',
  '4790000004878',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'ABC Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4755',
  'MEDICINE',
  'Amoxacillin Erox Dry Syrup 100ml',
  'KAMAZU PVT LTD',
  '100ml',
  'Syrup',
  'bottle',
  'KAMAZU PVT LTD',
  'Amoxacillin Erox Dry Syrup',
  'Prescription Medicines',
  '4790000004755',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'KAMAZU PVT LTD' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4765',
  'MEDICINE',
  'NE VITZ Syrup 200ml',
  'Neem Glow Pharmars',
  '200ml',
  'Syrup',
  'bottle',
  'Neem Glow Pharmars',
  'NE VITZ Syrup',
  'Prescription Medicines',
  '4790000004765',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Neem Glow Pharmars' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4704',
  'MEDICINE',
  'Multivitamin meneral syrup (Avitone) 200ml',
  'Avenierr Pharma',
  '200ml',
  'Syrup',
  'bottle',
  'Avenierr Pharma',
  'Multivitamin meneral syrup',
  'Prescription Medicines',
  '4790000004704',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Avenierr Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4627',
  'MEDICINE',
  'Alerid Syrup 60ml',
  'Cipla Pharmaceuticals',
  '60ml',
  'Syrup',
  'bottle',
  'Cipla Pharmaceuticals',
  'Alerid Syrup',
  'Prescription Medicines',
  '4790000004627',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4637',
  'MEDICINE',
  'Cephadex Dry Syrup 125mg/5ml',
  'Cipla Pharmaceuticals',
  '125mg',
  'Syrup',
  'bottle',
  'Cipla Pharmaceuticals',
  'Cephadex Dry Syrup',
  'Prescription Medicines',
  '4790000004637',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4427',
  'MEDICINE',
  'Lacon Syrup 120ml',
  'Generic Divison (Alaris)',
  '120ml',
  'Syrup',
  'bottle',
  'Generic Divison (Alaris)',
  'Lacon Syrup',
  'Prescription Medicines',
  '4790000004427',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Generic Divison (Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4439',
  'MEDICINE',
  'Aptocare Syrup 200ml',
  'Hi Care Pharma',
  '200ml',
  'Syrup',
  'bottle',
  'Hi Care Pharma',
  'Aptocare Syrup',
  'Prescription Medicines',
  '4790000004439',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hi Care Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4347',
  'MEDICINE',
  'Ace MB Syrup (vit Bcom,vit c,zinc,lycin) 100ml',
  'Cmps Pharma (Alaris)',
  '100ml',
  'Syrup',
  'bottle',
  'Cmps Pharma (Alaris)',
  'Ace MB Syrup',
  'Prescription Medicines',
  '4790000004347',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cmps Pharma (Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4348',
  'MEDICINE',
  'Ace MB Syrup(vitamin b, vita c, zinc, lysine 200ml',
  'Cmps Pharma (Alaris)',
  '200ml',
  'Syrup',
  'bottle',
  'Cmps Pharma (Alaris)',
  'Ace MB Syrup',
  'Prescription Medicines',
  '4790000004348',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cmps Pharma (Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4349',
  'MEDICINE',
  'Acemin syrup IH (multi vitamin) 200ml',
  'Cmps Pharma (Alaris)',
  '200ml',
  'Syrup',
  'bottle',
  'Cmps Pharma (Alaris)',
  'Acemin syrup IH',
  'Prescription Medicines',
  '4790000004349',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cmps Pharma (Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4350',
  'MEDICINE',
  'Acevita IH Syrup 100ml',
  'Cmps Pharma (Alaris)',
  '100ml',
  'Syrup',
  'bottle',
  'Cmps Pharma (Alaris)',
  'Acevita IH Syrup',
  'Prescription Medicines',
  '4790000004350',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cmps Pharma (Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4286',
  'MEDICINE',
  'Zevac Syrup 60ml',
  'Raptakos Brett &Co.Ltd',
  '60ml',
  'Syrup',
  'bottle',
  'Raptakos Brett &Co.Ltd',
  'Zevac Syrup',
  'Prescription Medicines',
  '4790000004286',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Raptakos Brett &Co.Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4243',
  'MEDICINE',
  'Co-Amoxyclav (Indclav)156mg 15ml Syrup 100ml',
  'Pharma Associates Generic',
  '156mg',
  'Syrup',
  'bottle',
  'Pharma Associates Generic',
  'Co',
  'Prescription Medicines',
  '4790000004243',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Associates Generic' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4104',
  'MEDICINE',
  'Mumfer Syrup (12+1) 150ml',
  'Sun Shine (Genaric)',
  '150ml',
  'Syrup',
  'bottle',
  'Sun Shine (Genaric)',
  'Mumfer Syrup',
  'Prescription Medicines',
  '4790000004104',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4113',
  'MEDICINE',
  'paracetamol sy ( axcel syrup) 120mg/5ml 1s''',
  'Sun Shine (Genaric)',
  '120mg',
  'Syrup',
  'bottle',
  'Sun Shine (Genaric)',
  'paracetamol sy',
  'Prescription Medicines',
  '4790000004113',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4118',
  'MEDICINE',
  'Sucrafil O Syrup .',
  'Sun Shine (Genaric)',
  'Standard',
  'Syrup',
  'bottle',
  'Sun Shine (Genaric)',
  'Sucrafil O Syrup .',
  'Prescription Medicines',
  '4790000004118',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4082',
  'MEDICINE',
  'Lactulose Syrup (Laxopeg) 100Ml',
  'Sun Shine (Genaric)',
  '100Ml',
  'Syrup',
  'bottle',
  'Sun Shine (Genaric)',
  'Lactulose Syrup',
  'Prescription Medicines',
  '4790000004082',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4092',
  'MEDICINE',
  'Megacid Syrup 200ml 1''s',
  'Sun Shine (Genaric)',
  '200ml',
  'Syrup',
  'bottle',
  'Sun Shine (Genaric)',
  'Megacid Syrup',
  'Prescription Medicines',
  '4790000004092',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4981',
  'MEDICINE',
  'Hydrocortisone cream (BELCO) 1% 15g',
  'Wettasinghe Pharmaceuticals',
  '1%',
  'Cream',
  'tube',
  'Wettasinghe Pharmaceuticals',
  'Hydrocortisone cream',
  'Prescription Medicines',
  '4790000004981',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4982',
  'MEDICINE',
  'Hydrocortisone Cream (Galentic) 1% 15g',
  'Wettasinghe Pharmaceuticals',
  '1%',
  'Cream',
  'tube',
  'Wettasinghe Pharmaceuticals',
  'Hydrocortisone Cream',
  'Prescription Medicines',
  '4790000004982',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4985',
  'MEDICINE',
  'Ketaconazole Cream 2% (Ketonem) 15g',
  'Wettasinghe Pharmaceuticals',
  '2%',
  'Cream',
  'tube',
  'Wettasinghe Pharmaceuticals',
  'Ketaconazole Cream',
  'Prescription Medicines',
  '4790000004985',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-5001',
  'MEDICINE',
  'Micanazole Nitrate Cream 2% (Agiop) 15g',
  'Wettasinghe Pharmaceuticals',
  '2%',
  'Cream',
  'tube',
  'Wettasinghe Pharmaceuticals',
  'Micanazole Nitrate Cream',
  'Prescription Medicines',
  '4790000005001',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4915',
  'MEDICINE',
  'Betamathasone Valerate Cream)(belco) 15g',
  'Wettasinghe Pharmaceuticals',
  '15g',
  'Cream',
  'tube',
  'Wettasinghe Pharmaceuticals',
  'Betamathasone Valerate Cream)',
  'Prescription Medicines',
  '4790000004915',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4822',
  'MEDICINE',
  'clobetasol clobit cream 15g 15g',
  'Soflogic(Part)',
  '15g',
  'Cream',
  'tube',
  'Soflogic(Part)',
  'clobetasol clobit cream',
  'Prescription Medicines',
  '4790000004822',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Soflogic(Part)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4773',
  'MEDICINE',
  'Clobetasol Cream (Clobetrex) 15g',
  'Pharma Health Lanka (PVT) LTD',
  '15g',
  'Cream',
  'tube',
  'Pharma Health Lanka (PVT) LTD',
  'Clobetasol Cream',
  'Prescription Medicines',
  '4790000004773',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Health Lanka (PVT) LTD' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4553',
  'MEDICINE',
  'Betamethasone cream (Betamap) 15g',
  'Axia ( PVT ) Ltd',
  '15g',
  'Cream',
  'tube',
  'Axia ( PVT ) Ltd',
  'Betamethasone cream',
  'Prescription Medicines',
  '4790000004553',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Axia ( PVT ) Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4232',
  'MEDICINE',
  'Betamethasone 0.1% (Betamet Cream) (10+1) 15g',
  'Pharma Associates Generic',
  '0.1%',
  'Cream',
  'tube',
  'Pharma Associates Generic',
  'Betamethasone',
  'Prescription Medicines',
  '4790000004232',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Associates Generic' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3230',
  'MEDICINE',
  'Betamathasone Dipropi(Beta-D)0.05%cream 15g',
  'Agio Pharmaceuticals(Dermo)',
  '0.05%',
  'Cream',
  'tube',
  'Agio Pharmaceuticals(Dermo)',
  'Betamathasone Dipropi',
  'Prescription Medicines',
  '4790000003230',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Agio Pharmaceuticals(Dermo)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3245',
  'MEDICINE',
  'Miconazole Nitra 2% (Micoson)cream 2% 15g',
  'Agio Pharmaceuticals(Dermo)',
  '2%',
  'Cream',
  'tube',
  'Agio Pharmaceuticals(Dermo)',
  'Miconazole Nitra',
  'Prescription Medicines',
  '4790000003245',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Agio Pharmaceuticals(Dermo)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3145',
  'MEDICINE',
  'Aciclovir (Aciherpin) 5% Cream (No Bonus) 5g',
  'Agio Pharmaceuticals',
  '5%',
  'Cream',
  'tube',
  'Agio Pharmaceuticals',
  'Aciclovir',
  'Prescription Medicines',
  '4790000003145',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Agio Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3108',
  'MEDICINE',
  'Permethrin Methrin Cream 15g',
  'Unijules Life Scienc(Softlogi)',
  '15g',
  'Cream',
  'tube',
  'Unijules Life Scienc(Softlogi)',
  'Permethrin Methrin Cream',
  'Prescription Medicines',
  '4790000003108',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unijules Life Scienc(Softlogi)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3062',
  'MEDICINE',
  'Clobetasol (Clobit Cream ) 15g',
  'Nem Laboratories(Softlogic)',
  '15g',
  'Cream',
  'tube',
  'Nem Laboratories(Softlogic)',
  'Clobetasol',
  'Prescription Medicines',
  '4790000003062',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Nem Laboratories(Softlogic)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3064',
  'MEDICINE',
  'Ketoconazole (Ketonem Cream) 15g',
  'Nem Laboratories(Softlogic)',
  '15g',
  'Cream',
  'tube',
  'Nem Laboratories(Softlogic)',
  'Ketoconazole',
  'Prescription Medicines',
  '4790000003064',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Nem Laboratories(Softlogic)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2720',
  'MEDICINE',
  'Emla 5% Cream 5x5g Prilocaine+Lignocaine',
  'Mitsubishi Tanabe',
  '5%',
  'Cream',
  'tube',
  'Mitsubishi Tanabe',
  'Emla',
  'Prescription Medicines',
  '4790000002720',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Mitsubishi Tanabe' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4955',
  'MEDICINE',
  'Diclofenac Gel (LINCO) 20g',
  'Wettasinghe Pharmaceuticals',
  '20g',
  'Gel',
  'tube',
  'Wettasinghe Pharmaceuticals',
  'Diclofenac Gel',
  'Prescription Medicines',
  '4790000004955',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4858',
  'MEDICINE',
  'Jonac Gel 30g Tube',
  'Hemas',
  '30g',
  'Gel',
  'tube',
  'Hemas',
  'Jonac Gel',
  'Skin Care',
  '4790000004858',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hemas' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4808',
  'MEDICINE',
  'Diclomol Gel 20g',
  'Robert Hall & Co.Ltd.',
  '20g',
  'Gel',
  'tube',
  'Robert Hall & Co.Ltd.',
  'Diclomol Gel',
  'Skin Care',
  '4790000004808',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Robert Hall & Co.Ltd.' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4784',
  'MEDICINE',
  'Restor Gel . 30g',
  'Pharma Health Lanka (PVT) LTD',
  '30g',
  'Gel',
  'tube',
  'Pharma Health Lanka (PVT) LTD',
  'Restor Gel .',
  'Skin Care',
  '4790000004784',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Health Lanka (PVT) LTD' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4619',
  'MEDICINE',
  'ASP Advance Gel 50g',
  'Appletree Pharma',
  '50g',
  'Gel',
  'tube',
  'Appletree Pharma',
  'ASP Advance Gel',
  'Skin Care',
  '4790000004619',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Appletree Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4620',
  'MEDICINE',
  'Asudor Gel 1''s 60ml',
  'Appletree Pharma',
  '60ml',
  'Gel',
  'tube',
  'Appletree Pharma',
  'Asudor Gel',
  'Skin Care',
  '4790000004620',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Appletree Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4570',
  'MEDICINE',
  'Nioderm Face gel 30g',
  'Axia ( PVT ) Ltd',
  '30g',
  'Gel',
  'tube',
  'Axia ( PVT ) Ltd',
  'Nioderm Face gel',
  'Skin Care',
  '4790000004570',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Axia ( PVT ) Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4579',
  'MEDICINE',
  'Rosiden Gel (Piroxicam Gel 5mg) 30g',
  'Axia ( PVT ) Ltd',
  '5mg',
  'Gel',
  'tube',
  'Axia ( PVT ) Ltd',
  'Rosiden Gel',
  'Skin Care',
  '4790000004579',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Axia ( PVT ) Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4455',
  'MEDICINE',
  'Lia aloe Face gel 100ml',
  'Hi Care Pharma',
  '100ml',
  'Gel',
  'tube',
  'Hi Care Pharma',
  'Lia aloe Face gel',
  'Skin Care',
  '4790000004455',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Hi Care Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4338',
  'MEDICINE',
  'KLY Lubricant Gel 42gr',
  'Unicure Remedies',
  '42g',
  'Gel',
  'tube',
  'Unicure Remedies',
  'KLY Lubricant Gel',
  'Skin Care',
  '4790000004338',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unicure Remedies' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4285',
  'MEDICINE',
  'Subsyde Gel 15g',
  'Raptakos Brett &Co.Ltd',
  '15g',
  'Gel',
  'tube',
  'Raptakos Brett &Co.Ltd',
  'Subsyde Gel',
  'Skin Care',
  '4790000004285',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Raptakos Brett &Co.Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4287',
  'MEDICINE',
  'Zytee Gel 10ml',
  'Raptakos Brett &Co.Ltd',
  '10ml',
  'Gel',
  'tube',
  'Raptakos Brett &Co.Ltd',
  'Zytee Gel',
  'Skin Care',
  '4790000004287',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Raptakos Brett &Co.Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4300',
  'MEDICINE',
  'Persol A.C 2.5 Gel 20g',
  'Wallace Pharmaceuticals Ltd.',
  '2.5 G',
  'Gel',
  'tube',
  'Wallace Pharmaceuticals Ltd.',
  'Persol A.C',
  'Skin Care',
  '4790000004300',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wallace Pharmaceuticals Ltd.' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4304',
  'MEDICINE',
  'Taiyu Silk sunscreen aqua gel 1s''',
  'Wallace Pharmaceuticals Ltd.',
  'Standard',
  'Gel',
  'tube',
  'Wallace Pharmaceuticals Ltd.',
  'Taiyu Silk sunscreen aqua gel',
  'Skin Care',
  '4790000004304',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wallace Pharmaceuticals Ltd.' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4314',
  'MEDICINE',
  'HOT AND COLD THERMOGEL 14*14cm 1s''',
  'KONIX',
  'Standard',
  'Gel',
  'tube',
  'KONIX',
  'HOT AND COLD THERMOGEL',
  'Skin Care',
  '4790000004314',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'KONIX' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4315',
  'MEDICINE',
  'HOT AND COLD thermogel 14*28cm 1s''',
  'KONIX',
  'Standard',
  'Gel',
  'tube',
  'KONIX',
  'HOT AND COLD thermogel',
  'Skin Care',
  '4790000004315',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'KONIX' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4247',
  'MEDICINE',
  'Diclofenec Gel (Diclolab Gel) 10+1, 50+10 30g',
  'Pharma Associates Generic',
  '30g',
  'Gel',
  'tube',
  'Pharma Associates Generic',
  'Diclofenec Gel',
  'Skin Care',
  '4790000004247',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Associates Generic' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4268',
  'MEDICINE',
  'topline gel 30g 1s''',
  'Pharma Associates Generic',
  '30g',
  'Gel',
  'tube',
  'Pharma Associates Generic',
  'topline gel',
  'Skin Care',
  '4790000004268',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pharma Associates Generic' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4131',
  'MEDICINE',
  'Winterpan Gel 30g .',
  'Sun Shine (Genaric)',
  '30g',
  'Gel',
  'tube',
  'Sun Shine (Genaric)',
  'Winterpan Gel',
  'Skin Care',
  '4790000004131',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4964',
  'MEDICINE',
  'Flutic 125 sal. Inhaler (Cipla) 120D',
  'Wettasinghe Pharmaceuticals',
  'Standard',
  'Inhaler',
  'puff',
  'Wettasinghe Pharmaceuticals',
  'Flutic',
  'Prescription Medicines',
  '4790000004964',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wettasinghe Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4646',
  'MEDICINE',
  'Foracort Inhaler DC 400mcg 120D',
  'Cipla Pharmaceuticals',
  '400mcg',
  'Inhaler',
  'puff',
  'Cipla Pharmaceuticals',
  'Foracort Inhaler DC',
  'Prescription Medicines',
  '4790000004646',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4655',
  'MEDICINE',
  'Seroflo Inhaler DC 250mg 1''s',
  'Cipla Pharmaceuticals',
  '250mg',
  'Inhaler',
  'puff',
  'Cipla Pharmaceuticals',
  'Seroflo Inhaler DC',
  'Prescription Medicines',
  '4790000004655',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4630',
  'MEDICINE',
  'Asthalin Inhaler DC 100mcg 200D',
  'Cipla Pharmaceuticals',
  '100mcg',
  'Inhaler',
  'puff',
  'Cipla Pharmaceuticals',
  'Asthalin Inhaler DC',
  'Prescription Medicines',
  '4790000004630',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4635',
  'MEDICINE',
  'Beclate Inhaler 100mcg 120D',
  'Cipla Pharmaceuticals',
  '100mcg',
  'Inhaler',
  'puff',
  'Cipla Pharmaceuticals',
  'Beclate Inhaler',
  'Prescription Medicines',
  '4790000004635',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla Pharmaceuticals' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3494',
  'MEDICINE',
  'Foracort Inhaler DC 100mcg 120D',
  'Cipla',
  '100mcg',
  'Inhaler',
  'puff',
  'Cipla',
  'Foracort Inhaler DC',
  'Prescription Medicines',
  '4790000003494',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3495',
  'MEDICINE',
  'Ipravent Inhaler 20mcg 200D',
  'Cipla',
  '20mcg',
  'Inhaler',
  'puff',
  'Cipla',
  'Ipravent Inhaler',
  'Prescription Medicines',
  '4790000003495',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3507',
  'MEDICINE',
  'Seroflo Inhaler DC 125mcg 120D 1''s',
  'Cipla',
  '125mcg',
  'Inhaler',
  'puff',
  'Cipla',
  'Seroflo Inhaler DC',
  'Prescription Medicines',
  '4790000003507',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3508',
  'MEDICINE',
  'Seroflo Inhaler DC 250mcg 120D 1''s',
  'Cipla',
  '250mcg',
  'Inhaler',
  'puff',
  'Cipla',
  'Seroflo Inhaler DC',
  'Prescription Medicines',
  '4790000003508',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3510',
  'MEDICINE',
  'Tiova Inhaler 1''s',
  'Cipla',
  'Standard',
  'Inhaler',
  'puff',
  'Cipla',
  'Tiova Inhaler',
  'Prescription Medicines',
  '4790000003510',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3470',
  'MEDICINE',
  'Asthalin Inhaler 100mcg 1''s',
  'Cipla',
  '100mcg',
  'Inhaler',
  'puff',
  'Cipla',
  'Asthalin Inhaler',
  'Prescription Medicines',
  '4790000003470',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3481',
  'MEDICINE',
  'Beclate Inhaler 100Mcg 200D-1''s',
  'Cipla',
  '100Mcg',
  'Inhaler',
  'puff',
  'Cipla',
  'Beclate Inhaler',
  'Prescription Medicines',
  '4790000003481',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Cipla' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3084',
  'MEDICINE',
  'Salmeterol+Fluticasone (Flusal 250mcg) 1inhaler',
  'Midascare Pharma (Softlog)',
  '250mcg',
  'Inhaler',
  'puff',
  'Midascare Pharma (Softlog)',
  'Salmeterol+Fluticasone',
  'Prescription Medicines',
  '4790000003084',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Midascare Pharma (Softlog)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3085',
  'MEDICINE',
  'Salmeterol+Fluticasone (Flusal 125mcg) 1inhaler',
  'Midascare Pharma (Softlog)',
  '125mcg',
  'Inhaler',
  'puff',
  'Midascare Pharma (Softlog)',
  'Salmeterol+Fluticasone',
  'Prescription Medicines',
  '4790000003085',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Midascare Pharma (Softlog)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2594',
  'MEDICINE',
  'Saltrol Inhaler 125mcg-120M/DOSES',
  'Getz Pharma',
  '125mcg',
  'Inhaler',
  'puff',
  'Getz Pharma',
  'Saltrol Inhaler',
  'Prescription Medicines',
  '4790000002594',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Getz Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2595',
  'MEDICINE',
  'Saltrol Inhaler 250mcg-120/DOSES',
  'Getz Pharma',
  '250mcg',
  'Inhaler',
  'puff',
  'Getz Pharma',
  'Saltrol Inhaler',
  'Prescription Medicines',
  '4790000002595',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  120.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Getz Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-2059',
  'MEDICINE',
  'VICKS INHALER TWIN (72)-NOW @280/=',
  'Vicks',
  'Standard',
  'Inhaler',
  'puff',
  'Vicks',
  'VICKS INHALER TWIN',
  'Personal Care',
  '4790000002059',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  266.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1793',
  'MEDICINE',
  'VICKS JUMBO INHALER 0.5ML (600)-280/=',
  'Vicks',
  '0.5ML',
  'Inhaler',
  'puff',
  'Vicks',
  'VICKS JUMBO INHALER',
  'Personal Care',
  '4790000001793',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  266.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-1794',
  'MEDICINE',
  'VICKS INHALER TWIN (72)-490/=',
  'Vicks',
  'Standard',
  'Inhaler',
  'puff',
  'Vicks',
  'VICKS INHALER TWIN',
  'Personal Care',
  '4790000001794',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  465.50,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Vicks' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4538',
  'MEDICINE',
  'Eryko suspension 100ml erythromycin 100ml',
  'ZIFAM PHARMA(Alaris)',
  '100ml',
  'Oral suspension',
  'piece',
  'ZIFAM PHARMA(Alaris)',
  'Eryko suspension',
  'Prescription Medicines',
  '4790000004538',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'ZIFAM PHARMA(Alaris)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4291',
  'MEDICINE',
  'Diovol Forte Suspension 170ml',
  'Wallace Pharmaceuticals Ltd.',
  '170ml',
  'Oral suspension',
  'piece',
  'Wallace Pharmaceuticals Ltd.',
  'Diovol Forte Suspension',
  'Prescription Medicines',
  '4790000004291',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Wallace Pharmaceuticals Ltd.' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4274',
  'MEDICINE',
  'Catoxymag N Suspension 200ml',
  'Raptakos Brett &Co.Ltd',
  '200ml',
  'Oral suspension',
  'piece',
  'Raptakos Brett &Co.Ltd',
  'Catoxymag N Suspension',
  'Prescription Medicines',
  '4790000004274',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Raptakos Brett &Co.Ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4192',
  'MEDICINE',
  'Milcef Suspension 70ml',
  'Madras Pharmaceutica (Branded)',
  '70ml',
  'Oral suspension',
  'piece',
  'Madras Pharmaceutica (Branded)',
  'Milcef Suspension',
  'Prescription Medicines',
  '4790000004192',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Madras Pharmaceutica (Branded)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4216',
  'MEDICINE',
  'Azithromycin (Azinam Suspension) 15Ml',
  'A M N Life',
  '15Ml',
  'Oral suspension',
  'piece',
  'A M N Life',
  'Azithromycin',
  'Prescription Medicines',
  '4790000004216',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'A M N Life' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4224',
  'MEDICINE',
  'Co-Amoxyclav (Avam)-156 suspension 100Ml',
  'A M N Life',
  '100Ml',
  'Oral suspension',
  'piece',
  'A M N Life',
  'Co',
  'Prescription Medicines',
  '4790000004224',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'A M N Life' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4117',
  'MEDICINE',
  'Sucrafil Suspension 200ml',
  'Sun Shine (Genaric)',
  '200ml',
  'Oral suspension',
  'piece',
  'Sun Shine (Genaric)',
  'Sucrafil Suspension',
  'Prescription Medicines',
  '4790000004117',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Sun Shine (Genaric)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4004',
  'MEDICINE',
  'Cool gel (Alumina, mag & sim suspension) 100ml',
  'tranz',
  '100ml',
  'Gel',
  'tube',
  'tranz',
  'Cool gel',
  'Skin Care',
  '4790000004004',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'tranz' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-4005',
  'MEDICINE',
  'Cool gel Suspension 200ml',
  'tranz',
  '200ml',
  'Gel',
  'tube',
  'tranz',
  'Cool gel Suspension',
  'Skin Care',
  '4790000004005',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  20,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Personal & Skin Care' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'tranz' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3956',
  'MEDICINE',
  'Motilium SUSPENSION 100ml',
  'Pettah Pharmacy (Jansen))',
  '100ml',
  'Oral suspension',
  'piece',
  'Pettah Pharmacy (Jansen))',
  'Motilium SUSPENSION',
  'Prescription Medicines',
  '4790000003956',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pettah Pharmacy (Jansen))' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3962',
  'MEDICINE',
  'Vermox Suspension 30ml',
  'Pettah Pharmacy (Jansen))',
  '30ml',
  'Oral suspension',
  'piece',
  'Pettah Pharmacy (Jansen))',
  'Vermox Suspension',
  'Prescription Medicines',
  '4790000003962',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Pettah Pharmacy (Jansen))' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3912',
  'MEDICINE',
  'Metrogyl Suspension 100ml',
  'George Steuart Health Pvt ltd',
  '100ml',
  'Oral suspension',
  'piece',
  'George Steuart Health Pvt ltd',
  'Metrogyl Suspension',
  'Prescription Medicines',
  '4790000003912',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'George Steuart Health Pvt ltd' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3837',
  'MEDICINE',
  'Diovol Suspension . 170ml',
  'Emer Pharma',
  '170ml',
  'Oral suspension',
  'piece',
  'Emer Pharma',
  'Diovol Suspension .',
  'Prescription Medicines',
  '4790000003837',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emer Pharma' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3804',
  'MEDICINE',
  'Lotepred T suspension 5ml',
  'Emerchemie',
  '5ml',
  'Oral suspension',
  'piece',
  'Emerchemie',
  'Lotepred T suspension',
  'Prescription Medicines',
  '4790000003804',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3810',
  'MEDICINE',
  'Natasan Ophthlmic Suspension 5ml',
  'Emerchemie',
  '5ml',
  'Oral suspension',
  'piece',
  'Emerchemie',
  'Natasan Ophthlmic Suspension',
  'Prescription Medicines',
  '4790000003810',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3811',
  'MEDICINE',
  'Nepac 0.1% Ophthalmic Suspension 5ml',
  'Emerchemie',
  '0.1%',
  'Oral suspension',
  'piece',
  'Emerchemie',
  'Nepac',
  'Prescription Medicines',
  '4790000003811',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3825',
  'MEDICINE',
  'Zocef Oral Suspension 70ml',
  'Emerchemie',
  '70ml',
  'Oral suspension',
  'piece',
  'Emerchemie',
  'Zocef Oral Suspension',
  'Prescription Medicines',
  '4790000003825',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Emerchemie' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3436',
  'MEDICINE',
  'Pyrantin Suspension 10ml',
  'ASTRON',
  '10ml',
  'Oral suspension',
  'piece',
  'ASTRON',
  'Pyrantin Suspension',
  'Prescription Medicines',
  '4790000003436',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'ASTRON' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3335',
  'MEDICINE',
  'Fexona Suspension 60ml',
  'GLOBE(Tabrane)',
  '60ml',
  'Oral suspension',
  'piece',
  'GLOBE(Tabrane)',
  'Fexona Suspension',
  'Prescription Medicines',
  '4790000003335',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  35.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GLOBE(Tabrane)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, rxnorm_cui, pubchem_cid, storage_instructions, minimum_age_years, maximum_age_years, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
VALUES (
  'KP-3336',
  'MEDICINE',
  'Finemox Suspension 100ml',
  'GLOBE(Tabrane)',
  '100ml',
  'Oral suspension',
  'piece',
  'GLOBE(Tabrane)',
  'Finemox Suspension',
  'Prescription Medicines',
  '4790000003336',
  NULL,
  NULL,
  'Store below 25°C in a dry place protected from light.',
  NULL,
  NULL,
  450.00,
  10,
  1,
  1,
  (SELECT id FROM categories WHERE name = 'Prescription Medicines' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GLOBE(Tabrane)' LIMIT 1),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  generic_name = VALUES(generic_name),
  brand_name = VALUES(brand_name),
  selling_price = VALUES(selling_price),
  reorder_level = VALUES(reorder_level),
  active = 1;

-- 5. Batches & Initial Stock Movements

-- Batch & Stock for MED-PANADOL-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'PAN-2601-A',
  5000,
  5000,
  0,
  2.80,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'PEX-2602-B',
  2400,
  2400,
  0,
  4.80,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'PSY-2603-C',
  180,
  180,
  0,
  260.00,
  DATE_ADD(CURDATE(), INTERVAL 540 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BRU-2604-D',
  1500,
  1500,
  0,
  9.20,
  DATE_ADD(CURDATE(), INTERVAL 600 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'VOL-2605-E',
  800,
  800,
  0,
  18.50,
  DATE_ADD(CURDATE(), INTERVAL 520 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'PON-2606-F',
  600,
  600,
  0,
  21.00,
  DATE_ADD(CURDATE(), INTERVAL 640 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'AUG-2607-G',
  1200,
  1200,
  0,
  115.00,
  DATE_ADD(CURDATE(), INTERVAL 480 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'AMX-2608-H',
  2500,
  2500,
  0,
  14.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ZIT-2609-I',
  400,
  400,
  0,
  145.00,
  DATE_ADD(CURDATE(), INTERVAL 610 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ZIN-2610-J',
  350,
  350,
  0,
  198.00,
  DATE_ADD(CURDATE(), INTERVAL 490 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Emerchemie NB (Ceylon) Limited' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CIF-2611-K',
  600,
  600,
  0,
  22.50,
  DATE_ADD(CURDATE(), INTERVAL 560 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'FLA-2612-L',
  1200,
  1200,
  0,
  7.50,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'NOR-2613-M',
  1000,
  1000,
  0,
  32.00,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'COZ-2614-N',
  900,
  900,
  0,
  41.00,
  DATE_ADD(CURDATE(), INTERVAL 650 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'LIP-2615-O',
  750,
  750,
  0,
  64.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'PLA-2616-P',
  500,
  500,
  0,
  75.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CAR-2617-Q',
  1800,
  1800,
  0,
  5.20,
  DATE_ADD(CURDATE(), INTERVAL 690 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'GLU-2618-R',
  3000,
  3000,
  0,
  11.50,
  DATE_ADD(CURDATE(), INTERVAL 710 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'DIA-2619-S',
  1200,
  1200,
  0,
  28.00,
  DATE_ADD(CURDATE(), INTERVAL 530 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'JAN-2620-T',
  300,
  300,
  0,
  170.00,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ELT-2621-U',
  1500,
  1500,
  0,
  6.00,
  DATE_ADD(CURDATE(), INTERVAL 500 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'NEX-2622-V',
  900,
  900,
  0,
  56.00,
  DATE_ADD(CURDATE(), INTERVAL 660 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'LOS-2623-W',
  2000,
  2000,
  0,
  15.00,
  DATE_ADD(CURDATE(), INTERVAL 550 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'MOT-2624-X',
  1200,
  1200,
  0,
  10.20,
  DATE_ADD(CURDATE(), INTERVAL 610 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'GAV-2625-Y',
  80,
  80,
  0,
  1020.00,
  DATE_ADD(CURDATE(), INTERVAL 480 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'DUP-2626-Z',
  60,
  60,
  0,
  810.00,
  DATE_ADD(CURDATE(), INTERVAL 570 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'VEN-2627-A',
  120,
  120,
  0,
  880.00,
  DATE_ADD(CURDATE(), INTERVAL 590 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SER-2628-B',
  40,
  40,
  0,
  3500.00,
  DATE_ADD(CURDATE(), INTERVAL 450 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ZYR-2629-C',
  1500,
  1500,
  0,
  23.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SIN-2630-D',
  500,
  500,
  0,
  92.00,
  DATE_ADD(CURDATE(), INTERVAL 630 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BET-2631-E',
  150,
  150,
  0,
  375.00,
  DATE_ADD(CURDATE(), INTERVAL 520 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CAN-2632-F',
  120,
  120,
  0,
  470.00,
  DATE_ADD(CURDATE(), INTERVAL 640 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BAC-2633-G',
  80,
  80,
  0,
  790.00,
  DATE_ADD(CURDATE(), INTERVAL 530 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'NEU-2634-H',
  2000,
  2000,
  0,
  25.50,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CEC-2635-I',
  2500,
  2500,
  0,
  7.80,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CAL-2636-J',
  1200,
  1200,
  0,
  30.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'DET-2637-K',
  80,
  80,
  0,
  720.00,
  DATE_ADD(CURDATE(), INTERVAL 800 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  '3MM-2638-L',
  150,
  150,
  0,
  230.00,
  DATE_ADD(CURDATE(), INTERVAL 900 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BAN-2639-M',
  120,
  120,
  0,
  285.00,
  DATE_ADD(CURDATE(), INTERVAL 850 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BET-2640-N',
  90,
  90,
  0,
  450.00,
  DATE_ADD(CURDATE(), INTERVAL 550 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SYR-2641-O',
  1000,
  1000,
  0,
  19.00,
  DATE_ADD(CURDATE(), INTERVAL 950 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Ansell Lanka (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'GLV-2642-P',
  60,
  60,
  0,
  1320.00,
  DATE_ADD(CURDATE(), INTERVAL 900 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'MSK-2643-Q',
  100,
  100,
  0,
  420.00,
  DATE_ADD(CURDATE(), INTERVAL 920 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'COT-2644-R',
  160,
  160,
  0,
  180.00,
  DATE_ADD(CURDATE(), INTERVAL 990 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'OMR-2645-S',
  25,
  25,
  0,
  10800.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ACC-2646-T',
  30,
  30,
  0,
  4900.00,
  DATE_ADD(CURDATE(), INTERVAL 1200 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ACS-2647-U',
  80,
  80,
  0,
  3100.00,
  DATE_ADD(CURDATE(), INTERVAL 510 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BEU-2648-V',
  40,
  40,
  0,
  980.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ENS-2649-W',
  35,
  35,
  0,
  6200.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'GLC-2650-X',
  30,
  30,
  0,
  6600.00,
  DATE_ADD(CURDATE(), INTERVAL 610 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ORS-2651-Y',
  120,
  120,
  0,
  300.00,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'LIF-2652-Z',
  150,
  150,
  0,
  260.00,
  DATE_ADD(CURDATE(), INTERVAL 750 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KOT-2653-AA',
  90,
  90,
  0,
  390.00,
  DATE_ADD(CURDATE(), INTERVAL 850 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SEN-2654-AB',
  110,
  110,
  0,
  520.00,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
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
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'PAM-2655-AC',
  40,
  40,
  0,
  3650.00,
  DATE_ADD(CURDATE(), INTERVAL 950 DAY),
  NOW(),
  0
FROM products p
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-PAMPERS-MIDI-48' AND b.batch_number = 'PAM-2655-AC'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PANADOL-ACT
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ACT-2601-A',
  3000,
  3000,
  0,
  5.50,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-PANADOL-ACT'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PANADOL-ACT' AND b.batch_number = 'ACT-2601-A'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-VOLTAREN-GEL
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'VOL-2602-B',
  80,
  80,
  0,
  1180.00,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-VOLTAREN-GEL'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-VOLTAREN-GEL' AND b.batch_number = 'VOL-2602-B'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ARCOXIA-90
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ARC-2603-C',
  500,
  500,
  0,
  135.00,
  DATE_ADD(CURDATE(), INTERVAL 650 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-ARCOXIA-90'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ARCOXIA-90' AND b.batch_number = 'ARC-2603-C'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-TRAMAL-50
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'TRM-2604-D',
  600,
  600,
  0,
  18.00,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-TRAMAL-50'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-TRAMAL-50' AND b.batch_number = 'TRM-2604-D'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CONCOR-5
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CON-2605-E',
  1000,
  1000,
  0,
  31.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-CONCOR-5'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CONCOR-5' AND b.batch_number = 'CON-2605-E'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-MICARDIS-40
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'MIC-2606-F',
  800,
  800,
  0,
  52.00,
  DATE_ADD(CURDATE(), INTERVAL 690 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-MICARDIS-40'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-MICARDIS-40' AND b.batch_number = 'MIC-2606-F'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-LASIX-40
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'LAS-2607-G',
  1500,
  1500,
  0,
  4.80,
  DATE_ADD(CURDATE(), INTERVAL 640 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-LASIX-40'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-LASIX-40' AND b.batch_number = 'LAS-2607-G'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-FORXIGA-10
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'FOR-2608-H',
  400,
  400,
  0,
  155.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-FORXIGA-10'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-FORXIGA-10' AND b.batch_number = 'FOR-2608-H'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-AMARYL-2
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'AMA-2609-I',
  1200,
  1200,
  0,
  21.00,
  DATE_ADD(CURDATE(), INTERVAL 600 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-AMARYL-2'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-AMARYL-2' AND b.batch_number = 'AMA-2609-I'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-DIFLUCAN-150
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'DIF-2610-J',
  250,
  250,
  0,
  220.00,
  DATE_ADD(CURDATE(), INTERVAL 710 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-DIFLUCAN-150'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-DIFLUCAN-150' AND b.batch_number = 'DIF-2610-J'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-DOXY-100
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'DOX-2611-K',
  1200,
  1200,
  0,
  11.00,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-DOXY-100'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-DOXY-100' AND b.batch_number = 'DOX-2611-K'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-KLARICID-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KLA-2612-L',
  400,
  400,
  0,
  180.00,
  DATE_ADD(CURDATE(), INTERVAL 640 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-KLARICID-500'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-KLARICID-500' AND b.batch_number = 'KLA-2612-L'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ENO-LEMON-5G
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ENO-2613-M',
  800,
  800,
  0,
  45.00,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-ENO-LEMON-5G'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ENO-LEMON-5G' AND b.batch_number = 'ENO-2613-M'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-BUSCOPAN-10
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'BUS-2614-N',
  900,
  900,
  0,
  25.00,
  DATE_ADD(CURDATE(), INTERVAL 660 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-BUSCOPAN-10'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-BUSCOPAN-10' AND b.batch_number = 'BUS-2614-N'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-IMODIUM-2
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'IMO-2615-O',
  1000,
  1000,
  0,
  14.00,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-IMODIUM-2'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-IMODIUM-2' AND b.batch_number = 'IMO-2615-O'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-SYMBICORT-160
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SYM-2616-P',
  50,
  50,
  0,
  3800.00,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-SYMBICORT-160'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-SYMBICORT-160' AND b.batch_number = 'SYM-2616-P'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ALLEGRA-120
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ALL-2617-Q',
  800,
  800,
  0,
  65.00,
  DATE_ADD(CURDATE(), INTERVAL 670 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-ALLEGRA-120'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ALLEGRA-120' AND b.batch_number = 'ALL-2617-Q'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-OTRIVIN-01
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'OTR-2618-R',
  180,
  180,
  0,
  290.00,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-OTRIVIN-01'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-OTRIVIN-01' AND b.batch_number = 'OTR-2618-R'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-STREPSILS-HL
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'STR-2619-S',
  150,
  150,
  0,
  480.00,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-STREPSILS-HL'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-STREPSILS-HL' AND b.batch_number = 'STR-2619-S'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-TEARS-NATURALE
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'TEA-2620-T',
  100,
  100,
  0,
  690.00,
  DATE_ADD(CURDATE(), INTERVAL 550 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-TEARS-NATURALE'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-TEARS-NATURALE' AND b.batch_number = 'TEA-2620-T'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CHLORAM-EYE
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CHL-2621-U',
  120,
  120,
  0,
  210.00,
  DATE_ADD(CURDATE(), INTERVAL 450 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-CHLORAM-EYE'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CHLORAM-EYE' AND b.batch_number = 'CHL-2621-U'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-OMRON-HEM7120
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'OMR-2622-V',
  30,
  30,
  0,
  9800.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-OMRON-HEM7120'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-OMRON-HEM7120' AND b.batch_number = 'OMR-2622-V'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-PULSE-OXIMETER
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'OXI-2623-W',
  50,
  50,
  0,
  2650.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-PULSE-OXIMETER'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-PULSE-OXIMETER' AND b.batch_number = 'OXI-2623-W'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-OMRON-NEB-C28
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'NEB-2624-X',
  15,
  15,
  0,
  14800.00,
  DATE_ADD(CURDATE(), INTERVAL 1800 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-OMRON-NEB-C28'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-OMRON-NEB-C28' AND b.batch_number = 'NEB-2624-X'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-AEROCHAMBER-ADULT
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'AER-2625-Y',
  40,
  40,
  0,
  2950.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-AEROCHAMBER-ADULT'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-AEROCHAMBER-ADULT' AND b.batch_number = 'AER-2625-Y'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-SAVLON-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SAV-2626-Z',
  90,
  90,
  0,
  620.00,
  DATE_ADD(CURDATE(), INTERVAL 850 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-SAVLON-500'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-SAVLON-500' AND b.batch_number = 'SAV-2626-Z'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-SURG-SPIRIT-500
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SPI-2627-AA',
  150,
  150,
  0,
  320.00,
  DATE_ADD(CURDATE(), INTERVAL 950 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-SURG-SPIRIT-500'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-SURG-SPIRIT-500' AND b.batch_number = 'SPI-2627-AA'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-GAUZE-10X10
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'George Steuart Health (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'GAU-2628-AB',
  400,
  400,
  0,
  75.00,
  DATE_ADD(CURDATE(), INTERVAL 1100 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-GAUZE-10X10'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-GAUZE-10X10' AND b.batch_number = 'GAU-2628-AB'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-CREPE-10CM
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'CRE-2629-AC',
  120,
  120,
  0,
  240.00,
  DATE_ADD(CURDATE(), INTERVAL 1400 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-CREPE-10CM'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-CREPE-10CM' AND b.batch_number = 'CRE-2629-AC'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-HOT-WATER-BOTTLE
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'HWB-2630-AD',
  45,
  45,
  0,
  820.00,
  DATE_ADD(CURDATE(), INTERVAL 1800 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-HOT-WATER-BOTTLE'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-HOT-WATER-BOTTLE' AND b.batch_number = 'HWB-2630-AD'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-FRIENDS-ADULT-M
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'FRI-2631-AE',
  75,
  75,
  0,
  1850.00,
  DATE_ADD(CURDATE(), INTERVAL 1100 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-FRIENDS-ADULT-M'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-FRIENDS-ADULT-M' AND b.batch_number = 'FRI-2631-AE'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-TENA-SLIP-L
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'TEN-2632-AF',
  50,
  50,
  0,
  2450.00,
  DATE_ADD(CURDATE(), INTERVAL 1100 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-TENA-SLIP-L'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-TENA-SLIP-L' AND b.batch_number = 'TEN-2632-AF'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for RET-SUSTAGEN-VAN-400
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'SUS-2633-AG',
  60,
  60,
  0,
  3250.00,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'RET-SUSTAGEN-VAN-400'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'RET-SUSTAGEN-VAN-400' AND b.batch_number = 'SUS-2633-AG'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PARACETAMOL-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-PAN-2601',
  2500,
  2500,
  0,
  1.50,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-PARACETAMOL-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PARACETAMOL-ML' AND b.batch_number = 'ML-PAN-2601'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-IBUPROFEN-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-IBU-2602',
  2000,
  2000,
  0,
  1.80,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-IBUPROFEN-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-IBUPROFEN-ML' AND b.batch_number = 'ML-IBU-2602'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-AMOXICILLIN-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-AMX-2603',
  2500,
  2500,
  0,
  2.20,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-AMOXICILLIN-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-AMOXICILLIN-ML' AND b.batch_number = 'ML-AMX-2603'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-AUGMENTIN-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-AUG-2604',
  1500,
  1500,
  0,
  4.50,
  DATE_ADD(CURDATE(), INTERVAL 600 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-AUGMENTIN-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-AUGMENTIN-ML' AND b.batch_number = 'ML-AUG-2604'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CEFUROXIME-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-CEF-2605',
  1200,
  1200,
  0,
  5.60,
  DATE_ADD(CURDATE(), INTERVAL 580 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-CEFUROXIME-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CEFUROXIME-ML' AND b.batch_number = 'ML-CEF-2605'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-AZITHROMYCIN-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-AZI-2606',
  1000,
  1000,
  0,
  4.80,
  DATE_ADD(CURDATE(), INTERVAL 650 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-AZITHROMYCIN-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-AZITHROMYCIN-ML' AND b.batch_number = 'ML-AZI-2606'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-METRONIDAZOLE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-MET-2607',
  2000,
  2000,
  0,
  1.70,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-METRONIDAZOLE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-METRONIDAZOLE-ML' AND b.batch_number = 'ML-MET-2607'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CETIRIZINE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-CET-2608',
  1800,
  1800,
  0,
  2.60,
  DATE_ADD(CURDATE(), INTERVAL 710 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-CETIRIZINE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CETIRIZINE-ML' AND b.batch_number = 'ML-CET-2608'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-LORATADINE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-LOR-2609',
  1500,
  1500,
  0,
  2.40,
  DATE_ADD(CURDATE(), INTERVAL 690 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-LORATADINE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-LORATADINE-ML' AND b.batch_number = 'ML-LOR-2609'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-SALBUTAMOL-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-SAL-2610',
  2000,
  2000,
  0,
  1.50,
  DATE_ADD(CURDATE(), INTERVAL 680 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-SALBUTAMOL-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-SALBUTAMOL-ML' AND b.batch_number = 'ML-SAL-2610'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-CHLORPHEN-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-CHL-2611',
  2500,
  2500,
  0,
  1.10,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-CHLORPHEN-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-CHLORPHEN-ML' AND b.batch_number = 'ML-CHL-2611'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-DIPHENHYD-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-DIP-2612',
  2000,
  2000,
  0,
  1.30,
  DATE_ADD(CURDATE(), INTERVAL 700 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-DIPHENHYD-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-DIPHENHYD-ML' AND b.batch_number = 'ML-DIP-2612'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-BROMHEXINE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-BRO-2613',
  1800,
  1800,
  0,
  1.60,
  DATE_ADD(CURDATE(), INTERVAL 710 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-BROMHEXINE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-BROMHEXINE-ML' AND b.batch_number = 'ML-BRO-2613'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-PREDNISOLONE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-PRE-2614',
  1200,
  1200,
  0,
  2.80,
  DATE_ADD(CURDATE(), INTERVAL 620 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-PREDNISOLONE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-PREDNISOLONE-ML' AND b.batch_number = 'ML-PRE-2614'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-DOMPERIDONE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-DOM-2615',
  1500,
  1500,
  0,
  2.30,
  DATE_ADD(CURDATE(), INTERVAL 660 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-DOMPERIDONE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-DOMPERIDONE-ML' AND b.batch_number = 'ML-DOM-2615'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ONDANSETRON-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Hemas Pharmaceuticals (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-OND-2616',
  1000,
  1000,
  0,
  4.90,
  DATE_ADD(CURDATE(), INTERVAL 600 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-ONDANSETRON-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ONDANSETRON-ML' AND b.batch_number = 'ML-OND-2616'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-LACTULOSE-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Sunshine Healthcare Lanka Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-LAC-2617',
  3500,
  3500,
  0,
  2.20,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-LACTULOSE-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-LACTULOSE-ML' AND b.batch_number = 'ML-LAC-2617'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ANTACID-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-ANT-2618',
  4000,
  4000,
  0,
  1.20,
  DATE_ADD(CURDATE(), INTERVAL 730 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-ANTACID-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ANTACID-ML' AND b.batch_number = 'ML-ANT-2618'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-MULTIVIT-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'A. Baur & Co. (Pvt) Ltd' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-MUL-2619',
  1500,
  1500,
  0,
  1.60,
  DATE_ADD(CURDATE(), INTERVAL 690 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-MULTIVIT-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-MULTIVIT-ML' AND b.batch_number = 'ML-MUL-2619'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for MED-ZINC-ML
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'State Pharmaceuticals Corporation (SPC)' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'ML-ZIN-2620',
  1800,
  1800,
  0,
  1.30,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'MED-ZINC-ML'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'MED-ZINC-ML' AND b.batch_number = 'ML-ZIN-2620'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4976
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4976-B01',
  30,
  30,
  0,
  121.63,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4976'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4976' AND b.batch_number = 'KP-4976-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4977
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4977-B01',
  30,
  30,
  0,
  510.07,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4977'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4977' AND b.batch_number = 'KP-4977-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4530
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4530-B01',
  60,
  60,
  0,
  276.27,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4530'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4530' AND b.batch_number = 'KP-4530-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4306
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4306-B01',
  30,
  30,
  0,
  2650.63,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4306'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4306' AND b.batch_number = 'KP-4306-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4307
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4307-B01',
  30,
  30,
  0,
  3092.65,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4307'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4307' AND b.batch_number = 'KP-4307-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4308
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4308-B01',
  30,
  30,
  0,
  3980.52,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4308'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4308' AND b.batch_number = 'KP-4308-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4309
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4309-B01',
  30,
  30,
  0,
  5952.05,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4309'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4309' AND b.batch_number = 'KP-4309-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4310
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4310-B01',
  30,
  30,
  0,
  2892.81,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4310'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4310' AND b.batch_number = 'KP-4310-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4311
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4311-B01',
  30,
  30,
  0,
  3956.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4311'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4311' AND b.batch_number = 'KP-4311-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4312
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4312-B01',
  30,
  30,
  0,
  2626.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4312'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4312' AND b.batch_number = 'KP-4312-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4313
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4313-B01',
  30,
  30,
  0,
  3897.17,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4313'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4313' AND b.batch_number = 'KP-4313-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4169
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4169-B01',
  30,
  30,
  0,
  448.87,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4169'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4169' AND b.batch_number = 'KP-4169-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3930
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3930-B01',
  30,
  30,
  0,
  2308.02,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3930'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3930' AND b.batch_number = 'KP-3930-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3441
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3441-B01',
  30,
  30,
  0,
  4349.14,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3441'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3441' AND b.batch_number = 'KP-3441-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3442
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3442-B01',
  30,
  30,
  0,
  3629.16,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3442'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3442' AND b.batch_number = 'KP-3442-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3443
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3443-B01',
  30,
  30,
  0,
  2418.58,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3443'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3443' AND b.batch_number = 'KP-3443-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3444
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3444-B01',
  30,
  30,
  0,
  2347.02,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3444'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3444' AND b.batch_number = 'KP-3444-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2828
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2828-B01',
  30,
  30,
  0,
  3657.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2828'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2828' AND b.batch_number = 'KP-2828-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2829
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2829-B01',
  30,
  30,
  0,
  3315.02,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2829'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2829' AND b.batch_number = 'KP-2829-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2238
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2238-B01',
  30,
  30,
  0,
  897.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2238'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2238' AND b.batch_number = 'KP-2238-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2239
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2239-B01',
  30,
  30,
  0,
  864.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2239'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2239' AND b.batch_number = 'KP-2239-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2240
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2240-B01',
  30,
  30,
  0,
  1695.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2240'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2240' AND b.batch_number = 'KP-2240-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2241
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2241-B01',
  30,
  30,
  0,
  1396.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2241'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2241' AND b.batch_number = 'KP-2241-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2242
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2242-B01',
  30,
  30,
  0,
  2992.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2242'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2242' AND b.batch_number = 'KP-2242-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2243
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2243-B01',
  30,
  30,
  0,
  2892.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2243'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2243' AND b.batch_number = 'KP-2243-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2244
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2244-B01',
  30,
  30,
  0,
  5120.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2244'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2244' AND b.batch_number = 'KP-2244-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2245
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2245-B01',
  30,
  30,
  0,
  4655.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2245'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2245' AND b.batch_number = 'KP-2245-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2246
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2246-B01',
  30,
  30,
  0,
  3657.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2246'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2246' AND b.batch_number = 'KP-2246-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2247
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2247-B01',
  60,
  60,
  0,
  1057.35,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2247'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2247' AND b.batch_number = 'KP-2247-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2248
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2248-B01',
  30,
  30,
  0,
  2028.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2248'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2248' AND b.batch_number = 'KP-2248-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2249
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2249-B01',
  30,
  30,
  0,
  5519.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2249'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2249' AND b.batch_number = 'KP-2249-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2250
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2250-B01',
  30,
  30,
  0,
  395.67,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2250'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2250' AND b.batch_number = 'KP-2250-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2251
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2251-B01',
  60,
  60,
  0,
  1057.35,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2251'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2251' AND b.batch_number = 'KP-2251-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2254
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2254-B01',
  30,
  30,
  0,
  415.63,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2254'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2254' AND b.batch_number = 'KP-2254-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2255
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2255-B01',
  30,
  30,
  0,
  379.05,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2255'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2255' AND b.batch_number = 'KP-2255-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2256
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2256-B01',
  30,
  30,
  0,
  764.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2256'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2256' AND b.batch_number = 'KP-2256-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2257
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2257-B01',
  30,
  30,
  0,
  698.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2257'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2257' AND b.batch_number = 'KP-2257-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2258
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2258-B01',
  30,
  30,
  0,
  305.90,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2258'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2258' AND b.batch_number = 'KP-2258-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2259
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2259-B01',
  30,
  30,
  0,
  598.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2259'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2259' AND b.batch_number = 'KP-2259-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2260
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2260-B01',
  30,
  30,
  0,
  1130.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2260'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2260' AND b.batch_number = 'KP-2260-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2261
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2261-B01',
  30,
  30,
  0,
  492.10,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2261'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2261' AND b.batch_number = 'KP-2261-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2262
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2262-B01',
  30,
  30,
  0,
  931.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2262'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2262' AND b.batch_number = 'KP-2262-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2263
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2263-B01',
  30,
  30,
  0,
  724.85,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2263'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2263' AND b.batch_number = 'KP-2263-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2264
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2264-B01',
  30,
  30,
  0,
  3391.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2264'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2264' AND b.batch_number = 'KP-2264-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2265
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2265-B01',
  30,
  30,
  0,
  1695.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2265'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2265' AND b.batch_number = 'KP-2265-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2266
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2266-B01',
  30,
  30,
  0,
  931.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2266'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2266' AND b.batch_number = 'KP-2266-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2267
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2267-B01',
  30,
  30,
  0,
  1064.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2267'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2267' AND b.batch_number = 'KP-2267-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2182
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2182-B01',
  30,
  30,
  0,
  1596.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2182'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2182' AND b.batch_number = 'KP-2182-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2183
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2183-B01',
  30,
  30,
  0,
  1330.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2183'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2183' AND b.batch_number = 'KP-2183-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2184
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2184-B01',
  30,
  30,
  0,
  1263.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2184'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2184' AND b.batch_number = 'KP-2184-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2185
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2185-B01',
  30,
  30,
  0,
  2859.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2185'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2185' AND b.batch_number = 'KP-2185-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2186
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2186-B01',
  30,
  30,
  0,
  2859.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2186'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2186' AND b.batch_number = 'KP-2186-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2187
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2187-B01',
  30,
  30,
  0,
  2460.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2187'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2187' AND b.batch_number = 'KP-2187-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2188
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2188-B01',
  30,
  30,
  0,
  4422.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2188'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2188' AND b.batch_number = 'KP-2188-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2189
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2189-B01',
  30,
  30,
  0,
  4422.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2189'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2189' AND b.batch_number = 'KP-2189-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2190
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2190-B01',
  30,
  30,
  0,
  4422.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2190'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2190' AND b.batch_number = 'KP-2190-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2191
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2191-B01',
  30,
  30,
  0,
  4422.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2191'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2191' AND b.batch_number = 'KP-2191-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2192
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2192-B01',
  30,
  30,
  0,
  3325.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2192'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2192' AND b.batch_number = 'KP-2192-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2193
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2193-B01',
  30,
  30,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2193'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2193' AND b.batch_number = 'KP-2193-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2194
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2194-B01',
  30,
  30,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2194'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2194' AND b.batch_number = 'KP-2194-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2195
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2195-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2195'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2195' AND b.batch_number = 'KP-2195-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2196
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2196-B01',
  30,
  30,
  0,
  199.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2196'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2196' AND b.batch_number = 'KP-2196-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2197
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2197-B01',
  30,
  30,
  0,
  359.10,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2197'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2197' AND b.batch_number = 'KP-2197-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2199
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2199-B01',
  30,
  30,
  0,
  798.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2199'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2199' AND b.batch_number = 'KP-2199-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2200
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2200-B01',
  30,
  30,
  0,
  332.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2200'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2200' AND b.batch_number = 'KP-2200-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2201
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2201-B01',
  30,
  30,
  0,
  651.70,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2201'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2201' AND b.batch_number = 'KP-2201-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2202
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2202-B01',
  30,
  30,
  0,
  678.30,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2202'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2202' AND b.batch_number = 'KP-2202-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2203
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2203-B01',
  30,
  30,
  0,
  1280.13,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2203'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2203' AND b.batch_number = 'KP-2203-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2204
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2204-B01',
  30,
  30,
  0,
  172.90,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2204'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2204' AND b.batch_number = 'KP-2204-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2205
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2205-B01',
  30,
  30,
  0,
  395.67,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2205'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2205' AND b.batch_number = 'KP-2205-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2206
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2206-B01',
  30,
  30,
  0,
  1064.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2206'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2206' AND b.batch_number = 'KP-2206-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2207
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2207-B01',
  30,
  30,
  0,
  299.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2207'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2207' AND b.batch_number = 'KP-2207-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2208
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2208-B01',
  60,
  60,
  0,
  528.67,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2208'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2208' AND b.batch_number = 'KP-2208-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2209
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2209-B01',
  30,
  30,
  0,
  864.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2209'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2209' AND b.batch_number = 'KP-2209-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2210
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2210-B01',
  30,
  30,
  0,
  964.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2210'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2210' AND b.batch_number = 'KP-2210-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2211
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2211-B01',
  60,
  60,
  0,
  1057.35,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2211'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2211' AND b.batch_number = 'KP-2211-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2212
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2212-B01',
  30,
  30,
  0,
  931.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2212'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2212' AND b.batch_number = 'KP-2212-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2213
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2213-B01',
  30,
  30,
  0,
  931.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2213'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2213' AND b.batch_number = 'KP-2213-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2214
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2214-B01',
  30,
  30,
  0,
  831.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2214'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2214' AND b.batch_number = 'KP-2214-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2215
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2215-B01',
  30,
  30,
  0,
  186.20,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2215'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2215' AND b.batch_number = 'KP-2215-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-93
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-93-B01',
  30,
  30,
  0,
  1728.34,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-93'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-93' AND b.batch_number = 'KP-93-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2089
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2089-B01',
  30,
  30,
  0,
  332.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2089'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2089' AND b.batch_number = 'KP-2089-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2090
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2090-B01',
  30,
  30,
  0,
  465.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2090'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2090' AND b.batch_number = 'KP-2090-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1839
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1839-B01',
  30,
  30,
  0,
  182.88,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1839'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1839' AND b.batch_number = 'KP-1839-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1840
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1840-B01',
  30,
  30,
  0,
  412.30,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1840'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1840' AND b.batch_number = 'KP-1840-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1841
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1841-B01',
  30,
  30,
  0,
  681.63,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1841'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1841' AND b.batch_number = 'KP-1841-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1862
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1862-B01',
  30,
  30,
  0,
  182.88,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1862'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1862' AND b.batch_number = 'KP-1862-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1863
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1863-B01',
  30,
  30,
  0,
  412.30,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1863'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1863' AND b.batch_number = 'KP-1863-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1864
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1864-B01',
  30,
  30,
  0,
  681.63,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1864'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1864' AND b.batch_number = 'KP-1864-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2217
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2217-B01',
  30,
  30,
  0,
  1223.60,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2217'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2217' AND b.batch_number = 'KP-2217-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2218
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2218-B01',
  30,
  30,
  0,
  1223.60,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2218'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2218' AND b.batch_number = 'KP-2218-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2219
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2219-B01',
  30,
  30,
  0,
  1223.60,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2219'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2219' AND b.batch_number = 'KP-2219-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2141
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2141-B01',
  30,
  30,
  0,
  2793.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2141'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2141' AND b.batch_number = 'KP-2141-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2142
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2142-B01',
  30,
  30,
  0,
  4887.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2142'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2142' AND b.batch_number = 'KP-2142-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2145
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2145-B01',
  30,
  30,
  0,
  1330.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2145'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2145' AND b.batch_number = 'KP-2145-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2146
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2146-B01',
  30,
  30,
  0,
  1030.75,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2146'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2146' AND b.batch_number = 'KP-2146-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2157
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2157-B01',
  30,
  30,
  0,
  305.90,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2157'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2157' AND b.batch_number = 'KP-2157-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2158
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2158-B01',
  30,
  30,
  0,
  305.90,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2158'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2158' AND b.batch_number = 'KP-2158-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1788
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1788-B01',
  30,
  30,
  0,
  1862.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1788'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1788' AND b.batch_number = 'KP-1788-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1122
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1122-B01',
  30,
  30,
  0,
  1083.95,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1122'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1122' AND b.batch_number = 'KP-1122-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1024
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1024-B01',
  30,
  30,
  0,
  798.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1024'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1024' AND b.batch_number = 'KP-1024-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-930
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-930-B01',
  30,
  30,
  0,
  664.33,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-930'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-930' AND b.batch_number = 'KP-930-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-671
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-671-B01',
  30,
  30,
  0,
  605.15,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-671'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-671' AND b.batch_number = 'KP-671-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-672
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-672-B01',
  30,
  30,
  0,
  605.15,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-672'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-672' AND b.batch_number = 'KP-672-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-393
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-393-B01',
  30,
  30,
  0,
  305.90,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-393'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-393' AND b.batch_number = 'KP-393-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-256
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-256-B01',
  30,
  30,
  0,
  698.25,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-256'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-256' AND b.batch_number = 'KP-256-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-235
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-235-B01',
  30,
  30,
  0,
  2254.35,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-235'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-235' AND b.batch_number = 'KP-235-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-236
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-236-B01',
  30,
  30,
  0,
  1745.63,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-236'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-236' AND b.batch_number = 'KP-236-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-245
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-245-B01',
  30,
  30,
  0,
  2261.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-245'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-245' AND b.batch_number = 'KP-245-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-127
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-127-B01',
  30,
  30,
  0,
  281.30,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-127'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-127' AND b.batch_number = 'KP-127-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-512
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-512-B01',
  30,
  30,
  0,
  132.34,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-512'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-512' AND b.batch_number = 'KP-512-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-5011
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-5011-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-5011'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-5011' AND b.batch_number = 'KP-5011-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4812
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4812-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4812'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4812' AND b.batch_number = 'KP-4812-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4450
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4450-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4450'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4450' AND b.batch_number = 'KP-4450-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3988
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3988-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3988'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3988' AND b.batch_number = 'KP-3988-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3991
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3991-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3991'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3991' AND b.batch_number = 'KP-3991-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3992
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3992-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3992'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3992' AND b.batch_number = 'KP-3992-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3993
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3993-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3993'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3993' AND b.batch_number = 'KP-3993-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3994
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3994-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3994'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3994' AND b.batch_number = 'KP-3994-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3995
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3995-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3995'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3995' AND b.batch_number = 'KP-3995-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3996
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3996-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3996'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3996' AND b.batch_number = 'KP-3996-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3997
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3997-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3997'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3997' AND b.batch_number = 'KP-3997-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3998
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3998-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3998'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3998' AND b.batch_number = 'KP-3998-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3955
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3955-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3955'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3955' AND b.batch_number = 'KP-3955-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3791
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3791-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3791'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3791' AND b.batch_number = 'KP-3791-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3796
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3796-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3796'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3796' AND b.batch_number = 'KP-3796-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3812
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3812-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3812'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3812' AND b.batch_number = 'KP-3812-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3817
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3817-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3817'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3817' AND b.batch_number = 'KP-3817-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3821
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3821-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3821'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3821' AND b.batch_number = 'KP-3821-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3824
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3824-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3824'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3824' AND b.batch_number = 'KP-3824-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3751
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3751-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3751'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3751' AND b.batch_number = 'KP-3751-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4601
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4601-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4601'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4601' AND b.batch_number = 'KP-4601-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4278
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4278-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4278'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4278' AND b.batch_number = 'KP-4278-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4281
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4281-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4281'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4281' AND b.batch_number = 'KP-4281-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4158
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4158-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4158'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4158' AND b.batch_number = 'KP-4158-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3977
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3977-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3977'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3977' AND b.batch_number = 'KP-3977-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3990
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3990-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3990'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3990' AND b.batch_number = 'KP-3990-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3788
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3788-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3788'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3788' AND b.batch_number = 'KP-3788-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3794
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3794-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3794'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3794' AND b.batch_number = 'KP-3794-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3795
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3795-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3795'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3795' AND b.batch_number = 'KP-3795-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3798
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3798-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3798'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3798' AND b.batch_number = 'KP-3798-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3814
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3814-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3814'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3814' AND b.batch_number = 'KP-3814-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3703
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3703-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3703'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3703' AND b.batch_number = 'KP-3703-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3333
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3333-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3333'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3333' AND b.batch_number = 'KP-3333-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3334
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3334-B01',
  1000,
  1000,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3334'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3334' AND b.batch_number = 'KP-3334-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2838
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2838-B01',
  1000,
  1000,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2838'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2838' AND b.batch_number = 'KP-2838-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2684
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2684-B01',
  1000,
  1000,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2684'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2684' AND b.batch_number = 'KP-2684-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-5008
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-5008-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-5008'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-5008' AND b.batch_number = 'KP-5008-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4878
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4878-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4878'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4878' AND b.batch_number = 'KP-4878-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4755
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4755-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4755'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4755' AND b.batch_number = 'KP-4755-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4765
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4765-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4765'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4765' AND b.batch_number = 'KP-4765-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4704
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4704-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4704'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4704' AND b.batch_number = 'KP-4704-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4627
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4627-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4627'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4627' AND b.batch_number = 'KP-4627-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4637
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4637-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4637'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4637' AND b.batch_number = 'KP-4637-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4427
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4427-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4427'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4427' AND b.batch_number = 'KP-4427-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4439
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4439-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4439'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4439' AND b.batch_number = 'KP-4439-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4347
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4347-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4347'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4347' AND b.batch_number = 'KP-4347-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4348
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4348-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4348'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4348' AND b.batch_number = 'KP-4348-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4349
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4349-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4349'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4349' AND b.batch_number = 'KP-4349-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4350
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4350-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4350'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4350' AND b.batch_number = 'KP-4350-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4286
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4286-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4286'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4286' AND b.batch_number = 'KP-4286-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4243
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4243-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4243'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4243' AND b.batch_number = 'KP-4243-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4104
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4104-B01',
  60,
  60,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4104'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4104' AND b.batch_number = 'KP-4104-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4113
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4113-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4113'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4113' AND b.batch_number = 'KP-4113-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4118
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4118-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4118'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4118' AND b.batch_number = 'KP-4118-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4082
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4082-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4082'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4082' AND b.batch_number = 'KP-4082-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4092
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4092-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4092'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4092' AND b.batch_number = 'KP-4092-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4981
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4981-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4981'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4981' AND b.batch_number = 'KP-4981-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4982
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4982-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4982'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4982' AND b.batch_number = 'KP-4982-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4985
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4985-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4985'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4985' AND b.batch_number = 'KP-4985-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-5001
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-5001-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-5001'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-5001' AND b.batch_number = 'KP-5001-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4915
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4915-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4915'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4915' AND b.batch_number = 'KP-4915-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4822
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4822-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4822'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4822' AND b.batch_number = 'KP-4822-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4773
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4773-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4773'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4773' AND b.batch_number = 'KP-4773-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4553
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4553-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4553'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4553' AND b.batch_number = 'KP-4553-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4232
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4232-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4232'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4232' AND b.batch_number = 'KP-4232-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3230
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3230-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3230'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3230' AND b.batch_number = 'KP-3230-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3245
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3245-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3245'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3245' AND b.batch_number = 'KP-3245-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3145
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3145-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3145'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3145' AND b.batch_number = 'KP-3145-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3108
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3108-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3108'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3108' AND b.batch_number = 'KP-3108-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3062
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3062-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3062'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3062' AND b.batch_number = 'KP-3062-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3064
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3064-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3064'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3064' AND b.batch_number = 'KP-3064-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2720
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2720-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2720'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2720' AND b.batch_number = 'KP-2720-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4955
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4955-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4955'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4955' AND b.batch_number = 'KP-4955-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4858
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4858-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4858'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4858' AND b.batch_number = 'KP-4858-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4808
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4808-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4808'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4808' AND b.batch_number = 'KP-4808-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4784
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4784-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4784'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4784' AND b.batch_number = 'KP-4784-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4619
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4619-B01',
  60,
  60,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4619'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4619' AND b.batch_number = 'KP-4619-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4620
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4620-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4620'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4620' AND b.batch_number = 'KP-4620-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4570
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4570-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4570'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4570' AND b.batch_number = 'KP-4570-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4579
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4579-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4579'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4579' AND b.batch_number = 'KP-4579-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4455
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4455-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4455'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4455' AND b.batch_number = 'KP-4455-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4338
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4338-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4338'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4338' AND b.batch_number = 'KP-4338-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4285
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4285-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4285'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4285' AND b.batch_number = 'KP-4285-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4287
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4287-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4287'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4287' AND b.batch_number = 'KP-4287-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4300
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4300-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4300'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4300' AND b.batch_number = 'KP-4300-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4304
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4304-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4304'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4304' AND b.batch_number = 'KP-4304-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4314
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4314-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4314'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4314' AND b.batch_number = 'KP-4314-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4315
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4315-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4315'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4315' AND b.batch_number = 'KP-4315-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4247
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4247-B01',
  60,
  60,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4247'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4247' AND b.batch_number = 'KP-4247-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4268
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4268-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4268'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4268' AND b.batch_number = 'KP-4268-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4131
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4131-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4131'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4131' AND b.batch_number = 'KP-4131-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4964
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4964-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4964'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4964' AND b.batch_number = 'KP-4964-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4646
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4646-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4646'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4646' AND b.batch_number = 'KP-4646-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4655
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4655-B01',
  30,
  30,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4655'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4655' AND b.batch_number = 'KP-4655-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4630
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4630-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4630'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4630' AND b.batch_number = 'KP-4630-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4635
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4635-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4635'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4635' AND b.batch_number = 'KP-4635-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3494
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3494-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3494'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3494' AND b.batch_number = 'KP-3494-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3495
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3495-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3495'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3495' AND b.batch_number = 'KP-3495-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3507
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3507-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3507'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3507' AND b.batch_number = 'KP-3507-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3508
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3508-B01',
  30,
  30,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3508'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3508' AND b.batch_number = 'KP-3508-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3510
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3510-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3510'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3510' AND b.batch_number = 'KP-3510-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3470
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3470-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3470'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3470' AND b.batch_number = 'KP-3470-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3481
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3481-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3481'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3481' AND b.batch_number = 'KP-3481-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3084
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3084-B01',
  30,
  30,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3084'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3084' AND b.batch_number = 'KP-3084-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3085
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3085-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3085'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3085' AND b.batch_number = 'KP-3085-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2594
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2594-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2594'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2594' AND b.batch_number = 'KP-2594-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2595
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2595-B01',
  30,
  30,
  0,
  84.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2595'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2595' AND b.batch_number = 'KP-2595-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-2059
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-2059-B01',
  30,
  30,
  0,
  186.20,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-2059'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2059' AND b.batch_number = 'KP-2059-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1793
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1793-B01',
  30,
  30,
  0,
  186.20,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1793'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1793' AND b.batch_number = 'KP-1793-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-1794
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-1794-B01',
  30,
  30,
  0,
  325.85,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-1794'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1794' AND b.batch_number = 'KP-1794-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4538
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4538-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4538'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4538' AND b.batch_number = 'KP-4538-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4291
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4291-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4291'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4291' AND b.batch_number = 'KP-4291-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4274
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4274-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4274'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4274' AND b.batch_number = 'KP-4274-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4192
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4192-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4192'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4192' AND b.batch_number = 'KP-4192-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4216
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4216-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4216'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4216' AND b.batch_number = 'KP-4216-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4224
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4224-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4224'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4224' AND b.batch_number = 'KP-4224-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4117
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4117-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4117'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4117' AND b.batch_number = 'KP-4117-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4004
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4004-B01',
  60,
  60,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4004'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4004' AND b.batch_number = 'KP-4004-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-4005
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-4005-B01',
  60,
  60,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-4005'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4005' AND b.batch_number = 'KP-4005-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3956
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3956-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3956'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3956' AND b.batch_number = 'KP-3956-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3962
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3962-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3962'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3962' AND b.batch_number = 'KP-3962-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3912
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3912-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3912'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3912' AND b.batch_number = 'KP-3912-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3837
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3837-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3837'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3837' AND b.batch_number = 'KP-3837-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3804
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3804-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3804'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3804' AND b.batch_number = 'KP-3804-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3810
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3810-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3810'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3810' AND b.batch_number = 'KP-3810-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3811
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3811-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3811'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3811' AND b.batch_number = 'KP-3811-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3825
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3825-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3825'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3825' AND b.batch_number = 'KP-3825-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3436
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3436-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3436'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3436' AND b.batch_number = 'KP-3436-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3335
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3335-B01',
  30,
  30,
  0,
  24.50,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3335'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3335' AND b.batch_number = 'KP-3335-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & Stock for KP-3336
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  COALESCE((SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1), (SELECT id FROM suppliers LIMIT 1)),
  'KP-3336-B01',
  30,
  30,
  0,
  315.00,
  DATE_ADD(CURDATE(), INTERVAL 720 DAY),
  NOW(),
  0
FROM products p
WHERE p.sku = 'KP-3336'
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
  'Verified Master Pharmacy Opening Stock Receipt',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3336' AND b.batch_number = 'KP-3336-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);

COMMIT;