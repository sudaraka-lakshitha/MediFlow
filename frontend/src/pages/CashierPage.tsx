import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { api, errorMessage } from "../api/client";
import { Link } from "react-router-dom";
import { stockQuantityStep } from "../utils/unitMeasure";
import { pagedList } from "../api/pagedList";
import { DocumentPreview, type DocumentTarget } from "../components/DocumentPreview";
import { RefundWorkspace } from "../components/RefundWorkspace";
import { DailyBalance } from "../components/DailyBalance";
import { useAuth } from "../auth/useAuth";
import { Modal, ModalActions } from "../components/Modal";
import { PredictiveSearchInput } from "../components/PredictiveSearchInput";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Metric, Status } from "../components/Ui";

const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;
const cancellationKey = (value: any) => `${value.id}:${value.selectedItemIds.join(',')}:${JSON.stringify(value.quantities || {})}`;
const emptyRetail = () => ({
  patientId: "",
  couponCode: "",
  tax: 0,
  amountPaid: 0,
  paymentMethod: "CASH",
  items: [{ productId: "", quantity: 1 }],
});

export function CashierPage() {
  const [documentPreview, setDocumentPreview] = useState<DocumentTarget | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("AWAITING_PAYMENT");
  const [payment, setPayment] = useState<any>(null);
  const [paid, setPaid] = useState<any>(null);
  const [pinReset, setPinReset] = useState<any>(null);
  const [retail, setRetail] = useState<any>(null);
  const [revoke, setRevoke] = useState<any>(null);
  const [cancelBill, setCancelBill] = useState<any>(null);
  const [partialCancel, setPartialCancel] = useState<any>(null);
  const [cancellationPreview, setCancellationPreview] = useState<any>(null);
  const [collections, setCollections] = useState({ payments: 0, netCollected: 0 });
  const [slipReview, setSlipReview] = useState<any>(null);
  const [cancellationOverride, setCancellationOverride] = useState<any>(null);
  const [slipUrl, setSlipUrl] = useState("");
  const [toast, setToast] = useState<{ message: string; title: string; type: 'success' | 'danger' } | null>(null);
  const [retailOptions, setRetailOptions] = useState<{
    products: any[];
    patients: any[];
  }>({ products: [], patients: [] });
  const [operationSettings, setOperationSettings] = useState({
    requirePickupPin: true,
    cashierCanDispenseAtPayment: false,
  });
  const load = useCallback(async () => {
    try {
      setError("");
      const [rowsResponse, settingsResponse, collectionsResponse] = await Promise.all([
        pagedList("/payment-requests"),
        api.get("/settings/operations"),
        api.get("/cashier/collections-today"),
      ]);
      setRows(rowsResponse.data.data);
      setCollections(collectionsResponse.data.data);
      setOperationSettings(settingsResponse.data.data);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    setCancellationPreview(null);
    if (!partialCancel?.selectedItemIds?.length) return;
    let cancelled = false;
    const key = cancellationKey(partialCancel);
    api.post(`/payment-requests/${partialCancel.id}/cancellation-preview`, { itemIds: partialCancel.selectedItemIds, quantities: partialCancel.quantities })
      .then((response) => { if (!cancelled) setCancellationPreview({ ...response.data.data, key }); })
      .catch((caught) => { if (!cancelled) setError(errorMessage(caught)); });
    return () => { cancelled = true; };
  }, [partialCancel]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement?.tagName;
      if (active === "INPUT" || active === "TEXTAREA" || active === "SELECT") {
        return;
      }
      if (payment || paid || retail || revoke || cancelBill || partialCancel) {
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
  }, [payment, paid, retail, revoke, cancelBill, partialCancel]);
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
  const openPayment = (row: any) => {
    const total = Number(row.total);
    setPayment({ ...row, paymentMethod: "CASH", paymentReference: "", tenderedAmount: String(total), splitCashAmount: "", splitNonCashMethod: "CARD", splitNonCashAmount: "", splitNonCashReference: "", splitCashTendered: "" });
  };
  const openPdf = async (row: any, kind: "handoff" | "receipt") => {
    setDocumentPreview({ id: row.id, kind, name: row.requestNumber });
  };
  const submitPayment = async (event: FormEvent) => {
    event.preventDefault();
    if (!payment) return;
    setBusy(true);
    setError("");
    try {
      let finalMethod = payment.paymentMethod;
      let finalRef = payment.paymentReference || null;
      let cashTendered: number | undefined = undefined;
      let changeAmount: number | undefined = undefined;
      let splitDetails: any = null;

      const total = Number(payment.total || 0);

      if (payment.paymentMethod === "CASH") {
        const tendered = Number(payment.tenderedAmount || total);
        if (tendered < total) {
          setError(`Tendered cash (${money(tendered)}) is less than total due (${money(total)}).`);
          setBusy(false);
          return;
        }
        cashTendered = tendered;
        changeAmount = Math.max(0, tendered - total);
      } else if (payment.paymentMethod === "SPLIT") {
        finalMethod = "OTHER";
        const cashPart = Number(payment.splitCashAmount || 0);
        const nonCashPart = Number(payment.splitNonCashAmount || 0);
        const allocated = Math.round((cashPart + nonCashPart) * 100) / 100;

        if (Math.abs(allocated - total) >= 0.01) {
          setError(`Split amounts (Cash: ${money(cashPart)} + Non-cash: ${money(nonCashPart)} = ${money(allocated)}) must equal the bill total (${money(total)}).`);
          setBusy(false);
          return;
        }

        const nonCashName = payment.splitNonCashMethod === "CARD" ? "Card" : "Transfer";
        const refSnippet = payment.splitNonCashReference ? ` (Ref: ${payment.splitNonCashReference.trim()})` : "";
        finalRef = `Split: Cash Rs. ${cashPart.toFixed(2)} + ${nonCashName} Rs. ${nonCashPart.toFixed(2)}${refSnippet}`.slice(0, 120);

        const splitTendered = Number(payment.splitCashTendered || cashPart);
        if (splitTendered < cashPart) {
          setError(`Cash given (${money(splitTendered)}) is less than the cash portion due (${money(cashPart)}).`);
          setBusy(false);
          return;
        }

        cashTendered = splitTendered;
        changeAmount = Math.max(0, splitTendered - cashPart);

        splitDetails = {
          isSplit: true,
          cashAmount: cashPart,
          nonCashMethod: payment.splitNonCashMethod || "CARD",
          nonCashAmount: nonCashPart,
          nonCashReference: payment.splitNonCashReference || null,
          cashTendered: splitTendered,
          change: changeAmount,
        };
      }

      const response = await api.post(`/payment-requests/${payment.id}/pay`, {
        confirmHandover: payment.confirmHandover === true,
        paymentMethod: finalMethod,
        paymentReference: finalRef,
        tenderedAmount: cashTendered,
        changeAmount,
        splitDetails,
      });

      setPaid({
        ...response.data,
        tenderedAmount: cashTendered,
        changeAmount,
        splitDetails,
      });

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
  const submitRevoke = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${revoke.id}/cancel`, {
        reason: revoke.reason,
      });
      const reqNum = revoke.requestNumber;
      setRevoke(null);
      await load();
      setToast({
        title: "Payment Cancelled / Refunded",
        message: `${reqNum} has been cancelled. Any refund is awaiting payout confirmation under Refunds and returns.`,
        type: "success",
      });
      setTimeout(() => setToast(null), 5000);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const submitPartialCancel = async (event: FormEvent) => {
    event.preventDefault();
    if (!partialCancel) return;
    if (cancellationPreview?.key !== cancellationKey(partialCancel)) return;
    if (!partialCancel.selectedItemIds?.length) {
      setError("Please select at least one item to cancel.");
      return;
    }
    if (!partialCancel.reason || partialCancel.reason.trim().length < 3) {
      setError("Please provide a reason for cancelling the selected items.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await api.post(`/payment-requests/${partialCancel.id}/partial-cancel`, {
        revision: cancellationPreview.revision,
        itemIds: partialCancel.selectedItemIds,
        quantities: partialCancel.quantities,
        reason: partialCancel.reason.trim(),
        skipCustomerReconfirmation: Boolean(partialCancel.skipCustomerReconfirmation),
      });
      const reqNum = partialCancel.requestNumber;
      setPartialCancel(null);
      await load();
      setToast({
        title: "Items Cancelled",
        message: response.data?.message || `Selected items have been cancelled from ${reqNum}.`,
        type: "success",
      });
      setTimeout(() => setToast(null), 5000);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const submitCancelBill = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${cancelBill.id}/cancel`, {
        reason: cancelBill.reason,
      });
      const reqNum = cancelBill.requestNumber;
      setCancelBill(null);
      await load();
      setToast({
        title: "Bill Cancelled",
        message: `${reqNum} has been cancelled and returned to the pharmacist.`,
        type: "success",
      });
      setTimeout(() => setToast(null), 5000);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  // The slip image is fetched as a blob so it inherits the request's auth header rather
  // than needing a public URL.
  useEffect(() => {
    if (!slipReview?.slip) {
      setSlipUrl("");
      return undefined;
    }
    let objectUrl = "";
    let cancelled = false;
    api
      .get(
        `/payment-requests/${slipReview.row.id}/slips/${slipReview.slip.id}/file`,
        { responseType: "blob" },
      )
      .then((response) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(response.data);
        setSlipUrl(objectUrl);
      })
      .catch((caught) => !cancelled && setError(errorMessage(caught)));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [slipReview?.row?.id, slipReview?.slip?.id, slipReview?.slip]);

  const submitSlipReview = async (approved: boolean) => {
    setBusy(true);
    setError("");
    try {
      const response = await api.post(
        `/payment-requests/${slipReview.row.id}/slips/${slipReview.slip.id}/review`,
        { approved, reason: approved ? undefined : slipReview.reason, ...(approved ? { verifiedAmount: Number(slipReview.verifiedAmount), verifiedReference: slipReview.verifiedReference } : {}) },
      );
      const reqNum = slipReview.row.requestNumber;
      setSlipReview(null);
      if (approved) setPaid(response.data);
      await load();
      setToast({
        title: approved ? "Bank Transfer Verified" : "Slip Rejected",
        message: approved
          ? `${reqNum} is paid and ready for the pharmacist.`
          : `${reqNum} has been sent back to the customer for a corrected slip.`,
        type: approved ? "success" : "danger",
      });
      setTimeout(() => setToast(null), 5000);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const openRetail = async () => {
    setError("");
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
    setDocumentPreview({ id: sale.id, kind: 'invoice', name: sale.invoiceNumber });
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
        <div className="d-flex flex-wrap gap-2">
          <DailyBalance />
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
          value={collections.payments}
          icon="check2-circle"
          tone="blue"
        />
        <Metric
          label="Net invoice collections today"
          value={money(
            collections.netCollected,
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
            <option value="SLIP_SUBMITTED">Bank slip to check</option>
            <option value="PAID">Paid — Awaiting dispensing</option>
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
                    {row.events?.length > 0 && (
                      <details className="small mt-2"><summary>Payment and adjustment history</summary>
                        {row.events.map((event: any) => <div className="border-top py-1" key={event.id}>
                          {new Date(event.createdAt).toLocaleString()} · {event.kind.replaceAll("_", " ")} · {money(event.amount)}
                          {event.details?.reason && <div>{event.details.reason}</div>}
                          {event.details?.removedItems?.map((item: any, index: number) => <div key={index}>{item.name} × {item.quantity} {item.unit}</div>)}
                        </div>)}
                      </details>
                    )}
                    {row.customerNote && (
                      <div className="small mt-2"><strong>Customer note: </strong>{row.customerNote}</div>
                    )}
                    {row.customerCancellationReason && (
                      <span className="badge bg-warning text-dark d-block mt-1 text-wrap text-start">
                        <i className="bi bi-exclamation-triangle-fill me-1" />
                        {row.customerCancellationReason}
                      </span>
                    )}
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
                    {row.status === "AWAITING_PAYMENT" && (row.prescription?.isOnline || row.prescription?.sourceUploadId) && (
                      <small className={`d-block mt-1 ${row.acknowledgedRevision !== row.revision ? "text-warning" : "text-secondary"}`}>
                        {row.acknowledgedRevision !== row.revision
                          ? `Waiting for customer acknowledgement of revision ${row.revision}`
                          : row.customerPaymentChoice === "CASH"
                            ? `Cash selected · reserved until ${row.reservationExpiresAt ? new Date(row.reservationExpiresAt).toLocaleString() : "deadline unavailable"}`
                            : "Bank transfer selected · waiting for receipt"}
                      </small>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {row.customerCancellationReason && !["CANCELLED", "FULFILLED"].includes(row.status) && <button className="btn btn-sm btn-warning" onClick={() => setCancellationOverride({ ...row, resolutionReason: "" })}>Resolve cancellation request</button>}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openPdf(row, "handoff")}
                        title="Open pharmacist handoff"
                      >
                        <i className="bi bi-file-earmark-text" />
                      </button>
                      {row.status === "AWAITING_PAYMENT" && (!(row.prescription?.isOnline || row.prescription?.sourceUploadId) || (row.acknowledgedRevision === row.revision && row.customerPaymentChoice === "CASH")) && (
                        <button
                          className={`btn btn-sm ${row.customerCancellationReason ? "btn-warning" : "btn-primary"}`}
                          onClick={() => {
                            setError("");
                            if (row.customerCancellationReason) {
                              setCancellationOverride({ ...row, resolutionReason: "" });
                              return;
                            }
                            openPayment(row);
                          }}
                        >
                          {row.customerCancellationReason
                            ? <><i className="bi bi-exclamation-triangle me-1" />Cancellation Requested</>
                            : "Receive payment"}
                        </button>
                      )}
                      {/* Cashier can cancel a queued-but-unpaid bill */}
                      {["AWAITING_PAYMENT", "SLIP_SUBMITTED"].includes(row.status) && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setError("");
                            setCancelBill({ ...row, reason: "" });
                          }}
                        >
                          <i className="bi bi-x-square me-1" />
                          Cancel bill
                        </button>
                      )}
                      {/* Partial cancellation for multi-item bills */}
                      {["AWAITING_PAYMENT", "SLIP_SUBMITTED", "PAID"].includes(row.status) &&
                        row.items?.length > 0 && (
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => {
                              setError("");
                              setPartialCancel({
                                ...row,
                                selectedItemIds: [],
                                quantities: {},
                                reason: "",
                                skipCustomerReconfirmation: false,
                              });
                            }}
                            title="Cancel specific line items from this bill"
                          >
                            <i className="bi bi-cart-x me-1" />
                            Partial cancel
                          </button>
                        )}
                      {row.status === "SLIP_SUBMITTED" && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setError("");
                            const slip = (row.slips || []).find(
                              (s: any) => s.status === "PENDING",
                            );
                            setSlipReview({ row, slip, reason: "", verifiedAmount: "", verifiedReference: "" });
                          }}
                        >
                          <i className="bi bi-receipt-cutoff me-1" />
                          Check bank slip
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
                      {row.status === "PAID" &&
                        row.paidAt &&
                        (isAdmin ||
                          new Date(row.paidAt).toDateString() ===
                            new Date().toDateString()) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setError("");
                              setRevoke({ ...row, reason: "" });
                            }}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1" />
                            Refund / Cancel payment
                          </button>
                        )}
                      {isAdmin && row.status === "PAID" && (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setPinReset({ ...row, reason: "" })}>Reissue collection PIN</button>
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
      {pinReset && (
        <Modal title="Reissue collection PIN" onClose={() => !busy && setPinReset(null)} size="md">
          <form onSubmit={async (event) => {
            event.preventDefault(); setBusy(true); setError("");
            try {
              const response = await api.post(`/payment-requests/${pinReset.id}/reset-pickup-pin`, { reason: pinReset.reason });
              setPinReset(null); setPaid({ ...response.data, pinReissued: true }); await load();
            } catch (caught) { setError(errorMessage(caught)); }
            finally { setBusy(false); }
          }}>
            <p>Verify the customer's identity first. The previous PIN will stop working. Give the customer a new receipt; payment and reserved stock will not change.</p>
            <label className="form-label" htmlFor="pin-reset-reason">Reason for reissuing</label>
            <textarea id="pin-reset-reason" className="form-control mb-3" required minLength={3} maxLength={500} value={pinReset.reason} onChange={(event) => setPinReset({ ...pinReset, reason: event.target.value })} />
            <button className="btn btn-primary" disabled={busy || pinReset.reason.trim().length < 3}>Reissue PIN</button>
          </form>
        </Modal>
      )}
      {payment && (
        <Modal
          title={`Receive payment — ${payment.requestNumber}`}
          onClose={() => setPayment(null)}
          size="md"
        >
          <form onSubmit={submitPayment}>
            <div className="alert alert-warning">
              <i className="bi bi-person-check me-2" />
              <strong>
                {payment.patient?.fullName || "Walk-in customer"}
              </strong>
              <br />
              <small>{payment.patient?.phone || "No account on file"}</small>
              <br />
              <small>
                Confirm this matches the customer in front of you before
                accepting payment.
              </small>
            </div>
            <div className="alert alert-info">
              <strong>Amount due: {money(payment.total)}</strong>
              <br />
              <small>
                Confirm the customer has paid the full amount.{" "}
                {operationSettings.requirePickupPin
                    ? "A one-time dispensing PIN will be generated on the receipt."
                    : "PIN verification is turned off, so the pharmacist can dispense straight after payment."}
              </small>
            </div>
            {operationSettings.cashierCanDispenseAtPayment && payment.prescription && (
              <label className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={payment.confirmHandover === true} onChange={(event) => setPayment({ ...payment, confirmHandover: event.target.checked })} />
                <span className="form-check-label">I am physically handing these medicines to the customer now. Record collection with this payment.</span>
              </label>
            )}
            {payment.items?.length > 0 && (
              <div className="cashier-payment-items">
                {payment.items.map((item: any) => (
                  <div key={item.id} className="cashier-payment-item">
                    <span>
                      {item.product.genericName} {item.product.strength}
                    </span>
                    <span>
                      × {item.quantity} {item.product.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
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

            <label className="form-label fw-semibold">Payment Method</label>
            <div className="d-grid gap-2 d-sm-flex mb-3">
              {[
                { id: "CASH", label: "Cash", icon: "cash-stack" },
                { id: "CARD", label: "Card", icon: "credit-card" },
                { id: "BANK_TRANSFER", label: "Bank Transfer", icon: "bank" },
                { id: "SPLIT", label: "Split (Cash + Card/Bank)", icon: "pie-chart" },
              ].filter((method) => !(payment.prescription?.isOnline || payment.prescription?.sourceUploadId) || payment.customerPaymentChoice !== "CASH" || method.id === "CASH").map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`btn flex-fill d-flex align-items-center justify-content-center gap-1 py-2 ${
                    payment.paymentMethod === m.id
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    const next = { ...payment, paymentMethod: m.id };
                    const total = Number(payment.total || 0);
                    if (m.id === "CASH" && !next.tenderedAmount) {
                      next.tenderedAmount = String(total);
                    }
                    if (m.id === "SPLIT") {
                      if (!next.splitNonCashMethod) next.splitNonCashMethod = "CARD";
                    }
                    setPayment(next);
                  }}
                >
                  <i className={`bi bi-${m.icon}`} />
                  <span className="small fw-semibold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* ── Cash Payment Mode with Live Change / Balance Calculator ── */}
            {payment.paymentMethod === "CASH" && (() => {
              const total = Number(payment.total || 0);
              const tendered = Number(payment.tenderedAmount || 0);
              const change = Math.round((tendered - total) * 100) / 100;
              const isSufficient = tendered >= total;

              return (
                <div className="card p-3 bg-light border mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-bold mb-0">
                      <i className="bi bi-cash me-1 text-success" /> Cash Tendered by Customer
                    </label>
                    <span className="text-secondary small">Amount due: <strong>{money(total)}</strong></span>
                  </div>

                  <div className="input-group input-group-lg mb-2">
                    <span className="input-group-text fw-bold">Rs.</span>
                    <input
                      type="number"
                      className="form-control fw-bold"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={payment.tenderedAmount ?? ""}
                      onChange={(e) =>
                        setPayment({ ...payment, tenderedAmount: e.target.value })
                      }
                      autoFocus
                    />
                  </div>

                  {/* Quick Denomination / Amount Buttons */}
                  <div className="d-flex gap-1 flex-wrap mb-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setPayment({ ...payment, tenderedAmount: String(total) })}
                    >
                      Exact ({money(total)})
                    </button>
                    {[500, 1000, 2000, 5000].map((denomination) => {
                      if (denomination < total && denomination * 2 < total) return null;
                      return (
                        <button
                          key={denomination}
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            const nextVal = Math.ceil(total / denomination) * denomination;
                            setPayment({ ...payment, tenderedAmount: String(nextVal) });
                          }}
                        >
                          Rs. {denomination.toLocaleString()}
                        </button>
                      );
                    })}
                    {[100, 500, 1000].map((inc) => (
                      <button
                        key={`+${inc}`}
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          const current = Number(payment.tenderedAmount || total);
                          setPayment({ ...payment, tenderedAmount: String(current + inc) });
                        }}
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>

                  {/* Live Balance / Change Display */}
                  {tendered > 0 && (
                    <div
                      className={`p-3 rounded-3 d-flex align-items-center justify-content-between ${
                        isSufficient ? "bg-success bg-opacity-10 border border-success" : "bg-warning bg-opacity-10 border border-warning"
                      }`}
                    >
                      <div>
                        <small className={`fw-semibold d-block ${isSufficient ? "text-success" : "text-dark"}`}>
                          {isSufficient ? "Change to return to customer:" : "Remaining amount needed:"}
                        </small>
                        <strong className={`fs-3 ${isSufficient ? "text-success" : "text-danger"}`}>
                          {money(Math.abs(change))}
                        </strong>
                      </div>
                      <i
                        className={`bi ${
                          isSufficient ? "bi-cash-coin text-success" : "bi-exclamation-circle text-warning"
                        } fs-1 opacity-75`}
                      />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Split Payment Mode (Cash + Card/Bank Transfer) ── */}
            {payment.paymentMethod === "SPLIT" && (() => {
              const total = Number(payment.total || 0);
              const cashAmount = Number(payment.splitCashAmount || 0);
              const nonCashAmount = Number(payment.splitNonCashAmount || 0);
              const cashTendered = Number(payment.splitCashTendered || 0);
              const cashChange = Math.round((cashTendered - cashAmount) * 100) / 100;
              const allocatedTotal = Math.round((cashAmount + nonCashAmount) * 100) / 100;
              const isMatch = Math.abs(allocatedTotal - total) < 0.01;
              const diff = Math.round((total - allocatedTotal) * 100) / 100;

              // Generate smart note presets based on total
              const notePresets = [500, 1000, 2000, 5000].filter(
                (note) => note < total
              );

              // Percentage shares for visual bar
              const cashPct = total > 0 ? Math.min(100, Math.max(0, (cashAmount / total) * 100)) : 0;
              const nonCashPct = total > 0 ? Math.min(100, Math.max(0, (nonCashAmount / total) * 100)) : 0;

              const applySplit = (cash: number, nonCash: number, tender?: number) => {
                const roundedCash = Math.round(cash * 100) / 100;
                const roundedNonCash = Math.round(nonCash * 100) / 100;
                setPayment({
                  ...payment,
                  splitCashAmount: roundedCash > 0 ? String(roundedCash) : "",
                  splitNonCashAmount: roundedNonCash > 0 ? String(roundedNonCash) : "",
                  splitCashTendered: tender !== undefined ? String(tender) : (roundedCash > 0 ? String(roundedCash) : ""),
                });
              };

              return (
                <div className="card p-3 bg-light border mb-3">
                  {/* Top Bar: Title & Total */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-primary d-flex align-items-center gap-2">
                      <i className="bi bi-pie-chart-fill" /> Split Payment Configuration
                    </strong>
                    <span className="badge bg-primary fs-6 px-3 py-2">
                      Total Due: {money(total)}
                    </span>
                  </div>

                  <p className="small text-secondary mb-3">
                    Customer can split this bill between <strong>Cash</strong> and <strong>Card / Bank Transfer</strong> in any custom amount.
                  </p>

                  {/* Quick Preset Buttons */}
                  <div className="mb-3 p-2 bg-white rounded border">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="small fw-semibold text-secondary">
                        <i className="bi bi-lightning-charge me-1" /> Quick Presets:
                      </span>
                      {(cashAmount > 0 || nonCashAmount > 0) && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-decoration-none py-0 px-1 text-danger small"
                          onClick={() => applySplit(0, 0, 0)}
                        >
                          <i className="bi bi-x-circle me-1" /> Clear amounts
                        </button>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      {notePresets.map((note) => (
                        <button
                          key={`preset-note-${note}`}
                          type="button"
                          className={`btn btn-sm ${
                            cashAmount === note
                              ? "btn-success text-white"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() => applySplit(note, total - note, note)}
                        >
                          Rs. {note.toLocaleString()} Cash + Rest
                        </button>
                      ))}
                      {/* Equal 50/50 option as one convenient choice */}
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          Math.abs(cashAmount - (total / 2)) < 0.02 && cashAmount > 0
                            ? "btn-primary text-white"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => {
                          const half = Math.round((total / 2) * 100) / 100;
                          applySplit(half, total - half, half);
                        }}
                      >
                        50/50 Equal ({money(total / 2)})
                      </button>
                    </div>
                  </div>

                  {/* Visual Allocation Distribution Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small fw-semibold mb-1">
                      <span className="text-success">
                        <i className="bi bi-cash me-1" /> Cash: {money(cashAmount)} ({cashPct.toFixed(1)}%)
                      </span>
                      <span className="text-primary">
                        <i className="bi bi-credit-card me-1" /> {payment.splitNonCashMethod === "CARD" ? "Card" : "Transfer"}: {money(nonCashAmount)} ({nonCashPct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${Math.min(100, cashPct)}%` }}
                        title={`Cash: ${money(cashAmount)}`}
                      />
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${Math.min(100 - Math.min(100, cashPct), nonCashPct)}%` }}
                        title={`${payment.splitNonCashMethod === "CARD" ? "Card" : "Transfer"}: ${money(nonCashAmount)}`}
                      />
                      {diff > 0.01 && (
                        <div
                          className="progress-bar bg-warning progress-bar-striped"
                          role="progressbar"
                          style={{ width: `${Math.max(0, (diff / total) * 100)}%` }}
                          title={`Unallocated: ${money(diff)}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Two Split Columns: Cash and Card/Transfer */}
                  <div className="row g-3">
                    {/* Portion 1: Cash */}
                    <div className="col-12 col-md-6">
                      <div className="p-3 bg-white rounded border h-100 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-success">
                            <i className="bi bi-cash-stack me-1" /> 1. Cash Portion
                          </span>
                          {nonCashAmount > 0 && Math.abs(total - nonCashAmount - cashAmount) > 0.01 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success py-0 px-2"
                              style={{ fontSize: "0.75rem" }}
                              onClick={() => {
                                const rem = Math.max(0, Math.round((total - nonCashAmount) * 100) / 100);
                                setPayment({
                                  ...payment,
                                  splitCashAmount: String(rem),
                                  splitCashTendered: String(rem),
                                });
                              }}
                              title="Assign remaining balance to Cash"
                            >
                              Fill Remainder ({money(Math.max(0, total - nonCashAmount))})
                            </button>
                          )}
                        </div>

                        <label className="form-label small fw-semibold">Cash amount to charge</label>
                        <div className="input-group mb-2">
                          <span className="input-group-text fw-semibold">Rs.</span>
                          <input
                            type="number"
                            className="form-control fw-bold text-success"
                            min="0"
                            max={total}
                            step="0.01"
                            placeholder="0.00"
                            value={payment.splitCashAmount ?? ""}
                            onChange={(e) => {
                              const inputVal = e.target.value;
                              const val = Math.max(0, Number(inputVal));
                              const remainder = Math.max(0, Math.round((total - val) * 100) / 100);
                              setPayment({
                                ...payment,
                                splitCashAmount: inputVal,
                                splitNonCashAmount: inputVal !== "" ? String(remainder) : payment.splitNonCashAmount,
                                splitCashTendered: inputVal,
                              });
                            }}
                          />
                        </div>

                        {/* Quick Common Cash Amount Shortcuts */}
                        <div className="d-flex gap-1 flex-wrap mb-3">
                          {[500, 1000, 2000, 5000].map((note) => {
                            if (note > total) return null;
                            return (
                              <button
                                key={`cash-btn-${note}`}
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-0 px-2"
                                style={{ fontSize: "0.75rem" }}
                                onClick={() => {
                                  const rem = Math.max(0, Math.round((total - note) * 100) / 100);
                                  setPayment({
                                    ...payment,
                                    splitCashAmount: String(note),
                                    splitNonCashAmount: String(rem),
                                    splitCashTendered: String(note),
                                  });
                                }}
                              >
                                Rs. {note.toLocaleString()}
                              </button>
                            );
                          })}
                        </div>

                        <label className="form-label small fw-semibold">Cash tendered by customer</label>
                        <div className="input-group mb-2">
                          <span className="input-group-text">Rs.</span>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            step="0.01"
                            placeholder={cashAmount > 0 ? String(cashAmount) : "0.00"}
                            value={payment.splitCashTendered ?? ""}
                            onChange={(e) =>
                              setPayment({ ...payment, splitCashTendered: e.target.value })
                            }
                          />
                          {cashAmount > 0 && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                setPayment({ ...payment, splitCashTendered: String(cashAmount) })
                              }
                            >
                              Exact
                            </button>
                          )}
                        </div>

                        {/* Denomination shortcuts for Cash Tendered */}
                        {cashAmount > 0 && (
                          <div className="d-flex gap-1 flex-wrap mb-2">
                            {[500, 1000, 2000, 5000].map((denom) => {
                              if (denom < cashAmount) return null;
                              return (
                                <button
                                  key={`split-tender-denom-${denom}`}
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary py-0 px-1"
                                  style={{ fontSize: "0.72rem" }}
                                  onClick={() =>
                                    setPayment({ ...payment, splitCashTendered: String(denom) })
                                  }
                                >
                                  Rs. {denom.toLocaleString()}
                                </button>
                              );
                            })}
                            {[100, 500].map((inc) => (
                              <button
                                key={`split-tender-inc-${inc}`}
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-0 px-1"
                                style={{ fontSize: "0.72rem" }}
                                onClick={() => {
                                  const cur = Number(payment.splitCashTendered || cashAmount);
                                  setPayment({ ...payment, splitCashTendered: String(cur + inc) });
                                }}
                              >
                                +{inc}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Live Change / Balance indicator */}
                        {cashTendered > 0 && cashAmount > 0 && (
                          <div
                            className={`p-2 rounded border mt-2 ${
                              cashChange >= 0
                                ? "bg-success bg-opacity-10 border-success"
                                : "bg-warning bg-opacity-10 border-warning"
                            }`}
                          >
                            <span className="text-secondary small d-block">
                              {cashChange >= 0 ? "Cash Change to Return:" : "Cash Tendered is Short:"}
                            </span>
                            <strong className={cashChange >= 0 ? "text-success fs-5" : "text-danger fs-5"}>
                              {cashChange >= 0 ? money(cashChange) : `Short by ${money(Math.abs(cashChange))}`}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Portion 2: Card / Bank Transfer */}
                    <div className="col-12 col-md-6">
                      <div className="p-3 bg-white rounded border h-100 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-primary">
                            <i className="bi bi-credit-card me-1" /> 2. Card / Transfer Portion
                          </span>
                          {cashAmount > 0 && Math.abs(total - cashAmount - nonCashAmount) > 0.01 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-0 px-2"
                              style={{ fontSize: "0.75rem" }}
                              onClick={() => {
                                const rem = Math.max(0, Math.round((total - cashAmount) * 100) / 100);
                                setPayment({
                                  ...payment,
                                  splitNonCashAmount: String(rem),
                                });
                              }}
                              title="Assign remaining balance to Card/Transfer"
                            >
                              Fill Remainder ({money(Math.max(0, total - cashAmount))})
                            </button>
                          )}
                        </div>

                        <label className="form-label small fw-semibold">Payment method</label>
                        <select
                          className="form-select mb-2"
                          value={payment.splitNonCashMethod || "CARD"}
                          onChange={(e) =>
                            setPayment({ ...payment, splitNonCashMethod: e.target.value })
                          }
                        >
                          <option value="CARD">💳 Card Payment (POS)</option>
                          <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
                        </select>

                        <label className="form-label small fw-semibold">Amount to charge</label>
                        <div className="input-group mb-2">
                          <span className="input-group-text fw-semibold">Rs.</span>
                          <input
                            type="number"
                            className="form-control fw-bold text-primary"
                            min="0"
                            max={total}
                            step="0.01"
                            placeholder="0.00"
                            value={payment.splitNonCashAmount ?? ""}
                            onChange={(e) => {
                              const inputVal = e.target.value;
                              const val = Math.max(0, Number(inputVal));
                              const remainder = Math.max(0, Math.round((total - val) * 100) / 100);
                              setPayment({
                                ...payment,
                                splitNonCashAmount: inputVal,
                                splitCashAmount: inputVal !== "" ? String(remainder) : payment.splitCashAmount,
                                splitCashTendered: inputVal !== "" ? String(remainder) : payment.splitCashTendered,
                              });
                            }}
                          />
                        </div>

                        {/* Quick Common Card Amount Shortcuts */}
                        <div className="d-flex gap-1 flex-wrap mb-3">
                          {[500, 1000, 2000, 5000].map((cardVal) => {
                            if (cardVal > total) return null;
                            return (
                              <button
                                key={`card-btn-${cardVal}`}
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-0 px-2"
                                style={{ fontSize: "0.75rem" }}
                                onClick={() => {
                                  const rem = Math.max(0, Math.round((total - cardVal) * 100) / 100);
                                  setPayment({
                                    ...payment,
                                    splitNonCashAmount: String(cardVal),
                                    splitCashAmount: String(rem),
                                    splitCashTendered: String(rem),
                                  });
                                }}
                              >
                                Rs. {cardVal.toLocaleString()}
                              </button>
                            );
                          })}
                        </div>

                        <label className="form-label small fw-semibold">
                          {payment.splitNonCashMethod === "CARD"
                            ? "Card Slip / Approval Ref (optional)"
                            : "Bank Transfer Ref (optional)"}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength={60}
                          placeholder={
                            payment.splitNonCashMethod === "CARD"
                              ? "e.g. POS Transaction / Approval #4829"
                              : "e.g. Bank slip or transaction ID"
                          }
                          value={payment.splitNonCashReference || ""}
                          onChange={(e) =>
                            setPayment({ ...payment, splitNonCashReference: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Allocation Status Indicator */}
                  <div className="mt-3">
                    {isMatch ? (
                      <div className="alert alert-success py-2 px-3 mb-0 small d-flex align-items-center justify-content-between">
                        <span>
                          <i className="bi bi-check-circle-fill me-2" />
                          Split matched: <strong>Cash {money(cashAmount)}</strong> + <strong>{payment.splitNonCashMethod === "CARD" ? "Card" : "Transfer"} {money(nonCashAmount)}</strong>
                        </span>
                        <strong>Total: {money(total)}</strong>
                      </div>
                    ) : diff > 0 ? (
                      <div className="alert alert-warning py-2 px-3 mb-0 small d-flex align-items-center justify-content-between">
                        <span>
                          <i className="bi bi-exclamation-triangle-fill me-2" />
                          Under-allocated: <strong>{money(diff)}</strong> remaining to be assigned.
                        </span>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark py-0 px-2"
                            style={{ fontSize: "0.75rem" }}
                            onClick={() => {
                              const newCash = Math.round((cashAmount + diff) * 100) / 100;
                              setPayment({
                                ...payment,
                                splitCashAmount: String(newCash),
                                splitCashTendered: String(newCash),
                              });
                            }}
                          >
                            + Add to Cash
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark py-0 px-2"
                            style={{ fontSize: "0.75rem" }}
                            onClick={() => {
                              const newNonCash = Math.round((nonCashAmount + diff) * 100) / 100;
                              setPayment({
                                ...payment,
                                splitNonCashAmount: String(newNonCash),
                              });
                            }}
                          >
                            + Add to Card
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-danger py-2 px-3 mb-0 small d-flex align-items-center justify-content-between">
                        <span>
                          <i className="bi bi-exclamation-octagon-fill me-2" />
                          Over-allocated by <strong>{money(Math.abs(diff))}</strong> (Allocated: {money(allocatedTotal)} vs Total: {money(total)}).
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => {
                            if (cashAmount >= Math.abs(diff)) {
                              const newCash = Math.round((cashAmount - Math.abs(diff)) * 100) / 100;
                              setPayment({
                                ...payment,
                                splitCashAmount: String(newCash),
                                splitCashTendered: String(newCash),
                              });
                            } else {
                              const newNonCash = Math.round((nonCashAmount - Math.abs(diff)) * 100) / 100;
                              setPayment({
                                ...payment,
                                splitNonCashAmount: String(newNonCash),
                              });
                            }
                          }}
                        >
                          Auto-balance
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── Card Payment direct mode ── */}
            {payment.paymentMethod === "CARD" && (
              <div className="card p-3 bg-light border mb-3">
                <label className="form-label">
                  <i className="bi bi-credit-card me-1" /> Card Slip / Authorization Code <span className="text-secondary fw-normal">(optional)</span>
                </label>
                <input
                  className="form-control"
                  value={payment.paymentReference || ""}
                  onChange={(event) =>
                    setPayment({ ...payment, paymentReference: event.target.value })
                  }
                  maxLength={120}
                  placeholder="e.g. POS Transaction / Approval #4829"
                />
              </div>
            )}

            {/* ── Bank Transfer direct mode ── */}
            {payment.paymentMethod === "BANK_TRANSFER" && (
              <div className="card p-3 bg-light border mb-3">
                <label className="form-label">
                  <i className="bi bi-bank me-1" /> Bank Transfer Reference Number <span className="text-secondary fw-normal">(optional)</span>
                </label>
                <input
                  className="form-control"
                  value={payment.paymentReference || ""}
                  onChange={(event) =>
                    setPayment({ ...payment, paymentReference: event.target.value })
                  }
                  maxLength={120}
                  placeholder="e.g. Online transfer reference or deposit slip #"
                />
              </div>
            )}

            <Alert message={error} />
            {(() => {
              const total = Number(payment.total || 0);
              const isCashSufficient = payment.paymentMethod !== "CASH" || Number(payment.tenderedAmount || total) >= total;
              const isSplitValid = payment.paymentMethod !== "SPLIT" || (
                (Number(payment.splitCashAmount || 0) > 0 || Number(payment.splitNonCashAmount || 0) > 0) &&
                Math.abs((Number(payment.splitCashAmount || 0) + Number(payment.splitNonCashAmount || 0)) - total) < 0.01 &&
                Number(payment.splitCashTendered || payment.splitCashAmount || 0) >= Number(payment.splitCashAmount || 0)
              );
              const canSubmit = isCashSufficient && isSplitValid;

              return (
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setPayment(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={busy || !canSubmit}
                  >
                    {busy ? "Processing..." : `Confirm Payment of ${money(payment.total)}`}
                  </button>
                </div>
              );
            })()}
          </form>
        </Modal>
      )}
      {slipReview && (
        <Modal
          title={`Bank transfer slip — ${slipReview.row.requestNumber}`}
          onClose={() => setSlipReview(null)}
          size="lg"
        >
          {!slipReview.slip ? (
            <Alert message="No slip is waiting for review on this bill." />
          ) : (
            <>
              <div className="alert alert-info">
                <strong>Check this against the bank before accepting.</strong>
                <br />
                <small>
                  The customer states they transferred{" "}
                  {money(slipReview.slip.declaredAmount)}. This bill is for{" "}
                  {money(slipReview.row.total)}.
                </small>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Amount stated</label>
                  <div className="form-control bg-light">
                    <strong>{money(slipReview.slip.declaredAmount)}</strong>
                  </div>
                  {Number(slipReview.slip.declaredAmount) !==
                    Number(slipReview.row.total) && (
                    <small className="text-danger">
                      This does not match the invoice total.
                    </small>
                  )}
                </div>
                <div>
                  <label className="form-label">Invoice total</label>
                  <div className="form-control bg-light">
                    <strong>{money(slipReview.row.total)}</strong>
                  </div>
                </div>
                <div>
                  <label className="form-label">Bank reference</label>
                  <div className="form-control bg-light">
                    {slipReview.slip.reference || "Not given"}
                  </div>
                </div>
                <div>
                  <label className="form-label">Paid on</label>
                  <div className="form-control bg-light">
                    {slipReview.slip.paidOn
                      ? new Date(slipReview.slip.paidOn).toLocaleDateString()
                      : "Not given"}
                  </div>
                </div>
                <div className="full">
                  <label className="form-label">Paid into</label>
                  <div className="form-control bg-light">
                    {slipReview.slip.bankAccount
                      ? `${slipReview.slip.bankAccount.bankName} · ${slipReview.slip.bankAccount.accountNumber}`
                      : "Account not stated"}
                  </div>
                </div>
                {slipReview.slip.note && (
                  <div className="full">
                    <label className="form-label">Customer note</label>
                    <div className="form-control bg-light">
                      {slipReview.slip.note}
                    </div>
                  </div>
                )}
              </div>

              <label className="form-label mt-3">Uploaded slip</label>
              {slipUrl ? (
                slipReview.slip.mimeType === "application/pdf" ? (
                  <iframe
                    title="Payment slip"
                    src={slipUrl}
                    style={{
                      width: "100%",
                      height: 340,
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <a href={slipUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={slipUrl}
                      alt="Payment slip"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 340,
                        border: "1px solid var(--line)",
                        borderRadius: 10,
                      }}
                    />
                  </a>
                )
              ) : (
                <div className="text-secondary small">Loading the slip…</div>
              )}

              <label className="form-label mt-3">
                Reason (required only if you are rejecting)
              </label>
              <textarea
                className="form-control"
                value={slipReview.reason}
                onChange={(event) =>
                  setSlipReview({ ...slipReview, reason: event.target.value })
                }
                placeholder="For example: no matching credit found in the bank statement."
              />
              <div className="row g-3 mt-1">
                <div className="col-sm-6"><label className="form-label" htmlFor="verified-transfer-amount">Amount verified in bank statement</label><input id="verified-transfer-amount" className="form-control" type="number" min="0.01" step="0.01" value={slipReview.verifiedAmount} onChange={(event) => setSlipReview({ ...slipReview, verifiedAmount: event.target.value })} /></div>
                <div className="col-sm-6"><label className="form-label" htmlFor="verified-transfer-reference">Verified bank transaction reference</label><input id="verified-transfer-reference" className="form-control" maxLength={120} value={slipReview.verifiedReference} onChange={(event) => setSlipReview({ ...slipReview, verifiedReference: event.target.value })} /></div>
              </div>
              <p className="small text-secondary mt-2">The bank-verified amount, customer's declared amount and invoice total must match. Reconcile any underpayment or excess before approval.</p>

              <Alert message={error} />
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSlipReview(null)}
                  disabled={busy}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => submitSlipReview(false)}
                  disabled={busy || slipReview.reason.trim().length < 3}
                >
                  Reject slip
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => submitSlipReview(true)}
                  disabled={busy || !slipReview.verifiedReference?.trim() || Number(slipReview.verifiedAmount) !== Number(slipReview.row.total) || Number(slipReview.verifiedAmount) !== Number(slipReview.slip.declaredAmount) || !!slipReview.row.customerCancellationReason}
                >
                  {busy ? "Working…" : "Verify and mark paid"}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
      {cancelBill && (
        <Modal
          title={`Cancel bill — ${cancelBill.requestNumber}`}
          onClose={() => setCancelBill(null)}
          size="sm"
        >
          <form onSubmit={submitCancelBill}>
            <div className="alert alert-warning small">
              <i className="bi bi-exclamation-triangle me-2" />
              This bill has <strong>not been paid yet</strong>. Cancelling it
              removes it from the payment queue. The pharmacist will need to
              re-send it if the customer still wants to pay.
              {cancelBill.status === "SLIP_SUBMITTED" && (
                <>
                  <br />
                  <strong className="text-danger">
                    A bank transfer slip is pending on this bill. Cancelling
                    it will reject the pending slip — verify the slip is
                    fraudulent or incorrect before proceeding.
                  </strong>
                </>
              )}
            </div>
            {cancelBill.items?.length > 0 && (
              <div className="cashier-payment-items mb-3">
                {cancelBill.items.map((item: any) => (
                  <div key={item.id} className="cashier-payment-item">
                    <span>{item.product.genericName} {item.product.strength}</span>
                    <span>× {item.quantity} {item.product.unit} — {money(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            )}
            <label className="form-label">Reason for cancellation (required)</label>
            <textarea
              className="form-control"
              minLength={3}
              maxLength={500}
              value={cancelBill.reason}
              onChange={(event) =>
                setCancelBill({ ...cancelBill, reason: event.target.value })
              }
              placeholder="e.g. Customer changed their mind, wrong items billed, re-quote needed…"
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setCancelBill(null)}
              submitLabel="Cancel bill"
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {revoke && (
        <Modal
          title={`Refund / Cancel payment — ${revoke.requestNumber}`}
          onClose={() => setRevoke(null)}
          size="sm"
        >
          <form onSubmit={submitRevoke}>
            <div className="alert alert-danger small">
              <i className="bi bi-exclamation-triangle me-2" />
              This bill has already been paid ({money(revoke.total)}). Cancelling it
              will authorize a refund awaiting payout confirmation, cancel the bill and its receipt PIN, and release reserved inventory. Record the actual repayment under Refunds and returns.{" "}
              {isAdmin
                ? "As an admin you can refund/cancel this on any day."
                : "It can only be done on the same day it was paid; an admin can override that."}
            </div>
            <label className="form-label">Reason for refund / cancellation (required)</label>
            <textarea
              className="form-control"
              minLength={3}
              maxLength={500}
              value={revoke.reason}
              onChange={(event) =>
                setRevoke({ ...revoke, reason: event.target.value })
              }
              placeholder="e.g. Customer cancelled order, wrong items billed, duplicate payment..."
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setRevoke(null)}
              submitLabel="Refund & cancel bill"
              busy={busy}
            />
          </form>
        </Modal>
      )}

      {partialCancel && (() => {
        const selectedItems = partialCancel.items.filter((item: any) =>
          partialCancel.selectedItemIds.includes(item.id),
        );
        const allSelected = selectedItems.length === partialCancel.items.length;
        const canSkipCustomerReconfirmation =
          partialCancel.status === "AWAITING_PAYMENT" &&
          partialCancel.acknowledgedRevision === partialCancel.revision &&
          ["CASH", "BANK_TRANSFER"].includes(partialCancel.customerPaymentChoice) &&
          (partialCancel.customerPaymentChoice !== "CASH" ||
            (partialCancel.reservationExpiresAt &&
              new Date(partialCancel.reservationExpiresAt) > new Date()));

        return (
          <Modal
            title={`Partial Bill Cancellation — ${partialCancel.requestNumber}`}
            onClose={() => setPartialCancel(null)}
            size="md"
          >
            <form onSubmit={submitPartialCancel}>
              <div className="alert alert-warning small">
                <i className="bi bi-info-circle me-2" />
                Select the specific line items you wish to cancel. Stock reserved for the selected items will be released back to inventory, and the bill total will be recalculated.
              </div>
              <div className="table-responsive mb-3">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={allSelected}
                          onChange={(e) => {
                            setPartialCancel({
                              ...partialCancel,
                              selectedItemIds: e.target.checked
                                ? partialCancel.items.map((it: any) => it.id)
                                : [],
                            });
                          }}
                        />
                      </th>
                      <th>Item</th>
                      <th className="text-end">Qty</th>
                      <th className="text-end">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partialCancel.items.map((item: any) => {
                      const isChecked = partialCancel.selectedItemIds.includes(item.id);
                      return (
                        <tr key={item.id} className={isChecked ? "table-danger" : ""}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isChecked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...partialCancel.selectedItemIds, item.id]
                                  : partialCancel.selectedItemIds.filter((id: number) => id !== item.id);
                                setPartialCancel({ ...partialCancel, selectedItemIds: next });
                              }}
                            />
                          </td>
                          <td>
                            <strong>{item.product.genericName}</strong> {item.product.strength}
                            <small className="d-block text-secondary">{item.product.unit}</small>
                          </td>
                          <td className="text-end"><input aria-label={`Cancel quantity of ${item.product.genericName}`} className="form-control form-control-sm" type="number" min={stockQuantityStep(item.product.unit)} step={stockQuantityStep(item.product.unit)} max={Number(item.quantity)} disabled={!isChecked} value={partialCancel.quantities?.[item.id] ?? Number(item.quantity)} onChange={(event) => setPartialCancel({ ...partialCancel, quantities: { ...partialCancel.quantities, [item.id]: event.target.value } })} /><small>of {item.quantity}</small></td>
                          <td className="text-end">{money(item.lineTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {selectedItems.length > 0 && (
                <div className="p-3 bg-light rounded border mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Items selected to cancel:</span>
                    <strong>{selectedItems.length} of {partialCancel.items.length}</strong>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{partialCancel.status === "PAID" ? "Refund amount:" : "Invoice reduction:"}</span>
                    <strong className="text-danger">{cancellationPreview ? money(partialCancel.status === "PAID" ? cancellationPreview.refundAmount : Number(partialCancel.total) - Number(cancellationPreview.total)) : "Calculating…"}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Revised bill total:</strong>
                    <strong className="text-primary">{cancellationPreview ? money(cancellationPreview.total) : "Calculating…"}</strong>
                  </div>
                  {allSelected && (
                    <div className="alert alert-danger py-1 px-2 mt-2 mb-0 small">
                      <i className="bi bi-exclamation-triangle me-1" />
                      All items are selected. This will cancel the entire bill.
                    </div>
                  )}
                </div>
              )}

              <label className="form-label">Reason for cancellation (required)</label>
              <textarea
                className="form-control"
                minLength={3}
                maxLength={500}
                value={partialCancel.reason}
                onChange={(event) =>
                  setPartialCancel({ ...partialCancel, reason: event.target.value })
                }
                placeholder="e.g. Patient does not need item X, out of stock, wrong product selected..."
                required
              />
              {canSkipCustomerReconfirmation && !allSelected && (
                <label className="d-flex align-items-start gap-2 border rounded-3 p-3 mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input mt-1"
                    checked={Boolean(partialCancel.skipCustomerReconfirmation)}
                    onChange={(event) =>
                      setPartialCancel({
                        ...partialCancel,
                        skipCustomerReconfirmation: event.target.checked,
                      })
                    }
                  />
                  <span>
                    <strong>Keep the customer&apos;s existing confirmation</strong>
                    <small className="d-block text-secondary mt-1">
                      Use this only when removing items does not require the customer to
                      review the reduced bill again. Their current payment choice
                      ({partialCancel.customerPaymentChoice === "CASH"
                        ? "cash at pharmacy"
                        : "bank transfer"}) will remain active.
                    </small>
                  </span>
                </label>
              )}
              <Alert message={error} />
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setPartialCancel(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={busy || cancellationPreview?.key !== cancellationKey(partialCancel)}
                >
                  {busy ? "Processing..." : `Cancel ${selectedItems.length} selected item${selectedItems.length === 1 ? "" : "s"}`}
                </button>
              </div>
            </form>
          </Modal>
        );
      })()}
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
                        description: `${candidate.sku} · ${money(candidate.sellingPrice)} · Stock ${candidate.batches.reduce((sum: number, batch: any) => sum + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0), 0)}`,
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
                      min={stockQuantityStep(product?.unit)}
                      max={stock || undefined}
                      step={stockQuantityStep(product?.unit)}
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
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary mt-1"
                  onClick={() =>
                    setRetail({ ...retail, amountPaid: String(retailSubtotal.toFixed(2)) })
                  }
                >
                  Exact ({money(retailSubtotal)})
                </button>
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
                  <option value="OTHER">Other / Split</option>
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
            {retail.paymentMethod === "CASH" && Number(retail.amountPaid) > 0 && (
              <div className="mt-3 p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Change / Balance to return:</span>
                <strong
                  className={
                    Number(retail.amountPaid) >= retailSubtotal
                      ? "text-success fs-4"
                      : "text-danger fs-5"
                  }
                >
                  {Number(retail.amountPaid) >= retailSubtotal
                    ? money(Number(retail.amountPaid) - retailSubtotal)
                    : `Short by ${money(retailSubtotal - Number(retail.amountPaid))}`}
                </strong>
              </div>
            )}
            <Alert message={error} />
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
          title={paid.pinReissued ? "Collection PIN reissued" : "Payment completed"}
          onClose={() => setPaid(null)}
          size="sm"
        >
          <div className="alert alert-success">
            {paid.pinReissued ? "New PIN issued. The previous PIN is no longer valid; no payment was taken." : "Payment recorded successfully."}
          </div>
          {paid.changeAmount > 0 && (
            <div className="p-3 mb-3 rounded-3 bg-success bg-opacity-10 border border-success d-flex align-items-center justify-content-between">
              <div>
                <small className="text-secondary fw-semibold d-block">Cash Balance / Change to Return</small>
                <strong className="fs-3 text-success">{money(paid.changeAmount)}</strong>
              </div>
              <i className="bi bi-cash-coin fs-1 text-success opacity-75" />
            </div>
          )}
          {paid.splitDetails?.isSplit && (
            <div className="alert alert-info py-2 px-3 small mb-3">
              <div className="fw-bold mb-1"><i className="bi bi-pie-chart me-1" /> Split Payment Breakdown:</div>
              <div>• Cash: <strong>{money(paid.splitDetails.cashAmount)}</strong> {paid.changeAmount > 0 ? `(Given: ${money(paid.tenderedAmount)}, Change: ${money(paid.changeAmount)})` : ""}</div>
              <div>• {paid.splitDetails.nonCashMethod === "CARD" ? "Card" : "Bank Transfer"}: <strong>{money(paid.splitDetails.nonCashAmount)}</strong> {paid.splitDetails.nonCashReference ? `(Ref: ${paid.splitDetails.nonCashReference})` : ""}</div>
            </div>
          )}
          {paid.dispensed ? (
            <div className="alert alert-primary">
              <strong>Medicine dispensed.</strong> Invoice{" "}
              {paid.dispensed.invoiceNumber} — hand the items over to the
              customer now.
            </div>
          ) : operationSettings.requirePickupPin ? (
            <>
              <label className="form-label">Dispensing verification PIN</label>
              <div
                className="display-5 text-center fw-bold border rounded-3 py-3 text-primary"
                style={{ letterSpacing: "0.35em" }}
              >
                {paid.pickupPin}
              </div>
              <p className="text-secondary small mt-2">
                Give the printed receipt to the customer. The pharmacist must
                enter this PIN before medicines can leave the pharmacy.
              </p>
            </>
          ) : (
            <p className="text-secondary small mt-2">
              Give the printed receipt to the customer. PIN verification is
              turned off for this pharmacy, so they can collect straight from
              the pharmacist.
            </p>
          )}
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={() => openPdf(paid.data, "receipt")}
            >
              <i className="bi bi-printer me-2" />
              {operationSettings.requirePickupPin && !paid.dispensed
                ? "Print physical receipt with PIN"
                : "Print physical receipt"}
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
          <div className={`toast toast-${toast.type} d-flex align-items-start gap-2`} role={toast.type === 'danger' ? 'alert' : 'status'} aria-live={toast.type === 'danger' ? 'assertive' : 'polite'}>
            <i className={`bi bi-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'} toast-icon`} />
            <div className="toast-body">
              <strong>{toast.title}</strong>
              <span>{toast.message}</span>
            </div>
            <button type="button" className="toast-close" aria-label="Dismiss notification" onClick={() => setToast(null)}>
              <i className="bi bi-x" />
            </button>
          </div>
        </div>
      )}
      {cancellationOverride && (
        <Modal title="Customer requested cancellation" onClose={() => setCancellationOverride(null)} size="sm">
          <div className="alert alert-warning"><i className="bi bi-exclamation-triangle" aria-hidden="true" /><div><strong>Do not collect payment unless the customer has changed their mind.</strong><div className="small mt-1">Reason: {cancellationOverride.customerCancellationReason}</div></div></div>
          <p className="text-secondary small">Confirm only when the customer is present and explicitly wishes to continue with this bill.</p>
          <label className="form-label" htmlFor="cancellation-resolution">Reason for continuing (record the customer's agreement)</label><textarea id="cancellation-resolution" className="form-control" maxLength={500} value={cancellationOverride.resolutionReason} onChange={(event) => setCancellationOverride({ ...cancellationOverride, resolutionReason: event.target.value })} />
          <Alert message={error} />
          <div className="modal-actions"><button type="button" className="btn btn-light" onClick={() => setCancellationOverride(null)}>Keep cancellation request</button><button type="button" className="btn btn-warning" disabled={busy || cancellationOverride.resolutionReason.trim().length < 3} onClick={async () => { setBusy(true); try { await api.post(`/payment-requests/${cancellationOverride.id}/resolve-cancellation`, { revision: cancellationOverride.revision, requestReason: cancellationOverride.customerCancellationReason, reason: cancellationOverride.resolutionReason }); setCancellationOverride(null); await load(); } catch (caught) { setError(errorMessage(caught)); } finally { setBusy(false); } }}>Resolve and allow order to continue</button></div>
        </Modal>
      )}
      {documentPreview && <DocumentPreview document={documentPreview} onClose={() => setDocumentPreview(null)} />}
      <div className="mt-4"><Link className="btn btn-outline-primary" to="/sales">Find a completed invoice / create a refund</Link></div>
      <RefundWorkspace refreshToken={rows} />
    </>
  );
}
