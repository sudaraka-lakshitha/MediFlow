// Diagnostic audit only. Every scenario uses disposable records in a transaction
// that is rolled back. No existing invoice is paid, cancelled, or dispensed.
import assert from 'node:assert/strict';
import { prisma } from '../src/config/prisma.js';
import { prescriptionService as rxService } from '../src/services/prescription.service.js';
import { paymentRequestService as bills } from '../src/services/paymentRequest.service.js';
import { prescriptionUploadService as uploads } from '../src/services/prescriptionUpload.service.js';
import { patientService } from '../src/services/patient.service.js';
import { saleService } from '../src/services/sale.service.js';
import { refundService } from '../src/services/refund.service.js';
import { reconciliationService } from '../src/services/reconciliation.service.js';
import { localDateKey } from '../src/utils/localDate.js';
import { cleanupExpiredCashReservations } from '../src/utils/reservationExpiry.js';

const originalTransaction = prisma.$transaction.bind(prisma);
const delegates = Object.fromEntries(Object.keys(prisma).filter((key) => !key.startsWith('_') && !key.startsWith('$') && typeof prisma[key]?.findMany === 'function').map((key) => [key, prisma[key]]));
const results = [];
let sequence = 0;
const marker = `AUDIT-${Date.now()}`;
async function scenario(name, run) {
  const rollback = new Error('ROLLBACK_AUDIT');
  let result;
  try {
    await originalTransaction(async (tx) => {
      prisma.$transaction = (fn) => fn(tx);
      for (const key of Object.keys(delegates)) prisma[key] = tx[key];
      const staff = await tx.user.findFirst({ where: { role: 'ADMIN', active: true } });
      const patient = await tx.patientProfile.findFirst({ where: { dateOfBirth: { lt: new Date('2000-01-01') }, user: { active: true } } });
      const candidates = await tx.product.findMany({ where: { active: true, productType: 'MEDICINE', minimumAgeYears: null, maximumAgeYears: null }, include: { batches: { where: { expiryDate: { gt: new Date() }, restricted: false } } } });
      const products = candidates.filter((p) => p.batches.reduce((s,b) => s + Number(b.quantityAvailable) - Number(b.quantityReserved), 0) > 5).slice(0, 3);
      assert(staff && patient && products.length === 3, 'Audit needs demo staff, an adult patient and three stocked medicines');
      const customer = { id: patient.userId, role: 'PATIENT' };
      const clinical = (profileId = patient.id) => ({ patientId: profileId, prescriberName: 'Audit fixture only', prescriptionDate: new Date(), orderedForSelf: true, refillsAllowed: 1, retailItems: [], items: products.map((p) => ({ productId: p.id, quantityPerDose: 1, timesPerDay: 1, daysSupply: 1, dosageInstructions: 'Audit fixture only', administrationRoute: 'Oral', mealTiming: 'ANY_TIME', asNeeded: false })) });
      const make = async (online = false, profileId = patient.id, quantity = 1) => {
        const data = clinical(profileId);
        const rx = await tx.prescription.create({ data: { ...data, retailItems: undefined, prescriptionNumber: `${marker}-${++sequence}`, isOnline: online, createdById: staff.id, items: { create: data.items.map((i) => ({ ...i, daysSupply: quantity, prescribedQuantity: quantity, calculatedQuantity: quantity })) } }, include: { items: true } });
        const sent = await rxService.sendToCashier(rx.id, staff.id);
        return { rx: sent, bill: sent.paymentRequest, input: { revision: sent.paymentRequest.revision, items: sent.items.map((i) => ({ prescriptionItemId: i.id, quantity })), retailItems: [], tax: 0, containerFee: 0, couponCode: null } };
      };
      const pay = (bill) => bills.pay(bill.id, 'CASH', staff.id, null, { tenderedAmount: Number(bill.total), changeAmount: 0, confirmHandover: false });
      const collect = (rx, paid) => rxService.dispense(rx.id, { paymentRequestId: paid.data.id, pickupPin: paid.pickupPin, items: paid.data.items.filter((i) => i.prescriptionItemId).map((i) => ({ prescriptionItemId: i.prescriptionItemId, quantity: Number(i.quantity) })) }, staff.id);
      const bank = async (bill, declaredAmount = Number(bill.total)) => {
        await bills.acknowledge(bill.id, { revision: bill.revision, paymentChoice: 'BANK_TRANSFER' }, customer);
        const submitted = await bills.submitSlip(bill.id, { originalName: 'audit-only.pdf', mimeType: 'application/pdf', fileBase64: Buffer.from('%PDF-1.4 audit fixture').toString('base64'), declaredAmount, reference: marker }, customer);
        return { submitted, approved: () => bills.reviewSlip(bill.id, submitted.slips[0].id, { approved: true, verifiedAmount: declaredAmount, verifiedReference: `${marker}-${bill.id}` }, staff) };
      };
      try { await run({ tx, staff, patient, products, customer, clinical, make, pay, collect, bank }); result = { name, status: 'PASS' }; }
      catch (error) { result = { name, status: 'ISSUE', detail: error.message }; }
      throw rollback;
    }, { timeout: 30000 });
  } catch (error) { if (error !== rollback) result = { name, status: 'BLOCKED', detail: error.message }; }
  finally { prisma.$transaction = originalTransaction; for (const [key,value] of Object.entries(delegates)) prisma[key] = value; }
  results.push(result); console.log(JSON.stringify(result));
}

