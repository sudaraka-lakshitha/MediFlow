import { useEffect, useMemo, useState } from 'react';

export function useClientPagination<T>(rows: T[], pageSize = 25) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  useEffect(() => setPage(1), [rows]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  const visibleRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [page, pageSize, rows]);
  return { page, pageCount, pageSize, setPage, visibleRows };
}
