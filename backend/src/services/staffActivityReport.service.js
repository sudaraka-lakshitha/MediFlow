import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { exportPages } from '../utils/exportPages.js';

const requireAdmin = user => { if (user?.role !== 'ADMIN') throw new AppError(403, 'Staff activity reports require administrator access.'); };
const staffScope = { user: { is: { role: { in: ['ADMIN','PHARMACIST','CASHIER'] } } } };
const boundary = (day, extra = 0) => new Date(Date.parse(`${day}T00:00:00Z`) + extra * 86400000 - env.REPORT_TIMEZONE_OFFSET_MINUTES * 60000);
export const activityLabel = value => value ? value.toLowerCase().replaceAll('_',' ').replace(/^./, letter => letter.toUpperCase()) : 'Other';
export const staffActivityWhere = query => ({
  ...staffScope,
  ...(query.userId ? { userId: query.userId } : {}),
  ...(query.action ? { action: query.action } : {}),
  ...(query.entityType ? { entityType: query.entityType } : {}),
  ...(query.outcome ? { success: query.outcome === 'SUCCESS' } : {}),
  createdAt: { gte: boundary(query.from), lt: boundary(query.to, 1) },
});
const select = { id:true, createdAt:true, action:true, entityType:true, entityId:true, success:true, deletedAt:true, details:true,
  user:{select:{id:true,fullName:true,role:true,active:true}} };
export const staffActivityRow = row => {
  // Do not export raw audit payloads: they may contain patient details, PINs or internal costs.
  const details = row.details && typeof row.details === 'object' ? row.details : {};
  const text = value => typeof value === 'string' ? value.slice(0,500) : '';
  return { id:row.id, time:row.createdAt.toISOString(), staffId:row.user.id, staff:row.user.fullName, role:row.user.role,
    active:row.user.active, task:activityLabel(row.action), action:row.action, module:activityLabel(row.entityType),
    record:row.entityType ? `${row.entityType}${row.entityId ? ` #${row.entityId}` : ''}` : '',
    reference:text(details.invoiceNumber) || text(details.prescriptionNumber) || text(details.requestNumber),
    result:row.success ? 'SUCCESS' : 'FAILED', archived:Boolean(row.deletedAt) };
};
export const staffActivityReportService = {
  async options(user) {
    requireAdmin(user);
    const [staff, actions, modules] = await Promise.all([
      prisma.user.findMany({where:{role:{in:['ADMIN','PHARMACIST','CASHIER']}},select:{id:true,fullName:true,role:true,active:true},orderBy:[{fullName:'asc'},{id:'asc'}]}),
      prisma.auditLog.findMany({where:staffScope,distinct:['action'],select:{action:true},orderBy:{action:'asc'}}),
      prisma.auditLog.findMany({where:{...staffScope,entityType:{not:null}},distinct:['entityType'],select:{entityType:true},orderBy:{entityType:'asc'}}),
    ]);
    return {staff,actions:actions.map(row=>({value:row.action,label:activityLabel(row.action)})),modules:modules.map(row=>({value:row.entityType,label:activityLabel(row.entityType)}))};
  },
  async report(query,user,tx=null) {
    requireAdmin(user);
    if (!tx) return prisma.$transaction(db=>this.report(query,user,db),{isolationLevel:'RepeatableRead',timeout:20000});
    const where=staffActivityWhere(query);
    const [rows,groups]=await Promise.all([
      tx.auditLog.findMany({where,select,orderBy:[{createdAt:'desc'},{id:'desc'}],skip:(query.page-1)*query.pageSize,take:query.pageSize}),
      tx.auditLog.groupBy({by:['action','success'],where,_count:{_all:true}}),
    ]);
    const tasks=new Map(); let successful=0,failed=0;
    for(const group of groups) {
      const task=tasks.get(group.action)||{action:group.action,task:activityLabel(group.action),successful:0,failed:0,total:0};
      task[group.success?'successful':'failed']+=group._count._all; task.total+=group._count._all;
      if(group.success) successful+=group._count._all; else failed+=group._count._all;
      tasks.set(group.action,task);
    }
    const total=successful+failed;
    return {data:rows.map(staffActivityRow),tasks:[...tasks.values()].sort((a,b)=>b.total-a.total||a.action.localeCompare(b.action)),
      meta:{page:query.page,pageSize:query.pageSize,pages:Math.max(1,Math.ceil(total/query.pageSize)),total,successful,failed,generatedAt:new Date().toISOString()}};
  },
  exportRows(query,user) {
    requireAdmin(user);
    return exportPages(prisma.auditLog,{where:staffActivityWhere(query),select},staffActivityRow);
  },
};
