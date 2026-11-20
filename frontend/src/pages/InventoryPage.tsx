import { formatPharmacyDate, formatPharmacyDateTime } from "../utils/pharmacyTime";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client";
import { useHistoryPage } from "../api/useHistoryPage";
import { stockQuantityStep } from "../utils/unitMeasure";
import { useAuth } from "../auth/useAuth";
import { ActionsDropdown } from "../components/ActionsDropdown";
import { ConfirmModal } from "../components/ConfirmModal";
import { Modal, ModalActions } from "../components/Modal";
import { SearchableSelect } from "../components/SearchableSelect";
import { Alert, Empty, Loading, Metric, Status, LockedReason } from "../components/Ui";
import { Pagination } from "../components/Pagination";
import { useClientPagination } from "../utils/useClientPagination";
import { BulkStockModal } from "../components/BulkStockModal";

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
  quantityReserved?: number;
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
  quantity: 1 as number | string,
  purchasePrice: 0,
  expiryDate: "",
  note: "",
  quantityChange: 0,
  adjustDirection: "INCREASE" as "INCREASE" | "DECREASE",
  adjustQuantity: 0 as number | string,
  reason: "",
  dispositionAction: "DISCARDED" as DispositionAction,
  dispositionQuantity: 0 as number | string,
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
  const { get: readHistory, controls: historyControls } = useHistoryPage('Inventory batches');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notingProductId, setNotingProductId] = useState<number | null>(null);
  const [modal, setModal] = useState<InventoryModal | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selected, setSelected] = useState<Batch | null>(null);
  const [restockProduct, setRestockProduct] = useState<any | null>(null);
  const [filter, setFilter] = useState<BatchFilter>("CURRENT");
  const [search, setSearch] = useState("");
  const [lowStockSearch, setLowStockSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState<"ALL" | "ATTENTION" | "OUT_OF_STOCK" | "NOTED">("ALL");
  const [lowStockViewMode, setLowStockViewMode] = useState<"cards" | "table">("cards");
  const [lowStockPage, setLowStockPage] = useState(1);
  const [showAllLowStock, setShowAllLowStock] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const { user } = useAuth();
  const admin = user!.role === "ADMIN";
  const [confirmDelete, setConfirmDelete] = useState<Batch | null>(null);
  const [restrictionTarget, setRestrictionTarget] = useState<Batch | null>(null);
  const [restrictionReason, setRestrictionReason] = useState("");

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
    const reason = batch.restricted ? "" : restrictionReason.trim();
    if (!batch.restricted && reason.length < 3) return;
    setBusy(true);
    try {
      await api.patch(`/inventory/batches/${batch.id}/restriction`, {
        restricted: !batch.restricted,
        reason: reason || null,
      });
      await load();
      setRestrictionTarget(null);
      setRestrictionReason("");
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
          readHistory("/inventory/batches"),
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
  }, [readHistory]);

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
        const magnitude = Math.abs(Number(form.adjustQuantity));
        await api.post(`/inventory/batches/${selected.id}/adjust`, {
          quantityChange: form.adjustDirection === "DECREASE" ? -magnitude : magnitude,
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
                ? total + Number(batch.quantityAvailable) - Number(batch.quantityReserved || 0)
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

  const filteredLowStockProducts = useMemo(() => {
    const term = lowStockSearch.trim().toLowerCase();
    return lowStockProducts.filter((product) => {
      const matchesFilter =
        lowStockFilter === "ALL" ||
        (lowStockFilter === "ATTENTION" && !product.lowStockAcknowledged) ||
        (lowStockFilter === "OUT_OF_STOCK" && Number(product.usableStock) === 0) ||
        (lowStockFilter === "NOTED" && product.lowStockAcknowledged);
      const matchesSearch =
        !term ||
        [
          product.genericName,
          product.brandName,
          product.strength,
          product.sku,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [lowStockProducts, lowStockFilter, lowStockSearch]);

  const lowStockPageSize = lowStockViewMode === "cards" ? 8 : 12;
  const lowStockTotalPages = Math.max(1, Math.ceil(filteredLowStockProducts.length / lowStockPageSize));
  const paginatedLowStockProducts = useMemo(() => {
    if (showAllLowStock) return filteredLowStockProducts;
    const start = (lowStockPage - 1) * lowStockPageSize;
    return filteredLowStockProducts.slice(start, start + lowStockPageSize);
  }, [filteredLowStockProducts, showAllLowStock, lowStockPage, lowStockPageSize]);

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
  const batchPagination = useClientPagination(filteredBatches, 25);

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
          <button type="button" className="btn btn-outline-primary" onClick={() => setBulkOpen(true)}>
            <i className="bi bi-file-earmark-arrow-up me-2" />
            Bulk stock update
          </button>
          <button className="btn btn-primary" onClick={() => open("receive")}>
            <i className="bi bi-box-arrow-in-down me-2" />
            Receive stock
          </button>
        </div>
      </div>
      <Alert message={error} />
      {historyControls}

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
            <i className="bi bi-bell-fill" />
          </span>
          <div>
            <strong>Inventory attention</strong>
            <small>
              Click any alert chip to filter matching inventory batches below.
            </small>
          </div>
        </div>
        <div className="inventory-alert-chips">
          <button
            type="button"
            className={`inventory-alert-chip danger ${filter === "EXPIRED_PENDING" ? "active" : ""}`}
            onClick={() => setFilter(filter === "EXPIRED_PENDING" ? "CURRENT" : "EXPIRED_PENDING")}
            title="Toggle filter: Expired batches awaiting action"
          >
            <i className="bi bi-exclamation-octagon" />
            <strong>{alerts.expiredBatches || 0}</strong>
            <span>Expired</span>
            {filter === "EXPIRED_PENDING" && <i className="bi bi-x-circle-fill text-danger ms-1" style={{ fontSize: "0.85rem" }} />}
          </button>
          <button
            type="button"
            className={`inventory-alert-chip warning ${filter === "NEAR_EXPIRY" ? "active" : ""}`}
            onClick={() => setFilter(filter === "NEAR_EXPIRY" ? "CURRENT" : "NEAR_EXPIRY")}
            title={`Toggle filter: Batches expiring within ${nearExpiryDays} days`}
          >
            <i className="bi bi-hourglass-split" />
            <strong>{alerts.nearExpiryBatches || 0}</strong>
            <span>Near expiry</span>
            {filter === "NEAR_EXPIRY" && <i className="bi bi-x-circle-fill text-warning ms-1" style={{ fontSize: "0.85rem" }} />}
          </button>
          <button
            type="button"
            className={`inventory-alert-chip info ${filter === "LOW_STOCK" ? "active" : ""}`}
            onClick={() => {
              setFilter(filter === "LOW_STOCK" ? "CURRENT" : "LOW_STOCK");
              const el = document.getElementById("low-stock-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            title="Toggle filter: Low-stock products"
          >
            <i className="bi bi-graph-down-arrow" />
            <strong>{alerts.lowStockRequiresAttention ?? lowStockRequiresAttention}</strong>
            <span>Low-stock attention</span>
            {filter === "LOW_STOCK" && <i className="bi bi-x-circle-fill text-info ms-1" style={{ fontSize: "0.85rem" }} />}
          </button>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div id="low-stock-section" className="panel inventory-low-stock-panel">
          <div className="panel-header">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3>Low-stock products</h3>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1" style={{ fontSize: "0.74rem", fontWeight: 700 }}>
                  {lowStockRequiresAttention} require attention
                </span>
              </div>
              <small>
                Review suggested replenishment quantities and receive new stock batches directly. Noted items remain visible but do not count toward pending attention alerts unless stock levels change.
              </small>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <div className="btn-group btn-group-sm" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`btn ${lowStockViewMode === "cards" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setLowStockViewMode("cards")}
                  title="Card view"
                >
                  <i className="bi bi-grid-fill me-1" />
                  Cards
                </button>
                <button
                  type="button"
                  className={`btn ${lowStockViewMode === "table" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setLowStockViewMode("table")}
                  title="Table view"
                >
                  <i className="bi bi-table me-1" />
                  Table
                </button>
              </div>
            </div>
          </div>

          <div className="low-stock-toolbar-row">
            <div className="low-stock-filters-group">
              <button
                type="button"
                className={`low-stock-tab-btn ${lowStockFilter === "ALL" ? "active" : ""}`}
                onClick={() => { setLowStockFilter("ALL"); setLowStockPage(1); }}
              >
                All ({lowStockProducts.length})
              </button>
              <button
                type="button"
                className={`low-stock-tab-btn ${lowStockFilter === "ATTENTION" ? "active" : ""}`}
                onClick={() => { setLowStockFilter("ATTENTION"); setLowStockPage(1); }}
              >
                Action needed ({lowStockRequiresAttention})
              </button>
              <button
                type="button"
                className={`low-stock-tab-btn ${lowStockFilter === "OUT_OF_STOCK" ? "active" : ""}`}
                onClick={() => { setLowStockFilter("OUT_OF_STOCK"); setLowStockPage(1); }}
              >
                Out of stock ({lowStockProducts.filter(p => Number(p.usableStock) === 0).length})
              </button>
              {lowStockProducts.some(p => p.lowStockAcknowledged) && (
                <button
                  type="button"
                  className={`low-stock-tab-btn ${lowStockFilter === "NOTED" ? "active" : ""}`}
                  onClick={() => { setLowStockFilter("NOTED"); setLowStockPage(1); }}
                >
                  Noted ({lowStockProducts.filter(p => p.lowStockAcknowledged).length})
                </button>
              )}
            </div>

            <div className="low-stock-search-wrap">
              <i className="bi bi-search" />
              <input
                type="text"
                className="form-control form-control-sm low-stock-search-input"
                placeholder="Search by name, strength or SKU..."
                value={lowStockSearch}
                onChange={(e) => {
                  setLowStockSearch(e.target.value);
                  setLowStockPage(1);
                }}
              />
            </div>
          </div>

          {filteredLowStockProducts.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="bi bi-search mb-2 d-block" style={{ fontSize: "1.5rem" }} />
              <p className="mb-0 small">No low-stock products match your filter or search criteria.</p>
            </div>
          ) : lowStockViewMode === "cards" ? (
            <div className="inventory-low-stock-grid">
              {paginatedLowStockProducts.map((product) => {
                const isOutOfStock = Number(product.usableStock) === 0;
                const reorder = Number(product.reorderLevel || 1);
                const percent = Math.min(100, Math.max(isOutOfStock ? 0 : 5, (Number(product.usableStock) / Math.max(1, reorder)) * 100));

                return (
                  <div
                    key={product.id}
                    className={`inventory-low-stock-card ${isOutOfStock ? "is-critical" : "is-low-stock"} ${product.lowStockAcknowledged ? "is-noted" : ""}`}
                  >
                    <div className="low-stock-card-header">
                      <div className="low-stock-product-meta">
                        <div className="low-stock-title-row">
                          <span className="low-stock-name">{product.genericName}</span>
                          {product.strength && product.strength !== "N/A" && (
                            <span className="low-stock-strength-badge">{product.strength}</span>
                          )}
                        </div>
                        <div className="low-stock-sub-meta">
                          <span className="low-stock-sku">{product.sku}</span>
                          {product.brandName && (
                            <span className="low-stock-brand">{product.brandName}</span>
                          )}
                        </div>
                      </div>
                      <div className="low-stock-badges">
                        {isOutOfStock ? (
                          <span className="stock-pill stock-pill-danger">
                            <i className="bi bi-exclamation-octagon-fill" />
                            Out of stock
                          </span>
                        ) : (
                          <span className="stock-pill stock-pill-warning">
                            <i className="bi bi-exclamation-triangle-fill" />
                            Low stock
                          </span>
                        )}
                        {product.lowStockAcknowledged && (
                          <span className="stock-pill stock-pill-success">
                            <i className="bi bi-check2-circle" />
                            Noted
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="low-stock-card-body">
                      <div className="low-stock-stats-row">
                        <div className="low-stock-stat-box">
                          <span className="stat-label">Usable stock</span>
                          <span className={`stat-value ${isOutOfStock ? "text-danger" : "text-amber"}`}>
                            {product.usableStock} <span className="stat-unit">{product.unit}</span>
                          </span>
                        </div>
                        <div className="low-stock-stat-box">
                          <span className="stat-label">Reorder point</span>
                          <span className="stat-value text-secondary">
                            {product.reorderLevel} <span className="stat-unit">{product.unit}</span>
                          </span>
                        </div>
                        <div className="low-stock-stat-box">
                          <span className="stat-label">Suggested restock</span>
                          <span className="suggested-pill">
                            <i className="bi bi-box-seam me-1" />
                            +{suggestedRestockQuantity(product)} {product.unit}
                          </span>
                        </div>
                      </div>

                      <div className="stock-progress-container" title={`Stock ratio: ${product.usableStock} / ${product.reorderLevel} ${product.unit}`}>
                        <div
                          className={`stock-progress-bar ${isOutOfStock ? "empty" : "low"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="low-stock-card-footer">
                      <div className="low-stock-audit">
                        {product.lowStockAcknowledged && product.lowStockAcknowledgement?.acknowledgedBy ? (
                          <small title={formatPharmacyDateTime(product.lowStockAcknowledgement.acknowledgedAt)}>
                            <i className="bi bi-check2 text-success me-1" />
                            Noted by {product.lowStockAcknowledgement.acknowledgedBy.fullName}
                          </small>
                        ) : (
                          <small className="text-secondary">
                            <i className="bi bi-arrow-repeat me-1" />
                            Replenishment pending
                          </small>
                        )}
                      </div>
                      <div className="low-stock-buttons">
                        <button
                          type="button"
                          className={`btn btn-sm ${product.lowStockAcknowledged ? "btn-outline-secondary" : "btn-outline-primary"}`}
                          disabled={notingProductId === product.id}
                          onClick={() => setLowStockNoted(product, !product.lowStockAcknowledged)}
                        >
                          {notingProductId === product.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className={`bi ${product.lowStockAcknowledged ? "bi-arrow-counterclockwise" : "bi-check2-circle"} me-1`} />
                          )}
                          {product.lowStockAcknowledged ? "Undo note" : "Mark noted"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary low-stock-restock-btn"
                          onClick={() => open("receive", undefined, product)}
                        >
                          <i className="bi bi-box-arrow-in-down me-1" />
                          Restock
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="low-stock-table-wrap">
              <div className="table-responsive">
                <table className="table low-stock-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Product & SKU</th>
                      <th>Usable Stock</th>
                      <th>Reorder Level</th>
                      <th>Stock Level</th>
                      <th>Suggested Restock</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLowStockProducts.map((product) => {
                      const isOutOfStock = Number(product.usableStock) === 0;
                      const reorder = Number(product.reorderLevel || 1);
                      const percent = Math.min(100, Math.max(isOutOfStock ? 0 : 5, (Number(product.usableStock) / Math.max(1, reorder)) * 100));

                      return (
                        <tr key={product.id} className={isOutOfStock ? "table-row-critical" : ""}>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-semibold text-dark">{product.genericName}</span>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                <span className="low-stock-sku">{product.sku}</span>
                                {product.strength && product.strength !== "N/A" && (
                                  <span className="low-stock-strength-badge">{product.strength}</span>
                                )}
                                {product.brandName && (
                                  <span className="low-stock-brand">{product.brandName}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`fw-bold ${isOutOfStock ? "text-danger" : "text-amber"}`}>
                              {product.usableStock} {product.unit}
                            </span>
                          </td>
                          <td>
                            <span className="text-secondary">{product.reorderLevel} {product.unit}</span>
                          </td>
                          <td style={{ minWidth: "120px" }}>
                            <div className="stock-progress-container" title={`${product.usableStock} / ${product.reorderLevel} ${product.unit}`}>
                              <div
                                className={`stock-progress-bar ${isOutOfStock ? "empty" : "low"}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="suggested-pill">
                              <i className="bi bi-box-seam me-1" />
                              +{suggestedRestockQuantity(product)} {product.unit}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              {isOutOfStock ? (
                                <span className="stock-pill stock-pill-danger">Out of stock</span>
                              ) : (
                                <span className="stock-pill stock-pill-warning">Low stock</span>
                              )}
                              {product.lowStockAcknowledged && (
                                <span className="stock-pill stock-pill-success">Noted</span>
                              )}
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <button
                                type="button"
                                className={`btn btn-sm ${product.lowStockAcknowledged ? "btn-outline-secondary" : "btn-outline-primary"}`}
                                disabled={notingProductId === product.id}
                                onClick={() => setLowStockNoted(product, !product.lowStockAcknowledged)}
                                title={product.lowStockAcknowledged ? "Undo note" : "Mark noted"}
                              >
                                {notingProductId === product.id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className={`bi ${product.lowStockAcknowledged ? "bi-arrow-counterclockwise" : "bi-check2-circle"}`} />
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary low-stock-restock-btn"
                                onClick={() => open("receive", undefined, product)}
                              >
                                <i className="bi bi-box-arrow-in-down me-1" />
                                Restock
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredLowStockProducts.length > lowStockPageSize && (
            <div className="low-stock-pagination-bar">
              <div>
                Showing{" "}
                <strong>
                  {showAllLowStock
                    ? `all ${filteredLowStockProducts.length}`
                    : `${(lowStockPage - 1) * lowStockPageSize + 1}–${Math.min(lowStockPage * lowStockPageSize, filteredLowStockProducts.length)} of ${filteredLowStockProducts.length}`}
                </strong>{" "}
                low-stock products
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowAllLowStock(!showAllLowStock)}
                >
                  {showAllLowStock ? "Show paginated" : `Show all (${filteredLowStockProducts.length})`}
                </button>
                {!showAllLowStock && (
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={lowStockPage <= 1}
                      onClick={() => setLowStockPage((prev) => Math.max(1, prev - 1))}
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                    <span className="btn btn-outline-secondary disabled text-dark px-3">
                      {lowStockPage} / {lowStockTotalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={lowStockPage >= lowStockTotalPages}
                      onClick={() => setLowStockPage((prev) => Math.min(lowStockTotalPages, prev + 1))}
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="panel">
        <div className="inventory-toolbar">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3>Inventory batches</h3>
              {filter !== "ALL" && filter !== "CURRENT" && (
                <div className="active-filter-banner">
                  <span>Filtered: {filter.replace("_", " ")}</span>
                  <button
                    type="button"
                    onClick={() => setFilter("CURRENT")}
                    title="Reset to current stock"
                  >
                    <i className="bi bi-x-circle-fill" />
                  </button>
                </div>
              )}
            </div>
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
              <option value="CURRENT" title="Hides disposed and returned batches">
                Current stock only
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
              {batchPagination.visibleRows.map((batch) => {
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
                      {Number(batch.quantityReserved) > 0 && (
                        <small className="d-block text-secondary">
                          {batch.quantityReserved} reserved for paid bills
                        </small>
                      )}
                    </td>
                    <td>{formatPharmacyDateTime(batch.receivedAt)}</td>
                    <td>{formatPharmacyDate(batch.expiryDate)}</td>
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
                          {formatPharmacyDateTime(
                            batch.latestDisposition.processedAt,
                          )}
                        </small>
                      )}
                      {batch.restricted && (
                        <small className="inventory-disposition-note text-danger">
                          Issuing stopped: {batch.restrictionReason}
                          {batch.restrictedAt ? ` · ${formatPharmacyDateTime(batch.restrictedAt)}` : ""}
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
                            onClick: () => { setRestrictionTarget(batch); setRestrictionReason(""); },
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
        <Pagination page={batchPagination.page} pageCount={batchPagination.pageCount} total={filteredBatches.length} pageSize={batchPagination.pageSize} onPageChange={batchPagination.setPage} />
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
                      {formatPharmacyDate(selected.expiryDate)} ·{" "}
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
                        step={stockQuantityStep(products.find((product: any) => product.id === Number(form.productId))?.unit)}
                        min={stockQuantityStep(products.find((product: any) => product.id === Number(form.productId))?.unit)}
                        value={form.quantity}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            quantity: event.target.value,
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

              {modal === "adjust" && selected && (
                <>
                  <div>
                    <label className="form-label">Direction</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${form.adjustDirection === "INCREASE" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() =>
                          setForm({ ...form, adjustDirection: "INCREASE" })
                        }
                      >
                        <i className="bi bi-plus-lg me-1" />
                        Add stock
                      </button>
                      <button
                        type="button"
                        className={`btn ${form.adjustDirection === "DECREASE" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() =>
                          setForm({ ...form, adjustDirection: "DECREASE" })
                        }
                      >
                        <i className="bi bi-dash-lg me-1" />
                        Remove stock
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Quantity</label>
                    <input
                      className="form-control"
                      type="number"
                      min={stockQuantityStep(selected.product.unit)}
                      step={stockQuantityStep(selected.product.unit)}
                      value={form.adjustQuantity}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          adjustQuantity: event.target.value,
                        })
                      }
                      required
                    />
                    <small className="text-secondary">
                      Current stock: {Number(selected.quantityAvailable)}{" "}
                      {selected.product?.unit}. New stock will be{" "}
                      {form.adjustDirection === "DECREASE"
                        ? Number(selected.quantityAvailable) - Math.abs(Number(form.adjustQuantity) || 0)
                        : Number(selected.quantityAvailable) + Math.abs(Number(form.adjustQuantity) || 0)}{" "}
                      {selected.product?.unit}.
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
                      min={stockQuantityStep(selected.product.unit)}
                      max={selected.quantityAvailable}
                      step={stockQuantityStep(selected.product.unit)}
                      value={form.dispositionQuantity}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          dispositionQuantity: event.target.value,
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
      {restrictionTarget && (
        <Modal title={restrictionTarget.restricted ? `Resume batch ${restrictionTarget.batchNumber}?` : `Stop issuing batch ${restrictionTarget.batchNumber}?`} onClose={() => setRestrictionTarget(null)} size="sm">
          <p className="text-secondary small">{restrictionTarget.restricted ? "This batch will become available for allocation and dispensing again." : "This immediately prevents the batch from being allocated to new sales or prescriptions."}</p>
          {!restrictionTarget.restricted && <div><label className="form-label">Reason for restriction</label><textarea className="form-control" value={restrictionReason} onChange={(event) => setRestrictionReason(event.target.value)} minLength={3} maxLength={220} placeholder="Describe the quality, recall, or handling concern." required /></div>}
          <LockedReason reason={!restrictionTarget.restricted && restrictionReason.trim().length < 3 ? "Describe the concern (at least 3 characters) to stop issuing this batch." : ""} />
          <div className="modal-actions"><button type="button" className="btn btn-light" onClick={() => setRestrictionTarget(null)}>Cancel</button><button type="button" className={`btn ${restrictionTarget.restricted ? 'btn-primary' : 'btn-danger'}`} disabled={busy || (!restrictionTarget.restricted && restrictionReason.trim().length < 3)} onClick={() => toggleRestriction(restrictionTarget)}>{busy ? 'Working…' : restrictionTarget.restricted ? 'Resume issuing' : 'Stop issuing'}</button></div>
        </Modal>
      )}
      {bulkOpen && (
        <BulkStockModal
          onClose={() => setBulkOpen(false)}
          onApplied={() => { void load(); }}
        />
      )}
    </>
  );
}
