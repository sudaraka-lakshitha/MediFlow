# MediFlow system review — 26 October 2026

**Follow-up:** Local repairs and their verification are recorded in [27 October repair status](system-repair-status-2026-10-27.md). The findings below preserve the original audit at `0ce923d`; they are not the current repair-status checklist.

## Outcome and scope

Application fixes were committed as `0ce923d` on `master` and pushed to `origin/master`. The remote accepted a normal fast-forward from `af05149`. No force-push was used. Local certificates, temporary diagnostics, generated presentations/screenshots, and unrelated Android changes were excluded.

This report concerns the web frontend and backend at that commit. **13 remaining defects and 4 workflow/security gaps** are listed below. These new findings have not been fixed. This is a broad source review plus automated regression and focused service-level checks, not a certification that every real-world scenario works.

### Verification performed

- Backend: **641 tests passed across 56 test files**.
- Frontend: TypeScript/production build passed. Lint completed successfully but reported React warnings; it is not warning-free.
- Dependency audit: **0 reported vulnerabilities** in backend production dependencies and in the frontend dependency audit. This does not establish that the application has no security flaws.
- Nine targeted diagnostic probes reproduced retry, data-loss, response-filtering, validation and rounding problems using in-memory database substitutes. **No real pharmacy records were changed by these probes.** The probe is at `backend/.tmp/system-review-probes.mjs` and is not committed.
- Earlier local checks in this repair sequence verified upload replay/concurrency and a rollback-based delivery/bank-reference workflow. They were not rerun as part of this report.
- Source review covered authentication/session handling, role permissions, patient/offline records, prescription editing and acknowledgements, payments, stock, refunds/returns, delivery, bulk imports, reporting, reconciliation and key UI state.
- Not performed in this pass: a complete browser walkthrough for every role; physical thermal/A4 printing; SMTP delivery; Android/device testing; production database inspection; live bank/courier integration; prolonged production-volume load tests. Production deployment completion has not been verified.

## Where an administrator handles refunds now

| Situation | Current window and action |
|---|---|
| Paid prescription/order that has not been collected, including an older payment ordinary staff cannot revoke | **Cashier payments → find the bill → Refund / Cancel payment**. Administrators bypass the same-day restriction; non-admins still need cashier access and a same-day payment. |
| Completed/collected prescription or retail invoice | **Sales & billing → Refunds & returned stock → choose the completed invoice → Create refund / return → Preview refund → Authorize refund**. This is not currently admin-only; authorized cashiers can use it too. |
| Exceptional refund of a delivery charge after dispatch | **Cashier payments or Sales & billing → Refunds & returned stock → Review delivery-fee exception → decision and reason → Record decision**. |
| Actual repayment after authorization | In **Refunds & returned stock**, choose **Record completed payout**, select cash/bank/card, record the reference and confirm. This records an already-made payment; it does not transfer money. |

Administrators can grant delivery-fee exception approval under **Users → edit staff → Allow exceptional delivery-fee refund approval**. The requester cannot approve their own exception, even if they are an administrator. A second authorized person must review it. Payout permission is separate.

There is currently **no general “request admin refund approval” inbox** for ordinary payments that staff cannot process. The admin must open the bill directly. See G1.

## Confirmed remaining defects

Priority: **P1** = address first because records, money or sensitive draft data can be affected. **P2** = important correctness, usability or security repair. Evidence is labelled “probe” for an executed diagnostic or “source” for a confirmed code path, not a live browser reproduction.

### B01 — Retrying other writes can still apply the action twice — P1

**Evidence:** Probe and source. `saleService.pay` accepts a second identical partial CASH payment while the sale remains PENDING. Two retries of Rs. 100 against a Rs. 1,000 invoice produced two payment rows and Rs. 200 recorded. Two identical stock adjustments of +2 changed stock from 10 to 14 instead of 12. New retail sale creation also generates a fresh invoice identifier on every request.

The recently fixed prescription-upload creation is protected; this does not make all application writes idempotent. Workflow locks prevent simultaneous processing but do not identify a later retry after the first request completed.

