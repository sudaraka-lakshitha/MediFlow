import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const slug = (value) => value.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 22);
const normalized = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const numberFor = (text, min, max) => min + ([...text].reduce((sum, char) => sum + char.charCodeAt(0), 0) % (max - min + 1));

const solidMedicines = [
  ['Paracetamol','500 mg','Tablet'],['Amoxicillin','500 mg','Capsule'],['Azithromycin','250 mg','Tablet'],['Cefuroxime','500 mg','Tablet'],['Ciprofloxacin','500 mg','Tablet'],
  ['Metformin','500 mg','Tablet'],['Gliclazide','80 mg','Tablet'],['Amlodipine','5 mg','Tablet'],['Losartan','50 mg','Tablet'],['Atorvastatin','20 mg','Tablet'],
  ['Omeprazole','20 mg','Capsule'],['Pantoprazole','40 mg','Tablet'],['Cetirizine','10 mg','Tablet'],['Loratadine','10 mg','Tablet'],['Montelukast','10 mg','Tablet'],
  ['Salbutamol','100 mcg','Inhaler'],['Budesonide','200 mcg','Inhaler'],['Prednisolone','5 mg','Tablet'],['Diclofenac','50 mg','Tablet'],['Ibuprofen','400 mg','Tablet'],
  ['Aspirin','75 mg','Tablet'],['Clopidogrel','75 mg','Tablet'],['Warfarin','5 mg','Tablet'],['Levothyroxine','50 mcg','Tablet'],['Sertraline','50 mg','Tablet'],
  ['Fluoxetine','20 mg','Capsule'],['Gabapentin','300 mg','Capsule'],['Pregabalin','75 mg','Capsule'],['Tramadol','50 mg','Capsule'],['Doxycycline','100 mg','Capsule'],
  ['Metronidazole','400 mg','Tablet'],['Fluconazole','150 mg','Capsule'],['Albendazole','400 mg','Tablet'],['Folic Acid','5 mg','Tablet'],['Ferrous Sulfate','200 mg','Tablet'],
  ['Calcium Carbonate','500 mg','Tablet'],['Vitamin C','500 mg','Tablet'],['Vitamin D3','1000 IU','Capsule'],['Domperidone','10 mg','Tablet'],['Ondansetron','4 mg','Tablet'],
];

const liquidMedicines = [
  ['Paracetamol','120 mg/5 mL','Oral suspension'],['Amoxicillin','125 mg/5 mL','Oral suspension'],['Azithromycin','200 mg/5 mL','Oral suspension'],['Cefuroxime','125 mg/5 mL','Oral suspension'],
  ['Ibuprofen','100 mg/5 mL','Oral suspension'],['Cetirizine','5 mg/5 mL','Syrup'],['Loratadine','5 mg/5 mL','Syrup'],['Salbutamol','2 mg/5 mL','Syrup'],
  ['Prednisolone','5 mg/5 mL','Oral solution'],['Metronidazole','200 mg/5 mL','Oral suspension'],['Domperidone','5 mg/5 mL','Oral suspension'],['Ondansetron','4 mg/5 mL','Oral solution'],
  ['Lactulose','3.35 g/5 mL','Oral solution'],['Antacid suspension','250 mg/5 mL','Oral suspension'],['Zinc Sulfate','10 mg/5 mL','Syrup'],['Multivitamin','5 mL','Syrup'],
  ['Chlorpheniramine','2 mg/5 mL','Syrup'],['Diphenhydramine','12.5 mg/5 mL','Syrup'],['Bromhexine','4 mg/5 mL','Syrup'],['Oral Rehydration Solution','200 mL','Solution'],
];

const retailItems = [
  ['Sterile Syringe 5 mL','piece','Medical supplies'],['Sterile Syringe 10 mL','piece','Medical supplies'],['Disposable Face Mask','box','Medical supplies'],['Surgical Gloves','pair','Medical supplies'],
  ['Elastic Knee Guard','piece','Orthopaedic supports'],['Ankle Support','piece','Orthopaedic supports'],['Wrist Support','piece','Orthopaedic supports'],['Digital Thermometer','piece','Medical devices'],
  ['Blood Glucose Test Strips','box','Medical devices'],['Cotton Wool','pack','Personal care'],['Adhesive Plasters','box','First aid'],['Antiseptic Wipes','pack','First aid'],
  ['Sanitary Pads Regular','pack','Personal care'],['Sanitary Pads Overnight','pack','Personal care'],['Baby Diapers Medium','pack','Personal care'],['Adult Diapers Large','pack','Personal care'],
  ['Mineral Water 500 mL','bottle','Beverages'],['Orange Soft Drink 330 mL','can','Beverages'],['Energy Drink 250 mL','can','Beverages'],['Protein Nutrition Drink','bottle','Nutrition'],
];

