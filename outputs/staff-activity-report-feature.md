# Staff activity report

Implemented 12 October 2026.

## Use

Sign in as an administrator and open **Reports → Staff activity report**. Select a staff member (or all staff), task, module/record type, outcome, and inclusive date range. Click **Generate staff report**.

- On-screen summary groups all matching recorded actions by task, separating successful and failed outcomes.
- Details show staff, task, Sri Lanka date/time, audit ID and related record/document reference.
- Details are paginated, 50 per page; summaries and CSV are not limited to the visible page.
- **Export all matching activity (CSV)** downloads the filtered records, with UTC and pharmacy-local times and the report date range.
- Editing a filter shows a stale-results notice and disables export/paging until the report is regenerated.
- Up to 366 inclusive days per report. Invalid calendar dates and reversed ranges are rejected by the server.
- Staff reporting access is admin-only, independently of pharmacy-wide reconciliation delegation.

## Data limits

Reports use retained audit records for accounts currently assigned admin, pharmacist or cashier roles, including inactive accounts and retained records in audit trash. No records are purged when this report is read. Permanently deleted records and actions that were never logged cannot be reconstructed. Names and roles are current, not historical role snapshots. Successful audit events are not a measure of unique completed work: one workflow can generate several events.

Raw audit payloads, IP addresses, passwords, PINs and embedded patient data are not exported. Document identifiers are explicitly allowlisted. CSV text uses existing spreadsheet-formula protection. Exports are regenerated at download time, not immutable copies of earlier screen results.

No schema migration was needed. Existing business records and permissions were not changed. Browser testing included ordinary demo-admin sign-in activity.

## Verification

- 360 automated tests passed, including 18 new reporting tests covering dates, permissions, combined filters, pagination, full summary, safe exports and empty results.
- Frontend lint, TypeScript and production build passed.
- Local MySQL rollback-only integration verified inclusive local date boundaries, inactive staff, task/module/outcome filters, retained trash, 55-record pagination and complete summary totals. All test records rolled back.
- Live browser: filtered Demo Pharmacist / Prescription dispensed, verified one matching record and matching downloaded CSV. Confirmed stale-filter warning/export lock and the empty failed-only result.
- UI proof: `staff-activity-report.png`.
