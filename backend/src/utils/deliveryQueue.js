// DELIVERY QUEUES
// Groups deliveries into the tabs staff see (to confirm, waiting for fee, ready to dispatch, on the
// way...),
// with search, courier and date filters, page by page.

import { Prisma } from '@prisma/client';

// Compare DECIMAL balances in MySQL, before pagination. A paid status alone
// does not mean a parcel is dispatchable after cancellation/refund requests.
export function deliveryQueuePage(db, user, { page, pageSize, queue, search, courier, dateField = 'createdAt', from, to }) {
  const ready = Prisma.sql`(d.status = 'AWAITING_FEE'
    AND medicine.status = 'PAID' AND fee.status = 'PAID'
    AND medicine.customer_cancellation_reason IS NULL AND fee.customer_cancellation_reason IS NULL
    AND medicine.amount_paid - medicine.refunded_amount >= medicine.total
    AND fee.amount_paid - fee.refunded_amount >= fee.total
    AND NOT EXISTS (SELECT 1 FROM refunds r WHERE r.payment_request_id IN (medicine.id, fee.id) AND r.status IN ('PENDING', 'AWAITING_APPROVAL')))`;
  // ATTENTION: the pharmacy must act (issue or reissue the fee, resolve a
  // cancellation request, or handle a courier problem or return).
  // AWAITING_PAYMENT: both bills exist and the customer still has to pay or the
  // cashier still has to verify a slip; nothing for the pharmacy to do yet.
  const staffAction = Prisma.sql`(d.status IN ('DELIVERY_FAILED','RETURNING','RETURNED','RESHIP_REQUESTED')
    OR (d.status IN ('REQUESTED','AWAITING_FEE') AND (fee.id IS NULL OR fee.status = 'CANCELLED'
      OR medicine.customer_cancellation_reason IS NOT NULL OR fee.customer_cancellation_reason IS NOT NULL)))`;
  const conditions = [queue === 'READY'
    ? Prisma.sql`(COALESCE(${ready}, FALSE) OR d.status = 'RESHIP_READY')`
    : queue === 'AWAITING_PAYMENT'
      ? Prisma.sql`(d.status IN ('REQUESTED','AWAITING_FEE') AND NOT COALESCE(${staffAction}, FALSE) AND NOT COALESCE(${ready}, FALSE))`
      : Prisma.sql`(COALESCE(${staffAction}, FALSE) AND NOT COALESCE(${ready}, FALSE))`];
  if (user.role === 'PATIENT') conditions.push(Prisma.sql`medicine.patient_id = ${user.id}`);
  if (courier) conditions.push(Prisma.sql`d.courier_service = ${courier}`);
  const column = { createdAt: Prisma.sql`d.created_at`, dispatchedAt: Prisma.sql`d.dispatched_at`, deliveredAt: Prisma.sql`d.delivered_at` }[dateField];
  if (from) conditions.push(Prisma.sql`${column} >= ${new Date(from)}`);
  if (to) conditions.push(Prisma.sql`${column} < ${new Date(to)}`);
  if (search) conditions.push(Prisma.sql`(LOCATE(${search}, COALESCE(d.recipient_name,'')) > 0 OR LOCATE(${search}, COALESCE(d.courier_service,'')) > 0 OR LOCATE(${search}, COALESCE(d.tracking_reference,'')) > 0 OR LOCATE(${search}, medicine.request_number) > 0 OR LOCATE(${search}, COALESCE(customer.full_name,'')) > 0)`);
  return db.$queryRaw(Prisma.sql`SELECT d.id FROM delivery_requests d
    JOIN payment_requests medicine ON medicine.id = d.payment_request_id
    LEFT JOIN payment_requests fee ON fee.id = d.fee_payment_request_id
    LEFT JOIN users customer ON customer.id = medicine.patient_id
    WHERE ${Prisma.join(conditions, ' AND ')} ORDER BY d.created_at DESC, d.id DESC
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`);
}
