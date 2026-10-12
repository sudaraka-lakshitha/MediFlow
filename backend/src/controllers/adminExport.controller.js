import { exportDefinitions } from '../services/adminExport.service.js';
import { recordAudit } from '../services/audit.service.js';
import { streamCsv } from '../utils/csv.js';

export const adminExportController = {
  download: async (req, res) => {
    const definition = exportDefinitions[req.params.dataset];
    const columns = definition.columns.map((key) => ({ key, label: key }));
    res.setHeader('Content-Disposition', `attachment; filename="mediflow-${definition.filename}-${new Date().toISOString().slice(0,10)}.csv"`);
    res.type('text/csv');
    const rowCount = await streamCsv(res, columns, definition.pages());
    await recordAudit({ userId: req.user.id, action: 'ADMIN_DATA_EXPORTED', entityType: 'DATA_EXPORT', details: { dataset: req.params.dataset, rowCount }, ipAddress: req.ip });
  },
};
