import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import ExcelJS from 'exceljs';
import { toCsv } from '../src/utils/csv.js';
import { parseCsv } from '../../frontend/src/utils/csv.ts';
import { masterDataBulkRoutes } from '../src/routes/masterDataBulk.routes.js';
import { catalogController } from '../src/controllers/catalog.controller.js';
import { readProductWorkbook } from '../src/services/productWorkbook.service.js';
vi.mock('../src/middleware/authenticate.js',()=>({authenticate:(req,res,next)=>{const role=req.get('x-test-role');if(!role)return res.sendStatus(401);req.user={id:1,role};next();}}));
vi.mock('../src/config/prisma.js',()=>({prisma:{category:{findMany:vi.fn().mockResolvedValue([{id:1,name:'First aid',description:'Saved',active:true,updatedAt:new Date('2026-10-28T00:00:00Z')}])}}}));
vi.mock('../src/services/audit.service.js',()=>({recordAudit:vi.fn()}));
const app=express();app.use(express.json());app.use('/bulk',masterDataBulkRoutes);app.use((err,req,res,next)=>res.status(err.statusCode||400).json({message:err.message}));
describe('spreadsheet export interfaces',()=>{
 it.each(['xlsx','csv'])('requires admin access for %s master export',async format=>{
  expect((await request(app).get(`/bulk/categories/export.${format}`)).status).toBe(401);
  for(const role of ['PATIENT','CASHIER','PHARMACIST'])expect((await request(app).get(`/bulk/categories/export.${format}`).set('x-test-role',role)).status).toBe(403);
 });
 it('blocks unauthorized preview and confirmation',async()=>{
  for(const action of ['preview','excel-preview','confirm'])expect((await request(app).post(`/bulk/categories/${action}`).set('x-test-role','PHARMACIST').send({})).status).toBe(403);
 });
 it('exports an editable CSV with preserved identifiers and versions',async()=>{
  const r=await request(app).get('/bulk/categories/export.csv').set('x-test-role','ADMIN');
  expect(r.status).toBe(200);
  const rows=parseCsv(r.text,{requiredColumn:'id',maxRows:1000,guideRows:false});
  expect(rows[0]).toMatchObject({id:'1',recordVersion:'2026-10-28T00:00:00.000Z',name:'First aid'});
 });
 it('allows patient-number headers without expecting a product SKU',()=>{
  const rows=[{patientNumber:'PAT-1',recordVersion:'2026-10-28T00:00:00.000Z',phone:'0701234567'}];
  expect(parseCsv(toCsv(Object.keys(rows[0]).map(key=>({key,label:key})),rows),{requiredColumn:'patientnumber',maxRows:1000,guideRows:false})).toEqual(rows);
 });
 it('creates a styled product template accepted by the actual upload parser',async()=>{
  let buffer;const res={attachment:()=>res,type:()=>res,send:value=>{buffer=value;}};
  await catalogController.productTemplateExcel({},res);
  const rows=await readProductWorkbook(buffer);expect(rows).toHaveLength(2);expect(rows[0].sku).toBe('EXAMPLE-MED-500');
  const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(buffer);expect(workbook.getWorksheet('Products').views[0].state).toBe('frozen');
 });
});
