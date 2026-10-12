import crypto from 'node:crypto';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
import { localDateKey } from '../utils/localDate.js';
import { canReconcilePharmacy } from '../utils/reconciliationAccess.js';
const cents = (value) => Math.round(Number(value || 0) * 100);
const roles = (user) => { if (!(user.role === 'ADMIN' || user.role === 'CASHIER' || (user.role === 'PHARMACIST' && user.cashierAccess))) throw new AppError(403, 'Daily balancing requires cashier access.'); };
const sameCount = (before, input) => before && cents(before.openingCash) === cents(input.openingCash)
  && cents(before.countedCash) === cents(input.countedCash)
  && ['BANK_TRANSFER','CARD'].every(method => ['received','refunded'].every(direction =>
    before.verified?.[method]?.[direction] != null && cents(before.verified[method][direction]) === cents(input.verified[method][direction])))
  && (before.notes || '') === (input.notes || '');
const sameReview = (before, review) => !before && !review || Boolean(before && review
  && before.reviewerId === review.reviewerId && before.cashierId === review.cashierId
  && before.reason === review.reason && before.evidenceReference === review.evidenceReference);

const saveConfirmation = async (tx, summary, input, actor, review = null) => {
  if (summary.fingerprint !== input.fingerprint) throw new AppError(409, 'Transactions changed. Refresh and balance the latest figures.');
  if (summary.warnings.length) throw new AppError(409, 'Unclassified or legacy transactions need reconciliation before this day can be confirmed.');
  const expectedCash = cents(input.openingCash) + cents(summary.totals.CASH.net);
  if (cents(input.countedCash) !== expectedCash) throw new AppError(409, 'The counted cash does not match opening cash plus receipts minus cash refunds.');
  for (const method of ['BANK_TRANSFER','CARD']) for (const direction of ['received','refunded']) if (cents(input.verified[method][direction]) !== cents(summary.totals[method][direction])) throw new AppError(409, 'Statement/terminal amounts do not match the recorded receipts and refunds.');
  if (!input.referencesChecked) throw new AppError(400, 'Confirm that bank references and payout evidence have been checked.');
  const latest = summary.confirmations[0];
  if (summary.confirmed && sameCount(latest.snapshot, input) && sameReview(latest.snapshot.review, review)) return latest;
  const snapshot = { openingCash: input.openingCash, countedCash: input.countedCash, verified: input.verified,
    pendingRefunds: summary.pendingRefunds, totals: summary.totals, entries: summary.entries, notes: input.notes || '', referencesChecked: true,
    ...(review ? { review } : {}) };
  const data = await tx.dailyBalanceConfirmation.create({ data: { cashierId: summary.cashierId, day: input.day, fingerprint: summary.fingerprint, snapshot } });
  await tx.auditLog.create({ data: { userId: actor.id, action: review ? 'DAILY_BALANCE_RECONCILED_ON_BEHALF' : 'DAILY_BALANCE_CONFIRMED', entityType: 'DAILY_BALANCE', entityId: data.id,
    details: { day: input.day, cashierId: summary.cashierId, fingerprint: summary.fingerprint, pendingRefunds: summary.pendingRefunds,
      ...(review ? { review, previousConfirmationId: latest?.id || null } : {}) } } });
  return data;
};
export const reconciliationService = {
  async summary(day, user, tx = prisma, allCashiers = false) {
    if (allCashiers) { if (!['ADMIN', 'PHARMACIST'].includes(user.role) && !canReconcilePharmacy(user)) throw new AppError(403, 'Staff dashboard access required.'); } else roles(user);
    const actor = allCashiers ? undefined : user.id;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day)) || new Date(`${day}T00:00:00Z`).toISOString().slice(0,10) !== day || day > localDateKey(new Date())) throw new AppError(400, 'Choose a valid date that is not in the future.');
    const start = new Date(Date.parse(`${day}T00:00:00Z`) - env.REPORT_TIMEZONE_OFFSET_MINUTES * 60000);
    const end = new Date(start.getTime() + 86400000);
    const time = { gte: start, lt: end };
    const events = await tx.paymentRequestEvent.findMany({ where: { actorId: actor, createdAt: time, kind: { in: ['PAYMENT_RECEIVED','REFUND'] } }, include: { paymentRequest: { select: { requestNumber: true, paymentMethod: true, paymentReference: true } } }, orderBy: { id: 'asc' } });
    const direct = await tx.salePayment.findMany({ where: { cashierId: actor, createdAt: time }, include: { sale: { select: { invoiceNumber: true } } }, orderBy: { id: 'asc' } });
    const refunds = await tx.refund.findMany({ where: { status: 'SETTLED', settledById: actor, settledAt: time }, include: { sale: { select: { invoiceNumber: true, paymentMethod: true, payments: { select: { method: true } } } }, paymentRequest: { select: { requestNumber: true, paymentMethod: true, paymentReference: true, events: { where: { kind: 'PAYMENT_RECEIVED' }, select: { details: true } } } } }, orderBy: { id: 'asc' } });
    const legacy = await tx.sale.findMany({ where: { cashierId: actor, paymentRequestId: null, createdAt: time, amountPaid: { gt: 0 } }, select: { id: true, cashierId: true, invoiceNumber: true, paymentMethod: true, amountPaid: true, createdAt: true, payments: { select: { amount: true } } } });
    const pendingRefunds = allCashiers ? 0 : await tx.refund.count({ where: { status: 'PENDING', createdById: user.id } });
    const entries = [];
    const add = (id, date, document, method, direction, amount, reference, originalMethod = null, warning = null) => entries.push({ id, date: new Date(date).toISOString(), document, method: method || 'OTHER', direction, amount: cents(amount) / 100, reference: reference || '', originalMethod, warning });
    for (const event of events) {
      if (event.kind === 'REFUND' && event.details?.refundId) continue; // Refund table is authoritative for new payouts.
      const split = event.details?.splitDetails;
      if (event.kind === 'PAYMENT_RECEIVED' && split?.isSplit) {
        add(`event-${event.id}-cash`,event.createdAt,event.paymentRequest.requestNumber,'CASH','IN',split.cashAmount,'');
        add(`event-${event.id}-other`,event.createdAt,event.paymentRequest.requestNumber,split.nonCashMethod,'IN',split.nonCashAmount,split.nonCashReference);
      } else add(`event-${event.id}`,event.createdAt,event.paymentRequest.requestNumber,event.kind === 'REFUND' ? (event.details?.method || 'OTHER') : (event.details?.paymentMethod || event.paymentRequest.paymentMethod),event.kind === 'REFUND' ? 'OUT' : 'IN',Math.abs(Number(event.amount)),event.details?.reference || event.details?.paymentReference || event.paymentRequest.paymentReference,event.kind === 'REFUND' ? event.paymentRequest.paymentMethod : null,event.kind === 'REFUND' && !event.details?.method ? 'Legacy refund has no confirmed payout method.' : null);
    }
    for (const payment of direct) add(`sale-payment-${payment.id}`,payment.createdAt,payment.sale.invoiceNumber,payment.method,'IN',payment.amount,payment.reference);
    for (const refund of refunds) {
      const methods = [...(refund.sale?.payments || []).map(payment=>payment.method), ...(refund.paymentRequest?.events || []).flatMap(event=>event.details?.splitDetails?.isSplit ? ['CASH',event.details.splitDetails.nonCashMethod] : [event.details?.paymentMethod])].filter(Boolean);
      const originalMethod = [...new Set(methods)].join(' + ') || refund.paymentRequest?.paymentMethod || refund.sale?.paymentMethod;
      add(`refund-${refund.id}`,refund.settledAt,refund.sale?.invoiceNumber || refund.paymentRequest?.requestNumber,refund.method,'OUT',refund.amount,refund.reference,originalMethod);
    }
    for (const sale of legacy) {
      const untracked = cents(sale.amountPaid) - sale.payments.reduce((sum,payment)=>sum+cents(payment.amount),0);
      if (untracked > 0) add(`legacy-sale-${sale.id}`,sale.createdAt,sale.invoiceNumber,sale.paymentMethod,'IN',untracked/100,'',null,'Legacy sale: individual payment dates were not recorded. Review before using this historical balance.');
    }
    entries.sort((a,b) => a.id.localeCompare(b.id));
    if (allCashiers) {
      const owners = new Map([
        ...events.flatMap(event => [`event-${event.id}`, `event-${event.id}-cash`, `event-${event.id}-other`].map(key => [key, event.actorId])),
        ...direct.map(payment => [`sale-payment-${payment.id}`, payment.cashierId]),
        ...refunds.map(refund => [`refund-${refund.id}`, refund.settledById]),
        ...legacy.map(sale => [`legacy-sale-${sale.id}`, sale.cashierId]),
      ]);
      for (const entry of entries) entry.cashierId = owners.get(entry.id) ?? null;
    }
    const totals = Object.fromEntries(['CASH','BANK_TRANSFER','CARD','OTHER'].map((method) => { const matching = entries.filter((entry) => entry.method === method); const received = matching.filter((entry) => entry.direction === 'IN').reduce((sum,entry) => sum+cents(entry.amount),0); const refunded = matching.filter((entry) => entry.direction === 'OUT').reduce((sum,entry) => sum+cents(entry.amount),0); return [method,{ received: received/100, refunded: refunded/100, net: (received-refunded)/100 }]; }));
    const balanceState = { day, cashierId: user.id, entries };
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify(balanceState)).digest('hex');
    const confirmations = allCashiers ? [] : await tx.dailyBalanceConfirmation.findMany({ where: { cashierId: user.id, day }, orderBy: { id: 'desc' }, take: 10 });
    const latest = confirmations[0];
    // Preserve existing confirmations if their day's ledger is unchanged. The
    // old hash also included the all-time pending queue, which is not a payout.
    const legacyFingerprint = Number.isInteger(latest?.snapshot?.pendingRefunds)
      ? crypto.createHash('sha256').update(JSON.stringify({ ...balanceState, pendingRefunds: latest.snapshot.pendingRefunds })).digest('hex') : null;
    const confirmed = Boolean(latest && (latest.fingerprint === fingerprint || latest.fingerprint === legacyFingerprint));
    return { day, cashierId: user.id, entries, totals, pendingRefunds, fingerprint, confirmations, confirmed, warnings: entries.filter((entry) => entry.warning || entry.method === 'OTHER' || (entry.method === 'BANK_TRANSFER' && !entry.reference)).map((entry) => `${entry.document}: ${entry.warning || 'Payment method or bank reference requires review.'}`) };
  },
  async classify(input, user) {
    roles(user);
    if (!['CASH', 'CARD', 'BANK_TRANSFER'].includes(input.method) || !input.reason?.trim() || !input.reference?.trim()) throw new AppError(400, 'Choose the verified method and record evidence/reference and a reason.');
    return serializable(async tx => {
      const summary = await this.summary(input.day, user, tx);
      if (summary.fingerprint !== input.fingerprint) throw new AppError(409, 'Transactions changed. Refresh before correcting the method.');
      const entry = summary.entries.find(entry => entry.id === input.entryId);
      if (!entry || !(entry.method === 'OTHER' || (entry.method === 'BANK_TRANSFER' && !entry.reference) || entry.warning?.startsWith('Legacy refund'))) throw new AppError(409, 'This entry is not awaiting classification.');
      const payment = /^sale-payment-(\d+)$/.exec(entry.id);
      const event = /^event-(\d+)(-other)?$/.exec(entry.id);
      const refund = /^refund-(\d+)$/.exec(entry.id);
      if (payment) {
        await tx.salePayment.update({ where: { id: Number(payment[1]) }, data: { method: input.method, reference: input.reference.trim() } });
      } else if (event) {
        const original = await tx.paymentRequestEvent.findUnique({ where: { id: Number(event[1]) } });
        const details = { ...(original.details || {}) };
        if (event[2]) {
          if (input.method === 'CASH') throw new AppError(400, 'A split payment non-cash portion must be classified as bank or card.');
          details.splitDetails = { ...details.splitDetails, nonCashMethod: input.method, nonCashReference: input.reference.trim() };
        } else if (original.kind === 'REFUND') { details.method = input.method; details.reference = input.reference.trim(); }
        else { details.paymentMethod = input.method; details.paymentReference = input.reference.trim(); }
        await tx.paymentRequestEvent.update({ where: { id: original.id }, data: { details } });
      } else if (refund) {
        await tx.refund.update({ where: { id: Number(refund[1]) }, data: { method: input.method, reference: input.reference.trim() } });
      } else throw new AppError(409, 'This legacy record requires a dated payment reconstruction; its date cannot be guessed.');
      await tx.auditLog.create({ data: { userId: user.id, action: 'PAYMENT_METHOD_RECONCILED', entityType: 'DAILY_BALANCE', details: { day: input.day, entryId: entry.id, before: entry, method: input.method, reference: input.reference.trim(), reason: input.reason.trim() } } });
      return { message: 'Payment classified. Recount and verify the updated balance.' };
    });
  },
  async confirm(input, user, tx = null) {
    roles(user);
    if (!tx) return serializable(db => this.confirm(input, user, db));
    return saveConfirmation(tx, await this.summary(input.day, user, tx), input, user);
  },
  async confirmOnBehalf(input, user, tx = null) {
    if (user.role !== 'ADMIN') throw new AppError(403, 'Only an administrator may reconcile on behalf of another cashier.');
    if (input.cashierId === user.id) throw new AppError(400, 'Use your personal balance to confirm your own activity.');
    if (!input.reason?.trim() || !input.evidenceReference?.trim()) throw new AppError(400, 'Record the recovery reason and supporting evidence reference.');
    if (!tx) return serializable(db => this.confirmOnBehalf(input, user, db));
    const cashier = await tx.user.findUnique({ where: { id: input.cashierId }, select: { id: true, fullName: true } });
    if (!cashier) throw new AppError(404, 'The original cashier account was not found.');
    const summary = await this.summary(input.day, { id: cashier.id, role: 'ADMIN' }, tx);
    if (!summary.entries.length && !summary.confirmations.length) throw new AppError(409, 'This cashier has no transactions or recorded cash count for that day.');
    const review = { reviewerId: user.id, reviewerName: user.fullName || `Administrator #${user.id}`, cashierId: cashier.id,
      cashierName: cashier.fullName, reason: input.reason.trim(), evidenceReference: input.evidenceReference.trim() };
    const latest = summary.confirmations[0];
    const retry = summary.confirmed && latest?.fingerprint === input.fingerprint && sameCount(latest.snapshot, input) && sameReview(latest.snapshot.review, review);
    if (!retry && (latest?.id || null) !== input.expectedConfirmationId) throw new AppError(409, 'The cashier confirmation changed. Refresh before reviewing it.');
    if (summary.confirmed && !retry) throw new AppError(409, 'This cashier already has a current confirmation; recovery is not required.');
    return saveConfirmation(tx, summary, input, user, review);
  },
};
