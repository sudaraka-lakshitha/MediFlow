import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Alert, Empty, Loading, Metric, Status } from "../components/Ui";

const money = (value: number) =>
  `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const prescriberLabel = (prescription: any) =>
  [prescription.prescriberTitle, prescription.prescriberName]
    .filter(Boolean)
    .join(" ") || "Not mentioned";
const statusColours = [
  "#176b63",
  "#4f79c8",
  "#e2a33a",
  "#c8564f",
  "#7c66b0",
  "#78908c",
];

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [notices, setNotices] = useState<any[]>([]);
  useEffect(() => {
    api
      .get("/dashboard")
      .then((response) => setData(response.data.data))
      .catch((caught) => setError(errorMessage(caught)));
  }, []);
  useEffect(() => {
    if (user?.role === "PATIENT") api.get("/patients/my-notices").then((response) => setNotices(response.data.data)).catch((caught) => setError(errorMessage(caught)));
  }, [user?.role]);
  const statusTotal =
    data?.prescriptionStatuses?.reduce(
      (sum: number, item: any) => sum + item.count,
      0,
    ) || 0;
  const donut = useMemo(() => {
    if (!data?.prescriptionStatuses?.length || !statusTotal)
      return "#edf2f1 0 100%";
    let at = 0;
    return data.prescriptionStatuses
      .map((item: any, index: number) => {
        const start = at;
        at += (item.count / statusTotal) * 100;
        return `${statusColours[index % statusColours.length]} ${start}% ${at}%`;
      })
      .join(", ");
  }, [data, statusTotal]);
  if (!data && !error) return <Loading />;
  const patient = user!.role === "PATIENT";
  if (user!.role === "CASHIER")
    return (
      <>
        <div className="page-intro">
          <div>
            <h2>Cashier dashboard</h2>
            <p>
              Process pharmacist-prepared payment requests without access to
              clinical or stock administration.
            </p>
          </div>
          <a href="/cashier" className="btn btn-primary">
            <i className="bi bi-cash-coin me-2" />
            Open payment desk
          </a>
        </div>
        <Alert message={error} />
        {notices.length > 0 && (
          <div className="panel">
            <div className="panel-header"><h3>Pharmacy notices</h3></div>
            {notices.map((notice) => (
              <div className="alert alert-info mb-2" key={notice.id}>
                <strong><i className="bi bi-bell me-2" />{notice.title}</strong>
                <div className="small mt-1">{notice.message}</div>
                <small className="text-secondary">From {notice.createdBy.fullName} · {new Date(notice.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
        <div className="metric-grid">
          <Metric
            label="Awaiting payment"
            value={data?.awaitingPayment ?? 0}
            icon="hourglass-split"
            tone="amber"
          />
          <Metric
            label="Payments today"
            value={data?.paidToday ?? 0}
            icon="check2-circle"
            tone="blue"
          />
          <Metric
            label="Collected today (my shift)"
            value={money(data?.amountToday)}
            icon="cash-stack"
          />
        </div>
        <div className="panel">
          <div className="panel-header">
            <h3>Recent cashier requests</h3>
          </div>
          {data?.recentRequests?.map((row: any) => (
            <div className="dashboard-list-row" key={row.id}>
              <div>
                <strong>
                  {row.requestNumber} —{" "}
                  {row.patient?.fullName || "Walk-in customer"}
                </strong>
                <small>
                  {row.type === "RETAIL" ? "Retail goods" : "Prescription"} ·
                  Prepared by {row.pharmacist.fullName} ·{" "}
                  {new Date(row.createdAt).toLocaleString()}
                </small>
              </div>
              <Status value={row.status} />
            </div>
          ))}
          {!data?.recentRequests?.length && (
            <Empty text="No cashier requests have been created." />
          )}
        </div>
      </>
    );
  if (patient)
    return (
      <>
        <div className="page-intro">
          <div>
            <h2>Good day, {user!.fullName.split(" ")[0]}</h2>
            <p>
              Follow your prescriptions, dispensing progress, and invoices.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link to="/prescriptions" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-file-earmark-medical me-1" />
              View prescriptions
            </Link>
            <Link to="/prescription-uploads" className="btn btn-primary btn-sm">
              <i className="bi bi-upload me-1" />
              Upload prescription
            </Link>
          </div>
        </div>
        <Alert message={error} />
        <div className="metric-grid">
          <Metric
            label="Active prescriptions"
            value={data?.activePrescriptions ?? 0}
            icon="file-medical"
          />
          <Metric
            label="Completed"
            value={data?.completedPrescriptions ?? 0}
            icon="check2-circle"
            tone="blue"
          />
          <Metric
            label="Invoices"
            value={data?.invoices ?? 0}
            icon="receipt"
            tone="amber"
          />
        </div>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="panel h-100">
              <div className="panel-header">
                <h3>Recent prescriptions</h3>
              </div>
              {data?.recentPrescriptions?.map((row: any) => (
                <div className="dashboard-list-row" key={row.id}
                  style={row.status === 'VERIFIED' ? { background: '#E2F4EE', borderRadius: '8px', paddingInline: '10px' } : undefined}>
                  <div>
                    <strong>{row.prescriptionNumber}</strong>
                    {row.status === 'VERIFIED' && (
                      <span className="ms-2" style={{ fontSize: '.7rem', background: '#0D6B52', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Ready to collect
                      </span>
                    )}
                    <small>
                      {prescriberLabel(row)} —{" "}
                      {new Date(row.prescriptionDate).toLocaleString()}
                    </small>
                  </div>
                  <Status value={row.status} />
                </div>
              ))}
              {!data?.recentPrescriptions?.length && <Empty />}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="panel h-100">
              <div className="panel-header">
                <h3>Recent invoices</h3>
              </div>
              {data?.recentInvoices?.map((row: any) => (
                <div className="dashboard-list-row" key={row.id}>
                  <div>
                    <strong>{row.invoiceNumber}</strong>
                    <small>
                      {new Date(row.createdAt).toLocaleString()} — Paid{" "}
                      {money(row.amountPaid)}
                    </small>
                  </div>
                  <span>{money(row.total)}</span>
                </div>
              ))}
              {!data?.recentInvoices?.length && <Empty />}
            </div>
          </div>
        </div>
      </>
    );

  const maxSales = Math.max(
    ...(data?.salesSeries?.map((item: any) => item.sales) || [0]),
    1,
  );
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Good day, {user!.fullName.split(" ")[0]}</h2>
          <p>
            Live pharmacy activity, inventory risks, and recent actions.
          </p>
        </div>
        <span className="text-secondary small">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <Alert message={error} />
      <div className="metric-grid">
        <Metric
          label="Pending prescriptions"
          value={data?.pendingPrescriptions ?? 0}
          icon="file-earmark-medical"
        />
        <Metric
          label="Dispensed today"
          value={data?.dispensedToday ?? 0}
          icon="bag-check"
          tone="blue"
        />
        <Metric
          label="Today's sales"
          value={money(data?.salesToday)}
          icon="cash-stack"
          tone="teal"
        />
      </div>
      <div className="row g-4">
        <div className="col-xl-8">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h3>Seven-day pharmacy activity</h3>
                <small className="text-secondary">
                  Sales revenue and dispensing counts
                </small>
              </div>
            </div>
            <div className="dashboard-sales-chart">
              {data?.salesSeries?.map((item: any) => (
                <div className="dashboard-day" key={item.date}>
                  <span>{money(item.sales).replace("Rs. ", "")}</span>
                  <div className="dashboard-bar-track">
                    <div
                      style={{
                        height: `${Math.max((item.sales / maxSales) * 100, item.sales ? 5 : 0)}%`,
                      }}
                    />
                  </div>
                  <strong>{item.dispensings}</strong>
                  <small>
                    {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                      undefined,
                      { weekday: "short" },
                    )}
                  </small>
                </div>
              ))}
            </div>
            <div className="chart-key">
              <span>
                <i className="sales-key" /> Sales height
              </span>
              <span>
                <strong>0</strong> Dispensing count below bar
              </span>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h3>Prescription workflow</h3>
                <small className="text-secondary">
                  Current status distribution
                </small>
              </div>
            </div>
            {statusTotal ? (
              <div className="status-chart-wrap">
                <div
                  className="donut-chart"
                  style={{ background: `conic-gradient(${donut})` }}
                >
                  <div>
                    <strong>{statusTotal}</strong>
                    <small>Total</small>
                  </div>
                </div>
                <div className="chart-legend">
                  {data.prescriptionStatuses.map((item: any, index: number) => (
                    <div key={item.status}>
                      <span
                        style={{
                          background:
                            statusColours[index % statusColours.length],
                        }}
                      />
                      <label>
                        {item.status.replaceAll("_", " ").toLowerCase()}
                      </label>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
      <div className="row g-4 mt-0">
        <div className="col-xl-4">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h3>Operational attention</h3>
                <small className="text-secondary">
                  Items requiring staff review
                </small>
              </div>
            </div>
            <div className="attention-stack">
              <div className="attention-item warning">
                <i className="bi bi-clock-history" />
                <div>
                  <strong>{data?.nearExpiryBatches ?? 0}</strong>
                  <span>
                    Batches expire within{" "}
                    {data?.operationSettings?.nearExpiryDays ?? 90} days
                  </span>
                </div>
              </div>
              <div className="attention-item danger">
                <i className="bi bi-exclamation-octagon" />
                <div>
                  <strong>{data?.expiredBatches ?? 0}</strong>
                  <span>Expired batches with remaining stock</span>
                </div>
              </div>
              <div className="attention-item info">
                <i className="bi bi-percent" />
                <div>
                  <strong>{money(data?.discountMonth?.amount)}</strong>
                  <span>
                    {data?.discountMonth?.applications || 0} discounts this
                    month
                  </span>
                </div>
              </div>
              {user!.role === "ADMIN" && (
                <div className="attention-item teal">
                  <i className="bi bi-people" />
                  <div>
                    <strong>{data?.activeUsers ?? 0}</strong>
                    <span>Active system users</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h3>Low stock</h3>
                <small className="text-secondary">
                  At or below reorder level
                </small>
              </div>
            </div>
            {data?.lowStock?.map((item: any) => (
              <div className="dashboard-list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>Reorder at {item.reorderLevel}</small>
                </div>
                <span
                  className={item.stock <= 0 ? "text-danger" : "text-warning"}
                >
                  {item.stock}
                </span>
              </div>
            ))}
            {!data?.lowStock?.length && (
              <Empty text="No products are below their reorder level." />
            )}
          </div>
        </div>
        <div className="col-xl-4">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h3>Recent system actions</h3>
                <small className="text-secondary">Audit-backed activity</small>
              </div>
            </div>
            {data?.recentActions?.map((item: any) => (
              <div className="dashboard-list-row compact" key={item.id}>
                <div>
                  <strong>
                    {item.action.replaceAll("_", " ").toLowerCase()}
                  </strong>
                  <small>
                    {item.user?.fullName || "System"} —{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                </div>
                <i
                  className={`bi bi-${item.success ? "check-circle text-success" : "x-circle text-danger"}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="row g-4 mt-0">
        <div className="col-xl-7">
          <div className="panel h-100">
            <div className="panel-header">
              <h3>Recent prescriptions</h3>
            </div>
            {data?.recentPrescriptions?.map((row: any) => (
              <div className="dashboard-list-row" key={row.id}>
                <div>
                  <strong>
                    {row.prescriptionNumber} — {row.patient.user.fullName}
                  </strong>
                  <small>
                    {prescriberLabel(row)} —{" "}
                    {new Date(row.prescriptionDate).toLocaleString()}
                  </small>
                </div>
                <Status value={row.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-xl-5">
          <div className="panel h-100">
            <div className="panel-header">
              <h3>Recent sales</h3>
            </div>
            {data?.recentSales?.map((row: any) => (
              <div className="dashboard-list-row" key={row.id}>
                <div>
                  <strong>
                    {row.invoiceNumber} — {row.patient?.fullName || "Walk-in"}
                  </strong>
                  <small>
                    {row.pharmacist.fullName} —{" "}
                    {new Date(row.createdAt).toLocaleString()}
                    {row.discountApplications.length
                      ? ` — ${row.discountApplications.length} discount(s)`
                      : ""}
                  </small>
                </div>
                <span>{money(row.total)}</span>
              </div>
            ))}
            {!data?.recentSales?.length && <Empty />}
          </div>
        </div>
      </div>
    </>
  );
}
