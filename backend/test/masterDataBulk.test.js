import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import ExcelJS from 'exceljs';
import { masterDataPlan, masterDataExport, masterDataBulkService, readMasterWorkbook, masterDataColumns } from '../src/services/masterDataBulk.service.js';
import { createDataWorkbook } from '../src/services/spreadsheetExport.service.js';
const { db }=vi.hoisted(()=>({db:{category:{findUnique:vi.fn(),findMany:vi.fn(),update:vi.fn(),updateMany:vi.fn()},patientProfile:{findUnique:vi.fn()},patientPhoneIdentity:{deleteMany:vi.fn(),create:vi.fn()},auditLog:{create:vi.fn()},operationReceipt:{findUnique:vi.fn(),create:vi.fn(),update:vi.fn()},$transaction:vi.fn()}}));
vi.mock('../src/config/prisma.js',()=>({prisma:db}));
const version='2026-10-28T00:00:00.000Z';
const row=(patch={})=>({id:'1',recordVersion:version,description:'New description',...patch});
beforeEach(()=>{
 vi.resetAllMocks();
 delete db.patientProfile.findMany; delete db.auditLog.createMany;
 const saved={id:1,name:'First aid',description:'Original',active:true,updatedAt:new Date(version)};
 db.category.findUnique.mockResolvedValue(saved);db.category.findMany.mockResolvedValue([saved]);
 db.category.updateMany.mockResolvedValue({count:1});
 db.$transaction.mockImplementation(fn=>fn(db));
 db.operationReceipt.findUnique.mockResolvedValue(null);
});
describe('master data bulk edit',()=>{
 it('batch-loads alphanumeric patient numbers and detects missing patients without individual queries',async()=>{
  const patient={id:2,userId:3,patientNumber:'PAT-1',user:{updatedAt:new Date(version),fullName:'Demo Patient',phone:'0701234567'},dateOfBirth:new Date('2000-01-01'),address:'',allergies:'',chronicConditions:''};
  db.patientProfile.findMany=vi.fn().mockResolvedValue([patient]);
  const result=await masterDataPlan(db,'patients',[
   {patientNumber:'PAT-1',recordVersion:version,address:'New address'},
   {patientNumber:'PAT-2',recordVersion:version,address:'Other address'},
  ]);
  expect(db.patientProfile.findMany).toHaveBeenCalledWith({where:{patientNumber:{in:['PAT-1','PAT-2']}},include:{user:true}});
  expect(result.plans).toHaveLength(1);expect(result.errors[0].message).toContain('no longer exists');
  expect(db.patientProfile.findUnique).not.toHaveBeenCalled();
 });
 it('does not query missing numeric records individually after a batch lookup',async()=>{
  db.category.findMany.mockResolvedValue([]);
  expect((await masterDataPlan(db,'categories',[row()])).errors[0].message).toContain('no longer exists');
  expect(db.category.findUnique).not.toHaveBeenCalled();
 });
 it('batches audit logs with at most fifteen updates per transaction',async()=>{
  const saved=Array.from({length:16},(_,i)=>({id:i+1,name:`Category ${i+1}`,description:'Original',active:true,updatedAt:new Date(version)}));
  db.category.findMany.mockResolvedValue(saved);db.auditLog.createMany=vi.fn();
  const rows=saved.map(r=>row({id:String(r.id)})),user={id:10};
  const preview=await masterDataBulkService.preview('categories',rows,user);
  expect(await masterDataBulkService.apply('categories',rows,preview.previewToken,user)).toEqual({status:'COMPLETED',applied:true,updated:16});
  expect(db.auditLog.createMany.mock.calls.map(([arg])=>arg.data.length)).toEqual([15,1]);
  expect(db.auditLog.create).not.toHaveBeenCalled();
  expect(db.category.findUnique).not.toHaveBeenCalled();
  expect(db.$transaction).toHaveBeenCalledTimes(2);
  expect(db.$transaction.mock.calls[0][1].timeout).toBe(35000);
 });
 it('preserves literal reserved words and spreadsheet escapes through export and upload',async()=>{
  const saved={id:1,name:'First aid',description:'[CLEAR]',active:true,updatedAt:new Date(version)};
  db.category.findMany.mockResolvedValue([saved]);db.category.findUnique.mockResolvedValue(saved);
  const rows=await masterDataExport('categories');
  expect(rows[0].description).toBe("'[CLEAR]");
  expect((await masterDataPlan(db,'categories',rows)).plans[0].changes).toEqual([]);
 });
 it('rejects a name already used by a different record',async()=>{
  db.category.findUnique.mockImplementation(async({where})=>where.name?{id:2,name:'Existing'}:{id:1,name:'First aid',description:'Original',active:true,updatedAt:new Date(version)});
  expect((await masterDataPlan(db,'categories',[row({name:'Existing'})])).errors[0].message).toContain('another saved record');
 });
 it('preserves blanks and distinguishes an explicit clear',async()=>{
  const a=await masterDataPlan(db,'categories',[row({description:''})]);expect(a.plans[0].changes).toEqual([]);
  const b=await masterDataPlan(db,'categories',[row({description:'[CLEAR]'})]);expect(b.plans[0].changes).toEqual([{field:'description',before:'Original',after:null}]);
 });
 it('rejects duplicate identities and changed record versions',async()=>{
  expect((await masterDataPlan(db,'categories',[row(),row()])).errors).toHaveLength(1);
  expect((await masterDataPlan(db,'categories',[row({recordVersion:'old'})])).errors[0].message).toContain('changed');
 });
 it.each([{name:'[CLEAR]'},{active:'maybe'},{unknown:'x'},{id:'1.2'},{id:''}])('rejects invalid edits %j',async patch=>{
  expect((await masterDataPlan(db,'categories',[row(patch)])).errors).toHaveLength(1);
 });
 it('decodes CSV spreadsheet escapes while preserving leading plus in phone text',async()=>{
  db.patientProfile.findUnique.mockResolvedValue({id:2,userId:3,patientNumber:'PAT-1',user:{updatedAt:new Date(version),fullName:'Demo Patient',phone:'0701234567'},dateOfBirth:new Date('2000-01-01'),address:'',allergies:'',chronicConditions:''});
  const r=await masterDataPlan(db,'patients',[{patientNumber:'PAT-1',recordVersion:version,phone:"'+94701234567"}]);
  expect(r.errors).toEqual([]);expect(r.plans[0].patch.phone).toBe('0701234567');
 });
 it('roundtrips formatted Excel exports with exact identities and versions',async()=>{
  const rows=await masterDataExport('categories');
  const {buffer}=await createDataWorkbook({title:'Categories',sheetName:'Updates',columns:masterDataColumns('categories').map(key=>({key,label:key})),rows,notes:['Edit, validate and confirm.']});
  const imported=await readMasterWorkbook(buffer,'categories');
  expect(imported[0].recordVersion).toBe(version);expect((await masterDataPlan(db,'categories',imported)).plans[0].changes).toEqual([]);
 });
 it('keeps formula-looking text as literal text in reports',async()=>{
  const {buffer}=await createDataWorkbook({title:'Report',columns:[{key:'code',label:'Code'},{key:'value',label:'Value',numeric:true}],rows:[{code:'=1+1',value:-5}]});
  const wb=new ExcelJS.Workbook();await wb.xlsx.load(buffer);const sheet=wb.worksheets[0];
  expect(sheet.getCell('A4').value).toBe('=1+1');expect(sheet.getCell('B4').value).toBe(-5);expect(sheet.getCell('A4').type).toBe(ExcelJS.ValueType.String);
 });
 it('requires a fresh preview after a saved record changes and never writes partial changes',async()=>{
  const rows=[row()],user={id:10};const p=await masterDataBulkService.preview('categories',rows,user);
  db.category.findMany.mockResolvedValue([{id:1,name:'First aid',description:'Changed elsewhere',active:true,updatedAt:new Date('2026-10-28T00:01:00Z')}]);
  await expect(masterDataBulkService.apply('categories',rows,p.previewToken,user)).rejects.toThrow('changed');expect(db.category.update).not.toHaveBeenCalled();
 });
 it('rejects another user confirming a preview',async()=>{
  const rows=[row()];const p=await masterDataBulkService.preview('categories',rows,{id:10});
  await expect(masterDataBulkService.apply('categories',rows,p.previewToken,{id:11})).rejects.toThrow('does not match');
 });
 it('replays a completed token without applying updates again',async()=>{
  const rows=[row()],user={id:10};const p=await masterDataBulkService.preview('categories',rows,user);
  const result=await masterDataBulkService.apply('categories',rows,p.previewToken,user);
  const receipt=db.operationReceipt.create.mock.calls[0][0].data;
  db.operationReceipt.findUnique.mockResolvedValue({...receipt,result});
  expect(await masterDataBulkService.apply('categories',rows,p.previewToken,user)).toEqual(result);expect(db.category.updateMany).toHaveBeenCalledTimes(1);
 });
 it('rejects a category changed after preview instead of overwriting it',async()=>{
  const rows=[row()],user={id:10};const p=await masterDataBulkService.preview('categories',rows,user);
  db.category.updateMany.mockResolvedValue({count:0});
  await expect(masterDataBulkService.apply('categories',rows,p.previewToken,user)).rejects.toThrow('changed after export');
 });
 it('does not report an unfinished bulk operation as successful on retry',async()=>{
  const rows=[row()],user={id:10};const p=await masterDataBulkService.preview('categories',rows,user);
  db.operationReceipt.findUnique.mockResolvedValue({payloadHash:createHash('sha256').update(JSON.stringify({dataset:'categories',rows})).digest('hex'),result:{status:'RUNNING',completedChunks:1}});
  await expect(masterDataBulkService.apply('categories',rows,p.previewToken,user)).rejects.toThrow('is running');
 });
});
