import { AsyncLocalStorage } from 'node:async_hooks';
import { createHash } from 'node:crypto';
import { AppError } from './AppError.js';

export const operationContext = new AsyncLocalStorage();
export const protectRetryController = handlers => Object.fromEntries(Object.entries(handlers).map(([name, handler]) => [name, async (req, res, next) => {
  const path = decodeURIComponent((req.originalUrl || '').split('?')[0]).replace(/\/+$/, '').toLowerCase();
  const protectedWrite = req.method === 'POST' && /^\/api\/(?:sales\/(?:retail|\d+\/pay)|inventory\/batches(?:\/\d+\/(?:adjust|dispose-expired))?|payment-requests\/retail)$/.test(path);
  if (!protectedWrite) return handler(req, res, next);
  const key = req.get('Idempotency-Key');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key || '')) throw new AppError(400, 'Refresh the application before submitting this operation (a retry key is required).');
  const hash = createHash('sha256').update(JSON.stringify({ path, body: req.body })).digest('hex');
  return operationContext.run({ actorId: req.user.id, key, hash }, () => handler(req, res, next));
}]));

export async function recordOperation(tx, context, operation) {
  const where = { actorId_key: { actorId: context.actorId, key: context.key } };
  const existing = await tx.operationReceipt.findUnique({ where });
  if (existing) {
    if (existing.payloadHash !== context.hash) throw new AppError(409, 'This retry key belongs to a different operation. Refresh and review the form.');
    context.replayed = true;
    return existing.result;
  }
  // The unique insert and business effects commit together. A competing request
  // cannot apply the same operation before this receipt exists.
  await tx.operationReceipt.create({ data: { actorId: context.actorId, key: context.key, payloadHash: context.hash, result: {} } });
  const result = await operation(tx);
  await tx.operationReceipt.update({ where, data: { result: JSON.parse(JSON.stringify(result ?? null)) } });
  return result;
}
