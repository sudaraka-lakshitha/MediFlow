# Exclusive request editing and processing

An uploaded prescription, its linked prescription, payment request and final sale
share a canonical lock. Independent retail requests and walk-in prescriptions
have their own locks. Patients can only claim their own records. Existing route
role checks still govern what operations the claimant may perform.

The upload review/customer actions, prescription editor/collection actions,
cashier payment/review actions and customer invoice forms obtain an editing lease
before enabling the form. Another staff member, patient or browser tab cannot
claim the same request. Read-only viewing remains available.

Leases last 90 seconds and renew every 25 seconds while editing. Closing a form
releases its lease. A closed browser or lost connection eventually expires the
lease; an old lease token cannot renew or save after another user claims it.
Expired/failed forms must be closed and their lists refreshed before reopening.
This is intentional: another user may have changed the record meanwhile.
Session locking can also cause an editing lease to expire. The draft remains in
memory, but must not be submitted against a request subsequently changed by others.

Mutating controllers obtain an additional atomic processing flag. Only one
operation is admitted at a time, including two submissions from the same tab.
Processing renews its lease every 20 seconds. JSON responses are sent after lease
cleanup so successive workflow steps can proceed. Existing serializable database
transactions, revision/status checks, unique source-upload constraints and payment
status transitions remain the final protection against duplicate financial work.
Leases alone are not a replacement for those transaction safeguards.

No new patient file-replacement feature was introduced: the existing uploaded
prescription/customer-choice, cancellation, collection and payment-slip flows are
protected. New unsubmitted uploads and unrelated retail sales are distinct work,
not edits of the same request. Refunds retain their existing transaction and
conditional-state protections; this change does not add long-lived refund-editor
leases.

Deploy both frontend and backend together and run the two new Prisma migrations
for `auth_sessions` and `workflow_leases`. Old clients without the new workflow
header must refresh before mutating a protected request. No live database was
migrated during development. Tests include mocked atomic-claim races and browser
fixtures with independent patient/staff contexts; live MySQL concurrency testing
is still required before production rollout.
