// Creates the deliveries CSV download (times in Sri Lanka time).

const columns = ['invoice_number', 'version', 'action', 'recipient_name', 'address', 'phone', 'courier', 'tracking', 'current_status', 'dispatched_at', 'delivered_at'];
const sriLankaTime = (value?: string | null) => value ? new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
}).format(new Date(value)) : '';
const cell = (value: unknown) => {
  let text = String(value ?? '');
  let first = 0;
  while (first < text.length && (text.charCodeAt(first) <= 32 || /\s/.test(text[first]))) first++;
  if (first < text.length && '=+-@'.includes(text[first])) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function exportDeliveries(rows: any[]) {
  const data = rows.map(row => [row.paymentRequest.requestNumber, row.updatedAt, '', row.recipientName || row.paymentRequest.patient?.fullName, row.address, row.phone, row.courierService, row.trackingReference, row.status, sriLankaTime(row.dispatchedAt), sriLankaTime(row.deliveredAt)]);
  const guide = [
    ['MEDIFLOW DELIVERY UPDATE GUIDE', 'Edit the data table below. These guide rows are not imported.'],
    ['1. SELECT ROWS', 'Keep at most 50 delivery rows per upload. Leave action blank to skip a row.'],
    ['2. KEEP IDENTIFIERS', 'Do not edit invoice_number or version. Export again if the saved delivery changed.'],
    ['3. DISPATCH', 'Set action to DISPATCH and fill courier and tracking. Medicines and delivery fee must be paid and verified.'],
    ['4. DELIVERED', 'Set action to DELIVERED only after an already-shipped delivery reaches its recipient.'],
    ['5. UPDATE_TRACKING', 'Use UPDATE_TRACKING to correct courier and tracking for a shipped delivery.'],
    ['6. UPDATE_DETAILS', 'Use UPDATE_DETAILS to edit recipient_name, address or phone before dispatch.'],
    ['EXAMPLE ONLY', 'action: DISPATCH | courier: Example Courier | tracking: TRACK123. Use your actual values in the data table.'],
    ['BLANK VALUES', 'Blank or omitted editable fields keep saved values. Required delivery details cannot be cleared.'],
    ['PHONE / TRACKING', 'Keep these columns as Text in Excel to preserve leading zeros. Phone: 0701234567 or +94701234567.'],
    ['REFERENCE COLUMNS', 'current_status, dispatched_at and delivered_at are read-only. Dates are recorded automatically and exported in Sri Lanka time (UTC+05:30).'],
    ['7. UPLOAD AND CONFIRM', 'Save as CSV UTF-8. Upload, review every change, then confirm. Nothing changes before confirmation.'],
    ['PRIVACY', 'Contains customer contact details. Store securely and delete downloaded copies when no longer needed.'],
    [], ['DELIVERY DATA BELOW', 'Enter actions only for the rows you want to update.'], [],
  ].map(row => [...row, ...Array(Math.max(0, columns.length - row.length)).fill('')]);
  const blob = new Blob(['\uFEFF', [...guide, columns, ...data].map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = 'mediflow-deliveries.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