await scenario('Walk-in patient without online account: bill, cash, collection, duplicate prevention', async ({staff,make,pay,collect,tx}) => {
  const person = await patientService.create({ onlineAccess: false, fullName: 'Disposable audit walk-in', dateOfBirth: new Date('1990-01-01') }, staff);
  assert.equal(person.user.active, false);
  const {rx,bill} = await make(false, person.id);
  const paid = await pay(bill);
  const dispensed = await collect(rx,paid);
  assert.equal(dispensed.prescriptionStatus, 'DISPENSED');
  await assert.rejects(collect(rx,paid), /payment has not been completed/);
  assert.equal(await tx.stockReservation.count({where:{paymentRequestId:bill.id}}),0);
});
await scenario('Online upload through quotation, acceptance and final billing', async ({clinical,customer,staff,products,tx}) => {
  let upload = await uploads.create({ originalName: 'audit.txt', mimeType: 'text/plain', fileBase64: Buffer.from('Audit prescription fixture only').toString('base64'), orderedForSelf:true,prepareRequested:false },customer.id);
  await uploads.estimateQuote(upload.id,{items:products.map(p=>({productId:p.id,quantity:1})),retailItems:[],tax:0,containerFee:0});
  upload = await tx.prescriptionUpload.findUnique({where:{id:upload.id}});
  await uploads.review(upload.id,{status:'AVAILABLE',estimatedTotal:Number(upload.estimatedTotal)},staff.id);
  upload = await uploads.sendQuotation(upload.id,staff.id);
  await uploads.acceptEstimate(upload.id,customer.id,upload.quoteRevision);
  const rx=await rxService.create({...clinical(),sourceUploadId:upload.id,sendToCashier:true},staff.id);
  assert.equal(rx.status,'VERIFIED');
  const bill=await tx.paymentRequest.findUnique({where:{prescriptionId:rx.id}});
  assert(bill && bill.acknowledgedRevision===null);
});
await scenario('Online payment blocks until current invoice acknowledgement', async ({make,pay}) => {
  const {bill}=await make(true); await assert.rejects(pay(bill),/acknowledge the latest invoice/);
});
await scenario('Bank transfer exact amount reserves stock without dispensing', async ({make,bank,tx}) => {
  const {bill}=await make(true); const {approved}=await bank(bill); const result=await approved();
  assert.equal(result.data.status,'PAID');assert.equal(result.dispensed,null);
  assert(await tx.stockReservation.count({where:{paymentRequestId:bill.id}})>0);
});
await scenario('Underpaid bank transfer must not be silently recorded as fully paid', async ({make,bank}) => {
  const {bill}=await make(true); const {approved}=await bank(bill,1);
  let result;try{result=await approved();}catch(error){if(error.statusCode===409||error.statusCode===400)return;throw error;}
  assert(Number(result.data.amountPaid)===1 && result.data.status!=='PAID',`Declared Rs. 1, recorded Rs. ${result.data.amountPaid}, status ${result.data.status}`);
});
await scenario('Overpaid bank transfer preserves actual amount and excess', async ({make,bank}) => {
  const {bill}=await make(true);const amount=Number(bill.total)+50;const {approved}=await bank(bill,amount);
  let result;try{result=await approved();}catch(error){if(error.statusCode===409||error.statusCode===400)return;throw error;}
  assert.equal(Number(result.data.amountPaid),amount,'Excess bank payment was discarded');
});
await scenario('Rejected slip permits payment-choice change and retry', async ({make,bank,customer,staff}) => {
  const {bill}=await make(true);const {submitted}=await bank(bill);
  await assert.rejects(bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},customer,true),/awaiting payment/);
  await bills.reviewSlip(bill.id,submitted.slips[0].id,{approved:false,reason:'Audit rejection'},staff);
  const changed=await bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},customer,true);
  assert.equal(changed.status,'AWAITING_PAYMENT');assert(changed.reservationExpiresAt);
});
await scenario('Cash hold expiry and renewal preserve invoice approval', async ({make,customer,tx}) => {
  const {bill}=await make(true);await bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},customer);
  await tx.paymentRequest.update({where:{id:bill.id},data:{reservationExpiresAt:new Date(Date.now()-1000)}});
  await cleanupExpiredCashReservations();
  const expired=await tx.paymentRequest.findUnique({where:{id:bill.id}});assert.equal(expired.acknowledgedRevision,bill.revision);
  assert.equal(await tx.stockReservation.count({where:{paymentRequestId:bill.id}}),0);
  const renewed=await bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},customer,true);assert(renewed.reservationExpiresAt>new Date());
});
await scenario('Unpaid partial cancellation resets acknowledgement and records reason', async ({make,customer,staff}) => {
  const {bill}=await make(true);await bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},customer);
  const revised=await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[bill.items[0].id],reason:'Audit removal'},staff);
  assert.equal(revised.acknowledgedRevision,null);assert.equal(revised.items.length,2);assert(revised.events.some(e=>e.details?.reason==='Audit removal'));
});
await scenario('Retain-confirmation partial cancellation keeps approval and remaining hold', async ({make,customer,staff,tx}) => {
  const {bill}=await make(true);await bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},customer);
  const revised=await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[bill.items[0].id],reason:'Audit agreed removal',skipCustomerReconfirmation:true},staff);
  assert.equal(revised.acknowledgedRevision,revised.revision);assert.equal(await tx.stockReservation.count({where:{paymentRequestId:bill.id}}),2);
});
await scenario('Paid partial refund then remaining collection balances money and stock', async ({make,pay,collect,staff}) => {
  const {rx,bill}=await make();const paid=await pay(bill);
  const revised=await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[bill.items[0].id],reason:'Audit partial refund'},staff);
  assert.equal(Number(revised.amountPaid)-Number(revised.refundedAmount),Number(revised.total));
  const dispensed=await collect(rx,{...paid,data:revised});assert.equal(dispensed.prescriptionStatus,'DISPENSED');
});
await scenario('Sequential partial then full refund never exceeds payment', async ({make,pay,staff}) => {
  const {bill}=await make();await pay(bill);
  await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[bill.items[0].id],reason:'Audit partial refund'},staff);
  const cancelled=await bills.cancel(bill.id,'Audit remaining refund',staff);
  assert.equal(Number(cancelled.refundedAmount),Number(bill.total));
  await assert.rejects(bills.cancel(bill.id,'Repeat',staff),/already been cancelled/);
});
await scenario('Wrong collection PIN leaves payment and stock unchanged', async ({make,pay,tx,staff}) => {
  const {rx,bill}=await make();const paid=await pay(bill);
  await assert.rejects(rxService.dispense(rx.id,{paymentRequestId:bill.id,pickupPin:paid.pickupPin==='000000'?'111111':'000000',items:rx.items.map(i=>({prescriptionItemId:i.id,quantity:1}))},staff.id),/PIN is incorrect/);
  assert.equal((await tx.paymentRequest.findUnique({where:{id:bill.id}})).status,'PAID');
});
await scenario('Post-collection refund, settlement and pharmacist stock review are separate', async ({make,pay,collect,staff,tx}) => {
  const {rx,bill}=await make();const paid=await pay(bill);const supplied=await collect(rx,paid);
  const sale=await tx.sale.findUnique({where:{id:supplied.saleId},include:{items:true}});
  const input={expectedRefundCount:0,reason:'Audit return',items:[{saleItemId:sale.items[0].id,quantity:1}]};
  const before=await tx.inventoryBatch.findUnique({where:{id:sale.items[0].batchId}});
  const refund=await refundService.create(sale.id,input,staff);
  assert.equal(refund.status,'PENDING');
  const queued=await tx.inventoryBatch.findUnique({where:{id:sale.items[0].batchId}});
  assert.equal(String(queued.quantityAvailable),String(before.quantityAvailable));
  await assert.rejects(refundService.create(sale.id,input,staff),/history changed/);
  await assert.rejects(refundService.reviewStock(refund.lines[0].id,{decision:'RESTOCKED',reason:'Audit review'},{...staff,role:'CASHIER'}),/pharmacist/);
  await refundService.settle(refund.id,{method:'CASH',reference:'Audit payout receipt',payoutConfirmed:true},staff);
  await assert.rejects(refundService.settle(refund.id,{method:'CASH',reference:'Repeat',payoutConfirmed:true},staff),/no longer/);
  await refundService.reviewStock(refund.lines[0].id,{decision:'RESTOCKED',reason:'Audit inspection'}, {...staff,role:'PHARMACIST'});
  const returned=await tx.inventoryBatch.findUnique({where:{id:sale.items[0].batchId}});
  assert.equal(Number(returned.quantityAvailable),Number(before.quantityAvailable)+1);
  await assert.rejects(refundService.reviewStock(refund.lines[0].id,{decision:'RESTOCKED',reason:'Repeat'},staff),/already/);
});
await scenario('Prescriber-reference edit preserves previously cancelled medicine quantities', async ({make,staff,pay,clinical,tx}) => {
  const {rx,bill}=await make();await pay(bill);
  await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[bill.items[0].id],reason:'Audit remove'},staff);
  await bills.cancel(bill.id,'Withdraw remainder',staff);
  const current=await rxService.get(rx.id,staff);
  const saved=await rxService.update(rx.id,{...clinical(),items:current.items,prescriberReference:'Corrected reference'},staff.id);
  const item=await tx.prescriptionItem.findFirst({where:{prescriptionId:rx.id,productId:bill.items[0].productId}});
  assert.equal(Number(item.cancelledQuantity),1,`Cancelled quantity reset to ${item.cancelledQuantity}; status ${saved.status}`);
});

