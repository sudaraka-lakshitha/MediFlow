// Read-only QA of application behavior: all fixture writes run in rolled-back transactions.
import assert from 'node:assert/strict';
import { Prisma } from '@prisma/client';
import { prisma } from '../src/config/prisma.js';
import { saleService } from '../src/services/sale.service.js';
import { refundService } from '../src/services/refund.service.js';
import { reconciliationService } from '../src/services/reconciliation.service.js';
import { reportService } from '../src/services/report.service.js';
import { dashboardController } from '../src/controllers/dashboard.controller.js';
import { calculateDiscounts } from '../src/services/discount.service.js';
import { inventoryService } from '../src/services/inventory.service.js';
import { patientService } from '../src/services/patient.service.js';
import { prescriptionService } from '../src/services/prescription.service.js';
import { paymentRequestService } from '../src/services/paymentRequest.service.js';
import { receiveStockSchema, adjustmentSchema, expiredStockDispositionSchema } from '../src/validators/inventory.validator.js';
import { retailSaleSchema } from '../src/controllers/sale.controller.js';
import { localDateKey } from '../src/utils/localDate.js';

const originalTransaction=prisma.$transaction.bind(prisma);
const delegates=Object.fromEntries(Object.keys(prisma).filter(key=>!key.startsWith('_')&&!key.startsWith('$')&&typeof prisma[key]?.findMany==='function').map(key=>[key,prisma[key]]));
const marker=`QA-${Date.now()}`;
const results=[];
let sequence=0;
const d=value=>new Prisma.Decimal(value);
async function check(name,run){
  const rollback=new Error('QA_ROLLBACK');let result;
  try{await originalTransaction(async tx=>{
    prisma.$transaction=fn=>fn(tx);for(const key of Object.keys(delegates))prisma[key]=tx[key];
    const admin=await tx.user.findFirst({where:{role:'ADMIN',active:true}});
    assert(admin,'Needs local demo administrator');
    const staff=await tx.user.create({data:{email:`${marker}-${++sequence}@patients.mediflow.invalid`,passwordHash:admin.passwordHash,fullName:'Disposable QA cashier',role:'CASHIER',cashierAccess:true}});
    const category=await tx.category.create({data:{name:`${marker}-${sequence}`}});
    const product=await tx.product.create({data:{sku:`${marker}-${sequence}`,genericName:'Disposable QA retail item',productType:'NON_MEDICINAL',strength:'N/A',dosageForm:'Retail item',unit:'piece',sellingPrice:100,categoryId:category.id,prescriptionRequired:false}});
    const batch=await tx.inventoryBatch.create({data:{productId:product.id,batchNumber:`${marker}-${sequence}`,quantityReceived:100,quantityAvailable:100,purchasePrice:30,expiryDate:new Date('2030-01-01')}});
    await tx.discountRule.updateMany({data:{active:false}}); // Only within this rollback transaction.
    const sale=async(quantity=1,amountPaid=0,method='CASH')=>saleService.createRetail(retailSaleSchema.parse({items:[{productId:product.id,quantity}],tax:0,amountPaid,paymentMethod:method,paymentReference:method==='BANK_TRANSFER'?`${marker}-bank`:null}),staff.id);
    const paid=async(quantity=1,method='CASH')=>{const bill=await sale(quantity);await saleService.pay(bill.id,Number(bill.total),method,staff.id,method==='BANK_TRANSFER'?`${marker}-bank`:null);return bill;};
    const refund=async(bill,quantity=1)=>refundService.create(bill.id,{expectedRefundCount:0,reason:'Disposable QA return',items:[{saleItemId:bill.items[0].id,quantity}]},staff);
    try{const evidence=await run({tx,admin,staff,product,batch,sale,paid,refund});result={name,status:'PASS',evidence};}
    catch(error){result={name,status:'ISSUE',detail:error.message};}
    throw rollback;
  },{timeout:30000});}catch(error){if(error!==rollback)result={name,status:'BLOCKED',detail:error.message};}
  finally{prisma.$transaction=originalTransaction;for(const [key,value]of Object.entries(delegates))prisma[key]=value;}
  results.push(result);console.log(JSON.stringify(result));
}

