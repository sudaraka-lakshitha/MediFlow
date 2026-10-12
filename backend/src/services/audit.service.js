import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { operationSettingsService } from './operationSettings.service.js';
import { exportPages } from '../utils/exportPages.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;
const roleCache = new Map();
const localBoundary = (dateText, extraDays = 0) => {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + extraDays) - offsetMs);
};

const dateFilter = (from, to) => {
  if (!from && !to) return undefined;
  return {
    ...(from ? { gte: localBoundary(from) } : {}),
    ...(to ? { lt: localBoundary(to, 1) } : {}),
  };
};

const staffOrSystem = {
  OR: [
    { userId: null },
    { user: { is: { role: { not: 'PATIENT' } } } },
    { success: false },
  ],
};

export const buildAuditWhere = ({ userId, action, entityType, success, from, to, q, view = 'active' } = {}) => ({
  ...(userId ? { userId } : {}),
  ...(action ? { action } : {}),
  ...(entityType ? { entityType } : {}),
  ...(typeof success === 'boolean' ? { success } : {}),
  ...(dateFilter(from, to) ? { createdAt: dateFilter(from, to) } : {}),
  deletedAt: view === 'trash' ? { not: null } : null,
  AND: [
    staffOrSystem,
    ...(q ? [{
      OR: [
        { action: { contains: q } },
        { entityType: { contains: q } },
        { path: { contains: q } },
        { requestId: { contains: q } },
        { user: { is: { fullName: { contains: q } } } },
        { user: { is: { email: { contains: q } } } },
      ],
    }] : []),
  ],
});

const userRole = async (userId) => {
  if (!userId) return null;
  const cached = roleCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.role;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const role = user?.role || null;
  roleCache.set(userId, { role, expiresAt: Date.now() + 5 * 60 * 1000 });
  return role;
};

export const recordAudit = async ({
  userId, action, entityType, entityId, details, success = true, ipAddress, requestId, method, path,
}) => {
  try {
    // Successful patient self-service is intentionally excluded, while patient
    // failures remain available to administrators for system troubleshooting.
    if (success && userId && await userRole(userId) === 'PATIENT') return null;
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, details, success, ipAddress, requestId, method, path },
    });
  } catch (error) {
    logger.error('Audit log write failed', { error, action, userId });
  }
};

export const recordRequestAudit = (req, payload) => recordAudit({
  ...payload,
  userId: payload.userId ?? req.user?.id,
  ipAddress: payload.ipAddress ?? req.ip,
  requestId: req.requestId,
  method: req.method,
  path: req.originalUrl,
});

const auditInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      active: true,
    },
  },
};

