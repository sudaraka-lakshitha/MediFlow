// Receives the web requests for discount rules and coupon codes, calls the matching service, writes
// the audit log entry and sends the reply.
// The real rules are in services/discount.service.js. To trace a button: route -> this controller
// -> service.

import { discountService } from '../services/discount.service.js';
import { recordAudit } from '../services/audit.service.js';

export const discountController = {
  list: async (_req, res) => res.json({ data: await discountService.list() }),
  create: async (req, res) => {
    const data = await discountService.create(req.body, req.user.id);
    await recordAudit({ userId: req.user.id, action: 'DISCOUNT_RULE_CREATED', entityType: 'DISCOUNT_RULE', entityId: data.id, details: { name: data.name }, ipAddress: req.ip });
    res.status(201).json({ data });
  },
  update: async (req, res) => {
    const data = await discountService.update(Number(req.params.id), req.body);
    await recordAudit({ userId: req.user.id, action: 'DISCOUNT_RULE_UPDATED', entityType: 'DISCOUNT_RULE', entityId: data.id, details: { name: data.name }, ipAddress: req.ip });
    res.json({ data });
  },
  remove: async (req, res) => {
    const id = Number(req.params.id); await discountService.remove(id);
    await recordAudit({ userId: req.user.id, action: 'DISCOUNT_RULE_DELETED', entityType: 'DISCOUNT_RULE', entityId: id, ipAddress: req.ip });
    res.json({ message: 'Discount rule deleted successfully.' });
  },
  toggleActive: async (req, res) => {
    const { prisma } = await import('../config/prisma.js');
    const id = Number(req.params.id);
    const { active } = req.body;
    const data = await prisma.discountRule.update({ where: { id }, data: { active } });
    await recordAudit({ userId: req.user.id, action: active ? 'DISCOUNT_RULE_RESUMED' : 'DISCOUNT_RULE_PAUSED', entityType: 'DISCOUNT_RULE', entityId: id, details: { name: data.name, active }, ipAddress: req.ip });
    res.json({ data, message: `Discount rule ${active ? 'resumed' : 'paused'}.` });
  },
};
