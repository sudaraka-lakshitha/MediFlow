import {beforeEach,describe,expect,it,vi} from 'vitest';
import express from 'express';
import request from 'supertest';
import {staffActivityReportService as service,staffActivityWhere,staffActivityRow} from '../src/services/staffActivityReport.service.js';
import {staffActivityQuery,staffActivityReportRoutes} from '../src/routes/staffActivityReport.routes.js';
const {db}=vi.hoisted(()=>({db:{}}));
vi.mock('../src/config/prisma.js',()=>({prisma:db}));
vi.mock('../src/config/env.js',()=>({env:{REPORT_TIMEZONE_OFFSET_MINUTES:330}}));
vi.mock('../src/middleware/authenticate.js',()=>({authenticate:(req,_res,next)=>{req.user={id:1,role:req.headers['x-test-role']||'PATIENT'};next();}}));
const admin={id:1,role:'ADMIN'};
const query=()=>staffActivityQuery.parse({from:'2026-10-01',to:'2026-10-02'});
const row={id:2,createdAt:new Date('2026-10-01T04:30:00Z'),action:'PRESCRIPTION_VERIFIED',entityType:'PRESCRIPTION',entityId:3,success:true,deletedAt:null,
  user:{id:4,fullName:'Cashier A',role:'CASHIER',active:false},details:{prescriptionNumber:'RX-123',pickupPin:'1234',passwordHash:'secret',patient:{diagnosis:'private'}}};
beforeEach(()=>{
  Object.assign(db,{auditLog:{findMany:vi.fn(async()=>[row]),groupBy:vi.fn(async()=>[{action:row.action,success:true,_count:{_all:110}},{action:row.action,success:false,_count:{_all:2}}]),findFirst:vi.fn(async()=>({id:2}))},user:{findMany:vi.fn(async()=>[row.user])},$transaction:vi.fn(async fn=>fn(db))});
});
describe('staff activity filters',()=>{
  it.each(['2026-02-30','2026-13-01','not-a-date'])('rejects invalid calendar date %s',date=>expect(staffActivityQuery.safeParse({...query(),from:date}).success).toBe(false));
  it('rejects reversed or overly long ranges and accepts leap day',()=>{
    expect(staffActivityQuery.safeParse({...query(),from:'2026-10-03'}).success).toBe(false);
    expect(staffActivityQuery.safeParse({...query(),from:'2025-01-01'}).success).toBe(false);
    expect(staffActivityQuery.safeParse({...query(),from:'2024-02-29',to:'2024-03-01'}).success).toBe(true);
  });
  it('applies staff, exact task, module, outcome and inclusive local dates together',()=>{
    const where=staffActivityWhere({...query(),userId:4,action:'PRESCRIPTION_VERIFIED',entityType:'PRESCRIPTION',outcome:'FAILED'});
    expect(where).toMatchObject({userId:4,action:'PRESCRIPTION_VERIFIED',entityType:'PRESCRIPTION',success:false,user:{is:{role:{in:['ADMIN','PHARMACIST','CASHIER']}}}});
    expect(where.createdAt.gte.toISOString()).toBe('2026-09-30T18:30:00.000Z');
    expect(where.createdAt.lt.toISOString()).toBe('2026-10-02T18:30:00.000Z');
    expect(where.deletedAt).toBeUndefined(); // Retained trashed records are not silently omitted.
  });
  it('rejects invalid staff, outcomes and paging',()=>{
    for(const invalid of [{userId:0},{outcome:'ALL'},{page:0},{pageSize:1000},{action:''}])expect(staffActivityQuery.safeParse({...query(),...invalid}).success).toBe(false);
  });
});
describe('staff activity report',()=>{
  it('summarizes all matches independently of the current page',async()=>{
    const result=await service.report({...query(),page:2},admin);
    expect(result.meta).toMatchObject({total:112,successful:110,failed:2,page:2,pages:3});
    expect(result.tasks[0]).toMatchObject({total:112,successful:110,failed:2});
    expect(db.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({skip:50,take:50,orderBy:[{createdAt:'desc'},{id:'desc'}]}));
    expect(db.$transaction.mock.calls[0][1].isolationLevel).toBe('RepeatableRead');
  });
  it('omits sensitive raw payloads while retaining document references and inactive staff',()=>{
    const mapped=staffActivityRow(row);
    expect(mapped).toMatchObject({reference:'RX-123',staff:'Cashier A',active:false,task:'Prescription verified',result:'SUCCESS'});
    expect(mapped).not.toHaveProperty('details');expect(JSON.stringify(mapped)).not.toContain('secret');expect(JSON.stringify(mapped)).not.toContain('private');
  });
  it('returns zero summaries for empty results',async()=>{
    db.auditLog.findMany.mockResolvedValue([]);db.auditLog.groupBy.mockResolvedValue([]);
    expect(await service.report(query(),admin)).toMatchObject({data:[],tasks:[],meta:{pages:1,total:0,successful:0,failed:0}});
  });
  it('exports the same filters without applying the visible-page limit',async()=>{
    const q={...query(),page:2,userId:4,action:row.action,outcome:'SUCCESS'};
    const pages=[];for await(const page of service.exportRows(q,admin))pages.push(...page);
    expect(pages).toHaveLength(1);
    expect(db.auditLog.findFirst).toHaveBeenCalledWith(expect.objectContaining({where:staffActivityWhere(q)}));
    expect(db.auditLog.findMany.mock.calls[0][0]).toMatchObject({take:500,where:{AND:[staffActivityWhere(q),{id:{gt:0,lte:2}}]}});
    expect(db.auditLog.findMany.mock.calls[0][0]).not.toHaveProperty('skip');
  });
  it.each(['CASHIER','PHARMACIST','PATIENT'])('denies %s even with delegated reconciliation permission',async role=>{
    const actor={id:2,role,pharmacyReconciliationAccess:true,cashierAccess:true};
    await expect(service.report(query(),actor)).rejects.toMatchObject({statusCode:403});
    await expect(service.options(actor)).rejects.toMatchObject({statusCode:403});
    expect(()=>service.exportRows(query(),actor)).toThrow('administrator');
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});
describe('staff report HTTP boundary',()=>{
  const app=express();app.use('/report',staffActivityReportRoutes);app.use((error,_req,res,_next)=>res.status(error.statusCode||400).json({message:error.message}));
  it.each(['/report','/report/options','/report/export.csv'])('protects %s server-side',async path=>{
    expect((await request(app).get(path).query(query()).set('x-test-role','PHARMACIST')).status).toBe(403);
  });
  it('returns the report to an administrator and validates dates',async()=>{
    expect((await request(app).get('/report').query(query()).set('x-test-role','ADMIN')).body.meta.total).toBe(112);
    expect((await request(app).get('/report').query({...query(),to:'2026-02-30'}).set('x-test-role','ADMIN')).status).toBe(400);
  });
  it('exports safe spreadsheet cells with local time and report dates',async()=>{
    db.auditLog.findMany.mockResolvedValue([{...row,user:{...row.user,fullName:'=SUM(A1)'}}]);
    const response=await request(app).get('/report/export.csv').query(query()).set('x-test-role','ADMIN');
    expect(response.status).toBe(200);expect(response.text).toContain("'=SUM(A1)");expect(response.text).toContain('2026-10-01 10:00:00');expect(response.text).not.toContain('pickupPin');
  });
});
