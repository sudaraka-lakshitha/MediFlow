import 'dotenv/config';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { prisma } from '../src/config/prisma.js';
import { reconciliationService } from '../src/services/reconciliation.service.js';
import { pharmacyReconciliationService } from '../src/services/pharmacyReconciliation.service.js';
const connection = new URL(process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL);
assert(['localhost', '127.0.0.1'].includes(connection.hostname), 'Local MySQL only.');
const rollback = new Error('ROLLBACK_TEST_FIXTURES');
try {
  await prisma.$transaction(async tx => {
    const day = '2000-01-01';
    const suffix = crypto.randomUUID();
    const actor = await tx.user.create({data:{email:`qa-reconciliation-${suffix}@example.invalid`,fullName:'QA Reconciliation Delegate',passwordHash:'not-a-login-credential',role:'CASHIER',pharmacyReconciliationAccess:true}});
    const before = await pharmacyReconciliationService.summary(day,actor,tx);
    assert.equal(before.entries.length,0,'Use an empty historical fixture day.');
    assert.equal(before.cashiers.length,0,'Do not reuse a previously confirmed day.');
    const personal = await reconciliationService.summary(day,actor,tx);
    await tx.dailyBalanceConfirmation.create({data:{cashierId:actor.id,day,fingerprint:personal.fingerprint,snapshot:{openingCash:100,countedCash:100}}});
    const summary = await pharmacyReconciliationService.summary(day,actor,tx);
    assert.equal(summary.cashiers[0].confirmed,true);
    assert.equal(summary.openingCash,100);
    const input = {day,fingerprint:summary.fingerprint,openingCash:100,countedCash:100,verified:{BANK_TRANSFER:{received:0,refunded:0},CARD:{received:0,refunded:0}},referencesChecked:true};
    const confirmation = await pharmacyReconciliationService.confirm(input,actor,tx);
    assert.equal(confirmation.confirmedById,actor.id);
    assert.equal((await pharmacyReconciliationService.summary(day,actor,tx)).confirmed,true);
    assert.equal((await pharmacyReconciliationService.confirm(input,actor,tx)).id,confirmation.id);
    assert.equal(await tx.auditLog.count({where:{action:'PHARMACY_BALANCE_CONFIRMED',entityId:confirmation.id}}),1);
    await assert.rejects(pharmacyReconciliationService.summary(day,{...actor,pharmacyReconciliationAccess:false},tx), /grant pharmacy-wide/);
    await tx.user.update({where:{id:actor.id},data:{fullName:'Renamed QA cashier'}});
    assert.equal((await pharmacyReconciliationService.summary(day,actor,tx)).confirmed,true,'Renaming does not invalidate approval.');
    const personalInput={...input,fingerprint:personal.fingerprint};
    const personalFirst=await reconciliationService.confirm(personalInput,actor,tx);
    assert.equal((await reconciliationService.confirm(personalInput,actor,tx)).id,personalFirst.id,'Personal retries are idempotent.');
    assert.equal((await pharmacyReconciliationService.summary(day,actor,tx)).confirmed,true,'Same counts retain pharmacy approval.');
    for (const amount of [120,100]) {
      await reconciliationService.confirm({...personalInput,openingCash:amount,countedCash:amount},actor,tx);
      const changed=await pharmacyReconciliationService.summary(day,actor,tx);
      assert.equal(changed.confirmed,false);
      await pharmacyReconciliationService.confirm({...input,fingerprint:changed.fingerprint,openingCash:amount,countedCash:amount},actor,tx);
    }
    assert.equal(await tx.pharmacyBalanceConfirmation.count({where:{day}}),3,'A-B-A retains three approval records.');
    const administrator=await tx.user.create({data:{email:`qa-admin-${suffix}@example.invalid`,fullName:'QA Administrator',passwordHash:'not-a-login-credential',role:'ADMIN'}});
    await tx.user.update({where:{id:actor.id},data:{active:false,role:'PATIENT',pharmacyReconciliationAccess:false}});
    const stale=await tx.dailyBalanceConfirmation.create({data:{cashierId:actor.id,day,fingerprint:'0'.repeat(64),snapshot:{openingCash:100,countedCash:100}}});
    const reviewInput={...personalInput,cashierId:actor.id,expectedConfirmationId:stale.id,reason:'Former cashier unavailable',evidenceReference:'QA signed drawer record'};
    const reviewed=await reconciliationService.confirmOnBehalf(reviewInput,administrator,tx);
    assert.equal(reviewed.snapshot.review.reviewerId,administrator.id);
    assert.equal(reviewed.cashierId,actor.id);
    assert.equal((await reconciliationService.confirmOnBehalf(reviewInput,administrator,tx)).id,reviewed.id);
    assert.equal((await pharmacyReconciliationService.summary(day,administrator,tx)).confirmed,true,'Same checked money preserves pharmacy approval.');
    assert.equal(await tx.auditLog.count({where:{action:'DAILY_BALANCE_RECONCILED_ON_BEHALF',entityId:reviewed.id,userId:administrator.id}}),1);
    console.log('PASS: delegated access, name changes, identical retries, A-B-A approval history, inactive former-cashier recovery, administrator attribution and audit. Rolling back all fixtures.');
    throw rollback;
  }, {isolationLevel:'Serializable',timeout:20000});
} catch(error) { if(error !== rollback) throw error; }
finally { await prisma.$disconnect(); }
console.log('Rollback completed; no business records or permissions changed.');
