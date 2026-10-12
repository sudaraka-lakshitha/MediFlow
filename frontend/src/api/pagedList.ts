import { api } from './client';

// Existing screens filter/paginate locally. Fetch every server page so older
// unresolved requests remain searchable, rather than silently stopping at 300.
export async function pagedList(path: string, nestedKey?: string) {
  const response = await api.get(path, { params: { page: 1, pageSize: 300 } });
  const rows = [...(nestedKey ? response.data.data[nestedKey] : response.data.data)];
  let pagination = response.data.pagination;
  while (pagination?.hasMore) {
    const next = await api.get(path, { params: { page: pagination.page + 1, pageSize: 300 } });
    rows.push(...(nestedKey ? next.data.data[nestedKey] : next.data.data));
    pagination = next.data.pagination;
  }
  const unique = [...new Map(rows.map((row: any) => [row.id, row])).values()];
  response.data = { ...response.data, data: nestedKey ? { ...response.data.data, [nestedKey]: unique } : unique, pagination };
  return response;
}
