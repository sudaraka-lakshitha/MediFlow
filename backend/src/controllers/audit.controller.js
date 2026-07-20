import { prisma } from '../config/prisma.js';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { auditService } from '../services/audit.service.js';
import { toCsv } from '../utils/csv.js';

export const auditController = {
  myActivity: async (req, res) => res.json(await auditService.myActivity(req.user.id, req.validatedQuery)),
  list: async (req, res) => res.json(await auditService.list(req.validatedQuery)),
  staffSummary: async (req, res) => res.json(await auditService.staffSummary(req.validatedQuery)),
  markWarningsRead: async (req, res) => {
    const data = await auditService.markWarningsRead(req.validatedQuery);
    res.json({ data, message: `${data.updated} audit warning(s) marked as read.` });
  },
  moveToTrash: async (req, res) => {
    const data = await auditService.moveToTrash(req.validatedQuery);
    res.json({ data, message: `${data.moved} audit record(s) moved to trash for ${data.retentionDays} days.` });
  },
  moveSelectedToTrash: async (req, res) => {
    const data = await auditService.moveSelectedToTrash(req.body.ids);
    res.json({ data, message: `${data.moved} selected audit record(s) moved to trash for ${data.retentionDays} days.` });
  },
  restore: async (req, res) => {
    const data = await auditService.restore(Number(req.params.id));
    res.json({ data, message: data.restored ? 'Audit record restored.' : 'Audit record was not found in trash.' });
  },
  restoreAll: async (_req, res) => {
    const data = await auditService.restoreAll();
    res.json({ data, message: `${data.restored} audit record(s) restored.` });
  },
  export: async (req, res) => {
    const rows = await auditService.exportRows(req.validatedQuery);
    const columns = [
      { key: 'time', label: 'Time' },
      { key: 'staff', label: 'Staff member' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'action', label: 'Action' },
      { key: 'entity', label: 'Entity' },
      { key: 'result', label: 'Result' },
      { key: 'warningStatus', label: 'Warning status' },
      { key: 'trashedAt', label: 'Trashed at' },
      { key: 'permanentDeletionAt', label: 'Permanent deletion at' },
      { key: 'method', label: 'Method' },
      { key: 'path', label: 'Path' },
      { key: 'ipAddress', label: 'IP address' },
      { key: 'requestId', label: 'Request ID' },
      { key: 'details', label: 'Details' },
    ];
    const data = rows.map((row) => ({
      time: row.createdAt.toISOString(),
      staff: row.user?.fullName || 'System',
      email: row.user?.email || '',
      role: row.user?.role || '',
      action: row.action,
      entity: `${row.entityType || ''}${row.entityId ? ` #${row.entityId}` : ''}`.trim(),
      result: row.success ? 'SUCCESS' : 'FAILED',
      warningStatus: row.success ? '' : row.readAt ? 'READ' : 'UNREAD',
      trashedAt: row.deletedAt?.toISOString() || '',
      permanentDeletionAt: row.deletedAt ? new Date(row.deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : '',
      method: row.method || '',
      path: row.path || '',
      ipAddress: row.ipAddress || '',
      requestId: row.requestId || '',
      details: row.details ? JSON.stringify(row.details) : '',
    }));
    res.setHeader('Content-Disposition', 'attachment; filename="mediflow-staff-audit.csv"');
    res.type('text/csv').send(toCsv(columns, data));
  },
  errors: async (_req, res) => {
    let content = '';
    let fileSizeBytes = 0;
    try {
      content = await readFile('logs/error.log', 'utf8');
      const stats = await stat('logs/error.log');
      fileSizeBytes = stats.size;
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const lines = content.split(/\r?\n/).filter(Boolean);
    const data = lines.slice(-500).reverse().map((line, index) => {
      try { const record = JSON.parse(line); return { id: `${record.timestamp || 'log'}-${index}`, timestamp: record.timestamp, level: record.level, message: record.message, requestId: record.requestId, method: record.method, path: record.path, stack: record.error?.stack || record.stack || null }; }
      catch { return { id: `line-${index}`, message: line }; }
    });
    res.json({ data, meta: { totalLines: lines.length, fileSizeBytes } });
  },

  clearErrors: async (req, res) => {
    let lineCount = 0;
    try {
      const content = await readFile('logs/error.log', 'utf8').catch((err) => { if (err.code === 'ENOENT') return ''; throw err; });
      lineCount = content.split(/\r?\n/).filter(Boolean).length;
      await writeFile('logs/error.log', '', 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    // Record the clearing action in the audit log for accountability
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'ERROR_LOG_CLEARED',
        entityType: 'ErrorLog',
        success: true,
        method: req.method,
        path: req.path,
        ipAddress: req.ip || null,
        details: { linesDeleted: lineCount },
      },
    });
    res.json({ data: { linesDeleted: lineCount }, message: `Error log cleared. ${lineCount} line(s) removed.` });
  },
};
