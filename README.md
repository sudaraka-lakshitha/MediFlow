# MediFlow — Pharmacy Management System

> **Academic prototype.** Not intended for clinical or production use. All interaction indicators, label data, and research results must be verified by a qualified pharmacist using authoritative clinical references before dispensing.

MediFlow is a full-stack, enterprise-grade pharmacy operations platform prototype built with **React 19 + TypeScript** (Vite 8), **Node.js + Express 5**, **Prisma ORM 6**, and **MySQL**. It provides end-to-end workflows for outpatient pharmacies: walk-in and digital prescription handling, point-of-sale retail billing, FEFO/FIFO batch inventory management, stock reservations, serializable dispensing transactions, multi-method payment verification (cash, card, bank-transfer slips, statement-verified ledger allocations), home delivery logistics with courier tracking and patient self-cancellation, two-tier administrator refund escalation, audit logging, daily cashier reconciliation, staff activity tracking, and experimental drug-drug interaction research (curated DDInter dataset + neural classifier).

Local development runs against local MySQL / MariaDB (via XAMPP); hosted deployments separate the **Vercel** static CDN frontend, **Render.com** API service, and **Aiven** managed MySQL database.

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
9. [Demo Accounts & Test Credentials](#9-demo-accounts--test-credentials)
10. [Verification Commands & Test Suite](#10-verification-commands--test-suite)
11. [Architecture Overview & Codebase Structure](#11-architecture-overview--codebase-structure)
12. [Core Workflows & Features](#12-core-workflows--features)
13. [Security & Data Integrity Guarantees](#13-security--data-integrity-guarantees)
14. [Performance Optimizations & Latency Mitigations](#14-performance-optimizations--latency-mitigations)
15. [Hosted Deployment & Upgrade Guide](#15-hosted-deployment--upgrade-guide)
16. [Troubleshooting & Common Issues](#16-troubleshooting--common-issues)
17. [Current QA Status & Verification Boundaries](#17-current-qa-status--verification-boundaries)

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
# Work factor for bcrypt hashing (12 for local/prod; 10 on shared/low-vCPU hosts).
BCRYPT_ROUNDS=12

# ─── Experimental Drug Interaction Model (Optional) ─────────────────────────
EXPERIMENTAL_DDI_ENABLED=true
EXPERIMENTAL_DDI_THRESHOLD=0.85
```

### 4.2 Frontend Environment

Copy the example file to `.env`:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Ensure `VITE_API_URL` is set to `http://localhost:5000/api` (the `/api` suffix is mandatory).

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

### Optional — Load Demo Fixtures (Local Development Only)

To populate the database with realistic sample data (users, medicines, retail goods, batches, categories, suppliers, and sample prescriptions):

```powershell
npm --prefix backend run prisma:seed
```

> **Important:** Do **not** run `prisma:seed` against an existing production or hosted database. For new cloud deployments, use the interactive `setup:admin` script detailed in [Deployment and upgrades](#15-hosted-deployment--upgrade-guide).

---

## 7. Drug Interaction Data & ML Model (Optional)

The repository includes curated drug-drug interaction pairs from the **DDInter** academic dataset and a TensorFlow.js neural network classifier:

```powershell
# 1. Import curated DDInter interaction pairs into MySQL
node backend/scripts/import-ddinter.js

# 2. Train the experimental prediction model
node backend/ml/train.mjs
```

- Curated DDInter pairs operate independently of the machine learning model.
- The neural classifier only emits predictions when `EXPERIMENTAL_DDI_ENABLED=true` and the model achieves the minimum AUC threshold configured in `EXPERIMENTAL_DDI_THRESHOLD`.
- Missing interaction alerts **never** confirm drug safety. All combinations require pharmacist clinical review.

---

## 8. Start the Development Servers

### Option A — One-Click Launcher (Recommended)

Double-click **`start-mediflow.bat`** in the project root. The script will:
1. Validate that Node.js, npm, and XAMPP MySQL are ready.
2. Start XAMPP MySQL automatically if it is not running.
3. Spawn the API server in its own console window (`PORT 5000`).
4. Spawn the Vite frontend dev server in its own console window (`PORT 5173`).
5. Open the web application in your default browser.

Pass `--no-browser` to skip opening the browser tab.

### Option B — Manual Launch (Two Terminals)

**Terminal 1 — API Server:**
```powershell
npm run dev:api
```

**Terminal 2 — Frontend Dev Server:**
```powershell
npm run dev:web
```

### Service Endpoints

| Service | Address |
|---|---|
| **Web Application** | http://localhost:5173 |
| **API Health Check** | http://localhost:5000/health |
| **Swagger / OpenAPI Documentation** | http://localhost:5000/docs |
| **OpenAPI Specification JSON** | http://localhost:5000/openapi.json |

---

## 9. Demo Accounts & Test Credentials

All demo seed accounts use the default password: **`Demo123!`**

| Role | Email | Access Scope |
|---|---|---|
| **Administrator** | `pharmacy.mediflow+admin@gmail.com` | Full system governance, staff management, audit trails, system settings, two-tier refund approvals, financial reconciliation |
| **Pharmacist** | `pharmacy.mediflow+pharmacist@gmail.com` | Prescription verification, clinical safety review, dispensing, batch inventory receipts & adjustments, reports |
| **Cashier** | `pharmacy.mediflow+cashier@gmail.com` | Point-of-sale retail checkout, payment collection, bank slip verification, bank statement ledger allocations, customer refund payouts |
| **Patient** | `pharmacy.mediflow+patient@gmail.com` | Prescription image uploads, estimate acceptance, order & delivery tracking, personal health record portal |

> Demo credentials are only visible on the login screen during local development (`DEV` mode). Change all credentials and disable demo seeding before any public deployment.

---

## 10. Verification Commands & Test Suite

Run automated quality checks from the project root:

```powershell
# Run backend Vitest test suite (681 tests across 62 test files)
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
│   │   │   └── client.ts                   Axios instance with 30s timeout, JWT bearer interceptor, idempotency headers
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
│   │       ├── ReportsPage.tsx             Financial metrics, sales trends, stock movement, PDF export
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
│   ├── ml/                                 Experimental DDI neural classifier (TensorFlow.js)
│   └── scripts/                            Administrative CLI utilities and data importers
│
├── package.json                            Root monorepo scripts (`dev:api`, `dev:web`, `verify`)
└── start-mediflow.bat                      Automated local development environment launcher
```

---

## 12. Core Workflows & Features

### 1. Prescription Management & Dispensing
- **Walk-in & Digital Prescriptions**: Prescriptions can be created directly by pharmacists or submitted digitally by patients as multi-page image attachments.
- **Clinical Safety Checks**: Automatic lookup of drug-drug interactions, patient allergies, and duplicate therapies against the curated DDInter dataset and live clinical APIs.
- **Stock Reservation**: Approved prescriptions automatically reserve batch stock with configurable expiry windows to prevent inventory exhaustion before payment.
- **Dispensing Transactions**: Executed within serializable MySQL transactions with automatic conflict retries, enforcing FEFO (First Expired, First Out) batch selection.

### 2. Point of Sale & Retail Billing
- **Counter Sales**: Fast barcode and predictive search for retail goods, over-the-counter medications, and toiletries.
- **Pricing & Discounts**: Configurable promotional coupon codes, customer group discounts, and bottle/container recycling deposits.
- **Pickup Verification**: Dispensed prescriptions generate a secure pickup PIN required at checkout to ensure orders reach the rightful patient.
- **Receipt Printing**: Thermal 58mm/80mm receipt printing and full A4 PDF invoice generation with payment status watermarks.

### 3. Cashier Desk & Payment Verification
- **Payment Methods**: Cash, credit/debit card, bank transfer slip upload, and statement-verified ledger allocations.
- **Slip Verification**: Patients can upload bank transfer receipts; cashiers cross-reference and verify before marking orders as paid.
- **Verified Bank Allocations**: Allows cashiers to record direct bank statement receipts and allocate available funds across multiple pending invoices for the same patient.
- **End-of-Day Reconciliation**: Cash drawer counts, card settlements, bank transfer allocations, and refund payouts reconcile against system totals with automated variance tracking.

### 4. Home Delivery Logistics
- **Delivery Queues**: Automated status progression across `REQUESTED`, `READY`, `DISPATCHED`, `DELIVERED`, `DELIVERY_FAILED`, `RETURNING`, `RETURNED`, and `CANCELLED`.
- **Courier Integration**: Assignment of couriers, tracking numbers, and automatic dispatch timestamps.
- **Patient Self-Cancellation**: Patients can directly cancel unconfirmed delivery requests without pharmacy intervention.
- **Protected Fee Configuration**: The standard delivery fee setting is toggle-locked to prevent accidental modifications during navigation.
- **Bulk Excel/CSV Operations**: Import and export delivery status updates using standardized Excel templates. When no deliveries are selected, the formatted template downloads instantly from static CDN assets; when deliveries are selected, the template is pre-populated with those specific delivery records for editing and re-upload.

### 5. Returns, Refunds & Administrator Escalation
- **Stock Quarantine**: Returned medicines enter an isolated quarantine review state and require pharmacist inspection before being restocked or destroyed.
- **Two-Tier Administrator Refund Approval**: Uncollected, paid prescription cancellations require approval from an administrator other than the requester before payout can proceed.
- **Delivery Fee Exception Handling**: Dedicated review workflow for refunding delivery fees on returned or cancelled shipments.

### 6. Clinical Research & Experimental AI
- **Multi-Source Drug Information**: Unified search querying RxNorm, PubChem, and openFDA public drug labels.
- **Experimental Neural DDI Classifier**: Optional TensorFlow.js neural network trained on drug molecular feature vectors to estimate interaction likelihoods when curated pairs are unavailable.

### 7. Administration, Audit Control & Error Diagnostics
- **Comprehensive Activity Trails**: Immutable audit logging for every significant staff and patient event (logins, dispensing, bill edits, stock adjustments, file previews).
- **In-App Error Code Reference Guide**: Built-in interactive HTTP status code dictionary under the **Error code guide** tab (`/audit`), cataloging all 14 response codes with clinical MediFlow scenarios and resolution steps.
- **Clickable HTTP Status Badges**: Audit logs display clickable HTTP status badges (e.g. `HTTP 400`, `HTTP 409`) on failed requests that link directly to the relevant error documentation.
- **Quick-Filter Pills**: Application error log includes one-click filter buttons (`400`, `401`, `403`, `404`, `409`, `423`, `429`, `500`) to quickly isolate specific error classes during incident investigations.
- **Recoverable Audit Trash**: Configurable 30-day retention trash bin for audit logs with granular restore controls.

### 8. Batch Inventory, Bulk Updates & Liquid Dose Dispensing
- **Bulk Excel (.xlsx) & CSV Stock Updates**: Direct upload of wholesale batches and stocktaking audit counts with interactive pre-flight validation, before/after diff visualizer, and atomic transaction execution.
- **Direct Excel (.xlsx) Product Catalogue Ingestion**: Upload complete product databases directly in Microsoft Excel (`.xlsx`) or CSV UTF-8 without manual format conversions.
- **Liquid Medicines & Syrups (`unit: ml`)**: Built-in volume calculation engine that respects exact clinical milliliters (`dose * frequency * days`) and 3-decimal stock tracking (`Decimal(12, 3)`), distinguishing liquid volume dispensing from sealed retail bottles (`unit: bottle`).
- **Master Formulary Datasets**: Pre-built Excel workbooks (`mediflow_master_products_upload.xlsx` and `mediflow_master_stock_upload.xlsx`) populated with 349 crawled & curated medicines, pediatric syrups, and healthcare supplies.

---

## 13. Security & Data Integrity Guarantees

- **Idempotency Protection**: All high-impact financial and inventory mutations require a client-generated UUID v4 `Idempotency-Key`. Replaying the same key and payload returns the original cached response without re-executing writes.
- **Optimistic Locking & Workflow Leases**: Prevents concurrent editing collisions when multiple pharmacists inspect or edit the same prescription simultaneously using `X-Workflow-Lease` tokens.
- **Revocable JWT Sessions**: Tokens include a server-tracked session version and generation number. Password resets or administrative lockouts invalidate active sessions across all devices immediately.
- **Shared Brute-Force Rate Limiting**: Centralized database rate limiter protecting against distributed brute-force attempts on login, registration, and OTP verification endpoints.
- **Restricted Patient Serialization**: Strict response serializers scrub internal clinical notes, supplier costs, and staff audit metadata before returning payloads to patient accounts.
- **Cents-Accurate Financial Mathematics**: All currency arithmetic avoids floating-point rounding errors by performing calculations in integer cents.

---

## 14. Performance Optimizations & Latency Mitigations

The system incorporates several architecture enhancements to maintain responsive performance, particularly on shared-vCPU cloud hosting tiers (e.g. Render free tier):

| Component | Optimization | Real-World Impact |
|---|---|---|
| **API Compression** | Added Express `compression()` middleware | **30%–70% reduction** in API JSON payload sizes over the wire |
| **Password Hashing** | Configurable `BCRYPT_ROUNDS` (set to `10` in cloud environments) | Halves login and registration CPU latency on shared vCPUs |
| **Authentication Middleware** | Parallelized user DB lookup and session validation via `Promise.all` | Eliminates **1 complete database round-trip** on every authenticated request |
| **Reservation Cleanup** | Debounced `cleanupExpiredCashReservations()` to run at most once per 60 seconds | Removes a redundant database write from every catalog, inventory, and prescription API request |
| **Axios HTTP Client** | Extended client timeout from 15s to **30s** | Prevents premature network aborts during initial cloud server cold starts |
| **Session UI Guard** | Optimistic session rendering with an in-place warming-up banner | Workspace renders immediately using cached tokens; displays a **"☕ Server warming up"** notice after 5s instead of a blank screen |
| **Navigation Polling** | Uncoupled attention badge polling from route path changes | Stops bursts of redundant API calls during fast screen navigation |
| **Vite Bundle Splitting** | Custom `manualChunks` function for React, Axios, and Bootstrap packages | Optimizes vendor caching; returning users download only modified application code |
| **Delivery Management** | Dedicated button loading state and patient request cancellation | Eliminates double-submit race conditions and unnecessary staff support requests |
| **Static Template Serving** | Blank Excel delivery template served directly from static CDN assets | Zero server latency, bypasses backend API entirely when exporting templates |
| **Blob Error Decoding** | Added text extraction for failed binary/blob responses in Axios | Unmasks raw status codes to display meaningful clinical error messages in UI |

---

## 15. Hosted Deployment & Upgrade Guide

The production topology separates concerns across specialized cloud providers:
- **Frontend**: Hosted on **Vercel** as a static Single Page Application with edge `/api/*` proxy rewrites.
- **Backend API**: Hosted on **Render.com** (Docker / Node.js 22 web service).
- **Database**: Hosted on **Aiven** (Managed MySQL 8 with SSL/TLS encryption).

### Recommended Hosted Environment Variables (Render)

| Variable | Recommended Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Enables production caching and disables development logging |
| `DATABASE_URL` | `mysql://user:pass@host:port/defaultdb?ssl-mode=REQUIRED` | Secure connection to Aiven MySQL |
| `BCRYPT_ROUNDS` | `10` | Optimal security/performance balance for shared cloud vCPUs |
| `JWT_EXPIRES_IN` | `12h` | Session validity window |
| `REPORT_TIMEZONE_OFFSET_MINUTES` | `330` | Sets reporting timezone to Sri Lanka Standard Time (UTC+05:30) |

### Cloud Server Keep-Warm Strategy

On free-tier hosting (such as Render.com), inactive instances spin down after 15 minutes of idle time, resulting in a 30–60 second cold start on subsequent requests. To eliminate cold starts:
- Set up a free uptime monitor (e.g., [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org)).
- Configure an HTTP monitor to ping `GET https://<your-render-url>/health` every **10 minutes**.
- This keeps the backend warm 24/7 at zero cost.

### Initializing the First Administrator on Aiven MySQL

Run the administrative bootstrapping script locally to create the root administrator account without exposing credentials:

```powershell
Set-Location backend
npm run setup:admin -- --certificate "C:\path\to\aiven-ca.pem"
```

The script connects over TLS, checks for existing administrators, and prompts securely for account credentials.

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
- If accessing a hosted free-tier instance, the first request may take 30–45 seconds due to a cold start.
- Look for the top banner notice: *"☕ The server is warming up, please wait a moment…"*. Once initialized, subsequent requests respond in milliseconds.

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
| **`413`** | Payload Too Large | Client (4xx) | Excel delivery file > 1 MB; CSV delivery update > 500 KB or > 50 rows; prescription image attachment too large. | Reduce file size, compress images, or split import into batches of $\le 50$ rows. |
| **`423`** | Locked | Client (4xx) | Workspace idle lock (`SESSION_LOCKED`) after inactivity timeout; active workflow lease held by another pharmacist (`X-Workflow-Lease`). | Re-enter password/PIN to unlock workspace. For workflow conflict, wait for the other user to close their tab. |
| **`429`** | Too Many Requests | Client (4xx) | Brute-force rate limiter triggered on login or OTP attempts from same IP or account. | Wait for the cooldown window (1–15 minutes) before retrying. |
| **`500`** | Internal Server Error | Server (5xx) | Unhandled database disconnect, unexpected Prisma exception, or PDFKit generation failure. | Check server logs on Render or local terminal using the `requestId` from the error modal. |
| **`502`** | Bad Gateway | Gateway | External clinical APIs (openFDA, RxNorm, PubChem) unreachable; Render proxy error during container restart. | Retry after a few moments. Use local DDInter database if external APIs are down. |
| **`503`** | Service Unavailable | Gateway | MySQL database connection pool exhausted or instance undergoing maintenance; rate-limit store unreachable. | Check database health in Aiven console. Wait 30 seconds and retry. |
| **`504`** | Gateway Timeout | Gateway | Render free-tier container cold start took longer than edge timeout; long report generation timed out. | Wait 15–30 seconds for the backend instance to finish warming up and refresh. Use UptimeRobot keep-alive. |

---

## 17. Current QA Status & Verification Boundaries

- **Unit & Integration Tests**: **681 tests passing across 62 test suites** in Vitest covering authentication, financial calculations, batch inventory, delivery lifecycles, and concurrency locks.
- **Frontend Build & TypeScript**: Clean compilation with `tsc -b && vite build` with manual bundle chunk optimization.
- **Database Safety**: Local integration tests run in isolated transactions with automatic rollback of test fixtures.
- **Operational Boundaries**: Physical thermal printers, hardware barcode scanners, SMTP mail delivery in production networks, and heavy load testing (>500 concurrent connections) must be verified separately in target production environments.

---

*MediFlow Pharmacy Management System · Academic Prototype · Not for Clinical Use.*
