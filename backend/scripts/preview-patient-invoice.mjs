import fs from 'node:fs/promises';
import { createInvoicePdf } from '../src/utils/invoicePdf.js';
const product = { genericName: 'Sample medicine', strength: '5 mg', unit: 'tablet', prescriptionRequired: true };
const sale = {
  invoiceNumber: 'INV-LAYOUT-CHECK', createdAt: new Date(), status: 'PAID', patient: { fullName: 'Sample Customer' },
  pharmacist: { fullName: 'Dispensing Pharmacist' }, cashier: { fullName: 'Cashier' }, subtotal: 100, total: 100, amountPaid: 100,
  items: [{ product, batch: { batchNumber: 'TEST' }, quantity: 3, unitPrice: 100 / 3, lineTotal: 100 }],
  dispensing: { prescription: { prescriptionNumber: 'RX-LAYOUT', createdBy: { fullName: 'Preparing Pharmacist' }, verifiedBy: { fullName: 'Verifying Pharmacist' } },
    items: [{ id: 1, quantity: 3, prescriptionItem: { product, dosageInstructions: 'Sample recorded instructions for layout testing only. Not medical advice.', specialInstructions: 'Sample additional instructions.', } }] },
};
const directory = new URL('../../tmp/pdfs/', import.meta.url);
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(new URL('patient-invoice.pdf', directory), await createInvoicePdf(sale));
console.log('Created synthetic patient invoice layout check.');