await check('Whole-piece retail products must reject half-unit sales',async({sale})=>{
  let created;try{created=await sale(.5,50);}catch(error){if(error.statusCode===400)return;throw error;}
  assert.fail(`Accepted ${created.items[0].quantity} piece, invoice total ${created.total}`);
});
await check('Sub-storage precision must not create a paid zero-quantity sale',async({sale})=>{
  let created;try{created=await sale(.0001,.01);}catch(error){if(error.statusCode===400)return;throw error;}
  assert(Number(created.items[0].quantity)>0,`PAID invoice ${created.total}, stored quantity ${created.items[0].quantity}, line value ${created.items[0].lineTotal}`);
});
await check('Cashier should be able to open an invoice exposed in their sales list',async({paid,tx,admin})=>{
  const bill=await paid();
  const other=await tx.user.create({data:{email:`${marker}-other@patients.mediflow.invalid`,passwordHash:admin.passwordHash,fullName:'Other QA cashier',role:'CASHIER',cashierAccess:true}});
  const rows=await saleService.list(other);
  assert(rows.some(row=>row.id===bill.id),'Invoice absent from list');
  await saleService.getForUser(bill.id,other);
});
await check('Part-paid direct retail cancellation has a refund path',async({sale,staff,tx,batch})=>{
  const bill=await sale(1,25);
  const stockBefore=await tx.inventoryBatch.findUnique({where:{id:batch.id}});
  const cancelled=await saleService.voidSale(bill.id,'Customer cancelled',staff.id,staff.role);
  assert.equal(cancelled.status,'VOIDED');assert.equal(Number(cancelled.amountPaid),25);
  const credit=await tx.refund.findFirst({where:{saleId:bill.id},include:{lines:true}});
  assert.equal(Number(credit.amount),25);assert.equal(credit.status,'PENDING');assert.equal(credit.lines[0].stockStatus,'PENDING_REVIEW');
  assert.equal(String((await tx.inventoryBatch.findUnique({where:{id:batch.id}})).quantityAvailable),String(stockBefore.quantityAvailable));
  await assert.rejects(saleService.voidSale(bill.id,'Duplicate cancellation',staff.id,staff.role),/already been voided/);
  await assert.rejects(saleService.pay(bill.id,75,'CASH',staff.id),/voided/);
  await refundService.settle(credit.id,{method:'CASH',reference:`${marker}-deposit`,payoutConfirmed:true},staff);
  assert.equal((await tx.refund.findUnique({where:{id:credit.id}})).status,'SETTLED');
});
await check('Current-day returns must not silently rewrite an earlier daily sales report',async({paid,refund,staff,admin,tx})=>{
  const bill=await paid();
  const yesterday=new Date(Date.now()-86400000);await tx.sale.update({where:{id:bill.id},data:{createdAt:yesterday}});
  const before=(await reportService.daily(localDateKey(yesterday))).find(row=>row.invoice===bill.invoiceNumber);
  const credit=await refund(bill);await refundService.settle(credit.id,{method:'CASH',reference:`${marker}-payout`,payoutConfirmed:true},staff);
  const after=(await reportService.daily(localDateKey(yesterday))).find(row=>row.invoice===bill.invoiceNumber);
  assert.equal(after.netRevenue,before.netRevenue,`Yesterday changed from ${before.netRevenue} to ${after.netRevenue}; return occurred today`);
  const todayRows=(await reportService.daily(localDateKey(new Date()))).filter(row=>row.invoice===bill.invoiceNumber);
  assert.equal(todayRows.length,1);assert.equal(todayRows[0].status,'CREDIT');assert.equal(Number(todayRows[0].netRevenue),-100);assert.equal(Number(todayRows[0].cost),0);
  const analytics=await reportService.analytics(localDateKey(new Date()),localDateKey(new Date()));
  assert(analytics.dailySeries.some(row=>row.revenue<=-100));
  const line=(await tx.refundLine.findMany({where:{refundId:credit.id}}))[0];
  await refundService.reviewStock(line.id,{decision:'RESTOCKED',reason:'QA intact item review'},admin);
  const recovered=(await reportService.daily(localDateKey(new Date()))).filter(row=>row.invoice===bill.invoiceNumber);
  assert.equal(recovered.filter(row=>row.status==='STOCK_RECOVERY').length,1);
});
await check('Cashier dashboard collections must deduct completed refunds',async({paid,refund,staff})=>{
  const bill=await paid();const credit=await refund(bill);
  await refundService.settle(credit.id,{method:'CASH',reference:`${marker}-paid-back`,payoutConfirmed:true},staff);
  let body;await dashboardController.summary({user:staff},{json:value=>body=value});
  const daily=await reconciliationService.summary(localDateKey(new Date()),staff);
  assert.equal(body.data.amountToday,daily.totals.CASH.net,`Dashboard ${body.data.amountToday}; reconciled net cash ${daily.totals.CASH.net}`);
});
await check('Late bank payment and cash refund use their event dates and separate methods',async({sale,refund,staff,tx})=>{
  const bill=await sale();
  await tx.sale.update({where:{id:bill.id},data:{createdAt:new Date(Date.now()-86400000)}});
  await saleService.pay(bill.id,100,'BANK_TRANSFER',staff.id,`${marker}-late-bank`);
  const credit=await refund(bill);
  let ledger=await reconciliationService.summary(localDateKey(new Date()),staff);
  assert.equal(ledger.totals.BANK_TRANSFER.received,100);assert.equal(ledger.totals.CASH.refunded,0);
  await refundService.settle(credit.id,{method:'CASH',reference:`${marker}-cash-return`,payoutConfirmed:true},staff);
  ledger=await reconciliationService.summary(localDateKey(new Date()),staff);
  assert.equal(ledger.totals.BANK_TRANSFER.net,100);assert.equal(ledger.totals.CASH.net,-100);
  assert.equal(ledger.entries.find(entry=>entry.direction==='OUT').originalMethod,'BANK_TRANSFER');
  let body;await dashboardController.summary({user:staff},{json:value=>body=value});
  assert.equal(body.data.amountToday,0);assert.equal(body.data.paidToday,1);
  assert.equal(body.data.paymentTotals.CASH.net,-100);
});
await check('A new-day pending refund should not invalidate a previous-day zero-activity confirmation',async({paid,refund,staff})=>{
  const yesterday=localDateKey(new Date(Date.now()-86400000));
  const summary=await reconciliationService.summary(yesterday,staff);
  await reconciliationService.confirm({day:yesterday,fingerprint:summary.fingerprint,openingCash:0,countedCash:0,verified:{BANK_TRANSFER:{received:0,refunded:0},CARD:{received:0,refunded:0}},referencesChecked:true},staff);
  await refund(await paid());
  assert.equal((await reconciliationService.summary(yesterday,staff)).confirmed,true,'Yesterday became unconfirmed without a yesterday money movement');
});
await check('Discount application details must add up to the invoice discount',async()=>{
  const rule=id=>({id,name:`Combined ${id}`,type:'PERCENTAGE',value:d(70),scope:'ORDER',minimumSubtotal:d(0),minimumQuantity:d(0),combinable:true});
  const result=await calculateDiscounts({discountRule:{findMany:async()=>[rule(1),rule(2)]}},[{productId:1,quantity:d(1),lineTotal:d(100)}],d(100));
  const logged=result.applications.reduce((sum,item)=>sum+Number(item.amount),0);
  assert.equal(logged,Number(result.amount),`Invoice discount ${result.amount}; application ledger ${logged}`);
});
await check('Restricted batch updates and stock reductions preserve reservations',async({tx,batch,staff})=>{
  await tx.inventoryBatch.update({where:{id:batch.id},data:{quantityReserved:10}});
  await assert.rejects(inventoryService.adjust(batch.id,{quantityChange:-95,reason:'QA reserved stock guard'},staff.id),/reserved/);
  await inventoryService.setRestriction(batch.id,{restricted:true,reason:'QA quarantine'});
  const row=await tx.inventoryBatch.findUnique({where:{id:batch.id}});assert.equal(row.restricted,true);assert.equal(Number(row.quantityReserved),10);
});
await check('Inventory batch list must not silently hide the last batch beyond 500',async({tx,product,staff,batch})=>{
  await tx.inventoryBatch.createMany({data:Array.from({length:505},(_,i)=>({productId:product.id,batchNumber:`${marker}-limit-${i}`,quantityReceived:1,quantityAvailable:1,purchasePrice:30,expiryDate:new Date('2035-01-01')}))});
  const count=await tx.inventoryBatch.count();const rows=[];
  for(let page=1;;page++){const next=await inventoryService.listBatches({page,pageSize:100});rows.push(...next);if(next.length<100)break;}
  assert.equal(new Set(rows.map(row=>row.id)).size,count);
  await tx.stockMovement.createMany({data:Array.from({length:305},()=>({productId:product.id,batchId:batch.id,performedById:staff.id,type:'ADJUSTMENT',quantityChange:1,quantityBefore:0,quantityAfter:1,reason:'Disposable paging fixture'}))});
  const movementCount=await tx.stockMovement.count();const movements=[];
  for(let page=1;;page++){const next=await inventoryService.listMovements({page,pageSize:100});movements.push(...next);if(next.length<100)break;}
  assert.equal(new Set(movements.map(row=>row.id)).size,movementCount);
});