**Best repair:** Persist a client operation ID and payload hash with each high-impact write, atomically with the payment/stock/invoice result. Return the prior result on a matching retry and reject a changed payload with the same ID. Keep synchronous UI submit guards as a second layer. Do not deduplicate by amount/date alone, because legitimate identical transactions exist.

**Sources:** [partial payments](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/sale.service.js:39>), [retail creation](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/sale.service.js:57>), [stock adjustment](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/inventory.service.js:114>).

### B02 — Omitting patient fields can erase saved details — P1

**Evidence:** Probe. A valid staff patient update containing only `fullName` produced `phone: null` and `chronicConditions: null`. The validator allows those fields to be omitted, but the service uses `value || null`. Ordinary UI forms normally send these fields; reduced API requests or a future UI change can lose them.

**Best repair:** Preserve omitted fields consistently; accept an explicit clear value/null only when clearing is intended. Validate the update contract and add a version check to prevent stale full-form overwrites. This protects existing clinical/contact data without preventing intentional corrections.

**Source:** [patient update](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/patient.service.js:52>).

### B03 — Patient health-record API exposes draft directions hidden elsewhere — P1

**Evidence:** Probe and source. `/patients/me/health-record` uses the staff health-record shape and returns all prescription-item scalar fields, including draft directions and notes. A PENDING prescription's draft instructions were returned unchanged. The ordinary prescription endpoint deliberately redacts these fields before the configured release condition. The health-record UI does not render all of them, but they are still in its API response. This is an inconsistent patient-data boundary, not evidence that another patient's records are accessible.

**Best repair:** Use one explicit patient-safe prescription serializer across health records, prescription views and documents. Clearly distinguish draft from pharmacist-released directions and enforce the same release policy on every endpoint. Hiding fields only in the page is insufficient.

**Sources:** [health-record response](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/patient.service.js:83>), [existing redaction policy](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/prescription.service.js:42>).

### B04 — Unexpected database/server errors expose internal messages — P2

**Evidence:** Source. Unmapped Prisma errors and other unexpected failures keep `error.message` and return it to the browser. Missing-column errors can therefore expose database/table/column details, as seen in the earlier screenshots.

**Best repair:** Return a safe generic message plus request ID for unexpected failures; keep full diagnostics in restricted server logs. Continue returning useful, explicitly approved validation/business messages. This preserves supportability without leaking implementation details.

**Source:** [error handler](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/middleware/errorHandler.js:12>).

### B05 — Per-line rounding can make financial report totals disagree with invoices — P2

**Evidence:** Probe. An invoice with three Rs. 1 lines and a Rs. 1 discount has Rs. 2 net revenue. Independently rounded line allocations sum to Rs. 2.01. Reports use these line values, so the discrepancy can accumulate. The refund workflow's final-cent handling does not fix the original reporting allocation.

**Best repair:** Allocate discount, tax and fees in integer cents/Decimal with deterministic residual allocation to a line, then reuse that allocation in invoices, credits and reports. Each document must satisfy that its lines sum exactly to its totals.

**Source:** [financial calculations](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/utils/reportFinancials.js:3>).

### B06 — Accepted phone formats differ between screens — P2

**Evidence:** Probe and source. Registration accepts both `0701234567` and `+94701234567`, while staff patient forms and patient-profile validation accept only the leading-zero format. Entering the international format in a profile update is rejected.

**Best repair:** Share one phone parser and matching UI help/constraints; accept both requested forms and normalize to one storage representation. This avoids screen-specific failures and assists duplicate detection.

**Sources:** [profile validators](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/validators/patient.validator.js:7>), [registration validator](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/validators/auth.validator.js:5>).

### B07 — Inventory purchase-price validation allows unsupported values — P2

**Evidence:** Probe. Receiving/updating stock accepts purchase prices with excess decimal places and values outside the database's Decimal(12,2) range. Both `1.23456` and `1e20` pass the receiving schema. The database can then round the value or reject it instead of giving a useful input error.

**Best repair:** Validate a finite monetary value, supported maximum and at most two decimal places before persistence, using the same money rule on create and edit. Reject unsupported precision rather than silently rounding acquisition costs.

**Source:** [inventory validation](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/validators/inventory.validator.js:10>).

