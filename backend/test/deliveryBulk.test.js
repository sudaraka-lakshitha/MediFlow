import { beforeEach, expect, it, vi } from 'vitest';
const { db, act, lease } = vi.hoisted(() => ({ db: { deliveryRequest: { findFirst: vi.fn() }, refund: { count: vi.fn() }, auditLog: { create: vi.fn() }, $transaction: vi.fn() }, act: vi.fn(), lease: { resource: vi.fn(), acquire: vi.fn(), pinForTransaction: vi.fn(), begin: vi.fn(), finish: vi.fn() } }));
vi.mock('../src/config/prisma.js', () => ({ prisma: db }));
vi.mock('../src/config/env.js', () => ({ env: { JWT_SECRET: 'delivery-test-secret' } }));
vi.mock('../src/services/delivery.service.js', () => ({ deliveryService: { act } }));
vi.mock('../src/services/workflowLease.service.js', () => ({ workflowLeaseService: lease }));
import { deliveryBulkService, deliveryBulkPlan } from '../src/services/deliveryBulk.service.js';
const user = { id: 1, role: 'PHARMACIST' };
const record = { id: 2, paymentRequestId: 3, feePaymentRequestId: 4, status: 'AWAITING_FEE', updatedAt: new Date('2026-10-24T10:00:00Z'), paymentRequest: { status: 'PAID', total: 100, amountPaid: 100, refundedAmount: 0 }, feePaymentRequest: { status: 'PAID', total: 50, amountPaid: 50, refundedAmount: 0 }, courierService: 'Old courier', trackingReference: 'OLD123', recipientName: 'Demo Patient', address: '123 Example Street', phone: '0701234567' };
const row = { invoice_number: 'PAY-123', version: record.updatedAt.toISOString(), action: 'DISPATCH', courier: 'Example Courier', tracking: 'NEW123' };
beforeEach(() => { vi.resetAllMocks(); delete db.deliveryRequest.findMany; db.deliveryRequest.findFirst.mockResolvedValue(record); db.refund.count.mockResolvedValue(0); db.$transaction.mockImplementation(fn => fn(db)); lease.resource.mockResolvedValue('upload:1'); lease.begin.mockImplementation(async resourceKey => ({ resourceKey, token: 'lease' })); });
it('batch-loads preview records and does not fall back for missing invoices', async () => {
  db.deliveryRequest.findMany=vi.fn().mockResolvedValue([{...record,paymentRequest:{...record.paymentRequest,requestNumber:row.invoice_number}}]);
  const result=await deliveryBulkPlan(db,[row,{...row,invoice_number:'PAY-MISSING'}]);
  expect(result.plans).toHaveLength(1);expect(result.errors[0].message).toContain('not found');
  expect(db.deliveryRequest.findMany).toHaveBeenCalledTimes(1);expect(db.deliveryRequest.findFirst).not.toHaveBeenCalled();
});
it('pins only the current chunk and releases it before acquiring the next chunk', async () => {
  const records=Array.from({length:16},(_,i)=>({...record,id:i+1,paymentRequestId:i+100,paymentRequest:{...record.paymentRequest,requestNumber:`PAY-${i}`}}));
  const rows=records.map(r=>({...row,invoice_number:r.paymentRequest.requestNumber}));
  db.deliveryRequest.findMany=vi.fn().mockImplementation(async({where})=>records.filter(r=>where.paymentRequest.requestNumber.in.includes(r.paymentRequest.requestNumber)));
  lease.resource.mockImplementation(async(kind,id)=>`payment:${id}`);
  const active=new Set();let peak=0;
  lease.begin.mockImplementation(async resourceKey=>{active.add(resourceKey);peak=Math.max(peak,active.size);return {resourceKey,token:resourceKey};});
  lease.finish.mockImplementation(async l=>{active.delete(l.resourceKey);});
  lease.pinForTransaction.mockImplementation(async(tx,l)=>{expect(active.has(l.resourceKey)).toBe(true);});
  const preview=await deliveryBulkService.preview(rows,user);
  expect(await deliveryBulkService.apply(rows,preview.previewToken,user,{})).toEqual({applied:16});
  expect(peak).toBe(15);expect(active.size).toBe(0);
  expect(lease.pinForTransaction).toHaveBeenCalledTimes(16);expect(lease.acquire).not.toHaveBeenCalled();
  expect(db.deliveryRequest.findFirst).not.toHaveBeenCalled();
  expect(db.deliveryRequest.findMany.mock.calls.map(([arg])=>arg.where.paymentRequest.requestNumber.in.length)).toEqual([16,16,15,1]);
  expect(db.$transaction).toHaveBeenCalledTimes(2);expect(db.$transaction.mock.calls[0][1].timeout).toBe(35000);
});
it('rejects a delivery removed between validation and the transaction without falling back', async () => {
  db.deliveryRequest.findMany=vi.fn().mockResolvedValue([{...record,paymentRequest:{...record.paymentRequest,requestNumber:row.invoice_number}}]);
  const preview=await deliveryBulkService.preview([row],user);
  db.deliveryRequest.findMany.mockResolvedValueOnce([{...record,paymentRequest:{...record.paymentRequest,requestNumber:row.invoice_number}}]).mockResolvedValueOnce([]);
  await expect(deliveryBulkService.apply([row],preview.previewToken,user,{})).rejects.toThrow('changed');
  expect(act).not.toHaveBeenCalled();expect(db.deliveryRequest.findFirst).not.toHaveBeenCalled();expect(lease.finish).toHaveBeenCalled();
});
it('releases already acquired chunk locks when a later acquisition fails', async () => {
  db.deliveryRequest.findFirst.mockImplementation(async({where})=>({...record,paymentRequestId:where.paymentRequest.requestNumber==='PAY-123'?3:4}));
  lease.resource.mockImplementation(async(kind,id)=>`payment:${id}`);
  const rows=[row,{...row,invoice_number:'PAY-456'}];
  const preview=await deliveryBulkService.preview(rows,user);
  lease.begin.mockResolvedValueOnce({resourceKey:'payment:3',token:'lease'}).mockRejectedValueOnce(new Error('Busy'));
  await expect(deliveryBulkService.apply(rows,preview.previewToken,user,{})).rejects.toThrow('Busy');
  expect(lease.finish).toHaveBeenCalledTimes(1);expect(act).not.toHaveBeenCalled();expect(db.$transaction).not.toHaveBeenCalled();
});
it('previews without writes and applies only after confirmation', async () => {
  const preview = await deliveryBulkService.preview([row], user);
  expect(preview.errors).toEqual([]); expect(preview.previewToken).toBeTruthy(); expect(act).not.toHaveBeenCalled();
  await expect(deliveryBulkService.apply([row], preview.previewToken, user, {})).resolves.toEqual({ applied: 1 });
  expect(act).toHaveBeenCalledWith(3, expect.objectContaining({ action: 'DISPATCH', expectedUpdatedAt: row.version }), user, db);
  expect(lease.finish).toHaveBeenCalled(); expect(db.auditLog.create).toHaveBeenCalled();
});
it('rejects confirmation without preview, changed files and another user', async () => {
  await expect(deliveryBulkService.apply([row], '', user, {})).rejects.toThrow('Preview expired');
  const preview = await deliveryBulkService.preview([row], user);
  await expect(deliveryBulkService.apply([{ ...row, tracking: 'CHANGED' }], preview.previewToken, user, {})).rejects.toThrow('File or user changed');
  await expect(deliveryBulkService.apply([row], preview.previewToken, { ...user, id: 5 }, {})).rejects.toThrow('File or user changed');
});
it('reports stale and duplicate records', async () => {
  expect((await deliveryBulkPlan(db, [{ ...row, version: 'old' }])).errors[0].message).toContain('changed');
  expect((await deliveryBulkPlan(db, [row, row])).errors).toHaveLength(1);
});
it('keeps original spreadsheet row numbers for plans and errors', async () => {
  const result = await deliveryBulkPlan(db, [{ ...row, __sourceRow: '18' }, { ...row, invoice_number: 'PAY-456', version: 'stale', __sourceRow: '21' }]);
  expect(result.plans[0].row).toBe(18);
  expect(result.errors[0].row).toBe(21);
});
it('aborts before business writes if a lease was lost before the transaction', async () => {
  const preview = await deliveryBulkService.preview([row], user);
  lease.pinForTransaction.mockRejectedValueOnce(new Error('Lease lost'));
  await expect(deliveryBulkService.apply([row], preview.previewToken, user, {})).rejects.toThrow('Lease lost');
  expect(act).not.toHaveBeenCalled();
  expect(lease.finish).toHaveBeenCalled();
});
it('rechecks payment at confirmation and applies nothing when it changed', async () => {
  const preview = await deliveryBulkService.preview([row], user);
  db.deliveryRequest.findFirst.mockResolvedValue({ ...record, feePaymentRequest: { ...record.feePaymentRequest, status: 'SLIP_SUBMITTED' } });
  await expect(deliveryBulkService.apply([row], preview.previewToken, user, {})).rejects.toThrow('changed');
  expect(act).not.toHaveBeenCalled();
});
it('rejects patients, missing courier, clear tokens and invalid transitions', async () => {
  await expect(deliveryBulkService.preview([row], { id: 1, role: 'PATIENT' })).rejects.toThrow('Only');
  db.deliveryRequest.findFirst.mockResolvedValue({ ...record, courierService: null });
  expect((await deliveryBulkPlan(db, [{ ...row, courier: '' }])).errors).toHaveLength(1);
  expect((await deliveryBulkPlan(db, [{ ...row, courier: '__CLEAR__' }])).errors).toHaveLength(1);
  expect((await deliveryBulkPlan(db, [{ ...row, action: 'DELIVERED' }])).errors).toHaveLength(1);
});
it('keeps omitted recipient fields and skips blank action rows', async () => {
  const result = await deliveryBulkPlan(db, [{ ...row, action: 'UPDATE_DETAILS', recipient_name: 'new recipient' }, { action: '' }]);
  expect(result.errors).toEqual([]); expect(result.plans).toHaveLength(1);
  expect(result.plans[0].input).toEqual({ action: 'UPDATE_DETAILS', recipientName: 'New Recipient', expectedUpdatedAt: row.version });
  expect(result.plans[0].changes.map(change => change.field)).toEqual(['recipientName']);
});
it('stops before the transaction if another staff member owns the request', async () => {
  const preview = await deliveryBulkService.preview([row], user);
  lease.begin.mockRejectedValue(new Error('Busy'));
  await expect(deliveryBulkService.apply([row], preview.previewToken, user, {})).rejects.toThrow('Busy');
  expect(db.$transaction).not.toHaveBeenCalled();
});
it('passes mutations into one transaction and releases leases on failure', async () => {
  const preview = await deliveryBulkService.preview([row], user);
  act.mockRejectedValue(new Error('Stock changed'));
  await expect(deliveryBulkService.apply([row], preview.previewToken, user, {})).rejects.toThrow('Stock changed');
  expect(db.auditLog.create).not.toHaveBeenCalled(); expect(lease.finish).toHaveBeenCalled();
});
