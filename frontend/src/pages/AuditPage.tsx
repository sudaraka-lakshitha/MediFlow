import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, errorMessage } from "../api/client";
import { PredictiveSearchInput } from "../components/PredictiveSearchInput";
import { SearchableSelect } from "../components/SearchableSelect";
import { Modal } from "../components/Modal";
import { Alert, Empty, Loading, Metric, Status } from "../components/Ui";

type AuditTab = "staff" | "audit" | "trash" | "errors";
type AuditConfirmation = "trash" | "restore-all" | "clear-errors" | null;

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

  const selectedStaff = staff.find(
    (member) => String(member.id) === String(filters.userId),
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
            and manage the recoverable 30-day audit archive.
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
        </div>
        {tab !== "errors" && (
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
                  ? `${number(meta.total)} recoverable record(s) · deleted permanently after 30 days`
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
                  ? "Restore records before their individual 30-day retention deadline."
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
                    onClick={() => setConfirmation("trash")}
                    disabled={busy || !meta.total}
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

      {confirmation && (
        <Modal
          title={
            confirmation === "trash"
              ? "Clear audit report to trash?"
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
                ? `All ${number(meta.total)} records matching the current report filters will leave the active audit view. They remain recoverable in Trash for 30 days.`
                : `All ${number(meta.trashCount)} currently recoverable audit records will return to the active audit view.`}
            </p>
          )}
          {confirmation === "trash" && (
            <div className="alert alert-warning small">
              This does not delete the records immediately. Permanent deletion
              happens only after each record has remained in Trash for 30 days.
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
