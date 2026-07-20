import { recordAudit } from '../services/audit.service.js';

const rules = [
  { pattern: /^\/api\/prescription-uploads\/(\d+)\/file$/, action: 'PRESCRIPTION_FILE_VIEWED', entityType: 'PRESCRIPTION_UPLOAD' },
  { pattern: /^\/api\/prescriptions\/(\d+)$/, action: 'PRESCRIPTION_VIEWED', entityType: 'PRESCRIPTION' },
  { pattern: /^\/api\/sales\/(\d+)\/invoice\.pdf$/, action: null },
  { pattern: /^\/api\/payment-requests\/(\d+)\/(handoff|receipt)\.pdf$/, action: 'PAYMENT_DOCUMENT_VIEWED', entityType: 'PAYMENT_REQUEST' },
  { pattern: /^\/api\/patients(?:\/|$)/, action: 'PATIENT_RECORDS_VIEWED', entityType: 'PATIENT' },
  { pattern: /^\/api\/prescriptions(?:\/|$)/, action: 'PRESCRIPTION_RECORDS_VIEWED', entityType: 'PRESCRIPTION' },
  { pattern: /^\/api\/prescription-uploads(?:\/|$)/, action: 'PRESCRIPTION_UPLOADS_VIEWED', entityType: 'PRESCRIPTION_UPLOAD' },
  { pattern: /^\/api\/sales(?:\/|$)/, action: 'SALES_RECORDS_VIEWED', entityType: 'SALE' },
  { pattern: /^\/api\/payment-requests(?:\/|$)/, action: 'PAYMENT_REQUESTS_VIEWED', entityType: 'PAYMENT_REQUEST' },
  { pattern: /^\/api\/inventory\/movements(?:\/|$)/, action: 'STOCK_LEDGER_VIEWED', entityType: 'STOCK_MOVEMENT' },
  { pattern: /^\/api\/inventory\/batches(?:\/|$)/, action: 'INVENTORY_VIEWED', entityType: 'INVENTORY_BATCH' },
  { pattern: /^\/api\/users(?:\/|$)/, action: 'STAFF_RECORDS_VIEWED', entityType: 'USER' },
  { pattern: /^\/api\/reports\/(analytics|custom)(?:\/|$|\?)/, action: 'REPORT_ANALYTICS_VIEWED', entityType: 'REPORT' },
];

export const auditReadAccess = (req, res, next) => {
  if (req.method !== 'GET') return next();
  res.on('finish', () => {
    if (!req.user || res.statusCode < 200 || res.statusCode >= 400) return;
    const path = req.originalUrl.split('?')[0];
    const rule = rules.find((candidate) => candidate.pattern.test(path));
    if (!rule?.action) return;
    const match = path.match(rule.pattern);
    const possibleId = Number(match?.[1]);
    void recordAudit({
      userId: req.user.id,
      action: rule.action,
      entityType: rule.entityType,
      entityId: Number.isInteger(possibleId) && possibleId > 0 ? possibleId : undefined,
      details: { statusCode: res.statusCode },
      ipAddress: req.ip,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
    });
  });
  next();
};
