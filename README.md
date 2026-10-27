# MediFlow — Pharmacy Management System

> **Academic prototype.** Not intended for clinical or production use. All interaction indicators, label data, and research results must be verified by a qualified pharmacist using authoritative clinical references before dispensing.

MediFlow is a full-stack pharmacy operations prototype built with **React + TypeScript** (Vite), **Node.js + Express**, **Prisma ORM**, and **MySQL**. It supports online and walk-in prescriptions, retail sales, stock reservations, dispensing, payment verification, refunds, home delivery, reconciliation, and staff auditing. Local development can use XAMPP MySQL/MariaDB; the hosted setup separates the Vercel frontend, Render API, and Aiven MySQL database.

The **27 October 2026 update** adds administrator refund escalation, verified bank-transfer allocations, individual upload-attachment editing, persistent retry protection, shared authentication limits, bounded history navigation, consistent refund/report rounding, a full performance audit with significant speed improvements, and several UX fixes. See [Architecture overview](#12-architecture-overview) and [Current QA status and limits](#15-current-qa-status-and-limits) for details.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone the repository](#2-clone-the-repository)
3. [Create the XAMPP MySQL database](#3-create-the-xampp-mysql-database)
4. [Configure the backend](#4-configure-the-backend)
5. [Install dependencies](#5-install-dependencies)
6. [Run migrations and optional demo seed](#6-run-migrations-and-optional-demo-seed)
7. [Optional — import drug interaction data](#7-optional--import-drug-interaction-data)
8. [Start the development servers](#8-start-the-development-servers)
9. [Demo accounts](#9-demo-accounts)
10. [Verification commands](#10-verification-commands)
11. [Troubleshooting](#11-troubleshooting)
12. [Architecture overview](#12-architecture-overview)
13. [Implemented workflows and permissions](#13-implemented-workflows-and-permissions)
14. [Deployment and upgrades](#14-deployment-and-upgrades)
15. [Current QA status and limits](#15-current-qa-status-and-limits)

---

## 1. Prerequisites

Install the following before you begin:

| Tool | Minimum version | Download |
|---|---|---|
| Node.js | 20.19+ or 22.12+; use Node 22 for the hosted API | https://nodejs.org |
| npm | 10 (bundled with Node 20) | — |
| XAMPP | 8.2 or newer | https://www.apachefriends.org/ |
| Git | any | https://git-scm.com |

Verify your versions:

```powershell
node --version   # 20.19+ or 22.12+
npm --version    # 10.x.x or newer
& "C:\xampp\mysql\bin\mysql.exe" --version
```

> XAMPP does not need to be added to PATH. The commands below use its full executable path.

---

## 2. Clone the repository

```powershell
git clone https://github.com/sudaraka-lakshitha/MediFlow.git
cd MediFlow
```

---

## 3. Create the XAMPP MySQL database

Open the XAMPP Control Panel and start **MySQL**, then run:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE mediflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'mediflow_user'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD'; GRANT ALL PRIVILEGES ON mediflow.* TO 'mediflow_user'@'localhost'; FLUSH PRIVILEGES;"
```

If the XAMPP root account has a password, add `-p` after `-u root` and enter it when prompted. Replace `YOUR_PASSWORD` with a strong local development password.

---

## 4. Configure the backend

### 4.1 Copy the environment file

```powershell
Copy-Item backend\.env.example backend\.env
```

### 4.2 Edit `backend\.env`

Open `backend\.env` in any text editor and update the following values:

```env
# ─── Database ────────────────────────────────────────────────────────────────
# Use the password assigned to mediflow_user in step 3.
# If your password contains @ : / or # — URL-encode those characters.
DATABASE_URL="mysql://mediflow_user:YOUR_PASSWORD@localhost:3306/mediflow"

# ─── Security ────────────────────────────────────────────────────────────────
# Replace with a random string of at least 32 characters. Keep this secret.
# Example generator: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=replace-with-at-least-32-random-characters

# ─── Application ─────────────────────────────────────────────────────────────
JWT_EXPIRES_IN=12h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ─── Logging ─────────────────────────────────────────────────────────────────
LOG_LEVEL=info

# ─── Timezone (Sri Lanka Standard Time = UTC+05:30) ──────────────────────────
# Change REPORT_TIMEZONE_OFFSET_MINUTES if your pharmacy is in a different timezone.
REPORT_TIMEZONE_OFFSET_MINUTES=330

# ─── Performance tuning ──────────────────────────────────────────────────────
# bcrypt work factor. 12 is the secure default; lower to 10 on shared/low-vCPU servers.
BCRYPT_ROUNDS=12

# ─── Experimental drug interaction model (optional) ──────────────────────────
EXPERIMENTAL_DDI_ENABLED=true
EXPERIMENTAL_DDI_THRESHOLD=0.85
```

### 4.3 Configure the frontend

```powershell
Copy-Item frontend\.env.example frontend\.env
```

For local development, keep `VITE_API_URL=http://localhost:5000/api`. The `/api` suffix is required. Frontend variables are included in the public bundle; database credentials, JWT secrets and mail credentials belong only in backend configuration.

### 4.4 Configure OTP password recovery (optional)

MediFlow sends password-reset OTP codes using SMTP. Configure the host, port and credentials supplied by your mail provider, and an authorized sender. For example, these settings use Gmail with an app password:

Add to `backend\.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your16charapppassword
MAIL_FROM=your-email@gmail.com
PASSWORD_RESET_OTP_MINUTES=10
PASSWORD_RESET_RESEND_SECONDS=60
```

> **Never commit `backend\.env`** to version control. It is already listed in `.gitignore`.

---

## 5. Install dependencies

Run from the project root to install the versions recorded in each lockfile:

```powershell
# Install backend dependencies (includes compression middleware added Oct 2026)
npm --prefix backend ci

# Install frontend dependencies
npm --prefix frontend ci
```

---

## 6. Run migrations and optional demo seed

From the project root:

```powershell
# Generate the Prisma client (must run after install)
npm --prefix backend run prisma:generate

# Apply all database migrations
npm --prefix backend run prisma:deploy
```

These commands are also required after pulling changes that add database fields. Restart the backend afterward. Do not reset an existing database to fix a missing-column error.

**Optional — disposable local demo data only:**

```powershell
npm --prefix backend run prisma:seed
```

The seed creates example staff/patient accounts, medicine and retail products, categories, suppliers and sample workflows. Do not run it against an existing pharmacy or hosted database. For a new Aiven installation, use the first-administrator setup in [Deployment and upgrades](#14-deployment-and-upgrades).

---

## 7. Optional — import drug interaction data

The repository includes the DDInter curated dataset for academic use. Run these after step 6 to load interaction pairs and train the optional neural research model:

```powershell
# Import curated DDInter interaction pairs
node backend/scripts/import-ddinter.js

# Train the experimental prediction model
node backend/ml/train.mjs
```

> **Notes:**
> - Curated DDInter pairs are used independently of the neural model.
> - The experimental model only emits predictions when `EXPERIMENTAL_DDI_ENABLED=true` and the model reaches the minimum AUC threshold (`EXPERIMENTAL_DDI_THRESHOLD`).
> - DDInter data is licensed CC BY-NC-SA 4.0. Review terms before redistribution or any commercial use.
> - A missing alert **never** proves a combination is safe.

---

## 8. Start the development servers

### Option A — one-click launcher (recommended)

Double-click **`start-mediflow.bat`** in the project root (or run it from a terminal). It will:

1. Check that Node.js, npm, and XAMPP MySQL are installed.
2. Start XAMPP MySQL if it isn't already running.
3. Start the API in its own window.
4. Start the frontend in its own window.
5. Open the app in your browser.

Each service is skipped automatically if it's already running, so it's safe to re-run at any time. Pass `--no-browser` to skip the automatic browser launch.

### Option B — manual (two separate PowerShell windows)

**Window 1 — API server:**

```powershell
npm run dev:api
```

**Window 2 — Frontend dev server:**

```powershell
npm run dev:web
```

Once both are running, open your browser:

| Service | URL |
|---|---|
| **Web application** | http://localhost:5173 |
| **API health check** | http://localhost:5000/health |
| **Swagger / OpenAPI UI** | http://localhost:5000/docs |
| **OpenAPI JSON** | http://localhost:5000/openapi.json |

---

## 9. Demo accounts

All demo accounts use the password **`Demo123!`**

| Role | Email | Access |
|---|---|---|
| **Admin** | `pharmacy.mediflow+admin@gmail.com` | Full system access |
| **Pharmacist** | `pharmacy.mediflow+pharmacist@gmail.com` | Prescriptions, inventory, dispensing, reports |
| **Cashier** | `pharmacy.mediflow+cashier@gmail.com` | Payments, retail billing, bank allocations and refund payouts; wider reconciliation requires a grant |
| **Patient** | `pharmacy.mediflow+patient@gmail.com` | Own uploads, prescriptions, invoices, refunds, deliveries and health record |

> **Security reminder:** Change all credentials and disable demo seeding before any real deployment.

---

## 10. Verification commands

Run automated checks from the project root:

```powershell
# Run backend unit tests
npm test

# Run frontend linter
npm run lint

# Build the production frontend bundle
npm run build

# Run all three checks together
npm run verify
```

Focused database checks are available for the **local `mediflow` database only**:

```powershell
Set-Location backend
node scripts/qa-audit-repairs.mjs --confirm-local
Set-Location ..
```

This script requires an existing local administrator. It creates temporary fixtures, exercises concurrent retries, bank allocations, refund approval, stale patient updates and delivery readiness, rolls back business records, and removes its exact retry-test keys. It deliberately refuses a remote database. Run it only against an authorized local development database. A recovered write-conflict message can appear during its concurrency check; the final `PASS` results establish whether recovery succeeded.

---

## 11. Troubleshooting

### XAMPP MySQL is not available

Open `C:\xampp\xampp-control.exe` and click **Start** next to MySQL. The default port is `3306`.

If XAMPP is installed outside `C:\xampp`, use the matching installation path in the setup commands.

### `ECONNREFUSED` on port 3306

XAMPP MySQL is not running. Start it from the XAMPP Control Panel.

If port 3306 is occupied, stop the conflicting database service or configure the same alternative port in XAMPP and `DATABASE_URL`.

### `P1001: Can't reach database server`

1. Verify `DATABASE_URL` in `backend\.env` — check the password and port.
2. Ensure the `mediflow` database was created (step 3).
3. Confirm XAMPP MySQL is running on port 3306.

### Port 5000 or 5173 already in use

Kill the process using the port:

```powershell
# Find process on port 5000
netstat -ano | findstr :5000
# Kill it (replace <PID> with the number shown)
taskkill /PID <PID> /F
```

### Prisma errors or missing columns after pulling changes

Apply pending migrations and regenerate the client from the project root, then restart the API:

```powershell
npm --prefix backend run prisma:deploy
npm --prefix backend run prisma:generate
```

### `Error: Cannot find module` in backend

Reinstall backend dependencies:

```powershell
npm --prefix backend install
```

### Frontend shows a blank page / network errors

1. Confirm the API is running: visit http://localhost:5000/health
2. Check `frontend\.env` (if present) — the API URL must match.
3. Open browser DevTools → Network tab to see failing requests.

### Login is slow on the hosted site

The hosted API runs on **Render.com free tier**, which spins the server down after 15 minutes of inactivity. The first request after a period of idle can take 30–60 seconds while the instance wakes. Once the server is warm, subsequent requests are fast.

To eliminate cold-start delays in your own hosted deployment:
- Set up a free keep-alive ping (e.g. [UptimeRobot](https://uptimerobot.com)) pointing at `https://<your-render-url>/health` on a 10-minute interval.
- Upgrade to a Render paid tier.

The frontend will display a **"Server is warming up"** message after 5 seconds of waiting, so users are informed rather than seeing a blank spinner.

### An action reports a missing retry key or stale version

Refresh to load the current frontend. Protected payment/stock writes require an `Idempotency-Key`; profile edits and workflow actions also check the saved version. Do not bypass these checks or repeatedly create new requests after an uncertain network result. Retry the original attempt or inspect the current record first.

### Sign-in security is temporarily unavailable

Check the backend database connection and ensure the authentication-limit migration has been applied. Authentication limits fail closed when their shared store cannot be checked. Do not disable them to hide a database error.

---

## 12. Architecture overview

```
MediFlow/
├── frontend/               React + TypeScript SPA (Vite)
│   └── src/
│       ├── api/            Axios client with JWT interceptors, idempotency keys
│       ├── auth/           Auth context, session guard, optimistic session UI
│       ├── components/     Shared UI components (Layout, DeliveryWorkspace, …)
│       ├── pages/          One lazy-loaded file per route/page
│       └── utils/          CSV parsing, helpers
│
├── backend/                Node.js + Express REST API
│   └── src/
│       ├── controllers/    HTTP handlers (thin layer)
│       ├── routes/         Express routers with validation
│       ├── services/       Business logic and transactions
│       ├── repositories/   Prisma query wrappers
│       ├── middleware/      Auth (parallelised), authorization, gzip compression
│       ├── validators/      Zod schemas
│       └── utils/          Error handling, async wrapper
│   └── prisma/
│       ├── schema.prisma   Database schema
│       ├── seed.js         Demo data seed script
│       └── migrations/     Versioned SQL migration files
│   └── ml/                 Experimental DDI neural model (optional)
│   └── scripts/            Data import utilities
│
└── package.json            Root scripts (dev:api, dev:web, verify)
```

### Hosted deployment topology

```
[Patient/Staff Browser]
       │  HTTPS
       ▼
[Vercel CDN] ──── /api/* rewrites ──▶ [Render.com API — Node/Express]
       │                                        │
  (static SPA,                        [Aiven MySQL — Prisma ORM]
   long-lived chunk cache)
```

### Key design decisions

- **Controllers** are intentionally thin — they only forward validated requests to services and return JSON.
- **Services** own all business rules, validations, and database transactions.
- **Prisma** uses parameterized queries throughout — no raw SQL string concatenation.
- **Authentication** combines revocable JWT sessions with shared database-backed login, registration and password-reset limits. Session lifecycle and workflow leases are enforced by the backend. User lookup and session validation run in parallel on every authenticated request to minimise latency.
- **Gzip compression** is applied to all API responses via the `compression` middleware, reducing payload sizes by 30–70%.
- **bcrypt work factor** is configurable per environment via `BCRYPT_ROUNDS` (default 12 locally, 10 on the free-tier hosted server).
- **Stock reservation cleanup** is debounced to at most once per 60 seconds per process instance to avoid a redundant DB query on every high-traffic request.
- **Dispensing** is executed in a serializable MySQL transaction with automatic conflict retry.
- **Retry protection** records high-impact operation results atomically with their payment/stock effects. Reusing the same actor/key and payload returns the original result; a different payload with that key is rejected.
- **Patient responses** use restricted serializers for draft directions, internal notes and refund/stock-review details.
- **Money calculations** allocate whole cents deterministically and preserve the amounts recorded in historical credits.
- **FIFO/FEFO** batch allocation is administrator-configurable from System Settings.
- **Route-level code splitting** (React lazy + Vite manual chunks for vendor/bootstrap/http) keeps the initial bundle small and vendor chunks long-lived in CDN cache.
- **Optimistic session UI** shows the workspace immediately on load with a slim verification banner, rather than a blocking modal, so cold-start latency does not produce a blank screen.

---

## 13. Implemented workflows and permissions

- Patient self-registration and staff-created accounts, with a self-service health record portal (profile, allergies/conditions, full prescription and dispensing history)
- JWT authentication with bcrypt password hashing and revocable sessions
- Role-based access: Admin, Pharmacist, Cashier, Patient (plus optional cashier-desk access for pharmacists)
- Drug research using RxNorm, PubChem, and openFDA public labels
- Online prescription submission for self or another recipient, with up to five attachments in one request and optional typed details. Before processing, the patient can add/remove individual attachments or replace the primary file; staff/patient workflow locks prevent simultaneous editing.
- "Estimate only" vs "process now" upload flows, with a patient-facing accept-estimate action
- Prescription recording, verification, rejection, editing, and dispensing
- Bill editing and customer acknowledgement/re-acknowledgement, with reasoned overrides where permitted. Paid, uncollected bills retain same-day staff cancellation restrictions and administrator escalation for restricted cases.
- Stock reservations with configured deadlines and per-prescription adjustments; dispensing/cancellation releases reservations through transactional stock checks.
- Batch inventory receipts, expiry tracking, adjustments, and a dedicated stock-movement audit view
- Cashier payment handoff with pickup PIN confirmation, minimal 58/80 mm verification slips, in-app document viewing and final invoice/receipt printing.
- Retail (non-prescription) sales through both the pharmacist counter and the cashier queue, with sale voiding
- Automatic discount rules (coupon, category, order-level)
- Bottle/container fee tracking through invoices and receipts
- CSV/PDF reports with sales trends, top medicines, and pharmacist activity; report and receipt PDFs visually reflect the record's actual status (paid/voided/cancelled/etc.)
- Audit logs with drill-down, CSV export, configurable retention/trash, and request ID tracing
- Bulk product create/update via CSV or Excel upload
- Omitted import fields preserve saved data; supported clear markers explicitly remove values. Delivery bulk updates use formatted Excel templates, CSV support and preview/confirmation.
- Home delivery for paid prescriptions, with a separate fee that must also be verified before dispatch, courier/tracking details, automatic dispatch timestamps, return handling and eligible reshipment. Patients can cancel a delivery request that has not yet been confirmed by the pharmacy. The standard delivery fee field is locked and requires an explicit Edit action before changes can be saved.
- Full/partial product refunds and separate payout records. Returned stock requires pharmacist/admin review before it can become saleable again. Delivery fees after dispatch require a separate authorized exception rather than automatic refund.
- Daily cash/bank/refund reconciliation, bank-reference summaries, and pharmacy-wide reconciliation access granted by an administrator to selected staff with cashier functions.
- Staff activity reports with task/date filters, and bounded search/history navigation on operational screens.

### Administrator refund approvals

Open **Cashier payments → Administrator refund approvals**, or the same section under **Sales & billing → Refunds & returned stock**.

1. Staff select a current paid, uncollected invoice, enter the customer-visible reason, optionally choose quantities, and preview before requesting approval.
2. A **different administrator** reviews the request. Approval is bound to the bill revision, amount, item selection and delivery state; a changed bill requires a new preview/request.
3. Approval creates a pending refund obligation. Staff with cashier access separately record the completed cash/bank/card payout and reference. The software does not transfer funds.

Collected sales use the normal returns/refunds workflow. Delivery-fee exceptions retain their separate staff permission and requester/reviewer separation. Administrator review notes remain in staff records rather than being appended to the customer-visible refund reason.

### Verified bank transfers and invoice allocations

Open **Cashier payments → Verified bank transfers & invoice allocations**. Administrators, cashiers and pharmacists with cashier access can record a statement-confirmed receipt and allocate its available balance to one or more prepared invoices for the same customer.

- Receipt identity includes destination bank account, reference and payment date. Conflicting repeat details are rejected.
- Allocation checks the current invoice revision, acknowledgement requirements and available funds. It pays the invoice and reserves stock; it does not dispense medicines.
- Refunds do not restore the original transfer's available balance. Legacy payment references remain protected against reuse.
- Bank details with payment history cannot be rewritten. Instructions and active status remain editable; at least one payment account must stay active.
- Daily invoice reconciliation records allocations. Unallocated receipts remain visible in the bank ledger and are **not included in the daily reconciliation totals**.

### API compatibility for custom clients

The normal web client supplies retry keys automatically. Custom clients must send a UUID v4 `Idempotency-Key` for POST requests to:

```text
/api/sales/retail
/api/sales/:id/pay
/api/payment-requests/retail
/api/inventory/batches
/api/inventory/batches/:id/adjust
/api/inventory/batches/:id/dispose-expired
```

Reuse the same key and payload when retrying an uncertain result. Use a new key for a genuinely new action. Patient/profile edits require the saved `expectedUpdatedAt`; upload edits use their existing `updatedAt` version. Workflow-protected endpoints also require the current workflow lease.

---

## 14. Deployment and upgrades

The repository supports a **Vercel frontend + Render backend + Aiven MySQL** arrangement. The following are application configuration requirements, not confirmation that a deployment has completed.

| Service | Repository directory | Build / start settings |
|---|---|---|
| Frontend | `frontend` | Install `npm ci`; build `npm run build`; output `dist` |
| Backend | `backend` | Build `npm ci --include=dev && npm run prisma:generate`; start `npm run prisma:deploy && npm start` |

Set the frontend's `VITE_API_URL` to the backend HTTPS address with `/api`. Set the backend's `FRONTEND_URL` to the actual frontend origin, and configure `NODE_ENV=production`, the database connection, a strong `JWT_SECRET`, and the mail provider settings. The backend reads the platform-provided `PORT`; SMTP uses the separate `SMTP_PORT` setting.

Use Aiven's CA certificate and strict TLS verification for the database connection. `AIVEN_PRISMA_URL` and `MYSQL_DATABASE_URL`, if set, take priority over `DATABASE_URL`; remove stale overrides rather than leaving competing destinations. Do not upload a local `.env` wholesale or expose backend secrets through Vercel frontend variables.

### Recommended hosted environment variables (Render)

In addition to the standard backend variables, set these in your Render dashboard:

| Variable | Recommended value | Reason |
|---|---|---|
| `BCRYPT_ROUNDS` | `10` | Reduces login latency on shared-vCPU free tier |
| `JWT_EXPIRES_IN` | `12h` | Session duration |
| `REPORT_TIMEZONE_OFFSET_MINUTES` | `330` | Sri Lanka Standard Time (UTC+05:30) |

### Keeping the free-tier server warm

Render's free tier spins the server down after 15 minutes of inactivity, causing 30–60 second cold starts on the next request. To prevent this, configure a free uptime monitor (e.g. [UptimeRobot](https://uptimerobot.com)) to ping your API health endpoint every **10 minutes**:

```
GET https://<your-render-url>/health
```

This keeps the instance alive at no cost and eliminates cold-start delays for users.

For the **first administrator on a new Aiven database**, apply migrations first, download the service CA certificate, and run this in an interactive local terminal:

```powershell
Set-Location backend
npm run setup:admin -- --certificate "C:\path\to\aiven-ca.pem"
```

Answer the database URL, email and password prompts inside the running script. The URL/password input is hidden. Existing administrator accounts are never replaced; use password recovery if one already exists. This helper targets Aiven and does not modify your local `.env`.

### Upgrading to the October 27 build

Release the frontend and backend together. The four additional migrations create the operation-receipt, shared authentication-limit, refund-approval and bank-transfer allocation tables:

```text
20261026010000_operation_receipts
20261026020000_shared_auth_limits
20261026030000_refund_approvals
20261026040000_bank_transfer_allocations
```

The configured backend start command applies pending migrations. Generate the Prisma client during the build, take the normal database backup before release, and verify `/health` plus sign-in afterward. **Do not reset or seed the hosted database.** Existing sessions may need the current frontend before using newly protected writes.

The October 27 performance update also adds the `compression` npm package to the backend. Run `npm --prefix backend install` (or `npm ci`) after pulling to install it.

---

## 15. Current QA status and limits

As checked on **27 October 2026**:

- **681 backend tests passed across 62 files**; frontend production build and Prisma schema validation passed.
- Lint completed with React warnings, so the codebase is not warning-free.
- Local MySQL integration checks passed for retry concurrency, bank allocations, refund approval, immutable bank history, stale patient edits, report query compatibility and delivery readiness. Business fixtures were rolled back.
- Initial report cents and repeated partial product refunds reconcile, including older recorded refund amounts.
- A full multi-role browser acceptance pass, physical printer/device checks, SMTP delivery, production deployment and production-volume load testing remain outside this verification.
- Secondary table filters/counts and delivery exports may apply to the current history page; the controls disclose that scope. All-history streamed exports and globally counted secondary filters are not implemented across every screen.

### Performance improvements (Oct 27, 2026)

The following changes were applied to address slowness on the hosted free-tier deployment:

| Area | Change |
|---|---|
| **Backend** | Added `compression` middleware — API responses are gzip-compressed (30–70% smaller) |
| **Backend** | `bcrypt` work factor now reads `BCRYPT_ROUNDS` env var; set to `10` on Render to halve login time |
| **Backend** | Auth middleware now runs user DB lookup and session validation in **parallel** (`Promise.all`) — saves one full DB round-trip per request |
| **Backend** | `cleanupExpiredCashReservations` debounced to at most once per 60 s — removes a DB query from every high-traffic request |
| **Backend** | Patient delivery cancel endpoint added (`DELETE /payment-requests/:id/delivery`) |
| **Frontend** | Axios timeout raised from 15 s to **30 s** — prevents false network errors during cold starts |
| **Frontend** | `SessionGuard` now shows the workspace immediately (optimistic UI); a slim animated banner replaces the blank screen during session validation |
| **Frontend** | After 5 s of waiting, the banner message changes to **"☕ The server is warming up…"** |
| **Frontend** | Navigation attention polling no longer re-subscribes on every route change |
| **Frontend** | Vite build now uses manual chunk splitting (React, Axios, Bootstrap in separate long-lived cache files) |
| **Frontend** | Delivery workspace refresh button shows a spinner; patients can cancel unconfirmed delivery requests |
| **Hosting** | `BCRYPT_ROUNDS=10` added to `render.yaml` |

See [the original audit](outputs/system-audit-2026-10-26.md) and [the repair status](outputs/system-repair-status-2026-10-27.md) for the detailed changes and remaining verification boundaries.

---

*MediFlow academic prototype · Not for clinical use.*
