# MediFlow — Pharmacy Management System

> **Academic prototype.** Not intended for clinical or production use. All interaction indicators, label data, and research results must be verified by a qualified pharmacist using authoritative clinical references before dispensing.

MediFlow is a full-stack pharmacy operations prototype built with **React + TypeScript** (frontend), **Node.js + Express** (backend), **Prisma ORM**, and **PostgreSQL**. It covers prescription dispensing, batch-level stock control, drug research, cashier payments, patient management, and administrative auditing.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone the repository](#2-clone-the-repository)
3. [Create the PostgreSQL database](#3-create-the-postgresql-database)
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
| PostgreSQL | 15 or newer | https://www.postgresql.org/download/ |
| Git | any | https://git-scm.com |

Verify your versions:

```powershell
node --version   # v20.x.x or newer
npm --version    # 10.x.x or newer
psql --version   # psql (PostgreSQL) 15.x or newer
```

> **Windows tip:** After installing PostgreSQL, add its `bin` directory to your system PATH (e.g. `C:\Program Files\PostgreSQL\17\bin`) so that `psql` is available in PowerShell.

---

## 2. Clone the repository

```powershell
git clone <your-repo-url> MediFlow
cd MediFlow
```

---

## 3. Create the PostgreSQL database

Open PowerShell and run the following. Replace `postgres` with your PostgreSQL superuser name if different:

```powershell
psql -U postgres -h localhost -c "CREATE DATABASE mediflow;"
```

You will be prompted for the PostgreSQL password you set during installation.

> **If `psql` is not found**, use the full path:
> ```powershell
> & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE mediflow;"
> ```

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
# Replace YOUR_PASSWORD with the PostgreSQL password you set during installation.
# If your password contains @ : / or # — URL-encode those characters.
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mediflow?schema=public"

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
npm --prefix backend run ddi:import

# Train the experimental prediction model
npm --prefix backend run ddi:train
```

> **Notes:**
> - Curated DDInter pairs are used independently of the neural model.
> - The experimental model only emits predictions when `EXPERIMENTAL_DDI_ENABLED=true` and the model reaches the minimum AUC threshold (`EXPERIMENTAL_DDI_THRESHOLD`).
> - DDInter data is licensed CC BY-NC-SA 4.0. Review terms before redistribution or any commercial use.
> - A missing alert **never** proves a combination is safe.

---

## 8. Start the development servers

You need **two separate PowerShell windows** running simultaneously.

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

### `psql` is not recognized

Add the PostgreSQL `bin` folder to your PATH:

1. Search for **"Edit the system environment variables"** in Windows.
2. Click **Environment Variables → Path → Edit → New**.
3. Add: `C:\Program Files\PostgreSQL\17\bin` (adjust version number as needed).
4. Restart PowerShell.

### `ECONNREFUSED` on port 5432

PostgreSQL service is not running. Start it:

```powershell
# Start PostgreSQL service (replace 'postgresql-x64-17' with your installed version)
Start-Service -Name "postgresql-x64-17"
```

Or open **Services** (`services.msc`) and start the PostgreSQL service manually.

### `P1001: Can't reach database server`

1. Verify `DATABASE_URL` in `backend\.env` — check the password and port.
2. Ensure the `mediflow` database was created (step 3).
3. Confirm PostgreSQL is running on port 5432.

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
- **Dispensing** is executed in a serializable PostgreSQL transaction with automatic conflict retry.
- **FIFO/FEFO** batch allocation is administrator-configurable from System Settings.
- **Route-level code splitting** (React lazy) keeps the initial bundle small.

---

## Implemented workflows

- Patient self-registration and staff-created accounts
- JWT authentication with bcrypt password hashing and revocable sessions
- Role-based access: Admin, Pharmacist, Cashier, Patient
- Drug research using RxNorm, PubChem, and openFDA public labels
- Prescription recording, verification, rejection, and dispensing
- Batch inventory receipts, expiry tracking, adjustments, and stock ledger
- Cashier payment handoff with pickup PIN confirmation
- Automatic discount rules (coupon, category, order-level)
- Bottle/container fee tracking through invoices and receipts
- CSV/PDF reports with sales trends, top medicines, and pharmacist activity
- Audit logs with drill-down, CSV export, and request ID tracing
- Bulk product create/update via CSV or Excel upload

---

*MediFlow academic prototype · Not for clinical use.*
