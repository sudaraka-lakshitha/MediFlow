import PDFDocument from 'pdfkit';

const moneyLike = (value) => typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(value ?? '');

export const createPdf = ({ title, subtitle, columns, rows, summary = [], chart = null, notes = [] }) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: 36, size: 'A4', layout: columns.length > 6 ? 'landscape' : 'portrait', bufferPages: true });
  const chunks = []; doc.on('data', (chunk) => chunks.push(chunk)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
  const left = 36; const right = doc.page.width - 36; const available = right - left;
  const heading = () => { doc.font('Helvetica-Bold').fontSize(20).fillColor('#174a45').text(title); doc.moveDown(0.2).font('Helvetica').fontSize(9).fillColor('#64748b').text(subtitle); doc.moveDown(0.7); };
  heading();
  if (summary.length) {
    const gap = 8; const cardWidth = (available - gap * (Math.min(summary.length, 4) - 1)) / Math.min(summary.length, 4); const startY = doc.y;
    summary.slice(0, 4).forEach((item, index) => { const x = left + index * (cardWidth + gap); doc.roundedRect(x, startY, cardWidth, 48, 5).fillAndStroke('#f0f7f6', '#d5e7e4'); doc.fillColor('#64748b').fontSize(7.5).text(item.label, x + 8, startY + 8, { width: cardWidth - 16 }); doc.fillColor('#174a45').font('Helvetica-Bold').fontSize(12).text(String(item.value), x + 8, startY + 24, { width: cardWidth - 16 }); });
    doc.y = startY + 58;
  }
  if (chart?.items?.length) {
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(11).text(chart.title || 'Highlights'); const items = chart.items.slice(0, 10); const max = Math.max(...items.map((item) => Math.abs(Number(item.value) || 0)), 1); const labelWidth = Math.min(145, available * 0.32); const barWidth = available - labelWidth - 70;
    items.forEach((item) => { const y = doc.y + 3; doc.font('Helvetica').fontSize(7.5).fillColor('#334155').text(String(item.label), left, y, { width: labelWidth - 5, ellipsis: true }); doc.roundedRect(left + labelWidth, y + 1, barWidth, 8, 3).fill('#e7efee'); const width = Math.max(2, (Math.abs(Number(item.value) || 0) / max) * barWidth); doc.roundedRect(left + labelWidth, y + 1, width, 8, 3).fill(Number(item.value) < 0 ? '#c8564f' : '#2b8177'); doc.fillColor('#334155').text(moneyLike(item.value), left + labelWidth + barWidth + 6, y, { width: 62, align: 'right' }); doc.y = y + 14; });
    doc.moveDown(0.5);
  }
  if (notes.length) { doc.font('Helvetica').fontSize(7.5).fillColor('#64748b'); notes.forEach((note) => doc.text(`• ${note}`)); doc.moveDown(0.6); }
  doc.fillColor('#111827').font('Helvetica-Bold').fontSize(11).text(`Detailed records (${rows.length})`); doc.moveDown(0.3);
  const width = available / columns.length;
  const drawRow = (values, header = false) => { let y = doc.y; if (y > doc.page.height - 58) { doc.addPage(); heading(); y = doc.y; } if (header) doc.rect(left, y - 3, available, 21).fill('#174a45'); values.forEach((value, index) => doc.font(header ? 'Helvetica-Bold' : 'Helvetica').fontSize(6.8).fillColor(header ? '#ffffff' : '#111827').text(String(value ?? ''), left + index * width + 3, y + (header ? 2 : 0), { width: width - 6, height: 18, ellipsis: true })); doc.y = y + 21; if (!header) doc.moveTo(left, doc.y - 2).lineTo(right, doc.y - 2).strokeColor('#e2e8f0').stroke(); };
  drawRow(columns.map((column) => column.label), true); rows.forEach((data) => drawRow(columns.map((column) => data[column.key])));
  const pages = doc.bufferedPageRange(); for (let page = 0; page < pages.count; page += 1) { doc.switchToPage(page); doc.font('Helvetica').fontSize(7).fillColor('#94a3b8').text(`Generated ${new Date().toISOString()}  •  Page ${page + 1} of ${pages.count}`, left, doc.page.height - 25, { width: available, align: 'center', height: 20, lineBreak: false }); }
  doc.end();
});
