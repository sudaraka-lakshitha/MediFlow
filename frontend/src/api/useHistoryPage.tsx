// Shared "page by page" list helper with Previous / Next buttons for history lists.

import { useCallback, useRef, useState } from 'react';
import { api } from './client';
import { useDebouncedValue } from '../utils/useDebouncedValue';

/** Bounded history navigation. Searches run on the server, never across a downloaded archive. */
export function useHistoryPage(label: string, filters: Record<string, string> = {}, scope = '') {
  const filterKey = useDebouncedValue(JSON.stringify(filters), 300);
  const scopeKey = JSON.stringify([filterKey, scope]);
  const [position, setPosition] = useState({ page: 1, search: '', scope: scopeKey });
  const page = position.scope === scopeKey ? position.page : 1;
  const search = useDebouncedValue(position.search, 300);
  const [hasMore, setHasMore] = useState(false), [count, setCount] = useState(0), [loading, setLoading] = useState(false);
  const request = useRef(0);
  const pending = useRef<Promise<any> | null>(null);
  const get = useCallback(async (path: string, nestedKey?: string) => {
    const version = ++request.current; setLoading(true);
    const responsePromise = api.get(path, { params: { page, pageSize: 50, ...(search ? { search } : {}), ...JSON.parse(filterKey) } });
    pending.current = responsePromise;
    try {
      let latest = responsePromise;
      for (;;) {
        let response;
        try { response = await latest; }
        catch (error) {
          if (latest !== pending.current && pending.current) { latest = pending.current; continue; }
          throw error;
        }
        // Multiple fast searches may supersede each other while an earlier
        // request is still waiting. Never return an intermediate stale page.
        if (latest !== pending.current && pending.current) { latest = pending.current; continue; }
        if (version === request.current) {
          setHasMore(Boolean(response.data.pagination?.hasMore));
          setCount((nestedKey ? response.data.data[nestedKey] : response.data.data).length);
        }
        return response;
      }
    } finally { if (version === request.current) setLoading(false); }
  }, [page, search, filterKey, scope]);
  const controls = <div className="border rounded p-3 my-3" aria-label={`${label} history navigation`}>
    {filters.search === undefined && <label className="form-label d-block mb-0">Search all {label.toLowerCase()}<input className="form-control mt-1" type="search" maxLength={190} value={position.search} placeholder="Reference, name or details" onChange={event => setPosition({ page: 1, search: event.target.value, scope: scopeKey })} /></label>}
    <div className="history-nav-row"><span className="small fw-semibold">{label}: page {page} · {count} records{loading ? ' · Loading…' : ''}</span><div className="history-nav-buttons"><button className="btn btn-sm btn-outline-secondary" aria-label="Previous history page" disabled={loading || page === 1} onClick={() => setPosition(current => ({ ...current, page: page - 1, scope: scopeKey }))}><i className="bi bi-chevron-left" aria-hidden="true" />Previous</button><button className="btn btn-sm btn-outline-secondary" aria-label="Next history page" disabled={loading || !hasMore} onClick={() => setPosition(current => ({ ...current, page: page + 1, scope: scopeKey }))}>Next<i className="bi bi-chevron-right" aria-hidden="true" /></button></div></div>
    <small className="d-block text-secondary mt-1">Search includes older records. Additional table filters and counts apply to this page; use history navigation to browse more.</small>
  </div>;
  return { get, controls };
}
