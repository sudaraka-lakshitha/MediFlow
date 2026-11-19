import { exportDefinitions } from '../services/adminExport.service.js';
import { recordAudit } from '../services/audit.service.js';
import { streamCsv } from '../utils/csv.js';
import { createDataWorkbook, readableLabel, XLSX_MIME } from '../services/spreadsheetExport.service.js';
import { createPdf } from '../utils/pdf.js';
import { pharmacyDateKey, formatPharmacyTimestamp } from '../utils/pharmacyTime.js';

const numericKeys = /^(sellingPrice|reorderLevel|stockOnHand|stockReserved|stockExpired|stockRestricted|stockAvailable|quantityReceived|quantityAvailable|quantityReserved|usableQuantity|purchasePrice|quantityChange|quantityBefore|quantityAfter)$/;
const pdfRowLimit = 1000;

const collectPdfRows = async (pages) => {
  const rows = [];
  let truncated = false;
  for await (const page of pages) {
    for (const row of page) {
      if (rows.length >= pdfRowLimit) { truncated = true; break; }
      rows.push(row);
    }
    if (truncated) break;
  }
  return { rows, truncated };
};

export const adminExportController = {
  download: async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const definition = exportDefinitions[req.params.dataset];
    if (req.params.format === 'pdf') {
      const columns = definition.columns.map((key) => ({ key, label: readableLabel(key), align: numericKeys.test(key) ? 'right' : 'left' }));
      const { rows, truncated } = await collectPdfRows(definition.pages());
      const notes = [
        'Administrative reporting extract; this is not a database backup.',
        'Timestamps are displayed in Sri Lanka time (UTC+05:30); database timestamps remain stored in UTC.',
        'For complete data or bulk editing, use the Excel or CSV export.',
        ...(req.params.dataset === 'patients' ? ['Contains confidential patient information; store and share securely.'] : []),
        ...(truncated ? [`PDF shows the first ${pdfRowLimit.toLocaleString()} rows only. The Excel and CSV exports contain the full extract.`] : []),
        `Exported: ${formatPharmacyTimestamp(new Date())} Sri Lanka time`,
      ];
      const buffer = await createPdf({
        title: `MediFlow ${readableLabel(req.params.dataset)}`,
        subtitle: `Administrative data extract · ${formatPharmacyTimestamp(new Date())} Sri Lanka time`,
        columns,
        rows,
        summary: [{ label: 'Rows in this PDF', value: `${rows.length}${truncated ? '+' : ''}` }, { label: 'Dataset', value: readableLabel(req.params.dataset) }],
        notes,
      });
      await recordAudit({ userId: req.user.id, action: 'ADMIN_DATA_EXPORTED', entityType: 'DATA_EXPORT', details: { dataset: req.params.dataset, format: 'pdf', rowCount: rows.length, truncated }, ipAddress: req.ip });
      res.set('Cache-Control', 'no-store');
      res.attachment(`mediflow-${definition.filename}-${pharmacyDateKey()}.pdf`);
      res.type('application/pdf').send(buffer);
      return;
    }
    if (req.params.format === 'xlsx') {
      const columns = definition.columns.map(key => ({ key, label: readableLabel(key), numeric: /^(sellingPrice|reorderLevel|stockOnHand|stockReserved|stockExpired|stockRestricted|stockAvailable|quantityReceived|quantityAvailable|quantityReserved|usableQuantity|purchasePrice|quantityChange|quantityBefore|quantityAfter)$/.test(key) }));
      const { buffer, rowCount } = await createDataWorkbook({ title: `MediFlow ${readableLabel(req.params.dataset)}`, columns, pages: definition.pages(), notes: ['Administrative reporting extract. Not a database backup.', 'Timestamps are displayed in Sri Lanka time (UTC+05:30); database timestamps remain stored in UTC.', 'For editable data, download Export for update and confirm changes through Bulk update.', `Exported: ${formatPharmacyTimestamp(new Date())} Sri Lanka time`] });
      await recordAudit({ userId: req.user.id, action: 'ADMIN_DATA_EXPORTED', entityType: 'DATA_EXPORT', details: { dataset: req.params.dataset, format: 'xlsx', rowCount }, ipAddress: req.ip });
      res.set('Cache-Control', 'no-store'); res.attachment(`mediflow-${definition.filename}-${pharmacyDateKey()}.xlsx`); res.type(XLSX_MIME).send(buffer); return;
    }
    const columns = definition.columns.map((key) => ({ key, label: key }));
    res.setHeader('Content-Disposition', `attachment; filename="mediflow-${definition.filename}-${pharmacyDateKey()}.csv"`);
    res.type('text/csv');
    const rowCount = await streamCsv(res, columns, definition.pages());
    await recordAudit({ userId: req.user.id, action: 'ADMIN_DATA_EXPORTED', entityType: 'DATA_EXPORT', details: { dataset: req.params.dataset, rowCount }, ipAddress: req.ip });
  },
};
