# MediFlow — Pharmacy Management System

> **Academic prototype.** Not intended for clinical or production use. All interaction indicators, label data, and research results must be verified by a qualified pharmacist using authoritative clinical references before dispensing.

MediFlow is a full-stack pharmacy operations prototype built with **React 19 + TypeScript** (Vite 8), **Node.js + Express 5**, **Prisma ORM 6**, and **MySQL**. It supports walk-in and uploaded prescriptions, retail billing, batch inventory, stock reservations, payments, returns and refunds, home delivery, daily reconciliation, staff activity reporting, and experimental drug-interaction research.

You can run MediFlow against a local XAMPP database, let another device on the same Wi-Fi use a computer running MediFlow, or deploy it publicly with a **Vercel** frontend, **Render** API and **Aiven** MySQL database. In all three setups, browsers use the API; they never connect directly to MySQL.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone the Repository](#2-clone-the-repository)
3. [Create the Local MySQL Database (XAMPP)](#3-create-the-local-mysql-database-xampp)
4. [Environment Configuration](#4-environment-configuration)
5. [Install Dependencies](#5-install-dependencies)
6. [Database Migrations and Demo Seed](#6-database-migrations-and-demo-seed)
7. [Drug Interaction Data & ML Model (Optional)](#7-drug-interaction-data--ml-model-optional)
8. [Start the Development Servers](#8-start-the-development-servers)
   - [Share the app over the same Wi-Fi network](#share-the-app-over-the-same-wi-fi-network)
9. [Demo Accounts & Test Credentials](#9-demo-accounts--test-credentials)
10. [Verification Commands & Test Suite](#10-verification-commands--test-suite)
11. [Architecture Overview & Codebase Structure](#11-architecture-overview--codebase-structure)
12. [Core Workflows & Features](#12-core-workflows--features)
13. [Security & Data Integrity Controls](#13-security--data-integrity-controls)
14. [Performance Optimizations & Latency Mitigations](#14-performance-optimizations--latency-mitigations)
15. [Hosted Deployment & Upgrade Guide](#15-hosted-deployment--upgrade-guide)
16. [Troubleshooting & Common Issues](#16-troubleshooting--common-issues)
17. [Current QA Status & Verification Boundaries](#17-current-qa-status--verification-boundaries)
18. [MediFlow Android Client App (v2.0)](#18-mediflow-android-client-app-v20)

---

## 1. Prerequisites

Ensure the following tools are installed before getting started:

| Tool | Minimum Version | Download Link |
|---|---|---|
| **Node.js** | `20.19+` or `22.12+` (Node 22 recommended) | https://nodejs.org |
| **npm** | `10.x` (bundled with Node) | — |
| **XAMPP** | `8.2+` (MariaDB / MySQL) | https://www.apachefriends.org |
| **Git** | Any modern version | https://git-scm.com |

Verify installed versions in PowerShell:

```powershell
node --version
npm --version
& "C:\xampp\mysql\bin\mysql.exe" --version
```

> **Note:** XAMPP does not need to be in your system `PATH`. The setup commands specify the full executable path.

---

## 2. Clone the Repository

```powershell
git clone https://github.com/sudaraka-lakshitha/MediFlow.git
cd MediFlow
```

### Quick first-time setup on Windows

After installing Node.js and XAMPP and cloning the repository, double-click **`setup-mediflow.bat`**. It starts XAMPP MySQL, creates a local `mediflow` database and restricted application user, generates local-only secrets in the ignored `backend/.env`, installs backend and frontend packages, applies migrations, and starts the app. It asks whether to load sample records only when the database has no tables; existing records are never reset or seeded by this setup. At the MySQL password prompt, press Enter for the standard XAMPP root account with no password, or type the root password if one was set.

This helper is for a local XAMPP database only. It stops if cloud database overrides are configured, to avoid applying local setup migrations to Aiven by mistake. It expects XAMPP in `C:\xampp`. If you want MediFlow to use the existing hosted Aiven data, follow the hosted configuration steps in [Hosted Deployment & Upgrade Guide](#15-hosted-deployment--upgrade-guide) instead of running the local setup helper.

---

## 3. Create the Local MySQL Database (XAMPP)

1. Open the **XAMPP Control Panel** and start **MySQL** (default port `3306`).
2. Run the following command in PowerShell to create the database and dedicated user:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE mediflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'mediflow_user'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD'; GRANT ALL PRIVILEGES ON mediflow.* TO 'mediflow_user'@'localhost'; FLUSH PRIVILEGES;"
```

> If your XAMPP root user has a password, add `-p` after `-u root` and enter it when prompted. Replace `YOUR_PASSWORD` with a strong local development password.

---

## 4. Environment Configuration

### 4.1 Backend Environment

Copy the example file to `.env`:

```powershell
Copy-Item backend\.env.example backend\.env
```

Edit `backend\.env` with your environment values:

```env
# ─── Database ────────────────────────────────────────────────────────────────
# Use the credentials created in Step 3. URL-encode special characters (@ : / #).
DATABASE_URL="mysql://mediflow_user:YOUR_PASSWORD@localhost:3306/mediflow"

# ─── Security ────────────────────────────────────────────────────────────────
# Minimum 32 random characters.
# Generate via: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=replace-with-at-least-32-random-characters

# ─── Application ─────────────────────────────────────────────────────────────
JWT_EXPIRES_IN=12h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ─── Logging ─────────────────────────────────────────────────────────────────
LOG_LEVEL=info

# ─── Timezone (Sri Lanka Standard Time = UTC+05:30) ──────────────────────────
REPORT_TIMEZONE_OFFSET_MINUTES=330

# ─── Performance Tuning ──────────────────────────────────────────────────────
# Work factor for bcrypt hashing (default 12; supported range 10–14).
BCRYPT_ROUNDS=12

```

### 4.2 Frontend Environment

Copy the example file to `.env`:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Keep `VITE_API_URL=/api`. The Vite development server forwards this relative path to the API, which works both on the host computer and for other devices using the LAN address. Avoid `http://localhost:5000/api` on a LAN: on another device, `localhost` means that device itself.

### 4.3 OTP Password Recovery (Optional)

MediFlow sends one-time password (OTP) verification codes via SMTP for self-service password resets. To enable this, add the following to `backend\.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
MAIL_FROM=your-email@gmail.com
PASSWORD_RESET_OTP_MINUTES=10
PASSWORD_RESET_RESEND_SECONDS=60
```

> **Security Warning:** Never commit `backend\.env` or `frontend\.env` to version control. Both are ignored in `.gitignore`.

---

## 5. Install Dependencies

Install pinned dependencies from project lockfiles:

```powershell
# Install backend packages (includes compression middleware)
npm --prefix backend ci

# Install frontend packages
npm --prefix frontend ci
```

---

## 6. Database Migrations and Demo Seed

Generate the Prisma client and apply versioned database migrations:

```powershell
# Generate Prisma Client
npm --prefix backend run prisma:generate

# Apply all database migrations
npm --prefix backend run prisma:deploy
```

### Generate and View the Liam ER Diagram

MediFlow's ER diagram is generated from `backend/prisma/schema.prisma`; this reads the project schema and does not connect to MySQL or include patient records or database credentials. From the project root, run:

```powershell
npm run erd:open
```

Open the local address printed by the server (port `5174`). To only regenerate the diagram, use `npm run erd:build`. The generated site is kept under the ignored `docs/erd/` folder and is not committed. Liam supports Prisma schemas directly; raw MySQL parsing is not required for this project. See the [Liam Prisma guide](https://liambx.com/docs/parser/supported-formats/prisma) and [CLI guide](https://liambx.com/docs/cli).

GitHub Actions also builds the diagram when `master` changes the Prisma schema. Download the `mediflow-liam-erd` artifact from that workflow run to view the static site. It is not automatically published as a public website.

### Optional — Load Demo Fixtures (Local Development Only)

To populate the database with realistic sample data (users, medicines, retail goods, batches, categories, suppliers, and sample prescriptions):

```powershell
npm --prefix backend run prisma:seed
```

> **Important:** Do **not** run `prisma:seed` against an existing production or hosted database. For new cloud deployments, use the interactive `setup:admin` script detailed in [Deployment and upgrades](#15-hosted-deployment--upgrade-guide).

### Optional — Add Workflow Demonstration Records to Aiven

For a dedicated demonstration database, `backend/scripts/seed-demo-prescription-workflows.mjs` adds fictional prescription-upload states, linked prescriptions, payment and delivery scenarios, returns, a partially dispensed order, an offline order, and the related stock reservations. The records are marked as demo data; payment entries are fictional and do not represent real money. This script changes database records and stock, so do not run it against a live pharmacy database.

The script refuses to run unless `AIVEN_PRISMA_URL` points to an Aiven `defaultdb`. Configure that variable locally in `backend/.env`, review the target host, then run from the repository root:

```powershell
npm --prefix backend run seed:demo-workflows
```

It creates or updates the demonstration pharmacist, cashier and patient accounts described in [Demo Accounts & Test Credentials](#9-demo-accounts--test-credentials). It does not create the administrator account; use `setup:admin` for that.

---

## 7. Experimental Drug Interaction Research Assets

The repository contains DDInter-derived research data and a plain JavaScript training script for an experimental collaborative-filtering model:

```powershell
# 1. Import curated DDInter interaction pairs into MySQL
node backend/scripts/import-ddinter.js

# 2. Train the experimental prediction model
node backend/ml/train.mjs
```

- These are research and demonstration assets. The live prescription verification workflow does not run an automated patient-specific drug interaction, allergy, or contraindication check.
- Do not interpret model output or missing alerts as evidence that a medicine combination is safe. Pharmacist review is required.

---

## 8. Start the Development Servers

### Option A — Start the app after setup

After `setup-mediflow.bat` has finished, or whenever you want to start the app again, double-click **`start-mediflow.bat`**. It reads the database connection already configured in `backend/.env`, starts the API at `127.0.0.1:5000`, starts the Vite website on port `5173`, and opens `http://localhost:5173`. It does not start or change MySQL. Keep both MediFlow console windows open while using the app. Close those windows to stop the servers.

The configured database can be local XAMPP or a hosted database such as Aiven. The setup helper creates a local XAMPP configuration; for Aiven, configure the backend connection yourself as described in [Hosted deployment](#15-hosted-deployment--upgrade-guide). Never copy hosted credentials into the frontend.

### Option B — First-time local XAMPP setup

Double-click **`setup-mediflow.bat`** once on a new computer. It checks Node.js and XAMPP, creates a local `mediflow` database and restricted application user, creates ignored local environment files, installs dependencies, generates Prisma Client, applies migrations, and asks whether to add demo accounts and sample stock to a fresh database. It then starts MediFlow. On a fresh demo database, the seeded administrator is `pharmacy.mediflow+admin@gmail.com` with password `Demo123!`; sign in and change it before sharing the computer. The demo seed also adds demo staff, patients, products and stock.

The helper will not reset an existing database. It stops if cloud database override variables are present. Review the messages before accepting the demo seed. Do not run the demo seed against real pharmacy data.

### Option C — Manual launch (two terminals)

**Terminal 1 — API Server:**
```powershell
npm run dev:api
```

**Terminal 2 — Frontend Dev Server:**
```powershell
npm run dev:web
```

### Share the app over the same Wi-Fi network

`start-mediflow.bat` is also the LAN launcher. The computer running it is the **host**; other computers and phones on the same trusted Wi-Fi open the host's website. They do not need Node.js, XAMPP or database credentials installed.

1. Complete local setup or configure `backend/.env` on the host. Start MediFlow with `start-mediflow.bat` and leave both server windows running.
2. On the host, open PowerShell and run `ipconfig`. Find the **IPv4 Address** under the Wi-Fi adapter currently in use (for example `192.168.1.25`). Do not use `127.0.0.1`, `localhost`, the router's gateway address, or an old address from another network.
3. On each device connected to the same Wi-Fi, open `http://HOST-IP:5173`, replacing `HOST-IP` with the host IPv4 address (for example `http://192.168.1.25:5173`). Bookmark this address if useful.
4. If Windows Firewall asks, allow Node.js only on the **Private network**. If prompted manually, allow inbound TCP port `5173` on the Private profile. Do not expose ports `5000` (API) or `3306` (MySQL) to Wi-Fi. The Vite server forwards `/api` calls to the API on the host computer.
5. If the host uses local XAMPP, the database stays on that host and other devices reach it only through MediFlow's API. If `backend/.env` points to Aiven, all devices use that same Aiven database through the host API. Keep the Aiven certificate on the host; never send database passwords to other devices.

This development LAN mode uses HTTP, so use it only on a trusted private network. Guest Wi-Fi, client isolation, VPNs, or a Windows network marked Public may block device-to-device traffic. The host's IP may change after reconnecting; reserve it in the router if a stable bookmark is needed. Do not forward these development ports from your router to the public internet. For public access, follow the HTTPS deployment guide in section 15.

### Service Endpoints

| Service | Address |
|---|---|
| **Web Application** | http://localhost:5173 |
| **API liveness check (host only)** | http://localhost:5000/health |
| **Database readiness check (host only)** | http://localhost:5000/ready |
| **Swagger / OpenAPI documentation (host only)** | http://localhost:5000/docs |
| **OpenAPI specification JSON (host only)** | http://localhost:5000/openapi.json |

---

## 9. Demo Accounts & Test Credentials

The local baseline fixtures (`npm --prefix backend run prisma:seed`) use **`Demo123!`**. The Aiven workflow demonstration seed uses **`Demo@123!`** for its own accounts; the two fixture sets have different account names and passwords.

| Role | Email | Access Scope |
|---|---|---|
| **Administrator** | `pharmacy.mediflow+admin@gmail.com` | Full system governance, staff management, audit trails, system settings, two-tier refund approvals, financial reconciliation |
| **Pharmacist** | `pharmacy.mediflow+pharmacist@gmail.com` | Prescription verification, clinical safety review, dispensing, batch inventory receipts & adjustments, reports |
| **Cashier** | `pharmacy.mediflow+cashier@gmail.com` | Point-of-sale retail checkout, payment collection, bank slip verification, bank statement ledger allocations, customer refund payouts |
| **Patient** | `pharmacy.mediflow+patient@gmail.com` | Prescription image uploads, estimate acceptance, order & delivery tracking, personal health record portal |

> Demo credentials are only visible on the login screen during local development (`DEV` mode). Change all credentials and disable demo seeding before any public deployment.

The Aiven workflow seed creates or updates `pharmacy.mediflow+demopharmacist@gmail.com`, `pharmacy.mediflow+democashier@gmail.com`, and patient accounts `pharmacy.mediflow+patient1@gmail.com` through `pharmacy.mediflow+patient7@gmail.com`, all using **`Demo@123!`**. It does not create an administrator; set up the admin separately with `setup:admin`.

---

## 10. Verification Commands & Test Suite

Run automated quality checks from the project root:

```powershell
# Run backend Vitest test suite
npm test

# Run frontend linter (oxlint)
npm run lint

# Build production frontend bundle with TypeScript type-checking (tsc -b && vite build)
npm run build

# Run all three verification checks sequentially
npm run verify
```

### Local Database Integration Audit

A specialized integration suite verifies retry protection, concurrent transactions, bank allocations, refund escalation, and delivery readiness against the **local `mediflow` database only**:

```powershell
Set-Location backend
node scripts/qa-audit-repairs.mjs --confirm-local
Set-Location ..
```

> This script safely creates and rolls back temporary test fixtures. It deliberately refuses execution against remote or production connection strings.

---

## 11. Architecture Overview & Codebase Structure

### System Architecture Diagram

```
[Patient / Staff Browser]
         │ HTTPS
         ▼
  [Vercel CDN Edge]
  ├── Static SPA Assets (HTML, CSS, JS manual chunks)
  └── /api/* Edge Rewrites
         │
         ▼
  [Render.com API Service — Node.js 22 + Express 5]
  ├── Gzip Compression Middleware
  ├── Parallel User & Revocable Session Authentication
  ├── Rate Limiting & Concurrent Workflow Leases
  ├── Business Services & Serializable Transactions
  └── PDFKit / ExcelJS Document Engines
         │
         ▼
  [Aiven Managed MySQL Database — Prisma ORM 6]
  ├── Parameterized Queries & Strict Foreign Keys
  ├── Operation Receipts & Idempotency Store
  └── High-Performance Indexed Lookups
```

### Codebase Organization

```
MediFlow/
├── frontend/                                React 19 + TypeScript SPA (Vite 8)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts                   Axios client with JWT, idempotency headers and longer limits on slow workflows
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx             Authentication provider, login/logout state, user session context
│   │   │   ├── SessionGuard.tsx            Optimistic session checking with non-blocking warming-up banner
│   │   │   └── sessionLock.css             Styles for session checking, modals, and cold-start alerts
│   │   ├── components/
│   │   │   ├── ActionsDropdown.tsx         Contextual action menu for table items
│   │   │   ├── BankTransferLedger.tsx      Statement receipt entry, balance allocation, and ledger management
│   │   │   ├── BulkProductModal.tsx        CSV/Excel bulk catalog import modal
│   │   │   ├── CashierBalanceReview.tsx    Cashier end-of-shift cash drawer balance review
│   │   │   ├── DailyBalance.tsx            Daily multi-register reconciliation dashboard
│   │   │   ├── DeliveryBulkModal.tsx       Excel/CSV bulk delivery tracking updates
│   │   │   ├── DeliveryWorkspace.tsx       Delivery queue filtering, courier dispatch, toggle-locked fee, patient cancel
│   │   │   ├── DocumentPreview.tsx         In-app PDF/image viewing modal
│   │   │   ├── FormAccessibilityBridge.tsx Keyboard accessibility and focus management
│   │   │   ├── Layout.tsx                  App navigation, top bar, notification polling, role badges
│   │   │   ├── MyActivityModal.tsx         Staff self-activity and audit log viewer
│   │   │   ├── PredictiveSearchInput.tsx   Debounced autocomplete input for drug/patient lookup
│   │   │   ├── RefundApprovalPanel.tsx     Two-tier administrator refund escalation interface
│   │   │   ├── RefundWorkspace.tsx         Product returns, item inspection, and customer payout recording
│   │   │   ├── SearchableSelect.tsx        Accessible search-and-select dropdown component
│   │   │   ├── StaffActivityReport.tsx     Granular staff action log with date/role filtering
│   │   │   └── WorkflowGuard.tsx           Active lock lease indicator to prevent concurrent record collisions
│   │   └── pages/
│   │       ├── AuditPage.tsx               Comprehensive audit trails with drill-down and CSV export
│   │       ├── CashierPage.tsx             Point-of-sale payment desk, PIN verification, 58/80mm slips
│   │       ├── CatalogPage.tsx             Drug & retail product master catalog, pricing, categories
│   │       ├── DashboardPage.tsx           Operational overview, stock warnings, pending prescription queues
│   │       ├── DataExportsPage.tsx         Structured system data export center
│   │       ├── DeliveriesPage.tsx          Home delivery management portal
│   │       ├── DiscountsPage.tsx           Promotional coupons, category discounts, and wholesale rules
│   │       ├── DrugResearchPage.tsx        Live clinical lookup via RxNorm, PubChem, openFDA, and DDI
│   │       ├── InventoryPage.tsx           Batch tracking, FEFO management, stock adjustments, disposals
│   │       ├── LoginPage.tsx               User sign-in with rate-limit protection and demo fill buttons
│   │       ├── PatientHealthRecordPage.tsx Self-service medical history, allergies, dispensing records
│   │       ├── PatientProfilePage.tsx      Patient contact details and chronic condition profiles
│   │       ├── PatientsPage.tsx            Staff registry for managing patient profiles
│   │       ├── PrescriptionUploadsPage.tsx Patient Rx image submissions, multi-file uploads, quote acceptance
│   │       ├── PrescriptionsPage.tsx       Clinical verification, dosage adjustments, interaction review, dispensing
│   │       ├── ReportsPage.tsx             Financial metrics, sales trends, stock movement, Excel/CSV/PDF export
│   │       ├── SalesPage.tsx               Retail billing POS, counter orders, barcode lookup, invoice printing
│   │       ├── SettingsPage.tsx            Global configuration, FEFO/FIFO strategy, tax/delivery fees
│   │       ├── StockMovementsPage.tsx      Immutable inventory audit log (receipts, sales, adjustments)
│   │       └── UsersPage.tsx               Staff identity management and role authorization
│   └── vite.config.ts                      Vite config with manual vendor chunk splitting
│
├── backend/                                Node.js + Express 5 REST API
│   ├── src/
│   │   ├── app.js                          Express application setup, gzip compression, security middleware
│   │   ├── controllers/                    Thin HTTP controllers forwarding to services
│   │   ├── middleware/
│   │   │   ├── authenticate.js             Parallel user lookup + revocable session inspection
│   │   │   ├── authorize.js                Role-based access control guard (ADMIN, PHARMACIST, CASHIER, PATIENT)
│   │   │   ├── sharedRateLimit.js          Database-backed IP and user account brute-force protection
│   │   │   └── validate.js                 Zod request schema validation middleware
│   │   ├── routes/                         Express route definitions
│   │   │   ├── auth.routes.js              Login, session inspection, logout, password recovery
│   │   │   ├── bankTransfer.routes.js      Bank receipt recording and invoice allocation endpoints
│   │   │   ├── catalog.routes.js           Product and category master catalog routes
│   │   │   ├── delivery.routes.js          Delivery queues, dispatch, patient cancellation, courier management
│   │   │   ├── discount.routes.js          Discount rules and promotional coupon validation
│   │   │   ├── drugInformation.routes.js   External clinical API integration routes (RxNorm, openFDA)
│   │   │   ├── inventory.routes.js         Batch receipt, stock adjustment, and disposal routes
│   │   │   ├── patient.routes.js           Patient profile and clinical history routes
│   │   │   ├── prescription.routes.js      Prescription recording, review, dispensing, and billing
│   │   │   ├── prescriptionUpload.routes.js Digital prescription uploads and quoting workflows
│   │   │   ├── reconciliation.routes.js    Cash register, bank receipt, and refund reconciliation
│   │   │   ├── refund.routes.js            Refund execution and payout recording
│   │   │   ├── refundApproval.routes.js    Two-tier administrator refund approval endpoints
│   │   │   ├── staffActivityReport.routes.js Staff operational audit trail routes
│   │   │   ├── user.routes.js              User administration and credential management
│   │   │   └── workflowLease.routes.js     Heartbeat-based workflow lease lock acquisition/release
│   │   └── services/                       Core business logic and transactional units
│   │       ├── auth.service.js             Password hashing, JWT generation, OTP validation
│   │       ├── bankTransfer.service.js     Bank ledger and invoice balance allocation engine
│   │       ├── delivery.service.js         Delivery lifecycle state machine and courier dispatch
│   │       ├── inventory.service.js        FEFO/FIFO batch allocation and stock adjustments
│   │       ├── navigationAttention.service.js Badge count aggregation for operational queues
│   │       ├── paymentRequest.service.js   Invoicing, split payments, receipts, and cash reservations
│   │       ├── prescription.service.js     Prescription verification, safety review, dispensing
│   │       ├── prescriptionUpload.service.js File attachment handling and quote generation
│   │       ├── reconciliation.service.js   Daily register settlement and accounting balances
│   │       ├── refund.service.js           Refund calculations and inventory return quarantine
│   │       ├── refundApproval.service.js   Two-tier administrator escalation workflow
│   │       └── session.service.js          Session tracking, token versioning, and idle logout
│   ├── prisma/
│   │   ├── schema.prisma                   Comprehensive MySQL relational database schema
│   │   ├── seed.js                         Demo data population script
│   │   └── migrations/                     Version-controlled SQL schema migrations
│   ├── ml/                                 Experimental JavaScript DDI research model
│   └── scripts/                            Administrative CLI utilities and data importers
│
├── android/                                Native Android Client App v2.0 (WebView, multi-tab, PDF & print)
│   ├── AndroidManifest.xml                 Application manifest & intent filters
│   ├── build.ps1                           PowerShell build & signing automation script
│   ├── README.md                           Android build, architecture & testing guide
│   └── src/com/mediflow/pharmacy/          Native Java sources (MainActivity, tab manager, PDF viewer)
│
├── data/
│   ├── demo/                               Demo product and stock workbooks plus CSV equivalents
│   └── catalogs/                           Source catalog extracts; review before importing
├── package.json                            Root monorepo scripts (`dev:api`, `dev:web`, `verify`)
└── start-mediflow.bat                      Automated local development environment launcher
```

---

## 12. Core Workflows & Features

### 1. Prescription Management & Dispensing
- **Patient upload**: One request may include up to five prescription attachments, typed instructions, patient/recipient details, and a request to prepare for collection or home delivery. Staff see new uploads in the workspace; patients can edit an upload only while it is still awaiting pharmacy review.
- **Pharmacy processing**: Staff review the source and enter the structured prescription, dose, frequency, duration, directions, and any requested retail items. Every upload option ends in one complete final invoice issued in a single step; no rough quote is sent for new uploads. The option only changes stock and delivery handling (see *Upload options* below).
- **Patient acknowledgement**: Before payment, the customer reviews and acknowledges the final invoice and selects a payment/collection option. If staff materially revise the bill, its acknowledgement is cleared so the customer can review the new version.
- **Clinical safety information**: The app stores patient-entered allergy and condition information and offers separate medicine research tools. Prescription processing does not automatically certify allergies, interactions, or a medicine's suitability. A pharmacist must check the source prescription and authoritative references before dispensing.
- **Stock reservation and dispensing**: Reservations depend on the upload option, payment method and order state. Administrators configure default holding periods; staff can adjust an individual hold. Availability does not mean stock is reserved, paid for, or dispensed. Paid quantities are dispensed with FEFO (First Expired, First Out) batch allocation inside a bounded database transaction.
- **Partial supply**: For a walk-in (counter) prescription the pharmacist may issue less than the remaining quantity, or leave a medicine off the bill, when stock is short or the customer wants less today; at least one prescribed medicine must be on the bill. For every medicine issued in part, the pharmacist records why (*not enough stock* or *customer asked for less*) and whether the rest will be issued later. If not, the shortfall is listed as *Not to be issued* and closed automatically when the bill is dispensed. Otherwise the rest stays pending, is not charged, and is billed later with *Bill Remaining* when the customer returns and stock is available. The bill, receipt and final invoice show it under *Balance to collect later*; the cashier sees it in the payment window, and the patient sees it on the invoice in Sales & billing. If the customer will not return, *Close remaining balance* records the rest as not supplied with a reason and closes the prescription. Uploaded orders are always billed in full. Dispensed, cancelled, not-supplied and still-pending quantities are tracked separately. Supplying a remaining quantity requires a new bill and payment; cancelled quantities are not silently re-added to the current bill.

### 2. Point of Sale & Retail Billing
- **Counter Sales**: Fast barcode and predictive search for retail goods, over-the-counter medications, and toiletries.
- **Pricing & Discounts**: Configurable promotional coupon codes, customer group discounts, and bottle/container recycling deposits.
- **Pickup Verification**: Collection verification slips show the customer, reference and PIN; final invoices and medicine directions are separate documents. Documents can be viewed inside the application.
- **Receipt Printing**: Thermal 58mm/80mm receipt printing and full A4 PDF invoice generation with payment status watermarks.

### 3. Cashier Desk & Payment Verification
- **Payment methods**: Cash, card, bank transfer slip upload, and statement-verified bank allocations are recorded through pharmacy/cashier workflows. MediFlow does not itself charge a bank card or initiate an online payment-gateway transaction.
- **Payment verification**: The customer can upload a transfer slip; an authorized cashier checks the credited amount and reference before marking the invoice paid. A pending slip cannot be collected again as cash until it is resolved.
- **Pickup**: The cashier records payment and issues a one-time receipt PIN when configured. Pharmacy staff verify the PIN and dispense against the paid quantities; a cashier can dispense at payment only when an administrator enables that permission.
- **Verified Bank Allocations**: Allows cashiers to record direct bank statement receipts and allocate available funds across multiple pending invoices for the same patient.
- **End-of-Day Reconciliation**: Cash drawer counts, card settlements, bank transfer allocations, and refund payouts reconcile against system totals with automated variance tracking.

### 4. Home Delivery Logistics
- **Delivery Queues**: Staff record processing, dispatch, delivery, failure, return and reshipment actions. “Ready to dispatch” is a filtered queue, not a separate persisted status. Patients can see courier details, tracking references and dispatch dates.
- **Payment Before Dispatch**: Both medicines and delivery fees must be fully paid and verified. For a home-delivery upload, the delivery-fee bill is issued together with the medicine bill when a standard delivery fee is configured; otherwise staff issue it from Home deliveries, before or after the medicine bill is paid. A delivery requested after the medicine invoice was paid uses a separate delivery-fee balance.
- **Delivery fees by bank transfer only**: The customer acknowledges the delivery-fee bill, transfers the fee and uploads the receipt; the cashier verifies it or allocates a matching bank-statement receipt. Cash, card and split payments are refused for delivery-fee bills. A fee bill is issued only when an active pharmacy bank account exists.
- **Counter handover**: A cashier cannot record a counter handover for an active home-delivery order; its medicines are dispensed at dispatch.
- **No collection PIN for home delivery**: Paying a home-delivery order or its delivery-fee bill issues no collection PIN, and a PIN issued before delivery was requested is withdrawn. If staff cancel the delivery so the customer collects at the counter, a collection PIN is issued then and appears on the customer's receipt.
- **Courier Integration**: Assignment of couriers, tracking numbers, and automatic dispatch timestamps.
- **Patient self-cancellation**: Before the medicine invoice is paid or a bank-transfer slip is submitted, a patient may choose delivery-only cancellation or request cancellation of the whole order; the latter requires a reason. After payment or slip submission, the self-service choice is hidden and pharmacy staff review the delivery, cancellation and any refund.
- **Protected Fee Configuration**: The standard delivery fee setting is toggle-locked to prevent accidental modifications during navigation.
- **Bulk Excel/CSV Operations**: Import and export delivery status updates using standardized Excel templates. When no deliveries are selected, the formatted template downloads instantly from static CDN assets; when deliveries are selected, the template is pre-populated with those specific delivery records for editing and re-upload.

### 5. Returns, Refunds & Administrator Escalation
- **Stock Quarantine**: Returned medicines enter an isolated quarantine review state and require pharmacist inspection before being restocked or destroyed.
- **Two-Tier Administrator Refund Approval**: Uncollected, paid prescription cancellations require approval from an administrator other than the requester before payout can proceed.
- **Delivery Fee Exception Handling**: Delivery charges are normally excluded from returned-item refunds. Exceptional delivery-fee refunds require authorized staff approval with reasons; approved reshipment of a returned parcel can proceed without charging another delivery fee.

### End-to-end customer order paths

#### Upload options

| Patient's choice | Final bill | Stock hold | Delivery |
|---|---|---|---|
| Prepare in advance for collection | Issued in one step after pharmacist review | Held as soon as the bill is issued, for the bill's hold period (administrator default), whichever payment method is chosen; renewed on acknowledgement if it has expired | None |
| Prepare for home delivery | Same | Same as above | Delivery request created with the bill; delivery-fee bill issued with it when a standard fee and an active bank account are configured. The fee is payable by bank transfer only |
| Send me the complete bill to review first | Same | Nothing held until the bill is paid, even if cash is chosen | None |

Walk-in prescriptions and retail requests keep the earlier rule: stock is held only when the customer acknowledges the bill and chooses cash.

1. **Upload and prepare**: Patient submits one or more files and asks the pharmacy to prepare medicines. A pharmacist reviews the original, records the full medicine directions and quantities, adds any requested retail goods, and issues the final invoice. The stock is held from that moment. If it cannot be held, the bill is not issued and the pharmacist must adjust the quantities or receive stock.
2. **Bill to review first**: The pharmacist issues the same complete final invoice. The patient acknowledges and pays it, or declines it, which sends a cancellation request to the pharmacy. Older uploads that already hold a rough quotation can still finish the legacy quote flow.
3. **Pay and collect**: Patient reviews and acknowledges the final bill, then pays at the pharmacy or uses the listed bank-transfer process. Cashiers record cash/card payments or verify transfers/slips. When required, the pharmacist checks the receipt PIN before dispensing.
4. **Pay and deliver**: Patient requests delivery and provides recipient/contact/address details. The medicine bill must already be paid. Any separate delivery-fee bill must also be paid and verified before dispatch. Staff record the courier and tracking number; dispatch time is recorded when staff mark it dispatched.
5. **Cancel, return or refund**: Before payment or transfer-slip submission, customers can choose delivery-only or entire-order cancellation; a whole-order request needs a reason. After payment or slip submission, pharmacy staff handle cancellation and any refund review. Returned medicines are quarantined for pharmacist review before any possible restocking. A delivery fee is ordinarily non-refundable; an authorized exception must include a reason. A returned parcel may be approved for reshipment without another delivery fee.
6. **Retail sale**: Cashier creates a counter sale, checks applicable stock and price, records payment, and produces the receipt. Retail returns/refunds follow authorization and stock-review controls appropriate to the item.

### 6. Clinical Research & Experimental AI
- **Multi-Source Drug Information**: Unified search querying RxNorm, PubChem, and openFDA public drug labels.
- **Experimental DDI research model**: A plain JavaScript training artifact. It is not called by live prescription verification and must not be used to infer clinical safety.

### 7. Administration, Audit Control & Error Diagnostics
- **Comprehensive Activity Trails**: Immutable audit logging for every significant staff and patient event (logins, dispensing, bill edits, stock adjustments, file previews).
- **In-App Error Code Reference Guide**: Built-in interactive HTTP status code dictionary under the **Error code guide** tab (`/audit`), cataloging all 14 response codes with clinical MediFlow scenarios and resolution steps.
- **Clickable HTTP Status Badges**: Audit logs display clickable HTTP status badges (e.g. `HTTP 400`, `HTTP 409`) on failed requests that link directly to the relevant error documentation.
- **Quick-Filter Pills**: Application error log includes one-click filter buttons (`400`, `401`, `403`, `404`, `409`, `423`, `429`, `500`) to quickly isolate specific error classes during incident investigations.
- **Recoverable Audit Trash**: Configurable 30-day retention trash bin for audit logs with granular restore controls.

### 8. Batch Inventory, Bulk Updates & Liquid Dose Dispensing
- **Bulk Excel (.xlsx) & CSV Stock Updates**: Upload wholesale receipts and stock counts, validate the proposed changes, then explicitly confirm. Writes commit in small transactions; the whole file is not one atomic transaction.
- **Direct Excel (.xlsx) Product Catalogue Ingestion**: Upload complete product databases directly in Microsoft Excel (`.xlsx`) or CSV UTF-8 without manual format conversions.
- **Liquid Medicines & Syrups (`unit: ml`)**: Built-in volume calculation engine that respects exact clinical milliliters (`dose * frequency * days`) and 3-decimal stock tracking (`Decimal(12, 3)`), distinguishing liquid volume dispensing from sealed retail bottles (`unit: bottle`).
- **Demonstration Datasets**: Use [MediFlow_Demo_Products.xlsx](data/demo/MediFlow_Demo_Products.xlsx) and [MediFlow_Demo_Stock.xlsx](data/demo/MediFlow_Demo_Stock.xlsx), or their CSV equivalents in [data/demo](data/demo). They contain 389 product rows and 397 stock rows. Import products first, then stock. Review supplier names and expiry dates before uploading. RECEIVE rows add stock; do not re-import them to correct existing counts.

### 9. Reports, Exports & Bulk Editing

Reports support formatted Excel, CSV and PDF where offered, including period summaries, custom profitability reports, monthly stock movement and staff activity. Administrative extracts also offer Excel and CSV. These reporting files are not full database backups and should not be uploaded as transaction history.

For editable records, start from the relevant **Export for update** or import template:

| Workflow | Upload limits | How to use it |
|---|---|---|
| Products | Excel or CSV; follow the modal's file/row limits | Download the product template for new records, or export existing products for update. |
| Stock | Up to 500 data rows; Excel 2 MB or CSV 1 MB | RECEIVE adds incoming stock, ADJUST applies a signed difference, SET_COUNT records the physical total. |
| Deliveries | Up to 200 update rows; Excel 1 MB or CSV 500 KB | Keep invoice and version columns. Use DISPATCH, DELIVERED, UPDATE_TRACKING or UPDATE_DETAILS. Blank actions leave rows unchanged. |
| Master data | Up to 1,000 records; Excel or CSV 2 MB | Administrators can update existing categories, manufacturers, suppliers and patient details. Preserve identifiers and recordVersion. |

1. Filter and export the records to edit, or download the matching template.
2. Keep the headers, identifiers and version columns unchanged. Edit data cells, not formulas.
3. For product, stock and master-data optional fields, blank or omitted fields preserve saved values. Use `[CLEAR]` only for fields that permit clearing; required values cannot be cleared. Delivery recipient and tracking fields have their own validation and cannot be cleared this way.
4. Upload the Excel or CSV file, review errors and before/after changes, then confirm.
5. Re-export stale records before editing again. If a request times out, check the saved records and stock movements before starting a new upload; a timeout does not prove that nothing was saved.

Each chunk commits separately. If a later chunk fails, earlier chunks may already be saved. Retrying a partial stock RECEIPT with a new preview can add stock again. Review the actual results first; full-file rollback and resumable background imports are not provided by the chunking helper.

---

## 13. Security & Data Integrity Controls

- **Retry Protection**: Prescription dispensing, cashier payment, retail handover, selected stock operations and other protected mutations use idempotency keys and operation receipts. A retry of a completed protected action returns its stored result rather than applying the stock or payment effect again. This does not make an interrupted, multi-chunk import atomic or automatically resumable.
- **Optimistic Locking & Workflow Leases**: Prevents concurrent editing collisions when multiple pharmacists inspect or edit the same prescription simultaneously using `X-Workflow-Lease` tokens.
- **Revocable JWT Sessions**: Tokens include a server-tracked session version and generation number. Password resets or administrative lockouts invalidate active sessions across all devices immediately.
- **Shared Brute-Force Rate Limiting**: Centralized database rate limiter protecting against distributed brute-force attempts on login, registration, and OTP verification endpoints.
- **Restricted Patient Serialization**: Strict response serializers scrub internal clinical notes, supplier costs, and staff audit metadata before returning payloads to patient accounts.
- **Financial Validation**: Money validators, decimal database fields and calculation helpers control monetary precision and reject invalid amounts.

Session inactivity can be configured from 15 to 120 minutes; defaults are 30 minutes for staff and 60 for patients, followed by a one-minute warning window. The server caps a session at eight hours or the JWT expiry, whichever is sooner. A manually locked session can be unlocked with the password; an expired or revoked session requires sign-in. Changing `JWT_EXPIRES_IN` to `12h` does not override the eight-hour cap. Closing a tab is not a substitute for explicit logout on a shared device because browsers can restore tabs.

---

## 14. Performance Optimizations & Latency Mitigations

Bulk stock, delivery and master-data operations use batched reads and 15-row transaction chunks. This reduces database round trips and limits how long locks are held; it does not guarantee a particular upload duration.

| Workflow | Database work | Transaction timeout | Client request timeout |
|---|---|---|---|
| Stock | Fetch batches together; insert stock movements together per chunk | 35 seconds per chunk | 120 seconds for preview and confirmation |
| Delivery | Fetch deliveries together; acquire and pin only the current chunk's workflow leases; release them before the next chunk | 35 seconds per chunk | 120 seconds for preview and confirmation |
| Master data | Fetch records together, including alphanumeric patient numbers; insert audit logs together per chunk | 35 seconds per chunk | 130 seconds for preview and confirmation |
| Products | Resolve related records in batches and batch audit inserts; 15-row chunks | 45 seconds per transaction | 120–130 seconds depending on the request |

Version checks, payment/readiness validation and reservation checks still apply. Unit-test adapters without batch methods use individual-query fallbacks; a missing record in a real batch lookup does not trigger another query for every row.

Other optimizations include compressed API responses, split frontend bundles, debounced searches, reduced navigation polling, and loading-stage feedback. Stock, delivery and master-data imports show a spinner and the current stage without invented percentages. Product imports show confirmed row counts only after the server acknowledges each batch. Hosted speed depends on database distance, load and API cold starts. Increasing Axios timeouts does not extend a hosting provider's proxy timeout. Very large or consistently slow imports need smaller files or a future background-job workflow.

Interactive database transactions use a 15-second default window (10 seconds to acquire a connection); inventory dispensing, cashier dispense-at-payment and delivery dispatch use a bounded 30-second window. Transactions that save prescription attachments or bank-slip files use a bounded 25-second window. The browser allows up to 60 seconds for uploads, prescription billing and payment/dispense actions. These limits address slow hosted MySQL round-trips, including Prisma's 5-second default timeout, but cannot prevent an Aiven outage, network interruption, or Render/Vercel proxy timeout. Dispense and cashier-payment actions now use durable idempotency receipts: after a lost response, retry the same action to retrieve the saved result without repeating stock/payment effects. If a screen still shows an error, refresh and confirm the invoice/prescription state before starting a different operation.

Keep `BCRYPT_ROUNDS=12` as the default. The supported range is 10–14; changing it is a security/performance trade-off, not a guaranteed fix for slow sign-in. Existing password hashes retain their original work factor until replaced.

---

## 15. Hosted Deployment & Upgrade Guide

The production topology separates concerns across specialized cloud providers:
- **Frontend**: Hosted on **Vercel** as a static Single Page Application with edge `/api/*` proxy rewrites.
- **Backend API**: Hosted on **Render.com** (Docker / Node.js 22 web service).
- **Database**: Hosted on **Aiven** (Managed MySQL 8 with SSL/TLS encryption).

### A. Create the Aiven MySQL Database

1. Create the MySQL service and copy its host, port, database and credentials.
2. Download its CA certificate. Keep it outside version control.
3. In Render, add the certificate as a secret file named `aiven-ca.pem`, available at `/etc/secrets/aiven-ca.pem`.
4. Set the Prisma connection URL, URL-encoding special characters in the username/password:

```env
DATABASE_URL=mysql://USER:ENCODED_PASSWORD@HOST:PORT/defaultdb?sslcert=/etc/secrets/aiven-ca.pem&sslaccept=strict
```

This project uses Prisma 6's `sslcert` and `sslaccept` options, not the MySQL CLI's `ssl-mode` option. See the [Prisma MySQL connector documentation](https://docs.prisma.io/docs/orm/v6/overview/databases/mysql). Remove stale `AIVEN_PRISMA_URL` and `MYSQL_DATABASE_URL` variables unless intentionally used: they take precedence over `DATABASE_URL` in this project.

Keep a secure copy of the Aiven URL and CA certificate for the one-time administrator setup below. Do not put either in the frontend project, GitHub, or this README.

### B. Deploy the API on Render

Create a Node web service from this repository and configure:

| Setting | Value |
|---|---|
| Branch | `master` |
| Root directory | `backend` |
| Build command | `npm ci --include=dev && npm run prisma:generate` |
| Start command | `npm run prisma:deploy && npm start` |
| Health check | `/ready` (checks that the API can reach MySQL) |

Set these backend environment variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `22` |
| `DATABASE_URL` | Aiven URL with the CA certificate options above |
| `JWT_SECRET` | A unique, randomly generated secret of at least 32 characters |
| `JWT_EXPIRES_IN` | `12h` (server session cap remains eight hours) |
| `BCRYPT_ROUNDS` | `12` |
| `FRONTEND_URL` | Your actual Vercel URL, updated after frontend deployment |
| `REPORT_TIMEZONE_OFFSET_MINUTES` | `330` for Sri Lanka |

Generate the JWT secret locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`. Store it in Render, not in frontend variables or the repository. Render supplies `PORT`; do not set it to the SMTP port.

The root `render.yaml` is an alternative combined frontend/backend configuration with different commands and defaults. For the split Vercel + Render deployment, use the settings above rather than importing that blueprint unchanged.

### C. Deploy the Frontend on Vercel

1. Import this repository as a single **frontend** project with root directory `frontend` and the Vite preset.
2. Use install command `npm ci`, build command `npm run build`, and output directory `dist`.
3. Set `VITE_API_URL=/api` for the same-origin proxy.
4. Update the `/api/:path*` destination in `frontend/vercel.json` if your Render hostname differs from the checked-in demo hostname.
5. Deploy, then set Render's `FRONTEND_URL` to the resulting HTTPS website address and redeploy the API.

Database credentials, JWT secrets and SMTP passwords belong only on the backend. Frontend environment values are public build-time configuration.

### D. Configure Email and Check Startup

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` and `MAIL_FROM` using your mail provider's SMTP settings. Use an SMTP key/app password and a verified sender. The Gmail example in section 4 is for networks that permit its SMTP ports.

Render Free blocks outbound ports 25, 465 and 587. It also spins down idle services, so cold starts can exceed ordinary request timeouts. Check [Render's current free-service limitations](https://render.com/docs/free) before choosing email transport and hosting. Monitoring is useful for availability checks but does not guarantee an always-on service. An email HTTP API would require an application integration; entering its key as `SMTP_PASS` is not sufficient.

After deployment, check `/health` for API process liveness and `/ready` for database readiness, then check sign-in, password-recovery email delivery and a small sample upload. The Render blueprint uses `/ready`. The API root `/` may return 404; that alone is not a failed deployment.

### E. Create the first administrator on Aiven

Do this only **after Render has applied all database migrations successfully**. Run the script from the checked-out project on a computer that can reach Aiven. It connects directly over TLS to the exact Aiven URL you enter, and it does not write the URL or password to `.env`.

```powershell
Set-Location "C:\path\to\MediFlow"
npm --prefix backend ci --include=dev
npm --prefix backend run prisma:generate
npm --prefix backend run setup:admin
```

At the prompts:

1. Paste the **Aiven `DATABASE_URL`** (the same database URL used by Render). Input is hidden. Do not paste it into chat, a document, or a screenshot.
2. Paste the downloaded Aiven CA certificate file path. A path with spaces can be pasted in quotes, for example `"C:\Users\Your Name\Documents\aiven-ca.pem"`. Alternatively, pass it on the command line: `npm --prefix backend run setup:admin -- --certificate "C:\path\to\aiven-ca.pem"`.
3. Enter the administrator email, then enter and repeat a new password. Password input is hidden; use at least 16 characters and a unique password.

The script checks the certificate, uses TLS verification, and refuses to replace an administrator if one already exists. It creates the admin with a forced password change. Once it reports success, open the Vercel website, sign in using that email and password, and choose a new password when prompted. If it says an administrator already exists, use that account or the password recovery process; do not delete users to rerun bootstrap.

For **local demo only**, the fresh local seed creates a demo admin with `Demo123!` along with demo records. Change it before sharing the app. `setup:admin` is deliberately for Aiven URLs; the demo seed is not a safe bootstrap method for a real or hosted pharmacy database.

### Upgrading an Existing Deployment

Back up the database first. Push the approved `master` commit and let Render deploy the API. Its start command (`npm run prisma:deploy && npm start`) applies pending migrations before starting the API. Then let Vercel build the frontend from the same commit. Confirm Render `/ready`, Vercel loads, sign-in works, and a small non-financial workflow succeeds. Never use `prisma migrate reset` on hosted data, and do not run either demo seed against a real pharmacy database; the workflow demo seed is only for a dedicated demonstration database. For local XAMPP after a schema change, run `npm --prefix backend run prisma:deploy` and `npm --prefix backend run prisma:generate` from PowerShell, pointing at the intended database.

---

## 16. Troubleshooting & Common Issues

### MySQL Connection Refused (`ECONNREFUSED :3306`)
- Ensure the MySQL service is started in the XAMPP Control Panel.
- If running MySQL on a non-default port, update `DATABASE_URL` in `backend\.env` to match.

### Database Unreachable (`PrismaClientInitializationError: P1001`)
- Verify your database user credentials in `backend\.env`.
- Ensure special characters in passwords (e.g., `@`, `:`, `/`, `#`) are properly URL-encoded.
- Confirm the `mediflow` database has been created in MySQL.

### Port Already in Use (`EADDRINUSE :5000` or `:5173`)
Find and terminate the process holding the port in PowerShell:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Missing Columns or Prisma Errors After Pulling Changes
Regenerate the Prisma client and execute pending schema migrations:
```powershell
npm --prefix backend run prisma:deploy
npm --prefix backend run prisma:generate
```

### Slow Login on the Hosted Demo
- A stopped API instance must start before it can answer sign-in requests. The warming-up banner does not mean authentication has succeeded.
- Check the API health endpoint and Render logs. Aiven latency, password hashing and database load also affect sign-in; no fixed response time is guaranteed.

### Bulk Upload Times Out
- Current stock/delivery preview and confirmation requests allow 120 seconds; master-data requests allow 130 seconds. Redeploy the frontend and API together to receive the matching changes.
- Check whether the response is an Axios timeout, a hosting gateway timeout, a transaction timeout or a validation conflict. They require different remedies.
- Review the records already saved before uploading again. Separate transaction chunks can commit before the request fails. Re-export and process only remaining changes; do not blindly re-upload RECEIVE quantities.
- Reduce the file size if the hosted connection remains slow. The test suite verifies behavior and query batching, not the speed of your live cloud database.

### HTTP Status & Error Codes Reference (Audit Logs Cheat Sheet)

The following status codes appear in MediFlow's audit logs (`/audit`), application error files, and browser Network tab:

| HTTP Code | Status Name | Category | Common MediFlow Triggers | Recommended Resolution |
|---|---|---|---|---|
| **`400`** | Bad Request | Client (4xx) | Zod schema validation failed (invalid phone number, missing required fields, non-conforming regex); missing `Idempotency-Key`; cash tendered amount mismatch; non-zero/negative/fractional stock quantity. | Check form inputs. In DevTools Network tab $\rightarrow$ Response, inspect `details.fieldErrors` for the exact field that failed. |
| **`401`** | Unauthorized | Client (4xx) | Missing Bearer token; expired JWT session; password reset/change incremented `tokenVersion` (invalidating all sessions); invalid login credentials. | Sign in again at `/login`. If password was reset, use new credentials. |
| **`402`** | Payment Required | Client (4xx) | Attempting to dispense medicines for an unpaid prescription; attempting to dispatch a delivery before the delivery fee invoice (`DEL-...`) is paid. | Have the cashier record payment, verify the bank transfer slip, or allocate bank receipts first. |
| **`403`** | Forbidden | Client (4xx) | Role unauthorized (e.g. Cashier dispensing medicines; Patient viewing inventory); non-admin approving refunds; staff without reconciliation grant. | Switch to an account with appropriate permissions (Admin/Pharmacist) or grant access in User Management. |
| **`404`** | Not Found | Client (4xx) | Target record ID (prescription, product, batch, delivery, user) does not exist in MySQL (`P2025`); item was deleted before dispensing; invalid route. | Refresh the workspace to pull current records. Check whether the record was cancelled or deleted. |
| **`409`** | Conflict | Client (4xx) | Duplicate email/batch/invoice (`P2002`); deleting product with sales history (`P2003`); stale record version (`expectedUpdatedAt` mismatch); insufficient usable stock; prescription already dispensed; collection PIN mismatch; idempotency hash collision. | Refresh the record to fetch the latest revision. For unique key collisions, choose an alternative identifier. For stock shortages, review batches. |
| **`410`** | Gone | Client (4xx) | Password-reset OTP expired (10-minute window); prescription quotation reached acceptance deadline. | Request a new OTP or have the pharmacist re-quote. |
| **`413`** | Payload Too Large | Client (4xx) | Upload or export exceeds its size limit. Delivery updates allow up to 200 data rows, Excel 1 MB or CSV 500 KB; validation errors may also use 400. | Reduce the file size and follow the limits shown in the relevant upload dialog. |
| **`423`** | Locked | Client (4xx) | Workspace explicitly locked (`SESSION_LOCKED`). Expired sessions use 401; competing workflow edits generally use 409. | Use the password unlock prompt for a locked session. Sign in again if it has expired. |
| **`429`** | Too Many Requests | Client (4xx) | Brute-force rate limiter triggered on login or OTP attempts from same IP or account. | Wait for the cooldown window (1–15 minutes) before retrying. |
| **`500`** | Internal Server Error | Server (5xx) | Unhandled database disconnect, unexpected Prisma exception, or PDFKit generation failure. | Check server logs on Render or local terminal using the `requestId` from the error modal. |
| **`502`** | Bad Gateway | Gateway | External clinical APIs (openFDA, RxNorm, PubChem) unreachable; Render proxy error during container restart. | Retry after a few moments. Use local DDInter database if external APIs are down. |
| **`503`** | Service Unavailable | Gateway | MySQL database connection pool exhausted or instance undergoing maintenance; rate-limit store unreachable. | Check database health in Aiven console. Wait 30 seconds and retry. |
| **`504`** | Gateway Timeout | Gateway | API startup or request processing took longer than the hosting proxy allows. | Check API logs and health. For imports, inspect saved results before retrying; raising the browser timeout cannot change the proxy limit. |

---

## 17. Current QA Status & Verification Boundaries

Historical automated verification, on **4 November 2026** for the pre-commit working tree:

- **Backend suite:** 739 tests passed across 66 files. These include unit and HTTP-boundary tests; most workflow tests use mocked database dependencies.
- **Frontend:** `tsc -b && vite build` passed. The lint command exits successfully but reports non-blocking React warnings that still need review.
- **Database:** Prisma client generation passed; migration `20261104000000_remaining_direction_snapshots` was applied to Aiven, migration status is up to date, and a read-only check confirmed all four new direction columns.
- **Not verified in that review:** the final hosted Render/Vercel deployment, Android device behavior, Aiven load performance, physical printers/scanners and production email delivery.

Checks run for the **19 November 2026** working-tree revision:

- **Frontend production build:** `npm --prefix frontend run build` passed, including the TypeScript project build.
- **Backend JavaScript syntax:** `node --check` passed for all 13 changed backend JavaScript files.
- **Windows setup script syntax:** PowerShell parser check passed for `scripts/setup-local.ps1`.
- **Patch whitespace:** `git diff --check` passed with CRLF-aware checking.
- **Test suites:** not run for this revision.

The transaction timeout, retry-protection, cancellation-policy and LAN/API URL changes have not been checked against the hosted database or from a second Wi-Fi device. The 4 November backend test results above are historical and do not cover this revision.

The Windows first-time setup script has passed syntax parsing, but has not yet been run on a clean Windows/XAMPP computer.

These results do not certify every business workflow or a maximum hosted upload time. Review the hosted deployment after pushing, especially its `/ready` health check and required environment variables. HTTP-boundary tests need access to temporary local test-server ports.

---

## 18. MediFlow Android Client App (v2.0)

MediFlow includes a dedicated, lightweight Android client app in the `android/` directory that wraps the platform in an optimized, app-owned WebView environment:

### Key Android Features:
- **Embedded App WebView**: Runs `https://mediflow-pharmacy.vercel.app/` in a clean, full-screen WebView without browser address bar clutter or navigation distractions.
- **Multi-Tab Workspace Switcher**: Native navigation drawer and switcher supporting up to **6 concurrent tabs** for simultaneous prescription reviewing, inventory checking, and billing.
- **Private Document & PDF Viewer**: In-app PDF viewer with page controls, zoom, and direct Android `PrintManager` integration (`PdfPrintAdapter`) for printing thermal receipts and A4 invoices.
- **Document Management**: Save prescriptions, receipts, and clinical reports to local Android storage via the Android Storage Access Framework (`ACTION_CREATE_DOCUMENT`).
- **View Mode Toggle**: Quickly switch between **Mobile View** and **Desktop View** (1280-pixel wide layout with pinch-to-zoom) via the App actions menu (⋮). The preference is persisted across app sessions.
- **Prescription Camera & Upload Chooser**: Native Android file picker integration for uploading prescription photos and bank transfer slips from the camera or gallery.
- **Sandbox Security**: Runs strictly against `mediflow-pharmacy.vercel.app`. Native bridge channel is protected against external origins. Only `INTERNET` permission is requested.

### Building the Android APK:
The build process uses the included PowerShell build script [build.ps1](android/build.ps1) with standard Android Build Tools:

```powershell
cd android
./build.ps1 -BuildTools "C:\Users\<user>\AppData\Local\Android\Sdk\build-tools\36.0.0" `
            -AndroidJar "C:\Users\<user>\AppData\Local\Android\Sdk\platforms\android-36\android.jar" `
            -JavaBin "C:\Program Files\Java\jdk-21\bin"
```

Output: `android/build/MediFlow.apk` (signed, zipalign-verified, and installable on Android 6.0+ devices).

---

*MediFlow Pharmacy Management System · Academic Prototype · Not for Clinical Use.*
