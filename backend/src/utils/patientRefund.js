const pick = (record, keys) => Object.fromEntries(keys.filter(key => record[key] !== undefined).map(key => [key, record[key]]));
export const patientRefund = refund => ({
  ...pick(refund, ['id', 'saleId', 'paymentRequestId', 'category', 'amount', 'reason', 'approvalReason', 'status', 'method', 'reference', 'createdAt', 'decidedAt', 'settledAt']),
  sale: refund.sale ? pick(refund.sale, ['invoiceNumber']) : null,
  paymentRequest: refund.paymentRequest ? pick(refund.paymentRequest, ['requestNumber']) : null,
  lines: (refund.lines || []).map(line => pick(line, ['id', 'saleItemId', 'name', 'quantity', 'amount'])),
});
