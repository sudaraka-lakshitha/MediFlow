-- MediFlow Kanapathee Pharmacy Real Crawled Dataset
-- Sourced from https://kanapathee.com (Licensed Pharmacy Reg: RL-08261 / NMRA/R/48/15)
-- Generated on 2026-10-27
START TRANSACTION;

-- 1. Kanapathee Pharmacy Supplier
INSERT INTO suppliers (name, contact_person, phone, email, address, active, created_at, updated_at)
VALUES ('Kanapathee Pharmacy / New Kavery Medical', 'Dispensary Pharmacist', '+94 77 891 4073', 'info@kanapathee.com', 'New Kavery Medical, NMRA License RL-08261, Sri Lanka', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE phone = VALUES(phone), active = 1;

-- 2. Manufacturers from Kanapathee Crawl
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
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Nutrition & Food Supplements', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Baby Care & Diapers', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Personal & Skin Care', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Medical Devices & Diagnostics', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('General Products', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Laundry Care', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Personal Care', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Grocery', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Snacks', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Home Care', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Shaving & Grooming', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Women''s Healthcare', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;
INSERT INTO categories (name, description, active, created_at, updated_at) VALUES ('Prescription Medicines', 'Crawled from kanapathee.com', 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE active = 1;

-- 4. Products
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store in a clean, dry location.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;
INSERT INTO products (sku, product_type, generic_name, brand_name, strength, dosage_form, unit, manufacturer, active_ingredient, variant_group, barcode, storage_instructions, selling_price, reorder_level, prescription_required, active, category_id, manufacturer_id, created_at, updated_at)
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
  'Store below 25°C in a dry place protected from light.',
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
  active = 1;

-- 5. Batches & Stock Movements

-- Batch & stock for KP-4976
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4976' AND b.batch_number = 'KP-4976-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4977
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4977' AND b.batch_number = 'KP-4977-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4530
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4530' AND b.batch_number = 'KP-4530-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4306
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4306' AND b.batch_number = 'KP-4306-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4307
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4307' AND b.batch_number = 'KP-4307-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4308
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4308' AND b.batch_number = 'KP-4308-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4309
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4309' AND b.batch_number = 'KP-4309-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4310
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4310' AND b.batch_number = 'KP-4310-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4311
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4311' AND b.batch_number = 'KP-4311-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4312
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4312' AND b.batch_number = 'KP-4312-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4313
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4313' AND b.batch_number = 'KP-4313-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4169
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4169' AND b.batch_number = 'KP-4169-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3930
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3930' AND b.batch_number = 'KP-3930-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3441
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3441' AND b.batch_number = 'KP-3441-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3442
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3442' AND b.batch_number = 'KP-3442-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3443
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3443' AND b.batch_number = 'KP-3443-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3444
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3444' AND b.batch_number = 'KP-3444-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2828
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2828' AND b.batch_number = 'KP-2828-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2829
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2829' AND b.batch_number = 'KP-2829-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2238
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2238' AND b.batch_number = 'KP-2238-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2239
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2239' AND b.batch_number = 'KP-2239-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2240
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2240' AND b.batch_number = 'KP-2240-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2241
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2241' AND b.batch_number = 'KP-2241-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2242
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2242' AND b.batch_number = 'KP-2242-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2243
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2243' AND b.batch_number = 'KP-2243-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2244
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2244' AND b.batch_number = 'KP-2244-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2245
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2245' AND b.batch_number = 'KP-2245-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2246
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2246' AND b.batch_number = 'KP-2246-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2247
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2247' AND b.batch_number = 'KP-2247-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2248
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2248' AND b.batch_number = 'KP-2248-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2249
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2249' AND b.batch_number = 'KP-2249-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2250
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2250' AND b.batch_number = 'KP-2250-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2251
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2251' AND b.batch_number = 'KP-2251-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2254
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2254' AND b.batch_number = 'KP-2254-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2255
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2255' AND b.batch_number = 'KP-2255-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2256
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2256' AND b.batch_number = 'KP-2256-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2257
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2257' AND b.batch_number = 'KP-2257-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2258
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2258' AND b.batch_number = 'KP-2258-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2259
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2259' AND b.batch_number = 'KP-2259-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2260
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2260' AND b.batch_number = 'KP-2260-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2261
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2261' AND b.batch_number = 'KP-2261-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2262
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2262' AND b.batch_number = 'KP-2262-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2263
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2263' AND b.batch_number = 'KP-2263-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2264
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2264' AND b.batch_number = 'KP-2264-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2265
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2265' AND b.batch_number = 'KP-2265-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2266
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2266' AND b.batch_number = 'KP-2266-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2267
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2267' AND b.batch_number = 'KP-2267-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2182
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2182' AND b.batch_number = 'KP-2182-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2183
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2183' AND b.batch_number = 'KP-2183-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2184
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2184' AND b.batch_number = 'KP-2184-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2185
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2185' AND b.batch_number = 'KP-2185-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2186
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2186' AND b.batch_number = 'KP-2186-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2187
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2187' AND b.batch_number = 'KP-2187-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2188
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2188' AND b.batch_number = 'KP-2188-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2189
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2189' AND b.batch_number = 'KP-2189-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2190
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2190' AND b.batch_number = 'KP-2190-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2191
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2191' AND b.batch_number = 'KP-2191-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2192
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2192' AND b.batch_number = 'KP-2192-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2193
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2193' AND b.batch_number = 'KP-2193-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2194
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2194' AND b.batch_number = 'KP-2194-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2195
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2195' AND b.batch_number = 'KP-2195-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2196
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2196' AND b.batch_number = 'KP-2196-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2197
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2197' AND b.batch_number = 'KP-2197-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2199
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2199' AND b.batch_number = 'KP-2199-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2200
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2200' AND b.batch_number = 'KP-2200-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2201
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2201' AND b.batch_number = 'KP-2201-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2202
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2202' AND b.batch_number = 'KP-2202-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2203
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2203' AND b.batch_number = 'KP-2203-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2204
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2204' AND b.batch_number = 'KP-2204-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2205
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2205' AND b.batch_number = 'KP-2205-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2206
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2206' AND b.batch_number = 'KP-2206-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2207
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2207' AND b.batch_number = 'KP-2207-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2208
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2208' AND b.batch_number = 'KP-2208-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2209
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2209' AND b.batch_number = 'KP-2209-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2210
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2210' AND b.batch_number = 'KP-2210-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2211
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2211' AND b.batch_number = 'KP-2211-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2212
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2212' AND b.batch_number = 'KP-2212-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2213
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2213' AND b.batch_number = 'KP-2213-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2214
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2214' AND b.batch_number = 'KP-2214-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2215
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2215' AND b.batch_number = 'KP-2215-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-93
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-93' AND b.batch_number = 'KP-93-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2089
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2089' AND b.batch_number = 'KP-2089-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2090
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2090' AND b.batch_number = 'KP-2090-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1839
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1839' AND b.batch_number = 'KP-1839-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1840
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1840' AND b.batch_number = 'KP-1840-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1841
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1841' AND b.batch_number = 'KP-1841-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1862
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1862' AND b.batch_number = 'KP-1862-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1863
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1863' AND b.batch_number = 'KP-1863-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1864
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1864' AND b.batch_number = 'KP-1864-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2217
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2217' AND b.batch_number = 'KP-2217-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2218
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2218' AND b.batch_number = 'KP-2218-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2219
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2219' AND b.batch_number = 'KP-2219-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2141
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2141' AND b.batch_number = 'KP-2141-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2142
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2142' AND b.batch_number = 'KP-2142-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2145
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2145' AND b.batch_number = 'KP-2145-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2146
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2146' AND b.batch_number = 'KP-2146-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2157
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2157' AND b.batch_number = 'KP-2157-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2158
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2158' AND b.batch_number = 'KP-2158-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1788
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1788' AND b.batch_number = 'KP-1788-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1122
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1122' AND b.batch_number = 'KP-1122-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1024
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1024' AND b.batch_number = 'KP-1024-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-930
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-930' AND b.batch_number = 'KP-930-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-671
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-671' AND b.batch_number = 'KP-671-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-672
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-672' AND b.batch_number = 'KP-672-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-393
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-393' AND b.batch_number = 'KP-393-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-256
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-256' AND b.batch_number = 'KP-256-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-235
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-235' AND b.batch_number = 'KP-235-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-236
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-236' AND b.batch_number = 'KP-236-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-245
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-245' AND b.batch_number = 'KP-245-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-127
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-127' AND b.batch_number = 'KP-127-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-512
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-512' AND b.batch_number = 'KP-512-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-5011
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-5011' AND b.batch_number = 'KP-5011-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4812
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4812' AND b.batch_number = 'KP-4812-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4450
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4450' AND b.batch_number = 'KP-4450-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3988
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3988' AND b.batch_number = 'KP-3988-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3991
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3991' AND b.batch_number = 'KP-3991-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3992
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3992' AND b.batch_number = 'KP-3992-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3993
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3993' AND b.batch_number = 'KP-3993-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3994
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3994' AND b.batch_number = 'KP-3994-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3995
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3995' AND b.batch_number = 'KP-3995-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3996
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3996' AND b.batch_number = 'KP-3996-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3997
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3997' AND b.batch_number = 'KP-3997-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3998
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3998' AND b.batch_number = 'KP-3998-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3955
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3955' AND b.batch_number = 'KP-3955-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3791
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3791' AND b.batch_number = 'KP-3791-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3796
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3796' AND b.batch_number = 'KP-3796-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3812
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3812' AND b.batch_number = 'KP-3812-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3817
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3817' AND b.batch_number = 'KP-3817-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3821
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3821' AND b.batch_number = 'KP-3821-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3824
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3824' AND b.batch_number = 'KP-3824-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3751
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3751' AND b.batch_number = 'KP-3751-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4601
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4601' AND b.batch_number = 'KP-4601-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4278
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4278' AND b.batch_number = 'KP-4278-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4281
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4281' AND b.batch_number = 'KP-4281-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4158
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4158' AND b.batch_number = 'KP-4158-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3977
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3977' AND b.batch_number = 'KP-3977-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3990
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3990' AND b.batch_number = 'KP-3990-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3788
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3788' AND b.batch_number = 'KP-3788-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3794
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3794' AND b.batch_number = 'KP-3794-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3795
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3795' AND b.batch_number = 'KP-3795-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3798
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3798' AND b.batch_number = 'KP-3798-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3814
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3814' AND b.batch_number = 'KP-3814-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3703
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3703' AND b.batch_number = 'KP-3703-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3333
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3333' AND b.batch_number = 'KP-3333-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3334
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3334' AND b.batch_number = 'KP-3334-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2838
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2838' AND b.batch_number = 'KP-2838-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2684
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2684' AND b.batch_number = 'KP-2684-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-5008
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-5008' AND b.batch_number = 'KP-5008-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4878
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4878' AND b.batch_number = 'KP-4878-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4755
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4755' AND b.batch_number = 'KP-4755-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4765
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4765' AND b.batch_number = 'KP-4765-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4704
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4704' AND b.batch_number = 'KP-4704-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4627
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4627' AND b.batch_number = 'KP-4627-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4637
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4637' AND b.batch_number = 'KP-4637-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4427
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4427' AND b.batch_number = 'KP-4427-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4439
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4439' AND b.batch_number = 'KP-4439-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4347
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4347' AND b.batch_number = 'KP-4347-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4348
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4348' AND b.batch_number = 'KP-4348-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4349
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4349' AND b.batch_number = 'KP-4349-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4350
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4350' AND b.batch_number = 'KP-4350-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4286
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4286' AND b.batch_number = 'KP-4286-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4243
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4243' AND b.batch_number = 'KP-4243-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4104
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4104' AND b.batch_number = 'KP-4104-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4113
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4113' AND b.batch_number = 'KP-4113-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4118
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4118' AND b.batch_number = 'KP-4118-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4082
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4082' AND b.batch_number = 'KP-4082-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4092
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4092' AND b.batch_number = 'KP-4092-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4981
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4981' AND b.batch_number = 'KP-4981-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4982
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4982' AND b.batch_number = 'KP-4982-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4985
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4985' AND b.batch_number = 'KP-4985-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-5001
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-5001' AND b.batch_number = 'KP-5001-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4915
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4915' AND b.batch_number = 'KP-4915-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4822
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4822' AND b.batch_number = 'KP-4822-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4773
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4773' AND b.batch_number = 'KP-4773-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4553
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4553' AND b.batch_number = 'KP-4553-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4232
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4232' AND b.batch_number = 'KP-4232-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3230
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3230' AND b.batch_number = 'KP-3230-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3245
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3245' AND b.batch_number = 'KP-3245-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3145
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3145' AND b.batch_number = 'KP-3145-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3108
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3108' AND b.batch_number = 'KP-3108-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3062
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3062' AND b.batch_number = 'KP-3062-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3064
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3064' AND b.batch_number = 'KP-3064-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2720
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2720' AND b.batch_number = 'KP-2720-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4955
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4955' AND b.batch_number = 'KP-4955-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4858
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4858' AND b.batch_number = 'KP-4858-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4808
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4808' AND b.batch_number = 'KP-4808-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4784
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4784' AND b.batch_number = 'KP-4784-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4619
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4619' AND b.batch_number = 'KP-4619-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4620
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4620' AND b.batch_number = 'KP-4620-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4570
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4570' AND b.batch_number = 'KP-4570-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4579
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4579' AND b.batch_number = 'KP-4579-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4455
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4455' AND b.batch_number = 'KP-4455-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4338
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4338' AND b.batch_number = 'KP-4338-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4285
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4285' AND b.batch_number = 'KP-4285-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4287
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4287' AND b.batch_number = 'KP-4287-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4300
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4300' AND b.batch_number = 'KP-4300-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4304
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4304' AND b.batch_number = 'KP-4304-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4314
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4314' AND b.batch_number = 'KP-4314-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4315
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4315' AND b.batch_number = 'KP-4315-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4247
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4247' AND b.batch_number = 'KP-4247-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4268
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4268' AND b.batch_number = 'KP-4268-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4131
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4131' AND b.batch_number = 'KP-4131-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4964
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4964' AND b.batch_number = 'KP-4964-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4646
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4646' AND b.batch_number = 'KP-4646-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4655
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4655' AND b.batch_number = 'KP-4655-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4630
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4630' AND b.batch_number = 'KP-4630-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4635
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4635' AND b.batch_number = 'KP-4635-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3494
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3494' AND b.batch_number = 'KP-3494-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3495
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3495' AND b.batch_number = 'KP-3495-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3507
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3507' AND b.batch_number = 'KP-3507-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3508
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3508' AND b.batch_number = 'KP-3508-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3510
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3510' AND b.batch_number = 'KP-3510-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3470
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3470' AND b.batch_number = 'KP-3470-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3481
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3481' AND b.batch_number = 'KP-3481-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3084
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3084' AND b.batch_number = 'KP-3084-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3085
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3085' AND b.batch_number = 'KP-3085-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2594
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2594' AND b.batch_number = 'KP-2594-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2595
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2595' AND b.batch_number = 'KP-2595-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-2059
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-2059' AND b.batch_number = 'KP-2059-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1793
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1793' AND b.batch_number = 'KP-1793-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-1794
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-1794' AND b.batch_number = 'KP-1794-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4538
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4538' AND b.batch_number = 'KP-4538-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4291
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4291' AND b.batch_number = 'KP-4291-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4274
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4274' AND b.batch_number = 'KP-4274-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4192
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4192' AND b.batch_number = 'KP-4192-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4216
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4216' AND b.batch_number = 'KP-4216-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4224
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4224' AND b.batch_number = 'KP-4224-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4117
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4117' AND b.batch_number = 'KP-4117-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4004
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4004' AND b.batch_number = 'KP-4004-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-4005
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-4005' AND b.batch_number = 'KP-4005-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3956
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3956' AND b.batch_number = 'KP-3956-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3962
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3962' AND b.batch_number = 'KP-3962-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3912
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3912' AND b.batch_number = 'KP-3912-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3837
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3837' AND b.batch_number = 'KP-3837-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3804
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3804' AND b.batch_number = 'KP-3804-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3810
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3810' AND b.batch_number = 'KP-3810-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3811
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3811' AND b.batch_number = 'KP-3811-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3825
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3825' AND b.batch_number = 'KP-3825-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3436
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3436' AND b.batch_number = 'KP-3436-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3335
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3335' AND b.batch_number = 'KP-3335-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);


-- Batch & stock for KP-3336
INSERT INTO inventory_batches (product_id, supplier_id, batch_number, quantity_received, quantity_available, quantity_reserved, purchase_price, expiry_date, received_at, restricted)
SELECT
  p.id,
  (SELECT id FROM suppliers WHERE name = 'Kanapathee Pharmacy / New Kavery Medical' LIMIT 1),
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
  'Crawled Kanapathee Pharmacy Verified Stock',
  COALESCE((SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1), 1),
  NOW()
FROM inventory_batches b
JOIN products p ON p.id = b.product_id
WHERE p.sku = 'KP-3336' AND b.batch_number = 'KP-3336-B01'
AND NOT EXISTS (
  SELECT 1 FROM stock_movements sm WHERE sm.batch_id = b.id AND sm.type = 'RECEIPT'
);

COMMIT;