await scenario('Declining a stale displayed invoice must not cancel a newer revision', async ({make,customer}) => {
  const {bill}=await make(true);
  // The UI's decline payload contains only a reason, so the service has no
  // displayed revision to compare even after another staff edit completes.
  await prisma.paymentRequest.update({where:{id:bill.id},data:{revision:{increment:1},tax:5,total:{increment:5}}});
  await assert.rejects(bills.declineByPatient(bill.id,'Decline old displayed total',customer,bill.revision),/just updated/);
});
await scenario('Removing all invoice items preserves the cancellation response contract', async ({make,staff,pay}) => {
  const {bill}=await make();await pay(bill);
  const result=await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:bill.items.map(i=>i.id),reason:'Audit all-item refund'},staff);
  assert.equal(Number(result.refundAmount),Number(bill.total),'All-item path omits refundAmount used by the partial-cancel controller');
});
await scenario('Refunded invoice history includes customer-decline reason after earlier revisions', async ({make,customer,staff,input}) => {
  const record=await make(true);
  await bills.update(record.rx.id,{...record.input,tax:5,revisionReason:'Audit revised tax'},staff.id);
  const cancelled=await bills.declineByPatient(record.bill.id,'Declined because collection is too late',customer,record.bill.revision+1);
  assert(cancelled.events.some(e=>e.details?.reason?.includes('collection is too late')),'Customer decline has no event; history component ignores cancellationReason when other events exist');
});
await scenario('Pending customer cancellation requires resolution before collection', async ({make,customer,staff,bank,collect}) => {
  const {rx,bill}=await make(true);const {approved}=await bank(bill);const paid=await approved();
  await bills.requestCancellation(bill.id,'Please cancel; do not supply',customer);
  let result;try{result=await collect(rx,paid);}catch(error){if(error.statusCode===409)return;throw error;}
  assert.fail(`Cancellation request was not resolved; prescription became ${result.prescriptionStatus}`);
});
await scenario('Saving an unchanged quotation preserves customer acceptance', async ({customer,staff,products,tx}) => {
  let upload=await uploads.create({originalName:'audit.txt',mimeType:'text/plain',fileBase64:Buffer.from('Audit fixture').toString('base64'),orderedForSelf:true,prepareRequested:false},customer.id);
  const input={items:products.map(p=>({productId:p.id,quantity:1})),retailItems:[],tax:0,containerFee:0};
  await uploads.estimateQuote(upload.id,input);
  upload=await tx.prescriptionUpload.findUnique({where:{id:upload.id}});
  await uploads.review(upload.id,{status:'AVAILABLE',estimatedTotal:Number(upload.estimatedTotal)},staff.id);
  upload=await uploads.sendQuotation(upload.id,staff.id);
  await uploads.acceptEstimate(upload.id,customer.id,upload.quoteRevision);
  await uploads.estimateQuote(upload.id,input);
  const current=await tx.prescriptionUpload.findUnique({where:{id:upload.id}});
  assert.equal(current.acknowledgedQuoteRevision,upload.quoteRevision,`Identical save cleared approval and moved status to ${current.status}`);
});

