// Read-only assessment. Outputs record references, never patient names or credentials.
import assert from 'node:assert/strict';
import { Prisma } from '@prisma/client';
import { prisma } from '../src/config/prisma.js';
import { isCountableUnit } from '../src/utils/unitMeasure.js';
const url = new URL(process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL);
assert(['localhost', '127.0.0.1', '[::1]'].includes(url.hostname), 'Local database only.');
const dec = v => new Prisma.Decimal(v || 0);
const sum = (rows, key) => rows.reduce((total, row) => total.add(row[key] || 0), dec(0));
const findings = []; const counts = {};
const flag = (type, model, id, details) => findings.push({ type, model, id, ...details });
try {
  await prisma.$transaction(async tx => {
    const products = await tx.product.findMany({ select: { id: true, sku: true, unit: true } });
    const byProduct = new Map(products.map(p => [p.id, p])); counts.products = products.length;
    const batches = await tx.inventoryBatch.findMany({ select: { id: true, productId: true, quantityReceived: true, quantityAvailable: true, quantityReserved: true } });
    const byBatch = new Map(batches.map(b => [b.id, b]));
    const definitions = [
      ['inventoryBatch', ['quantityReceived','quantityAvailable','quantityReserved'], batches],
      ['stockMovement', ['quantityChange','quantityBefore','quantityAfter']],
      ['prescriptionItem', ['prescribedQuantity','dispensedQuantity','cancelledQuantity']],
      ['prescriptionRetailItem', ['quantity']], ['saleItem', ['quantity']],
      ['paymentRequestItem', ['quantity']], ['refundLine', ['quantity']],
      ['dispensingItem', ['quantity']], ['stockReservation', ['quantity']],
    ];
    for (const [model, fields, cached] of definitions) {
      const hasProduct = !['dispensingItem','stockReservation'].includes(model);
      const select = { id: true, [hasProduct ? 'productId' : 'batchId']: true, ...Object.fromEntries(fields.map(f => [f, true])) };
      const rows = cached || await tx[model].findMany({ select }); counts[model] = rows.length;
      for (const row of rows) {
        const product = byProduct.get(row.productId || byBatch.get(row.batchId)?.productId);
        for (const field of fields) {
          const value = dec(row[field]);
          if (product && isCountableUnit(product.unit) && !value.isInteger()) flag('FRACTIONAL_COUNTABLE_QUANTITY', model, row.id, { sku: product.sku, field, value: value.toString(), unit: product.unit });
          if (field !== 'quantityChange' && value.isNegative()) flag('NEGATIVE_QUANTITY', model, row.id, { field, value: value.toString() });
          if ((field === 'quantity' || field === 'quantityReceived') && value.isZero()) flag('ZERO_TRANSACTION_QUANTITY', model, row.id, { field });
        }
        if (model === 'stockMovement' && !dec(row.quantityBefore).add(row.quantityChange).equals(row.quantityAfter)) flag('MOVEMENT_ARITHMETIC_MISMATCH', model, row.id, {});
        if (model === 'prescriptionItem' && dec(row.dispensedQuantity).add(row.cancelledQuantity).greaterThan(row.prescribedQuantity)) flag('PRESCRIPTION_COUNTERS_EXCEED_QUANTITY', model, row.id, {});
      }
    }
    const reservations = await tx.stockReservation.findMany({ select: { batchId: true, quantity: true } });
    for (const b of batches) {
      const linked = sum(reservations.filter(r => r.batchId === b.id), 'quantity');
      if (!linked.equals(b.quantityReserved)) flag('RESERVATION_LEDGER_MISMATCH', 'inventoryBatch', b.id, { stored: String(b.quantityReserved), linked: String(linked) });
      if (dec(b.quantityReserved).greaterThan(b.quantityAvailable)) flag('OVER_RESERVED', 'inventoryBatch', b.id, {});
    }
    const sales = await tx.sale.findMany({ select: { id: true, invoiceNumber: true, paymentRequestId: true, subtotal: true, discount: true, tax: true, containerFee: true, total: true, amountPaid: true,
      discountApplications: { select: { amount: true } }, payments: { select: { id: true, amount: true, method: true, reference: true } } } }); counts.sales = sales.length;
    for (const sale of sales) {
      const applied = sum(sale.discountApplications, 'amount');
      if (!applied.equals(sale.discount)) flag('DISCOUNT_LEDGER_MISMATCH', 'sale', sale.id, { reference: sale.invoiceNumber, invoiceDiscount: String(sale.discount), applicationTotal: String(applied) });
      const expected = Prisma.Decimal.max(0, dec(sale.subtotal).sub(sale.discount).add(sale.tax).add(sale.containerFee));
      if (!expected.equals(sale.total)) flag('INVOICE_TOTAL_MISMATCH', 'sale', sale.id, { reference: sale.invoiceNumber, stored: String(sale.total), expected: String(expected) });
      if (!sale.paymentRequestId && !sum(sale.payments, 'amount').equals(sale.amountPaid)) flag('DIRECT_PAYMENT_HISTORY_MISMATCH', 'sale', sale.id, { reference: sale.invoiceNumber, amountPaid: String(sale.amountPaid), datedPayments: String(sum(sale.payments, 'amount')) });
      for (const p of sale.payments) if (p.method === 'OTHER' || (p.method === 'BANK_TRANSFER' && !p.reference?.trim())) flag('PAYMENT_EVIDENCE_MISSING', 'salePayment', p.id, { saleId: sale.id, method: p.method });
    }
    const requests = await tx.paymentRequest.findMany({ select: { id: true, requestNumber: true, paymentMethod: true, paymentReference: true, amountPaid: true, refundedAmount: true, events: { where: { kind: { in: ['PAYMENT_RECEIVED','REFUND'] } }, select: { id: true, kind: true, amount: true, details: true } }, refunds: { select: { amount: true, saleId: true } } } }); counts.paymentRequests = requests.length;
    for (const r of requests) {
      const payments = r.events.filter(e => e.kind === 'PAYMENT_RECEIVED');
      if (!sum(payments, 'amount').equals(r.amountPaid)) flag('REQUEST_PAYMENT_HISTORY_MISMATCH', 'paymentRequest', r.id, { reference: r.requestNumber, amountPaid: String(r.amountPaid), datedPayments: String(sum(payments, 'amount')) });
      for (const e of r.events) {
        if (e.kind === 'REFUND' && !e.details?.refundId && !e.details?.method) flag('LEGACY_REFUND_METHOD_MISSING', 'paymentRequestEvent', e.id, { paymentRequestId: r.id });
        if (e.kind !== 'PAYMENT_RECEIVED') continue;
        const s = e.details?.splitDetails;
        if (s?.isSplit) {
          if (!dec(s.cashAmount).add(s.nonCashAmount).equals(e.amount)) flag('SPLIT_PAYMENT_MISMATCH', 'paymentRequestEvent', e.id, { paymentRequestId: r.id });
          if (!s.nonCashMethod || s.nonCashMethod === 'OTHER' || (s.nonCashMethod === 'BANK_TRANSFER' && !s.nonCashReference?.trim())) flag('PAYMENT_EVIDENCE_MISSING', 'paymentRequestEvent', e.id, { paymentRequestId: r.id });
        } else if (!e.details?.paymentMethod || e.details.paymentMethod === 'OTHER' || (e.details.paymentMethod === 'BANK_TRANSFER' && !(e.details.paymentReference || e.details.reference)?.trim())) flag('PAYMENT_EVENT_EVIDENCE_INCOMPLETE', 'paymentRequestEvent', e.id, { paymentRequestId: r.id, reference: r.requestNumber, amount: String(e.amount), eventMethod: e.details?.paymentMethod || null, invoiceMethod: r.paymentMethod, invoiceReferencePresent: Boolean(r.paymentReference?.trim()), eventDetailKeys: Object.keys(e.details || {}) });
      }
    }
    const refunds = await tx.refund.findMany({ select: { id: true, status: true, method: true, reference: true, settledAt: true, settledById: true } }); counts.refunds = refunds.length;
    for (const r of refunds) if (r.status === 'SETTLED' && (!['CASH','BANK_TRANSFER','CARD'].includes(r.method) || !r.reference?.trim() || !r.settledAt || !r.settledById)) flag('REFUND_SETTLEMENT_EVIDENCE_MISSING', 'refund', r.id, {});
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead, timeout: 60000 });
  console.log(JSON.stringify({ assessedAt: new Date().toISOString(), readOnly: true, counts, findingCount: findings.length, findings }, null, 2));
} finally { await prisma.$disconnect(); }
