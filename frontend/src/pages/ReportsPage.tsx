import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, errorMessage } from '../api/client';
import { Alert, Empty, Loading, Metric } from '../components/Ui';
import '../reports.css';
import { useAuth } from '../auth/useAuth';
import { StaffActivityReport } from '../components/StaffActivityReport';

type Analytics = {
  summary: { sales: number; grossSales: number; discount: number; cogs: number; grossProfit: number; grossMargin: number; invoices: number; prescriptions: number; dispensings: number };
  dailySeries: { date: string; value: number; revenue: number; cost: number; profit: number }[];
  topProducts: { name: string; quantity: number; revenue: number; cost: number; profit: number }[];
  pharmacistActivity: { name: string; count: number }[];
  prescriptionStatuses: { status: string; count: number }[];
};
type CustomRow = { group: string; transactions: number; quantity: number; grossSales: number; discount: number; netRevenue: number; cost: number; profit: number; margin: number };
type CustomReport = { field: string; fieldLabel: string; summary: { netRevenue: number; cost: number; profit: number; margin: number }; rows: CustomRow[] };

const localDate = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};
const dateDaysAgo = (days: number) => {
  const date = new Date(); date.setDate(date.getDate() - days); return localDate(date);
};
const money = (value: number) => `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const shortDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const statusColours = ['#176b63', '#4f79c8', '#e2a33a', '#c8564f', '#7c66b0', '#78908c'];

export function ReportsPage() {
  const { user } = useAuth();
  const [showStaffReport, setShowStaffReport] = useState(false);
  const today = localDate();
  const [from, setFrom] = useState(dateDaysAgo(29));
  const [to, setTo] = useState(today);
  const [preset, setPreset] = useState('LAST_30');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState('');
  const [error, setError] = useState('');
  const [customGroup, setCustomGroup] = useState('date');
  const [customMetric, setCustomMetric] = useState<'profit' | 'netRevenue' | 'cost' | 'quantity' | 'transactions'>('profit');
  const [customName, setCustomName] = useState('Profitability report');
  const [customReport, setCustomReport] = useState<CustomReport | null>(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [monthlyMonth, setMonthlyMonth] = useState(today.slice(0, 7));

  const load = useCallback(async () => {
    if (!from || !to || from > to) { setError('The start date must be before or equal to the end date.'); return; }
    try {
      setLoading(true); setError('');
      const response = await api.get(`/reports/analytics?from=${from}&to=${to}`);
      setAnalytics(response.data.data);
    } catch (e) { setError(errorMessage(e)); } finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  const loadCustom = useCallback(async () => {
    if (!from || !to || from > to) return;
    try {
      setCustomLoading(true); setError('');
      const response = await api.get(`/reports/custom?from=${from}&to=${to}&groupBy=${customGroup}`);
      setCustomReport(response.data.data);
    } catch (e) { setError(errorMessage(e)); } finally { setCustomLoading(false); }
  }, [from, to, customGroup]);

  useEffect(() => { loadCustom(); }, [loadCustom]);

  const choosePreset = (value: string) => {
    setPreset(value);
    if (value === 'TODAY') { setFrom(today); setTo(today); }
    if (value === 'LAST_7') { setFrom(dateDaysAgo(6)); setTo(today); }
    if (value === 'LAST_30') { setFrom(dateDaysAgo(29)); setTo(today); }
    if (value === 'MONTH') { setFrom(`${today.slice(0, 7)}-01`); setTo(today); }
  };

  const download = async (type: 'period' | 'monthly', format: 'csv' | 'pdf' | 'xlsx') => {
    try {
      const key = `${type}-${format}`; setExporting(key); setError('');
      const query = type === 'period' ? `from=${from}&to=${to}` : `month=${monthlyMonth}`;
      const response = await api.get(`/reports/${type}.${format}?${query}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a'); link.href = url;
      link.download = type === 'period' ? `mediflow-${from}-to-${to}.${format}` : `mediflow-stock-${monthlyMonth}.${format}`;
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    } catch (e) { setError(errorMessage(e)); } finally { setExporting(''); }
  };

  const downloadCustom = async (format: 'csv' | 'pdf' | 'xlsx') => {
    try {
      const key = `custom-${format}`; setExporting(key); setError('');
      const response = await api.get(`/reports/custom.${format}?from=${from}&to=${to}&groupBy=${customGroup}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data); const link = document.createElement('a'); link.href = url;
      const safeName = (customName.trim() || 'custom-report').replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
      link.download = `${safeName}-${from}-to-${to}.${format}`;
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    } catch (e) { setError(errorMessage(e)); } finally { setExporting(''); }
  };

  const salesMax = Math.max(...(analytics?.dailySeries.map((item) => Math.abs(item.value)) || [0]), 1);
  const productMax = Math.max(...(analytics?.topProducts.map((item) => Math.abs(item.quantity)) || [0]), 1);
  const pharmacistMax = Math.max(...(analytics?.pharmacistActivity.map((item) => item.count) || [0]), 1);
  const statusTotal = analytics?.prescriptionStatuses.reduce((sum, item) => sum + item.count, 0) || 0;
  const customMax = Math.max(...(customReport?.rows.map((item) => Math.abs(Number(item[customMetric]))) || [0]), 1);
  const donut = useMemo(() => {
    if (!analytics || !statusTotal) return '#edf2f1 0 100%';
    let at = 0;
    return analytics.prescriptionStatuses.map((item, index) => {
      const start = at; at += (item.count / statusTotal) * 100;
      return `${statusColours[index % statusColours.length]} ${start}% ${at}%`;
    }).join(', ');
  }, [analytics, statusTotal]);

  return <>
    <div className="page-intro"><div><h2>Reports & analytics</h2><p>Analyse performance for any date range and export the underlying records.</p></div></div>
    {user?.role === 'ADMIN' && <><button className="btn btn-outline-primary mb-3" aria-expanded={showStaffReport} aria-controls="staff-activity-section" onClick={()=>setShowStaffReport(value=>!value)}>{showStaffReport?'Hide staff activity report':'Staff activity report'}</button><div id="staff-activity-section">{showStaffReport && <StaffActivityReport/>}</div></>}
    <p className="small text-secondary">Sales use the invoice date; credits use the refund authorization date. Stock cost is recovered only on the pharmacist's restock-review date. Cash/bank payouts are recorded separately in daily reconciliation. Negative values indicate net returns.</p>
    <Alert message={error} />

    <div className="panel report-filter-panel">
      <div className="report-filter-grid">
        <div><label className="form-label">Quick period</label><select className="form-select" value={preset} onChange={(event) => choosePreset(event.target.value)}>
          <option value="TODAY">Today</option><option value="LAST_7">Last 7 days</option><option value="LAST_30">Last 30 days</option><option value="MONTH">Current month</option><option value="CUSTOM">Custom range</option>
        </select></div>
        <div><label className="form-label">From date</label><input className="form-control" type="date" value={from} max={to || undefined} onChange={(event) => { setFrom(event.target.value); setPreset('CUSTOM'); }} /></div>
        <div><label className="form-label">To date</label><input className="form-control" type="date" value={to} min={from || undefined} onChange={(event) => { setTo(event.target.value); setPreset('CUSTOM'); }} /></div>
        <div className="report-filter-actions"><button className="btn btn-outline-secondary" disabled={loading || customLoading || from > to} onClick={() => { load(); loadCustom(); }}><i className="bi bi-funnel me-1" />Apply dates</button><button className="btn btn-outline-primary" disabled={!!exporting || from > to} onClick={() => download('period', 'xlsx')}><i className="bi bi-file-earmark-excel me-1" />Excel</button><button className="btn btn-outline-primary" disabled={!!exporting || from > to} onClick={() => download('period', 'csv')}><i className="bi bi-filetype-csv me-1" />CSV</button><button className="btn btn-primary" disabled={!!exporting || from > to} onClick={() => download('period', 'pdf')}><i className="bi bi-filetype-pdf me-1" />PDF</button></div>
      </div>
      <div className="report-period-note"><i className="bi bi-calendar-range me-2" />Showing {from} through {to}, including both dates.</div>
    </div>

    {loading ? <Loading /> : analytics && <>
      <div className="metric-grid">
        <Metric label="Net sales revenue" value={money(analytics.summary.sales)} icon="cash-stack" tone="teal" />
        <Metric label="FIFO cost of goods" value={money(analytics.summary.cogs)} icon="boxes" tone="blue" />
        <Metric label="Gross profit" value={money(analytics.summary.grossProfit)} icon="graph-up-arrow" tone={analytics.summary.grossProfit >= 0 ? 'teal' : 'red'} />
        <Metric label="Gross margin" value={`${analytics.summary.grossMargin.toFixed(2)}%`} icon="percent" tone="amber" />
      </div>

      <div className="report-count-strip"><span><strong>{analytics.summary.invoices}</strong> invoices</span><span><strong>{analytics.summary.prescriptions}</strong> prescriptions</span><span><strong>{analytics.summary.dispensings}</strong> dispensing events</span><span><strong>{money(analytics.summary.discount)}</strong> discounts allocated</span></div>

      <div className="panel custom-report-panel">
        <div className="panel-header"><div><h3>Custom field report builder</h3><small className="text-secondary">Choose how to group the selected period, select the chart value, then export the full profitability table.</small></div><span className="badge text-bg-light">FIFO batch costs</span></div>
        <div className="custom-report-controls">
          <div><label className="form-label">Report name</label><input className="form-control" value={customName} maxLength={80} onChange={(event) => setCustomName(event.target.value)} /></div>
          <div><label className="form-label">Group data by field</label><select className="form-select" value={customGroup} onChange={(event) => setCustomGroup(event.target.value)}><option value="date">Activity date</option><option value="product">Product</option><option value="category">Category</option><option value="batch">Batch</option><option value="pharmacist">Pharmacist</option><option value="patient">Patient</option><option value="paymentMethod">Invoice payment method</option><option value="saleStatus">Activity type</option></select></div>
          <div><label className="form-label">Graph value</label><select className="form-select" value={customMetric} onChange={(event) => setCustomMetric(event.target.value as typeof customMetric)}><option value="profit">Gross profit</option><option value="netRevenue">Net revenue</option><option value="cost">FIFO cost</option><option value="quantity">Quantity</option><option value="transactions">Transactions</option></select></div>
          <div className="custom-report-actions"><button className="btn btn-outline-secondary" disabled={customLoading} onClick={loadCustom}><i className="bi bi-arrow-clockwise me-1" />Generate</button><button className="btn btn-outline-primary" disabled={!!exporting || customLoading} onClick={() => downloadCustom('xlsx')}>Excel</button><button className="btn btn-outline-primary" disabled={!!exporting || customLoading} onClick={() => downloadCustom('csv')}>CSV</button><button className="btn btn-primary" disabled={!!exporting || customLoading} onClick={() => downloadCustom('pdf')}>PDF</button></div>
        </div>
        {customLoading ? <Loading /> : customReport?.rows.length ? <>
          <div className="custom-profit-summary"><span>Net revenue <strong>{money(customReport.summary.netRevenue)}</strong></span><span>FIFO cost <strong>{money(customReport.summary.cost)}</strong></span><span>Gross profit <strong className={customReport.summary.profit >= 0 ? 'text-success' : 'text-danger'}>{money(customReport.summary.profit)}</strong></span><span>Margin <strong>{customReport.summary.margin.toFixed(2)}%</strong></span></div>
          <div className="custom-report-chart">{customReport.rows.slice(0, 10).map((item) => <div className="custom-report-bar" key={item.group}><div><span>{item.group}</span><strong>{['profit', 'netRevenue', 'cost'].includes(customMetric) ? money(Number(item[customMetric])) : Number(item[customMetric]).toLocaleString()}</strong></div><div className="horizontal-track"><div className={Number(item[customMetric]) < 0 ? 'negative' : ''} style={{ width: `${(Math.abs(Number(item[customMetric])) / customMax) * 100}%` }} /></div></div>)}</div>
          <div className="table-responsive mt-4"><table className="table table-sm"><thead><tr><th>{customReport.fieldLabel}</th><th>Transactions</th><th>Quantity</th><th>Net revenue</th><th>FIFO cost</th><th>Gross profit</th><th>Margin</th></tr></thead><tbody>{customReport.rows.map((item) => <tr key={item.group}><td><strong>{item.group}</strong></td><td>{item.transactions}</td><td>{item.quantity}</td><td>{money(item.netRevenue)}</td><td>{money(item.cost)}</td><td className={item.profit >= 0 ? 'text-success' : 'text-danger'}>{money(item.profit)}</td><td>{item.margin.toFixed(2)}%</td></tr>)}</tbody></table></div>
        </> : <Empty text="No non-voided sales are available for this custom report." />}
      </div>

      <div className="row g-4">
        <div className="col-xl-8"><div className="panel h-100"><div className="panel-header"><div><h3>Sales trend</h3><small className="text-secondary">Revenue by day</small></div><span className="chart-total">{money(analytics.summary.sales)}</span></div>
          {analytics.dailySeries.length ? <div className="sales-chart" role="img" aria-label="Daily net revenue; negative returns shown in red with minus signs">{analytics.dailySeries.map((item) => <div className="sales-bar-column" key={item.date} title={`${item.date}: ${money(item.value)}`}><div className="sales-bar-value">{item.value !== 0 ? money(item.value).replace('Rs. ', '') : ''}</div><div className="sales-bar-track"><div className="sales-bar" style={{ background: item.value < 0 ? '#c8564f' : undefined, height: `${Math.max((Math.abs(item.value) / salesMax) * 100, item.value ? 4 : 0)}%` }} /></div><span>{shortDate(item.date)}</span></div>)}</div> : <Empty text="No sales were recorded in this period." />}
        </div></div>
        <div className="col-xl-4"><div className="panel h-100"><div className="panel-header"><div><h3>Prescription status</h3><small className="text-secondary">Workflow distribution</small></div></div>
          {statusTotal ? <div className="status-chart-wrap"><div className="donut-chart" style={{ background: `conic-gradient(${donut})` }}><div><strong>{statusTotal}</strong><small>Total</small></div></div><div className="chart-legend">{analytics.prescriptionStatuses.map((item, index) => <div key={item.status}><span style={{ background: statusColours[index % statusColours.length] }} /><label>{item.status.replaceAll('_', ' ').toLowerCase()}</label><strong>{item.count}</strong></div>)}</div></div> : <Empty text="No prescriptions were created in this period." />}
        </div></div>
      </div>

      <div className="row g-4 mt-0">
        <div className="col-xl-7"><div className="panel h-100"><div className="panel-header"><div><h3>Top dispensed medicines</h3><small className="text-secondary">Ranked by quantity sold</small></div></div>
          {analytics.topProducts.length ? <div className="horizontal-chart">{analytics.topProducts.map((item, index) => <div className="horizontal-row" key={item.name}><span className="chart-rank">{index + 1}</span><div><div className="horizontal-label"><strong>{item.name}</strong><span>{item.quantity.toLocaleString()} net units · Revenue {money(item.revenue)} · Profit {money(item.profit)}</span></div><div className="horizontal-track"><div className={item.quantity < 0 ? 'negative' : ''} style={{ width: `${(Math.abs(item.quantity) / productMax) * 100}%` }} /></div></div></div>)}</div> : <Empty text="No medicine sales are available for this period." />}
        </div></div>
        <div className="col-xl-5"><div className="panel h-100"><div className="panel-header"><div><h3>Pharmacist activity</h3><small className="text-secondary">Prescriptions issued by pharmacist</small></div></div>
          {analytics.pharmacistActivity.length ? <div className="activity-chart">{analytics.pharmacistActivity.map((item) => <div key={item.name}><div className="activity-label"><span>{item.name}</span><strong>{item.count}</strong></div><div className="horizontal-track"><div style={{ width: `${(item.count / pharmacistMax) * 100}%` }} /></div></div>)}</div> : <Empty text="No dispensing events are available for this period." />}
        </div></div>
      </div>

      <div className="panel mt-4 mb-0"><div className="panel-header"><div><h3>Monthly stock movement report</h3><small className="text-secondary">Opening, received, dispensed, adjusted and closing stock values for the selected month.</small></div><div className="d-flex align-items-center gap-2 flex-wrap"><input type="month" className="form-control form-control-sm" style={{ width: 'auto' }} value={monthlyMonth} max={today.slice(0, 7)} onChange={(event) => setMonthlyMonth(event.target.value)} /><button className="btn btn-sm btn-outline-primary" disabled={!!exporting} onClick={() => download('monthly', 'xlsx')}>Excel</button><button className="btn btn-sm btn-outline-primary" disabled={!!exporting} onClick={() => download('monthly', 'csv')}>CSV</button><button className="btn btn-sm btn-primary" disabled={!!exporting} onClick={() => download('monthly', 'pdf')}>PDF</button></div></div><span className="badge text-bg-light">Month: {monthlyMonth}</span></div>
    </>}
  </>;
}