async function main() {
  const passwordHash = await bcrypt.hash('Demo123!', 12);
  const baseEmail = 'pharmacy.mediflow@gmail.com';
  const demoEmail = (tag) => `${baseEmail.replace('@gmail.com', `+${tag}@gmail.com`)}`;
  const admin = await prisma.user.upsert({
    where: { email: demoEmail('admin') },
    update: { phone: '0770000001' },
    create: { email: demoEmail('admin'), fullName: 'System Administrator', phone: '0770000001', passwordHash, role: 'ADMIN' },
  });
  await prisma.user.upsert({
    where: { email: demoEmail('pharmacist') },
    update: { phone: '0770000002' },
    create: { email: demoEmail('pharmacist'), fullName: 'Demo Pharmacist', phone: '0770000002', passwordHash, role: 'PHARMACIST' },
  });
  await prisma.user.upsert({
    where: { email: demoEmail('cashier') },
    update: { phone: '0770000004', cashierAccess: true },
    create: { email: demoEmail('cashier'), fullName: 'Demo Cashier', phone: '0770000004', passwordHash, role: 'CASHIER', cashierAccess: true },
  });
  const patient = await prisma.user.upsert({
    where: { email: demoEmail('patient') },
    update: { phone: '0770000003' },
    create: { email: demoEmail('patient'), fullName: 'Demo Patient', phone: '0770000003', passwordHash, role: 'PATIENT' },
  });
  await prisma.patientProfile.upsert({ where: { userId: patient.id }, update: { dateOfBirth: new Date('1992-06-15') }, create: { userId: patient.id, patientNumber: 'PAT-0001', dateOfBirth: new Date('1992-06-15'), allergies: 'No known allergies' } });
  for (let index = 1; index <= 8; index += 1) {
    const email = demoEmail(`patient${index}`); const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email, fullName: `Demo Patient ${index}`, phone: `07100000${String(index).padStart(2,'0')}`, passwordHash, role: 'PATIENT' } });
    await prisma.patientProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, patientNumber: `PAT-${String(index + 1).padStart(4,'0')}`, dateOfBirth: new Date(`${1985 + index}-0${(index % 8) + 1}-1${index}`), address: `${10 + index} Demo Street, Colombo`, allergies: index % 3 === 0 ? 'Penicillin' : 'No known allergies' } });
  }
  const categoryNames = ['General medicines','Antibiotics','Cardiovascular','Diabetes','Respiratory','Pain relief','Gastrointestinal','Vitamins','Medical supplies','Orthopaedic supports','Medical devices','Personal care','First aid','Beverages','Nutrition'];
  const categories = new Map(); for (const name of categoryNames) categories.set(name, await prisma.category.upsert({ where: { name }, update: { active: true }, create: { name, description: `${name} demonstration catalogue` } }));
  const manufacturer = await prisma.manufacturer.upsert({ where: { name: 'MediFlow Demo Laboratories' }, update: {}, create: { name: 'MediFlow Demo Laboratories', country: 'Sri Lanka', phone: '0112000000', email: demoEmail('quality') } });
  const supplier = await prisma.supplier.upsert({ where: { name: 'HealthSource Distributors' }, update: { phone: '0115550101' }, create: { name: 'HealthSource Distributors', contactPerson: 'Nimal Perera', phone: '0115550101', email: 'orders@healthsource.local' } });
  const categoryFor = (name) => ['Amoxicillin','Azithromycin','Cefuroxime','Ciprofloxacin','Doxycycline','Metronidazole'].includes(name) ? 'Antibiotics' : ['Amlodipine','Losartan','Atorvastatin','Aspirin','Clopidogrel','Warfarin'].includes(name) ? 'Cardiovascular' : ['Metformin','Gliclazide'].includes(name) ? 'Diabetes' : ['Salbutamol','Budesonide','Montelukast'].includes(name) ? 'Respiratory' : ['Paracetamol','Diclofenac','Ibuprofen','Tramadol'].includes(name) ? 'Pain relief' : ['Omeprazole','Pantoprazole','Domperidone','Ondansetron','Lactulose','Antacid suspension'].includes(name) ? 'Gastrointestinal' : ['Folic Acid','Ferrous Sulfate','Calcium Carbonate','Vitamin C','Vitamin D3','Multivitamin','Zinc Sulfate'].includes(name) ? 'Vitamins' : 'General medicines';
  const createdProducts = [];
  for (const [index, [name, strength, dosageForm]] of [...solidMedicines, ...liquidMedicines].entries()) {
    const liquid = index >= solidMedicines.length; const concept = await prisma.drugConcept.upsert({ where: { normalizedName: normalized(name) }, update: { displayName: name }, create: { normalizedName: normalized(name), displayName: name } });
    const sku = `MED-${slug(name)}-${liquid ? 'LIQ' : slug(strength)}`.slice(0,40); const category = categories.get(categoryFor(name)); const sellingPrice = numberFor(`${name}${strength}`, liquid ? 2 : 8, liquid ? 9 : 85);
    const product = await prisma.product.upsert({ where: { sku }, update: { active: true, productType: 'MEDICINE', drugConceptId: concept.id }, create: { sku, productType: 'MEDICINE', genericName: name, brandName: `Demo ${name}`, activeIngredient: name, strength, dosageForm, unit: liquid ? 'ml' : dosageForm === 'Capsule' ? 'capsule' : dosageForm === 'Inhaler' ? 'puff' : 'tablet', manufacturerId: manufacturer.id, sellingPrice, reorderLevel: liquid ? 200 : 80, prescriptionRequired: !['Paracetamol','Ibuprofen','Cetirizine','Loratadine','Vitamin C','Multivitamin'].includes(name), categoryId: category.id, drugConceptId: concept.id, storageInstructions: liquid ? 'Store below 25°C. Keep the bottle tightly closed.' : 'Store below 25°C in a dry place.' } }); createdProducts.push(product);
    const batchNumber = `${sku}-B01`; const existing = await prisma.inventoryBatch.findUnique({ where: { productId_batchNumber: { productId: product.id, batchNumber } } }); if (!existing) { const quantity = numberFor(sku, liquid ? 600 : 180, liquid ? 1800 : 700); const expiry = new Date(); expiry.setFullYear(expiry.getFullYear() + numberFor(sku,1,3)); const batch = await prisma.inventoryBatch.create({ data: { productId: product.id, supplierId: supplier.id, batchNumber, quantityReceived: quantity, quantityAvailable: quantity, purchasePrice: sellingPrice * 0.55, expiryDate: expiry } }); await prisma.stockMovement.create({ data: { productId: product.id, batchId: batch.id, type: 'RECEIPT', quantityChange: quantity, quantityBefore: 0, quantityAfter: quantity, reason: 'Generated demonstration opening stock', performedById: admin.id } }); }
  }
  for (const [index, [name, unit, categoryName]] of retailItems.entries()) {
    const sku = `RET-${slug(name)}`.slice(0,40); const sellingPrice = numberFor(name, 35, 950); const product = await prisma.product.upsert({ where: { sku }, update: { active: true, productType: 'NON_MEDICINAL', prescriptionRequired: false }, create: { sku, productType: 'NON_MEDICINAL', genericName: name, strength: 'N/A', dosageForm: 'Retail item', unit, manufacturerId: manufacturer.id, sellingPrice, reorderLevel: 10, prescriptionRequired: false, categoryId: categories.get(categoryName).id, storageInstructions: categoryName === 'Beverages' ? 'Store in a cool, dry place.' : 'Keep clean, dry, and sealed until use.' } }); const batchNumber = `${sku}-B01`; const existing = await prisma.inventoryBatch.findUnique({ where: { productId_batchNumber: { productId: product.id, batchNumber } } }); if (!existing) { const quantity = numberFor(name, 25, 120); const expiry = new Date(); expiry.setFullYear(expiry.getFullYear() + 2); const batch = await prisma.inventoryBatch.create({ data: { productId: product.id, supplierId: supplier.id, batchNumber, quantityReceived: quantity, quantityAvailable: quantity, purchasePrice: sellingPrice * 0.65, expiryDate: expiry } }); await prisma.stockMovement.create({ data: { productId: product.id, batchId: batch.id, type: 'RECEIPT', quantityChange: quantity, quantityBefore: 0, quantityAfter: quantity, reason: 'Generated retail demonstration stock', performedById: admin.id } }); } }
  const conceptIds = new Map((await prisma.drugConcept.findMany({ where: { normalizedName: { in: ['warfarin','aspirin','ibuprofen','sertraline'] } } })).map((item) => [item.normalizedName,item.id]));
  const interactions = [['warfarin','aspirin','MAJOR','Increased risk of serious bleeding.'],['warfarin','ibuprofen','MAJOR','NSAID use may increase gastrointestinal and systemic bleeding risk.'],['sertraline','ibuprofen','MODERATE','Combined use may increase bleeding tendency.']];
  for (const [first,second,severity,description] of interactions) { const ids=[conceptIds.get(first),conceptIds.get(second)].sort((a,b)=>a-b); if(ids.every(Boolean)) await prisma.drugInteraction.upsert({ where: { drugAId_drugBId_source: { drugAId:ids[0],drugBId:ids[1],source:'MediFlow demo clinical reference' } }, update:{severity,description}, create:{drugAId:ids[0],drugBId:ids[1],severity,description,management:'Review an authoritative interaction reference and assess patient-specific risk before dispensing.',source:'MediFlow demo clinical reference',version:'2026.1'} }); }
  console.log(`MediFlow demo data ready: ${createdProducts.length} medicine products, ${retailItems.length} retail items, 9 patients. Demo password: Demo123!`);
}

main().finally(() => prisma.$disconnect());