await check('An accepted OTHER payment must have a daily closing path',async({paid,staff,admin})=>{
  await paid(1,'OTHER');
  const day=localDateKey(new Date());let summary=await reconciliationService.summary(day,staff);
  const entry=summary.entries.find(entry=>entry.method==='OTHER');
  const otherSummary=await reconciliationService.summary(day,admin);
  await assert.rejects(reconciliationService.classify({day,fingerprint:otherSummary.fingerprint,entryId:entry.id,method:'CASH',reference:'Not mine',reason:'Cannot reclassify another cashier'},admin),/not awaiting classification/);
  await assert.rejects(reconciliationService.classify({day,fingerprint:summary.fingerprint,entryId:entry.id,method:'BANK_TRANSFER',reference:'',reason:'No evidence'},staff),/evidence/);
  await assert.rejects(reconciliationService.confirm({day,fingerprint:summary.fingerprint,openingCash:0,countedCash:0,verified:{BANK_TRANSFER:{received:0,refunded:0},CARD:{received:0,refunded:0}},referencesChecked:true},staff),/Unclassified/);
  await reconciliationService.classify({day,fingerprint:summary.fingerprint,entryId:entry.id,method:'CASH',reference:`${marker}-receipt`,reason:'Verified cash receipt'},staff);
  await assert.rejects(reconciliationService.classify({day,fingerprint:summary.fingerprint,entryId:entry.id,method:'CARD',reference:'duplicate',reason:'Stale correction'},staff),/changed/);
  summary=await reconciliationService.summary(day,staff);
  await reconciliationService.confirm({day,fingerprint:summary.fingerprint,openingCash:0,countedCash:100,verified:{BANK_TRANSFER:{received:0,refunded:0},CARD:{received:0,refunded:0}},referencesChecked:true},staff);
});
await check('Full patient health history must not silently stop at 60 prescriptions',async({tx,admin})=>{
  const user=await tx.user.create({data:{email:`${marker}-history@patients.mediflow.invalid`,passwordHash:admin.passwordHash,fullName:'Disposable QA patient',role:'PATIENT'}});
  const profile=await tx.patientProfile.create({data:{userId:user.id,patientNumber:`QA-${Date.now()}`}});
  await tx.prescription.createMany({data:Array.from({length:305},(_,i)=>({prescriptionNumber:`${marker}-history-${i}`,patientId:profile.id,prescriberName:'QA only',prescriptionDate:new Date(),createdById:admin.id}))});
  const history=[];for(let page=1;;page++){const next=await patientService.healthRecordForUser(user.id,{page,pageSize:100});history.push(...next.prescriptions);if(next.prescriptions.length<100)break;}
  assert.equal(new Set(history.map(row=>row.id)).size,305);
});
await check('Customer invoice responses must exclude internal purchase costs',async({paid,tx,admin})=>{
  const user=await tx.user.create({data:{email:`${marker}-cost@patients.mediflow.invalid`,passwordHash:admin.passwordHash,fullName:'Disposable QA patient',role:'PATIENT'}});
  const bill=await paid();await tx.sale.update({where:{id:bill.id},data:{patientId:user.id}});
  const rows=await saleService.list(user);const item=rows.find(row=>row.id===bill.id).items[0];
  assert(!('unitCost' in item)&&!('purchasePrice' in item.batch),`Customer response includes unitCost=${item.unitCost}, batch.purchasePrice=${item.batch.purchasePrice}`);
  const detail=await saleService.getForUser(bill.id,user);
  assert(!('unitCost' in detail.items[0])&&!('purchasePrice' in detail.items[0].batch));
  await assert.rejects(saleService.getForUser(bill.id,{id:admin.id,role:'PATIENT'}),/Invoice not found/);
});

