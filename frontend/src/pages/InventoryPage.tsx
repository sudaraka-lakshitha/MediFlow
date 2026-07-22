import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { ActionsDropdown } from "../components/ActionsDropdown";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal, ModalActions } from "../components/Modal";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Metric, Status } from "../components/Ui";

type DispositionAction =
  | "DISCARDED"
  | "DESTROYED"
  | "RETURNED_TO_SUPPLIER"
  | "RETURNED_TO_MANUFACTURER";

type Batch = {
  id: number;
  batchNumber: string;
  quantityReceived: number;
  quantityAvailable: number;
  purchasePrice: string;
  expiryDate: string;
  receivedAt: string;
  restricted: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
  product: {
    id: number;
    genericName: string;
    strength: string;
    unit: string;
    reorderLevel: number;
    productType?: string;
    manufacturer?: { id: number; name: string };
  };
  supplier?: { id: number; name: string };
  latestDisposition?: {
    action: DispositionAction;
    quantity: number;
    reason: string;
    processedAt: string;
    processedBy: { id: number; fullName: string };
  };
};

type InventoryModal = "receive" | "edit" | "adjust" | "dispose";
type BatchFilter =
  | "ALL"
  | "CURRENT"
  | "ATTENTION"
  | "ACTIVE"
  | "EXPIRED_PENDING"
  | "NEAR_EXPIRY"
  | "LOW_STOCK"
  | "DISPOSED";

const emptyForm = {
  productId: 0,
  supplierId: "",
  batchNumber: "",
  quantity: 1,
  purchasePrice: 0,
  expiryDate: "",
  note: "",
  quantityChange: 0,
  reason: "",
  dispositionAction: "DISCARDED" as DispositionAction,
  dispositionQuantity: 0,
  destinationName: "",
};

const expired = (batch: Batch) => new Date(batch.expiryDate) < new Date();
const nearExpiry = (batch: Batch, days: number) => {
  const expiryTime = new Date(batch.expiryDate).getTime();
  const now = Date.now();
  return (
    expiryTime >= now &&
    expiryTime <= now + Math.max(0, days) * 86_400_000 &&
    Number(batch.quantityAvailable) > 0
  );
};
const productName = (product: Batch["product"]) =>
  `${product.genericName}${product.strength && product.strength !== "N/A" ? ` ${product.strength}` : ""}`;
const suggestedRestockQuantity = (product: any) =>
  Math.max(
    1,
    Math.ceil(
      Number(product.reorderLevel || 0) * 2 -
        Number(product.usableStock || 0),
    ),
  );

const dispositionLabels: Record<DispositionAction, string> = {
  DISCARDED: "Discarded",
  DESTROYED: "Removed / destroyed",
  RETURNED_TO_SUPPLIER: "Returned to supplier",
  RETURNED_TO_MANUFACTURER: "Returned to manufacturer",
};