await scenario('Quotation changed between validation and conversion cannot be billed', async ({clinical,customer,staff,products,tx}) => {
  let upload=await uploads.create({originalName:'audit.txt',mimeType:'text/plain',fileBase64:Buffer.from('Audit fixture').toString('base64'),orderedForSelf:true,prepareRequested:false},customer.id);
  const input={items:products.map(p=>({productId:p.id,quantity:1})),retailItems:[],tax:0,containerFee:0};
  await uploads.estimateQuote(upload.id,input);
  upload=await tx.prescriptionUpload.findUnique({where:{id:upload.id}});
  await uploads.review(upload.id,{status:'AVAILABLE',estimatedTotal:Number(upload.estimatedTotal)},staff.id);
  upload=await uploads.sendQuotation(upload.id,staff.id);
  await uploads.acceptEstimate(upload.id,customer.id,upload.quoteRevision);
  // Deterministic interleaving, not a load/concurrency benchmark: change the
  // quote after create's preflight checks, immediately before its transaction.
  const transaction=prisma.$transaction;
  let injected=false;
  prisma.$transaction=async(fn)=>{
    if(!injected){injected=true;await uploads.estimateQuote(upload.id,{...input,tax:5});}
    return transaction(fn);
  };
  let result;
  try{result=await rxService.create({...clinical(),sourceUploadId:upload.id,sendToCashier:true},staff.id);}
  catch(error){if(error.statusCode===409)return;throw error;}
  finally{prisma.$transaction=transaction;}
  assert.fail(`Unaccepted changed quotation still created ${result.status} prescription`);
});
await scenario('Customer cannot read or acknowledge another patient invoice', async ({make,customer}) => {
  const {bill}=await make(true);const stranger={...customer,id:-1};
  await assert.rejects(bills.get(bill.id,stranger),/does not belong|not found/);
  await assert.rejects(bills.acknowledge(bill.id,{revision:bill.revision,paymentChoice:'CASH'},stranger),/does not belong/);
});
await scenario('Quotation acceptance rejects a stale revision', async ({customer,staff,products,tx}) => {
  let upload=await uploads.create({originalName:'audit.txt',mimeType:'text/plain',fileBase64:Buffer.from('Audit fixture').toString('base64'),orderedForSelf:true,prepareRequested:false},customer.id);
  await uploads.estimateQuote(upload.id,{items:products.map(p=>({productId:p.id,quantity:1})),retailItems:[],tax:0,containerFee:0});
  upload=await tx.prescriptionUpload.findUnique({where:{id:upload.id}});
  await uploads.review(upload.id,{status:'AVAILABLE',estimatedTotal:Number(upload.estimatedTotal)},staff.id);
  upload=await uploads.sendQuotation(upload.id,staff.id);
  await assert.rejects(uploads.acceptEstimate(upload.id,customer.id,upload.quoteRevision-1),/quotation has changed/);
});

