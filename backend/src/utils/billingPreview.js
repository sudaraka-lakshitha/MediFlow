// Shows what a bill will look like before it is saved.

import { patientMedicineInstructions } from './patientMedicineInstructions.js';
// Deliberately exclude PIN secrets, attachment data and unrelated patient records.
export const billingPreview = (record) => ({
  reference: record.invoiceNumber || record.requestNumber,
  customer: record.patient?.fullName || 'Walk-in customer',
  createdAt: record.createdAt,
  status: record.status,
  revision: record.revision,
  prescription: record.dispensing?.prescription?.prescriptionNumber || record.prescription?.prescriptionNumber,
  preparedBy: record.preparedBy || record.dispensing?.prescription?.createdBy?.fullName || record.prescription?.createdBy?.fullName || (!record.dispensing ? record.pharmacist?.fullName : null),
  verifiedBy: record.verifiedBy || record.dispensing?.prescription?.verifiedBy?.fullName || record.prescription?.verifiedBy?.fullName,
  dispensedBy: record.dispensing ? record.pharmacist?.fullName : null,
  medicineInstructions: patientMedicineInstructions(record),
  cashier: record.cashier?.fullName,
  subtotal: record.subtotal, discount: record.discount, containerFee: record.containerFee,
  tax: record.tax, total: record.total, amountPaid: record.amountPaid,
  items: record.items.length === 0 && (record.requestNumber || record.paymentRequest?.requestNumber || '').startsWith('DEL-')
    ? [{ id: 'delivery-service', name: 'Home delivery service', quantity: 1, unitPrice: record.subtotal, lineTotal: record.subtotal }]
    : record.items.map(item=>({ id:item.id, name:`${item.product.genericName}${item.product.strength && item.product.strength !== 'N/A' ? ` ${item.product.strength}` : ''}`, batch:item.batch?.batchNumber, quantity:item.quantity, unitPrice:item.unitPrice, lineTotal:item.lineTotal })),
  // Prescribed medicines not on this bill: collect later, not charged here.
  balanceToCollect: record.balanceToCollect || [],
  // Prescribed medicines the pharmacy recorded as not to be issued at all.
  notToBeIssued: record.notToBeIssued || [],
  // Prescribed against bought, per medicine.
  supplyRows: record.supplyRows || [],
  refunds: (record.refunds || []).map(refund=>({ id:refund.id, amount:refund.amount, reason:refund.reason, status:refund.status, method:refund.method, reference:refund.reference })),
});
