import PDFDocument from 'pdfkit';
import { formatPharmacyTimestamp } from './pharmacyTime.js';

const MARGIN = 36;
const ROW_HEIGHT = 16;
const HEADER_HEIGHT = 19;
const BODY_FONT_SIZE = 7;

const isNumericValue = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return /^-?(rs\.?\s*)?[\d,]+(\.\d+)?%?$/i.test(String(value).trim());
};

// Thousands separators make long stock/currency columns readable at a glance; anything
// that is not purely numeric (SKUs, statuses, dates) is passed through untouched.
const formatCell = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(text)) {
    return formatPharmacyTimestamp(text);
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) {
    const asNumber = Number(text);
    if (Number.isFinite(asNumber)) return asNumber.toLocaleString(undefined, { maximumFractionDigits: 3 });
  }
  return text;
};

const moneyLike = (value) => (typeof value === 'number'
  ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  : String(value ?? ''));

// Share the width out by how much each column actually needs rather than giving every
// column an equal slice - otherwise a short "Qty" column gets the same room as a product
// name and the long values are silently truncated to an ellipsis.
const measureColumns = (doc, columns, rows, available) => {
  const sample = rows.slice(0, 60);
  const widths = columns.map((column) => {
    doc.font('Helvetica-Bold').fontSize(BODY_FONT_SIZE);
    let needed = doc.widthOfString(String(column.label ?? '')) + 10;
    doc.font('Helvetica').fontSize(BODY_FONT_SIZE);
    sample.forEach((row) => {
      const width = doc.widthOfString(formatCell(row[column.key])) + 10;
      if (width > needed) needed = width;
    });
    return Math.min(Math.max(needed, 26), available * 0.3);
  });
  const total = widths.reduce((sum, width) => sum + width, 0);
  // Scale to fill the page exactly, whether the natural widths over- or under-shoot.
  return widths.map((width) => (width / total) * available);
};

const detectAlignment = (columns, rows) => columns.map((column) => {
  if (column.align) return column.align;
  const values = rows.slice(0, 40).map((row) => row[column.key]).filter((value) => value !== null && value !== undefined && value !== '');
  if (!values.length) return 'left';
  return values.filter(isNumericValue).length / values.length > 0.7 ? 'right' : 'left';
});

