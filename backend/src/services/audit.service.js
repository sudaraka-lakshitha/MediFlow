// AUDIT LOG (activity history)
// Every important action (sign-in, creating a bill, taking payment, changing stock...) is written
// here
// with who did it, what they did, when, and from which address.
// This is how we can later prove who did what. Failed actions are saved too, as warnings.
// Admins can move old entries to a "trash" area; entries there are deleted for good after the
// number
// of days set in the operation settings.

import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { operationSettingsService } from './operationSettings.service.js';
import { exportPages } from '../utils/exportPages.js';
import { operationContext } from '../utils/operationContext.js';

const offsetMs = env.REPORT_TIMEZONE_OFFSET_MINUTES * 60_000;
const roleCache = new Map();
// Turns a date such as 2026-11-20 into the moment that day starts in Sri Lanka (stored times are in
// UTC).
const localBoundary = (dateText, extraDays = 0) => {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + extraDays) - offsetMs);
};

// The "from" and "to" date range filter, using Sri Lanka days.
const dateFilter = (from, to) => {
  if (!from && !to) return undefined;
  return {
    ...(from ? { gte: localBoundary(from) } : {}),
    ...(to ? { lt: localBoundary(to, 1) } : {}),
  };
};

// The audit page shows staff and system actions, and any failed action (including patients' failed
// sign-ins).
const staffOrSystem = {
  OR: [
    { userId: null },
    { user: { is: { role: { not: 'PATIENT' } } } },
    { success: false },
  ],
};

// Builds the search filter for the audit page from the options the admin picked.
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

// Looks up a user's role, remembering it for a short time so we do not ask the database on every
// action.
const userRole = async (userId) => {
  if (!userId) return null;
  const cached = roleCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.role;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const role = user?.role || null;
  roleCache.set(userId, { role, expiresAt: Date.now() + 5 * 60 * 1000 });
  return role;
};

// Save one audit entry. If saving fails, the error is logged but the user's action still succeeds:
// we never want a logging problem to block real work.
// A repeated request (same button pressed twice) is not logged twice.
export const recordAudit = async ({
  userId, action, entityType, entityId, details, success = true, ipAddress, requestId, method, path,
}) => {
  if (operationContext.getStore()?.replayed) return;
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

// Same as recordAudit, but fills in the user, address and request details from the web request.
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

// Audit actions used by the audit page and the "My activity" window.
export const auditService = {
  // A staff member's own recent actions, for the "My activity" window.
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

  // The audit page list, page by page, with filters.
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

  // How many actions each staff member did in a date range, for the staff activity report.
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

  // The rows used when the audit log is downloaded as a file.
  exportRows(query) {
    return exportPages(prisma.auditLog, {
      where: buildAuditWhere(query),
      include: auditInclude,
    });
  },

  // Mark failed-action warnings as seen.
  async markWarningsRead(query = {}) {
    const result = await prisma.auditLog.updateMany({
      where: { ...buildAuditWhere({ ...query, view: 'active' }), success: false, readAt: null },
      data: { readAt: new Date() },
    });
    return { updated: result.count };
  },

  // Move the filtered entries to the trash area (only if trash is switched on in settings).
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

  // Move the ticked entries to the trash area.
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

  // Bring one entry back from the trash.
  async restore(id) {
    const result = await prisma.auditLog.updateMany({
      where: { id, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
    return { restored: result.count };
  },

  // Bring every entry back from the trash.
  async restoreAll() {
    await this.purgeExpiredTrash();
    const result = await prisma.auditLog.updateMany({
      where: buildAuditWhere({ view: 'trash' }),
      data: { deletedAt: null },
    });
    return { restored: result.count };
  },

  // Permanently delete trash entries older than the keeping period.
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