### B08 — Patient refund responses include staff-only details — P2

**Evidence:** Probe and source. `refundService.list` scopes patients to their own refunds but returns the full refund/line records, including supporting evidence references, staff IDs and returned-stock inspection reasons. The UI hides some of these details, but the API does not. The sale invoice serializer already uses an allowlist, making the separate refund response inconsistent.

**Best repair:** Provide a patient-specific allowlist containing amount, customer-visible reason/decision, status, payout method/reference/date and refunded item quantities. Keep internal evidence and stock-review notes in staff responses unless explicitly marked customer-visible.

**Source:** [refund list](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/refund.service.js:19>).

### B09 — Invalid report dates can silently select a different period — P2

**Evidence:** Probe and source. Report routes validate date-shaped strings rather than real calendar dates. `2026-02-31` is accepted and rolls forward to March 3 by the date-boundary calculation. Month validation has the same structural weakness.

**Best repair:** Validate actual calendar dates/months, ordering and a reasonable maximum range before querying. This is preferable to silently normalizing financial reporting periods.

**Sources:** [report routes](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/routes/index.js:113>), [date conversion](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/report.service.js:8>).

### B10 — Delivery refreshes discard unsaved tracking/courier edits — P2

**Evidence:** Source. Every successful delivery reload clears both tracking and courier draft maps. Reloads occur on filter changes, refresh and successful actions. Entering tracking for several rows and saving one can therefore erase the other rows' unsaved entries.

**Best repair:** Keep drafts per delivery/version, clear only successfully saved rows and warn before discarding dirty edits. If the server version changes, present a conflict instead of silently replacing a draft.

**Source:** [delivery reload](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/frontend/src/components/DeliveryWorkspace.tsx:36>).

### B11 — Several screens load complete history before presenting results — P2

**Evidence:** Source. `pagedList` downloads every matching page and accumulates all rows. It is used by sales, prescriptions, health records and delivery views; the refund list has no pagination at all. This creates increasing request count, memory use and wait time as records grow. A production-scale timeout has not been load-tested here.

**Best repair:** Server-side filtering plus bounded cursor/page navigation, server-computed counts and explicit streamed exports. Fetch only the visible page rather than all history to paginate locally. This improves mobile responsiveness and makes performance predictable.

**Sources:** [fetch-all helper](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/frontend/src/api/pagedList.ts:5>), [refund list](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/refund.service.js:19>).

### B12 — Retail customer selection cannot reach patients beyond the initial 500 — P2

**Evidence:** Source. Retail options fetch only the first 500 eligible patient users, alphabetically. The cashier selector searches only that returned array; it does not ask the server for additional matching patients. Customers outside the initial set cannot be selected through that control.

**Best repair:** Use debounced server-side patient search with paging and preserve the selected patient separately. Show whether more results exist. This avoids silently dropping valid customers or encouraging duplicate patient creation.

**Sources:** [retail options](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/backend/src/services/paymentRequest.service.js:412>), [cashier selector](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/frontend/src/pages/CashierPage.tsx:1876>).

### B13 — Courier filter choices disappear after filtering — P2

**Evidence:** Source. The courier dropdown derives its choices from the currently returned rows, while the server already filters those rows by the selected courier. After choosing courier A, courier B disappears until the filter is reset. Combined filters can also remove the selected option entirely.

**Best repair:** Populate courier choices from independent filter metadata or a stable courier list, and retain the selected value even when there are zero matches. Filters should not remove the alternatives needed to change them.

**Source:** [courier selector](<E:/IAT/All Lecture Materials For S1Y3/MediFLow/frontend/src/components/DeliveryWorkspace.tsx:118>).

## Workflow gaps and security hardening — separate from defects

### G1 — No ordinary restricted-refund escalation queue

Special delivery-fee exceptions have an approval process, but an ordinary older paid bill that a cashier cannot cancel has no equivalent “request administrator approval” action. The admin currently performs the cancellation directly.

**Recommended:** Add a reasoned request → admin review → approved refund obligation → cashier payout flow. Bind the approval to the invoice revision, amount and selected items; invalidate it if those change. Add pending approval/payout counts and notifications. Do not grant every cashier unrestricted backdated refund access just to make the workflow easier. Preserve the existing requester/approver separation for delivery-fee exceptions.

