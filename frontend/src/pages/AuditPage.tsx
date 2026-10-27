import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, errorMessage } from "../api/client";
import { PredictiveSearchInput } from "../components/PredictiveSearchInput";
import { SearchableSelect } from "../components/SearchableSelect";
import { Modal } from "../components/Modal";
import { Alert, Empty, Loading, Metric, Status } from "../components/Ui";

type AuditTab = "staff" | "audit" | "trash" | "errors" | "codes";
type AuditConfirmation =
  | "trash"
  | "trash-selected"
  | "restore-all"
  | "clear-errors"
  | null;

export interface AuditStatusCodeInfo {
  code: number;
  name: string;
  category: "4xx Client Errors" | "5xx Server Errors" | "Hosting & Gateway";
  badgeClass: string;
  summary: string;
  scenarios: string[];
  resolution: string;
  origin: string;
}

export const AUDIT_STATUS_CODES: AuditStatusCodeInfo[] = [
  {
    code: 400,
    name: "Bad Request / Input Validation Failed",
    category: "4xx Client Errors",
    badgeClass: "text-bg-warning",
    summary: "The request body, query parameters, or URL failed validation constraints.",
    scenarios: [
      "Zod schema validation failed (e.g. empty delivery recipient name, invalid phone pattern like not matching 0701234567 or +94701234567).",
      "Missing or invalid UUID v4 Idempotency-Key on critical financial or stock operations.",
      "Cash tendered or change amount does not reconcile with bill total at the cashier checkout.",
      "Stock adjustment quantity is zero, negative (when unsigned required), or has more than 3 decimal places.",
      "Discrete dosage units (tablets, capsules) supplied with fractional decimal quantities.",
      "Attempting to query audit logs or exports with an invalid date range or out-of-bounds page.",
    ],
    resolution: "Inspect form inputs for missing required fields or invalid formats. In browser DevTools Network tab, check details.fieldErrors to pinpoint the exact failing field.",
    origin: "backend/src/middleware/validate.js, paymentAmounts.js, stockQuantity.js, operationContext.js",
  },
  {
    code: 401,
    name: "Unauthorized / Session Expired",
    category: "4xx Client Errors",
    badgeClass: "text-bg-danger",
    summary: "No valid authentication token provided, session expired, or token was revoked.",
    scenarios: [
      "Missing or expired Bearer JWT token in Authorization header.",
      "Session reached its expiration deadline (JWT_EXPIRES_IN) or was revoked from active sessions table.",
      "User password was changed or reset, incrementing tokenVersion and invalidating active sessions across all devices.",
      "Invalid login credentials provided on the sign-in form.",
    ],
    resolution: "Sign in again at /login. If an administrator revoked your session or reset your password, use your new credentials.",
    origin: "backend/src/middleware/authenticate.js, auth.service.js, session.service.js",
  },
  {
    code: 402,
    name: "Payment Required / Unpaid Prescription",
    category: "4xx Client Errors",
    badgeClass: "text-bg-warning",
    summary: "Financial payment must be verified before proceeding with the requested operation.",
    scenarios: [
      "Attempting to dispense medicines for a prescription whose payment request is still AWAITING_PAYMENT or SLIP_SUBMITTED.",
      "Attempting to dispatch a home delivery before the delivery fee invoice (DEL-...) is verified and marked PAID.",
    ],
    resolution: "Have the cashier collect payment, verify the bank transfer slip, or allocate statement balance to mark the invoice as PAID first.",
    origin: "backend/src/utils/prescriptionDispense.js, deliveryAction.js",
  },
  {
    code: 403,
    name: "Forbidden / Access Denied",
    category: "4xx Client Errors",
    badgeClass: "text-bg-danger",
    summary: "The authenticated user lacks the required role or administrative permission for this action.",
    scenarios: [
      "Role-based authorization guard rejected access (e.g. Cashier attempting to edit prescriptions or dispense medicines; Patient attempting to view pharmacy inventory).",
      "Attempting to approve a refund escalation without the ADMIN role.",
      "Pharmacy-wide daily balance reconciliation opened by staff without explicit administrative grant.",
      "Patient attempting to view or modify another patient's medical records or invoices.",
    ],
    resolution: "Sign in with an account having the required role (Admin or Pharmacist). For reconciliation access, have an administrator grant permission in User Management.",
    origin: "backend/src/middleware/authorize.js, reconciliationAccess.js, invoiceAccess.js",
  },
  {
    code: 404,
    name: "Not Found / Missing Record",
    category: "4xx Client Errors",
    badgeClass: "text-bg-secondary",
    summary: "The requested record ID or API endpoint does not exist in the database.",
    scenarios: [
      "Prescription, payment request, product, batch, delivery request, or user record ID not found in MySQL (Prisma P2025).",
      "A prescription item was deleted or removed by another user before dispensing was initiated.",
      "Request sent to an undefined or incorrect API route URL.",
    ],
    resolution: "Refresh the page to reload active records. Verify the record ID in the URL.",
    origin: "backend/src/middleware/errorHandler.js (notFound, Prisma P2025)",
  },
  {
    code: 409,
    name: "Conflict / Business Rule Violation",
    category: "4xx Client Errors",
    badgeClass: "text-bg-warning",
    summary: "The request conflicts with existing data constraints, historical records, or concurrent modifications.",
    scenarios: [
      "Unique Constraint (P2002): Email address, batch number, or invoice reference already exists in the system.",
      "Foreign Key Constraint (P2003): Attempting to delete a product or category that has historical sales or dispensing records (deactivate instead).",
      "Stale Record Revision: The record was modified by another staff member while you were viewing it (expectedUpdatedAt mismatch).",
      "Insufficient Usable Stock: Available batch quantity is lower than the required dispensing or retail quantity.",
      "Workflow State Conflict: Prescription is already dispensed, partially dispensed, or cancelled.",
      "Collection PIN Mismatch: The pickup PIN entered at the cashier does not match the issued receipt.",
      "Retry Key Payload Mismatch: Reusing an Idempotency-Key with a different payload hash.",
      "Reshipment of restricted/expired batch: Returned parcel contains expired medicines that cannot be reshipped.",
    ],
    resolution: "Refresh the workspace to pull the latest revision. For unique key collisions, choose an alternative identifier. For stock shortages, review inventory batches or request pharmacist stock adjustments.",
    origin: "backend/src/middleware/errorHandler.js, stock.js, prescriptionDispense.js, operationContext.js",
  },
  {
    code: 410,
    name: "Gone / Expired Resource",
    category: "4xx Client Errors",
    badgeClass: "text-bg-secondary",
    summary: "The target resource was previously valid but has permanently expired or been purged.",
    scenarios: [
      "Password-reset OTP code expired after the 10-minute validity window.",
      "Prescription quotation or estimate reached its acceptance deadline and was automatically closed.",
    ],
    resolution: "Request a fresh OTP code or have the pharmacist generate an updated prescription quote.",
    origin: "backend/src/services/auth.service.js, prescriptionUpload.service.js",
  },
  {
    code: 413,
    name: "Payload Too Large",
    category: "4xx Client Errors",
    badgeClass: "text-bg-warning",
    summary: "The uploaded file exceeds the maximum allowed file size.",
    scenarios: [
      "Bulk Excel import file exceeds the 1 MB archive limit (checkWorkbookArchive).",
      "Bulk CSV delivery file exceeds the 500 KB limit or contains more than 50 rows.",
      "Uploaded prescription image attachment exceeds the file size threshold.",
    ],
    resolution: "Reduce file size, compress images, or split the bulk import spreadsheet into smaller batches of at most 50 rows.",
    origin: "backend/src/services/deliveryWorkbook.service.js, productBulk.service.js",
  },
  {
    code: 423,
    name: "Locked / Concurrency Lease Active",
    category: "4xx Client Errors",
    badgeClass: "text-bg-dark",
    summary: "The target workspace or record is actively locked by another user or session security timeout.",
    scenarios: [
      "Workspace Idle Lock (SESSION_LOCKED): Staff inactivity exceeded the configured idle timeout; screen locked until password/PIN unlock.",
      "Workflow Lease Lock (WORKFLOW_BUSY): Another pharmacist is currently editing or dispensing the same prescription (X-Workflow-Lease header protection).",
    ],
    resolution: "For idle timeout: Enter your account password to unlock the workspace. For workflow lease collisions: Wait for the other staff member to finish, or request them to close their edit tab.",
    origin: "backend/src/middleware/errorHandler.js, workflowLease.service.js",
  },
  {
    code: 429,
    name: "Too Many Requests / Rate Limited",
    category: "4xx Client Errors",
    badgeClass: "text-bg-danger",
    summary: "The shared brute-force protection rate limiter has temporarily blocked requests from this IP or user account.",
    scenarios: [
      "Excessive failed login attempts within the rate-limit window.",
      "Too many password-reset OTP verification attempts.",
      "Burst API traffic exceeding rate limits from a single client.",
    ],
    resolution: "Wait for the cooldown window (typically 1 to 15 minutes) before re-attempting authentication. Do not repeatedly submit credentials.",
    origin: "backend/src/middleware/sharedRateLimit.js",
  },
  {
    code: 500,
    name: "Internal Server Error",
    category: "5xx Server Errors",
    badgeClass: "text-bg-danger",
    summary: "An unhandled server-side exception occurred while processing the request.",
    scenarios: [
      "Database driver connection dropout or unexpected MySQL server disconnect.",
      "Unhandled Prisma ORM driver error or unhandled async rejection.",
      "PDF generation engine failure (e.g., PDFKit rendering error or corrupted template).",
    ],
    resolution: "Check the server logs on Render or the local terminal using the requestId displayed in the error modal. Verify MySQL database connectivity.",
    origin: "backend/src/middleware/errorHandler.js",
  },
  {
    code: 502,
    name: "Bad Gateway / Upstream Failure",
    category: "Hosting & Gateway",
    badgeClass: "text-bg-secondary",
    summary: "The API server received an invalid response from an upstream external service or edge gateway.",
    scenarios: [
      "External clinical drug APIs (openFDA, RxNorm, PubChem) temporarily down or timing out.",
      "Render backend proxy gateway error while the API container is restarting.",
    ],
    resolution: "Retry the operation in a few moments. If clinical lookup fails, use the curated DDInter database instead of live external queries.",
    origin: "backend/src/services/drugInformation.service.js, Render edge proxy",
  },
  {
    code: 503,
    name: "Service Unavailable",
    category: "Hosting & Gateway",
    badgeClass: "text-bg-secondary",
    summary: "The backend server or database is temporarily overloaded or undergoing maintenance.",
    scenarios: [
      "Database connection pool exhausted or MySQL instance undergoing maintenance.",
      "Shared rate limiter database store temporarily unreachable (fails closed for security).",
    ],
    resolution: "Check database health in the Aiven console. Wait 30 seconds and retry.",
    origin: "backend/src/middleware/sharedRateLimit.js, MySQL pool",
  },
  {
    code: 504,
    name: "Gateway Timeout / Server Cold Start",
    category: "Hosting & Gateway",
    badgeClass: "text-bg-secondary",
    summary: "The upstream server failed to respond within the gateway timeout window.",
    scenarios: [
      "Render.com free tier instance was spun down and took longer than the edge gateway timeout to wake up.",
      "Complex financial report or multi-year PDF generation exceeded the HTTP timeout.",
    ],
    resolution: "Wait 15–30 seconds for the Render backend container to fully initialize and refresh. Use an uptime keep-alive ping (e.g. UptimeRobot) to prevent cold starts.",
    origin: "Render.com / Vercel Edge CDN timeout",
  },
];

