import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../src/config/logger.js', () => ({ logger: { debug: vi.fn(), warn: vi.fn(), error: vi.fn() } }));
vi.mock('../src/services/audit.service.js', () => ({ recordAudit: vi.fn() }));
import { logger } from '../src/config/logger.js';
import { recordAudit } from '../src/services/audit.service.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { AppError } from '../src/utils/AppError.js';
beforeEach(() => vi.clearAllMocks());
const run = (method, status = 423, code = 'SESSION_LOCKED') => {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  errorHandler(new AppError(status, 'Test failure', { code }), { method, originalUrl: '/api/navigation/attention', user: { id: 1 } }, res);
  expect(res.status).toHaveBeenCalledWith(status);
};
it.each(['GET', 'HEAD'])('does not create audit noise for a locked %s', method => {
  run(method); expect(recordAudit).not.toHaveBeenCalled(); expect(logger.warn).not.toHaveBeenCalled(); expect(logger.debug).toHaveBeenCalledOnce();
});
it.each([['POST', 423, 'SESSION_LOCKED'], ['GET', 403, 'FORBIDDEN'], ['GET', 500, 'SERVER_ERROR'], ['GET', 423, 'OTHER_LOCK']])('retains real failures: %s %s %s', (method, status, code) => {
  run(method, status, code); expect(recordAudit).toHaveBeenCalledOnce();
});