export const auditService = {
  async myActivity(userId, { from, to }) {
    await this.purgeExpiredTrash();
    const where = {
      userId,
      deletedAt: null,
      createdAt: dateFilter(from, to),
    };
    const [data, total, successful, failed] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          details: true,
          success: true,
          method: true,
          path: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 1000,
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.count({ where: { ...where, success: true } }),
      prisma.auditLog.count({ where: { ...where, success: false } }),
    ]);
    return {
      data,
      meta: {
        from,
        to,
        total,
        successful,
        failed,
        returned: data.length,
        truncated: total > data.length,
        maximumRangeDays: 31,
      },
    };
  },

  async list(query) {
    await this.purgeExpiredTrash();
    const operationSettings = await operationSettingsService.get();
    const where = buildAuditWhere(query);
    const skip = (query.page - 1) * query.pageSize;
    const activeScope = buildAuditWhere({ view: 'active' });
    const optionScope = buildAuditWhere({ view: query.view });
    const [data, total, successes, failures, patientFailures, unreadFailures, trashCount, actions, entityTypes] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: auditInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.pageSize,
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.count({ where: { ...where, success: true } }),
      prisma.auditLog.count({ where: { ...where, success: false } }),
      prisma.auditLog.count({ where: { ...where, success: false, user: { is: { role: 'PATIENT' } } } }),
      prisma.auditLog.count({ where: { ...activeScope, success: false, readAt: null } }),
      prisma.auditLog.count({ where: buildAuditWhere({ view: 'trash' }) }),
      prisma.auditLog.findMany({ where: optionScope, distinct: ['action'], select: { action: true }, orderBy: { action: 'asc' } }),
      prisma.auditLog.findMany({
        where: { ...optionScope, entityType: { not: null } },
        distinct: ['entityType'],
        select: { entityType: true },
        orderBy: { entityType: 'asc' },
      }),
    ]);
    return {
      data,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pages: Math.max(1, Math.ceil(total / query.pageSize)),
        successes,
        failures,
        patientFailures,
        unreadFailures,
        trashCount,
        trashEnabled: operationSettings.auditTrashEnabled,
        trashRetentionDays: operationSettings.auditTrashRetentionDays,
        actions: actions.map((entry) => entry.action),
        entityTypes: entityTypes.map((entry) => entry.entityType).filter(Boolean),
      },
    };
  },

  async staffSummary({ from, to }) {
    const staff = await prisma.user.findMany({
      where: { role: { not: 'PATIENT' } },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        cashierAccess: true,
        mustChangePassword: true,
        lastLoginAt: true,
        passwordChangedAt: true,
        createdAt: true,
      },
      orderBy: [{ active: 'desc' }, { fullName: 'asc' }],
    });
    const grouped = staff.length ? await prisma.auditLog.groupBy({
      by: ['userId', 'action', 'success'],
      where: {
        userId: { in: staff.map((user) => user.id) },
        deletedAt: null,
        ...(dateFilter(from, to) ? { createdAt: dateFilter(from, to) } : {}),
      },
      _count: { _all: true },
      _max: { createdAt: true },
    }) : [];
    const data = staff.map((user) => {
      const activity = grouped.filter((entry) => entry.userId === user.id);
      const latest = activity.reduce((current, entry) => (
        !current || (entry._max.createdAt && entry._max.createdAt > current._max.createdAt) ? entry : current
      ), null);
      const countBy = (predicate) => activity
        .filter((entry) => predicate(entry.action))
        .reduce((sum, entry) => sum + entry._count._all, 0);
      return {
        ...user,
        totalActions: activity.reduce((sum, entry) => sum + entry._count._all, 0),
        successfulActions: activity.filter((entry) => entry.success).reduce((sum, entry) => sum + entry._count._all, 0),
        failedActions: activity.filter((entry) => !entry.success).reduce((sum, entry) => sum + entry._count._all, 0),
        loginCount: countBy((action) => action === 'LOGIN'),
        clinicalActions: countBy((action) => /PRESCRIPTION|PATIENT|INTERACTION|DISPENS/.test(action)),
        inventoryActions: countBy((action) => /STOCK|INVENTORY|PRODUCT|BATCH|SUPPLIER|MANUFACTURER/.test(action)),
        billingActions: countBy((action) => /SALE|PAYMENT|INVOICE|RETAIL|DISCOUNT/.test(action)),
        lastAction: latest?.action || null,
        lastActionAt: latest?._max.createdAt || null,
      };
    });
    return {
      data,
      summary: {
        staff: data.length,
        activeStaff: data.filter((user) => user.active).length,
        totalActions: data.reduce((sum, user) => sum + user.totalActions, 0),
        failedActions: data.reduce((sum, user) => sum + user.failedActions, 0),
      },
    };
  },

  exportRows(query) {
    return exportPages(prisma.auditLog, {
      where: buildAuditWhere(query),
      include: auditInclude,
    });
  },

  async markWarningsRead(query = {}) {
    const result = await prisma.auditLog.updateMany({
      where: { ...buildAuditWhere({ ...query, view: 'active' }), success: false, readAt: null },
      data: { readAt: new Date() },
    });
    return { updated: result.count };
  },

  async moveToTrash(query) {
    const operationSettings = await operationSettingsService.get();
    if (!operationSettings.auditTrashEnabled) {
      throw new AppError(409, 'Audit trash is disabled in operation settings.');
    }
    const result = await prisma.auditLog.updateMany({
      where: buildAuditWhere({ ...query, view: 'active' }),
      data: { deletedAt: new Date(), readAt: new Date() },
    });
    return { moved: result.count, retentionDays: operationSettings.auditTrashRetentionDays };
  },

  async moveSelectedToTrash(ids) {
    const operationSettings = await operationSettingsService.get();
    if (!operationSettings.auditTrashEnabled) {
      throw new AppError(409, 'Audit trash is disabled in operation settings.');
    }
    const result = await prisma.auditLog.updateMany({
      where: {
        ...buildAuditWhere({ view: 'active' }),
        id: { in: ids },
      },
      data: { deletedAt: new Date(), readAt: new Date() },
    });
    return { moved: result.count, retentionDays: operationSettings.auditTrashRetentionDays };
  },

  async restore(id) {
    const result = await prisma.auditLog.updateMany({
      where: { id, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
    return { restored: result.count };
  },

  async restoreAll() {
    await this.purgeExpiredTrash();
    const result = await prisma.auditLog.updateMany({
      where: buildAuditWhere({ view: 'trash' }),
      data: { deletedAt: null },
    });
    return { restored: result.count };
  },

  async purgeExpiredTrash() {
    const operationSettings = await operationSettingsService.get();
    const cutoff = new Date(
      Date.now() - operationSettings.auditTrashRetentionDays * 24 * 60 * 60 * 1000,
    );
    const result = await prisma.auditLog.deleteMany({
      where: { deletedAt: { lt: cutoff } },
    });
    return result.count;
  },
};
