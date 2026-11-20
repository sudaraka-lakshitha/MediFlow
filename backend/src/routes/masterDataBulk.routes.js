// API addresses for uploading many categories, manufacturers or suppliers from a spreadsheet.
// For each address: who may use it (signed in, which role), which input checks run first, and which
// controller handles it.

import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { masterDataColumns, masterDataExport, readMasterWorkbook, masterDataBulkService } from '../services/masterDataBulk.service.js';
import { createDataWorkbook, XLSX_MIME } from '../services/spreadsheetExport.service.js';
import { toCsv } from '../utils/csv.js';
import { base64WorkbookLimit } from '../utils/workbookLimits.js';
import { recordAudit } from '../services/audit.service.js';
const params=z.object({dataset:z.enum(['categories','manufacturers','suppliers','patients'])});
const body=z.object({rows:z.array(z.record(z.string(),z.unknown())).min(1).max(1000),previewToken:z.string().max(3000).optional()});
export const masterDataBulkRoutes=Router();
masterDataBulkRoutes.use(authenticate,authorize('ADMIN'));
masterDataBulkRoutes.get('/:dataset/export.:format',validate({params:params.extend({format:z.enum(['xlsx','csv'])}),query:z.object({search:z.string().trim().max(150).default('')})}),asyncHandler(async(req,res)=>{
  const {dataset,format}=req.params,rows=await masterDataExport(dataset,req.validatedQuery.search),columns=masterDataColumns(dataset).map(key=>({key,label:key}));
  const notes=['Edit saved records, then upload this file in Administrative data exports > Bulk update.','Keep identity and recordVersion unchanged. Blank cells keep saved details. [CLEAR] removes optional details.','Validate, review all before/after changes, then confirm. New records use the normal creation or registration forms.'];
  const payload=format==='xlsx'?(await createDataWorkbook({title:`MediFlow ${dataset} for update`,sheetName:'Updates',columns,rows,notes})).buffer:Buffer.from('\uFEFF'+toCsv(columns,rows));
  await recordAudit({userId:req.user.id,action:'MASTER_DATA_EXPORTED',entityType:dataset.toUpperCase(),details:{format,rowCount:rows.length},ipAddress:req.ip});
  res.set('Cache-Control','no-store');res.attachment(`mediflow-${dataset}-for-update.${format}`);res.type(format==='xlsx'?XLSX_MIME:'text/csv').send(payload);
}));
masterDataBulkRoutes.post('/:dataset/excel-preview',validate({params,body:z.object({fileBase64:z.string().min(8).max(base64WorkbookLimit('product')).regex(/^[A-Za-z0-9+/]+={0,2}$/)})}),asyncHandler(async(req,res)=>{
  const rows=await readMasterWorkbook(Buffer.from(req.body.fileBase64,'base64'),req.params.dataset);
  res.json({data:await masterDataBulkService.preview(req.params.dataset,rows,req.user)});
}));
masterDataBulkRoutes.post('/:dataset/preview',validate({params,body}),asyncHandler(async(req,res)=>res.json({data:await masterDataBulkService.preview(req.params.dataset,req.body.rows,req.user)})));
masterDataBulkRoutes.post('/:dataset/confirm',validate({params,body:body.extend({previewToken:z.string().min(1).max(3000)})}),asyncHandler(async(req,res)=>res.json({data:await masterDataBulkService.apply(req.params.dataset,req.body.rows,req.body.previewToken,req.user)})));
