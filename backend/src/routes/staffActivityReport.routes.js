import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { streamCsv } from '../utils/csv.js';
import { staffActivityReportService as service } from '../services/staffActivityReport.service.js';
import { createDataWorkbook, XLSX_MIME } from '../services/spreadsheetExport.service.js';
import { formatPharmacyTimestamp } from '../utils/pharmacyTime.js';

const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{
  const parsed=new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10)===value;
},'Choose a valid calendar date.');
export const staffActivityQuery=z.object({
  from:date,to:date,userId:z.coerce.number().int().positive().optional(),action:z.string().trim().min(1).max(80).optional(),
  entityType:z.string().trim().min(1).max(80).optional(),outcome:z.enum(['SUCCESS','FAILED']).optional(),
  page:z.coerce.number().int().min(1).max(1000000).default(1),pageSize:z.coerce.number().int().min(10).max(100).default(50),
}).refine(q=>q.from<=q.to,{message:'End date must be on or after the start date.',path:['to']})
  .refine(q=>Date.parse(q.to)-Date.parse(q.from)<=365*86400000,{message:'Choose no more than 366 days per report.',path:['to']});
export const staffActivityReportRoutes=Router();
staffActivityReportRoutes.use(authenticate,authorize('ADMIN'));
staffActivityReportRoutes.get('/options',asyncHandler(async(req,res)=>res.json({data:await service.options(req.user)})));
staffActivityReportRoutes.get('/',validate({query:staffActivityQuery}),asyncHandler(async(req,res)=>res.json(await service.report(req.validatedQuery,req.user))));
staffActivityReportRoutes.get('/export.:format',validate({params:z.object({format:z.enum(['csv','xlsx'])}),query:staffActivityQuery}),asyncHandler(async(req,res)=>{
  const q=req.validatedQuery;
  res.set('Cache-Control','no-store');
  const columns=[{key:'id',label:'Activity ID'},{key:'localTime',label:'Time (Sri Lanka, UTC+05:30)'},
    {key:'from',label:'Report from (inclusive)'},{key:'to',label:'Report to (inclusive)'},{key:'staffId',label:'Staff ID'},
    {key:'staff',label:'Staff member'},{key:'role',label:'Current role'},{key:'task',label:'Task'},{key:'action',label:'Task code'},
    {key:'module',label:'Module'},{key:'record',label:'Related record'},{key:'reference',label:'Document reference'},
    {key:'result',label:'Outcome'},{key:'archived',label:'In audit trash'}];
  const rows=service.exportRows(q,req.user);
  async function* pages(){for await(const page of rows) yield page.map(row=>({...row,from:q.from,to:q.to,
    localTime:formatPharmacyTimestamp(row.time)}));}
  if(req.params.format==='xlsx') {
    const {buffer}=await createDataWorkbook({title:'MediFlow staff activity report',sheetName:'Activity',columns,pages:pages(),notes:[`Period: ${q.from} to ${q.to}. Filters match the selected staff, task, module and outcome.`, 'Audit history for review only. This file cannot be imported to rewrite staff activity.']});
    res.set('Cache-Control','no-store');res.attachment(`staff-activity-${q.from}-to-${q.to}.xlsx`);res.type(XLSX_MIME).send(buffer);return;
  }
  res.attachment(`staff-activity-${q.from}-to-${q.to}.csv`);res.type('text/csv');
  await streamCsv(res,columns,pages());
}));
