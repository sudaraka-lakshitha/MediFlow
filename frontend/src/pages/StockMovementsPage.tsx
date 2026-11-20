// STOCK MOVEMENTS PAGE
// The history of every stock change (received, sold, dispensed, adjusted, disposed), to trace any
// stock number.

import { formatPharmacyDateTime } from "../utils/pharmacyTime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { errorMessage } from "../api/client";
import { useHistoryPage } from "../api/useHistoryPage";
import { Alert, Empty, Loading, Status } from "../components/Ui";
import { Pagination } from "../components/Pagination";
import { useClientPagination } from "../utils/useClientPagination";

const movementTypes = [
  "RECEIPT",
  "DISPENSING",
  "RETAIL_SALE",
  "ADJUSTMENT",
  "REVERSAL",
  "EXPIRED",
  "DAMAGED",
  "RETURN",
];

export function StockMovementsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const { get: readHistory, controls: historyControls } = useHistoryPage('Stock movements', { status: type, search });

  const load = useCallback(async () => {
    try {
      setError("");
      const response = await readHistory("/inventory/movements");
      setRows(response.data.data);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [readHistory]);
  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!type || row.type === type) &&
          `${row.product.genericName} ${row.product.strength || ""} ${row.batch.batchNumber} ${row.performedBy.fullName} ${row.reason || ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [rows, search, type],
  );
  const pagination = useClientPagination(filtered, 25);

  if (loading) return <Loading />;
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Stock movement audit</h2>
          <p>
            Every change to on-hand quantity — receipts, dispensing, retail
            sales, adjustments, reversals, and expiry disposal — with who did
            it and when.
          </p>
        </div>
      </div>
      <Alert message={error} />
      {historyControls}
      <div className="panel">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
          <div className="search-select" style={{ maxWidth: 340 }}>
            <input
              className="form-control search-select-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, batch, reason, or staff"
            />
            <i className="bi bi-search search-select-icon" />
          </div>
          <select
            className="form-select"
            style={{ maxWidth: 220 }}
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">All movement types</option>
            {movementTypes.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <span className="text-secondary small">
            Showing {filtered.length} of {rows.length} recent movements
          </span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Product</th>
                <th>Batch</th>
                <th>Quantity change</th>
                <th>Before → After</th>
                <th>Reference</th>
                <th>Reason</th>
                <th>Performed by</th>
              </tr>
            </thead>
            <tbody>
              {pagination.visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <small>{formatPharmacyDateTime(row.createdAt)}</small>
                  </td>
                  <td>
                    <Status value={row.type} />
                  </td>
                  <td>
                    {row.product.genericName} {row.product.strength}
                  </td>
                  <td>
                    <small>{row.batch.batchNumber}</small>
                  </td>
                  <td
                    className={
                      Number(row.quantityChange) < 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    <strong>
                      {Number(row.quantityChange) > 0 ? "+" : ""}
                      {Number(row.quantityChange)} {row.product.unit}
                    </strong>
                  </td>
                  <td>
                    <small>
                      {Number(row.quantityBefore)} → {Number(row.quantityAfter)}
                    </small>
                  </td>
                  <td>
                    <small>
                      {row.referenceType
                        ? `${row.referenceType.replaceAll("_", " ")}${row.referenceId ? ` #${row.referenceId}` : ""}`
                        : "—"}
                    </small>
                  </td>
                  <td>
                    <small>{row.reason || "—"}</small>
                  </td>
                  <td>{row.performedBy.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <Empty text="No stock movements match the selected filters." />}
        </div>
        <Pagination page={pagination.page} pageCount={pagination.pageCount} total={filtered.length} pageSize={pagination.pageSize} onPageChange={pagination.setPage} />
      </div>
    </>
  );
}
