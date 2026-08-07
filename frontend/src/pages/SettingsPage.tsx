import { useEffect, useState, type FormEvent } from "react";
import { api, errorMessage } from "../api/client";
import { Alert, Loading } from "../components/Ui";

export function SettingsPage() {
  const [form, setForm] = useState({
    allocationMethod: "FIFO",
    nearExpiryDays: 90,
    auditTrashEnabled: true,
    auditTrashRetentionDays: 30,
    requirePickupPin: true,
    cashierCanDispenseAtPayment: false,
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/settings/operations")
      .then((response) => setForm(response.data.data))
      .catch((caught) => setError(errorMessage(caught)))
      .finally(() => setLoading(false));
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await api.put("/settings/operations", form);
      setForm(response.data.data);
      setMessage(response.data.message);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Pharmacy operation settings</h2>
          <p>
            Administrator-controlled rules used by prescription dispensing,
            retail billing, stock alerts, and the dashboard.
          </p>
        </div>
      </div>
      <Alert message={error} />
      {message && <div className="alert alert-success py-2">{message}</div>}
      <form className="panel operation-settings" onSubmit={save}>
        <div className="panel-header">
          <div>
            <h3>Batch allocation policy</h3>
            <small className="text-secondary">
              Only non-expired batches with available stock are considered.
            </small>
          </div>
        </div>
        <div className="allocation-options">
          <label
            className={form.allocationMethod === "FIFO" ? "selected" : ""}
          >
            <input
              type="radio"
              name="allocationMethod"
              value="FIFO"
              checked={form.allocationMethod === "FIFO"}
              onChange={() =>
                setForm({ ...form, allocationMethod: "FIFO" })
              }
            />
            <span className="setting-icon">
              <i className="bi bi-box-arrow-right" />
            </span>
            <span>
              <strong>FIFO — first received, first issued</strong>
              <small>
                Keeps the original project requirement. The oldest received
                usable batch is allocated first.
              </small>
            </span>
          </label>
          <label
            className={form.allocationMethod === "FEFO" ? "selected" : ""}
          >
            <input
              type="radio"
              name="allocationMethod"
              value="FEFO"
              checked={form.allocationMethod === "FEFO"}
              onChange={() =>
                setForm({ ...form, allocationMethod: "FEFO" })
              }
            />
            <span className="setting-icon">
              <i className="bi bi-calendar2-check" />
            </span>
            <span>
              <strong>FEFO — first expiring, first issued</strong>
              <small>
                Prioritizes the usable batch with the earliest expiry date to
                reduce avoidable expiry losses.
              </small>
            </span>
            <span className="badge text-bg-success">Recommended</span>
          </label>
        </div>

        <div className="form-section">
          <div className="form-section-title">Expiry monitoring</div>
          <div className="setting-inline">
            <div>
              <label className="form-label">Near-expiry warning window</label>
              <input
                className="form-control"
                type="number"
                min={7}
                max={365}
                value={form.nearExpiryDays}
                onChange={(event) =>
                  setForm({
                    ...form,
                    nearExpiryDays: Number(event.target.value),
                  })
                }
                required
              />
            </div>
            <p>
              Batches expiring within this number of days are highlighted on
              the inventory page and operational dashboard. Allowed range:
              7–365 days.
            </p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Audit trash policy</div>
          <div className="setting-inline">
            <div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="auditTrashEnabled"
                  checked={form.auditTrashEnabled}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      auditTrashEnabled: event.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="auditTrashEnabled">
                  Enable recoverable audit trash
                </label>
              </div>
              <label className="form-label">Keep trash records for</label>
              <div className="input-group">
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  max={365}
                  value={form.auditTrashRetentionDays}
                  disabled={!form.auditTrashEnabled}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      auditTrashRetentionDays: Number(event.target.value),
                    })
                  }
                  required
                />
                <span className="input-group-text">days</span>
              </div>
            </div>
            <p>
              When enabled, administrators can move audit records to a
              recoverable trash area. Records are permanently removed after
              1–365 days. Turning trash off prevents new records from being
              moved there; existing trash remains recoverable until its
              retention deadline.
            </p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Dispensing &amp; pickup security</div>
          <div className="setting-inline">
            <div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="requirePickupPin"
                  checked={form.requirePickupPin}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      requirePickupPin: event.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="requirePickupPin">
                  Require a pickup PIN before handing over medicine
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cashierCanDispenseAtPayment"
                  checked={form.cashierCanDispenseAtPayment}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      cashierCanDispenseAtPayment: event.target.checked,
                    })
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="cashierCanDispenseAtPayment"
                >
                  Let cashiers hand over pharmacist-prepared medicine at the
                  point of payment
                </label>
              </div>
            </div>
            <p>
              Turning off the pickup PIN removes the extra verification step
              between payment and hand-over — a reasonable simplification for
              a small pharmacy where one customer is served at a time, but a
              real safeguard is lost for busier pharmacies with multiple
              staff and customers. When cashier dispense-at-payment is
              enabled, prescription bills are marked dispensed the moment the
              cashier takes payment — no separate pharmacist PIN-verification
              step happens at all, since the same transaction covers both.
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save operation settings"}
          </button>
        </div>
      </form>
    </>
  );
}
