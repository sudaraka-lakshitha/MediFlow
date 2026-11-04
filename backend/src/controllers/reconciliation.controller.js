import { createPdf } from '../utils/pdf.js';
import { recordAudit } from '../services/audit.service.js';
import { reconciliationService } from '../services/reconciliation.service.js';
import { pharmacyReconciliationService } from '../services/pharmacyReconciliation.service.js';

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
const formatTime = (value) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Colombo', dateStyle: 'short', timeStyle: 'medium',
}).format(new Date(value));
const pdfRowLimit = 2500;

export const reconciliationController = {
  exportPdf: async (req, res) => {
    const { day, scope } = req.query;
    const data = scope === 'PHARMACY'
      ? await pharmacyReconciliationService.summary(day, req.user)
      : await reconciliationService.summary(day, req.user);
    const entries = data.entries.slice(0, pdfRowLimit);
    const truncated = data.entries.length > entries.length;
    const latest = data.confirmations?.[0];
    const summary = [
      { label: 'Cash received · net', value: money(data.totals.CASH.net) },
      { label: 'Bank received · net', value: money(data.totals.BANK_TRANSFER.net) },
      { label: 'Card received · net', value: money(data.totals.CARD.net) },
      { label: 'Refunds pending', value: String(data.pendingRefunds || 0) },
    ];
    const notes = [
      `Scope: ${scope === 'PHARMACY' ? 'Entire pharmacy' : 'Current staff member'} · Business day: ${day} (Sri Lanka time).`,
      `Daily balance: ${data.confirmed ? 'Confirmed' : 'Not currently confirmed'}.`,
      ...(scope === 'PHARMACY' ? [
        `Cashier sign-offs: ${data.cashiers.filter((cashier) => cashier.confirmed).length} of ${data.cashiers.length} current.`,
        `Opening cash recorded: ${money(data.openingCash)} · Counted closing cash: ${money(data.countedCash)} · Expected: ${money(data.expectedClosingCash)}.`,
        ...(latest?.snapshot?.confirmedBy ? [`Pharmacy-wide confirmation by ${latest.snapshot.confirmedBy} at ${formatTime(latest.createdAt)}.`] : []),
      ] : [
        ...(latest?.createdAt ? [`Last confirmation: ${formatTime(latest.createdAt)}.`] : []),
        ...(latest?.snapshot?.openingCash != null ? [`Opening cash: ${money(latest.snapshot.openingCash)} · Counted closing cash: ${money(latest.snapshot.countedCash)}.`] : []),
      ]),
      ...(data.pendingRefunds ? ['Pending refunds are not included as payouts until settlement is recorded.'] : []),
      ...data.warnings.slice(0, 12).map((warning) => `Needs review: ${warning}`),
      ...(truncated ? [`Showing ${pdfRowLimit.toLocaleString()} of ${data.entries.length.toLocaleString()} transactions; use the on-screen filters or bank-reference CSV for the complete ledger.`] : []),
    ];
    const columns = [
      { key: 'time', label: 'Time (Sri Lanka)' },
      ...(scope === 'PHARMACY' ? [{ key: 'cashier', label: 'Cashier' }] : []),
      { key: 'document', label: 'Invoice / reference' },
      { key: 'direction', label: 'In / out' },
      { key: 'method', label: 'Method' },
      { key: 'amount', label: 'Amount', align: 'right' },
      { key: 'reference', label: 'Bank / payout reference' },
      { key: 'originalMethod', label: 'Originally paid by' },
    ];
    const rows = entries.map((entry) => ({
      time: formatTime(entry.date),
      cashier: entry.cashierName || req.user.fullName || `Staff #${req.user.id}`,
      document: entry.document,
      direction: entry.direction,
      method: String(entry.method).replaceAll('_', ' '),
      amount: money(entry.amount),
      reference: entry.reference || '—',
      originalMethod: String(entry.originalMethod || '—').replaceAll('_', ' '),
    }));
    const buffer = await createPdf({
      title: scope === 'PHARMACY' ? 'Pharmacy Daily Reconciliation' : 'Daily Cashier Reconciliation',
      subtitle: `Business day ${day} · Sri Lanka time`,
      columns,
      rows,
      summary,
      notes,
    });
    await recordAudit({ userId: req.user.id, action: 'DAILY_BALANCE_EXPORTED', entityType: 'DAILY_BALANCE', details: { day, scope, rowCount: rows.length, truncated }, ipAddress: req.ip });
    res.set('Cache-Control', 'no-store');
    res.attachment(`mediflow-reconciliation-${scope.toLowerCase()}-${day}.pdf`);
    res.type('application/pdf').send(buffer);
  },
};
