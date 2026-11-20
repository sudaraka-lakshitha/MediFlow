// Clears all prescription, billing, delivery and transaction data from a MediFlow
// database while keeping master data: users and patients, products, categories,
// manufacturers, suppliers, stock batches (current quantities), discount rules,
// bank accounts, settings and drug-research data.
//
// Also clears the audit log, stock movement history and patient notices.
// A JSON backup of every deleted row is written first to backend/backups/.
//
// Run: npm --prefix backend run reset:transactions -- --certificate "C:/path/aiven-ca.pem"
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { X509Certificate } from 'node:crypto';

// Children before parents, so foreign keys never block a delete.
const DELETE_ORDER = [
  'prescriptionRetailItem', 'prescriptionInteraction', 'dispensingItem', 'prescriptionUploadAttachment',
  'uploadPaymentSlip', 'paymentRequestEvent', 'stockReservation', 'paymentSlip', 'deliveryRequest',
  'bankTransferAllocation', 'saleItem', 'salePayment', 'discountApplication', 'refundLine', 'refundApproval',
  'dailyBalanceConfirmation', 'pharmacyBalanceConfirmation', 'operationReceipt', 'workflowLease',
  'auditLog', 'stockMovement', 'patientNotice',
  'paymentRequestItem', 'bankTransfer', 'refund', 'prescriptionItem', 'sale', 'dispensing',
  'paymentRequest', 'prescription', 'prescriptionUpload',
];
const KEPT = 'users and patients, products, categories, manufacturers, suppliers, stock batches (current quantities), discount rules, bank accounts, settings, drug-research data';

if (process.argv.includes('--help')) {
  console.log(`Clears prescriptions, uploads, bills, payments, deliveries, invoices, refunds, reconciliations,\naudit log, stock movement history and patient notices. Keeps: ${KEPT}.\nUsage: npm --prefix backend run reset:transactions -- [--certificate "C:/path/aiven-ca.pem"] [--local]\n--local uses DATABASE_URL from backend/.env instead of asking for the Aiven URL.`);
  process.exit(0);
}
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Open PowerShell or another interactive terminal to run this command.');
  process.exit(1);
}

let muted = false;
const output = new Writable({ write(chunk, encoding, callback) { if (!muted) process.stdout.write(chunk, encoding); callback(); } });
const terminal = createInterface({ input: process.stdin, output, terminal: true });
terminal.on('SIGINT', () => { process.stdout.write('\nCancelled. Nothing was deleted.\n'); terminal.close(); process.exit(130); });
async function ask(label, hidden = false) {
  while (true) {
    muted = false;
    const answer = terminal.question(label);
    muted = hidden;
    let value;
    try { value = await answer; } finally { muted = false; if (hidden) process.stdout.write('\n'); }
    if (value.trim()) return value;
    console.log('No value received. Enter the requested value and press Enter.');
  }
}

// JSON that keeps Decimal, BigInt and file data readable.
const replacer = (_key, value) => {
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Uint8Array) return { base64: Buffer.from(value).toString('base64') };
  if (value && value.type === 'Buffer' && Array.isArray(value.data)) return { base64: Buffer.from(value.data).toString('base64') };
  return value;
};

