// Creates the small collection slip PDF with the PIN.

import PDFDocument from 'pdfkit';
import { deliveryStatusLabel } from './deliveryStatus.js';

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
  const height = margin * 2 + customerHeight + referenceHeight + 220 + (request.balanceToCollect?.length ? 26 : 0);
  doc.addPage({ size: [width, height], margins: { top: margin, bottom: margin, left: margin, right: margin } });
  doc.fillColor('#174a45').font('Helvetica-Bold').fontSize(15).text('MediFlow', { align: 'center' });
  const delivery = request.delivery && request.delivery.status !== 'CANCELLED';
  const service = Boolean(request.deliveryFeeFor);
  doc.font('Helvetica').fontSize(8.5).fillColor('#64748b').text(delivery || service ? 'Delivery payment confirmation' : 'Collection PIN slip · not an invoice', { align: 'center' });
  doc.moveDown(0.6);
  doc.moveTo(margin, doc.y).lineTo(width - margin, doc.y).lineWidth(1.2).strokeColor('#8bc9bd').stroke();
  doc.moveDown(0.7);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#64748b').text('CUSTOMER NAME');
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#172b4d').text(customer);
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#64748b').text('REFERENCE NUMBER');
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#172b4d').text(reference);
  doc.moveDown(0.6);
  if (request.pickupPin) {
    const pinBoxY = doc.y + 4;
    const pinBoxHeight = 70;
    doc.roundedRect(margin, pinBoxY, usable, pinBoxHeight, 6).fillAndStroke('#eef8f5', '#8bc9bd');
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#426d67').text('COLLECTION PIN', margin, pinBoxY + 11, { width: usable, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(25).fillColor('#174a45').text(request.pickupPin, margin, pinBoxY + 28, { width: usable, align: 'center', characterSpacing: 4 });
    doc.y = pinBoxY + pinBoxHeight;
  } else doc.font('Helvetica-Bold').fontSize(11).fillColor('#174a45').text(service ? 'Delivery fee paid' : delivery ? `Delivery: ${deliveryStatusLabel(request.delivery.status)}` : 'Collect at the pharmacy', { align: 'center' });
  doc.moveDown(0.5);
  // A count only: this slip deliberately carries no medicine list.
  const balanceCount = request.balanceToCollect?.length || 0;
  if (balanceCount) doc.font('Helvetica-Bold').fontSize(8).fillColor('#8a5a0e').text(`Balance to collect later: ${balanceCount} medicine${balanceCount === 1 ? '' : 's'} (not charged). See your bill.`, { align: 'center' }).moveDown(0.3);
  doc.font('Helvetica').fontSize(7.5).fillColor('#64748b').text(delivery || service ? 'Track your order under Home deliveries.' : 'Keep this PIN private and show it only when collecting.', { align: 'center' });
  doc.end();
});
