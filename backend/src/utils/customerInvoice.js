import { patientMedicineInstructions } from './patientMedicineInstructions.js';
// Explicit allowlist: new internal invoice fields must not become customer data by default.
const pick = (record, keys) => Object.fromEntries(keys.filter((key) => record[key] !== undefined).map((key) => [key, record[key]]));
export const customerInvoice = (sale) => ({
  medicineInstructions: patientMedicineInstructions(sale),
  preparedBy: sale.dispensing?.prescription?.createdBy?.fullName || null,
  verifiedBy: sale.dispensing?.prescription?.verifiedBy?.fullName || null,
  ...pick(sale, ['id', 'invoiceNumber', 'dispensingId', 'paymentRequestId', 'createdAt', 'status', 'subtotal', 'discount', 'containerFee', 'tax', 'total', 'amountPaid', 'paymentMethod']),
  patient: sale.patient ? { fullName: sale.patient.fullName } : null,
  pharmacist: sale.pharmacist ? { fullName: sale.pharmacist.fullName } : null,
  cashier: sale.cashier ? { fullName: sale.cashier.fullName } : null,
  paymentRequest: sale.paymentRequest ? { requestNumber: sale.paymentRequest.requestNumber } : null,
  dispensing: sale.dispensing ? { prescription: sale.dispensing.prescription ? { prescriptionNumber: sale.dispensing.prescription.prescriptionNumber } : null } : null,
  items: sale.items.map((item) => ({
    ...pick(item, ['id', 'quantity', 'unitPrice', 'lineTotal']),
    product: pick(item.product, ['genericName', 'strength', 'dosageForm', 'unit', 'prescriptionRequired']),
    batch: item.batch ? pick(item.batch, ['batchNumber', 'expiryDate']) : null,
  })),
  discountApplications: (sale.discountApplications || []).map((discount) => pick(discount, ['id', 'ruleName', 'amount'])),
  refunds: (sale.refunds || []).map((refund) => ({
    ...pick(refund, ['id', 'amount', 'reason', 'status', 'method', 'reference', 'createdAt', 'settledAt']),
    lines: (refund.lines || []).map((line) => pick(line, ['id', 'name', 'quantity', 'amount'])),
  })),
});
