import { expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { exportDeliveryWorkbook, readDeliveryWorkbook, checkWorkbookArchive } from '../src/services/deliveryWorkbook.service.js';
import { parseCsv } from '../../frontend/src/utils/csv';

const delivery = { updatedAt: new Date('2026-10-24T10:00:00Z'), paymentRequest: { requestNumber: 'PAY-123', patient: { fullName: 'Demo Patient' } }, recipientName: 'Test Recipient', address: '123 Example Street', phone: '0701234567', status: 'AWAITING_FEE', trackingReference: '0012345', courierService: 'Example Courier' };
it('exports instructions, editable colours, dropdowns, filters and text-safe identifiers', async () => {
  const bytes = await exportDeliveryWorkbook([delivery]);
  const wb = new ExcelJS.Workbook(); await wb.xlsx.load(bytes);
  const sheet = wb.getWorksheet('Deliveries');
  expect(sheet.getCell('A2').text).toBe('MediFlow delivery updates');
  expect(sheet.getCell('A4').text).toContain('amber');
  expect(sheet.getCell('C18').fill.fgColor.argb).toBe('FFFFF4D6');
  expect(sheet.getCell('C18').dataValidation.type).toBe('list');
  expect(sheet.views[0].state).toBe('frozen');
  expect(sheet.autoFilter).toBeTruthy();
  expect(sheet.getCell('F18').value).toBe('0701234567');
  expect(sheet.getCell('H18').value).toBe('0012345');
  sheet.getCell('C18').value = 'DISPATCH';
  const rows = await readDeliveryWorkbook(Buffer.from(await wb.xlsx.writeBuffer()));
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ action: 'DISPATCH', invoice_number: 'PAY-123', recipient_name: 'Test Recipient', phone: '0701234567', version: '2026-10-24T10:00:00.000Z' });
});
it('rejects formula cells rather than trusting cached results', async () => {
  const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await exportDeliveryWorkbook([delivery]));
  wb.getWorksheet('Deliveries').getCell('H18').value = { formula: '1+1', result: 2 };
  await expect(readDeliveryWorkbook(Buffer.from(await wb.xlsx.writeBuffer()))).rejects.toThrow('plain values');
});
it('rejects corrupt and oversized Excel uploads', async () => {
  await expect(checkWorkbookArchive(Buffer.from('not a workbook'))).rejects.toThrow('Invalid Excel');
  await expect(checkWorkbookArchive(Buffer.alloc(1000001))).rejects.toThrow('1 MB');
});
it('rejects oversized spreadsheet ranges before workbook parsing', async () => {
  const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await exportDeliveryWorkbook([delivery]));
  wb.getWorksheet('Deliveries').autoFilter = 'A17:K1000000';
  await expect(readDeliveryWorkbook(Buffer.from(await wb.xlsx.writeBuffer()))).rejects.toThrow('oversized ranges');
});
it('reads CSV instructions at the top while preserving data fields', () => {
  const csv = 'MEDIFLOW DELIVERY UPDATE GUIDE,Instructions\n1. EDIT,Choose an action\n\ninvoice_number,version,action,phone\nPAY-123,2026-10-24T10:00:00.000Z,DISPATCH,0701234567';
  expect(parseCsv(csv, { requiredColumn: 'invoice_number', maxRows: 50, guideRows: true })[0]).toMatchObject({ invoice_number: 'PAY-123', phone: '0701234567' });
});
it('rejects modified or missing CSV headers', () => {
  expect(() => parseCsv('Other guide,Hello\ninvoice_number,version,action\nPAY-123,v,DISPATCH', { requiredColumn: 'invoice_number', maxRows: 50, guideRows: true })).toThrow('Unrecognized');
});
