# Pharmacy-wide daily reconciliation

## Where to find it

- Admin: Users → Edit account → Allow pharmacy-wide daily reconciliation.
- Eligible delegates: cashiers, or pharmacists with cashier payments enabled.
- Admins have automatic access. No existing non-admin account was granted access during implementation.
- Authorized staff: Cashier payments → Daily balance & bank reconciliation → Entire pharmacy — all cashiers → select business day → Load / refresh transactions.

## Behavior

- Consolidates cash, bank, card and other customer receipts and settled refund payouts by Sri Lanka business day, including split payments and bank-paid orders refunded in cash.
- Shows the responsible cashier, transaction references, bank-reference CSV and each cashier's personal confirmation status.
- Requires current personal confirmations for every cashier with daily activity or a saved cash count. If a cashier is unavailable (including inactive/former staff), an admin can select **Review on behalf of [name]**, independently enter checked figures, and record a mandatory reason and evidence reference. Delegated cashiers/pharmacists cannot perform this recovery.
- Final confirmation compares combined cash counts and independently entered statement totals. Missing ownership, unclassified entries, missing bank references and stale/missing cashier confirmations block it.
- Confirmation stores a separate pharmacy-wide snapshot and audit entry. Later ledger or cash-count changes invalidate the current sign-off. Names, personal confirmation IDs/timestamps and identical re-confirmations do not. Duplicate submission returns the existing confirmation; returning to a previously approved financial state permits a new approval without deleting earlier history.
- Permission changes are audited, revoke existing sessions, and are enforced server-side. Disabling a pharmacist's cashier functions removes their delegated reconciliation permission.
- Read summaries use a consistent database transaction. Confirmation uses serializable isolation.

## Scope limits

This covers customer receipts and refund payouts, not cash drops, expenses or drawer transfers. Pending refund counts describe the current queue; they are not treated as payouts. Delegated consolidated access does not let staff overwrite another cashier's personal confirmation or reclassify their transactions. Admin recovery appends an explicitly attributed review, cannot replace a current sign-off, and does not bypass missing ownership, unclassified payments, cash differences or statement mismatches.

## Verification

- Automated tests cover permissions, grant/revocation, combined totals, missing confirmations, stale previews, later payments, changed cash counts, refund methods, duplicate submission, audit and missing ownership.
- Local MySQL rollback-only integration check exercised delegated access, actual confirmation storage, audit, idempotency and access denial. All test fixtures rolled back.
- Browser checked the admin permission control without saving, and a historical day's consolidated totals and missing-cashier warning without confirming a real balance.
- Applied local migrations for a default-disabled permission and separate confirmation table, then replaced the unique day/fingerprint constraint with a non-unique index to support A-B-A approval history. Existing financial records and personal confirmations were not rewritten.
- October 12 repair checks: 342 automated tests, lint and production build passed; local MySQL rollback-only checks cover all four reported bugs, former-cashier recovery and administrator audit attribution.
