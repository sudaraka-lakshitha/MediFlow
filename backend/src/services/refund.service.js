import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
import { stockQuantity } from '../utils/stockQuantity.js';
import { patientRefund } from '../utils/patientRefund.js';
import { historySearch } from '../utils/historySearch.js';
import { invoiceItemTotal } from '../utils/reportFinancials.js';

const money = (value) => new Prisma.Decimal(value || 0);
const include = { lines: true, sale: { select: { invoiceNumber: true, patientId: true } }, paymentRequest: { select: { requestNumber: true, patientId: true } } };
const cashier = (user) => {
  if (!(user.role === 'ADMIN' || user.role === 'CASHIER' || (user.role === 'PHARMACIST' && user.cashierAccess))) throw new AppError(403, 'Refund authorization and payout require cashier access.');
};

export const queueRefund = async (tx, { paymentRequestId, saleId, amount, reason, userId, lines = [] }) => {
  if (!money(amount).greaterThan(0)) return null;
  return tx.refund.create({ data: { paymentRequestId, saleId, amount, reason, createdById: userId, lines: { create: lines } }, include: { lines: true } });
};

export const refundService = {
  async list(user, { page = 1, pageSize = 50, search, status } = {}) {
    const records = await prisma.refund.findMany({ where: { ...(status ? { status } : {}), AND: [user.role === 'PATIENT' ? { OR: [{ sale: { patientId: user.id } }, { paymentRequest: { patientId: user.id } }] } : {}, historySearch(search, ['sale.invoiceNumber', 'paymentRequest.requestNumber', 'reason', 'reference'])] }, include, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * pageSize, take: pageSize });
    return user.role === 'PATIENT' ? records.map(patientRefund) : records;
  },
  async context(saleId, user) {
    cashier(user);
    const sale = await prisma.sale.findUnique({ where: { id: saleId }, select: { id: true, status: true, refunds: { select: { lines: { select: { saleItemId: true, quantity: true } } } } } });
    if (!sale || sale.status !== 'PAID') throw new AppError(409, 'Choose a completed paid invoice.');
    const quantities = {};
    for (const line of sale.refunds.flatMap(refund => refund.lines)) quantities[line.saleItemId] = Number(money(quantities[line.saleItemId]).add(line.quantity));
    return { expectedRefundCount: sale.refunds.length, quantities };
  },
  async saleQuote(tx, saleId, input) {
    const sale = await tx.sale.findUnique({ where: { id: saleId }, include: { items: { include: { product: true } }, refunds: { include: { lines: true } }, paymentRequest: { select: { delivery: { select: { status: true } } } } } });
    if (!sale || sale.status !== 'PAID') throw new AppError(409, 'Only a paid, completed sale can be refunded here.');
    const delivery = sale.paymentRequest?.delivery;
    if (delivery && !['RETURNED', 'DELIVERED', 'CANCELLED'].includes(delivery.status)) throw new AppError(409, 'Resolve the active shipment or reshipment first. Product refunds are available after confirmed return or delivery.');
    if (input.expectedRefundCount !== sale.refunds.length) throw new AppError(409, 'Refund history changed. Refresh the preview before continuing.');
    const requested = new Map(input.items.map((item) => [item.saleItemId, money(item.quantity)]));
    if (!requested.size || requested.size !== input.items.length) throw new AppError(400, 'Choose each sale line once.');
    const priorLines = sale.refunds.flatMap((refund) => refund.lines);
    const lines = [];
    for (const [itemId, quantity] of requested) {
      const item = sale.items.find((line) => line.id === itemId);
      if (!item) throw new AppError(409, 'The selected sale line was not found.');
      const already = priorLines.filter((line) => line.saleItemId === itemId).reduce((sum, line) => sum.add(line.quantity), money(0));
      if (!quantity.greaterThan(0) || quantity.decimalPlaces() > 3 || quantity.greaterThan(money(item.quantity).sub(already))) throw new AppError(409, 'Refund quantity exceeds the remaining sold quantity.');
      stockQuantity(quantity, item.product.unit);
      const alreadyCredited = priorLines.filter(line => line.saleItemId === itemId).reduce((sum, line) => sum.add(line.amount), money(0));
      const cumulative = invoiceItemTotal(item, sale).mul(already.add(quantity)).div(item.quantity).toDecimalPlaces(2);
      // Prior receipts are authoritative, including credits issued before this
      // allocation rule. Never create a negative refund to rewrite their cents.
      const lineAmount = Prisma.Decimal.max(0, cumulative.sub(alreadyCredited));
      lines.push({ saleItemId: item.id, productId: item.productId, batchId: item.batchId, name: item.product.genericName, quantity, amount: lineAmount });
    }
    const priorAmount = sale.refunds.reduce((sum, refund) => sum.add(refund.amount), money(0));
    const remaining = Prisma.Decimal.min(money(sale.total), money(sale.amountPaid)).sub(priorAmount);
    let amount = lines.reduce((sum, line) => sum.add(line.amount), money(0));
    const allReturned = sale.items.every((item) => priorLines.filter((line) => line.saleItemId === item.id).reduce((sum, line) => sum.add(line.quantity), money(0)).add(requested.get(item.id) || 0).equals(item.quantity));
    // Allocate the last rounding cent only once, on the final return.
    if (allReturned || amount.greaterThan(remaining)) { lines[lines.length - 1].amount = lines[lines.length - 1].amount.add(remaining.sub(amount)); amount = remaining; }
    if (amount.lessThan(0) || amount.greaterThan(remaining) || lines.some((line) => line.amount.lessThan(0))) throw new AppError(409, 'This refund exceeds the remaining payment.');
    return { sale, lines, amount };
  },
  async preview(saleId, input, user) {
    cashier(user);
    return serializable(async (tx) => { const { lines, amount } = await this.saleQuote(tx, saleId, input); return { lines, amount, expectedRefundCount: input.expectedRefundCount }; });
  },
  async create(saleId, input, user) {
    cashier(user);
    return serializable(async (tx) => {
      const { sale, lines, amount } = await this.saleQuote(tx, saleId, input);
      const refund = await tx.refund.create({ data: { saleId, paymentRequestId: sale.paymentRequestId, amount, reason: input.reason, createdById: user.id, lines: { create: lines } }, include: { lines: true } });
      if (sale.paymentRequestId) {
        const bill = await tx.paymentRequest.findUnique({ where: { id: sale.paymentRequestId }, select: { revision: true } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: sale.paymentRequestId, kind: 'REFUND_REQUESTED', actorId: user.id, revision: bill.revision, details: { reason: input.reason, refundId: refund.id, refundAmount: String(amount), settlement: 'PENDING' } } });
      }
      await tx.auditLog.create({ data: { userId: user.id, action: 'SALE_REFUND_AUTHORIZED', entityType: 'REFUND', entityId: refund.id, details: { saleId, amount: String(amount), reason: input.reason } } });
      return refund;
    });
  },
  async settle(id, input, user) {
    cashier(user);
    if (!input.payoutConfirmed || !input.reference?.trim()) throw new AppError(400, 'Confirm the payout and record its transaction reference or cash receipt reference.');
    return serializable(async (tx) => {
      const refund = await tx.refund.findUnique({ where: { id } });
      if (!refund || refund.status !== 'PENDING') throw new AppError(409, 'This refund is no longer awaiting payout.');
      if (refund.category === 'DELIVERY_FEE' && (!refund.approvedById || refund.approvedById === refund.createdById)) throw new AppError(409, 'A different authorized staff member must approve this delivery-fee refund before payout.');
      const claim = await tx.refund.updateMany({ where: { id, status: 'PENDING' }, data: { status: 'SETTLED', method: input.method, reference: input.reference.trim(), settledById: user.id, settledAt: new Date() } });
      if (claim.count !== 1) throw new AppError(409, 'This refund has already been settled.');
      if (refund.paymentRequestId) {
        const bill = await tx.paymentRequest.findUnique({ where: { id: refund.paymentRequestId }, select: { revision: true } });
        await tx.paymentRequestEvent.create({ data: { paymentRequestId: refund.paymentRequestId, kind: 'REFUND', amount: refund.amount.negated(), revision: bill.revision, actorId: user.id, details: { refundId: id, reason: refund.reason, method: input.method, reference: input.reference.trim(), settlement: 'SETTLED' } } });
      }
      await tx.auditLog.create({ data: { userId: user.id, action: 'REFUND_PAYOUT_CONFIRMED', entityType: 'REFUND', entityId: id, details: { amount: String(refund.amount), method: input.method, reference: input.reference.trim() } } });
      return tx.refund.findUnique({ where: { id }, include });
    });
  },
  async reviewStock(lineId, input, user) {
    if (!['ADMIN', 'PHARMACIST'].includes(user.role)) throw new AppError(403, 'Returned stock must be reviewed by a pharmacist or administrator.');
    return serializable(async (tx) => {
      const line = await tx.refundLine.findUnique({ where: { id: lineId } });
      if (!line || line.stockStatus !== 'PENDING_REVIEW') throw new AppError(409, 'This returned-stock decision has already been recorded.');
      if (input.decision === 'RESTOCKED') {
        const batch = await tx.inventoryBatch.findUnique({ where: { id: line.batchId } });
        if (!batch || batch.restricted || batch.expiryDate <= new Date()) throw new AppError(409, 'Expired, restricted or missing batches cannot receive saleable returned stock.');
        await tx.inventoryBatch.update({ where: { id: batch.id }, data: { quantityAvailable: { increment: line.quantity } } });
        await tx.stockMovement.create({ data: { productId: line.productId, batchId: line.batchId, type: 'RETURN', quantityChange: line.quantity, quantityBefore: batch.quantityAvailable, quantityAfter: batch.quantityAvailable.add(line.quantity), referenceType: 'REFUND_LINE', referenceId: line.id, reason: input.reason, performedById: user.id } });
      }
      const updated = await tx.refundLine.update({ where: { id: lineId }, data: { stockStatus: input.decision, stockReason: input.reason, reviewedById: user.id, reviewedAt: new Date() } });
      await tx.auditLog.create({ data: { userId: user.id, action: 'RETURNED_STOCK_REVIEWED', entityType: 'REFUND_LINE', entityId: lineId, details: { decision: input.decision, reason: input.reason, quantity: String(line.quantity) } } });
      return updated;
    });
  },
};