export function InventoryPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notingProductId, setNotingProductId] = useState<number | null>(null);
  const [modal, setModal] = useState<InventoryModal | null>(null);
  const [selected, setSelected] = useState<Batch | null>(null);
  const [restockProduct, setRestockProduct] = useState<any | null>(null);
  const [filter, setFilter] = useState<BatchFilter>("CURRENT");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const { user } = useAuth();
  const admin = user!.role === "ADMIN";
  const [confirmDelete, setConfirmDelete] = useState<Batch | null>(null);

  const deleteBatch = async (batchId: number) => {
    setBusy(true);
    setError("");
    try {
      await api.delete(`/inventory/batches/${batchId}`);
      setConfirmDelete(null);
      await load();
      window.dispatchEvent(new Event("mediflow:attention-refresh"));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  const toggleRestriction = async (batch: Batch) => {
    const reason = batch.restricted
      ? ""
      : window.prompt("Why must this batch be stopped from issuing?")?.trim();
    if (!batch.restricted && !reason) return;
    setBusy(true);
    try {
      await api.patch(`/inventory/batches/${batch.id}/restriction`, {
        restricted: !batch.restricted,
        reason: reason || null,
      });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const load = useCallback(async () => {
    try {
      setError("");
      const [batchResponse, productResponse, supplierResponse, alertResponse] =
        await Promise.all([
          api.get("/inventory/batches"),
          api.get("/catalog/products"),
          api.get("/catalog/suppliers"),
          api.get("/inventory/alerts"),
        ]);
      setBatches(batchResponse.data.data);
      setProducts(productResponse.data.data);
      setSuppliers(supplierResponse.data.data);
      setAlerts(alertResponse.data.data);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = (mode: InventoryModal, batch?: Batch, product?: any) => {
    setSelected(batch || null);
    setRestockProduct(mode === "receive" ? product || null : null);
    if (mode === "dispose" && batch) {
      setForm({
        ...emptyForm,
        dispositionAction: "DISCARDED",
        dispositionQuantity: Number(batch.quantityAvailable),
        reason: "Expired stock removed from saleable inventory.",
      });
    } else if (batch) {
      setForm({
        ...emptyForm,
        supplierId: batch.supplier?.id ? String(batch.supplier.id) : "",
        batchNumber: batch.batchNumber,
        purchasePrice: Number(batch.purchasePrice),
        expiryDate: batch.expiryDate.slice(0, 10),
      });
    } else if (mode === "receive" && product) {
      setForm({
        ...emptyForm,
        productId: Number(product.id),
        quantity: suggestedRestockQuantity(product),
        note: "Low-stock replenishment.",
      });
    } else {
      setForm({ ...emptyForm });
    }
    setModal(mode);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (modal === "receive") {
        await api.post("/inventory/batches", {
          ...form,
          productId: Number(form.productId),
          supplierId: form.supplierId ? Number(form.supplierId) : null,
          quantity: Number(form.quantity),
          purchasePrice: Number(form.purchasePrice),
        });
      }
      if (modal === "edit" && selected) {
        await api.put(`/inventory/batches/${selected.id}`, {
          supplierId: form.supplierId ? Number(form.supplierId) : null,
          batchNumber: form.batchNumber,
          purchasePrice: Number(form.purchasePrice),
          expiryDate: form.expiryDate,
        });
      }
      if (modal === "adjust" && selected) {
        await api.post(`/inventory/batches/${selected.id}/adjust`, {
          quantityChange: Number(form.quantityChange),
          reason: form.reason,
        });
      }
      if (modal === "dispose" && selected) {
        await api.post(`/inventory/batches/${selected.id}/dispose-expired`, {
          action: form.dispositionAction,
          quantity: Number(form.dispositionQuantity),
          reason: form.reason,
          destinationName: form.dispositionAction.startsWith("RETURNED_")
            ? form.destinationName
            : null,
        });
      }
      setModal(null);
      setRestockProduct(null);
      await load();
      window.dispatchEvent(new Event("mediflow:attention-refresh"));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const setLowStockNoted = async (product: any, noted: boolean) => {
    setNotingProductId(product.id);
    setError("");
    try {
      if (noted) await api.put(`/inventory/products/${product.id}/low-stock-note`);
      else await api.delete(`/inventory/products/${product.id}/low-stock-note`);
      await load();
      window.dispatchEvent(new Event("mediflow:attention-refresh"));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setNotingProductId(null);
    }
  };

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => product.active)
        .map((product) => {
          const usableStock = (product.batches || []).reduce(
            (total: number, batch: any) =>
              new Date(batch.expiryDate) >= new Date() &&
              Number(batch.quantityAvailable) > 0
                ? total + Number(batch.quantityAvailable)
                : total,
            0,
          );
          const acknowledgedStock = product.lowStockAcknowledgement?.stockLevel;
          const lowStockAcknowledged = acknowledgedStock != null
            && Number(acknowledgedStock).toFixed(3) === Number(usableStock).toFixed(3);
          return { ...product, usableStock, lowStockAcknowledged };
        })
        .filter(
          (product) =>
            product.usableStock <= Number(product.reorderLevel || 0),
        )
        .sort(
          (first, second) =>
            first.usableStock / Math.max(1, Number(first.reorderLevel || 0)) -
              second.usableStock /
                Math.max(1, Number(second.reorderLevel || 0)) ||
            first.genericName.localeCompare(second.genericName),
        ),
    [products],
  );
  const lowStockRequiresAttention = lowStockProducts.filter(
    (product) => !product.lowStockAcknowledged,
  ).length;
  const lowStockProductIds = useMemo(
    () => new Set(lowStockProducts.map((product) => product.id)),
    [lowStockProducts],
  );
  const nearExpiryDays = Number(alerts.nearExpiryDays || 90);

  const filteredBatches = useMemo(() => {
    const term = search.trim().toLowerCase();
    return batches
      .filter((batch) => {
        const isExpired = expired(batch);
        const expiredPending =
          isExpired && Number(batch.quantityAvailable) > 0;
        const near = nearExpiry(batch, nearExpiryDays);
        const disposed =
          Number(batch.quantityAvailable) === 0 &&
          Boolean(batch.latestDisposition);
        const lowStock =
          lowStockProductIds.has(batch.product.id) && !disposed;
        const filterMatches =
          filter === "ALL" ||
          (filter === "CURRENT" &&
            Number(batch.quantityAvailable) > 0 &&
            !disposed) ||
          (filter === "ATTENTION" &&
            (expiredPending || near || lowStock)) ||
          (filter === "ACTIVE" &&
            !expiredPending &&
            !near &&
            !lowStock &&
            !disposed) ||
          (filter === "EXPIRED_PENDING" && expiredPending) ||
          (filter === "NEAR_EXPIRY" && near) ||
          (filter === "LOW_STOCK" && lowStock) ||
          (filter === "DISPOSED" && disposed);
        const searchMatches =
          !term ||
          [
            productName(batch.product),
            batch.batchNumber,
            batch.supplier?.name,
            batch.product.manufacturer?.name,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term);
        return filterMatches && searchMatches;
      })
      .sort((first, second) => {
        const firstDisposed =
          Number(first.quantityAvailable) === 0 &&
          Boolean(first.latestDisposition);
        const secondDisposed =
          Number(second.quantityAvailable) === 0 &&
          Boolean(second.latestDisposition);
        const lowStockOrder =
          Number(
            lowStockProductIds.has(second.product.id) && !secondDisposed,
          ) -
          Number(
            lowStockProductIds.has(first.product.id) && !firstDisposed,
          );
        if (lowStockOrder) return lowStockOrder;
        const expiredOrder =
          Number(
            expired(second) && Number(second.quantityAvailable) > 0,
          ) -
          Number(expired(first) && Number(first.quantityAvailable) > 0);
        if (expiredOrder) return expiredOrder;
        return (
          new Date(first.expiryDate).getTime() -
          new Date(second.expiryDate).getTime()
        );
      });
  }, [
    batches,
    filter,
    lowStockProductIds,
    nearExpiryDays,
    search,
  ]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Batch inventory</h2>
          <p>
            Receive, trace, adjust, and formally dispose of expired stock.
            Allocation: {alerts.allocationMethod || "FIFO"}.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/inventory/movements" className="btn btn-outline-secondary">
            <i className="bi bi-clock-history me-2" />
            Movement history
          </Link>
          <button className="btn btn-primary" onClick={() => open("receive")}>
            <i className="bi bi-box-arrow-in-down me-2" />
            Receive stock
          </button>
        </div>
      </div>
      <Alert message={error} />

      <div className="metric-grid">
        <Metric
          label="Total batches"
          value={batches.length}
          icon="boxes"
        />
        <Metric
          label="Expired awaiting action"
          value={alerts.expiredBatches || 0}
          icon="exclamation-triangle"
          tone="red"
        />
        <Metric
          label={`Near expiry (${nearExpiryDays} days)`}
          value={alerts.nearExpiryBatches || 0}
          icon="hourglass-split"
          tone="amber"
        />
        <Metric
          label="Low-stock products"
          value={alerts.lowStockProducts || 0}
          icon="graph-down-arrow"
          tone="blue"
        />
      </div>

      <div className="inventory-attention-strip">
        <div className="inventory-attention-summary">
          <span>
            <i className="bi bi-bell" />
          </span>
          <div>
            <strong>Inventory attention</strong>
            <small>
              This breakdown matches the indication shown in the sidebar.
            </small>
          </div>
        </div>
        <div className="inventory-alert-chips">
          <button
            type="button"
            className="inventory-alert-chip danger"
            onClick={() => setFilter("EXPIRED_PENDING")}
          >
            <strong>{alerts.expiredBatches || 0}</strong>
            <span>Expired</span>
          </button>
          <button
            type="button"
            className="inventory-alert-chip warning"
            onClick={() => setFilter("NEAR_EXPIRY")}
          >
            <strong>{alerts.nearExpiryBatches || 0}</strong>
            <span>Near expiry</span>
          </button>
          <button
            type="button"
            className="inventory-alert-chip info"
            onClick={() => setFilter("LOW_STOCK")}
          >
            <strong>{alerts.lowStockRequiresAttention ?? lowStockRequiresAttention}</strong>
            <span>Low-stock attention</span>
          </button>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="panel inventory-low-stock-panel">
          <div className="panel-header">
            <div>
              <h3>Low-stock products</h3>
              <small>
                Review the suggested replenishment quantity and receive a new
                batch directly. Products remain here until usable stock exceeds
                their reorder level. Noted items remain visible but no longer
                contribute to the sidebar indication unless their stock changes.
              </small>
            </div>
            <span className="status status-low-stock">
              {lowStockRequiresAttention} require attention
            </span>
          </div>
          <div className="inventory-low-stock-grid">
            {lowStockProducts.map((product) => (
              <div className={`inventory-low-stock-item${product.lowStockAcknowledged ? " noted" : ""}`} key={product.id}>
                <div>
                  <span className="inventory-low-stock-name">
                    <strong>
                      {product.genericName}
                      {product.strength && product.strength !== "N/A"
                        ? ` ${product.strength}`
                        : ""}
                    </strong>
                    {product.lowStockAcknowledged && <span className="inventory-noted-badge"><i className="bi bi-check2" /> Noted</span>}
                  </span>
                  <small>{product.sku}</small>
                  {product.lowStockAcknowledged && product.lowStockAcknowledgement?.acknowledgedBy && (
                    <small className="inventory-noted-by">
                      Noted by {product.lowStockAcknowledgement.acknowledgedBy.fullName} on {new Date(product.lowStockAcknowledgement.acknowledgedAt).toLocaleString()}
                    </small>
                  )}
                </div>
                <div className="inventory-low-stock-level">
                  <strong>
                    {product.usableStock} {product.unit}
                  </strong>
                  <small>Reorder at {product.reorderLevel}</small>
                </div>
                <div className="inventory-restock-action">
                  <small>
                    Suggested: {suggestedRestockQuantity(product)} {product.unit}
                  </small>
                  <div className="inventory-restock-buttons">
                    <button
                      type="button"
                      className={`btn btn-sm ${product.lowStockAcknowledged ? "btn-outline-secondary" : "btn-outline-primary"}`}
                      disabled={notingProductId === product.id}
                      onClick={() => setLowStockNoted(product, !product.lowStockAcknowledged)}
                    >
                      {notingProductId === product.id
                        ? <span className="spinner-border spinner-border-sm" />
                        : <i className={`bi ${product.lowStockAcknowledged ? "bi-arrow-counterclockwise" : "bi-check2-circle"} me-1`} />}
                      {product.lowStockAcknowledged ? "Undo note" : "Mark noted"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => open("receive", undefined, product)}
                    >
                      <i className="bi bi-box-arrow-in-down me-1" />
                      Restock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="panel">
        <div className="inventory-toolbar">
          <div>
            <h3>Inventory batches</h3>
            <small>
              Expired quantities remain visible until a disposition is
              recorded.
            </small>
          </div>
          <div className="toolbar">
            <input
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, batch or supplier"
            />
            <select
              className="form-select"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as BatchFilter)
              }
            >
              <option value="ALL">All batches</option>
              <option value="CURRENT">
                Current stock (hide disposed / returned)
              </option>
              <option value="ATTENTION">All attention required</option>
              <option value="LOW_STOCK">Low-stock products</option>
              <option value="EXPIRED_PENDING">Expired awaiting action</option>
              <option value="NEAR_EXPIRY">Near expiry</option>
              <option value="ACTIVE">No active alerts</option>
              <option value="DISPOSED">Disposed or returned</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch</th>
                <th>Supplier</th>
                <th>Available</th>
                <th>Received</th>
                <th>Expiry</th>
                <th>Status / disposition</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => {
                const isExpired = expired(batch);
                const near = nearExpiry(batch, nearExpiryDays);
                const fullyDisposed =
                  Number(batch.quantityAvailable) === 0 &&
                  Boolean(batch.latestDisposition);
                const lowStock =
                  lowStockProductIds.has(batch.product.id) && !fullyDisposed;
                const matchingLowStockProduct = lowStockProducts.find(
                  (product) => product.id === batch.product.id,
                );
                const expiredPending =
                  isExpired && Number(batch.quantityAvailable) > 0;
                return (
                  <tr key={batch.id}>
                    <td>
                      <strong>{batch.product.genericName}</strong>
                      <br />
                      <small>
                        {batch.product.strength !== "N/A"
                          ? batch.product.strength
                          : batch.product.productType === "NON_MEDICINAL"
                            ? "Retail item"
                            : ""}
                      </small>
                    </td>
                    <td>{batch.batchNumber}</td>
                    <td>{batch.supplier?.name || "—"}</td>
                    <td>
                      <strong>{batch.quantityAvailable}</strong> /{" "}
                      {batch.quantityReceived} {batch.product.unit}
                    </td>
                    <td>{new Date(batch.receivedAt).toLocaleString()}</td>
                    <td>{new Date(batch.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <div className="inventory-row-statuses">
                        {batch.restricted && <Status value="RESTRICTED" />}
                        {fullyDisposed ? (
                          <Status value={batch.latestDisposition!.action} />
                        ) : (
                          <>
                            {expiredPending && (
                              <Status value="EXPIRED_PENDING" />
                            )}
                            {near && <Status value="NEAR_EXPIRY" />}
                            {lowStock && <Status value="LOW_STOCK" />}
                            {!expiredPending &&
                              !near &&
                              !lowStock && (
                                <Status
                                  value={
                                    Number(batch.quantityAvailable) > 0
                                      ? "AVAILABLE"
                                      : "OUT_OF_STOCK"
                                  }
                                />
                              )}
                          </>
                        )}
                      </div>
                      {!fullyDisposed && (near || lowStock) && (
                        <div className="inventory-row-alerts">
                          {near && (
                            <small>
                              Expires within {nearExpiryDays} days.
                            </small>
                          )}
                          {lowStock && matchingLowStockProduct && (
                            <small>
                              Usable product stock:{" "}
                              {matchingLowStockProduct.usableStock} / reorder{" "}
                              {matchingLowStockProduct.reorderLevel}.
                            </small>
                          )}
                        </div>
                      )}
                      {batch.latestDisposition && (
                        <small className="inventory-disposition-note">
                          {batch.latestDisposition.quantity}{" "}
                          {batch.product.unit}{" "}
                          {
                            dispositionLabels[
                              batch.latestDisposition.action
                            ]
                          }{" "}
                          by {batch.latestDisposition.processedBy.fullName} on{" "}
                          {new Date(
                            batch.latestDisposition.processedAt,
                          ).toLocaleString()}
                        </small>
                      )}
                      {batch.restricted && (
                        <small className="inventory-disposition-note text-danger">
                          Issuing stopped: {batch.restrictionReason}
                          {batch.restrictedAt ? ` · ${new Date(batch.restrictedAt).toLocaleString()}` : ""}
                        </small>
                      )}
                    </td>
                    <td>
                      <ActionsDropdown
                        actions={[
                          {
                            label: "Edit batch details",
                            icon: "pencil",
                            onClick: () => open("edit", batch),
                          },
                          {
                            label: batch.restricted ? "Allow issuing again" : "Restrict from issuing",
                            icon: batch.restricted ? "unlock" : "slash-circle",
                            danger: !batch.restricted,
                            onClick: () => toggleRestriction(batch),
                            disabled: Number(batch.quantityAvailable) <= 0,
                          },
                          {
                            label: "Adjust quantity",
                            icon: "plus-slash-minus",
                            onClick: () => open("adjust", batch),
                            disabled: isExpired,
                          },
                          {
                            label: "Process expired stock",
                            icon: "archive",
                            danger: true,
                            onClick: () => open("dispose", batch),
                            disabled:
                              !isExpired ||
                              Number(batch.quantityAvailable) <= 0,
                          },
                          ...(admin ? [
                            {
                              label: "Delete batch",
                              icon: "trash",
                              danger: true,
                              onClick: () => setConfirmDelete(batch),
                              disabled: Number(batch.quantityAvailable) !== 0,
                            },
                          ] : []),
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filteredBatches.length && (
            <Empty text="No inventory batches match the selected filter." />
          )}
        </div>
      </div>

      {modal && (
        <Modal
          title={
            modal === "receive"
              ? restockProduct
                ? `Restock ${restockProduct.genericName}`
                : "Receive stock batch"
              : modal === "edit"
                ? "Edit batch details"
                : modal === "dispose"
                  ? `Process expired batch ${selected?.batchNumber}`
                  : `Adjust ${selected?.batchNumber}`
          }
          onClose={() => {
            setModal(null);
            setRestockProduct(null);
          }}
          size={modal === "dispose" ? "lg" : "md"}
        >
          <form onSubmit={save}>
            {modal === "dispose" && selected && (
              <>
                <div className="expired-stock-summary">
                  <span>
                    <i className="bi bi-exclamation-triangle" />
                  </span>
                  <div>
                    <strong>{productName(selected.product)}</strong>
                    <small>
                      Batch {selected.batchNumber} expired on{" "}
                      {new Date(selected.expiryDate).toLocaleDateString()} ·{" "}
                      {selected.quantityAvailable} {selected.product.unit}{" "}
                      awaiting action
                    </small>
                  </div>
                </div>
                <div className="alert alert-warning small">
                  This action creates an immutable stock movement and removes
                  the selected quantity from available inventory.
                </div>
              </>
            )}

            {modal === "receive" && restockProduct && (
              <div className="restock-summary">
                <span>
                  <i className="bi bi-graph-down-arrow" />
                </span>
                <div>
                  <strong>Low-stock replenishment</strong>
                  <small>
                    Current usable stock: {restockProduct.usableStock}{" "}
                    {restockProduct.unit} · reorder level:{" "}
                    {restockProduct.reorderLevel}. The suggested quantity of{" "}
                    {suggestedRestockQuantity(restockProduct)} targets twice the
                    reorder level and can be changed before receiving.
                  </small>
                </div>
              </div>
            )}

            <div className="form-grid">
              {modal === "receive" && (
                <div>
                  <label className="form-label">Related product</label>
                  {restockProduct ? (
                    <div className="locked-field">
                      <strong>
                        {restockProduct.genericName}
                        {restockProduct.strength &&
                        restockProduct.strength !== "N/A"
                          ? ` ${restockProduct.strength}`
                          : ""}
                      </strong>
                      <small>{restockProduct.sku}</small>
                    </div>
                  ) : (
                    <SearchableSelect
                      value={form.productId}
                      onChange={(productId) =>
                        setForm({ ...form, productId: Number(productId) })
                      }
                      options={products
                        .filter((product) => product.active)
                        .map((product) => ({
                          value: product.id,
                          label: `${product.genericName}${product.strength && product.strength !== "N/A" ? ` ${product.strength}` : ""}`,
                          description: `${product.brandName || "Unbranded"} · ${product.sku || ""}`,
                        }))}
                      placeholder="Search product, brand, strength or SKU"
                      required
                    />
                  )}
                </div>
              )}

              {modal !== "adjust" && modal !== "dispose" && (
                <>
                  <div>
                    <label className="form-label">Related supplier</label>
                    <SearchableSelect
                      value={form.supplierId}
                      onChange={(supplierId) =>
                        setForm({
                          ...form,
                          supplierId: String(supplierId),
                        })
                      }
                      options={[
                        { value: "", label: "Not specified" },
                        ...suppliers.map((supplier) => ({
                          value: supplier.id,
                          label: supplier.name,
                          description:
                            supplier.contactPerson || supplier.phone || "",
                        })),
                      ]}
                      placeholder="Search supplier (optional)"
                    />
                  </div>
                  <div>
                    <label className="form-label">Batch number</label>
                    <input
                      className="form-control"
                      value={form.batchNumber}
                      onChange={(event) =>
                        setForm({ ...form, batchNumber: event.target.value })
                      }
                      required
                    />
                  </div>
                  {modal === "receive" && (
                    <div>
                      <label className="form-label">Quantity received</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={form.quantity}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            quantity: Number(event.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="form-label">Purchase price</label>
                    <input
                      className="form-control"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.purchasePrice}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          purchasePrice: Number(event.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Expiry date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={form.expiryDate}
                      onChange={(event) =>
                        setForm({ ...form, expiryDate: event.target.value })
                      }
                      required
                    />
                  </div>
                </>
              )}

              {modal === "receive" && (
                <div className="full">
                  <label className="form-label">Receipt note</label>
                  <input
                    className="form-control"
                    value={form.note}
                    onChange={(event) =>
                      setForm({ ...form, note: event.target.value })
                    }
                  />
                </div>
              )}

              {modal === "adjust" && (
                <>
                  <div>
                    <label className="form-label">Quantity change</label>
                    <input
                      className="form-control"
                      type="number"
                      step="0.001"
                      value={form.quantityChange}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          quantityChange: Number(event.target.value),
                        })
                      }
                      required
                    />
                    <small className="text-secondary">
                      Use a negative value to reduce stock.
                    </small>
                  </div>
                  <div>
                    <label className="form-label">Mandatory reason</label>
                    <textarea
                      className="form-control"
                      value={form.reason}
                      onChange={(event) =>
                        setForm({ ...form, reason: event.target.value })
                      }
                      required
                    />
                  </div>
                </>
              )}

              {modal === "dispose" && selected && (
                <>
                  <div>
                    <label className="form-label">Disposition outcome</label>
                    <select
                      className="form-select"
                      value={form.dispositionAction}
                      onChange={(event) => {
                        const dispositionAction = event.target
                          .value as DispositionAction;
                        setForm({
                          ...form,
                          dispositionAction,
                          destinationName:
                            dispositionAction === "RETURNED_TO_SUPPLIER"
                              ? selected.supplier?.name || ""
                              : dispositionAction ===
                                  "RETURNED_TO_MANUFACTURER"
                                ? selected.product.manufacturer?.name || ""
                                : "",
                        });
                      }}
                    >
                      <option value="DISCARDED">
                        Discarded through approved waste process
                      </option>
                      <option value="DESTROYED">
                        Removed / destroyed
                      </option>
                      <option value="RETURNED_TO_SUPPLIER">
                        Returned to supplier
                      </option>
                      <option value="RETURNED_TO_MANUFACTURER">
                        Returned to manufacturer
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">
                      Quantity to process ({selected.product.unit})
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      min="0.001"
                      max={selected.quantityAvailable}
                      step="0.001"
                      value={form.dispositionQuantity}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          dispositionQuantity: Number(event.target.value),
                        })
                      }
                      required
                    />
                    <small className="text-secondary">
                      Use the full remaining quantity to clear the expired
                      indication.
                    </small>
                  </div>
                  {form.dispositionAction.startsWith("RETURNED_") && (
                    <div className="full">
                      <label className="form-label">
                        Receiving supplier / manufacturer
                      </label>
                      <input
                        className="form-control"
                        value={form.destinationName}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            destinationName: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  )}
                  <div className="full">
                    <label className="form-label">
                      Reason / reference note
                    </label>
                    <textarea
                      className="form-control"
                      minLength={3}
                      maxLength={220}
                      value={form.reason}
                      onChange={(event) =>
                        setForm({ ...form, reason: event.target.value })
                      }
                      placeholder="Record the waste procedure, return reference, authorization, or other relevant note."
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <ModalActions
              onClose={() => {
                setModal(null);
                setRestockProduct(null);
              }}
              submitLabel={
                modal === "receive"
                  ? restockProduct
                    ? "Receive restock"
                    : "Receive batch"
                  : modal === "edit"
                    ? "Save batch"
                    : modal === "dispose"
                      ? "Record disposition"
                      : "Apply adjustment"
              }
              busy={busy}
            />
          </form>
        </Modal>
      )}
      {confirmDelete && (
        <ConfirmModal
          title={`Delete batch ${confirmDelete.batchNumber}?`}
          message={`Are you sure you want to permanently delete this empty inventory batch? This action will also delete all historical stock movements, dispensing details, or sales for this batch. This action cannot be undone.`}
          onConfirm={() => deleteBatch(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
          busy={busy}
        />
      )}
    </>
  );
}
