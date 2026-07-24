# MediFlow — Pharmacy Management System

> **Academic prototype.** Not intended for clinical or production use. All interaction indicators, label data, and research results must be verified by a qualified pharmacist using authoritative clinical references before dispensing.

MediFlow is a full-stack pharmacy operations prototype built with **React + TypeScript** (frontend), **Node.js + Express** (backend), **Prisma ORM**, and **MySQL/MariaDB through XAMPP**. It covers prescription dispensing, batch-level stock control, drug research, cashier payments, patient management, and administrative auditing.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone the repository](#2-clone-the-repository)
3. [Create the XAMPP MySQL database](#3-create-the-xampp-mysql-database)
4. [Configure the backend](#4-configure-the-backend)
5. [Install dependencies](#5-install-dependencies)
6. [Run migrations and seed demo data](#6-run-migrations-and-seed-demo-data)
7. [Optional — import drug interaction data](#7-optional--import-drug-interaction-data)
8. [Start the development servers](#8-start-the-development-servers)
9. [Demo accounts](#9-demo-accounts)
10. [Verification commands](#10-verification-commands)
11. [Troubleshooting](#11-troubleshooting)
12. [Architecture overview](#12-architecture-overview)

---

## 1. Prerequisites

Install the following before you begin:

| Tool | Minimum version | Download |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org |
| npm | 10 (bundled with Node 20) | — |
| XAMPP | 8.2 or newer | https://www.apachefriends.org/ |
| Git | any | https://git-scm.com |

Verify your versions:

```powershell
node --version   # v20.x.x or newer
npm --version    # 10.x.x or newer
& "C:\xampp\mysql\bin\mysql.exe" --version
```

> XAMPP does not need to be added to PATH. The commands below use its full executable path.

---

## 2. Clone the repository

```powershell
git clone <your-repo-url> MediFlow
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

# ─── Experimental drug interaction model (optional) ──────────────────────────
EXPERIMENTAL_DDI_ENABLED=true
EXPERIMENTAL_DDI_THRESHOLD=0.85
```

### 4.3 Configure Gmail OTP password recovery (optional)

MediFlow can send password-reset OTP codes by email. To enable this:

1. Enable **2-Step Verification** on a Google account.
2. Go to **Google Account → Security → App passwords**.
3. Create an app password (select "Mail" and "Windows Computer").
4. Copy the 16-character code (spaces are automatically removed).

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

Run this once from the project root to install both frontend and backend packages:

```powershell
# Install root-level scripts tooling
npm install

# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

---

## 6. Run migrations and seed demo data

From the project root:

```powershell
# Generate the Prisma client (must run after install)
npm --prefix backend run prisma:generate

# Apply all database migrations
npm --prefix backend run prisma:deploy

# Seed demo products, categories, manufacturers, and accounts
npm --prefix backend run prisma:seed
```

**What the seed creates:**

| Data | Count |
|---|---|
| Medicine products (solid) | 40 |
| Medicine products (liquid) | 20 |
| Retail items | 20 |
| Demo patients | 9 |
| Demo staff + admin | 3 |
| Categories | 15 |
| Manufacturer | 1 |
| Supplier | 1 |

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
| **Cashier** | `pharmacy.mediflow+cashier@gmail.com` | Payment queue only |
| **Patient** | `pharmacy.mediflow+patient@gmail.com` | Own prescriptions and sales |

> **Security reminder:** Change all credentials and disable demo seeding before any real deployment.

---

## 10. Verification commands

Run all acceptance checks from the project root:

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

### Prisma client errors after pulling changes

Regenerate the client whenever the schema changes:

```powershell
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

### Reset the database to a clean state

This wipes **all data** and re-runs migrations + seed:

```powershell
npx --prefix backend prisma migrate reset --force
```

---

## 12. Architecture overview

```
MediFlow/
├── frontend/               React + TypeScript SPA (Vite)
│   └── src/
│       ├── api/            Axios client with JWT interceptors
│       ├── auth/           Auth context, session management
│       ├── components/     Shared UI components
│       ├── pages/          One file per route/page
│       └── utils/          CSV parsing, helpers
│
├── backend/                Node.js + Express REST API
│   └── src/
│       ├── controllers/    HTTP handlers (thin layer)
│       ├── routes/         Express routers with validation
│       ├── services/       Business logic and transactions
│       ├── repositories/   Prisma query wrappers
│       ├── middleware/      Auth, authorization, validation
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

### Key design decisions

- **Controllers** are intentionally thin — they only forward validated requests to services and return JSON.
- **Services** own all business rules, validations, and database transactions.
- **Prisma** uses parameterized queries throughout — no raw SQL string concatenation.
- **JWT sessions** are revocable: the backend checks a `sessionVersion` field on every authenticated request.
- **Dispensing** is executed in a serializable MySQL transaction with automatic conflict retry.
- **FIFO/FEFO** batch allocation is administrator-configurable from System Settings.
- **Route-level code splitting** (React lazy) keeps the initial bundle small.

---

## Implemented workflows

- Patient self-registration and staff-created accounts, with a self-service health record portal (profile, allergies/conditions, full prescription and dispensing history)
- JWT authentication with bcrypt password hashing and revocable sessions
- Role-based access: Admin, Pharmacist, Cashier, Patient (plus optional cashier-desk access for pharmacists)
- Drug research using RxNorm, PubChem, and openFDA public labels
- Online prescription submission (image, PDF, and/or typed text together) for self or a third-party recipient, with age-based suitability checks
- "Estimate only" vs "process now" upload flows, with a patient-facing accept-estimate action
- Prescription recording, verification, rejection, editing, and dispensing
- Cashier bill editing while awaiting payment, and same-day (or admin any-time) revoke of a paid bill with a mandatory reason
- Stock reservation at payment time — paid items are held against a bill until dispensed or released on cancellation, preventing overselling
- Batch inventory receipts, expiry tracking, adjustments, and a dedicated stock-movement audit view
- Cashier payment handoff with pickup PIN confirmation
- Retail (non-prescription) sales through both the pharmacist counter and the cashier queue, with sale voiding
- Automatic discount rules (coupon, category, order-level)
- Bottle/container fee tracking through invoices and receipts
- CSV/PDF reports with sales trends, top medicines, and pharmacist activity; report and receipt PDFs visually reflect the record's actual status (paid/voided/cancelled/etc.)
- Audit logs with drill-down, CSV export, configurable retention/trash, and request ID tracing
- Bulk product create/update via CSV or Excel upload

---

*MediFlow academic prototype · Not for clinical use.*
