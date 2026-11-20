// Receives the web requests for staff accounts, calls the matching service, writes the audit log
// entry and sends the reply.
// The real rules are in services/user.service.js. To trace a button: route -> this controller ->
// service.

import { userService } from '../services/user.service.js';
import { recordAudit } from '../services/audit.service.js';
import { AppError } from '../utils/AppError.js';

export const userController = {
  list: async (req, res) => res.json({ data: await userService.list(req.query.search || '') }),
  create: async (req, res) => {
    const user = await userService.createStaff(req.body);
    await recordAudit({ userId: req.user.id, action: 'USER_CREATED', entityType: 'USER', entityId: user.id, details: { role: user.role, pharmacyReconciliationAccess: user.pharmacyReconciliationAccess }, ipAddress: req.ip });
    res.status(201).json({ data: user });
  },
  update: async (req, res) => {
    if (Number(req.params.id) === req.user.id && req.body.role !== 'ADMIN') {
      throw new AppError(409, 'You cannot remove your own administrator role while signed in.');
    }
    const user = await userService.update(Number(req.params.id), req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'USER_UPDATED', entityType: 'USER', entityId: user.id, details: { email: user.email, role: user.role, pharmacyReconciliationAccess: user.pharmacyReconciliationAccess }, ipAddress: req.ip });
    res.json({ data: user });
  },
  resetPassword: async (req, res) => {
    const user = await userService.resetPassword(Number(req.params.id), req.body.password);
    await recordAudit({ userId: req.user.id, action: 'PASSWORD_RESET', entityType: 'USER', entityId: user.id, ipAddress: req.ip });
    res.json({ data: user, message: 'Password reset successfully.' });
  },
  remove: async (req, res) => {
    if (Number(req.params.id) === req.user.id) throw new AppError(409, 'You cannot delete your own signed-in account.');
    const user = await userService.remove(Number(req.params.id));
    await recordAudit({ userId: req.user.id, action: 'USER_DELETED', entityType: 'USER', entityId: user.id, details: { softDelete: true }, ipAddress: req.ip });
    res.json({ data: user, message: 'User deactivated and removed from active access.' });
  },
  setActive: async (req, res) => {
    if (Number(req.params.id) === req.user.id && !req.body.active) {
      throw new AppError(409, 'You cannot deactivate your own signed-in account.');
    }
    const user = await userService.setActive(Number(req.params.id), req.body.active);
    await recordAudit({ userId: req.user.id, action: 'USER_STATUS_CHANGED', entityType: 'USER', entityId: user.id, details: { active: user.active }, ipAddress: req.ip });
    res.json({ data: user });
  },
  revokeSessions: async (req, res) => {
    if (Number(req.params.id) === req.user.id) {
      throw new AppError(409, 'Use sign out or change your password to end your own session.');
    }
    const user = await userService.revokeSessions(Number(req.params.id));
    await recordAudit({
      userId: req.user.id,
      action: 'USER_SESSIONS_REVOKED',
      entityType: 'USER',
      entityId: user.id,
      details: { email: user.email },
      ipAddress: req.ip,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
    });
    res.json({ data: user, message: 'All existing sessions for this staff member have been revoked.' });
  },
};
