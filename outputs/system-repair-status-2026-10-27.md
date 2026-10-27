# MediFlow repair status — 27 October 2026

This follows the 26 October audit at commit `0ce923d` and accompanies the subsequent repair commit. Verification below was performed locally; production deployment completion has not been verified.

## Verification

- Backend regression suite: **681 tests passed across 62 files**.
- Frontend: TypeScript check and production build passed. Lint exited successfully with existing React warnings; it is not warning-free.
- Prisma schema validation passed. The local MySQL `mediflow` database reports **30 migrations, up to date**.
- Focused real-MySQL checks passed using `backend/scripts/qa-audit-repairs.mjs --confirm-local`. The script rejects non-local databases, rolls back its business fixtures and removes its exact temporary retry-test keys.
- The concurrency check intentionally caused a database write conflict; the retry recovered and exactly one effect remained. It did not require manually retrying a payment.
- Local backend `/health` and frontend `/login` responded successfully after restarting the backend.
- During the signed-in administrator browser session, the cashier page, approval inbox, refund-request form and verified-bank-receipt form were inspected. Customer lookup and typing in the reason field worked. No payment or approval was submitted through the browser. The session subsequently expired.

## Defects addressed

| Audit ID | Implemented repair | Verification / scope |
|---|---|---|
| B01 — duplicate writes | Persistent operation keys bind an actor, endpoint and payload to a result inside the same transaction. Matching retries replay; changed payloads with the same key are rejected. Applied to retail sale/bill creation, sale payments and inventory receive/adjust/disposal. The browser retains an attempt key until success. | Unit checks and real concurrent MySQL retry test. Existing upload submission-key protection remains. This is not a claim that every endpoint uses the new operation-receipt mechanism. |
| B02 — omitted patient fields / stale edits | Omitted phone and clinical fields are preserved. Explicit empty/null values clear supported fields. Staff and self-profile updates submit a saved record version and reject stale changes. | Regression tests plus real MySQL partial-update and stale-version checks. |
| B03 — draft directions exposed | Patient health records and prescription responses share the patient directions-release policy; staff-only prescription fields are excluded from the patient health-record shape. | Patient-response regression checks. |
| B04 — internal server errors exposed | Unexpected failures return a generic message with a request ID. Detailed diagnostics stay in server logs; approved business errors remain useful. | Error-response regression test. |
| B05 — report / refund line rounding | Invoice discount, tax and fee cents use deterministic allocation. Completed-sale refunds use the same line totals and cumulative returned quantities, less amounts already credited. Dated product-credit reports and sale summaries agree with the actual authorized credits, including historical rounding. | Regression covers residual cents, reversed line order, nine successive partial returns and legacy credits. Every credit's revenue plus tax matches its amount; final returns leave zero revenue/tax while unreviewed returned stock retains its cost. |
| B06 — inconsistent phone formats | Shared validation accepts `0701234567` and `+94701234567`, storing the leading-zero form. Profile/staff forms use matching constraints. | Both formats covered by tests. |
| B07 — purchase-price precision/range | Purchase prices reject negatives, non-finite values, more than two decimal places and values beyond the database monetary range. | Boundary and precision tests. |
| B08 — staff refund details in patient API | Patient refund output uses an allowlist for customer-visible amounts, reasons, state, payout information and quantities. Internal evidence and stock-review notes remain staff-only. | Patient-response regression checks. Admin escalation review notes are also kept separate from the customer-visible refund reason. |
| B09 — impossible reporting dates | Calendar validation rejects impossible dates/months, reversed periods and excessive ranges before reports query data. | Calendar/range regression tests. |
| B10 — lost delivery drafts | Courier/tracking drafts survive reloads and changes to other rows. Each draft keeps its original version; conflicting updates are flagged, and drafts can be discarded explicitly. | Source/build verification. A full two-browser editing walkthrough remains. |
| B11 — fetch-all history | Replaced the history accumulator with bounded 50-record navigation and server search on the affected screens. Main status/delivery queue filters run before paging; the cashier pending-payment count is computed on the server. Refund calculations use complete server-side prior-refund totals, independent of the visible page. | Build, service tests and real query/queue checks. Secondary table filters/counts and delivery exports are explicitly page-scoped. All-history streamed exports and every filter's global count remain enhancements. |
| B12 — retail patient selection cutoff | Retail customer selectors query the server by patient name, phone, email or patient number, allowing older patients beyond the original first 500 to be found. The current selection is retained. | Admin browser lookup and build verification. Results are bounded; there is no dedicated paged customer-search picker yet. |
| B13 — disappearing courier choices | Courier choices come from an independent endpoint, scoped to the patient's records where appropriate. They no longer depend on the filtered delivery page. | Source/build verification. |

