// Receives the web requests for the pharmacy's bank accounts that customers pay into, calls the
// matching service, writes the audit log entry and sends the reply.
// The real rules are in services/bankAccount.service.js. To trace a button: route -> this
// controller -> service.

import { z } from 'zod';
import { bankAccountService } from '../services/bankAccount.service.js';
import { recordAudit } from '../services/audit.service.js';

export const bankAccountSchema = z.object({
  bankName: z.string().trim().min(2).max(120),
  accountName: z.string().trim().min(2).max(150),
  accountNumber: z.string().trim().min(4).max(60),
  branch: z.string().trim().max(120).optional().nullable(),
  instructions: z.string().trim().max(500).optional().nullable(),
  active: z.boolean().default(true),
});
export const bankAccountActiveSchema = z.object({ active: z.boolean() });

export const bankAccountController = {
  list: async (req, res) => res.json({ data: await bankAccountService.list(req.user) }),
  create: async (req, res) => {
    const data = await bankAccountService.create(req.body, req.user.id);
    await recordAudit({
      userId: req.user.id, action: 'BANK_ACCOUNT_CREATED', entityType: 'BANK_ACCOUNT', entityId: data.id,
      details: { bankName: data.bankName, accountNumber: data.accountNumber }, ipAddress: req.ip,
    });
    res.status(201).json({ data });
  },
  update: async (req, res) => {
    const data = await bankAccountService.update(Number(req.params.id), req.body);
    await recordAudit({
      userId: req.user.id, action: 'BANK_ACCOUNT_UPDATED', entityType: 'BANK_ACCOUNT', entityId: data.id,
      details: { bankName: data.bankName, accountNumber: data.accountNumber }, ipAddress: req.ip,
    });
    res.json({ data });
  },
  setActive: async (req, res) => {
    const data = await bankAccountService.setActive(Number(req.params.id), req.body.active);
    await recordAudit({
      userId: req.user.id, action: data.active ? 'BANK_ACCOUNT_ACTIVATED' : 'BANK_ACCOUNT_DEACTIVATED',
      entityType: 'BANK_ACCOUNT', entityId: data.id, details: { bankName: data.bankName }, ipAddress: req.ip,
    });
    res.json({ data });
  },
};
