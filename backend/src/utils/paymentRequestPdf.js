import PDFDocument from 'pdfkit';

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
const productName = (product) => `${product.genericName}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`;
const pageWidth = 595.28;
const left = 44;
const right = pageWidth - 44;
const contentWidth = right - left;

const drawHeader = (doc, request, receipt) => {
  doc.font('Helvetica-Bold').fontSize(22).fillColor('#174a45').text('MediFlow Pharmacy', left, 42);
  const retail = request.type === 'RETAIL';
  doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(receipt ? `${retail ? 'Retail' : 'Prescription'} cashier payment receipt` : `${retail ? 'Retail goods' : 'Prescription'} cashier payment request`, left, 72);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#111827').text(request.requestNumber, 330, 46, { width: right - 330, align: 'right' });
  const created = new Date(request.createdAt).toISOString().replace('T', ' ').slice(0, 19);
  doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(`Created: ${created} UTC`, 330, 68, { width: right - 330, align: 'right' });
  doc.moveTo(left, 100).lineTo(right, 100).lineWidth(1).strokeColor('#cfe0dc').stroke();

  const details = [
    ['Customer', request.patient?.fullName || 'Walk-in customer'],
    [retail ? 'Sale type' : 'Prescription', retail ? 'Retail goods' : request.prescription?.prescriptionNumber],
    ['Prepared by', request.pharmacist.fullName],
    ...(request.cashier ? [['Payment received by', request.cashier.fullName]] : []),
  ];
  let y = 116;
  details.forEach(([label, value]) => {
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748b').text(label.toUpperCase(), left, y, { width: 108 });
    doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(String(value), left + 112, y - 1, { width: 280 });
    y += 18;
  });
  return Math.max(y + 8, 194);
};

const drawTableHeader = (doc, y) => {
  doc.rect(left, y, contentWidth, 27).fill('#f1f6f4');
  const columns = [
    { x: left + 8, width: 245, label: 'Item' },
    { x: 300, width: 75, label: 'Quantity' },
    { x: 382, width: 78, label: 'Unit price' },
    { x: 466, width: 78, label: 'Line total' },
  ];
  columns.forEach((column) => doc.font('Helvetica-Bold').fontSize(8).fillColor('#355b56').text(column.label.toUpperCase(), column.x, y + 9, { width: column.width }));
  return y + 27;
};

const drawTable = (doc, request, startY, retail) => {
  let y = drawTableHeader(doc, startY);
  request.items.forEach((item) => {
    if (y > 710) {
      doc.addPage();
      y = drawTableHeader(doc, 55);
    }
    const rowHeight = 32;
    doc.font('Helvetica').fontSize(8.8).fillColor('#111827');
    doc.text(productName(item.product), left + 8, y + 9, { width: 238, ellipsis: true });
    doc.text(`${item.quantity} ${item.product.unit}`, 300, y + 9, { width: 75 });
    doc.text(money(item.unitPrice), 382, y + 9, { width: 78 });
    doc.text(money(item.lineTotal), 466, y + 9, { width: 78 });
    y += rowHeight;
    doc.moveTo(left, y).lineTo(right, y).lineWidth(0.7).strokeColor('#dce6e3').stroke();
  });
  return y;
};

const drawTotals = (doc, request, startY) => {
  let y = startY + 18;
  const rows = [
    ['Subtotal', money(request.subtotal)],
    ['Discount', `- ${money(request.discount)}`],
    ['Bottle / container fee', money(request.containerFee)],
    ['Tax', money(request.tax)],
    ['Total due', money(request.total)],
    ['Amount paid', money(request.amountPaid)],
  ];
  rows.forEach(([label, value], index) => {
    const total = index === 4;
    doc.font(total ? 'Helvetica-Bold' : 'Helvetica').fontSize(total ? 11.5 : 9).fillColor(total ? '#174a45' : '#334155');
    doc.text(label, 350, y, { width: 90, align: 'right' });
    doc.text(value, 448, y, { width: right - 448, align: 'right' });
    y += total ? 23 : 17;
  });
  return y;
};

const drawPin = (doc, pin, startY, retail) => {
  const y = startY + 18;
  doc.roundedRect(left, y, contentWidth, 122, 10).fillAndStroke('#eef8f5', '#79bdb1');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#426d67').text(retail ? 'RETAIL HANDOVER VERIFICATION PIN' : 'DISPENSING VERIFICATION PIN', left, y + 20, { width: contentWidth, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(30).fillColor('#174a45').text(pin, left, y + 45, { width: contentWidth, align: 'center', characterSpacing: 8 });
  doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(`Give this PIN to the pharmacist only when collecting the ${retail ? 'retail goods' : 'medicines'}.`, left + 30, y + 91, { width: contentWidth - 60, align: 'center' });
  return y + 122;
};

export const createPaymentRequestPdf = (request, receipt = false) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);

  let y = drawHeader(doc, request, receipt);
  const retail = request.type === 'RETAIL';
  y = drawTable(doc, request, y, retail);
  const requiredHeight = receipt && request.pickupPin ? 250 : 120;
  if (y + requiredHeight > 790) {
    doc.addPage();
    y = 46;
  }
  y = drawTotals(doc, request, y);

  if (receipt && request.pickupPin) {
    y = drawPin(doc, request.pickupPin, y, retail);
    doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(retail ? 'Payment alone does not release the goods. The pharmacist must verify this PIN before completing the handover.' : 'Payment alone does not dispense medicine. The pharmacist must verify this PIN before completing the clinical handoff.', left + 20, y + 18, { width: contentWidth - 40, align: 'center' });
  } else {
    doc.roundedRect(left, y + 18, contentWidth, 60, 8).fillAndStroke('#f7faf9', '#cfe0dc');
    doc.font('Helvetica').fontSize(9).fillColor('#526b67').text(retail ? 'Present this request at the cashier. Goods can be handed over only after full payment and PIN verification.' : 'Present this request at the cashier. Medicines and any added retail items can be handed over only after full payment and pharmacist verification of the receipt PIN.', left + 24, y + 37, { width: contentWidth - 48, align: 'center' });
  }

  const range = doc.bufferedPageRange();
  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    doc.font('Helvetica').fontSize(7.5).fillColor('#82918e').text(`MediFlow - Page ${index + 1} of ${range.count}`, left, 780, { width: contentWidth, align: 'center', lineBreak: false });
  }
  doc.end();
});
