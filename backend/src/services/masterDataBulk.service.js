import { createHash, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import ExcelJS from 'exceljs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { chunkedTransaction } from '../utils/chunkedTransaction.js';
import { operationContext } from '../utils/operationContext.js';
import { categorySchema, manufacturerSchema, supplierSchema } from '../validators/catalog.validator.js';
import { updateOwnProfileSchema } from '../validators/patient.validator.js';
import { checkWorkbookArchive } from './deliveryWorkbook.service.js';
import { workbookLimits } from '../utils/workbookLimits.js';
import { calendarDate } from '../validators/calendar.js';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const active = z.boolean();
export const masterDataDefinitions = {
  categories: { model: 'category', fields: ['name','description','active'], clearable: ['description'], schema: categorySchema.extend({ active }) },
  manufacturers: { model: 'manufacturer', fields: ['name','country','website','phone','email','active'], clearable: ['country','website','phone','email'], schema: manufacturerSchema.extend({ active }) },
  suppliers: { model: 'supplier', fields: ['name','contactPerson','phone','email','address','active'], clearable: ['contactPerson','phone','email','address'], schema: supplierSchema.extend({ active }) },
  patients: { model: 'patientProfile', fields: ['fullName','phone','dateOfBirth','address','allergies','chronicConditions'], clearable: ['phone','dateOfBirth','address','allergies','chronicConditions'], schema: updateOwnProfileSchema.omit({ expectedUpdatedAt: true }) },
};
export const masterDataColumns = dataset => [dataset === 'patients' ? 'patientNumber' : 'id', 'recordVersion', ...masterDataDefinitions[dataset].fields];
const snapshot = (dataset, row) => Object.fromEntries(masterDataColumns(dataset).map(key => [key,
  key === 'recordVersion' ? (dataset === 'patients' ? row.user.updatedAt : row.updatedAt).toISOString()
    : key === 'dateOfBirth' ? row.dateOfBirth?.toISOString().slice(0,10) || ''
    : dataset === 'patients' && ['fullName','phone'].includes(key) ? row.user[key] ?? '' : row[key] ?? '' ]));
export async function masterDataExport(dataset, search = '') {
  const def = masterDataDefinitions[dataset];
  const where = search ? dataset === 'patients' ? { OR: [{ patientNumber: { contains: search } }, { user: { fullName: { contains: search } } }] } : { name: { contains: search } } : {};
  const rows = await prisma[def.model].findMany({ where, ...(dataset === 'patients' ? { include: { user: true } } : {}), orderBy: { id: 'asc' }, take: 1001 });
  if (rows.length > 1000) throw new AppError(413, 'Narrow the search to export at most 1,000 editable records at a time.');
  return rows.map(row => Object.fromEntries(Object.entries(snapshot(dataset, row)).map(([key,value]) => [key,
    typeof value === 'string' && (value === '[CLEAR]' || /^['=+\-@]/.test(value)) ? `'${value}` : value
  ])));
}
export async function readMasterWorkbook(buffer, dataset) {
  await checkWorkbookArchive(buffer, workbookLimits.product);
  const wb = new ExcelJS.Workbook();
  try { await wb.xlsx.load(buffer); } catch { throw new AppError(400, 'Cannot read workbook. Use the Excel export for update.'); }
  const sheet = wb.getWorksheet('Updates') || wb.worksheets[0];
  const keys = masterDataColumns(dataset);
  let header = 0, headers = [];
  for(let r=1;r<=Math.min(sheet?.rowCount || 0,40);r++) {
    const cells=sheet.getRow(r).values.slice(1).map(v=>String(v??'').trim());
    if(cells.includes(keys[0]) && cells.includes('recordVersion')) { header=r;headers=cells;break; }
  }
  if(!header) throw new AppError(400, 'Use the matching export for update, including recordVersion.');
  if(new Set(headers).size!==headers.length || headers.some(h=>!keys.includes(h))) throw new AppError(400,'Unknown or duplicate column. Keep exported headers unchanged.');
  const rows=[];
  for(let r=header+1;r<=sheet.rowCount;r++) {
    const row={}; for(const [i,key]of headers.entries()) {
      let v=sheet.getRow(r).getCell(i+1).value;
      if(v instanceof Date)v=v.toISOString().slice(0,10);
      else if(v && typeof v==='object')throw new AppError(400,`Row ${r}: use plain values, not formulas or links.`);
      row[key]=v??'';
    }
    if(Object.values(row).some(v=>v!==''))rows.push(row);
    if(rows.length>1000)throw new AppError(400,'Use at most 1,000 records per upload.');
  }
  if(!rows.length)throw new AppError(400,'No update rows found.');
  return rows;
}
export async function masterDataPlan(tx, dataset, rows) {
  const def=masterDataDefinitions[dataset], plans=[],errors=[],seen=new Set(), names=new Set();
  const key=dataset==='patients'?'patientNumber':'id';
  for(const [index,input]of rows.entries()) {
    try {
      const unknown=Object.keys(input).filter(k=>!masterDataColumns(dataset).includes(k));
      if(unknown.length)throw new AppError(400,`Unknown columns: ${unknown.join(', ')}.`);
      const identifier=String(input[key]??'').trim();
      if(!identifier || (key==='id'&&!/^[1-9]\d*$/.test(identifier)))throw new AppError(400,`A valid ${key} from Export for update is required.`);
      if(seen.has(identifier))throw new AppError(400,'This record appears more than once.');seen.add(identifier);
      const record=await tx[def.model].findUnique({where:{[key]:key==='id'?Number(identifier):identifier},...(dataset==='patients'?{include:{user:true}}:{})});
      if(!record)throw new AppError(400,'Record no longer exists. Export again.');
      const before=snapshot(dataset,record);
      if(input.recordVersion!==before.recordVersion)throw new AppError(409,'Record changed since export. Export fresh data before editing.');
      const next={...before},patch={};
      for(const field of def.fields) {
        let v=input[field];if(v==null||String(v).trim()==='')continue;
        if(typeof v==='string')v=v.trim();
        // Decode the spreadsheet-safe CSV prefix for literal text.
        const escaped=typeof v==='string'&&/^'(?:'|\[CLEAR\]$|[=+\-@])/.test(v);
        if(escaped)v=v.slice(1);
        if(v==='[CLEAR]'&&!escaped) { if(!def.clearable.includes(field))throw new AppError(400,`${field} cannot be cleared.`);v=null; }
        if(field==='active') { if(!/^(true|false|yes|no|1|0)$/i.test(String(v)))throw new AppError(400,'Active must be Yes or No.');v=/^(true|yes|1)$/i.test(String(v)); }
        if(field==='dateOfBirth'&&v!=null&&!calendarDate.safeParse(v).success)throw new AppError(400,'Date of birth must be a valid YYYY-MM-DD date.');
        next[field]=v;patch[field]=v;
      }
      const parsed=def.schema.safeParse(Object.fromEntries(def.fields.map(f=>[f,next[f]===''&&def.clearable.includes(f)?null:next[f]])));
      if(!parsed.success)throw new AppError(400,parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));
      for(const field of Object.keys(patch))patch[field]=parsed.data[field];
      if(dataset!=='patients') {
        const name=parsed.data.name;
        const normalized=name.toLocaleLowerCase('en-US');
        if(names.has(normalized))throw new AppError(400,'Two rows cannot use the same name.');
        names.add(normalized);
        if(name!==before.name) {
          const existing=await tx[def.model].findUnique({where:{name}});
          if(existing && existing.id!==record.id)throw new AppError(400,'This name belongs to another saved record. Use a unique name.');
        }
      }
      const comparison=v=>v instanceof Date?v.toISOString().slice(0,10):String(v??'');
      const changes=Object.keys(patch).filter(f=>comparison(before[f])!==comparison(patch[f])).map(field=>({field,before:before[field],after:patch[field]}));
      plans.push({id:record.id,userId:record.userId,identifier,before,patch,changes});
    } catch(error) {if(!(error instanceof AppError))throw error;errors.push({row:index+2,message:error.message});}
  }
  return {plans,errors};
}
export const masterDataBulkService={
  async preview(dataset,rows,user) {
    const {plans,errors}=await masterDataPlan(prisma,dataset,rows);
    return {rows,errors,preview:plans.map(p=>({identifier:p.identifier,changes:p.changes})),previewToken:errors.length?null:jwt.sign({purpose:'master-data',dataset,userId:user.id,digest:hash(rows),planDigest:hash(plans)},env.JWT_SECRET,{expiresIn:'15m',jwtid:randomUUID()})};
  },
  async apply(dataset, rows, token, user) {
    let claim;
    try { claim = jwt.verify(token, env.JWT_SECRET); }
    catch { throw new AppError(409, 'Preview expired. Validate again.'); }
    if (claim.purpose !== 'master-data' || claim.dataset !== dataset || claim.userId !== user.id || claim.digest !== hash(rows) || !claim.jti) {
      throw new AppError(409, 'The preview does not match this file or user.');
    }

    return operationContext.run({ actorId: user.id, key: claim.jti, hash: hash({ dataset, rows }) }, async () => {
      const context = operationContext.getStore();
      const where = { actorId_key: { actorId: context.actorId, key: context.key } };
      const existing = await prisma.operationReceipt.findUnique({ where });
      if (existing) {
        if (existing.payloadHash !== context.hash) throw new AppError(409, 'This retry key belongs to a different operation. Refresh and review the form.');
        return existing.result;
      }

      // Phase 1 — validate plan against current DB state without heavy locks
      const { plans, errors } = await masterDataPlan(prisma, dataset, rows);
      if (errors.length || hash(plans) !== claim.planDigest) {
        throw new AppError(409, 'Records changed or are invalid. Export and review them again.');
      }

      const changed = plans.filter((p) => p.changes.length);
      if (!changed.length) return { applied: true, updated: 0 };

      await prisma.operationReceipt.create({ data: { actorId: context.actorId, key: context.key, payloadHash: context.hash, result: {} } });

      // Phase 2 — apply in small transactional chunks to stay under gateway timeouts
      await chunkedTransaction({
        items: changed,
        chunkSize: 25,
        timeout: 25000,
        async process(tx, chunk) {
          for (const p of chunk) {
            const data = Object.fromEntries(p.changes.map((c) => [c.field, p.patch[c.field]]));
            if (dataset === 'patients') {
              const { fullName, phone, ...profile } = data;
              const expected = new Date(p.before.recordVersion);
              const claimed = await tx.user.updateMany({
                where: { id: p.userId, updatedAt: expected },
                data: {
                  ...(fullName !== undefined ? { fullName } : {}),
                  ...(phone !== undefined ? { phone } : {}),
                  updatedAt: new Date(Math.max(Date.now(), expected.getTime() + 1)),
                },
              });
              if (claimed.count !== 1) throw new AppError(409, 'Patient details changed. Export again.');
              await tx.patientProfile.update({ where: { id: p.id }, data: profile });
            } else {
              await tx[masterDataDefinitions[dataset].model].update({ where: { id: p.id }, data });
            }
            await tx.auditLog.create({
              data: {
                userId: user.id,
                action: 'MASTER_DATA_BULK_UPDATED',
                entityType: dataset.toUpperCase(),
                entityId: p.id,
                details: { changes: p.changes },
              },
            });
          }
        },
      });

      const result = { applied: true, updated: changed.length };
      await prisma.operationReceipt.update({ where, data: { result } });
      return result;
    });
  },
};
