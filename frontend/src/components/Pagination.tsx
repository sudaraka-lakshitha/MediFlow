export function Pagination({ page, pageCount, total, pageSize, onPageChange }: { page: number; pageCount: number; total: number; pageSize: number; onPageChange(page: number): void }) {
  if (pageCount <= 1) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return <nav className="data-pagination" aria-label="Table pages">
    <span>Showing {first}–{last} of {total}</span>
    <div><button type="button" className="btn btn-sm btn-light" disabled={page === 1} onClick={() => onPageChange(page - 1)}><i className="bi bi-chevron-left" aria-hidden="true" /> Previous</button><span>Page {page} of {pageCount}</span><button type="button" className="btn btn-sm btn-light" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>Next <i className="bi bi-chevron-right" aria-hidden="true" /></button></div>
  </nav>;
}
