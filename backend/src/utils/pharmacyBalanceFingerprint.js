import crypto from 'node:crypto';
const cents = value => value == null ? null : Math.round(Number(value) * 100);
// Names, confirmation IDs/timestamps and reviewer notes are audit/display data,
// not changes to the ledger or signed cash counts. Normalize old snapshots too.
export const pharmacyBalanceFingerprint = (day, entries, cashiers) => crypto.createHash('sha256').update(JSON.stringify({
  day,
  entries: entries.map(entry => ({ id: entry.id, date: entry.date, document: entry.document,
    cashierId: entry.cashierId ?? null, method: entry.method, direction: entry.direction,
    amount: cents(entry.amount), reference: entry.reference || '', originalMethod: entry.originalMethod || null,
    warning: entry.warning || null })).sort((a,b) => a.id.localeCompare(b.id)),
  cashiers: cashiers.map(row => ({ cashierId: row.cashierId, fingerprint: row.fingerprint,
    confirmed: row.confirmed, openingCash: cents(row.openingCash), countedCash: cents(row.countedCash) })).sort((a,b) => a.cashierId-b.cashierId),
})).digest('hex');
