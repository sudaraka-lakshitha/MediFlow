import PDFDocument from 'pdfkit';

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
const productName = (product) => `${product.genericName}${product.strength && product.strength !== 'N/A' ? ` ${product.strength}` : ''}`;

const statusStyles = {
  VOIDED: { label: 'VOIDED - NOT VALID', bg: '#fdecea', border: '#e6786d', fg: '#9a2f24' },
  PAID: { label: 'PAID', bg: '#e9f7f1', border: '#79bdb1', fg: '#176b63' },
  PENDING: { label: 'PAYMENT PENDING', bg: '#fff6e5', border: '#e2b34a', fg: '#8a5a0e' },
};

export const createInvoicePdf = (sale) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ size: 'A4', margin: 42 }); const chunks = [];
  const hasSupplementaryRetailItems = Boolean(sale.dispensing && sale.items.some((item) => !item.product.prescriptionRequired));
  doc.on('data', (chunk) => chunks.push(chunk)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
  doc.fontSize(22).fillColor('#174a45').text('MediFlow Pharmacy');
  doc.fontSize(10).fillColor('#64748b').text(hasSupplementaryRetailItems ? 'Combined prescription and retail invoice' : sale.dispensing ? 'Prescription dispensing invoice' : 'Retail sales invoice');
  doc.moveDown().fillColor('#111827').fontSize(13).text(sale.invoiceNumber, { align: 'right' });
  doc.fontSize(9).text(`Date: ${sale.createdAt.toISOString()}`, { align: 'right' });

  const style = statusStyles[sale.status] || statusStyles.PENDING;
  const bannerY = doc.y + 6;
  doc.roundedRect(42, bannerY, 510, 26, 5).fillAndStroke(style.bg, style.border);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(style.fg).text(style.label, 42, bannerY + 7, { width: 510, align: 'center' });
  doc.y = bannerY + 26;
  doc.font('Helvetica');

  doc.moveDown().fontSize(10).fillColor('#111827').text(`Patient: ${sale.patient?.fullName || 'Walk-in'}`);
  doc.text(`${sale.dispensing ? 'Dispensed by' : 'Sold by'}: ${sale.pharmacist.fullName}`);
  if (sale.cashier) doc.text(`Payment received by: ${sale.cashier.fullName}`);
  if (sale.paymentRequest) doc.text(`Cashier request: ${sale.paymentRequest.requestNumber}`);
  if (sale.dispensing?.prescription) doc.text(`Prescription: ${sale.dispensing.prescription.prescriptionNumber}`);
  doc.moveDown();
  const widths = [235, 60, 85, 90]; const x = [42, 277, 337, 422];
  const row = (values, bold = false) => {
    if (doc.y > 740) doc.addPage(); const y = doc.y;
    values.forEach((value, index) => doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5).text(String(value), x[index], y, { width: widths[index] - 6 }));
    doc.y = y + 25; doc.moveTo(42, doc.y - 4).lineTo(552, doc.y - 4).strokeColor('#dce6e3').stroke();
  };
  row(['Item / batch', 'Quantity', 'Unit price', 'Line total'], true);
  sale.items.forEach((item) => row([`${productName(item.product)}\nBatch: ${item.batch.batchNumber}`, item.quantity, money(item.unitPrice), money(item.lineTotal)]));
  doc.moveDown();
  const summary = [['Subtotal', sale.subtotal], ['Discount', -Number(sale.discount)], ['Bottle / container fee', sale.containerFee], ['Tax', sale.tax], ['Invoice total', sale.total], ['Amount paid', sale.amountPaid], ['Balance due', Math.max(0, Number(sale.total) - Number(sale.amountPaid))]];
  summary.forEach(([label, value], index) => doc.font(index === 4 ? 'Helvetica-Bold' : 'Helvetica').fontSize(index === 4 ? 11 : 9).text(`${label}: ${money(value)}`, { align: 'right' }));
  doc.moveDown(2);
  if (sale.status === 'VOIDED') {
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#9a2f24').text('This invoice has been voided and is not valid for payment, dispensing, or any other transaction.', { align: 'center' });
  } else {
    doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('This invoice was generated electronically by MediFlow. Please retain it for your records.', { align: 'center' });
  }
  doc.end();
});
