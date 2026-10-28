import { exportDefinitions } from '../services/adminExport.service.js';
import { recordAudit } from '../services/audit.service.js';
import { streamCsv } from '../utils/csv.js';
import { createDataWorkbook, readableLabel, XLSX_MIME } from '../services/spreadsheetExport.service.js';

export const adminExportController = {
  download: async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const definition = exportDefinitions[req.params.dataset];
    if (req.params.format === 'xlsx') {
      const columns = definition.columns.map(key => ({ key, label: readableLabel(key), numeric: /^(sellingPrice|reorderLevel|stockOnHand|stockReserved|stockExpired|stockRestricted|stockAvailable|quantityReceived|quantityAvailable|quantityReserved|usableQuantity|purchasePrice|quantityChange|quantityBefore|quantityAfter)$/.test(key) }));
      const { buffer, rowCount } = await createDataWorkbook({ title: `MediFlow ${readableLabel(req.params.dataset)}`, columns, pages: definition.pages(), notes: ['Administrative reporting extract. Not a database backup.', 'For editable data, download Export for update and confirm changes through Bulk update.', `Exported: ${new Date().toISOString()}`] });
      await recordAudit({ userId: req.user.id, action: 'ADMIN_DATA_EXPORTED', entityType: 'DATA_EXPORT', details: { dataset: req.params.dataset, format: 'xlsx', rowCount }, ipAddress: req.ip });
      res.set('Cache-Control', 'no-store'); res.attachment(`mediflow-${definition.filename}-${new Date().toISOString().slice(0,10)}.xlsx`); res.type(XLSX_MIME).send(buffer); return;
    }
    const columns = definition.columns.map((key) => ({ key, label: key }));
    res.setHeader('Content-Disposition', `attachment; filename="mediflow-${definition.filename}-${new Date().toISOString().slice(0,10)}.csv"`);
    res.type('text/csv');
    const rowCount = await streamCsv(res, columns, definition.pages());
    await recordAudit({ userId: req.user.id, action: 'ADMIN_DATA_EXPORTED', entityType: 'DATA_EXPORT', details: { dataset: req.params.dataset, rowCount }, ipAddress: req.ip });
  },
};