for (const paidFirst of [false,true]) await scenario(`Quantity-level prescription cancellation (${paidFirst?'paid':'unpaid'}) keeps remaining units collectible`, async ({make,pay,staff,tx,collect}) => {
  const {rx,bill}=await make(false,undefined,3);
  const paid=paidFirst?await pay(bill):null;
  const line=bill.items[0];
  const revised=await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[line.id],quantities:{[line.id]:1},reason:'Audit one-unit cancellation'},staff);
  assert.equal(Number(revised.items.find(i=>i.id===line.id).quantity),2);
  assert.equal(Number((await tx.prescriptionItem.findUnique({where:{id:line.prescriptionItemId}})).cancelledQuantity),1);
  if(paidFirst) {
    const held=await tx.stockReservation.findMany({where:{paymentRequestItemId:line.id}});
    assert.equal(held.reduce((sum,row)=>sum+Number(row.quantity),0),2);
    await collect(rx,{...paid,data:revised});
  } else { const payment=await pay(revised);await collect(rx,payment); }
  assert.equal((await tx.prescription.findUnique({where:{id:rx.id}})).status,'DISPENSED');
});

await scenario('Retail partial refunds retain stock until pharmacist review and reject duplicate returns', async ({tx,staff}) => {
  const candidates = await tx.product.findMany({where:{active:true,prescriptionRequired:false,productType:'NON_MEDICINAL',minimumAgeYears:null,maximumAgeYears:null},include:{batches:true}});
  const product = candidates.find(p=>p.batches.some(b=>!b.restricted && b.expiryDate>new Date() && Number(b.quantityAvailable)-Number(b.quantityReserved)>=3));
  assert(product,'A stocked non-medicinal retail product is required');
  const sale = await saleService.createRetail({items:[{productId:product.id,quantity:3}],tax:0,amountPaid:0,paymentMethod:'CASH'},staff.id);
  const bankPart=Math.floor(Number(sale.total)*50)/100;
  await saleService.pay(sale.id,bankPart,'BANK_TRANSFER',staff.id,`${marker}-retail`);
  await saleService.pay(sale.id,Number(sale.total)-bankPart,'CASH',staff.id,null);
  const item = sale.items[0];
  const before = await tx.inventoryBatch.findUnique({where:{id:item.batchId}});
  const input = {expectedRefundCount:0,reason:'Audit partial retail return',items:[{saleItemId:item.id,quantity:1}]};
  const refund = await refundService.create(sale.id,input,staff);
  assert.equal(refund.status,'PENDING');
  assert.equal(Number((await tx.inventoryBatch.findUnique({where:{id:item.batchId}})).quantityAvailable),Number(before.quantityAvailable));
  await refundService.settle(refund.id,{method:'CASH',reference:`${marker}-cash-payout`,payoutConfirmed:true},staff);
  const daily=await reconciliationService.summary(localDateKey(new Date()),staff);
  const movement=daily.entries.find(entry=>entry.id===`refund-${refund.id}`);
  assert(movement.originalMethod.includes('BANK_TRANSFER') && movement.originalMethod.includes('CASH'),'Mixed original payment methods must both remain visible');
  await refundService.reviewStock(refund.lines[0].id,{decision:'NOT_RESTOCKED',reason:'Package opened; not saleable'},staff);
  assert.equal(Number((await tx.inventoryBatch.findUnique({where:{id:item.batchId}})).quantityAvailable),Number(before.quantityAvailable));
  await assert.rejects(refundService.create(sale.id,input,staff),/history changed/);
  await assert.rejects(refundService.create(sale.id,{...input,expectedRefundCount:1,items:[{saleItemId:item.id,quantity:3}]},staff),/remaining sold quantity/);
});
await scenario('Daily reconciliation tracks bank receipts refunded in cash, rejects mismatches and invalidates an old confirmation', async ({tx,staff,make,bank}) => {
  const cashier = await tx.user.create({data:{email:`${marker}-cashier@patients.mediflow.invalid`,passwordHash:staff.passwordHash,fullName:'Disposable reconciliation cashier',role:'CASHIER'}});
  const {bill}=await make(true);const {submitted}=await bank(bill);
  await bills.reviewSlip(bill.id,submitted.slips[0].id,{approved:true,verifiedAmount:Number(bill.total),verifiedReference:`${marker}-reconcile`},cashier);
  const day=localDateKey(new Date());
  await bills.partialCancel(bill.id,{revision:bill.revision,itemIds:[bill.items[0].id],reason:'Audit bank-to-cash refund'},cashier);
  const refund=await tx.refund.findFirst({where:{paymentRequestId:bill.id}});
  let summary=await reconciliationService.summary(day,cashier);
  assert.equal(summary.pendingRefunds,1);assert.equal(summary.totals.CASH.refunded,0);
  await refundService.settle(refund.id,{method:'CASH',reference:`${marker}-cash`,payoutConfirmed:true},cashier);
  summary=await reconciliationService.summary(day,cashier);
  assert.equal(summary.totals.BANK_TRANSFER.received,Number(bill.total));
  assert.equal(summary.totals.CASH.refunded,Number(refund.amount));
  assert.equal(summary.entries.filter(e=>e.direction==='OUT').length,1,'Payout must not be double counted');
  assert.equal(summary.entries.find(e=>e.direction==='OUT').originalMethod,'BANK_TRANSFER');
  const input={day,fingerprint:summary.fingerprint,openingCash:Number(refund.amount)+100,countedCash:100,verified:{BANK_TRANSFER:{received:Number(bill.total),refunded:0},CARD:{received:0,refunded:0}},referencesChecked:true};
  await assert.rejects(reconciliationService.confirm({...input,countedCash:99},cashier),/counted cash/);
  await assert.rejects(reconciliationService.confirm({...input,verified:{...input.verified,BANK_TRANSFER:{received:1,refunded:0}}},cashier),/Statement/);
  await reconciliationService.confirm(input,cashier);
  assert.equal((await reconciliationService.summary(day,cashier)).confirmed,true);
  const revised=await tx.paymentRequest.findUnique({where:{id:bill.id},include:{items:true}});
  await bills.partialCancel(bill.id,{revision:revised.revision,itemIds:[revised.items[0].id],reason:'Audit later refund'},cashier);
  assert.equal((await reconciliationService.summary(day,cashier)).confirmed,true,'An authorized but unpaid refund is not a cash movement');
  const laterRefund=await tx.refund.findFirst({where:{paymentRequestId:bill.id,status:'PENDING'}});
  await refundService.settle(laterRefund.id,{method:'CASH',reference:`${marker}-later-cash`,payoutConfirmed:true},cashier);
  assert.equal((await reconciliationService.summary(day,cashier)).confirmed,false);
  await assert.rejects(reconciliationService.confirm(input,cashier),/Transactions changed/);
  await assert.rejects(reconciliationService.summary(day,{id:cashier.id,role:'PATIENT'}),/cashier access/);
});