let prisma;
try {
  const { PrismaClient } = await import('@prisma/client');
  let url;
  if (process.argv.includes('--local')) {
    const { config } = await import('dotenv');
    config({ path: resolve(import.meta.dirname, '../.env'), quiet: true });
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing from backend/.env.');
    url = new URL(process.env.DATABASE_URL);
  } else {
    console.log('Reset the hosted (Aiven) MediFlow database.');
    console.log('Paste your Render DATABASE_URL at the first prompt. Input will be hidden.');
    const rawUrl = (await ask('Aiven DATABASE_URL: ', true)).trim();
    try { url = new URL(rawUrl); } catch { throw new Error('Enter a valid MySQL connection URL.'); }
    if (url.protocol !== 'mysql:' || !url.hostname.endsWith('.aivencloud.com') || !url.username || !url.password || url.pathname.length < 2) {
      throw new Error('Enter your complete Aiven MySQL URL, including username, password, host and database.');
    }
    const certificateArgument = process.argv.indexOf('--certificate');
    const certificateInput = (certificateArgument === -1
      ? await ask('Downloaded Aiven CA certificate path (you can paste a quoted path): ')
      : process.argv[certificateArgument + 1] || '').trim().replace(/^"(.*)"$/, '$1');
    if (!certificateInput) throw new Error('A certificate file path is required.');
    const certificatePath = resolve(certificateInput);
    try { new X509Certificate(await readFile(certificatePath)); }
    catch { throw new Error('Cannot read a valid certificate at that path. Download the CA certificate from this Aiven service and try again.'); }
    url.searchParams.set('sslcert', certificatePath.replaceAll('\\', '/'));
    url.searchParams.set('sslaccept', 'strict');
  }
  url.searchParams.set('connection_limit', '1');
  const database = url.pathname.slice(1);
  prisma = new PrismaClient({ datasourceUrl: url.toString() });

  // 1. Show what will happen.
  const counts = {};
  for (const model of DELETE_ORDER) counts[model] = await prisma[model].count();
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const reservedBatches = await prisma.inventoryBatch.count({ where: { quantityReserved: { gt: 0 } } });
  console.log(`\nDatabase: ${url.hostname}/${database}`);
  console.log('Rows that will be deleted:');
  for (const [model, n] of Object.entries(counts)) if (n) console.log(`  ${model.padEnd(30)} ${n}`);
  console.log(`  ${'TOTAL'.padEnd(30)} ${total}`);
  console.log(`Stock batches with held (reserved) stock to release: ${reservedBatches}`);
  console.log(`Kept: ${KEPT}.`);
  if (!total && !reservedBatches) { console.log('\nNothing to delete. The database is already clean.'); process.exit(0); }

  const confirm = (await ask(`\nThis cannot be undone. Type RESET ${database} to continue: `)).trim();
  if (confirm !== `RESET ${database}`) throw new Error('Confirmation did not match. Nothing was deleted.');

  // 2. Backup every row that will be deleted.
  const folder = resolve(import.meta.dirname, '../backups', `reset-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  await mkdir(folder, { recursive: true });
  for (const model of DELETE_ORDER) {
    if (!counts[model]) continue;
    const rows = await prisma[model].findMany();
    await writeFile(join(folder, `${model}.json`), JSON.stringify(rows, replacer));
  }
  const batches = await prisma.inventoryBatch.findMany({ where: { quantityReserved: { gt: 0 } }, select: { id: true, quantityReserved: true } });
  await writeFile(join(folder, 'inventoryBatch.reserved.json'), JSON.stringify(batches, replacer));
  console.log(`Backup saved to ${folder}`);

  // 3. Delete everything in one transaction: all or nothing.
  await prisma.$transaction(async (tx) => {
    await tx.prescription.updateMany({ where: { originalPrescriptionId: { not: null } }, data: { originalPrescriptionId: null } });
    for (const model of DELETE_ORDER) {
      const { count } = await tx[model].deleteMany();
      if (count) console.log(`  deleted ${String(count).padStart(6)}  ${model}`);
    }
    const { count } = await tx.inventoryBatch.updateMany({ where: { quantityReserved: { gt: 0 } }, data: { quantityReserved: 0 } });
    console.log(`  released held stock on ${count} batch(es)`);
  }, { maxWait: 15_000, timeout: 180_000 });
  console.log('\nDone. Prescriptions, uploads, bills, payments, deliveries, invoices, refunds and history logs were cleared.');
  console.log('Stock quantities, products, users, patients, suppliers and settings are unchanged.');
} catch (error) {
  if (error.code === 'ERR_MODULE_NOT_FOUND') console.error('Install backend dependencies and generate Prisma Client first: npm ci, then npm run prisma:generate.');
  else if (error.code) console.error(`Reset failed (${error.code}): ${error.message}\nNothing was deleted if the failure happened before "Done".`);
  else console.error(error.message);
  process.exitCode = 1;
} finally {
  terminal.close();
  if (prisma) await prisma.$disconnect().catch(() => {});
}