await check('Whole-piece stock receipt must reject a fraction',async({product,staff})=>{
  let row;try{row=await inventoryService.receive(receiveStockSchema.parse({productId:product.id,batchNumber:`${marker}-fraction`,quantity:.5,purchasePrice:30,expiryDate:'2030-01-01'}),staff.id);}catch(error){if(error.statusCode===400)return;throw error;}
  assert.fail(`Received ${row.quantityReceived} piece`);
});
await check('Whole-piece stock adjustment must reject a fraction',async({batch,staff})=>{
  let row;try{row=await inventoryService.adjust(batch.id,adjustmentSchema.parse({quantityChange:-.001,reason:'QA precision check'}),staff.id);}catch(error){if(error.statusCode===400)return;throw error;}
  assert.fail(`100 pieces adjusted to ${row.quantityAvailable}`);
});
await check('Whole-piece expired disposition must reject a fraction',async({batch,tx,staff})=>{
  await tx.inventoryBatch.update({where:{id:batch.id},data:{expiryDate:new Date('2020-01-01')}});
  try{await inventoryService.disposeExpired(batch.id,expiredStockDispositionSchema.parse({action:'DESTROYED',quantity:.001,reason:'QA precision check'}),staff.id);}catch(error){if(error.statusCode===400)return;throw error;}
  const row=await tx.inventoryBatch.findUnique({where:{id:batch.id}});assert.fail(`100 expired pieces reduced to ${row.quantityAvailable}`);
});
await check('Cashier retail requests must reject fractional countable items',async({product,staff})=>{
  let row;try{row=await paymentRequestService.createRetail({items:[{productId:product.id,quantity:.5}],tax:0},staff.id);}catch(error){if(error.statusCode===400)return;throw error;}
  assert.fail(`Retail request accepted ${row.items[0].quantity} piece`);
});
await check('Dispensing quote must reject fractional capsule quantities',async({product,tx,admin})=>{
  await tx.product.update({where:{id:product.id},data:{productType:'MEDICINE',unit:'capsule',dosageForm:'Capsule'}});
  const user=await tx.user.create({data:{email:`${marker}-capsule@patients.mediflow.invalid`,passwordHash:admin.passwordHash,fullName:'Disposable QA patient',role:'PATIENT'}});
  const profile=await tx.patientProfile.create({data:{userId:user.id,patientNumber:`QA-${Date.now()}`}});
  const rx=await tx.prescription.create({data:{prescriptionNumber:`${marker}-capsule`,patientId:profile.id,prescriberName:'QA only',prescriptionDate:new Date(),createdById:admin.id,items:{create:{productId:product.id,quantityPerDose:1,timesPerDay:1,daysSupply:1,calculatedQuantity:1,prescribedQuantity:1,dosageInstructions:'QA only'}}},include:{items:true}});
  let quote;try{quote=await prescriptionService.quoteDispensing(rx.id,{items:[{prescriptionItemId:rx.items[0].id,quantity:.5}],retailItems:[],tax:0,amountPaid:0});}catch(error){if(error.statusCode===400)return;throw error;}
  assert.fail(`Dispensing quote accepted ${quote.lines[0].quantity} capsule`);
});

