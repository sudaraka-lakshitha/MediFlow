// RECORDS WHO OPENED SENSITIVE RECORDS
// Opening a prescription, an uploaded file, an invoice or a staff security record is written to the
// audit log.
// Ordinary list pages are not logged, to keep the log useful.

import { recordAudit } from '../services/audit.service.js';

const rules = [
  // Successful reads are audited only when they expose an individual clinical,
  // financial, or staff-security record. Routine list/dashboard reads are not
  // stored; failed requests continue to be captured by the error handler.
  { pattern: /^\/api\/prescription-uploads\/(\d+)\/file$/, action: 'PRESCRIPTION_FILE_VIEWED', entityType: 'PRESCRIPTION_UPLOAD' },
  { pattern: /^\/api\/prescriptions\/(\d+)$/, action: 'PRESCRIPTION_VIEWED', entityType: 'PRESCRIPTION' },
  { pattern: /^\/api\/sales\/(\d+)\/invoice\.pdf$/, action: null },
  { pattern: /^\/api\/payment-requests\/(\d+)\/(handoff|receipt)\.pdf$/, action: 'PAYMENT_DOCUMENT_VIEWED', entityType: 'PAYMENT_REQUEST' },
  { pattern: /^\/api\/patients\/(\d+)(?:\/|$)/, action: 'PATIENT_RECORD_VIEWED', entityType: 'PATIENT' },
  { pattern: /^\/api\/users(?:\/|$)/, action: 'STAFF_RECORDS_VIEWED', entityType: 'USER' },
];

// Runs after the reply is sent: if the address matches one of the rules above and the request
// succeeded, save an audit entry.
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