### G2 — Additional prescription attachments cannot be corrected individually

Creation supports up to five files. Edit mode only permits replacing the first attachment and explicitly keeps the others; the edit API disallows `additionalAttachments`. A patient cannot correct/remove the wrong second page or add a missing page in the same unprocessed request.

**Recommended:** Before pharmacy processing, allow a versioned attachment list with add/replace/remove controls, a final one-to-five attachment validation and the existing patient/staff workflow lock. Retain an audit trail and invalidate any relevant review when source documents change. Do not silently change a prescription already being dispensed.

### G3 — Bank-reference protection lacks account-aware allocation

Bank references are treated as globally single-use across payment records. There is no bank-account-scoped transfer ledger or a way to allocate one verified transfer across multiple invoices, such as medicines and a separate delivery fee. This is a limitation, not a reason to remove duplicate protection.

**Recommended:** Record the verified transfer once with destination account, reference, date and amount, then atomically allocate its remaining amount to invoices. Require explicit reconciliation for ambiguous references. Never allow the same transferred amount to be spent twice.

### G4 — Authentication abuse limits need strengthening

Registration has no route-specific rate limiter. Login/reset throttles use a process-local map keyed by IP plus email. Their counters reset on restart and are not shared between server instances; changing one key component avoids the same bucket. This was identified from source, not by sending attack traffic.

**Recommended:** Add registration throttling and shared, bounded IP/account limits with retry guidance and monitoring. Keep the database-backed OTP attempt checks. Tune limits so a shared pharmacy network does not lock out all legitimate staff.

## What the review did not establish as broken

- Stock quantity guards distinguish countable units from measured volume/weight and reject unsupported fractional stock quantities. Dose calculations are separate; fractional prescribed doses must not be confused with dispensing stock units.
- Prescription upload creation now has a stored submission key/hash and duplicate retry tests.
- Full payment-request settlement, refund payout and approval transitions have transaction/status guards; B01 concerns paths that can legitimately remain open for another write and unkeyed creation, not proof that every payment endpoint duplicates.
- Returned medicines are not automatically placed into saleable stock on refund. Pharmacist/admin stock review is separate.
- Delivery-fee exception approval requires permission, a different reviewer and a reason; actual payout remains a separate cashier action.
- Delivery actions enforce status transitions, payment checks and row-version checks; bulk updates require preview/confirmation and transaction-pinned workflow locks.
- Bulk product imports preserve omitted/blank fields and support explicit clearing. B02 concerns staff patient updates, not a regression in that import feature.
- Pharmacy-wide reconciliation has its own permission check and confirmation fingerprint. No bypass was established during this review.
- Session revocation, idle time checks and permission-change token invalidation have regression coverage. The use of tab-scoped storage does not guarantee logout after browser crash/session restoration; users should still explicitly sign out on shared devices.

## Recommended repair order

1. **B01:** persistent retry protection for money, stock and record creation; include lost-response retries, parallel requests and changed-payload tests.
2. **B02–B04 and B08:** prevent patient data loss and unify safe customer/error responses.
3. **B05–B07 and B09:** exact monetary allocation, shared phone parsing, purchase-price limits and true calendar validation.
4. **G1:** add the general restricted-refund approval queue and make the admin path discoverable.
5. **B10–B13 and G2:** preserve delivery drafts, improve filtering/pagination and complete multi-attachment editing.
6. **G3–G4:** account-aware bank reconciliation and shared authentication abuse controls.
7. Run a full multi-role browser/device acceptance pass: online/offline creation; quotation rejection/edit/re-acceptance; cash/bank payment; partial cancellation; collection; delivery/failed delivery/return/reshipment; full/partial refunds and exceptional fee refunds; daily reconciliation; Excel/CSV import; document preview/printing; slow connection and session expiry during each stage.

The commit contains six new migration directories relative to the prior master. The configured backend startup must run `prisma migrate deploy` before the new backend starts. Do not reset or reseed the production database. A successful Git push alone does not confirm that migrations or hosting deployments finished.