await check('Measured retail and stock operations preserve valid fractional quantities',async({tx,product,batch,staff,sale})=>{
  await tx.product.update({where:{id:product.id},data:{unit:'ml'}});
  const bill=await sale(.125,12.5);
  assert.equal(Number(bill.items[0].quantity),.125);
  const received=await inventoryService.receive(receiveStockSchema.parse({productId:product.id,batchNumber:`${marker}-liquid`,quantity:2.125,purchasePrice:30,expiryDate:'2030-01-01'}),staff.id);
  assert.equal(Number(received.quantityReceived),2.125);
  const adjusted=await inventoryService.adjust(batch.id,{quantityChange:-.125,reason:'QA measured stock'},staff.id);
  assert.equal(Number(adjusted.quantityAvailable),99.75);
});
await check('Fractional measured returns remain supported',async({tx,product,paid,refund})=>{
  await tx.product.update({where:{id:product.id},data:{unit:'g'}});
  const bill=await paid();const credit=await refund(bill,.125);
  assert.equal(Number(credit.amount),12.5);assert.equal(Number(credit.lines[0].quantity),.125);
});

assert.equal(await prisma.product.count({where:{sku:{startsWith:marker}}}),0);
console.log(JSON.stringify({summary:{total:results.length,pass:results.filter(r=>r.status==='PASS').length,issues:results.filter(r=>r.status==='ISSUE').length,blocked:results.filter(r=>r.status==='BLOCKED').length},allFixturesRolledBack:true}));
await prisma.$disconnect();
if (results.some(result => result.status !== 'PASS')) process.exitCode = 1;
