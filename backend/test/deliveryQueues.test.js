// "Needs pharmacy action" must not fill up with orders that are only waiting
// for the customer to pay; those have their own queue.
import { expect, it, vi } from 'vitest';
import { deliveryQueuePage } from '../src/utils/deliveryQueue.js';

const sqlFor = async (queue) => {
  const db = { $queryRaw: vi.fn().mockResolvedValue([]) };
  await deliveryQueuePage(db, { role: 'PHARMACIST' }, { page: 1, pageSize: 20, queue });
  return db.$queryRaw.mock.calls[0][0].sql.replace(/\s+/g, ' ');
};
it('limits pharmacy action to missing or cancelled fees, cancellation requests and courier problems', async () => {
  const sql = await sqlFor('ATTENTION');
  expect(sql).toContain("d.status IN ('DELIVERY_FAILED','RETURNING','RETURNED','RESHIP_REQUESTED')");
  expect(sql).toContain('fee.id IS NULL');
  expect(sql).not.toMatch(/NOT COALESCE\(\(d.status IN \('DELIVERY_FAILED'/);
});
it('puts orders waiting for the customer in their own queue', async () => {
  const sql = await sqlFor('AWAITING_PAYMENT');
  expect(sql).toContain("d.status IN ('REQUESTED','AWAITING_FEE') AND NOT COALESCE(");
});
