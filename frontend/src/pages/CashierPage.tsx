import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { api, errorMessage } from "../api/client";
import { Modal, ModalActions } from "../components/Modal";
import { PredictiveSearchInput } from "../components/PredictiveSearchInput";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Metric, Status } from "../components/Ui";

const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;
const emptyRetail = () => ({
  patientId: "",
  couponCode: "",
  tax: 0,
  amountPaid: 0,
  paymentMethod: "CASH",
  items: [{ productId: "", quantity: 1 }],
});

export function CashierPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("AWAITING_PAYMENT");
  const [payment, setPayment] = useState<any>(null);
  const [paid, setPaid] = useState<any>(null);
  const [retail, setRetail] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; title: string; type: 'success' | 'danger' } | null>(null);
  const [retailOptions, setRetailOptions] = useState<{
    products: any[];
    patients: any[];
  }>({ products: [], patients: [] });
  const load = useCallback(async () => {
    try {
      setError("");
      setRows((await api.get("/payment-requests")).data.data);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement?.tagName;
      if (active === "INPUT" || active === "TEXTAREA" || active === "SELECT") {
        return;
      }
      if (payment || paid || retail) {
        return;
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        openRetail();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [payment, paid, retail]);
  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!status || row.status === status) &&
          `${row.requestNumber} ${row.prescription?.prescriptionNumber || "retail goods"} ${row.patient?.fullName || "walk-in"} ${row.patient?.phone || ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [rows, search, status],
  );
  const awaiting = rows.filter((row) => row.status === "AWAITING_PAYMENT");
  const paidToday = rows.filter(
    (row) =>
      row.paidAt &&
      new Date(row.paidAt).toDateString() === new Date().toDateString(),
  );
  const openPdf = async (row: any, kind: "handoff" | "receipt") => {
    const popup = window.open("", "_blank");
    try {
      const response = await api.get(
        `/payment-requests/${row.id}/${kind}.pdf`,
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(response.data);
      if (popup) popup.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) {
      popup?.close();
      setError(errorMessage(caught));
    }
  };
  const submitPayment = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await api.post(`/payment-requests/${payment.id}/pay`, {
        paymentMethod: payment.paymentMethod,
        paymentReference: payment.paymentReference || null,
      });
      setPaid(response.data);
      const reqNum = payment.requestNumber;
      const collectedAmount = payment.total;
      setPayment(null);
      await load();
      setToast({
        title: "Payment Recorded",
        message: `Successfully received Rs. ${Number(collectedAmount).toFixed(2)} for request ${reqNum}.`,
        type: "success"
      });
      setTimeout(() => setToast(null), 5000);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const openRetail = async () => {
    try {
      const response = await api.get("/cashier/retail-options");
      setRetailOptions(response.data.data);
      setRetail(emptyRetail());
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };
  const updateRetailItem = (index: number, changes: object) =>
    setRetail({
      ...retail,
      items: retail.items.map((item: any, itemIndex: number) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    });
  const retailSubtotal = retail
    ? retail.items.reduce(
        (sum: number, item: any) =>
          sum +
          Number(item.quantity || 0) *
            Number(
              retailOptions.products.find(
                (product) => product.id === Number(item.productId),
              )?.sellingPrice || 0,
            ),
        0,
      )
    : 0;
  const openSaleInvoice = async (sale: any) => {
    const popup = window.open("", "_blank");
    try {
      const response = await api.get(`/sales/${sale.id}/invoice.pdf`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      if (popup) popup.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) {
      popup?.close();
      setError(errorMessage(caught));
    }
  };
  const submitRetail = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await api.post("/sales/retail", {
        patientId: retail.patientId ? Number(retail.patientId) : null,
        couponCode: retail.couponCode || null,
        tax: Number(retail.tax),
        amountPaid: Number(retail.amountPaid),
        paymentMethod: retail.paymentMethod,
        items: retail.items.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      });
      const sale = response.data.data;
      setRetail(null);
      await load();
      setToast({
        title: "Retail Sale Completed",
        message: `Successfully created invoice ${sale.invoiceNumber} for Rs. ${Number(sale.total).toFixed(2)}.`,
        type: "success"
      });
      setTimeout(() => setToast(null), 5000);
      await openSaleInvoice(sale);
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
          <h2>Cashier payment desk</h2>
          <p>
            Receive payment from pharmacist-prepared requests. Cashiers cannot
            edit prescriptions, stock, patients, or clinical directions.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={openRetail}>
            <i className="bi bi-cart-plus me-2" />
            New retail bill
          </button>
          <button className="btn btn-outline-secondary" onClick={load}>
            <i className="bi bi-arrow-clockwise me-2" />
            Refresh queue
          </button>
        </div>
      </div>
      <Alert message={error} />
      <div className="metric-grid">
        <Metric
          label="Awaiting payment"
          value={awaiting.length}
          icon="hourglass-split"
          tone="amber"
        />
        <Metric
          label="Payments today"
          value={paidToday.length}
          icon="check2-circle"
          tone="blue"
        />
        <Metric
          label="Collected today"
          value={money(
            paidToday.reduce((sum, row) => sum + Number(row.amountPaid), 0),
          )}
          icon="cash-stack"
        />
      </div>
      <div className="panel">
        <div className="toolbar mb-3">
          <PredictiveSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search request, prescription or customer…"
            suggestions={rows.flatMap((row) => [
              row.requestNumber,
              row.prescription?.prescriptionNumber || "Retail goods",
              row.patient?.fullName || "Walk-in",
              row.patient?.phone || "",
            ])}
          />
          <select
            className="form-select"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="AWAITING_PAYMENT">Awaiting payment</option>
            <option value="PAID">Paid—awaiting dispensing</option>
            <option value="FULFILLED">Dispensed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Customer</th>
                <th>Prepared by</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.requestNumber}</strong>
                    <small className="d-block">
                      {row.prescription?.prescriptionNumber || "Retail goods"}
                    </small>
                    <small>{new Date(row.createdAt).toLocaleString()}</small>
                  </td>
                  <td>
                    {row.patient?.fullName || "Walk-in customer"}
                    <small className="d-block">
                      {row.patient?.phone || row.patient?.email || "No account"}
                    </small>
                  </td>
                  <td>{row.pharmacist.fullName}</td>
                  <td>
                    {row.items.map((item: any) => (
                      <small className="d-block" key={item.id}>
                        {item.product.genericName} {item.product.strength} ×{" "}
                        {item.quantity}
                      </small>
                    ))}
                  </td>
                  <td>
                    <strong>{money(row.total)}</strong>
                  </td>
                  <td>
                    <Status value={row.status} />
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openPdf(row, "handoff")}
                        title="Open pharmacist handoff"
                      >
                        <i className="bi bi-file-earmark-text" />
                      </button>
                      {row.status === "AWAITING_PAYMENT" && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            setPayment({ ...row, paymentMethod: "CASH", paymentReference: "" })
                          }
                        >
                          Receive payment
                        </button>
                      )}
                      {["PAID", "FULFILLED"].includes(row.status) && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openPdf(row, "receipt")}
                        >
                          <i className="bi bi-printer me-1" />
                          Print receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <Empty text="No payment requests match the selected filters." />
          )}
        </div>
      </div>
      {payment && (
        <Modal
          title={`Receive payment — ${payment.requestNumber}`}
          onClose={() => setPayment(null)}
          size="sm"
        >
          <form onSubmit={submitPayment}>
            <div className="alert alert-info">
              <strong>Amount due: {money(payment.total)}</strong>
              <br />
              <small>
                Confirm the customer has paid the full amount. A one-time
                dispensing PIN will be generated on the receipt.
              </small>
            </div>
            <div className="cashier-payment-breakdown">
              <span>
                Medicine subtotal <strong>{money(payment.subtotal)}</strong>
              </span>
              <span className="text-success">
                Discount <strong>− {money(payment.discount)}</strong>
              </span>
              <span>
                Bottle / container fee{" "}
                <strong>{money(payment.containerFee)}</strong>
              </span>
              <span>
                Tax <strong>{money(payment.tax)}</strong>
              </span>
            </div>
            <label className="form-label">Payment method</label>
            <select
              className="form-select"
              value={payment.paymentMethod}
              onChange={(event) =>
                setPayment({ ...payment, paymentMethod: event.target.value })
              }
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option value="OTHER">Other</option>
            </select>
            {payment.paymentMethod === "BANK_TRANSFER" && (
              <div className="mt-3">
                <label className="form-label">Bank reference number <span className="text-secondary fw-normal">(optional)</span></label>
                <input className="form-control" value={payment.paymentReference || ""} onChange={(event) => setPayment({ ...payment, paymentReference: event.target.value })} maxLength={120} placeholder="Transaction or bank reference" />
              </div>
            )}
            <ModalActions
              onClose={() => setPayment(null)}
              submitLabel={`Confirm ${money(payment.total)}`}
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {retail && (
        <Modal
          title="Create cashier retail bill"
          onClose={() => setRetail(null)}
          size="lg"
        >
          <form onSubmit={submitRetail}>
            <div className="alert alert-success small">
              <i className="bi bi-lightning-charge me-2" />
              <strong>Direct cashier sale.</strong> No verification PIN is
              required because an authorized cashier is completing the billing
              and handover.
            </div>
            <div className="form-grid">
              <div>
                <label className="form-label">
                  Customer account (optional)
                </label>
                <SearchableSelect
                  options={retailOptions.patients.map((patient) => ({
                    value: patient.id,
                    label: patient.fullName,
                    description: patient.phone || patient.email,
                  }))}
                  value={retail.patientId}
                  onChange={(patientId) => setRetail({ ...retail, patientId })}
                  placeholder="Walk-in customer"
                />
              </div>
              <div>
                <label className="form-label">Coupon code (optional)</label>
                <input
                  className="form-control"
                  value={retail.couponCode}
                  onChange={(event) =>
                    setRetail({
                      ...retail,
                      couponCode: event.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            </div>
            <h4 className="h6 mt-4">Retail items</h4>
            {retail.items.map((item: any, index: number) => {
              const product = retailOptions.products.find(
                (candidate) => candidate.id === Number(item.productId),
              );
              const stock =
                product?.batches.reduce(
                  (sum: number, batch: any) =>
                    sum + Number(batch.quantityAvailable),
                  0,
                ) || 0;
              return (
                <div className="row g-2 align-items-end mb-2" key={index}>
                  <div className="col-md-7">
                    <label className="form-label small">Product</label>
                    <SearchableSelect
                      options={retailOptions.products.map((candidate) => ({
                        value: candidate.id,
                        label: candidate.genericName,
                        description: `${candidate.sku} · ${money(candidate.sellingPrice)} · Stock ${candidate.batches.reduce((sum: number, batch: any) => sum + Number(batch.quantityAvailable), 0)}`,
                      }))}
                      value={item.productId}
                      onChange={(productId) =>
                        updateRetailItem(index, { productId })
                      }
                      placeholder="Search item, SKU or barcode"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small">Quantity</label>
                    <input
                      className="form-control"
                      type="number"
                      min="0.001"
                      max={stock || undefined}
                      step="0.001"
                      value={item.quantity}
                      onChange={(event) =>
                        updateRetailItem(index, {
                          quantity: event.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small">Line total</label>
                    <div className="form-control bg-light">
                      {money(
                        Number(item.quantity || 0) *
                          Number(product?.sellingPrice || 0),
                      )}
                    </div>
                  </div>
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={retail.items.length === 1}
                      onClick={() =>
                        setRetail({
                          ...retail,
                          items: retail.items.filter(
                            (_: any, itemIndex: number) => itemIndex !== index,
                          ),
                        })
                      }
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() =>
                setRetail({
                  ...retail,
                  items: [...retail.items, { productId: "", quantity: 1 }],
                })
              }
            >
              + Add item
            </button>
            <div className="form-grid mt-4">
              <div>
                <label className="form-label">Tax</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.01"
                  value={retail.tax}
                  onChange={(event) =>
                    setRetail({ ...retail, tax: event.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Amount received</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.01"
                  value={retail.amountPaid}
                  onChange={(event) =>
                    setRetail({ ...retail, amountPaid: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Payment method</label>
                <select
                  className="form-select"
                  value={retail.paymentMethod}
                  onChange={(event) =>
                    setRetail({ ...retail, paymentMethod: event.target.value })
                  }
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Estimated subtotal</label>
                <div className="form-control bg-light">
                  <strong>{money(retailSubtotal)}</strong>
                </div>
                <small className="text-secondary">
                  Server applies eligible discounts securely.
                </small>
              </div>
            </div>
            <ModalActions
              onClose={() => setRetail(null)}
              submitLabel="Complete sale and print receipt"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {paid && (
        <Modal
          title="Payment completed"
          onClose={() => setPaid(null)}
          size="sm"
        >
          <div className="alert alert-success">
            Payment recorded successfully.
          </div>
          <label className="form-label">Dispensing verification PIN</label>
          <div
            className="display-5 text-center fw-bold border rounded-3 py-3 text-primary"
            style={{ letterSpacing: "0.35em" }}
          >
            {paid.pickupPin}
          </div>
          <p className="text-secondary small mt-2">
            Give the printed receipt to the customer. The pharmacist must enter
            this PIN before medicines can leave the pharmacy.
          </p>
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={() => openPdf(paid.data, "receipt")}
            >
              <i className="bi bi-printer me-2" />
              Print physical receipt with PIN
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPaid(null)}
            >
              Done
            </button>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast-region">
          <div className={`toast toast-${toast.type} d-flex align-items-start gap-2`}>
            <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'} toast-icon`} />
            <div className="toast-body">
              <strong>{toast.title}</strong>
              <span>{toast.message}</span>
            </div>
            <button className="toast-close" onClick={() => setToast(null)}>
              <i className="bi bi-x" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
