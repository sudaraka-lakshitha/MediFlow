// Creates the sales invoice PDF (times in Sri Lanka time).

import PDFDocument from 'pdfkit';
import { billingPreview } from './billingPreview.js';

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
const productName = (product) => `${product?.genericName || 'Unknown item'}${product?.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`;
const left = 42;
const right = 552;
const width = right - left;
// Leave a clear separation between content and the printed footer rule.
const bottom = 744;

const statusStyles = {
  VOIDED: { label: 'VOIDED - NOT VALID', bg: '#fdecea', border: '#e6786d', fg: '#9a2f24' },
  PAID: { label: 'PAID', bg: '#e9f7f1', border: '#79bdb1', fg: '#176b63' },
  PENDING: { label: 'PAYMENT PENDING', bg: '#fff6e5', border: '#e2b34a', fg: '#8a5a0e' },
};

export const createInvoicePdf = (sale) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ size: 'A4', margin: 42, bufferPages: true });
  const chunks = [];
  const details = billingPreview(sale);
  const hasSupplementaryRetailItems = Boolean(sale.dispensing && sale.items.some((item) => !item.product.prescriptionRequired));
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);

  const date = new Date(sale.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Colombo' });
  const drawContinuation = (label = 'Invoice details continued') => {
    doc.addPage();
    doc.roundedRect(left, 30, width, 45, 7).fill('#174a45');
    doc.rect(left, 30, 5, 45).fill('#18a999');
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#ffffff').text('MediFlow Pharmacy', left + 16, 40);
    doc.font('Helvetica').fontSize(8).fillColor('#d4e7e3').text(label, left + 16, 59);
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff').text(sale.invoiceNumber, 340, 46, { width: right - 350, align: 'right', ellipsis: true });
    doc.y = 88;
  };
  const ensure = (height, label) => {
    if (doc.y + height > bottom) drawContinuation(label);
  };

  doc.roundedRect(left, 30, width, 56, 8).fill('#174a45');
  doc.rect(left, 30, 5, 56).fill('#18a999');
  doc.font('Helvetica-Bold').fontSize(18).fillColor('#ffffff').text('MediFlow Pharmacy', left + 16, 40);
  doc.font('Helvetica').fontSize(9).fillColor('#d4e7e3').text(hasSupplementaryRetailItems ? 'Prescription and retail invoice' : sale.dispensing ? 'Prescription dispensing invoice' : 'Retail sales invoice', left + 16, 65);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff').text(sale.invoiceNumber, 340, 42, { width: right - 350, align: 'right', ellipsis: true });
  doc.font('Helvetica').fontSize(8).fillColor('#d4e7e3').text(date, 340, 62, { width: right - 350, align: 'right' });

  const style = statusStyles[sale.status] || statusStyles.PENDING;
  doc.roundedRect(left, 96, width, 24, 5).fillAndStroke(style.bg, style.border);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(style.fg).text(style.label, left, 103, { width, align: 'center' });

  const fields = [
    { label: 'CUSTOMER', value: sale.patient?.fullName || 'Walk-in customer' },
    { label: 'PRESCRIPTION', value: details.prescription || 'Not applicable' },
    { label: 'PHARMACY TEAM', value: `Prepared: ${details.preparedBy || 'Not recorded'}\nDispensed: ${details.dispensedBy || 'Not yet dispensed'}` },
  ];
  const gap = 8;
  const cardWidth = (width - gap * 2) / 3;
  fields.forEach((field, index) => {
    const x = left + index * (cardWidth + gap);
    doc.roundedRect(x, 130, cardWidth, 52, 6).fillAndStroke('#f5f9fa', '#dce7eb');
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#64748b').text(field.label, x + 9, 138, { width: cardWidth - 18 });
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#173c50').text(field.value, x + 9, 151, { width: cardWidth - 18, height: 25, lineGap: 1, ellipsis: true });
  });
  doc.y = 195;

  const columns = [
    { x: left + 8, width: 224, label: 'Item / batch', align: 'left' },
    { x: 276, width: 55, label: 'Quantity', align: 'right' },
    { x: 338, width: 82, label: 'Unit price', align: 'right' },
    { x: 427, width: 117, label: 'Line total', align: 'right' },
  ];
  const drawItemsHeader = () => {
    const y = doc.y;
    doc.roundedRect(left, y, width, 22, 4).fill('#173c50');
    columns.forEach((column) => doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff').text(column.label.toUpperCase(), column.x, y + 7, { width: column.width, align: column.align, lineBreak: false }));
    doc.y = y + 22;
  };
  const drawItem = (item, index) => {
    const name = `${productName(item.product)}${item.batch?.batchNumber ? `\nBatch: ${item.batch.batchNumber}` : ''}`;
    doc.font('Helvetica').fontSize(8.5);
    const rowHeight = Math.max(26, doc.heightOfString(name, { width: columns[0].width }) + 12);
    if (doc.y + rowHeight > bottom) {
      drawContinuation('Invoice items continued');
      drawItemsHeader();
    }
    const y = doc.y;
    if (index % 2) doc.rect(left, y, width, rowHeight).fill('#f3f8f7');
    doc.font('Helvetica').fontSize(8.5).fillColor('#182b3b').text(name, columns[0].x, y + 6, { width: columns[0].width, height: rowHeight - 8 });
    doc.font('Helvetica').fontSize(8.5).fillColor('#182b3b').text(String(item.quantity), columns[1].x, y + 7, { width: columns[1].width, align: 'right', lineBreak: false });
    doc.text(money(item.unitPrice), columns[2].x, y + 7, { width: columns[2].width, align: 'right', lineBreak: false });
    doc.text(money(item.lineTotal), columns[3].x, y + 7, { width: columns[3].width, align: 'right', lineBreak: false });
    doc.y = y + rowHeight;
    doc.moveTo(left, doc.y).lineTo(right, doc.y).lineWidth(0.4).strokeColor('#dce6e3').stroke();
  };
  drawItemsHeader();
  sale.items.forEach(drawItem);

  const summaryRows = [
    ['Subtotal', sale.subtotal], ['Discount', -Number(sale.discount)], ['Bottle / container fee', sale.containerFee],
    ['Tax', sale.tax], ['Invoice total', sale.total], ['Amount paid', sale.amountPaid],
    ['Balance due', sale.status === 'VOIDED' ? 0 : Math.max(0, Number(sale.total) - Number(sale.amountPaid))],
  ];
  ensure(154, 'Invoice totals');
  doc.moveDown(1);
  const summaryY = doc.y;
  const summaryHeight = summaryRows.length * 16 + 16;
  doc.roundedRect(300, summaryY, right - 300, summaryHeight, 7).fillAndStroke('#f1f8f6', '#d8e8e3');
  summaryRows.forEach(([label, value], index) => {
    const y = summaryY + 9 + index * 16;
    const total = label === 'Invoice total';
    doc.font(total ? 'Helvetica-Bold' : 'Helvetica').fontSize(total ? 9.5 : 8).fillColor(total ? '#174a45' : '#445966');
    doc.text(label, 310, y, { width: 115 });
    doc.text(money(value), 425, y, { width: 115, align: 'right' });
  });
  doc.y = summaryY + summaryHeight + 8;

  // Medicines prescribed but not supplied on this invoice: collected later on a
  // new bill, or recorded as not to be issued. Each shows its reason.
  const balanceBox = (title, intro, lines, fill, stroke, titleColour, textColour) => {
    if (!lines?.length) return;
    const text = `${intro}\n${lines.map((line) => `${line.name}: ${line.quantity} ${line.unit}${line.reason ? ` (${line.reason})` : ''}`).join('\n')}`;
    doc.font('Helvetica').fontSize(8);
    const height = doc.heightOfString(text, { width: width - 20 }) + 30;
    ensure(height + 6, title);
    const y = doc.y + 4;
    doc.roundedRect(left, y, width, height, 6).fillAndStroke(fill, stroke);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(titleColour).text(title.toUpperCase(), left + 10, y + 8, { width: width - 20 });
    doc.font('Helvetica').fontSize(8).fillColor(textColour).text(text, left + 10, y + 23, { width: width - 20 });
    doc.y = y + height + 6;
  };
  if (details.supplyRows?.length) {
    ensure(60, 'Prescribed and bought');
    doc.moveDown(0.4).font('Helvetica-Bold').fontSize(10).fillColor('#174a45').text('Prescribed and bought', left, doc.y, { width });
    doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Medicines not bought now were not charged on this invoice.', { width });
    for (const row of details.supplyRows) {
      const text = `${row.name}: prescribed ${Number(row.prescribed)} ${row.unit}${Number(row.suppliedBefore) ? `, ${Number(row.suppliedBefore)} supplied earlier` : ''}, bought ${Number(row.onThisBill)} on this invoice${Number(row.notBought) ? `, ${Number(row.notBought)} not bought - ${row.rest}${row.reason ? ` (${row.reason})` : ''}` : ''}.`;
      doc.font('Helvetica').fontSize(8);
      ensure(doc.heightOfString(text, { width }) + 4, 'Prescribed and bought continued');
      doc.fillColor(Number(row.notBought) ? '#5b4a1e' : '#334155').text(text, left, doc.y + 2, { width });
    }
    doc.moveDown(0.4);
  } else balanceBox('Balance to collect later', 'Not supplied or charged on this invoice. Bring this invoice back to collect them: the pharmacy issues a separate bill when stock is available.', details.balanceToCollect, '#fff8e6', '#e2b34a', '#8a5a0e', '#5b4a1e');
  if (!details.supplyRows?.length) balanceBox('Not to be issued', 'Prescribed but not supplied and not charged. The pharmacy will not issue these later on this prescription.', details.notToBeIssued, '#f3f4f6', '#9ca3af', '#374151', '#4b5563');

  const sectionHeading = (title) => {
    ensure(34, `${title} continued`);
    doc.moveDown(0.6).font('Helvetica-Bold').fontSize(11).fillColor('#174a45').text(title, left, doc.y, { width });
    doc.moveDown(0.2);
  };
  if (details.medicineInstructions.length) {
    sectionHeading('Medicine directions');
    doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Directions recorded for medicines supplied with this invoice. Ask the pharmacist if anything is unclear.', { width });
    doc.moveDown(0.3);
    for (const item of details.medicineInstructions) {
      const body = [item.directions, item.specialInstructions && `Additional instructions: ${item.specialInstructions}`, item.storageInstructions && `Storage: ${item.storageInstructions}`].filter(Boolean).join('\n');
      doc.font('Helvetica-Bold').fontSize(8.5);
      const titleHeight = doc.heightOfString(item.name, { width: width - 20 });
      doc.font('Helvetica').fontSize(8);
      const bodyHeight = doc.heightOfString(`Supplied: ${item.quantity} ${item.unit}\n${body}`, { width: width - 20 });
      const cardHeight = titleHeight + bodyHeight + 20;
      ensure(cardHeight + 6, 'Medicine directions continued');
      const y = doc.y;
      doc.roundedRect(left, y, width, cardHeight, 5).fillAndStroke('#f7faf9', '#dce9e5');
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#173c50').text(item.name, left + 10, y + 8, { width: width - 20 });
      doc.font('Helvetica').fontSize(8).fillColor('#334155').text(`Supplied: ${item.quantity} ${item.unit}\n${body}`, left + 10, y + 10 + titleHeight, { width: width - 20 });
      doc.y = y + cardHeight + 6;
    }
  }

  if (sale.refunds?.length) {
    sectionHeading('Refund / credit history');
    doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Original invoice retained; refund payout is recorded separately.', { width });
    for (const refund of sale.refunds) {
      const text = `Refund #${refund.id} · ${money(refund.amount)} · ${refund.status === 'SETTLED' ? `Payout confirmed (${refund.method})` : 'Payout pending'}\n${refund.reason || 'No reason recorded'}`;
      doc.font('Helvetica').fontSize(8);
      const height = doc.heightOfString(text, { width: width - 20 }) + 16;
      ensure(height, 'Refund history continued');
      const y = doc.y;
      doc.roundedRect(left, y, width, height, 5).fillAndStroke('#fffaf4', '#eadfce');
      doc.fillColor('#334155').text(text, left + 10, y + 8, { width: width - 20 });
      doc.y = y + height + 6;
    }
  }
  ensure(38, 'Invoice note');
  doc.moveDown(1).font(sale.status === 'VOIDED' ? 'Helvetica-Bold' : 'Helvetica').fontSize(8).fillColor(sale.status === 'VOIDED' ? '#9a2f24' : '#64748b')
    .text(sale.status === 'VOIDED' ? 'This invoice is void and is not valid for payment or dispensing.' : 'Generated electronically by MediFlow. Please retain this invoice for your records.', { width, align: 'center' });

  const pages = doc.bufferedPageRange();
  for (let index = pages.start; index < pages.start + pages.count; index += 1) {
    doc.switchToPage(index);
    doc.moveTo(left, 770).lineTo(right, 770).lineWidth(0.5).strokeColor('#dce6e3').stroke();
    doc.font('Helvetica').fontSize(7).fillColor('#82918e').text(`MediFlow Pharmacy - ${sale.invoiceNumber} - Page ${index - pages.start + 1} of ${pages.count}`, left, 778, { width, align: 'center', lineBreak: false, height: 9 });
  }
  doc.end();
});
