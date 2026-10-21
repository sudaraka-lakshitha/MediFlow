# Workspace locking

## Behaviour

- Default inactivity warning: 15 minutes; admin-configurable in operation settings
  between 5 and 60 minutes. The warning lasts another 60 seconds before locking.
- Only the dedicated user-activity request refreshes idle time. Notification polling
  and ordinary API requests do not extend it. Visible-page pointer, keyboard and
  scroll interaction sends activity at most once per 30 seconds.
- The maximum authenticated period is 8 hours or the configured JWT lifetime,
  whichever is shorter. A five-minute warning offers password verification early.
- The backend checks every protected request against the persistent session record.
  Locked sessions return 423. Only session status, activity (which cannot revive a
  lock), lock, logout and password verification are accessible through the session
  control middleware. Signature, active account and token-version checks still apply.
- Requests admitted before a deadline may complete normally. There is no timer
  cancelling an existing transaction. New protected actions after the deadline are
  blocked. A multi-step workflow does not grant an unlimited extension.
- The client keeps its mounted forms hidden and inert while locked. Unlock requires
  the same account's password, rotates the session generation and starts a new
  authenticated period. Failed writes are never automatically replayed.
- Repeated failed password attempts are throttled in the database. Logout revokes
  the current server session. Password/permission changes retain account-wide token
  version revocation.
- Unsaved drafts survive the lock while the page remains open; they are not stored
  permanently. Reload, closing the page, memory reclamation or account revocation
  can still discard unsaved work. Separate exported documents are not revocable.

## Deployment

Deploy backend and frontend together. Run `npm run prisma:generate` for builds and
`npm run prisma:deploy` before starting the backend. Migration
`20261021000000_session_lock` creates the session table without altering business
records. Existing tokens without tracked session IDs will require one fresh login.
No production database migration was executed during implementation.

The current bearer-token storage remains localStorage. This change implements
server-enforced locking, not the separate HttpOnly-cookie/CSRF migration. Shared
workstations should still use OS screen locking when unattended. Browser-close
events are deliberately not used as a security guarantee.

## Verification

Backend: `npm test` (includes policy, lock enforcement, revocation, generation
rotation, throttling, error classification and frontend session-state tests).
Frontend: `npm run build` and `npm run lint`.
Browser: start Vite at port 5178, then run `node frontend/tests/session-lock.cjs`
from the repository root with PLAYWRIGHT_MODULE set if Playwright is installed
outside the repository. Set TEST_WIDTH=1280 for the desktop variant. These browser
checks use API fixtures and do not mutate a live database.
