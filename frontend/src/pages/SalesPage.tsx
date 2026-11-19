import { formatPharmacyDate, formatPharmacyDateTime, pharmacyTodayDateInput } from "../utils/pharmacyTime";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { api, errorMessage } from "../api/client";
import { stockQuantityStep } from "../utils/unitMeasure";
import { useHistoryPage } from "../api/useHistoryPage";
import { useAuth } from "../auth/useAuth";
import { Modal, ModalActions } from "../components/Modal";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import { InvoiceChanges } from "../components/InvoiceChanges";
import { DocumentPreview, type DocumentTarget } from "../components/DocumentPreview";
import { RefundWorkspace } from "../components/RefundWorkspace";
import { Link } from 'react-router-dom';

const emptyRetail = () => ({
  patientId: "",
  couponCode: "",
  tax: 0,
  amountPaid: 0,
  paymentMethod: "CASH",
  items: [{ productId: "", quantity: 1 }],
});
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;

function BankAccountDetails({
  accounts,
  reference,
}: {
  accounts: any[];
  reference: string;
}) {
  return (
    <div className="mt-3">
      <div className="fw-semibold mb-2">
        <i className="bi bi-bank me-2" />
        Pharmacy bank details
      </div>
      <div className="row g-2">
        {accounts.map((account) => (
          <div className="col-md-6" key={account.id}>
            <div className="border rounded-3 bg-white p-3 h-100 text-body">
              <strong className="d-block">{account.bankName}</strong>
              <small className="d-block mt-1">
                Account name: <strong>{account.accountName}</strong>
              </small>
              <small className="d-block">
                Account number: <strong className="user-select-all">{account.accountNumber}</strong>
              </small>
              {account.branch && (
                <small className="d-block">Branch: {account.branch}</small>
              )}
              {account.instructions && (
                <small className="d-block text-secondary mt-2">
                  {account.instructions}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
      <small className="d-block text-secondary mt-2">
        Use <strong>{reference}</strong> as the transfer reference. Upload the
        receipt after acknowledging this invoice; stock is reserved only after
        cashier verification.
      </small>
    </div>
  );
}

import { WorkflowGuard } from '../components/WorkflowGuard';
export function SalesPage() {
  const { get: readSales, controls: salesHistoryControls } = useHistoryPage('Final invoices');
  const { user } = useAuth();
  const staff = user!.role !== "PATIENT";
  const { get: readOrders, controls: orderHistoryControls } = useHistoryPage('Order invoices', staff ? { type: 'RETAIL' } : {});
  const isCashier = user!.role === "CASHIER";
  const isAdmin = user!.role === "ADMIN";
  const canDirectRetail =
    user!.role === "ADMIN" || isCashier || Boolean(user!.cashierAccess);
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [retailRequests, setRetailRequests] = useState<any[]>([]);
  const [operationSettings, setOperationSettings] = useState({
    requirePickupPin: true,
    cashierCanDispenseAtPayment: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoiceLoadFailed, setInvoiceLoadFailed] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [retail, setRetail] = useState<any>(null);
  const [handover, setHandover] = useState<any>(null);
  const [voidTarget, setVoidTarget] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [invoiceBusy, setInvoiceBusy] = useState<number | null>(null);
  const [documentPreview, setDocumentPreview] = useState<DocumentTarget | null>(null);
  // Patient-side online payment
  const [myInvoices, setMyInvoices] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [payOnline, setPayOnline] = useState<any>(null);
  const [invoiceAck, setInvoiceAck] = useState<any>(null);
  const [declineTarget, setDeclineTarget] = useState<any>(null);
  const [cancelRequestTarget, setCancelRequestTarget] = useState<any>(null);
  const load = useCallback(async () => {
    setError("");
    setInvoiceLoadFailed(false);
    try {
      // Supporting queries must not hide successfully loaded invoices/returns.
      const requests = [readSales("/sales").then((result) => setRows(result.data.data)).catch((caught) => {
        setRows([]); setInvoiceLoadFailed(true); throw caught;
      })];
      if (staff) {
        if (isCashier) {
          requests.push(api.get("/cashier/retail-options").then((result) => {
            setProducts(result.data.data.products.map((product: any) => ({ ...product, active: true, prescriptionRequired: false })));
            setPatients(result.data.data.patients.map((patient: any) => ({ id: patient.id, user: patient, patientNumber: "Customer" })));
          }));
        } else {
          requests.push(api.get("/catalog/products").then((result) => setProducts(result.data.data)));
          requests.push(api.get("/patients").then((result) => setPatients(result.data.data)));
        }
        requests.push(readOrders("/payment-requests").then((result) => setRetailRequests(result.data.data.filter((request: any) => request.type === "RETAIL"))));
        requests.push(api.get("/settings/operations").then((result) => setOperationSettings(result.data.data)));
      } else {
        requests.push(readOrders("/payment-requests").then((result) => setMyInvoices(result.data.data)));
        requests.push(api.get("/bank-accounts").then((result) => setBankAccounts(result.data.data)));
      }
      const results = await Promise.allSettled(requests);
      const failures = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      if (failures.length) setError([...new Set(failures.map((result) => errorMessage(result.reason)))].join(" "));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [staff, isCashier, readSales, readOrders]);
  const searchPatients = useCallback(async (query: string) => {
    if (query.length < 2) return;
    try {
      const response = await api.get(isCashier ? '/cashier/patients' : '/patients', { params: { search: query } });
      const matches = isCashier ? response.data.data.map((patient: any) => ({ id: patient.id, user: patient, patientNumber: patient.patientProfile?.patientNumber || 'Customer' })) : response.data.data;
      setPatients((prev) => {
        const byId = new Map(prev.map((patient: any) => [patient.id, patient]));
        for (const patient of matches) byId.set(patient.id, patient);
        return [...byId.values()];
      });
    } catch {
      // best-effort live search; keep whatever options are already loaded
    }
  }, [isCashier]);
  const searchProducts = useCallback(async (query: string) => {
    if (isCashier) return;
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
  }, [isCashier]);
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
    setError("");
    try {
      await api.post(`/sales/${payment.id}/pay`, {
        amount: Number(payment.amount),
        paymentMethod: payment.paymentMethod,
        paymentReference: payment.paymentReference || null,
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
  const submitSlip = async (event: FormEvent) => {
    event.preventDefault();
    if (!payOnline.file) {
      setError("Attach the bank slip before sending it.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Could not read that file."));
        reader.readAsDataURL(payOnline.file);
      });
      await api.post(`/payment-requests/${payOnline.invoice.id}/slip`, {
        originalName: payOnline.file.name,
        mimeType: payOnline.file.type,
        fileBase64,
        declaredAmount: Number(payOnline.declaredAmount),
        bankAccountId: payOnline.bankAccountId
          ? Number(payOnline.bankAccountId)
          : null,
        reference: payOnline.reference || null,
        paidOn: payOnline.paidOn || null,
        note: payOnline.note || null,
      });
      setPayOnline(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const acknowledgeInvoice = async (event: FormEvent) => {
    event.preventDefault();
    if (!invoiceAck) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${invoiceAck.invoice.id}/${invoiceAck.changeChoice ? "payment-choice" : "acknowledge"}`, {
        revision: invoiceAck.invoice.revision,
        paymentChoice: invoiceAck.paymentChoice,
        customerNote: invoiceAck.customerNote || null,
      });
      setInvoiceAck(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const applyInvoiceCoupon = async () => {
    if (!invoiceAck || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await api.post(`/payment-requests/${invoiceAck.invoice.id}/coupon`, {
        revision: invoiceAck.invoice.revision,
        couponCode: invoiceAck.couponCode?.trim() || null,
      });
      setInvoiceAck((current: any) => current ? {
        ...current,
        invoice: response.data.data,
        paymentChoice: bankAccounts.length ? "BANK_TRANSFER" : "CASH",
        changeChoice: false,
        couponMessage: response.data.data.couponCode
          ? "Coupon applied. Review the revised total and acknowledge this invoice again."
          : "Coupon removed. Review the revised total and acknowledge this invoice again.",
      } : current);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const submitDecline = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${declineTarget.invoice.id}/decline`, {
        reason: declineTarget.reason,
        revision: declineTarget.invoice.revision,
      });
      setDeclineTarget(null);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const submitCancelRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!cancelRequestTarget) return;
    if (!cancelRequestTarget.reason || cancelRequestTarget.reason.trim().length < 3) {
      setError("Please provide a reason for requesting cancellation.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.post(`/payment-requests/${cancelRequestTarget.invoice.id}/request-cancellation`, {
        reason: cancelRequestTarget.reason.trim(),
      });
      setCancelRequestTarget(null);
      await load();
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
        { pickupPin: handover.pickupPin || undefined },
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
    if (!download) { setDocumentPreview({ id: row.id, kind: 'invoice', name: row.invoiceNumber }); return; }
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
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setInvoiceBusy(null);
    }
  };
  const paymentPdf = async (request: any, kind: "handoff" | "receipt") => {
    setDocumentPreview({ id: request.id, kind, name: request.requestNumber });
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
  const workflowInvoice = payOnline?.invoice || invoiceAck?.invoice || declineTarget?.invoice || cancelRequestTarget?.invoice || handover;
  const workflowSale = payment || voidTarget;
  return (
    <WorkflowGuard resource={workflowInvoice?.id ? `payment/${workflowInvoice.id}` : workflowSale?.id ? `sale/${workflowSale.id}` : null}
      onCancel={() => { setPayOnline(null); setInvoiceAck(null); setDeclineTarget(null); setCancelRequestTarget(null); setHandover(null); setPayment(null); setVoidTarget(null); }}>
      <div className="page-intro">
        <div>
          <h2>{staff ? "Sales & billing" : "My invoices"}</h2>
          <p>
            {staff
              ? "Prescription invoices, counter sales, discounts, FIFO stock cost, profit, balances, and payments."
              : "Your prescription and counter purchases, what was charged, and what has been paid."}
          </p>
        </div>
        {staff && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError("");
              setRetail(emptyRetail());
            }}
          >
            <i className="bi bi-cart-plus me-2" />
            {canDirectRetail
              ? "New retail bill"
              : "Prepare retail cashier request"}
          </button>
        )}
      </div>
      <Alert message={error} />
      {orderHistoryControls}
      {salesHistoryControls}

      {!staff &&
        (() => {
          const openInvoices = myInvoices;
          if (!openInvoices.length) return null;
          return (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Orders &amp; invoice history</h3>
                  <small className="text-secondary">
                    Pay at the pharmacy counter, transfer the amount, or track
                    verified orders.
                  </small>
                </div>
              </div>
              {openInvoices.map((invoice: any) => {
                const pendingSlip = (invoice.slips || []).find(
                  (slip: any) => slip.status === "PENDING",
                );
                const lastRejected = (invoice.slips || []).find(
                  (slip: any) => slip.status === "REJECTED",
                );
                return (
                  <div
                    key={invoice.id}
                    className="border rounded-3 p-3 mb-3"
                  >
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                      <div>
                        <strong>{invoice.requestNumber}</strong>
                        <small className="d-block text-secondary">
                          {invoice.prescription?.prescriptionNumber ||
                            "Pharmacy items"}{" "}
                          · {formatPharmacyDate(invoice.createdAt)}
                        </small>
                      </div>
                      <div className="text-end">
                        <strong className="d-block fs-5">
                          {money(invoice.total)}
                        </strong>
                        <Status value={invoice.status} />
                      </div>
                    </div>

                    <div className="mt-2">
                      {invoice.items.map((item: any) => (
                        <small className="d-block text-secondary" key={item.id}>
                          {item.product.genericName} {item.product.strength} ×{" "}
                          {item.quantity} — {money(item.lineTotal)}
                          {item.prescriptionItem && ["PAID", "FULFILLED"].includes(invoice.status) && Number(item.quantity) > 0 && <span className="d-block mt-1" style={{ whiteSpace: 'pre-wrap' }}>Directions: {item.dosageInstructions?.trim() || 'Directions are not recorded. Ask the pharmacist before taking this medicine.'}{item.specialInstructions && <span className="d-block">Additional instructions: {item.specialInstructions}</span>}{item.product.storageInstructions && <span className="d-block">Storage: {item.product.storageInstructions}</span>}</span>}
                        </small>
                      ))}
                    </div>

                    {invoice.pharmacyNote && (
                      <div className="alert alert-light border small mt-3 mb-0">
                        <strong>Pharmacy note</strong>
                        <span className="d-block">{invoice.pharmacyNote}</span>
                      </div>
                    )}

                    <InvoiceChanges invoice={invoice} />

                    {["CANCELLED", "FULFILLED"].includes(invoice.status) ? (
                      <div className="text-secondary mt-3">{invoice.status === "FULFILLED" ? (invoice.delivery ? `Delivery ${invoice.delivery.status.toLowerCase()}.` : invoice.deliveryFeeFor ? 'Delivery service paid.' : 'Order collected.') : "Invoice closed — no payment is due."}</div>
                    ) : pendingSlip ? (
                      <div className="alert alert-info mt-3 mb-0">
                        <strong>Your bank slip is being checked.</strong>
                        <small className="d-block">
                          You sent {money(pendingSlip.declaredAmount)} on{" "}
                          {pendingSlip.paidOn
                            ? formatPharmacyDate(pendingSlip.paidOn)
                            : "an unstated date"}
                          . The pharmacy will confirm it shortly and start
                          preparing your medicine.
                        </small>
                        {!invoice.customerCancellationReason ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={() => {
                              setError("");
                              setCancelRequestTarget({ invoice, reason: "" });
                            }}
                          >
                            <i className="bi bi-x-circle me-1" />
                            Request cancellation
                          </button>
                        ) : (
                          <div className="badge bg-warning text-dark mt-2 p-2 d-block text-wrap text-start">
                            <i className="bi bi-clock-history me-1" />
                            Cancellation requested — awaiting cashier review
                          </div>
                        )}
                      </div>
                    ) : invoice.status === "PAID" ? (
                      <div className="mt-3">
                        <div className="alert alert-success small mb-2">
                          <i className="bi bi-check-circle-fill me-2" />
                          {invoice.customerCancellationReason ? "Payment verified. Collection is on hold while your cancellation request is reviewed." : "Payment verified. Your order is being prepared."}
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-primary me-2 mb-2" onClick={() => paymentPdf(invoice, "receipt")}>View collection receipt / PIN</button>
                        {!invoice.customerCancellationReason ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => {
                              setError("");
                              setCancelRequestTarget({ invoice, reason: "" });
                            }}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1" />
                            Request order cancellation / Refund
                          </button>
                        ) : (
                          <div className="badge bg-warning text-dark p-2 d-block text-wrap text-start">
                            <i className="bi bi-clock-history me-1" />
                            Cancellation requested — awaiting cashier review
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {lastRejected && (
                          <div className="alert alert-warning mt-3 mb-2">
                            <strong>Your last slip was not accepted.</strong>
                            <small className="d-block">
                              {lastRejected.rejectionReason}
                            </small>
                          </div>
                        )}
                        {invoice.acknowledgedRevision !== invoice.revision ? (
                          <div className="alert alert-warning mt-3 mb-0">
                            <strong>{invoice.acknowledgedRevision ? "The pharmacy updated this invoice." : "Please review the final invoice."}</strong>
                            <small className="d-block mb-2">
                              Confirm revision {invoice.revision} and choose how you intend to pay. Any acknowledgement of an older revision is withdrawn automatically.
                            </small>
                            <button className="btn btn-primary" onClick={() => { setError(""); setInvoiceAck({ invoice, paymentChoice: bankAccounts.length ? "BANK_TRANSFER" : "CASH", customerNote: invoice.customerNote || "", couponCode: invoice.couponCode || "" }); }}>
                              Review &amp; choose payment
                            </button>
                          </div>
                        ) : invoice.customerPaymentChoice === "CASH" ? (
                          <div className="alert alert-success mt-3 mb-0">
                            <strong>{invoice.reservationExpiresAt ? "Cash payment selected — stock reserved temporarily." : "Cash payment selected — stock hold expired."}</strong>
                            <small className="d-block">
                              {invoice.reservationExpiresAt ? `Pay at the pharmacy counter before ${formatPharmacyDateTime(invoice.reservationExpiresAt)}.` : "Renew your reservation to check availability and hold the medicines again."} Expiry releases stock but does not cancel your invoice approval.
                            </small>
                          </div>
                        ) : (
                          <div className="alert alert-info mt-3 mb-0">
                            <strong>Bank transfer selected.</strong>
                            <small className="d-block mb-2">Upload proof below. Stock will be reserved only after the cashier verifies the transfer.</small>
                            {bankAccounts.length ? (
                              <BankAccountDetails
                                accounts={bankAccounts}
                                reference={invoice.requestNumber}
                              />
                            ) : (
                              <small className="d-block text-danger mb-2">
                                Bank transfer is temporarily unavailable because the pharmacy has not configured an active bank account.
                              </small>
                            )}
                            <button
                              className="btn btn-primary mt-3"
                              onClick={() => {
                                setError("");
                                setPayOnline({
                                  invoice,
                                  declaredAmount: Number(invoice.total),
                                  bankAccountId: bankAccounts[0]?.id || "",
                                  reference: invoice.requestNumber,
                                  paidOn: pharmacyTodayDateInput(),
                                  note: "",
                                  file: null,
                                });
                              }}
                              disabled={!bankAccounts.length}
                            >
                              <i className="bi bi-bank me-2" />
                              Upload bank transfer receipt
                            </button>
                          </div>
                        )}
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              setError("");
                              setDeclineTarget({ invoice, reason: "" });
                            }}
                          >
                            Decline this invoice
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => paymentPdf(invoice, "handoff")}
                          >
                            <i className="bi bi-printer me-1" />
                            View invoice
                          </button>
                        </div>
                        {invoice.acknowledgedRevision === invoice.revision && (
                          <button className="btn btn-outline-secondary mt-2" onClick={() => { setError(""); setInvoiceAck({ invoice, changeChoice: true, paymentChoice: invoice.customerPaymentChoice || "CASH", customerNote: invoice.customerNote || "", couponCode: invoice.couponCode || "" }); }}>
                            Change payment method / renew reservation
                          </button>
                        )}
                        {!bankAccounts.length && invoice.customerPaymentChoice === "BANK_TRANSFER" && invoice.acknowledgedRevision === invoice.revision && (
                          <small className="d-block text-secondary mt-2">
                            Online payment is not available right now — please
                            pay at the pharmacy counter.
                          </small>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

      {staff && retailRequests.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Retail cashier handovers</h3>
              <small className="text-secondary">
                Pharmacist-prepared retail bills require cashier payment
                {operationSettings.requirePickupPin
                  ? " and PIN verification"
                  : ""}{" "}
                before goods are handed over.
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
                        {formatPharmacyDateTime(request.createdAt)}
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
                        {request.status === "PAID" && !request.deliveryFeeFor && (
                          <>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setError("");
                                setHandover({ ...request, pickupPin: "" });
                              }}
                            >
                              <i className="bi bi-shield-check me-1" />
                              {operationSettings.requirePickupPin
                                ? "Verify PIN and hand over"
                                : "Hand over"}
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
                  <td>{formatPharmacyDateTime(row.createdAt)}</td>
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
                      {canDirectRetail && row.status === "PENDING" && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setError("");
                            setPayment({
                              id: row.id,
                              invoiceNumber: row.invoiceNumber,
                              outstanding:
                                Number(row.total) - Number(row.amountPaid),
                              amount:
                                Number(row.total) - Number(row.amountPaid),
                              paymentMethod: "CASH",
                            });
                          }}
                        >
                          Record payment
                        </button>
                      )}
                      {canDirectRetail &&
                        !row.dispensingId &&
                        row.status === "PENDING" &&
                        (isAdmin ||
                          formatPharmacyDate(row.createdAt) ===
                            formatPharmacyDate(new Date())) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setError("");
                              setVoidTarget({ ...row, reason: "" });
                            }}
                            title={Number(row.amountPaid) > 0 ? "Cancel sale and queue deposit refund" : "Void this sale"}
                            aria-label={`Cancel invoice ${row.invoiceNumber}`}
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
          {invoiceLoadFailed ? <div className="p-3" role="alert">Invoices could not be loaded. <button className="btn btn-sm btn-outline-primary" onClick={load}>Retry invoices</button></div> : !rows.length && <Empty text="No invoices have been created." />}
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
                ? "You are authorized to complete this retail sale directly; no separate handoff step is required."
                : operationSettings.requirePickupPin
                  ? "This retail bill will be sent to the cashier. Verify the paid receipt PIN before handing over goods."
                  : "This retail bill will be sent to the cashier. Hand the goods over once payment is confirmed."}
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
            <Alert message={error} />
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
      {documentPreview && <DocumentPreview document={documentPreview} onClose={() => setDocumentPreview(null)} />}
      <div className="panel"><Link to="/deliveries" className="btn btn-outline-primary">Home deliveries — request or track delivery</Link></div>
      <RefundWorkspace sales={rows} />
      {invoiceAck && (
        <Modal
          title={`${invoiceAck.changeChoice ? "Payment method & reservation" : "Review final invoice"} — ${invoiceAck.invoice.requestNumber}`}
          onClose={() => setInvoiceAck(null)}
          size="lg"
        >
          <form onSubmit={acknowledgeInvoice}>
            <div className="alert alert-info">
              <strong>Final total: {money(invoiceAck.invoice.total)}</strong>
              <small className="d-block">
                Invoice revision {invoiceAck.invoice.revision}. Confirm the medicines and total below before selecting payment.
              </small>
            </div>
            <div className="border rounded-3 p-3 mb-3">
              {invoiceAck.invoice.items.map((item: any) => (
                <div className="d-flex justify-content-between gap-3 mb-1" key={item.id}>
                  <span>{item.product.genericName} {item.product.strength} × {item.quantity}</span>
                  <strong>{money(item.lineTotal)}</strong>
                </div>
              ))}
              <div className="border-top mt-2 pt-2 small">
                <div className="d-flex justify-content-between"><span>Subtotal</span><span>{money(invoiceAck.invoice.subtotal)}</span></div>
                {Number(invoiceAck.invoice.discount) > 0 && <div className="d-flex justify-content-between text-success"><span>Discount{invoiceAck.invoice.couponCode ? ` (${invoiceAck.invoice.couponCode})` : ""}</span><span>− {money(invoiceAck.invoice.discount)}</span></div>}
                {Number(invoiceAck.invoice.containerFee) > 0 && <div className="d-flex justify-content-between"><span>Container fee</span><span>{money(invoiceAck.invoice.containerFee)}</span></div>}
                {Number(invoiceAck.invoice.tax) > 0 && <div className="d-flex justify-content-between"><span>Tax</span><span>{money(invoiceAck.invoice.tax)}</span></div>}
              </div>
              {invoiceAck.invoice.pharmacyNote && (
                <div className="border-top pt-2 mt-2 small">
                  <strong>Pharmacy note:</strong> {invoiceAck.invoice.pharmacyNote}
                </div>
              )}
            </div>
            {!invoiceAck.changeChoice && (
              <div className="border rounded-3 p-3 mb-3">
                <label className="form-label fw-semibold" htmlFor="patient-invoice-coupon">Coupon code (optional)</label>
                <div className="input-group">
                  <input
                    id="patient-invoice-coupon"
                    className="form-control text-uppercase"
                    maxLength={40}
                    value={invoiceAck.couponCode || ""}
                    onChange={(event) => setInvoiceAck({ ...invoiceAck, couponCode: event.target.value.toUpperCase() })}
                    placeholder="Enter a pharmacy coupon"
                    disabled={busy}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={applyInvoiceCoupon}
                    disabled={busy || (!(invoiceAck.couponCode || "").trim() && !invoiceAck.invoice.couponCode)}
                  >
                    {busy ? "Updating…" : "Apply"}
                  </button>
                </div>
                <small className="d-block text-secondary mt-1">The pharmacy checks the code against this invoice. A changed bill needs your acknowledgement again.</small>
                {invoiceAck.couponMessage && <small className="d-block text-success mt-1">{invoiceAck.couponMessage}</small>}
              </div>
            )}
            <InvoiceChanges invoice={invoiceAck.invoice} />
            <fieldset>
              <legend className="form-label fw-semibold">How will you pay?</legend>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className={`d-block border rounded-3 p-3 h-100 ${invoiceAck.paymentChoice === "BANK_TRANSFER" ? "border-primary bg-primary-subtle" : ""} ${!bankAccounts.length ? "bg-light opacity-75" : ""}`} style={{ cursor: bankAccounts.length ? "pointer" : "not-allowed" }}>
                    <input className="form-check-input me-2" type="radio" name="invoice-payment-choice" checked={invoiceAck.paymentChoice === "BANK_TRANSFER"} disabled={!bankAccounts.length} onChange={() => setInvoiceAck({ ...invoiceAck, paymentChoice: "BANK_TRANSFER" })} />
                    <strong>Bank transfer</strong>
                    <small className="d-block text-secondary mt-1">
                      {bankAccounts.length
                        ? "Upload a transfer receipt. The cashier must verify it before payment is confirmed and stock is reserved."
                        : "Temporarily unavailable — no active pharmacy bank account is configured."}
                    </small>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className={`d-block border rounded-3 p-3 h-100 ${invoiceAck.paymentChoice === "CASH" ? "border-primary bg-primary-subtle" : ""}`} style={{ cursor: "pointer" }}>
                    <input className="form-check-input me-2" type="radio" name="invoice-payment-choice" checked={invoiceAck.paymentChoice === "CASH"} onChange={() => setInvoiceAck({ ...invoiceAck, paymentChoice: "CASH" })} />
                    <strong>Cash at pharmacy</strong>
                    <small className="d-block text-secondary mt-1">The medicines are reserved immediately for the pharmacy's configured short period (normally 24 hours). The exact deadline will be shown after confirmation.</small>
                  </label>
                </div>
              </div>
              {invoiceAck.paymentChoice === "BANK_TRANSFER" && bankAccounts.length > 0 && (
                <div className="alert alert-light border mt-3 mb-0">
                  <BankAccountDetails
                    accounts={bankAccounts}
                    reference={invoiceAck.invoice.requestNumber}
                  />
                </div>
              )}
            </fieldset>
            <label className="form-label mt-3">Note to pharmacy (optional)</label>
            <textarea className="form-control" rows={3} maxLength={500} value={invoiceAck.customerNote} onChange={(event) => setInvoiceAck({ ...invoiceAck, customerNote: event.target.value })} />
            <Alert message={error} />
            <ModalActions onClose={() => setInvoiceAck(null)} submitLabel={invoiceAck.changeChoice ? "Save payment choice / reservation" : "Acknowledge & confirm payment choice"} busy={busy} />
          </form>
        </Modal>
      )}
      {payOnline && (
        <Modal
          title={`Pay by bank transfer — ${payOnline.invoice.requestNumber}`}
          onClose={() => setPayOnline(null)}
          size="lg"
        >
          <form onSubmit={submitSlip}>
            <div className="alert alert-info">
              <strong>Amount to transfer: {money(payOnline.invoice.total)}</strong>
              <small className="d-block">
                Transfer to one of the accounts below, then attach the bank slip
                so the pharmacy can confirm it.
              </small>
            </div>

            <label className="form-label">Pharmacy bank account</label>
            <div className="mb-3">
              {bankAccounts.map((account: any) => (
                <label
                  key={account.id}
                  className={`d-block border rounded-3 p-3 mb-2 ${
                    Number(payOnline.bankAccountId) === account.id
                      ? "border-primary"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-start gap-2">
                    <input
                      type="radio"
                      name="bankAccount"
                      className="form-check-input mt-1"
                      checked={Number(payOnline.bankAccountId) === account.id}
                      onChange={() =>
                        setPayOnline({ ...payOnline, bankAccountId: account.id })
                      }
                    />
                    <div>
                      <strong>{account.bankName}</strong>
                      {account.branch && (
                        <span className="text-secondary"> · {account.branch}</span>
                      )}
                      <small className="d-block">
                        {account.accountName} — <strong>{account.accountNumber}</strong>
                      </small>
                      {account.instructions && (
                        <small className="d-block text-secondary">
                          {account.instructions}
                        </small>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="form-grid">
              <div>
                <label className="form-label">Amount you transferred</label>
                <input
                  className="form-control"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={payOnline.declaredAmount}
                  onChange={(event) =>
                    setPayOnline({ ...payOnline, declaredAmount: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Date of transfer</label>
                <input
                  className="form-control"
                  type="date"
                  max={pharmacyTodayDateInput()}
                  value={payOnline.paidOn}
                  onChange={(event) =>
                    setPayOnline({ ...payOnline, paidOn: event.target.value })
                  }
                />
              </div>
              <div className="full">
                <label className="form-label">Bank reference</label>
                <input
                  className="form-control"
                  value={payOnline.reference}
                  onChange={(event) =>
                    setPayOnline({ ...payOnline, reference: event.target.value })
                  }
                  placeholder="The reference shown on your transfer"
                />
              </div>
              <div className="full">
                <label className="form-label">Bank slip</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(event) =>
                    setPayOnline({
                      ...payOnline,
                      file: event.target.files?.[0] || null,
                    })
                  }
                  required
                />
                <small className="text-secondary">
                  A photo or PDF of the deposit slip or transfer confirmation.
                </small>
              </div>
              <div className="full">
                <label className="form-label">Note (optional)</label>
                <input
                  className="form-control"
                  value={payOnline.note}
                  onChange={(event) =>
                    setPayOnline({ ...payOnline, note: event.target.value })
                  }
                />
              </div>
            </div>

            <Alert message={error} />
            <ModalActions
              onClose={() => setPayOnline(null)}
              submitLabel="Send slip to the pharmacy"
              busy={busy}
            />
          </form>
        </Modal>
      )}

      {declineTarget && (
        <Modal
          title={`Decline invoice — ${declineTarget.invoice.requestNumber}`}
          onClose={() => setDeclineTarget(null)}
          size="sm"
        >
          <form onSubmit={submitDecline}>
            <div className="alert alert-warning">
              <strong>This cancels the invoice.</strong>
              <small className="d-block">
                Your prescription stays on file, so the pharmacy can quote it
                again with different quantities if you ask.
              </small>
            </div>
            <label className="form-label">Why are you declining it?</label>
            <textarea
              className="form-control"
              value={declineTarget.reason}
              onChange={(event) =>
                setDeclineTarget({ ...declineTarget, reason: event.target.value })
              }
              placeholder="For example: more than I expected, I would like a smaller quantity."
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setDeclineTarget(null)}
              submitLabel="Decline invoice"
              busy={busy || declineTarget.reason.trim().length < 3}
            />
          </form>
        </Modal>
      )}

      {cancelRequestTarget && (
        <Modal
          title={`Request cancellation — ${cancelRequestTarget.invoice.requestNumber}`}
          onClose={() => setCancelRequestTarget(null)}
          size="sm"
        >
          <form onSubmit={submitCancelRequest}>
            <div className="alert alert-warning small">
              <i className="bi bi-exclamation-triangle me-2" />
              <strong>Request cancellation for this bill</strong>
              <br />
              Our cashier team will review your cancellation request and process any refund before your medicines are prepared.
            </div>
            <label className="form-label">Reason for cancellation request (required)</label>
            <textarea
              className="form-control"
              minLength={3}
              maxLength={500}
              value={cancelRequestTarget.reason}
              onChange={(event) =>
                setCancelRequestTarget({ ...cancelRequestTarget, reason: event.target.value })
              }
              placeholder="e.g. Doctor changed prescription, duplicate order, need refund..."
              required
            />
            <Alert message={error} />
            <ModalActions
              onClose={() => setCancelRequestTarget(null)}
              submitLabel="Submit cancellation request"
              busy={busy || cancelRequestTarget.reason.trim().length < 3}
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
                {operationSettings.requirePickupPin
                  ? "Enter the PIN from the customer's paid receipt before releasing the retail goods."
                  : "Confirm the customer's identity before releasing the retail goods."}
              </small>
            </div>
            {operationSettings.requirePickupPin ? (
              <>
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
              </>
            ) : (
              <small className="text-secondary">
                PIN verification is turned off for this pharmacy — confirm
                with the patient and hand over the goods directly.
              </small>
            )}
            <Alert message={error} />
            <ModalActions
              onClose={() => setHandover(null)}
              submitLabel={
                operationSettings.requirePickupPin
                  ? "Verify PIN and hand over goods"
                  : "Hand over goods"
              }
              busy={
                busy ||
                (operationSettings.requirePickupPin &&
                  handover.pickupPin.length !== 6)
              }
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
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option>OTHER</option>
            </select>
            {payment.paymentMethod !== "CASH" && <div className="mt-3"><label htmlFor="sale-payment-reference" className="form-label">Verified transaction reference{payment.paymentMethod === "BANK_TRANSFER" ? " (required)" : ""}</label><input id="sale-payment-reference" className="form-control" maxLength={120} required={payment.paymentMethod === "BANK_TRANSFER"} value={payment.paymentReference || ""} onChange={(event) => setPayment({ ...payment, paymentReference: event.target.value })}/><small className="text-secondary">Record payment only after confirming receipt on the bank statement or card terminal.</small></div>}
            {payment.paymentMethod === "CASH" && (
              <div className="card p-3 bg-light border mt-3 mb-2">
                <label className="form-label fw-bold mb-1">
                  <i className="bi bi-cash me-1 text-success" /> Cash given by customer
                </label>
                <div className="input-group mb-2">
                  <span className="input-group-text">Rs.</span>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.01"
                    placeholder={String(payment.amount)}
                    value={payment.tenderedAmount || ""}
                    onChange={(event) =>
                      setPayment({ ...payment, tenderedAmount: event.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setPayment({ ...payment, tenderedAmount: String(payment.amount) })
                    }
                  >
                    Exact
                  </button>
                </div>
                {Number(payment.tenderedAmount || 0) > 0 && (
                  <div className="small p-2 rounded bg-white border d-flex justify-content-between align-items-center">
                    <span>Change / Balance to return:</span>
                    <strong
                      className={
                        Number(payment.tenderedAmount || 0) >= Number(payment.amount)
                          ? "text-success fs-5"
                          : "text-danger"
                      }
                    >
                      {Number(payment.tenderedAmount || 0) >= Number(payment.amount)
                        ? `Rs. ${(Number(payment.tenderedAmount) - Number(payment.amount)).toFixed(2)}`
                        : `Short by Rs. ${(Number(payment.amount) - Number(payment.tenderedAmount)).toFixed(2)}`}
                    </strong>
                  </div>
                )}
              </div>
            )}
            <Alert message={error} />
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
          title={`Cancel ${voidTarget.invoiceNumber}`}
          onClose={() => setVoidTarget(null)}
          size="sm"
        >
          <form onSubmit={submitVoid}>
            <div className="alert alert-danger small">
              <i className="bi bi-exclamation-triangle me-2" />
              {Number(voidTarget.amountPaid) > 0
                ? `Cancelling queues ${money(voidTarget.amountPaid)} for refund and cancels the unpaid balance. Confirm the actual payout separately under Refunds. Stock remains unavailable until pharmacist review.`
                : `Voiding this sale (${money(voidTarget.total)}) returns its items to stock and marks the invoice void. This cannot be undone.`}{" "}
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
            <Alert message={error} />
            <ModalActions
              onClose={() => setVoidTarget(null)}
              submitLabel={Number(voidTarget.amountPaid) > 0 ? "Cancel and queue refund" : "Void sale"}
              busy={busy}
            />
          </form>
        </Modal>
      )}
    </WorkflowGuard>
  );
}
