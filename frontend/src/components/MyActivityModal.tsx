import { formatPharmacyDateTimeInput, PHARMACY_TIME_ZONE, pharmacyTodayDateInput } from "../utils/pharmacyTime";
import { useEffect, useMemo, useState } from "react";
import { api, errorMessage } from "../api/client";
import type { User } from "../auth/AuthSession";
import { Modal } from "./Modal";
import { Alert, Empty } from "./Ui";

type ActivityRecord = {
  id: number;
  action: string;
  entityType: string | null;
  entityId: number | null;
  details: Record<string, unknown> | null;
  success: boolean;
  method: string | null;
  path: string | null;
  createdAt: string;
};

type ActivityResponse = {
  data: ActivityRecord[];
  meta: {
    from: string;
    to: string;
    total: number;
    successful: number;
    failed: number;
    returned: number;
    truncated: boolean;
    maximumRangeDays: number;
  };
};

type ActivityCategory = "key" | "all" | "prescriptions" | "payments" | "inventory" | "account";

const dateValue = (date: Date) => {
  return formatPharmacyDateTimeInput(date).slice(0, 10);
};

const rangeForDays = (days: number) => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  return { from: dateValue(start), to: dateValue(end) };
};

const localDayKey = (value: string) => {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: PHARMACY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

const categoryFor = (record: ActivityRecord): "prescriptions" | "payments" | "inventory" | "account" => {
  const value = `${record.action} ${record.entityType || ""}`;
  if (/PRESCRIPTION|INTERACTION/i.test(value)) return "prescriptions";
  if (/PAYMENT|SALE|INVOICE|RETAIL/i.test(value)) return "payments";
  if (/STOCK|INVENTORY|BATCH|PRODUCT|SUPPLIER/i.test(value)) return "inventory";
  return "account";
};

const isKeyActivity = (record: ActivityRecord) => (
  !record.success
  || (!record.action.endsWith("_VIEWED") && record.action !== "LOGIN")
);

const categoryMeta = {
  prescriptions: { icon: "file-medical", tone: "teal" },
  payments: { icon: "cash-coin", tone: "blue" },
  inventory: { icon: "boxes", tone: "amber" },
  account: { icon: "person-check", tone: "neutral" },
};

const actionLabels: Record<string, string> = {
  PRESCRIPTION_CREATED: "Created a prescription",
  PRESCRIPTION_UPDATED: "Updated a prescription",
  PRESCRIPTION_DELETED: "Deleted a pending prescription",
  PRESCRIPTION_VERIFIED: "Verified a prescription",
  PRESCRIPTION_REJECTED: "Rejected a prescription",
  PRESCRIPTION_BALANCE_CLOSED: "Closed the unsupplied balance of a prescription",
  PRESCRIPTION_DISPENSED: "Dispensed a prescription",
  PRESCRIPTION_VIEWED: "Reviewed a prescription",
  PRESCRIPTION_RECORDS_VIEWED: "Reviewed prescription records",
  PRESCRIPTION_UPLOAD_REVIEWED: "Reviewed an uploaded prescription",
  PRESCRIPTION_UPLOADS_VIEWED: "Reviewed prescription uploads",
  PAYMENT_REQUEST_CREATED: "Sent an invoice to the cashier",
  RETAIL_PAYMENT_REQUEST_CREATED: "Prepared a retail payment request",
  CASHIER_PAYMENT_RECEIVED: "Received a cashier payment",
  RETAIL_PIN_VERIFIED_AND_HANDED_OVER: "Verified payment and handed over retail goods",
  PAYMENT_REQUESTS_VIEWED: "Reviewed cashier payment requests",
  PAYMENT_DOCUMENT_VIEWED: "Opened a payment document",
  RETAIL_SALE_CREATED: "Completed a retail sale",
  SALE_PAYMENT: "Recorded a sale payment",
  SALES_RECORDS_VIEWED: "Reviewed sales records",
  INVOICE_EXPORTED: "Generated an invoice",
  STOCK_RECEIVED: "Received stock",
  STOCK_ADJUSTED: "Adjusted stock",
  STOCK_BATCH_UPDATED: "Updated an inventory batch",
  LOW_STOCK_NOTED: "Marked a low-stock alert as noted",
  LOW_STOCK_NOTE_CLEARED: "Reactivated a low-stock alert",
  STOCK_LEDGER_VIEWED: "Reviewed the stock ledger",
  INVENTORY_VIEWED: "Reviewed inventory",
  LOGIN: "Signed in",
  PASSWORD_CHANGED: "Changed password",
  REQUEST_FAILED: "Encountered a system error",
};

const actionLabel = (action: string) => actionLabels[action] || action
  .toLowerCase()
  .replaceAll("_", " ")
  .replace(/^./, (letter) => letter.toUpperCase());

const activityReference = (record: ActivityRecord) => {
  const details = record.details || {};
  const reference = [
    details.prescriptionNumber,
    details.requestNumber,
    details.invoiceNumber,
    details.fileName,
  ].find((value) => typeof value === "string" && value.trim());
  const entity = record.entityType
    ? `${record.entityType.toLowerCase().replaceAll("_", " ")}${record.entityId ? ` #${record.entityId}` : ""}`
    : "";
  const total = categoryFor(record) === "payments" && details.total != null && Number.isFinite(Number(details.total))
    ? `Rs. ${Number(details.total).toFixed(2)}`
    : "";
  return [reference, entity, total].filter(Boolean).join(" · ");
};

export function MyActivityModal({ user, onClose }: { user: User; onClose(): void }) {
  const initialRange = rangeForDays(7);
  const [draft, setDraft] = useState(initialRange);
  const [range, setRange] = useState(initialRange);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [meta, setMeta] = useState<ActivityResponse["meta"] | null>(null);
  const [category, setCategory] = useState<ActivityCategory>("key");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.get<ActivityResponse>("/audit-logs/me", { params: range })
      .then((response) => {
        if (!active) return;
        setRecords(response.data.data);
        setMeta(response.data.meta);
      })
      .catch((caught) => active && setError(errorMessage(caught)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [range]);

  const filtered = useMemo(() => records.filter((record) => {
    if (category === "key") return isKeyActivity(record);
    return category === "all" || categoryFor(record) === category;
  }), [category, records]);

  const groups = useMemo(() => {
    const grouped = new Map<string, ActivityRecord[]>();
    filtered.forEach((record) => {
      const key = localDayKey(record.createdAt);
      grouped.set(key, [...(grouped.get(key) || []), record]);
    });
    return [...grouped.entries()];
  }, [filtered]);

  const activeDays = new Set(records.map((record) => localDayKey(record.createdAt))).size;
  const applyDates = () => {
    const start = Date.parse(`${draft.from}T00:00:00`);
    const end = Date.parse(`${draft.to}T00:00:00`);
    const dayDifference = (end - start) / (24 * 60 * 60 * 1000);
    if (!draft.from || !draft.to || !Number.isFinite(dayDifference) || dayDifference < 0) {
      setError("Choose a valid start and end date.");
      return;
    }
    if (dayDifference > 30) {
      setError("Choose no more than 31 days at a time.");
      return;
    }
    setRange(draft);
  };
  const applyPreset = (days: number) => {
    const next = rangeForDays(days);
    setDraft(next);
    setRange(next);
  };

  return (
    <Modal title="My activity" onClose={onClose} size="lg">
      <div className="my-activity-identity">
        <span className="my-activity-avatar">
          {user.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
        </span>
        <div>
          <strong>{user.fullName}</strong>
          <span>{user.role.toLowerCase()} · {user.email}</span>
        </div>
        <span className="my-activity-private"><i className="bi bi-lock" /> Only your activity</span>
      </div>

      <div className="my-activity-toolbar">
        <div className="my-activity-presets" aria-label="Activity date presets">
          {[{ days: 1, label: "Today" }, { days: 7, label: "7 days" }, { days: 30, label: "30 days" }].map((preset) => (
            <button
              key={preset.days}
              type="button"
              className={`btn btn-sm ${range.from === rangeForDays(preset.days).from && range.to === rangeForDays(preset.days).to ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => applyPreset(preset.days)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="my-activity-dates">
          <label>From<input type="date" className="form-control form-control-sm" value={draft.from} max={draft.to} onChange={(event) => setDraft({ ...draft, from: event.target.value })} /></label>
          <label>To<input type="date" className="form-control form-control-sm" value={draft.to} min={draft.from} max={pharmacyTodayDateInput()} onChange={(event) => setDraft({ ...draft, to: event.target.value })} /></label>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={applyDates}>Apply</button>
        </div>
      </div>

      <Alert message={error} />
      {meta && !loading && (
        <div className="my-activity-summary">
          <div><span>Activities</span><strong>{meta.total}</strong></div>
          <div><span>Active days</span><strong>{activeDays}</strong></div>
          <div><span>Successful</span><strong className="text-success">{meta.successful}</strong></div>
          <div><span>Failed</span><strong className={meta.failed ? "text-danger" : ""}>{meta.failed}</strong></div>
        </div>
      )}

      <div className="my-activity-list-header">
        <div><strong>Daily activity</strong><small>Showing {filtered.length} recorded action{filtered.length === 1 ? "" : "s"}</small></div>
        <select className="form-select form-select-sm" value={category} onChange={(event) => setCategory(event.target.value as ActivityCategory)} aria-label="Filter activity type">
          <option value="key">Key actions</option>
          <option value="all">All activity</option>
          <option value="prescriptions">Prescriptions</option>
          <option value="payments">Payments & sales</option>
          <option value="inventory">Inventory</option>
          <option value="account">Account & other</option>
        </select>
      </div>

      {loading && <div className="my-activity-loading"><span className="spinner-border spinner-border-sm" /> Loading your activity…</div>}
      {!loading && !groups.length && <Empty text="No activity was recorded for this date range and filter." />}
      {!loading && groups.map(([day, activities]) => (
        <section className="my-activity-day" key={day}>
          <div className="my-activity-day-heading">
            <time dateTime={day}>{new Intl.DateTimeFormat("en-LK", { timeZone: PHARMACY_TIME_ZONE, weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date(`${day}T00:00:00`))}</time>
            <span>{activities.length}</span>
          </div>
          <div className="my-activity-timeline">
            {activities.map((record) => {
              const activityCategory = categoryFor(record);
              const visual = categoryMeta[activityCategory];
              return (
                <article className="my-activity-entry" key={record.id}>
                  <span className={`my-activity-icon my-activity-icon-${visual.tone}`}><i className={`bi bi-${visual.icon}`} /></span>
                  <div className="my-activity-entry-copy">
                    <strong>{actionLabel(record.action)}</strong>
                    {activityReference(record) && <small>{activityReference(record)}</small>}
                  </div>
                  <div className="my-activity-entry-meta">
                    <time dateTime={record.createdAt}>{new Intl.DateTimeFormat("en-LK", { timeZone: PHARMACY_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(record.createdAt))}</time>
                    <span className={record.success ? "activity-result-success" : "activity-result-failed"}>{record.success ? "Successful" : "Failed"}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      {meta?.truncated && <div className="alert alert-warning mt-3 mb-0">Only the latest {meta.returned} activities are shown. Choose a shorter date range to see everything.</div>}
      <small className="my-activity-note"><i className="bi bi-info-circle" /> Activity is grouped using the pharmacy reporting timezone. Administrators retain access to the complete staff audit trail.</small>
    </Modal>
  );
}