await scenario('Prescription and upload histories remain reachable beyond 300 records', async ({tx,staff}) => {
  const person=await patientService.create({onlineAccess:false,fullName:'Disposable pagination audit',dateOfBirth:new Date('1990-01-01')},staff);
  const user={id:person.userId,role:'PATIENT'};
  await tx.prescription.createMany({data:Array.from({length:305},(_,i)=>({prescriptionNumber:`${marker}-page-${i}`,patientId:person.id,prescriberName:'Pagination fixture',prescriptionDate:new Date(),createdById:staff.id}))});
  await tx.prescriptionUpload.createMany({data:Array.from({length:305},(_,i)=>({patientId:person.userId,originalName:`page-${i}.txt`,mimeType:'text/plain',fileData:Buffer.from('Disposable pagination fixture')}))});
  for(const list of [()=>rxService.list(user,{page:1,pageSize:300}),()=>uploads.list(user,{page:1,pageSize:300})]) assert.equal((await list()).length,300);
  assert.equal((await rxService.list(user,{page:2,pageSize:300})).length,5);
  assert.equal((await uploads.list(user,{page:2,pageSize:300})).length,5);
});

assert.equal(await prisma.prescription.count({where:{prescriptionNumber:{startsWith:marker}}}),0);
console.log(JSON.stringify({summary:{total:results.length,pass:results.filter(r=>r.status==='PASS').length,issues:results.filter(r=>r.status==='ISSUE').length,blocked:results.filter(r=>r.status==='BLOCKED').length},allFixturesRolledBack:true}));
await prisma.$disconnect();
if (results.some(result=>result.status!=='PASS')) process.exitCode=1;
