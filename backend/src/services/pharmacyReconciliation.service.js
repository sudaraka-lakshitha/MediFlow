import { pharmacyBalanceFingerprint } from '../utils/pharmacyBalanceFingerprint.js';
import { prisma } from '../config/prisma.js';
import { reconciliationService } from './reconciliation.service.js';
import { requirePharmacyReconciliation } from '../utils/reconciliationAccess.js';
import { serializable } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
const cents = value => Math.round(Number(value || 0) * 100);

export const pharmacyReconciliationService = {
  async summary(day, user, tx = null) {
    requirePharmacyReconciliation(user);
    if (!tx) return prisma.$transaction(db => this.summary(day, user, db), { isolationLevel: 'RepeatableRead', timeout: 20000 });
    const ledger = await reconciliationService.summary(day, user, tx, true);
    const personalConfirmations = await tx.dailyBalanceConfirmation.findMany({ where: { day }, select: { cashierId: true }, distinct: ['cashierId'] });
    const ids = [...new Set([...ledger.entries.map(entry => entry.cashierId), ...personalConfirmations.map(row => row.cashierId)])].filter(Number.isInteger).sort((a,b) => a-b);
    const people = await tx.user.findMany({ where: { id: { in: ids } }, select: { id: true, fullName: true } });
    const names = new Map(people.map(person => [person.id, person.fullName]));
    const cashiers = [];
    for (const id of ids) {
      // Scope to this historic actor, even when their role has since changed.
      const personal = await reconciliationService.summary(day, { id, role: 'ADMIN' }, tx);
      const latest = personal.confirmations[0];
      cashiers.push({ cashierId: id, name: names.get(id) || `Staff #${id}`, confirmed: personal.confirmed,
        confirmationId: latest?.id || null, confirmedAt: latest?.createdAt || null,
        review: latest?.snapshot?.review || null,
        fingerprint: personal.fingerprint, totals: personal.totals,
        openingCash: latest?.snapshot?.openingCash ?? null, countedCash: latest?.snapshot?.countedCash ?? null });
    }
    const entries = ledger.entries.map(entry => ({ ...entry, cashierName: names.get(entry.cashierId) || 'Unknown cashier' }));
    const warnings = [...ledger.warnings];
    if (entries.some(entry => entry.cashierId == null)) warnings.push('Some transactions have no recorded cashier. Resolve their ownership before confirming.');
    if (cashiers.some(row => !row.confirmed)) warnings.push('Every cashier with activity or a recorded cash count needs a current individual balance confirmation, or an administrator review if unavailable.');
    const counted = cashiers.filter(row => row.confirmed);
    const openingCash = counted.reduce((sum,row) => sum + cents(row.openingCash), 0) / 100;
    const countedCash = counted.reduce((sum,row) => sum + cents(row.countedCash), 0) / 100;
    // Bind approval to both the ledger and each cashier's latest signed-off count.
    // A different authorized confirmer must see the same pharmacy-wide status.
    const fingerprint = pharmacyBalanceFingerprint(day, ledger.entries, cashiers);
    const confirmations = await tx.pharmacyBalanceConfirmation.findMany({ where: { day }, orderBy: { id: 'desc' }, take: 10 });
    const latest = confirmations[0];
    const snapshot = latest?.snapshot;
    const matchesStoredSnapshot = Array.isArray(snapshot?.entries) && Array.isArray(snapshot?.cashiers)
      && pharmacyBalanceFingerprint(day, snapshot.entries, snapshot.cashiers) === fingerprint;
    const pendingRefunds = await tx.refund.count({ where: { status: 'PENDING' } });
    return { day, scope: 'PHARMACY', entries, totals: ledger.totals, cashiers, openingCash, countedCash,
      expectedClosingCash: (cents(openingCash) + cents(ledger.totals.CASH.net)) / 100,
      warnings, pendingRefunds, fingerprint, confirmations, confirmed: Boolean(latest && (latest.fingerprint === fingerprint || matchesStoredSnapshot)) };
  },
  async confirm(input, user, tx = null) {
    requirePharmacyReconciliation(user);
    if (!tx) return serializable(db => this.confirm(input, user, db));
      const summary = await this.summary(input.day, user, tx);
      if (summary.fingerprint !== input.fingerprint) throw new AppError(409, 'Transactions or cashier confirmations changed. Refresh the pharmacy balance.');
      if (summary.warnings.length) throw new AppError(409, 'Resolve the warnings and obtain current individual cashier confirmations first.');
      if (!input.referencesChecked) throw new AppError(400, 'Confirm that all cashier counts and statement references were reviewed.');
      if (cents(input.openingCash) !== cents(summary.openingCash) || cents(input.countedCash) !== cents(summary.countedCash)) throw new AppError(409, 'Combined cash counts must match the individual cashier confirmations.');
      if (cents(input.countedCash) !== cents(summary.expectedClosingCash)) throw new AppError(409, 'Combined closing cash does not balance.');
      for (const method of ['BANK_TRANSFER','CARD']) for (const direction of ['received','refunded']) {
        if (cents(input.verified[method][direction]) !== cents(summary.totals[method][direction])) throw new AppError(409, 'Pharmacy statement/terminal totals do not match receipts and refunds.');
      }
      if (summary.confirmed) return summary.confirmations[0];
      const snapshot = { entries: summary.entries, totals: summary.totals, cashiers: summary.cashiers,
        openingCash: input.openingCash, countedCash: input.countedCash, verified: input.verified,
        pendingRefunds: summary.pendingRefunds, referencesChecked: true, notes: input.notes || '', confirmedBy: user.fullName || `Staff #${user.id}` };
      const confirmation = await tx.pharmacyBalanceConfirmation.create({ data: { day: input.day, confirmedById: user.id, fingerprint: summary.fingerprint, snapshot } });
      await tx.auditLog.create({ data: { userId: user.id, action: 'PHARMACY_BALANCE_CONFIRMED', entityType: 'PHARMACY_BALANCE', entityId: confirmation.id, details: { day: input.day, fingerprint: summary.fingerprint } } });
      return confirmation;
  },
};
