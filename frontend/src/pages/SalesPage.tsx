import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Modal, ModalActions } from "../components/Modal";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Status } from "../components/Ui";

const emptyRetail = () => ({
  patientId: "",
  couponCode: "",
  tax: 0,
  amountPaid: 0,
  paymentMethod: "CASH",
  items: [{ productId: "", quantity: 1 }],
});
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;

export function SalesPage() {
  const { user } = useAuth();
  const staff = user!.role !== "PATIENT";
  const isAdmin = user!.role === "ADMIN";
  const canDirectRetail =
    user!.role === "ADMIN" || Boolean(user!.cashierAccess);
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [retailRequests, setRetailRequests] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [retail, setRetail] = useState<any>(null);
  const [handover, setHandover] = useState<any>(null);
  const [voidTarget, setVoidTarget] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [invoiceBusy, setInvoiceBusy] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      const requests = [api.get("/sales")];
      if (staff)
        requests.push(
          api.get("/catalog/products"),
          api.get("/patients"),
          api.get("/payment-requests"),
        );
      const result = await Promise.all(requests);
      setRows(result[0].data.data);
      if (staff) {
        setProducts(result[1].data.data);
        setPatients(result[2].data.data);
        setRetailRequests(
          result[3].data.data.filter(
            (request: any) => request.type === "RETAIL",
          ),
        );
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [staff]);
  const searchPatients = useCallback(async (query: string) => {
    if (query.length < 2) return;
    try {
      const response = await api.get("/patients", { params: { search: query } });
      setPatients((prev) => {
        const byId = new Map(prev.map((patient: any) => [patient.id, patient]));
        for (const patient of response.data.data) byId.set(patient.id, patient);
        return [...byId.values()];
      });
    } catch {
      // best-effort live search; keep whatever options are already loaded
    }
  }, []);
  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) return;
    try {
      const response = await api.get("/catalog/products", { params: { search: query } });
      setProducts((prev) => {
        const byId = new Map(prev.map((product: any) => [product.id, product]));
        for (const product of response.data.data) byId.set(product.id, product);
        return [...byId.values()];
      });
    } catch {
      // best-effort live search; keep whatever options are already loaded
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const retailProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.active &&
          !product.prescriptionRequired &&
          product.batches.reduce(
            (sum: number, batch: any) => sum + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0),
            0,
          ) > 0,
      ),
    [products],
  );
  const retailSubtotal = useMemo(
    () =>
      !retail
        ? 0
        : retail.items.reduce(
            (sum: number, item: any) =>
              sum +
              Number(item.quantity || 0) *
                Number(
                  products.find(
                    (product) => product.id === Number(item.productId),
                  )?.sellingPrice || 0,
                ),
            0,
          ),
    [products, retail],
  );
  const savePayment = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post(`/sales/${payment.id}/pay`, {
        amount: Number(payment.amount),
        paymentMethod: payment.paymentMethod,
      });
      setPayment(null);
      load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const saveRetail = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        patientId: retail.patientId ? Number(retail.patientId) : null,
        couponCode: retail.couponCode || null,
        tax: Number(retail.tax),
        items: retail.items.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };
      const response = canDirectRetail
        ? await api.post("/sales/retail", {
            ...payload,
            amountPaid: Number(retail.amountPaid),
            paymentMethod: retail.paymentMethod,
          })
        : await api.post("/payment-requests/retail", payload);
      setRetail(null);
      await load();
      if (canDirectRetail) await invoicePdf(response.data.data, false);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const fulfillRetail = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await api.post(
        `/payment-requests/${handover.id}/fulfill-retail`,
        { pickupPin: handover.pickupPin },
      );
      setHandover(null);
      await load();
      await invoicePdf(response.data.data, false);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const invoicePdf = async (row: any, download: boolean) => {
    const popup = download ? null : window.open("", "_blank");
    try {
      setInvoiceBusy(row.id);
      const response = await api.get(`/sales/${row.id}/invoice.pdf`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${row.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (popup) popup.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) {
      popup?.close();
      setError(errorMessage(caught));
    } finally {
      setInvoiceBusy(null);
    }
  };
  const paymentPdf = async (request: any, kind: "handoff" | "receipt") => {
    const popup = window.open("", "_blank");
    try {
      const response = await api.get(
        `/payment-requests/${request.id}/${kind}.pdf`,
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
  const submitVoid = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/sales/${voidTarget.id}/void`, {
        reason: voidTarget.reason,
      });
      setVoidTarget(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const updateRetailItem = (index: number, changes: object) =>
    setRetail({
      ...retail,
      items: retail.items.map((item: any, itemIndex: number) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    });
  if (loading) return <Loading />;
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Sales & billing</h2>
          <p>
            Prescription invoices, counter sales, discounts, FIFO stock cost,
            profit, balances, and payments.
          </p>
        </div>
        {staff && (
          <button
            className="btn btn-primary"
            onClick={() => setRetail(emptyRetail())}
          >
            <i className="bi bi-cart-plus me-2" />
            {canDirectRetail
              ? "New retail bill"
              : "Prepare retail cashier request"}
          </button>
        )}
      </div>
      <Alert message={error} />
      {staff && retailRequests.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Retail cashier handovers</h3>
              <small className="text-secondary">
                Pharmacist-prepared retail bills require cashier payment and PIN
                verification before goods are handed over.
              </small>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {retailRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.requestNumber}</strong>
                      <small className="d-block">
                        {new Date(request.createdAt).toLocaleString()}
                      </small>
                    </td>
                    <td>{request.patient?.fullName || "Walk-in customer"}</td>
                    <td>
                      {request.items.map((item: any) => (
                        <small className="d-block" key={item.id}>
                          {item.product.genericName} × {item.quantity}
                        </small>
                      ))}
                    </td>
                    <td>
                      <strong>{money(request.total)}</strong>
                    </td>
                    <td>
                      <Status value={request.status} />
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {request.status === "AWAITING_PAYMENT" && (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => paymentPdf(request, "handoff")}
                          >
                            <i className="bi bi-printer me-1" />
                            Cashier slip
                          </button>
                        )}
                        {request.status === "PAID" && (
                          <>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                setHandover({ ...request, pickupPin: "" })
                              }
                            >
                              <i className="bi bi-shield-check me-1" />
                              Verify PIN and hand over
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => paymentPdf(request, "receipt")}
                            >
                              <i className="bi bi-receipt" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
                {staff && (
                  <>
                    <th>FIFO cost</th>
                    <th>Gross profit</th>
                  </>
                )}
                <th>Paid</th>
                <th>Status</th>
                <th>Invoice PDF</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.invoiceNumber}</strong>
                    {!row.dispensingId && (
                      <small className="d-block text-primary">
                        Retail sale
                      </small>
                    )}
                    {row.discountApplications?.map((discount: any) => (
                      <small className="d-block text-success" key={discount.id}>
                        {discount.ruleName}: -Rs.{" "}
                        {Number(discount.amount).toFixed(2)}
                      </small>
                    ))}
                  </td>
                  <td>{row.patient?.fullName || "Walk-in"}</td>
                  <td>{new Date(row.createdAt).toLocaleString()}</td>
                  <td>Rs. {Number(row.subtotal).toFixed(2)}</td>
                  <td className="text-success">
                    -Rs. {Number(row.discount).toFixed(2)}
                  </td>
                  <td>
                    <strong>Rs. {Number(row.total).toFixed(2)}</strong>
                  </td>
                  {staff && (
                    <>
                      <td>
                        Rs. {Number(row.financials?.cost || 0).toFixed(2)}
                      </td>
                      <td
                        className={
                          Number(row.financials?.profit || 0) >= 0
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        <strong>
                          Rs. {Number(row.financials?.profit || 0).toFixed(2)}
                        </strong>
                        <small className="d-block">
                          {Number(row.financials?.margin || 0).toFixed(2)}%
                        </small>
                      </td>
                    </>
                  )}
                  <td>Rs. {Number(row.amountPaid).toFixed(2)}</td>
                  <td>
                    <Status value={row.status} />
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={invoiceBusy === row.id}
                        onClick={() => invoicePdf(row, false)}
                        title="Open printable invoice"
                        aria-label={`Print invoice ${row.invoiceNumber}`}
                      >
                        <i className="bi bi-printer" />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={invoiceBusy === row.id}
                        onClick={() => invoicePdf(row, true)}
                        title="Download invoice PDF"
                        aria-label={`Download invoice ${row.invoiceNumber}`}
                      >
                        <i className="bi bi-download" />
                      </button>
                      {staff && row.status === "PENDING" && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setPayment({
                              id: row.id,
                              invoiceNumber: row.invoiceNumber,
                              outstanding:
                                Number(row.total) - Number(row.amountPaid),
                              amount:
                                Number(row.total) - Number(row.amountPaid),
                              paymentMethod: "CASH",
                            })
                          }
                        >
                          Record payment
                        </button>
                      )}
                      {staff &&
                        !row.dispensingId &&
                        row.status !== "VOIDED" &&
                        (isAdmin ||
                          new Date(row.createdAt).toDateString() ===
                            new Date().toDateString()) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              setVoidTarget({ ...row, reason: "" })
                            }
                            title="Void this sale"
                            aria-label={`Void invoice ${row.invoiceNumber}`}
                          >
                            <i className="bi bi-x-circle" />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <Empty text="No invoices have been created." />}
        </div>
      </div>
      {retail && (
        <Modal
          title="Create retail bill"
          onClose={() => setRetail(null)}
          size="lg"
        >
          <form onSubmit={saveRetail}>
            <div className="alert alert-info py-2">
              <i className="bi bi-info-circle me-2" />
              {canDirectRetail
                ? "You are authorized to complete this retail sale directly; no PIN handoff is required."
                : "This retail bill will be sent to the cashier. Verify the paid receipt PIN before handing over goods."}
            </div>
            <div className="form-grid">
              <div>
                <label className="form-label">Patient (optional)</label>
                <SearchableSelect
                  options={patients.map((patient) => ({
                    value: patient.user.id,
                    label: patient.user.fullName,
                    description: `${patient.patientNumber} · ${patient.user.phone}`,
                  }))}
                  value={retail.patientId}
                  onChange={(patientId) => setRetail({ ...retail, patientId })}
                  onQueryChange={searchPatients}
                  placeholder="Walk-in customer"
                />
              </div>
              <div>
                <label className="form-label">Coupon code (optional)</label>
                <input
                  className="form-control"
                  value={retail.couponCode}
                  onChange={(event) =>
                    setRetail({ ...retail, couponCode: event.target.value })
                  }
                />
              </div>
            </div>
            <h4 className="h6 mt-4">Bill items</h4>
            {retail.items.map((item: any, index: number) => {
              const product = products.find(
                (candidate) => candidate.id === Number(item.productId),
              );
              const stock =
                product?.batches.reduce(
                  (sum: number, batch: any) =>
                    sum + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0),
                  0,
                ) || 0;
              return (
                <div className="row g-2 align-items-end mb-2" key={index}>
                  <div className="col-md-7">
                    <label className="form-label small">Product</label>
                    <SearchableSelect
                      options={retailProducts.map((candidate) => ({
                        value: candidate.id,
                        label: candidate.genericName,
                        description: `${candidate.productType === "NON_MEDICINAL" ? "Retail item" : "OTC medicine"} · ${candidate.sku} · Rs. ${Number(candidate.sellingPrice).toFixed(2)}`,
                      }))}
                      value={item.productId}
                      onChange={(productId) =>
                        updateRetailItem(index, { productId })
                      }
                      onQueryChange={searchProducts}
                      placeholder="Search product, barcode or SKU"
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
                      Rs.{" "}
                      {(
                        Number(item.quantity || 0) *
                        Number(product?.sellingPrice || 0)
                      ).toFixed(2)}
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
                  {product && (
                    <div className="col-12">
                      <small className="text-secondary">
                        Available: {stock} {product.unit}
                      </small>
                    </div>
                  )}
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
              {canDirectRetail && (
                <div>
                  <label className="form-label">Amount paid now</label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    value={retail.amountPaid}
                    onChange={(event) =>
                      setRetail({ ...retail, amountPaid: event.target.value })
                    }
                  />
                </div>
              )}
              {canDirectRetail && (
                <div>
                  <label className="form-label">Payment method</label>
                  <select
                    className="form-select"
                    value={retail.paymentMethod}
                    onChange={(event) =>
                      setRetail({
                        ...retail,
                        paymentMethod: event.target.value,
                      })
                    }
                  >
                    <option>CASH</option>
                    <option>CARD</option>
                    <option>OTHER</option>
                  </select>
                </div>
              )}
              <div>
                <label className="form-label">Estimated subtotal</label>
                <div className="form-control bg-light">
                  <strong>Rs. {retailSubtotal.toFixed(2)}</strong>
                </div>
                <small className="text-secondary">
                  Final discounts and total are calculated securely by the
                  server.
                </small>
              </div>
            </div>
            <ModalActions
              onClose={() => setRetail(null)}
              submitLabel={
                canDirectRetail
                  ? "Create and print invoice"
                  : "Send retail request to cashier"
              }
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {handover && (
        <Modal
          title={`Retail handover — ${handover.requestNumber}`}
          onClose={() => setHandover(null)}
          size="sm"
        >
          <form onSubmit={fulfillRetail}>
            <div className="alert alert-success">
              <strong>
                Cashier payment confirmed: {money(handover.total)}
              </strong>
              <br />
              <small>
                Enter the PIN from the customer's paid receipt before releasing
                the retail goods.
              </small>
            </div>
            <label className="form-label">Six-digit receipt PIN</label>
            <input
              className="form-control form-control-lg text-center"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              value={handover.pickupPin}
              onChange={(event) =>
                setHandover({
                  ...handover,
                  pickupPin: event.target.value.replace(/\D/g, "").slice(0, 6),
                })
              }
              placeholder="______"
              required
              autoFocus
            />
            <ModalActions
              onClose={() => setHandover(null)}
              submitLabel="Verify PIN and hand over goods"
              busy={busy || handover.pickupPin.length !== 6}
            />
          </form>
        </Modal>
      )}
      {payment && (
        <Modal
          title={`Record payment — ${payment.invoiceNumber}`}
          onClose={() => setPayment(null)}
          size="sm"
        >
          <form onSubmit={savePayment}>
            <div className="alert alert-info py-2">
              Outstanding balance: Rs. {payment.outstanding.toFixed(2)}
            </div>
            <label className="form-label">Payment amount</label>
            <input
              className="form-control"
              type="number"
              min="0.01"
              max={payment.outstanding}
              step="0.01"
              value={payment.amount}
              onChange={(event) =>
                setPayment({ ...payment, amount: event.target.value })
              }
              required
            />
            <label className="form-label mt-3">Payment method</label>
            <select
              className="form-select"
              value={payment.paymentMethod}
              onChange={(event) =>
                setPayment({ ...payment, paymentMethod: event.target.value })
              }
            >
              <option>CASH</option>
              <option>CARD</option>
              <option>OTHER</option>
            </select>
            <ModalActions
              onClose={() => setPayment(null)}
              submitLabel="Record payment"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {voidTarget && (
        <Modal
          title={`Void ${voidTarget.invoiceNumber}`}
          onClose={() => setVoidTarget(null)}
          size="sm"
        >
          <form onSubmit={submitVoid}>
            <div className="alert alert-danger small">
              <i className="bi bi-exclamation-triangle me-2" />
              Voiding this sale ({money(voidTarget.total)}) returns its items
              to stock and marks the invoice void. This cannot be undone.{" "}
              {isAdmin
                ? "As an admin you can void this on any day."
                : "It can only be done on the same day it was made; an admin can override that."}
            </div>
            <label className="form-label">Reason for voiding (required)</label>
            <textarea
              className="form-control"
              minLength={3}
              maxLength={500}
              value={voidTarget.reason}
              onChange={(event) =>
                setVoidTarget({ ...voidTarget, reason: event.target.value })
              }
              placeholder="e.g. Wrong item rung up, customer returned goods…"
              required
            />
            <ModalActions
              onClose={() => setVoidTarget(null)}
              submitLabel="Void sale"
              busy={busy}
            />
          </form>
        </Modal>
      )}
    </>
  );
}