const dateValue = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};
const today = dateValue(new Date());
const thirtyDaysAgo = dateValue(new Date(Date.now() - 29 * 86_400_000));
const actionLabel = (value?: string | null) =>
  value ? value.replaceAll("_", " ").toLowerCase() : "No activity";
const number = (value: number) => Number(value || 0).toLocaleString();

export function AuditPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStaff = searchParams.get("staff") || "";
  const [tab, setTab] = useState<AuditTab>(initialStaff ? "audit" : "staff");
  const [codeQuery, setCodeQuery] = useState("");
  const [codeCategory, setCodeCategory] = useState("ALL");
  const [audit, setAudit] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [errorMeta, setErrorMeta] = useState<{ totalLines: number; fileSizeBytes: number } | null>(null);
  const [meta, setMeta] = useState<any>({
    page: 1,
    pages: 1,
    total: 0,
    successes: 0,
    failures: 0,
    patientFailures: 0,
    unreadFailures: 0,
    trashCount: 0,
    trashEnabled: true,
    trashRetentionDays: 30,
    actions: [],
    entityTypes: [],
  });
  const [staffSummary, setStaffSummary] = useState<any>({
    staff: 0,
    activeStaff: 0,
    totalActions: 0,
    failedActions: 0,
  });
  const [filters, setFilters] = useState({
    userId: initialStaff,
    action: "",
    entityType: "",
    success: "",
    from: thirtyDaysAgo,
    to: today,
    q: "",
    page: 1,
    pageSize: 50,
  });
  const [errorQuery, setErrorQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selectedAuditIds, setSelectedAuditIds] = useState<number[]>([]);
  const [confirmation, setConfirmation] =
    useState<AuditConfirmation>(null);

  const requestParams = useMemo(
    () => ({
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      ),
      view: tab === "trash" ? "trash" : "active",
    }),
    [filters, tab],
  );

  const loadAudit = useCallback(async () => {
    const response = await api.get("/audit-logs", { params: requestParams });
    setAudit(response.data.data);
    setMeta(response.data.meta);
    const visibleIds = new Set<number>(
      response.data.data.map((row: { id: number }) => row.id),
    );
    setSelectedAuditIds((current) =>
      current.filter((id) => visibleIds.has(id)),
    );
  }, [requestParams]);

  const loadStaff = useCallback(async () => {
    const response = await api.get("/audit-logs/staff-summary", {
      params: { from: filters.from, to: filters.to },
    });
    setStaff(response.data.data);
    setStaffSummary(response.data.summary);
  }, [filters.from, filters.to]);

  const loadErrors = useCallback(async () => {
    const response = await api.get("/error-logs");
    setErrors(response.data.data);
    setErrorMeta(response.data.meta || null);
  }, []);

  const load = useCallback(async () => {
    setError("");
    try {
      await Promise.all([loadAudit(), loadStaff(), loadErrors()]);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [loadAudit, loadErrors, loadStaff]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAudit()
        .catch((caught) => setError(errorMessage(caught)))
        .finally(() => setLoading(false));
    }, 180);
    return () => clearTimeout(timer);
  }, [loadAudit]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadStaff().catch((caught) => setError(errorMessage(caught)));
    }, 180);
    return () => clearTimeout(timer);
  }, [loadStaff]);

  useEffect(() => {
    loadErrors().catch((caught) => setError(errorMessage(caught)));
  }, [loadErrors]);

  const updateFilter = (name: string, value: string | number) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: name === "page" ? Number(value) : 1,
    }));
  };

  const showStaffActivity = (userId: number) => {
    const value = String(userId);
    setFilters((current) => ({ ...current, userId: value, page: 1 }));
    setSearchParams({ staff: value });
    setTab("audit");
  };

  const clearFilters = () => {
    setFilters({
      userId: "",
      action: "",
      entityType: "",
      success: "",
      from: thirtyDaysAgo,
      to: today,
      q: "",
      page: 1,
      pageSize: 50,
    });
    setSearchParams({});
  };

  const exportAudit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await api.get("/audit-logs/export.csv", {
        params: requestParams,
        responseType: "blob",
        timeout: 130000,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mediflow-staff-audit-${filters.from}-to-${filters.to}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const refreshAttention = () =>
    window.dispatchEvent(new Event("mediflow:attention-refresh"));

  const markWarningsRead = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch(
        "/audit-logs/mark-warnings-read",
        {},
        { params: { ...requestParams, view: "active" } },
      );
      setNotice(response.data.message);
      await loadAudit();
      refreshAttention();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const clearAllWarnings = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch(
        "/audit-logs/mark-warnings-read",
        {},
        { params: { view: "active" } },
      );
      setNotice(response.data.message);
      await loadAudit();
      refreshAttention();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const moveReportToTrash = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch(
        "/audit-logs/trash",
        {},
        { params: { ...requestParams, view: "active" } },
      );
      setNotice(response.data.message);
      setFilters((current) => ({ ...current, page: 1 }));
      setTab("trash");
      refreshAttention();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  };

  const moveSelectedToTrash = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch("/audit-logs/trash-selected", {
        ids: selectedAuditIds,
      });
      setNotice(response.data.message);
      setSelectedAuditIds([]);
      await loadAudit();
      refreshAttention();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  };

  const restoreAuditRecord = async (id: number) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch(`/audit-logs/${id}/restore`);
      setNotice(response.data.message);
      await loadAudit();
      refreshAttention();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const restoreAllAuditRecords = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.patch("/audit-logs/trash/restore-all");
      setNotice(response.data.message);
      await loadAudit();
      refreshAttention();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  };

  const clearErrorLog = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.delete("/error-logs");
      setNotice(response.data.message);
      setErrors([]);
      setErrorMeta({ totalLines: 0, fileSizeBytes: 0 });
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
      setConfirmation(null);
    }
  };

  const deletionDate = (deletedAt: string) =>
    new Date(
      new Date(deletedAt).getTime() +
        Number(meta.trashRetentionDays || 30) * 86_400_000,
    );

  const filteredErrors = useMemo(() => {
    const term = errorQuery.trim().toLowerCase();
    return term
      ? errors.filter((row) => JSON.stringify(row).toLowerCase().includes(term))
      : errors;
  }, [errorQuery, errors]);

  const filteredStatusCodes = useMemo(() => {
    return AUDIT_STATUS_CODES.filter((item) => {
      const matchesCat = codeCategory === "ALL" || item.category === codeCategory;
      if (!matchesCat) return false;
      if (!codeQuery.trim()) return true;
      const q = codeQuery.toLowerCase();
      return (
        String(item.code).includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.scenarios.some((s) => s.toLowerCase().includes(q)) ||
        item.resolution.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q)
      );
    });
  }, [codeQuery, codeCategory]);

  const selectedStaff = staff.find(
    (member) => String(member.id) === String(filters.userId),
  );
  const pageAuditIds = tab === "audit" ? audit.map((row) => row.id as number) : [];
  const allPageAuditSelected =
    pageAuditIds.length > 0 &&
    pageAuditIds.every((id) => selectedAuditIds.includes(id));
  const toggleAuditRecord = (id: number) =>
    setSelectedAuditIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  const toggleCurrentAuditPage = () =>
    setSelectedAuditIds((current) =>
      allPageAuditSelected
        ? current.filter((id) => !pageAuditIds.includes(id))
        : [...new Set([...current, ...pageAuditIds])],
    );
  const errorSuggestions = errors.flatMap((row) => [
    row.message || "",
    row.path || "",
    row.requestId || "",
  ]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Administration and audit control</h2>
          <p>
            Review staff activity, investigate staff or patient-side errors,
            and manage the configurable recoverable audit archive.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={load}>
            <i className="bi bi-arrow-clockwise me-1" />
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={clearAllWarnings}
            disabled={busy || !meta.unreadFailures}
          >
            <i className="bi bi-check2-all me-1" />
            Clear all warnings
          </button>
          <button
            className="btn btn-primary"
            onClick={exportAudit}
            disabled={busy}
          >
            <i className="bi bi-download me-1" />
            Export audit CSV
          </button>
        </div>
      </div>
      <Alert message={error} />
      {notice && <div className="alert alert-success py-2">{notice}</div>}

      <div className="metric-grid audit-metrics">
        <Metric
          label="Staff accounts"
          value={number(staffSummary.staff)}
          icon="people"
        />
        <Metric
          label="Active staff"
          value={number(staffSummary.activeStaff)}
          icon="person-check"
          tone="blue"
        />
        <Metric
          label="Actions in period"
          value={number(staffSummary.totalActions)}
          icon="activity"
          tone="teal"
        />
        <Metric
          label="Unread warnings"
          value={number(meta.unreadFailures)}
          icon="shield-exclamation"
          tone={meta.unreadFailures ? "red" : "teal"}
        />
      </div>

      <div className="panel audit-filter-panel">
        <div className="audit-tabs">
          <button
            className={`btn ${tab === "staff" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setTab("staff")}
          >
            <i className="bi bi-person-lines-fill me-1" />
            Staff oversight
          </button>
          <button
            className={`btn ${tab === "audit" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setTab("audit")}
          >
            <i className="bi bi-list-check me-1" />
            Audit activity
          </button>
          <button
            className={`btn ${tab === "trash" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setTab("trash")}
            disabled={!meta.trashEnabled && !meta.trashCount}
            title={
              meta.trashEnabled
                ? "Open recoverable audit trash"
                : "Audit trash is disabled in operation settings"
            }
          >
            <i className="bi bi-trash3 me-1" />
            Trash
            <span className="badge text-bg-light ms-1">
              {meta.trashCount || 0}
            </span>
          </button>
          <button
            className={`btn ${tab === "errors" ? "btn-danger" : "btn-outline-secondary"}`}
            onClick={() => setTab("errors")}
          >
            <i className="bi bi-bug me-1" />
            Application errors
            <span className="badge text-bg-light ms-1">{errors.length}</span>
          </button>
          <button
            className={`btn ${tab === "codes" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setTab("codes")}
          >
            <i className="bi bi-journal-code me-1" />
            Error code guide
            <span className="badge text-bg-light ms-1">{AUDIT_STATUS_CODES.length}</span>
          </button>
        </div>
        {tab !== "errors" && tab !== "codes" && (
          <div className="audit-period">
            <div>
              <label className="form-label">From</label>
              <input
                className="form-control"
                type="date"
                value={filters.from}
                max={filters.to}
                onChange={(event) => updateFilter("from", event.target.value)}
              />
            </div>
            <div>
              <label className="form-label">To</label>
              <input
                className="form-control"
                type="date"
                value={filters.to}
                min={filters.from}
                max={today}
                onChange={(event) => updateFilter("to", event.target.value)}
              />
            </div>
            {(tab === "audit" || tab === "trash") && (
              <>
                <div className="audit-staff-filter">
                  <label className="form-label">Staff member</label>
                  <SearchableSelect
                    options={[
                      { value: "", label: "All staff members" },
                      ...staff.map((member) => ({
                        value: member.id,
                        label: member.fullName,
                        description: `${member.role} · ${member.email}`,
                      })),
                    ]}
                    value={filters.userId}
                    onChange={(value) => {
                      updateFilter("userId", value);
                      if (value) setSearchParams({ staff: String(value) });
                      else setSearchParams({});
                    }}
                    placeholder="Search staff name or email"
                  />
                </div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {tab === "staff" && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Individual staff accountability</h3>
              <small className="text-secondary">
                Login, clinical, inventory, billing, and failed-action totals for
                the selected period
              </small>
            </div>
            <span className="record-count">{staff.length} staff accounts</span>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff member</th>
                  <th>Security</th>
                  <th>Last login</th>
                  <th>Activity</th>
                  <th>Work areas</th>
                  <th>Last action</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <strong>{member.fullName}</strong>
                      <small className="d-block text-secondary">
                        {member.email}
                      </small>
                      <small className="d-block">
                        {member.role}
                        {member.cashierAccess &&
                          member.role === "PHARMACIST" &&
                          " · Cashier permission"}
                      </small>
                    </td>
                    <td>
                      <Status value={member.active ? "ACTIVE" : "INACTIVE"} />
                      {member.mustChangePassword && (
                        <small className="d-block text-warning mt-1">
                          Password change required
                        </small>
                      )}
                    </td>
                    <td>
                      {member.lastLoginAt
                        ? new Date(member.lastLoginAt).toLocaleString()
                        : "Never"}
                      <small className="d-block text-secondary">
                        {member.loginCount} login(s) in period
                      </small>
                    </td>
                    <td>
                      <strong>{number(member.totalActions)}</strong> actions
                      <small
                        className={`d-block ${member.failedActions ? "text-danger" : "text-success"}`}
                      >
                        {member.failedActions} failed
                      </small>
                    </td>
                    <td>
                      <small className="d-block">
                        Clinical: {member.clinicalActions}
                      </small>
                      <small className="d-block">
                        Inventory: {member.inventoryActions}
                      </small>
                      <small className="d-block">
                        Billing: {member.billingActions}
                      </small>
                    </td>
                    <td>
                      <span className="text-capitalize">
                        {actionLabel(member.lastAction)}
                      </span>
                      <small className="d-block text-secondary">
                        {member.lastActionAt
                          ? new Date(member.lastActionAt).toLocaleString()
                          : "—"}
                      </small>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => showStaffActivity(member.id)}
                      >
                        View activity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!staff.length && <Empty text="No staff accounts found." />}
        </div>
      )}

      {(tab === "audit" || tab === "trash") && (
        <div className="panel">
          <div className="panel-header audit-activity-header">
            <div>
              <h3>
                {tab === "trash"
                  ? "Audit trash"
                  : selectedStaff
                  ? `${selectedStaff.fullName}'s activity`
                  : "All staff activity"}
              </h3>
              <small className="text-secondary">
                {tab === "trash"
                  ? `${number(meta.total)} recoverable record(s) · deleted permanently after ${meta.trashRetentionDays || 30} days`
                  : `${number(meta.total)} matching audit records · ${meta.failures} failed · ${meta.patientFailures || 0} patient error(s)`}
              </small>
            </div>
            <div className="toolbar">
              <select
                className="form-select"
                value={filters.success}
                onChange={(event) =>
                  updateFilter("success", event.target.value)
                }
              >
                <option value="">All results</option>
                <option value="true">Successful only</option>
                <option value="false">Failed only</option>
              </select>
              <select
                className="form-select"
                value={filters.action}
                onChange={(event) => updateFilter("action", event.target.value)}
              >
                <option value="">All actions</option>
                {meta.actions.map((action: string) => (
                  <option value={action} key={action}>
                    {actionLabel(action)}
                  </option>
                ))}
              </select>
              <select
                className="form-select"
                value={filters.entityType}
                onChange={(event) =>
                  updateFilter("entityType", event.target.value)
                }
              >
                <option value="">All record types</option>
                {meta.entityTypes.map((entity: string) => (
                  <option value={entity} key={entity}>
                    {actionLabel(entity)}
                  </option>
                ))}
              </select>
              <PredictiveSearchInput
                value={filters.q}
                onChange={(value) => updateFilter("q", value)}
                suggestions={[
                  ...meta.actions,
                  ...staff.flatMap((member) => [
                    member.fullName,
                    member.email,
                  ]),
                ]}
                placeholder="Search action, route, request ID or staff"
              />
            </div>
          </div>
          <div
            className={`audit-lifecycle-bar ${tab === "trash" ? "trash" : "active"}`}
          >
            <div>
              <strong>
                {tab === "trash"
                  ? "Recoverable audit records"
                  : "Audit warning status"}
              </strong>
              <small>
                {tab === "trash"
                  ? `Restore records before their individual ${meta.trashRetentionDays || 30}-day retention deadline.`
                  : `${meta.unreadFailures || 0} unread warning(s). Successful patient activity is excluded; patient errors remain visible.`}
              </small>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {tab === "audit" ? (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={markWarningsRead}
                    disabled={busy || !meta.unreadFailures}
                  >
                    <i className="bi bi-check2-all me-1" />
                    Mark warnings read
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => setConfirmation("trash-selected")}
                    disabled={
                      busy || !selectedAuditIds.length || !meta.trashEnabled
                    }
                    title={
                      meta.trashEnabled
                        ? "Move selected records to recoverable trash"
                        : "Audit trash is disabled in operation settings"
                    }
                  >
                    <i className="bi bi-trash3 me-1" />
                    Delete selected ({selectedAuditIds.length})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => setConfirmation("trash")}
                    disabled={busy || !meta.total || !meta.trashEnabled}
                    title={
                      meta.trashEnabled
                        ? "Move the current report to recoverable trash"
                        : "Audit trash is disabled in operation settings"
                    }
                  >
                    <i className="bi bi-trash3 me-1" />
                    Clear report to trash
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setConfirmation("restore-all")}
                  disabled={busy || !meta.trashCount}
                >
                  <i className="bi bi-arrow-counterclockwise me-1" />
                  Restore all
                </button>
              )}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="audit-select-cell">
                    {tab === "audit" && (
                      <input
                        className="form-check-input"
                        type="checkbox"
                        aria-label="Select all audit records on this page"
                        checked={allPageAuditSelected}
                        onChange={toggleCurrentAuditPage}
                        disabled={!pageAuditIds.length}
                      />
                    )}
                  </th>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Record</th>
                  <th>Request</th>
                  <th>Result</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {audit.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      !row.success && !row.readAt && tab === "audit"
                        ? "audit-row-unread"
                        : undefined
                    }
                  >
                    <td className="audit-select-cell">
                      {tab === "audit" && (
                        <input
                          className="form-check-input"
                          type="checkbox"
                          aria-label={`Select audit record ${row.id}`}
                          checked={selectedAuditIds.includes(row.id)}
                          onChange={() => toggleAuditRecord(row.id)}
                          disabled={busy}
                        />
                      )}
                    </td>
                    <td>{new Date(row.createdAt).toLocaleString()}</td>
                    <td>
                      <strong>{row.user?.fullName || "System"}</strong>
                      <small className="d-block text-secondary">
                        {row.user?.role || "Automated"}{" "}
                        {row.user?.email ? `· ${row.user.email}` : ""}
                      </small>
                      {row.user?.role === "PATIENT" && !row.success && (
                        <span className="audit-patient-error">
                          Patient error report
                        </span>
                      )}
                    </td>
                    <td>
                      <strong className="text-capitalize">
                        {actionLabel(row.action)}
                      </strong>
                      {(row.details || row.ipAddress) && (
                        <details>
                          <summary className="small text-secondary">
                            Audit details
                          </summary>
                          <div className="audit-detail">
                            {row.ipAddress && <div>IP: {row.ipAddress}</div>}
                            {row.details && (
                              <pre>{JSON.stringify(row.details, null, 2)}</pre>
                            )}
                          </div>
                        </details>
                      )}
                    </td>
                    <td>
                      {row.entityType || "—"}{" "}
                      {row.entityId ? `#${row.entityId}` : ""}
                    </td>
                    <td>
                      {row.method && <code>{row.method}</code>} {row.path || "—"}
                      <small className="d-block text-secondary">
                        {row.requestId || "No request ID"}
                      </small>
                    </td>
                    <td>
                      <Status value={row.success ? "SUCCESS" : "FAILED"} />
                      {row.details?.status && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-decoration-none d-inline-block mt-1"
                          onClick={() => {
                            setCodeQuery(String(row.details.status));
                            setTab("codes");
                          }}
                          title={`HTTP ${row.details.status} — Click to view in error code guide`}
                        >
                          <span
                            className={`badge ${
                              row.details.status >= 500
                                ? "text-bg-danger"
                                : row.details.status >= 400
                                  ? "text-bg-warning"
                                  : "text-bg-info"
                            }`}
                          >
                            HTTP {row.details.status}
                          </span>
                        </button>
                      )}
                      {!row.success && !row.readAt && tab === "audit" && (
                        <small className="d-block text-danger mt-1">
                          Unread warning
                        </small>
                      )}
                      {!row.success && row.readAt && tab === "audit" && (
                        <small className="d-block text-secondary mt-1">
                          Read {new Date(row.readAt).toLocaleString()}
                        </small>
                      )}
                      {tab === "trash" && row.deletedAt && (
                        <small className="d-block text-secondary mt-1">
                          Trashed {new Date(row.deletedAt).toLocaleString()}
                          <br />
                          Deletes {deletionDate(row.deletedAt).toLocaleString()}
                        </small>
                      )}
                    </td>
                    <td className="text-end">
                      {tab === "trash" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => restoreAuditRecord(row.id)}
                          disabled={busy}
                        >
                          <i className="bi bi-arrow-counterclockwise me-1" />
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!audit.length && (
            <Empty
              text={
                tab === "trash"
                  ? "The audit trash is empty."
                  : "No matching staff activity or patient errors."
              }
            />
          )}
          {meta.pages > 1 && (
            <div className="audit-pagination">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={meta.page <= 1}
                onClick={() => updateFilter("page", meta.page - 1)}
              >
                Previous
              </button>
              <span>
                Page {meta.page} of {meta.pages}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={meta.page >= meta.pages}
                onClick={() => updateFilter("page", meta.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "errors" && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Application error log</h3>
              <small className="text-secondary">
                Server failures and maintenance diagnostics
                {errorMeta && errorMeta.totalLines > 0 && (
                  <> · <strong>{errorMeta.totalLines.toLocaleString()}</strong> line{errorMeta.totalLines !== 1 ? 's' : ''} ({(errorMeta.fileSizeBytes / 1024).toFixed(1)} KB)</>  
                )}
                {errorMeta && errorMeta.totalLines === 0 && (
                  <> · Log is empty</>  
                )}
              </small>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <PredictiveSearchInput
                value={errorQuery}
                onChange={setErrorQuery}
                suggestions={errorSuggestions}
                placeholder="Search message, route or request ID"
              />
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => setConfirmation("clear-errors")}
                disabled={busy || errors.length === 0}
                title="Permanently clear all error log entries"
              >
                <i className="bi bi-trash me-1" />
                Clear log
              </button>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3 p-2 bg-light rounded border">
            <small className="text-secondary fw-semibold">Quick filter by HTTP code:</small>
            {["400", "401", "402", "403", "404", "409", "410", "413", "423", "429", "500", "502", "503", "504"].map((code) => (
              <button
                key={code}
                type="button"
                className={`btn btn-sm py-0 px-2 ${errorQuery === code ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={() => setErrorQuery(errorQuery === code ? "" : code)}
              >
                {code}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none ms-auto py-0"
              onClick={() => setTab("codes")}
            >
              <i className="bi bi-journal-code me-1" />
              Status code reference guide &rarr;
            </button>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Error</th>
                  <th>Request</th>
                  <th>Request ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredErrors.map((row) => (
                  <tr key={row.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {row.timestamp
                        ? new Date(row.timestamp).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <strong>{row.message}</strong>
                      {row.stack && (
                        <details>
                          <summary className="small text-secondary">
                            Technical details
                          </summary>
                          <pre className="small text-wrap mt-2">
                            {row.stack}
                          </pre>
                        </details>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {row.method && <span className="badge bg-secondary me-1" style={{ fontSize: '.65rem' }}>{row.method}</span>}
                      {row.path}
                    </td>
                    <td>
                      <code className="mono">{row.requestId || "—"}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredErrors.length && (
            <Empty
              text={
                errors.length === 0
                  ? "No errors have been recorded. The log is empty."
                  : "No matching server errors found."
              }
            />
          )}
        </div>
      )}

      {tab === "codes" && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>HTTP Status &amp; Error Code Reference</h3>
              <small className="text-secondary">
                Comprehensive dictionary of all HTTP response codes, business rule conflicts, and audit log error sources in MediFlow
              </small>
            </div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input
                className="form-control"
                style={{ maxWidth: '300px' }}
                value={codeQuery}
                onChange={(e) => setCodeQuery(e.target.value)}
                placeholder="Search code, name, keyword…"
              />
              {codeQuery && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setCodeQuery("")}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {["ALL", "4xx Client Errors", "5xx Server Errors", "Hosting & Gateway"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${codeCategory === cat ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setCodeCategory(cat)}
              >
                {cat === "ALL" ? `All Codes (${AUDIT_STATUS_CODES.length})` : cat}
              </button>
            ))}
          </div>

          <div className="row g-3">
            {filteredStatusCodes.map((item) => (
              <div key={item.code} className="col-12">
                <div className="card shadow-sm border">
                  <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2 bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge ${item.badgeClass} fs-6`}>HTTP {item.code}</span>
                      <strong className="fs-6">{item.name}</strong>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary border">{item.category}</span>
                  </div>
                  <div className="card-body">
                    <p className="card-text mb-3">{item.summary}</p>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <h6 className="text-danger-emphasis mb-2">
                          <i className="bi bi-exclamation-triangle me-1" />
                          Why this appears in MediFlow audit logs:
                        </h6>
                        <ul className="small text-secondary ps-3 mb-0">
                          {item.scenarios.map((scen, idx) => (
                            <li key={idx} className="mb-1">{scen}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-success-emphasis mb-2">
                          <i className="bi bi-check-circle me-1" />
                          How to resolve:
                        </h6>
                        <p className="small text-secondary mb-2">{item.resolution}</p>
                        <h6 className="text-dark mb-1 small fw-bold">Code origin:</h6>
                        <code className="small text-break bg-light p-1 rounded d-block border">{item.origin}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!filteredStatusCodes.length && (
              <div className="col-12">
                <Empty text="No status codes match your search query." />
              </div>
            )}
          </div>
        </div>
      )}

      {confirmation && (
        <Modal
          title={
            confirmation === "trash"
              ? "Clear audit report to trash?"
              : confirmation === "trash-selected"
                ? "Delete selected audit records?"
              : confirmation === "clear-errors"
                ? "Clear all error logs?"
                : "Restore all audit records?"
          }
          onClose={() => setConfirmation(null)}
          size="sm"
        >
          {confirmation === "clear-errors" ? (
            <>
              <div className="alert alert-danger">
                <strong>This action cannot be undone.</strong> All {errors.length.toLocaleString()} error log
                {errors.length !== 1 ? " entries" : " entry"} will be permanently deleted from the server log
                file. The deletion is recorded in the audit log for accountability.
              </div>
              <p className="text-secondary small">
                Use this when the log has been reviewed and you want to start fresh.
                Do not clear logs that are still needed for an active incident investigation.
              </p>
            </>
          ) : (
            <p className="text-secondary">
              {confirmation === "trash"
                ? `All ${number(meta.total)} records matching the current report filters will leave the active audit view. They remain recoverable in Trash for ${meta.trashRetentionDays || 30} days.`
                : confirmation === "trash-selected"
                  ? `${number(selectedAuditIds.length)} selected audit record(s) will move to recoverable Trash for ${meta.trashRetentionDays || 30} days.`
                : `All ${number(meta.trashCount)} currently recoverable audit records will return to the active audit view.`}
            </p>
          )}
          {(confirmation === "trash" || confirmation === "trash-selected") && (
            <div className="alert alert-warning small">
              This does not delete the records immediately. Permanent deletion
              happens only after each record has remained in Trash for {meta.trashRetentionDays || 30} days.
            </div>
          )}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setConfirmation(null)}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="button"
              className={
                confirmation === "restore-all" ? "btn btn-primary" : "btn btn-danger"
              }
              onClick={
                confirmation === "trash"
                  ? moveReportToTrash
                  : confirmation === "trash-selected"
                    ? moveSelectedToTrash
                  : confirmation === "clear-errors"
                    ? clearErrorLog
                    : restoreAllAuditRecords
              }
              disabled={busy}
            >
              {busy
                ? "Working…"
                : confirmation === "trash"
                  ? "Move to trash"
                  : confirmation === "trash-selected"
                    ? "Delete selected to trash"
                  : confirmation === "clear-errors"
                    ? "Clear all error logs"
                    : "Restore all"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
