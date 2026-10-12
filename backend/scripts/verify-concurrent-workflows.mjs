// Independent process/connection tests, exclusively in a disposable local database.
import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { fork, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { PrismaClient } from '@prisma/client';
const source = process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;
const url = new URL(source);
assert(['localhost', '127.0.0.1', '[::1]'].includes(url.hostname), 'Local MySQL only.');
const mode = process.argv[2];
const self = fileURLToPath(import.meta.url);
const scratchPattern = /^qa_mediflow_concurrency_[a-f0-9]{12}$/;
if (!mode) {
  const name = `qa_mediflow_concurrency_${randomBytes(6).toString('hex')}`;
  const control = new PrismaClient({ datasourceUrl: source }); let created = false;
  try {
    assert(scratchPattern.test(name)); assert.notEqual(name, decodeURIComponent(url.pathname.slice(1)));
    await control.$executeRawUnsafe(`CREATE DATABASE \`${name}\``); created = true;
    const target = new URL(source); target.pathname = `/${name}`;
    const env = { ...process.env, DATABASE_URL: target.href, MYSQL_DATABASE_URL: target.href, AIVEN_PRISMA_URL: target.href, NODE_ENV: 'test' };
    const schema = spawnSync(process.execPath, [createRequire(import.meta.url).resolve('prisma/build/index.js'), 'db', 'push', '--skip-generate'], { env, encoding: 'utf8', windowsHide: true, timeout: 60000 });
    assert.equal(schema.status, 0, 'Disposable schema setup failed (no application schema changes attempted).');
    console.log(`Isolated test database: ${name}; no application data copied.`);
    const run = spawnSync(process.execPath, [self, '--run'], { env, encoding: 'utf8', windowsHide: true, timeout: 240000, maxBuffer: 4_000_000 });
    process.stdout.write(run.stdout || '');
    if (run.status !== 0) { process.stderr.write(run.stderr || 'Test process did not complete.'); process.exitCode = 1; }
  } finally {
    // Exact name created by this invocation only. Never drop the application DB.
    if (created) { assert(scratchPattern.test(name)); await control.$executeRawUnsafe(`DROP DATABASE \`${name}\``); console.log('Disposable test database removed; application database unchanged.'); }
    await control.$disconnect();
  }
} else {
  assert(scratchPattern.test(decodeURIComponent(url.pathname.slice(1))), 'Tests refuse to write outside their disposable database.');
  const { prisma } = await import('../src/config/prisma.js');
  const { saleService: sales } = await import('../src/services/sale.service.js');
  const { refundService: refunds } = await import('../src/services/refund.service.js');
  const { paymentRequestService: bills } = await import('../src/services/paymentRequest.service.js');
  const { prescriptionService: rx } = await import('../src/services/prescription.service.js');
  const { prescriptionUploadService: uploads } = await import('../src/services/prescriptionUpload.service.js');
  const { pharmacyReconciliationService: reconciliation } = await import('../src/services/pharmacyReconciliation.service.js');
  if (mode === '--worker') {
    await prisma.$connect();
    const [connection] = await prisma.$queryRawUnsafe('SELECT CONNECTION_ID() AS id');
    process.send({ ready: true, connectionId: Number(connection.id) });
    process.once('message', async ({ service, method, args }) => {
      try { await ({ sales, refunds, bills, rx, uploads, reconciliation })[service][method](...args); process.send({ ok: true }); }
      catch (error) { process.send({ ok: false, status: error.statusCode || null, code: error.code || null, message: error.message }); }
      finally { await prisma.$disconnect(); process.disconnect(); }
    });
  } else {
    const results = []; let seq = 0;
    const staff = await prisma.user.create({ data: { fullName: 'Synthetic QA administrator', email: 'qa-admin@example.invalid', passwordHash: 'not-a-login-hash', role: 'ADMIN', cashierAccess: true } });
    const user = await prisma.user.create({ data: { fullName: 'Synthetic QA customer', email: 'qa-customer@example.invalid', passwordHash: 'not-a-login-hash', role: 'PATIENT' } });
    const patient = await prisma.patientProfile.create({ data: { userId: user.id, patientNumber: 'QA-PATIENT', dateOfBirth: new Date('1990-01-01') } });
    const customer = { id: user.id, role: 'PATIENT' };
    const category = await prisma.category.create({ data: { name: 'Synthetic QA' } });
    async function product(quantity = 10, medicine = false) {
      const p = await prisma.product.create({ data: { sku: `QA-${++seq}`, genericName: 'Synthetic item', productType: medicine ? 'MEDICINE' : 'NON_MEDICINAL', strength: medicine ? '5 mg' : 'N/A', dosageForm: medicine ? 'Tablet' : 'Retail item', activeIngredient: medicine ? 'Synthetic ingredient' : null, unit: medicine ? 'tablet' : 'piece', sellingPrice: 100, prescriptionRequired: medicine, categoryId: category.id } });
      const batch = await prisma.inventoryBatch.create({ data: { productId: p.id, batchNumber: `QA-${seq}`, quantityReceived: quantity, quantityAvailable: quantity, purchasePrice: 25, expiryDate: new Date('2035-01-01') } });
      return { p, batch };
    }
    const saleInput = (p, quantity = 1) => ({ items: [{ productId: p.id, quantity }], tax: 0, amountPaid: 0, paymentMethod: 'CASH' });
    async function makeRx(p) {
      const prescription = await prisma.prescription.create({ data: { prescriptionNumber: `QA-RX-${++seq}`, patientId: patient.id, prescriberName: 'Synthetic prescriber', prescriptionDate: new Date(), createdById: staff.id, isOnline: true, items: { create: [{ productId: p.id, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, calculatedQuantity: 1, prescribedQuantity: 1, dosageInstructions: 'Synthetic QA only' }] } } });
      const sent = await rx.sendToCashier(prescription.id, staff.id);
      return { prescription: sent, bill: sent.paymentRequest, edit: { revision: sent.paymentRequest.revision, items: sent.items.map(i => ({ prescriptionItemId: i.id, quantity: 1 })), retailItems: [], tax: 0, containerFee: 0, couponCode: null, revisionReason: 'Synthetic concurrency test' } };
    }
    async function race(a, b) {
      const workers = [a,b].map(task => {
        const child = fork(self, ['--worker'], { env: process.env, stdio: ['ignore','ignore','ignore','ipc'], windowsHide: true });
        let readyResolve, resultResolve, resultReject;
        const ready = new Promise(resolve => { readyResolve = resolve; });
        const result = new Promise((resolve,reject) => { resultResolve = resolve; resultReject = reject; });
        const timer = setTimeout(() => { child.kill(); resultReject(new Error('Concurrent worker timed out.')); }, 30000);
        child.on('message', m => { if (m.ready) readyResolve(m.connectionId); else { clearTimeout(timer); resultResolve(m); } });
        child.on('error', e => { clearTimeout(timer); resultReject(e); });
        child.on('exit', code => { if (code) { clearTimeout(timer); resultReject(new Error(`Worker exited ${code}`)); } });
        return { child, task, ready, result };
      });
      try {
        const ids = await Promise.race([Promise.all(workers.map(w => w.ready)), Promise.all(workers.map(w => w.result))]);
        assert.notEqual(ids[0], ids[1], 'Independent MySQL connections required.');
        workers.forEach(w => w.child.send(w.task));
        return await Promise.all(workers.map(w => w.result));
      } finally { workers.forEach(w => { if (w.child.connected) w.child.disconnect(); }); }
    }
    const task = (service, method, ...args) => ({ service, method, args });
    async function pendingBank(p) {
      const r = await makeRx(p); await bills.acknowledge(r.bill.id,{revision:1,paymentChoice:'BANK_TRANSFER'},customer);
      const submitted = await bills.submitSlip(r.bill.id,{originalName:'synthetic.pdf',mimeType:'application/pdf',fileBase64:Buffer.from('%PDF-1.4 synthetic test').toString('base64'),declaredAmount:100,reference:'SYNTHETIC'},customer);
      return { ...r, slipId:submitted.slips[0].id };
    }
    const single = outcomes => { assert.equal(outcomes.filter(o => o.ok).length, 1, JSON.stringify(outcomes)); assert(outcomes.filter(o => !o.ok).every(o => o.status >= 400 && o.status < 500), JSON.stringify(outcomes)); };
    async function check(name, fn) { try { await fn(); results.push({ name, status: 'PASS' }); } catch(e) { results.push({ name, status: 'ISSUE', detail: e.message }); } console.log(JSON.stringify(results.at(-1))); }
    try {
      await check('Concurrent pharmacy confirmations create only one approval', async () => {
        const day='2000-01-01';
        const summary=await reconciliation.summary(day,staff);
        const input={day,fingerprint:summary.fingerprint,openingCash:0,countedCash:0,verified:{BANK_TRANSFER:{received:0,refunded:0},CARD:{received:0,refunded:0}},referencesChecked:true};
        const op=task('reconciliation','confirm',input,staff);
        const outcomes=await race(op,op);
        assert(outcomes.every(outcome=>outcome.ok),JSON.stringify(outcomes));
        assert.equal(await prisma.pharmacyBalanceConfirmation.count({where:{day}}),1);
        assert.equal(await prisma.auditLog.count({where:{action:'PHARMACY_BALANCE_CONFIRMED'}}),1);
      });
      for (let round = 1; round <= 3; round++) {
        await check(`R${round}: two retail sales compete for the last unit`, async () => {
          const {p,batch} = await product(1); const op = task('sales','createRetail',saleInput(p),staff.id);
          single(await race(op,op)); assert.equal(Number((await prisma.inventoryBatch.findUnique({where:{id:batch.id}})).quantityAvailable),0);
          assert.equal(await prisma.saleItem.count({where:{productId:p.id}}),1);
        });
        await check(`R${round}: duplicate direct-sale payment`, async () => {
          const {p} = await product(); const sale = await sales.createRetail(saleInput(p),staff.id);
          const op = task('sales','pay',sale.id,100,'CASH',staff.id,null); single(await race(op,op));
          assert.equal(await prisma.salePayment.count({where:{saleId:sale.id}}),1);
        });
        await check(`R${round}: partial refund authorization, payout and stock review duplicates`, async () => {
          const {p,batch} = await product(); const sale = await sales.createRetail(saleInput(p,2),staff.id); await sales.pay(sale.id,200,'CASH',staff.id);
          const op = task('refunds','create',sale.id,{expectedRefundCount:0,reason:'Synthetic partial return',items:[{saleItemId:sale.items[0].id,quantity:1}]},staff);
          single(await race(op,op)); const refund = await prisma.refund.findFirst({where:{saleId:sale.id},include:{lines:true}});
          assert.equal(Number(refund.amount),100); assert.equal(await prisma.refund.count({where:{saleId:sale.id}}),1);
          const pay = task('refunds','settle',refund.id,{method:'CASH',reference:'QA-ONLY',payoutConfirmed:true},staff); single(await race(pay,pay));
          assert.equal(await prisma.auditLog.count({where:{action:'REFUND_PAYOUT_CONFIRMED',entityId:refund.id}}),1);
          const restock = task('refunds','reviewStock',refund.lines[0].id,{decision:'RESTOCKED',reason:'Synthetic inspection'},staff); single(await race(restock,restock));
          assert.equal(Number((await prisma.inventoryBatch.findUnique({where:{id:batch.id}})).quantityAvailable),9);
        });
        await check(`R${round}: two customer reservations compete for last unit`, async () => {
          const {p,batch} = await product(1,true); const a = await makeRx(p); const b = await makeRx(p);
          single(await race(task('bills','acknowledge',a.bill.id,{revision:1,paymentChoice:'CASH'},customer),task('bills','acknowledge',b.bill.id,{revision:1,paymentChoice:'CASH'},customer)));
          assert.equal(Number((await prisma.inventoryBatch.findUnique({where:{id:batch.id}})).quantityReserved),1); assert.equal(await prisma.stockReservation.count({where:{batchId:batch.id}}),1);
        });
        await check(`R${round}: simultaneous financial edits reject a stale revision`, async () => {
          const {p} = await product(10,true); const r = await makeRx(p);
          single(await race(task('bills','update',r.prescription.id,{...r.edit,tax:1},staff.id),task('bills','update',r.prescription.id,{...r.edit,tax:2},staff.id)));
          const bill = await prisma.paymentRequest.findUnique({where:{id:r.bill.id}}); assert.equal(bill.revision,2); assert.equal(bill.acknowledgedRevision,null);
        });
        await check(`R${round}: invoice edit racing customer acknowledgement`, async () => {
          const {p} = await product(10,true); const r = await makeRx(p);
          const outcomes = await race(task('bills','update',r.prescription.id,{...r.edit,tax:1},staff.id),task('bills','acknowledge',r.bill.id,{revision:1,paymentChoice:'CASH'},customer));
          assert(outcomes[0].ok,JSON.stringify(outcomes)); assert(outcomes[1].ok || outcomes[1].status === 409,JSON.stringify(outcomes));
          const bill = await prisma.paymentRequest.findUnique({where:{id:r.bill.id}}); assert.equal(bill.revision,2); assert.equal(bill.acknowledgedRevision,null); assert.equal(await prisma.stockReservation.count({where:{paymentRequestId:bill.id}}),0);
        });
        await check(`R${round}: duplicate prescription payment and collection`, async () => {
          const {p,batch} = await product(10,true); const r = await makeRx(p); await bills.acknowledge(r.bill.id,{revision:1,paymentChoice:'CASH'},customer);
          const pay = task('bills','pay',r.bill.id,'CASH',staff.id,null,{tenderedAmount:100,changeAmount:0,confirmHandover:false}); single(await race(pay,pay));
          assert.equal(await prisma.paymentRequestEvent.count({where:{paymentRequestId:r.bill.id,kind:'PAYMENT_RECEIVED'}}),1);
          // Use the real encrypted-PIN accessor; do not disable pickup verification.
          const detail = await bills.documentData(r.bill.id,customer,true);
          const collect = task('rx','dispense',r.prescription.id,{paymentRequestId:r.bill.id,pickupPin:detail.pickupPin,items:r.prescription.items.map(i=>({prescriptionItemId:i.id,quantity:1}))},staff.id);
          single(await race(collect,collect)); assert.equal(Number((await prisma.inventoryBatch.findUnique({where:{id:batch.id}})).quantityAvailable),9); assert.equal(await prisma.sale.count({where:{paymentRequestId:r.bill.id}}),1);
        });
        await check(`R${round}: duplicate bank-slip approval`, async () => {
          const {p,batch} = await product(10,true); const r = await pendingBank(p);
          const op = task('bills','reviewSlip',r.bill.id,r.slipId,{approved:true,verifiedAmount:100,verifiedReference:`QA-BANK-${r.bill.id}`},staff);
          single(await race(op,op)); assert.equal(await prisma.paymentRequestEvent.count({where:{paymentRequestId:r.bill.id,kind:'PAYMENT_RECEIVED'}}),1);
          assert.equal(Number((await prisma.inventoryBatch.findUnique({where:{id:batch.id}})).quantityReserved),1);
        });
        await check(`R${round}: same bank reference cannot pay two invoices concurrently`, async () => {
          const a = await pendingBank((await product(10,true)).p); const b = await pendingBank((await product(10,true)).p);
          const decision = {approved:true,verifiedAmount:100,verifiedReference:`QA-SHARED-${round}`};
          single(await race(task('bills','reviewSlip',a.bill.id,a.slipId,decision,staff),task('bills','reviewSlip',b.bill.id,b.slipId,decision,staff)));
          assert.equal(await prisma.paymentRequest.count({where:{id:{in:[a.bill.id,b.bill.id]},status:'PAID'}}),1);
        });
        await check(`R${round}: quotation revision racing customer acceptance`, async () => {
          const {p} = await product(10,true);
          const upload = await uploads.create({originalName:'synthetic.txt',mimeType:'text/plain',fileBase64:Buffer.from('Synthetic prescription test only').toString('base64'),orderedForSelf:true,prepareRequested:false},customer.id);
          const input = {items:[{productId:p.id,quantity:1}],retailItems:[],tax:0,containerFee:0};
          await uploads.estimateQuote(upload.id,input); await uploads.review(upload.id,{status:'AVAILABLE',estimatedTotal:100},staff.id);
          const sent = await uploads.sendQuotation(upload.id,staff.id);
          const outcomes = await race(task('uploads','estimateQuote',upload.id,{...input,tax:1}),task('uploads','acceptEstimate',upload.id,customer.id,sent.quoteRevision));
          assert(outcomes.some(o=>o.ok),JSON.stringify(outcomes)); assert(outcomes.every(o=>o.ok || o.status===409),JSON.stringify(outcomes));
          const after = await prisma.prescriptionUpload.findUnique({where:{id:upload.id}});
          if (after.status==='QUOTE_ACCEPTED') { assert.equal(after.acknowledgedQuoteRevision,after.quoteRevision); assert.equal(Number(after.estimatedTotal),100); }
          else { assert.equal(after.acknowledgedQuoteRevision,null); assert.equal(Number(after.estimatedTotal),101); }
        });
      }
      console.log(JSON.stringify({groups:results.length,passed:results.filter(r=>r.status==='PASS').length,issues:results.filter(r=>r.status==='ISSUE').length}));
      if (results.some(r=>r.status==='ISSUE')) process.exitCode=1;
    } finally { await prisma.$disconnect(); }
  }
}
