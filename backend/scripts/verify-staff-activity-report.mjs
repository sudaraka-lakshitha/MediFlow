import 'dotenv/config';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {prisma} from '../src/config/prisma.js';
import {staffActivityReportService as service} from '../src/services/staffActivityReport.service.js';
import {staffActivityQuery} from '../src/routes/staffActivityReport.routes.js';
const connection=new URL(process.env.AIVEN_PRISMA_URL||process.env.MYSQL_DATABASE_URL||process.env.DATABASE_URL);
assert(['localhost','127.0.0.1'].includes(connection.hostname),'Local MySQL only.');
const rollback=new Error('ROLLBACK_REPORT_FIXTURES');
try {
  await prisma.$transaction(async tx=>{
    const actor=await tx.user.create({data:{email:`qa-report-${crypto.randomUUID()}@example.invalid`,fullName:'Synthetic report staff',passwordHash:'not-a-login-credential',role:'CASHIER',active:false}});
    await tx.auditLog.createMany({data:[
      ...Array.from({length:53},(_,index)=>({userId:actor.id,action:'PRESCRIPTION_VERIFIED',entityType:'PRESCRIPTION',entityId:index+1,success:true,createdAt:new Date('2000-01-01T12:00:00Z'),deletedAt:index===0?new Date():null})),
      ...[false,true].map(success=>({userId:actor.id,action:'PAYMENT_RECEIVED',entityType:'PAYMENT_REQUEST',success,createdAt:new Date('1999-12-31T18:30:00Z')})),
      {userId:actor.id,action:'OUTSIDE_DAY',success:true,createdAt:new Date('1999-12-31T18:29:59.999Z')},
      {userId:actor.id,action:'OUTSIDE_DAY',success:true,createdAt:new Date('2000-01-01T18:30:00Z')},
    ]});
    const query=staffActivityQuery.parse({from:'2000-01-01',to:'2000-01-01',userId:actor.id});
    const admin={id:actor.id,role:'ADMIN'};
    const first=await service.report(query,admin,tx);
    assert.equal(first.meta.total,55);assert.equal(first.meta.successful,54);assert.equal(first.meta.failed,1);assert.equal(first.data.length,50);
    const second=await service.report({...query,page:2},admin,tx);
    assert.equal(second.data.length,5);assert.equal(new Set([...first.data,...second.data].map(row=>row.id)).size,55);
    assert.equal([...first.data,...second.data].filter(row=>row.archived).length,1,'Retained trashed activity is included.');
    const tasks=await service.report({...query,action:'PAYMENT_RECEIVED',entityType:'PAYMENT_REQUEST',outcome:'FAILED'},admin,tx);
    assert.equal(tasks.meta.total,1);assert.equal(tasks.data[0].result,'FAILED');
    assert.equal((await service.report({...query,action:'NO_MATCH'},admin,tx)).meta.total,0);
    console.log('PASS: inclusive local dates, inactive staff, task/module/outcome filters, pagination, full summary, archived records and empty results.');
    throw rollback;
  },{isolationLevel:'RepeatableRead',timeout:20000});
}catch(error){if(error!==rollback)throw error;}finally{await prisma.$disconnect();}
console.log('All temporary report fixtures rolled back; existing business records unchanged.');
