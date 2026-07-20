import { reportService } from '../services/report.service.js';
import { recordAudit } from '../services/audit.service.js';
import { toCsv } from '../utils/csv.js';
import { createPdf } from '../utils/pdf.js';

const dailyColumns = [
  ['invoice', 'Invoice'], ['prescription', 'Prescription'], ['patient', 'Patient'], ['product', 'Product'],
  ['batch', 'Batch'], ['quantity', 'Quantity'], ['pharmacist', 'Pharmacist'], ['grossSales', 'Gross Sales'], ['discount', 'Allocated Discount'],
  ['containerFee', 'Allocated Bottle Fee'], ['netRevenue', 'Net Revenue'], ['cost', 'FIFO Cost'], ['profit', 'Gross Profit'], ['margin', 'Margin'], ['status', 'Status'], ['time', 'Time'],
].map(([key, label]) => ({ key, label }));
const monthlyColumns = [
  ['sku', 'SKU'], ['product', 'Product'], ['opening', 'Opening'], ['received', 'Received'], ['dispensed', 'Sold / Dispensed'],
  ['adjustments', 'Adjustments'], ['closing', 'Closing'], ['reorderLevel', 'Reorder Level'], ['stockValue', 'Stock Value'],
].map(([key, label]) => ({ key, label }));
const customColumns = [
  ['group', 'Group'], ['transactions', 'Transactions'], ['quantity', 'Quantity'], ['grossSales', 'Gross Sales'], ['discount', 'Discount'],
  ['containerFee', 'Bottle Fees'], ['netRevenue', 'Net Revenue'], ['cost', 'FIFO Cost'], ['profit', 'Gross Profit'], ['margin', 'Margin %'],
].map(([key, label]) => ({ key, label }));

const send = async (req, res, type, period, format, rows, columns, presentation = {}) => {
  const filename = `mediflow-${type}-${period}.${format}`;
  const body = format === 'pdf'
    ? await createPdf({ title: `MediFlow ${type[0].toUpperCase() + type.slice(1)} Report`, subtitle: `Period: ${period}`, columns, rows, ...presentation })
    : Buffer.from(`${toCsv([{ key: 'label', label: 'Report summary' }, { key: 'value', label: 'Value' }], [{ label: 'Report', value: type }, { label: 'Period', value: period }, ...(presentation.summary || [])])}\r\n${toCsv(columns, rows)}`);
  await recordAudit({ userId: req.user.id, action: 'REPORT_EXPORTED', entityType: `${type.toUpperCase()}_REPORT`, details: { period, format }, ipAddress: req.ip });
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.type(format === 'pdf' ? 'application/pdf' : 'text/csv').send(body);
};

export const reportController = {
  daily: async (req, res) => { const [rows, analytics] = await Promise.all([reportService.daily(req.query.date), reportService.analytics(req.query.date, req.query.date)]); return send(req, res, 'daily', req.query.date, req.params.format, rows, dailyColumns, analyticsPresentation(analytics)); },
  monthly: async (req, res) => { const rows = await reportService.monthly(req.query.month); const closing = rows.reduce((sum, row) => sum + Number(row.closing), 0); const value = rows.reduce((sum, row) => sum + Number(row.stockValue), 0); return send(req, res, 'monthly', req.query.month, req.params.format, rows, monthlyColumns, { summary: [{ label: 'Products', value: rows.length }, { label: 'Closing units', value: closing.toFixed(3) }, { label: 'Closing retail value', value: `Rs. ${value.toFixed(2)}` }, { label: 'Below reorder', value: rows.filter((row) => row.closing <= row.reorderLevel).length }], chart: { title: 'Highest closing stock', items: rows.sort((a,b) => b.closing-a.closing).slice(0,10).map((row) => ({ label: row.product, value: row.closing })) }, notes: ['Stock values use current selling prices.', 'Movement detail remains available in the table below.'] }); },
  range:async(req,res)=>{const [rows,analytics]=await Promise.all([reportService.range(req.query.from,req.query.to),reportService.analytics(req.query.from,req.query.to)]);return send(req,res,'period',`${req.query.from}-to-${req.query.to}`,req.params.format,rows,dailyColumns,analyticsPresentation(analytics));},
  analytics:async(req,res)=>res.json({data:await reportService.analytics(req.query.from,req.query.to)}),
  custom:async(req,res)=>res.json({data:await reportService.custom(req.query.from,req.query.to,req.query.groupBy)}),
  customExport:async(req,res)=>{const report=await reportService.custom(req.query.from,req.query.to,req.query.groupBy);return send(req,res,`custom-${req.query.groupBy}`,`${req.query.from}-to-${req.query.to}`,req.params.format,report.rows,customColumns,{summary:[{label:'Net revenue',value:`Rs. ${Number(report.summary.netRevenue).toFixed(2)}`},{label:'Bottle fees',value:`Rs. ${Number(report.summary.containerFee || 0).toFixed(2)}`},{label:'FIFO cost',value:`Rs. ${Number(report.summary.cost).toFixed(2)}`},{label:'Gross profit',value:`Rs. ${Number(report.summary.profit).toFixed(2)}`},{label:'Margin',value:`${Number(report.summary.margin).toFixed(2)}%`}],chart:{title:`Top ${report.fieldLabel} by gross profit`,items:report.rows.slice(0,10).map((row)=>({label:row.group,value:row.profit}))},notes:['Profit is net revenue including bottle fees, less FIFO batch acquisition cost.','CSV contains a processed summary followed by detailed grouped records.']});},
};

const analyticsPresentation = (analytics) => ({
  summary: [{ label: 'Net revenue', value: `Rs. ${analytics.summary.sales.toFixed(2)}` }, { label: 'Bottle fees', value: `Rs. ${Number(analytics.summary.containerFee || 0).toFixed(2)}` }, { label: 'FIFO cost', value: `Rs. ${analytics.summary.cogs.toFixed(2)}` }, { label: 'Gross profit', value: `Rs. ${analytics.summary.grossProfit.toFixed(2)}` }, { label: 'Gross margin', value: `${analytics.summary.grossMargin.toFixed(2)}%` }],
  chart: { title: 'Daily net revenue', items: analytics.dailySeries.map((item) => ({ label: item.date, value: item.revenue })) },
  notes: [`${analytics.summary.invoices} invoices, ${analytics.summary.prescriptions} prescriptions and ${analytics.summary.dispensings} dispensing events.`, 'Financial results use FIFO batch purchase costs and allocated discounts.', 'Detailed invoice-product-batch records follow below.'],
});