export const createPdf = ({ title, subtitle, columns, rows, summary = [], chart = null, notes = [] }) => new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: MARGIN, size: 'A4', layout: columns.length > 6 ? 'landscape' : 'portrait', bufferPages: true });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => resolve(Buffer.concat(chunks)));
  doc.on('error', reject);

  const left = MARGIN;
  const right = doc.page.width - MARGIN;
  const available = right - left;
  // Keep the detailed ledger above the footer area so the last row on every page
  // cannot collide with the generated-at / page-number line.
  const bottomLimit = doc.page.height - 70;

  const fullHeading = () => {
    doc.font('Helvetica-Bold').fontSize(20).fillColor('#174a45').text(title, left, doc.y);
    doc.moveDown(0.2).font('Helvetica').fontSize(9).fillColor('#64748b').text(subtitle);
    doc.moveDown(0.7);
  };

  // Continuation pages get a slim one-line banner instead of the full title block, so the
  // repeated column header stays close to the data it belongs to.
  const continuationHeading = () => {
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#174a45').text(title, left, MARGIN);
    doc.font('Helvetica').fontSize(7.5).fillColor('#94a3b8')
      .text(/\(continued\)$/i.test(subtitle) ? subtitle : `${subtitle} (continued)`, left, MARGIN + 12);
    doc.moveTo(left, MARGIN + 24).lineTo(right, MARGIN + 24).lineWidth(0.5).strokeColor('#cfe0dc').stroke();
    doc.y = MARGIN + 30;
  };

  fullHeading();

  if (summary.length) {
    const perRow = Math.min(summary.length, 4);
    const gap = 8;
    const cardWidth = (available - gap * (perRow - 1)) / perRow;
    const startY = doc.y;
    summary.slice(0, 4).forEach((item, index) => {
      const x = left + index * (cardWidth + gap);
      doc.roundedRect(x, startY, cardWidth, 48, 5).fillAndStroke('#f0f7f6', '#d5e7e4');
      doc.fillColor('#64748b').font('Helvetica').fontSize(7.5).text(item.label, x + 8, startY + 8, { width: cardWidth - 16 });
      doc.fillColor('#174a45').font('Helvetica-Bold').fontSize(12).text(String(item.value), x + 8, startY + 24, { width: cardWidth - 16 });
    });
    doc.y = startY + 58;
  }

  if (chart?.items?.length) {
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(11).text(chart.title || 'Highlights', left, doc.y);
    const items = chart.items.slice(0, 10);
    const max = Math.max(...items.map((item) => Math.abs(Number(item.value) || 0)), 1);
    const labelWidth = Math.min(145, available * 0.32);
    const barWidth = available - labelWidth - 70;
    items.forEach((item) => {
      const y = doc.y + 3;
      doc.font('Helvetica').fontSize(7.5).fillColor('#334155').text(String(item.label), left, y, { width: labelWidth - 5, ellipsis: true });
      doc.roundedRect(left + labelWidth, y + 1, barWidth, 8, 3).fill('#e7efee');
      const width = Math.max(2, (Math.abs(Number(item.value) || 0) / max) * barWidth);
      doc.roundedRect(left + labelWidth, y + 1, width, 8, 3).fill(Number(item.value) < 0 ? '#c8564f' : '#2b8177');
      doc.fillColor('#334155').text(moneyLike(item.value), left + labelWidth + barWidth + 6, y, { width: 62, align: 'right' });
      doc.y = y + 14;
    });
    doc.moveDown(0.5);
  }

  if (notes.length) {
    doc.font('Helvetica').fontSize(7.5).fillColor('#64748b');
    notes.forEach((note) => doc.text(`- ${note}`, left, doc.y));
    doc.moveDown(0.6);
  }

  doc.fillColor('#111827').font('Helvetica-Bold').fontSize(11).text(`Detailed records (${rows.length})`, left, doc.y);
  doc.moveDown(0.3);

  if (!rows.length) {
    const y = doc.y;
    doc.roundedRect(left, y, available, 34, 5).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.font('Helvetica').fontSize(9).fillColor('#64748b')
      .text('No records matched this report period.', left, y + 12, { width: available, align: 'center' });
  } else {
    const widths = measureColumns(doc, columns, rows, available);
    const aligns = detectAlignment(columns, rows);
    const offsets = widths.reduce((acc, width, index) => {
      acc.push(index === 0 ? left : acc[index - 1] + widths[index - 1]);
      return acc;
    }, []);

    const drawHeaderRow = () => {
      const y = doc.y;
      doc.rect(left, y, available, HEADER_HEIGHT).fill('#174a45');
      columns.forEach((column, index) => {
        doc.font('Helvetica-Bold').fontSize(BODY_FONT_SIZE).fillColor('#ffffff')
          .text(String(column.label ?? ''), offsets[index] + 4, y + 6, {
            width: widths[index] - 8, height: 10, align: aligns[index], ellipsis: true, lineBreak: false,
          });
      });
      doc.y = y + HEADER_HEIGHT;
    };

    drawHeaderRow();

    rows.forEach((row, rowIndex) => {
      if (doc.y + ROW_HEIGHT > bottomLimit) {
        doc.addPage();
        continuationHeading();
        // Repeating the column header is the whole point: without it every page after the
        // first was an unlabelled wall of numbers.
        drawHeaderRow();
      }
      const y = doc.y;
      if (rowIndex % 2 === 1) doc.rect(left, y, available, ROW_HEIGHT).fill('#f6f9f8');
      columns.forEach((column, index) => {
        doc.font('Helvetica').fontSize(BODY_FONT_SIZE).fillColor('#111827')
          .text(formatCell(row[column.key]), offsets[index] + 4, y + 4, {
            width: widths[index] - 8, height: 10, align: aligns[index], ellipsis: true, lineBreak: false,
          });
      });
      doc.y = y + ROW_HEIGHT;
      doc.moveTo(left, doc.y).lineTo(right, doc.y).lineWidth(0.4).strokeColor('#e2e8f0').stroke();
    });
  }

  const generatedAt = formatPharmacyTimestamp(new Date());
  const pages = doc.bufferedPageRange();
  for (let page = pages.start; page < pages.start + pages.count; page += 1) {
    doc.switchToPage(page);
    doc.font('Helvetica').fontSize(7).fillColor('#94a3b8')
      .text(`Generated ${generatedAt} Sri Lanka time  -  Page ${page + 1 - pages.start} of ${pages.count}`,
        left, doc.page.height - 48, { width: available, align: 'center', height: 10, lineBreak: false });
  }
  doc.end();
});
