import PDFDocument from 'pdfkit';

// Millimetres to PDF points. No medicine list, prices or clinical information.
export const createCollectionSlipPdf = (request, paperWidth = 80) => new Promise((resolve, reject) => {
  const width = (paperWidth === 58 ? 58 : 80) * 72 / 25.4;
  const margin = 4 * 72 / 25.4;
  const doc = new PDFDocument({ autoFirstPage: false });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);
  const usable = width - margin * 2;
  const customer = request.patient?.fullName || 'Walk-in customer';
  const reference = request.requestNumber;
  doc.font('Helvetica').fontSize(11);
  const customerHeight = doc.heightOfString(customer, { width: usable });
  doc.fontSize(10);
  const referenceHeight = doc.heightOfString(reference, { width: usable });
  const height = margin * 2 + customerHeight + referenceHeight + 150;
  doc.addPage({ size: [width, height], margins: { top: margin, bottom: margin, left: margin, right: margin } });
  doc.fillColor('black').font('Helvetica-Bold').fontSize(12).text('MediFlow', { align: 'center' });
  doc.font('Helvetica').fontSize(9).text('Collection slip - not an invoice', { align: 'center' });
  doc.moveDown(0.7);
  doc.fontSize(8).text('CUSTOMER NAME');
  doc.font('Helvetica-Bold').fontSize(11).text(customer);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(8).text('REFERENCE NUMBER');
  doc.font('Helvetica-Bold').fontSize(10).text(reference);
  doc.moveDown(0.6);
  if (request.pickupPin) {
    doc.font('Helvetica').fontSize(9).text('COLLECTION PIN', { align: 'center' });
    doc.font('Helvetica-Bold').fontSize(27).text(request.pickupPin, { align: 'center' });
  } else doc.font('Helvetica-Bold').fontSize(11).text('Collect at the pharmacy', { align: 'center' });
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(8).text('Show this slip only when collecting your order.', { align: 'center' });
  doc.end();
});