## Added workflows / security improvements

| Audit ID | Implemented behavior | Limits |
|---|---|---|
| G1 — restricted-refund escalation | Staff submit a reasoned, previewed request for a current paid/uncollected invoice. A different administrator reviews it. Approval verifies the original bill revision, amounts, quantities and delivery state and creates a pending refund obligation through the existing cancellation flow. Cashier payout stays separate. Pending approval/payout indicators and decision history are included. | Completed sales and parcels already dispatched use their existing return/refund workflows. An approval does not transfer money. |
| G2 — multiple attachment correction | Before processing, the owning patient can add or remove attachments, replace the primary file, or promote a remaining attachment. The final request must contain one to five attachments. Version and workflow-lock checks remain; attachment additions/removals are recorded in the audit event. | Already processed prescriptions cannot be silently rewritten using this editor. |
| G3 — verified transfer allocations | A cashier records a bank-statement-verified receipt by destination account, reference, date, customer and amount. Its available balance can pay multiple prepared invoices for that customer, with atomic debit, revision/acknowledgement checks and repeat-allocation protection. Refunds never make the original transfer spendable again. | Allocations settle whole prepared invoices. Legacy payment references remain protected. Existing daily invoice reconciliation counts allocations; unallocated receipts are shown separately in the bank ledger, not folded into the daily reconciliation totals. |
| G4 — shared authentication limits | Registration, login and password-reset routes use database-backed IP/account budgets, hashed identifiers and retry guidance. Counters survive server restarts and are shared across instances. Existing OTP checks remain. | Operational thresholds still require monitoring under the pharmacy's real traffic; load/abuse testing was not performed against production. |

### Bank history protection added during final verification

- Bank details referenced by payment slips or verified receipts cannot be rewritten. Instructions and active status can still be changed.
- Duplicate bank accounts differing only in case, whitespace or account-number hyphens are rejected on creation. An existing retired account can be reactivated.
- Pre-existing duplicate entries with the same normalized bank/account details share receipt lookup, preventing the same receipt from creating another balance through an alias entry.
- Both account-edit and deactivate actions protect the final active payment account.
- Tests cover these guards, and the duplicate-account/immutable-history path passed against real MySQL with rollback.
- Bank names are still administrator-entered text. Different names or aliases for the same physical bank require staff reconciliation; this is not an external bank identity-verification service.

## Where to use the new controls

1. **Cashier payments → Administrator refund approvals**, or **Sales & billing → Refunds & returned stock → Administrator refund approvals**. Staff choose **Request approval**, select a paid invoice, enter the customer-visible reason and preview before submitting. A different administrator selects **Review request**. Approved obligations appear in the normal refund payout queue.
2. **Cashier payments → Verified bank transfers & invoice allocations**. Record only money already verified against the bank statement, then allocate its available balance to the customer's prepared invoices.
3. **Prescription uploads → Edit request**, while the upload is still awaiting processing. Add/remove files within the five-attachment limit.
4. Use **Search all… / Previous history page / Next history page** for older records. A page-scoped count or export is not a pharmacy-wide total.

## Database and deployment state

These four new migrations have been applied locally:

- `20261026010000_operation_receipts`
- `20261026020000_shared_auth_limits`
- `20261026030000_refund_approvals`
- `20261026040000_bank_transfer_allocations`

No production database was accessed during this verification. On deployment, the backend needs these migrations before serving the new code, plus a generated Prisma client. Frontend and backend changes should be released together. No production database reset or seed is required.

## Remaining work / acceptance boundaries

- Decide whether the daily bank reconciliation should also incorporate unallocated ledger receipts, with an explicit rule preventing them being counted again on later allocation. The current UI labels the separation.
- Complete a multi-role browser walkthrough for patient attachment edits, staff edits/conflicts, admin approval/rejection and cashier allocation/payout. The database/service checks do not replace that acceptance test.
- Global counts for all secondary filters, all-history streamed exports, and paged customer-search results are not included in the bounded-history repair.
- Existing React lint warnings remain. Physical printers, real email delivery, Android/device behavior, courier integrations and production-volume load testing were not verified here.
- Production deployment has not been verified. Unrelated Android changes, certificates, temporary diagnostics and generated artifacts are excluded from the repair commit.
