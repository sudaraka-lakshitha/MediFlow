// Creates the bill PDF and the receipt PDF (times in Sri Lanka time).

import PDFDocument from 'pdfkit';
import { createCollectionSlipPdf } from './collectionSlipPdf.js';
import { formatPharmacyTimestamp } from './pharmacyTime.js';
import { deliveryStatusLabel } from './deliveryStatus.js';

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
const productName = (product) => `${product.genericName}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`;
const pageWidth = 595.28;
const left = 44;
const right = pageWidth - 44;
const contentWidth = right - left;

const statusBanners = {
  AWAITING_PAYMENT: { label: 'AWAITING PAYMENT', bg: '#fff6e5', border: '#e2b34a', fg: '#8a5a0e' },
  PAID: { label: 'PAID - AWAITING COLLECTION', bg: '#e9f7f1', border: '#79bdb1', fg: '#176b63' },
  FULFILLED: { label: 'COMPLETED - ALREADY COLLECTED', bg: '#eef2f7', border: '#9fb3c8', fg: '#33475b' },
  CANCELLED: { label: 'CANCELLED - NOT VALID', bg: '#fdecea', border: '#e6786d', fg: '#9a2f24' },
};

const drawHeader = (doc, request, receipt) => {
  doc.roundedRect(left, 32, contentWidth, 62, 8).fill('#eef8f5');
  doc.rect(left, 32, 5, 62).fill('#18a999');
  doc.circle(left + 28, 63, 15).fill('#18a999');
  doc.font('Helvetica-Bold').fontSize(18).fillColor('#ffffff').text('+', left + 20, 48, { width: 16, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(22).fillColor('#174a45').text('MediFlow Pharmacy', left + 52, 42);
  const retail = request.type === 'RETAIL';
  const category = request.deliveryFeeFor ? 'Home delivery service' : retail ? 'Retail' : 'Prescription';
  doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(`${category} ${receipt ? (request.pickupPin ? 'itemized payment receipt with collection PIN' : 'payment receipt') : 'payment request'}`, left + 52, 70);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#111827').text(request.requestNumber, 330, 46, { width: right - 330, align: 'right' });
  const created = formatPharmacyTimestamp(request.createdAt);
  doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(`Created: ${created} Sri Lanka time`, 330, 68, { width: right - 330, align: 'right' });
  doc.moveTo(left, 100).lineTo(right, 100).lineWidth(1).strokeColor('#cfe0dc').stroke();

  const banner = statusBanners[request.status] || statusBanners.AWAITING_PAYMENT;
  doc.roundedRect(left, 108, contentWidth, 24, 5).fillAndStroke(banner.bg, banner.border);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(banner.fg).text(request.delivery ? `DELIVERY: ${deliveryStatusLabel(request.delivery.status).toUpperCase()}` : request.deliveryFeeFor && ['PAID', 'FULFILLED'].includes(request.status) ? 'DELIVERY FEE PAID' : banner.label, left, 114, { width: contentWidth, align: 'center' });

  const isSplit = request.paymentMethod === 'OTHER' && request.paymentReference?.startsWith('Split:');
  const details = [
    ['Customer', request.patient?.fullName || 'Walk-in customer'],
    [retail ? 'Sale type' : 'Prescription', request.deliveryFeeFor ? 'Home delivery service' : retail ? 'Retail goods' : request.prescription?.prescriptionNumber],
    ...(request.deliveryFeeFor?.paymentRequest?.requestNumber ? [['Related medicine order', request.deliveryFeeFor.paymentRequest.requestNumber]] : []),
    ['Prepared by', request.pharmacist.fullName],
    ...(request.cashier ? [['Payment received by', request.cashier.fullName]] : []),
    ...(request.paymentMethod ? [['Payment method', isSplit ? 'SPLIT PAYMENT' : request.paymentMethod.replace('_', ' ')]] : []),
    ...(request.paymentReference ? [[isSplit ? 'Split breakdown' : 'Payment reference', request.paymentReference]] : []),
  ];
  let y = 144;
  details.forEach(([label, value]) => {
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748b').text(label.toUpperCase(), left, y, { width: 108 });
    doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(String(value), left + 112, y - 1, { width: 380 });
    y += 18;
  });
  return Math.max(y + 8, 222);
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

const drawContinuationBanner = (doc, request, label) => {
  doc.addPage();
  doc.roundedRect(left, 30, contentWidth, 47, 7).fill('#174a45');
  doc.rect(left, 30, 5, 47).fill('#18a999');
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#ffffff').text('MediFlow Pharmacy', left + 15, 39);
  doc.font('Helvetica').fontSize(8).fillColor('#d4e7e3').text(label, left + 15, 58);
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff').text(request.requestNumber, 335, 46, { width: right - 335, align: 'right', ellipsis: true });
};

const drawTable = (doc, request, startY, retail) => {
  let y = drawTableHeader(doc, startY);
  if (request.deliveryFeeFor && !request.items.length) {
    doc.font('Helvetica').fontSize(9).fillColor('#111827').text('Home delivery service', left + 8, y + 9, { width: 238 });
    doc.text('1', 300, y + 9); doc.text(money(request.subtotal), 382, y + 9); doc.text(money(request.subtotal), 466, y + 9);
    y += 32;
  }
  request.items.forEach((item) => {
    if (y > 710) {
      drawContinuationBanner(doc, request, 'Invoice items continued');
      y = drawTableHeader(doc, 91);
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
    ['Refunded', money(request.refundedAmount || 0)],
    ['Net paid', money(Number(request.amountPaid) - Number(request.refundedAmount || 0))],
  ];
  rows.forEach(([label, value], index) => {
    const total = index === 4;
    if (total) doc.roundedRect(340, y - 4, contentWidth - 296, 22, 5).fill('#eef8f5');
    doc.font(total ? 'Helvetica-Bold' : 'Helvetica').fontSize(total ? 11.5 : 9).fillColor(total ? '#174a45' : '#334155');
    doc.text(label, 350, y, { width: 90, align: 'right' });
    doc.text(value, 448, y, { width: right - 448, align: 'right' });
    y += total ? 23 : 17;
  });
  return y;
};

// Medicines prescribed but not on this bill (for example, out of stock today).
// They are not charged here; the customer collects them later on a new bill.
// Prescribed medicines not supplied on this bill: either collected later (not
// charged now) or recorded as not to be issued at all. Each shows its reason.
const balanceText = (lines) => lines.map((line) => `${line.name}: ${line.quantity} ${line.unit}${line.reason ? ` (${line.reason})` : ''}`).join('\n');
const drawBalanceBox = (doc, request, startY, { title, intro, lines, fill, stroke, titleColour, textColour }) => {
  if (!lines?.length) return startY;
  doc.font('Helvetica').fontSize(8.5);
  const height = doc.heightOfString(`${intro}\n${balanceText(lines)}`, { width: contentWidth - 24 }) + 32;
  let y = startY + 14;
  if (y + height > 760) { drawContinuationBanner(doc, request, title); y = 91; }
  doc.roundedRect(left, y, contentWidth, height, 6).fillAndStroke(fill, stroke);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(titleColour).text(title.toUpperCase(), left + 12, y + 9, { width: contentWidth - 24 });
  doc.font('Helvetica').fontSize(8.5).fillColor(textColour).text(`${intro}\n${balanceText(lines)}`, left + 12, y + 25, { width: contentWidth - 24 });
  doc.y = y + height;
  return y + height;
};
// Prescribed against bought, per medicine (walk-in partial supply).
const drawSupplyTable = (doc, request, startY) => {
  const rows = request.supplyRows || [];
  let y = startY + 14;
  if (y + 60 + rows.length * 26 > 760) { drawContinuationBanner(doc, request, 'Prescribed and bought'); y = 91; }
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#174a45').text('PRESCRIBED AND BOUGHT', left, y);
  doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Medicines not bought now are not charged on this bill.', left, y + 14);
  y += 30;
  const cols = [[left, 150, 'Medicine'], [left + 152, 58, 'Prescribed'], [left + 212, 58, 'Earlier'], [left + 272, 62, 'Bought now'], [left + 336, 62, 'Not bought'], [left + 400, contentWidth - 400, 'Rest of it']];
  doc.rect(left, y, contentWidth, 18).fill('#f1f6f4');
  cols.forEach(([x, w, label]) => doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#355b56').text(label.toUpperCase(), x + 3, y + 5, { width: w - 4 }));
  y += 20;
  for (const row of rows) {
    const rest = row.rest ? `${row.rest}${row.reason ? ` - ${row.reason}` : ''}` : '-';
    const values = [row.name, `${Number(row.prescribed)} ${row.unit}`, Number(row.suppliedBefore) ? `${Number(row.suppliedBefore)}` : '-', `${Number(row.onThisBill)}`, Number(row.notBought) ? `${Number(row.notBought)}` : '-', rest];
    doc.font('Helvetica').fontSize(8);
    const height = Math.max(16, doc.heightOfString(rest, { width: cols[5][1] - 4 }) + 6, doc.heightOfString(row.name, { width: cols[0][1] - 4 }) + 6);
    if (y + height > 760) { drawContinuationBanner(doc, request, 'Prescribed and bought continued'); y = 91; }
    values.forEach((value, index) => doc.fillColor(index === 4 && Number(row.notBought) ? '#8a5a0e' : '#111827').text(value, cols[index][0] + 3, y + 3, { width: cols[index][1] - 4 }));
    y += height;
    doc.moveTo(left, y).lineTo(right, y).lineWidth(0.5).strokeColor('#dce6e3').stroke();
  }
  doc.y = y;
  return y;
};
const drawBalanceToCollect = (doc, request, startY) => {
  if (request.supplyRows?.length) return drawSupplyTable(doc, request, startY);
  const y = drawBalanceBox(doc, request, startY, {
    title: 'Balance to collect later', lines: request.balanceToCollect,
    intro: 'Not charged on this bill. Bring this bill back to collect them: the pharmacy issues a separate bill when stock is available.',
    fill: '#fff8e6', stroke: '#e2b34a', titleColour: '#8a5a0e', textColour: '#5b4a1e',
  });
  return drawBalanceBox(doc, request, y, {
    title: 'Not to be issued', lines: request.notToBeIssued,
    intro: 'Prescribed but not supplied and not charged. The pharmacy will not issue these later on this prescription.',
    fill: '#f3f4f6', stroke: '#9ca3af', titleColour: '#374151', textColour: '#4b5563',
  });
};

const drawMedicineDirections = (doc, request) => {
  const items = request.items.filter((item) => item.prescriptionItem && item.product?.productType === 'MEDICINE');
  if (!items.length) return doc.y;
  if (doc.y + 70 > 744) { drawContinuationBanner(doc, request, 'Medicine directions'); doc.y = 91; }
  doc.moveDown(1).font('Helvetica-Bold').fontSize(12).fillColor('#174a45').text('Medicine directions', left, doc.y, { width: contentWidth });
  doc.font('Helvetica').fontSize(8.5).fillColor('#64748b').text('Directions for the medicines on this bill. Ask the pharmacist if you need clarification.', { width: contentWidth });
  for (const item of items) {
    const detail = item.prescriptionItem;
    const lines = [detail.dosageInstructions, detail.specialInstructions && `Additional instructions: ${detail.specialInstructions}`, item.product.storageInstructions && `Storage: ${item.product.storageInstructions}`].filter(Boolean);
    const text = `${productName(item.product)} · Supplied quantity: ${item.quantity} ${item.product.unit}\n${lines.join('\n')}`;
    const height = doc.heightOfString(text, { width: contentWidth - 24, font: 'Helvetica', size: 8.5 }) + 18;
    if (doc.y + height > 754) { drawContinuationBanner(doc, request, 'Medicine directions continued'); doc.y = 91; }
    const y = doc.y + 5;
    doc.roundedRect(left, y, contentWidth, height, 5).fillAndStroke('#f7faf9', '#dce9e5');
    doc.font('Helvetica').fontSize(8.5).fillColor('#334155').text(text, left + 12, y + 8, { width: contentWidth - 24 });
    doc.y = y + height + 7;
  }
  return doc.y;
};

const drawPin = (doc, pin, startY, retail) => {
  const y = startY + 18;
  doc.roundedRect(left, y, contentWidth, 122, 10).fillAndStroke('#eef8f5', '#79bdb1');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#426d67').text(retail ? 'RETAIL HANDOVER VERIFICATION PIN' : 'DISPENSING VERIFICATION PIN', left, y + 20, { width: contentWidth, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(30).fillColor('#174a45').text(pin, left, y + 45, { width: contentWidth, align: 'center', characterSpacing: 8 });
  doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(`Give this PIN to the pharmacist only when collecting the ${retail ? 'retail goods' : 'medicines'}.`, left + 30, y + 91, { width: contentWidth - 60, align: 'center' });
  return y + 122;
};

// The slip handed to the customer right after paying, while they still need to collect
// their order. Kept short on purpose - just enough to match it to the order and show the
// PIN, not the full itemized invoice.
const drawCompactSlip = (doc, request) => {
  const retail = request.type === 'RETAIL';
  doc.font('Helvetica-Bold').fontSize(18).fillColor('#174a45').text('MediFlow Pharmacy', left, 42);
  doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('Payment receipt - awaiting collection', left, 66);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#111827').text(request.requestNumber, 330, 44, { width: right - 330, align: 'right' });
  const created = formatPharmacyTimestamp(request.createdAt);
  doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(`${created} Sri Lanka time`, 330, 62, { width: right - 330, align: 'right' });
  doc.moveTo(left, 86).lineTo(right, 86).lineWidth(1).strokeColor('#cfe0dc').stroke();

  doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748b').text('CUSTOMER', left, 98);
  doc.font('Helvetica').fontSize(9.5).fillColor('#111827').text(request.patient?.fullName || 'Walk-in customer', left + 70, 97);

  let y = 122;
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#355b56').text('ITEM', left, y);
  doc.text('QTY', 380, y, { width: 50, align: 'right' });
  doc.text('AMOUNT', 466, y, { width: 78, align: 'right' });
  y += 14;
  doc.moveTo(left, y).lineTo(right, y).lineWidth(0.7).strokeColor('#dce6e3').stroke();
  y += 8;
  request.items.forEach((item) => {
    if (y > 740) { doc.addPage(); y = 46; }
    doc.font('Helvetica').fontSize(8.8).fillColor('#111827');
    doc.text(productName(item.product), left, y, { width: 300, ellipsis: true });
    doc.text(`${item.quantity} ${item.product.unit}`, 380, y, { width: 50, align: 'right' });
    doc.text(money(item.lineTotal), 466, y, { width: 78, align: 'right' });
    y += 16;
  });
  y += 6;
  doc.moveTo(left, y).lineTo(right, y).lineWidth(0.7).strokeColor('#dce6e3').stroke();
  y += 12;
  doc.font('Helvetica-Bold').fontSize(11.5).fillColor('#174a45');
  doc.text('Total paid', 350, y, { width: 90, align: 'right' });
  doc.text(money(request.amountPaid), 448, y, { width: right - 448, align: 'right' });
  y += 26;

  y = drawPin(doc, request.pickupPin, y - 18, retail);
  doc.font('Helvetica').fontSize(7.5).fillColor('#82918e').text('MediFlow', left, 730, { width: contentWidth, align: 'center', lineBreak: false, height: 10 });
};

export const createPaymentRequestPdf = (request, receipt = false, paperWidth = 80, fullReceipt = false) => {
  if (receipt && request.status === 'PAID' && !fullReceipt) return createCollectionSlipPdf(request, paperWidth);
  return new Promise((resolve, reject) => {
  const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);

  // While a paid order is still awaiting collection, the customer only needs a short slip
  // to match against the PIN. Once collected (or before payment), the PIN is gone and this
  // renders the normal full invoice instead - documentData() nulls the PIN in that case.
  if (receipt && request.pickupPin && !fullReceipt) {
    drawCompactSlip(doc, request);
  } else {
    let y = drawHeader(doc, request, receipt);
    const retail = request.type === 'RETAIL';
    y = drawTable(doc, request, y, retail);
    if (y + 150 > 760) {
      drawContinuationBanner(doc, request, 'Invoice totals');
      y = 91;
    }
    y = drawTotals(doc, request, y);
    y = drawBalanceToCollect(doc, request, y);

    if (fullReceipt && request.pickupPin) {
      if (y + 160 > 760) { drawContinuationBanner(doc, request, 'Collection verification'); y = 91; }
      y = drawPin(doc, request.pickupPin, y, retail);
      doc.y = y;
    }
    if (fullReceipt) y = drawMedicineDirections(doc, request);

    const bottomMessages = {
      AWAITING_PAYMENT: retail
        ? 'Present this request at the cashier. Goods can be handed over only after full payment and PIN verification.'
        : 'Present this request at the cashier. Medicines and any added retail items can be handed over only after full payment and pharmacist verification of the receipt PIN.',
      PAID: 'Payment has been received. Collection is only permitted after the pharmacist verifies the receipt PIN with the customer.',
      FULFILLED: 'This order has already been paid for and collected. No further payment or collection action is required.',
      CANCELLED: 'This payment request has been cancelled. It is not valid for payment, collection, or any other transaction.',
    };
    if (!fullReceipt) {
      const message = bottomMessages[request.status] || bottomMessages.AWAITING_PAYMENT;
      const boxStyle = request.status === 'CANCELLED'
        ? { bg: '#fdecea', border: '#e6786d', fg: '#9a2f24', bold: true }
        : request.status === 'FULFILLED'
          ? { bg: '#eef2f7', border: '#9fb3c8', fg: '#33475b', bold: true }
          : { bg: '#f7faf9', border: '#cfe0dc', fg: '#526b67', bold: false };
      if (y + 88 > 760) { drawContinuationBanner(doc, request, 'Payment request status'); y = 91; }
      doc.roundedRect(left, y + 18, contentWidth, 60, 8).fillAndStroke(boxStyle.bg, boxStyle.border);
      doc.font(boxStyle.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).fillColor(boxStyle.fg).text(message, left + 24, y + 37, { width: contentWidth - 48, align: 'center' });
    }

    const range = doc.bufferedPageRange();
    for (let index = range.start; index < range.start + range.count; index += 1) {
      doc.switchToPage(index);
      doc.font('Helvetica').fontSize(7.5).fillColor('#82918e').text(`MediFlow - Page ${index + 1} of ${range.count}`, left, 790, { width: contentWidth, align: 'center', lineBreak: false, height: 10 });
    }
  }
  doc.end();
  });
};
