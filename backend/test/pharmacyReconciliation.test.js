import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pharmacyReconciliationService as service } from '../src/services/pharmacyReconciliation.service.js';
import { reconciliationService } from '../src/services/reconciliation.service.js';
import { canReconcilePharmacy } from '../src/utils/reconciliationAccess.js';
import { userService } from '../src/services/user.service.js';
const { db } = vi.hoisted(() => ({ db: {} }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/config/env.js', () => ({ env: { REPORT_TIMEZONE_OFFSET_MINUTES: 330 } }));
const admin = { id: 1, role: 'ADMIN', fullName: 'Admin' };
const day = '2020-10-01';
let personal, confirmations, payments, refunds;
beforeEach(() => {
  personal = []; confirmations = []; refunds = [];
  payments = [2,3].map((cashierId,index) => ({ id: index+1, cashierId, amount: 100, method: index ? 'BANK_TRANSFER' : 'CASH', reference: index ? 'BANK-REF' : null, createdAt: new Date('2020-10-01T10:00:00Z'), sale: { invoiceNumber: `INV-${index}` } }));
  Object.assign(db, {
    paymentRequestEvent: { findMany: vi.fn(async () => []) },
    salePayment: { findMany: vi.fn(async ({where}) => payments.filter(p => where.cashierId === undefined || p.cashierId === where.cashierId)) },
    sale: { findMany: vi.fn(async () => []) },
    refund: { findMany: vi.fn(async ({where}) => refunds.filter(r => where.settledById === undefined || r.settledById === where.settledById)), count: vi.fn(async () => 0) },
    user: { findMany: vi.fn(async () => [{id:2,fullName:'Cashier A'},{id:3,fullName:'Cashier B'}]), findUnique: vi.fn(), update: vi.fn(async args => args.data) },
    dailyBalanceConfirmation: { findMany: vi.fn(async ({where}) => personal.filter(p => !where.cashierId || p.cashierId === where.cashierId)), create: vi.fn(async ({data}) => { const row = {...data,id:personal.length+10,createdAt:new Date()}; personal.unshift(row); return row; }) },
    pharmacyBalanceConfirmation: { findMany: vi.fn(async () => confirmations), create: vi.fn(async ({data}) => { const row = {...data,id:confirmations.length+1,createdAt:new Date()}; confirmations.unshift(row); return row; }) },
    auditLog: { create: vi.fn() },
    $transaction: vi.fn(async fn => fn(db)),
  });
});

describe('reconciliation recovery and stable approvals', () => {
  const personalInput = async (id = 2) => {
    const summary = await reconciliationService.summary(day,{id,role:'CASHIER'},db);
    return {...approval(summary),openingCash:50,countedCash:50+summary.totals.CASH.net};
  };
  const recoveryInput = async () => ({...await personalInput(),cashierId:2,expectedConfirmationId:null,reason:'Cashier no longer employed',evidenceReference:'Signed count sheet 123'});
  beforeEach(() => db.user.findUnique.mockResolvedValue({id:2,fullName:'Cashier A',active:false,role:'PATIENT'}));
  it('keeps approval valid after a cashier name changes', async () => {
    await signCashiers(); const before=await service.summary(day,admin); await service.confirm(approval(before),admin);
    db.user.findMany.mockResolvedValue([{id:2,fullName:'Renamed cashier'},{id:3,fullName:'Cashier B'}]);
    const after=await service.summary(day,admin);
    expect(after.fingerprint).toBe(before.fingerprint); expect(after.confirmed).toBe(true);
  });
  it('preserves legacy approval using its financial snapshot, regardless of JSON key order', async () => {
    await signCashiers(); const before=await service.summary(day,admin); await service.confirm(approval(before),admin);
    confirmations[0].fingerprint='legacy-hash';
    confirmations[0].snapshot.entries=confirmations[0].snapshot.entries.map(row=>Object.fromEntries(Object.entries(row).reverse()));
    expect((await service.summary(day,admin)).confirmed).toBe(true);
  });
  it('makes identical personal confirmation idempotent and does not invalidate pharmacy approval', async () => {
    await signCashiers(); const input=await personalInput();
    const first=await reconciliationService.confirm(input,{id:2,role:'CASHIER'},db);
    const whole=await service.summary(day,admin); await service.confirm(approval(whole),admin);
    expect((await reconciliationService.confirm(input,{id:2,role:'CASHIER'},db)).id).toBe(first.id);
    expect(db.dailyBalanceConfirmation.create).toHaveBeenCalledOnce();
    expect((await service.summary(day,admin)).confirmed).toBe(true);
  });
  it('allows A to B to A cash-count approvals while retaining each history record', async () => {
    await signCashiers();
    for (const opening of [50,60,50]) {
      const input={...await personalInput(),openingCash:opening,countedCash:opening+100};
      await reconciliationService.confirm(input,{id:2,role:'CASHIER'},db);
      const whole=await service.summary(day,admin);
      expect(whole.confirmed).toBe(false); await service.confirm(approval(whole),admin);
    }
    expect(confirmations).toHaveLength(3);
    expect(confirmations[0].fingerprint).toBe(confirmations[2].fingerprint);
  });
  it('records an admin review for a former cashier without changing their account or payments', async () => {
    const input=await recoveryInput(); const row=await reconciliationService.confirmOnBehalf(input,admin,db);
    expect(row).toMatchObject({cashierId:2,snapshot:{review:{reviewerId:1,cashierId:2,reason:input.reason,evidenceReference:input.evidenceReference}}});
    expect(db.auditLog.create).toHaveBeenCalledWith({data:expect.objectContaining({userId:1,action:'DAILY_BALANCE_RECONCILED_ON_BEHALF'})});
    expect(db.user.update).not.toHaveBeenCalled();
    expect((await reconciliationService.confirmOnBehalf(input,admin,db)).id).toBe(row.id);
    expect(db.dailyBalanceConfirmation.create).toHaveBeenCalledOnce();
    expect((await service.summary(day,admin)).cashiers.find(row=>row.cashierId===2)).toMatchObject({confirmed:true,review:{reviewerId:1}});
  });
  it.each(['CASHIER','PHARMACIST','PATIENT'])('rejects delegated %s from admin recovery', async role => {
    await expect(reconciliationService.confirmOnBehalf(await recoveryInput(),{id:9,role,cashierAccess:true,pharmacyReconciliationAccess:true},db)).rejects.toMatchObject({statusCode:403});
  });
  it('rejects self-review, missing evidence, missing actor, and unrelated empty days', async () => {
    const input=await recoveryInput();
    await expect(reconciliationService.confirmOnBehalf({...input,cashierId:1},admin,db)).rejects.toThrow('personal balance');
    await expect(reconciliationService.confirmOnBehalf({...input,evidenceReference:''},admin,db)).rejects.toThrow('supporting evidence');
    db.user.findUnique.mockResolvedValueOnce(null);
    await expect(reconciliationService.confirmOnBehalf(input,admin,db)).rejects.toMatchObject({statusCode:404});
    payments=[];
    await expect(reconciliationService.confirmOnBehalf(input,admin,db)).rejects.toThrow('no transactions');
  });
  it('rejects stale ledgers, changed confirmations and already-current signoffs', async () => {
    const input=await recoveryInput();
    await expect(reconciliationService.confirmOnBehalf({...input,fingerprint:'0'.repeat(64)},admin,db)).rejects.toThrow('Transactions changed');
    await signCashiers();
    await expect(reconciliationService.confirmOnBehalf(input,admin,db)).rejects.toThrow('confirmation changed');
    await expect(reconciliationService.confirmOnBehalf({...input,expectedConfirmationId:2},admin,db)).rejects.toThrow('already has a current confirmation');
  });
  it('does not bypass cash variance, statement mismatches, evidence checks or unclassified payments', async () => {
    const input=await recoveryInput();
    await expect(reconciliationService.confirmOnBehalf({...input,countedCash:0},admin,db)).rejects.toThrow('counted cash');
    await expect(reconciliationService.confirmOnBehalf({...input,verified:{...input.verified,BANK_TRANSFER:{received:10,refunded:0}}},admin,db)).rejects.toThrow('Statement');
    await expect(reconciliationService.confirmOnBehalf({...input,referencesChecked:false},admin,db)).rejects.toThrow('evidence');
    payments[0].method='OTHER';
    await expect(reconciliationService.confirmOnBehalf(await recoveryInput(),admin,db)).rejects.toThrow('Unclassified');
    expect(db.dailyBalanceConfirmation.create).not.toHaveBeenCalled();
  });
});
const signCashiers = async () => {
  for (const id of [2,3]) {
    const summary = await reconciliationService.summary(day, {id,role:'CASHIER'}, db);
    personal.push({ id, cashierId:id, fingerprint:summary.fingerprint, createdAt:new Date('2020-10-01T11:00:00Z'), snapshot:{openingCash:50,countedCash:50+summary.totals.CASH.net} });
  }
};
const approval = summary => ({ day, fingerprint:summary.fingerprint, openingCash:summary.openingCash, countedCash:summary.countedCash,
  verified:{BANK_TRANSFER:{received:summary.totals.BANK_TRANSFER.received,refunded:summary.totals.BANK_TRANSFER.refunded},CARD:{received:0,refunded:0}}, referencesChecked:true });

describe('pharmacy-wide permissions', () => {
  it.each([
    [{role:'ADMIN'},true], [{role:'CASHIER'},false], [{role:'CASHIER',pharmacyReconciliationAccess:true},true],
    [{role:'PHARMACIST',cashierAccess:true},false], [{role:'PHARMACIST',cashierAccess:true,pharmacyReconciliationAccess:true},true],
    [{role:'PHARMACIST',cashierAccess:false,pharmacyReconciliationAccess:true},false], [{role:'PATIENT',pharmacyReconciliationAccess:true},false],
  ])('applies least privilege for %j', (user, allowed) => expect(canReconcilePharmacy(user)).toBe(allowed));
  it('blocks unauthorized reading and confirming before database access', async () => {
    for (const role of ['CASHIER','PHARMACIST','PATIENT']) {
      await expect(service.summary(day,{id:2,role})).rejects.toMatchObject({statusCode:403});
      await expect(service.confirm({day},{id:2,role})).rejects.toMatchObject({statusCode:403});
    }
    expect(db.$transaction).not.toHaveBeenCalled();
  });
  it('revokes sessions when access changes and clears access when cashier functions are removed', async () => {
    db.user.findUnique.mockResolvedValue({id:2,role:'PHARMACIST',active:true,cashierAccess:true,pharmacyReconciliationAccess:false});
    const input = {email:'staff@example.invalid',fullName:'Staff',role:'PHARMACIST',cashierAccess:true,pharmacyReconciliationAccess:true};
    expect(await userService.update(2,input)).toMatchObject({pharmacyReconciliationAccess:true,tokenVersion:{increment:1}});
    db.user.findUnique.mockResolvedValue({id:2,role:'PHARMACIST',active:true,cashierAccess:true,pharmacyReconciliationAccess:true});
    expect(await userService.update(2,{...input,cashierAccess:false})).toMatchObject({pharmacyReconciliationAccess:false,tokenVersion:{increment:1}});
  });
  it('records the granting administrator and before/after permission atomically', async () => {
    db.user.findUnique.mockResolvedValue({id:2,role:'CASHIER',active:true,cashierAccess:true,pharmacyReconciliationAccess:false});
    await userService.update(2,{email:'staff@example.invalid',fullName:'Staff',role:'CASHIER',cashierAccess:true,pharmacyReconciliationAccess:true},1);
    expect(db.auditLog.create).toHaveBeenCalledWith({data:expect.objectContaining({userId:1,entityId:2,action:'PHARMACY_RECONCILIATION_ACCESS_CHANGED',details:{before:false,after:true,sessionsRevoked:true}})});
  });
});

describe('pharmacy-wide confirmation', () => {
  it('combines all actors and requires each individual sign-off', async () => {
    const summary = await service.summary(day,admin);
    expect(summary.entries.map(e => e.cashierName)).toEqual(['Cashier A','Cashier B']);
    expect(summary.totals.CASH.received).toBe(100);
    expect(summary.totals.BANK_TRANSFER.received).toBe(100);
    await expect(service.confirm(approval(summary),admin)).rejects.toThrow('individual cashier');
    expect(db.$transaction.mock.calls[0][1].isolationLevel).toBe('RepeatableRead');
  });
  it('allows delegated staff to confirm, stores an audit, and shares status across authorized staff', async () => {
    await signCashiers();
    const delegated = {id:9,role:'CASHIER',pharmacyReconciliationAccess:true,fullName:'Supervisor'};
    const summary = await service.summary(day,delegated);
    expect(summary.openingCash).toBe(100); expect(summary.countedCash).toBe(200);
    await service.confirm(approval(summary),delegated);
    expect(db.auditLog.create).toHaveBeenCalledOnce();
    expect((await service.summary(day,admin)).confirmed).toBe(true);
    await service.confirm(approval(summary),admin);
    expect(db.pharmacyBalanceConfirmation.create).toHaveBeenCalledOnce();
  });
  it('rejects stale previews and invalidates a confirmed day after later payments', async () => {
    await signCashiers();
    const initial = await service.summary(day,admin);
    await service.confirm(approval(initial),admin);
    payments.push({...payments[0],id:99,amount:20});
    expect((await service.summary(day,admin)).confirmed).toBe(false);
    await expect(service.confirm(approval(initial),admin)).rejects.toThrow('changed');
  });
  it('invalidates when a cashier revises their signed count, even without ledger changes', async () => {
    await signCashiers(); const initial = await service.summary(day,admin); await service.confirm(approval(initial),admin);
    personal[0] = {...personal[0],id:99,snapshot:{openingCash:60,countedCash:160}};
    expect((await service.summary(day,admin)).confirmed).toBe(false);
  });
  it('records bank-to-cash refunds as cash out and preserves the original method', async () => {
    refunds.push({id:1,settledById:2,settledAt:new Date('2020-10-01T12:00:00Z'),method:'CASH',amount:20,reference:'R-1',sale:{invoiceNumber:'INV-1',paymentMethod:'BANK_TRANSFER',payments:[{method:'BANK_TRANSFER'}]}});
    await signCashiers(); const summary = await service.summary(day,admin);
    expect(summary.totals.CASH.net).toBe(80);
    expect(summary.entries.find(e=>e.id==='refund-1')).toMatchObject({cashierId:2,originalMethod:'BANK_TRANSFER',method:'CASH',direction:'OUT'});
    await service.confirm(approval(summary),admin);
  });
  it('rejects mismatched combined cash or statement figures', async () => {
    await signCashiers(); const summary=await service.summary(day,admin);
    await expect(service.confirm({...approval(summary),countedCash:999},admin)).rejects.toThrow('Combined cash');
    const input=approval(summary);input.verified.BANK_TRANSFER.received=99;
    await expect(service.confirm(input,admin)).rejects.toThrow('statement/terminal');
    expect(db.pharmacyBalanceConfirmation.create).not.toHaveBeenCalled();
  });
  it('does not guess ownership for legacy transactions', async () => {
    payments[0].cashierId=null;
    const summary=await service.summary(day,admin);
    expect(summary.warnings.some(w=>w.includes('no recorded cashier'))).toBe(true);
  });
});
