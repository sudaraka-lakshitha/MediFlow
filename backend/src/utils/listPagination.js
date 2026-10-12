import { AppError } from './AppError.js';

export const listPagination = (query = {}, statuses = []) => {
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 300);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 300) {
    throw new AppError(400, 'Choose a valid page and a page size between 1 and 300.');
  }
  if (query.status && !statuses.includes(query.status)) throw new AppError(400, 'Unknown list status.');
  return { page, pageSize, status: query.status || undefined };
};
