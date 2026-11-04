import 'dotenv/config';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { batchAllocationOrder, operationSettingsService } from '../src/services/operationSettings.service.js';
import { deliveryService } from '../src/services/delivery.service.js';
import { performPrescriptionDispense } from '../src/utils/prescriptionDispense.js';
import { releaseReservations, reserveStock, usableQuantity } from '../src/utils/stock.js';

const dbUrl = process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;
if (!dbUrl) throw new Error('Set AIVEN_PRISMA_URL to the intended Aiven database before running this demo seed.');
const target = new URL(dbUrl);
if (!target.hostname.endsWith('.aivencloud.com') || target.pathname.replace(/^\//, '') !== 'defaultdb') {
  throw new Error('Refusing to seed: expected the MediFlow Aiven defaultdb host.');
}

const prisma = new PrismaClient({ datasourceUrl: dbUrl });
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const imageDir = path.join(repo, 'data/demo/prescriptions');
const images = [
  ['MediFlow_Demo_Prescription_1.png', 'application/png'],
  ['MediFlow_Demo_Prescription_2.png', 'application/png'],
  ['MediFlow_Demo_Prescription_3.png', 'application/png'],
  ['final-25/MediFlow_Demo_001.png', 'application/png'],
  ['final-25/MediFlow_Demo_002.png', 'application/png'],
  ['final-25/MediFlow_Demo_003.png', 'application/png'],
  ['final-25/MediFlow_Demo_004.png', 'application/png'],
];
const patientSpecs = [
  { name: 'Demo Patient Two', email: 'pharmacy.mediflow+patient2@gmail.com', patientNumber: 'PAT-DEMO-2026-02' },
  { name: 'Demo Patient Three', email: 'pharmacy.mediflow+patient3@gmail.com', patientNumber: 'PAT-DEMO-2026-03' },
  { name: 'Demo Patient Four', email: 'pharmacy.mediflow+patient4@gmail.com', patientNumber: 'PAT-DEMO-2026-04' },
  { name: 'Demo Patient Five', email: 'pharmacy.mediflow+patient5@gmail.com', patientNumber: 'PAT-DEMO-2026-05' },
  { name: 'Demo Patient Six', email: 'pharmacy.mediflow+patient6@gmail.com', patientNumber: 'PAT-DEMO-2026-06' },
  { name: 'Demo Patient Seven', email: 'pharmacy.mediflow+patient7@gmail.com', patientNumber: 'PAT-DEMO-2026-07' },
];
const passwordHash = await bcrypt.hash('Demo@123!', 12);
const today = new Date();

const billQuantitiesReserved = async (tx, bill, allocationOrder) => {
  const current = await tx.stockReservation.findMany({ where: { paymentRequestId: bill.id }, select: { paymentRequestItemId: true, quantity: true } });
  const byItem = new Map();
  for (const row of current) byItem.set(row.paymentRequestItemId, (byItem.get(row.paymentRequestItemId) || 0) + Number(row.quantity));
  const complete = bill.items.every(item => Math.abs((byItem.get(item.id) || 0) - Number(item.quantity)) < 0.0001);
  if (complete) return { changed: false, count: current.length };
  if (current.length) await releaseReservations(tx, bill.id);
  await reserveStock(tx, bill.id, bill.items, allocationOrder);
  return { changed: true, count: bill.items.length };
};

const actDelivery = (id, input, user) => prisma.$transaction(
  tx => deliveryService.act(id, input, user, tx),
  { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' },
);

const payDemoDeliveryFee = async (id, suffix, cashierId) => prisma.$transaction(async tx => {
  const fee = await tx.paymentRequest.findUniqueOrThrow({ where: { id } });
  if (fee.status !== 'AWAITING_PAYMENT') return;
  const paidAt = new Date();
  const claimed = await tx.paymentRequest.updateMany({
    where: { id, status: 'AWAITING_PAYMENT' },
    data: {
      status: 'PAID', paymentMethod: 'CASH', amountPaid: fee.total,
      cashierId,
      paidAt,
      pharmacyNote: `DEMO ONLY — simulated cash delivery-fee payment for scenario ${suffix}; no real money was collected.`,
    },
  });
  if (claimed.count !== 1) throw new Error(`Demo delivery-fee invoice ${fee.requestNumber} changed during processing.`);
  await tx.paymentRequestEvent.create({
    data: { paymentRequestId: id, revision: fee.revision, actorId: cashierId, kind: 'PAYMENT_RECEIVED', amount: fee.total, details: { paymentMethod: 'CASH', demoOnly: true, scenario: suffix } },
  });
}, { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' });

const reconcileDemoStock = async pharmacistId => {
  const reserveNumbers = ['DEMO-PAY-2026-AWAITING', 'DEMO-PAY-2026-PAID', 'DEMO-DLV-MED-2026-01', 'DEMO-DLV-MED-2026-02'];
  const dispatchNumbers = ['DEMO-DLV-MED-2026-03', 'DEMO-DLV-MED-2026-04'];
  const reserveBills = await prisma.paymentRequest.findMany({ where: { requestNumber: { in: reserveNumbers } }, include: { items: true, reservations: true } });
  const dispatchBills = await prisma.paymentRequest.findMany({ where: { requestNumber: { in: dispatchNumbers } }, include: { items: true, sale: true, prescription: true, delivery: true, reservations: true } });
  const byNumber = new Map([...reserveBills, ...dispatchBills].map(bill => [bill.requestNumber, bill]));
  for (const number of reserveNumbers) {
    const bill = byNumber.get(number);
    if (!bill) throw new Error(`Missing demo payment ${number}; cannot align its stock.`);
    if (number.includes('AWAITING') && bill.status !== 'AWAITING_PAYMENT') throw new Error(`${number} is no longer awaiting payment; refusing to change its stock state.`);
    if (!number.includes('AWAITING') && bill.status !== 'PAID') throw new Error(`${number} is no longer paid and awaiting fulfillment; refusing to change its stock state.`);
  }
  for (const number of dispatchNumbers) {
    const bill = byNumber.get(number);
    if (!bill || !['PAID', 'FULFILLED'].includes(bill.status) || !bill.prescriptionId || !bill.delivery || !['DISPATCHED', 'DELIVERED'].includes(bill.delivery.status)) {
      throw new Error(`${number} is not in the expected paid and dispatched demo state; refusing to adjust inventory.`);
    }
  }

  // Preflight the total new holds/deductions before making any inventory change.
  // Existing complete holds and already dispensed orders are excluded.
  const required = new Map();
  const addRequirement = (bill, quantityByItem = null) => {
    for (const item of bill.items) {
      const quantity = quantityByItem?.get(item.id) ?? Number(item.quantity);
      required.set(item.productId, (required.get(item.productId) || 0) + quantity);
    }
  };
  for (const bill of reserveBills) {
    const totals = new Map();
    for (const reservation of bill.reservations) totals.set(reservation.paymentRequestItemId, (totals.get(reservation.paymentRequestItemId) || 0) + Number(reservation.quantity));
    const complete = bill.items.every(item => Math.abs((totals.get(item.id) || 0) - Number(item.quantity)) < 0.0001);
    if (!complete) addRequirement(bill);
  }
  for (const bill of dispatchBills) if (bill.status === 'PAID' && !bill.sale) {
    const totals = new Map();
    for (const reservation of bill.reservations) totals.set(reservation.paymentRequestItemId, (totals.get(reservation.paymentRequestItemId) || 0) + Number(reservation.quantity));
    addRequirement(bill, new Map(bill.items.map(item => [item.id, Math.max(0, Number(item.quantity) - (totals.get(item.id) || 0))])));
  }
  for (const [productId, quantity] of required) {
    const batches = await prisma.inventoryBatch.findMany({ where: { productId, expiryDate: { gte: today }, restricted: false, quantityAvailable: { gt: 0 } }, select: { quantityAvailable: true, quantityReserved: true } });
    const usable = batches.reduce((sum, batch) => sum + Number(usableQuantity(batch)), 0);
    if (usable + 0.0001 < quantity) {
      const product = await prisma.product.findUnique({ where: { id: productId }, select: { genericName: true, unit: true } });
      throw new Error(`Not enough unreserved stock for the demo workflow (${product?.genericName}; need ${quantity} ${product?.unit}, usable ${usable}). No demo stock changes were made.`);
    }
  }

  const settings = await operationSettingsService.get(prisma);
  const allocationOrder = batchAllocationOrder(settings.allocationMethod);
  const stockActions = [];
  for (const number of reserveNumbers) {
    const bill = byNumber.get(number);
    const result = await prisma.$transaction(async tx => {
      const current = await tx.paymentRequest.findUniqueOrThrow({ where: { id: bill.id }, include: { items: true } });
      const reserved = await billQuantitiesReserved(tx, current, allocationOrder);
      if (number === 'DEMO-PAY-2026-AWAITING') {
        await tx.paymentRequest.update({ where: { id: current.id }, data: { reservationDurationHours: 24, reservationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } });
      }
      return reserved;
    });
    stockActions.push({ invoice: number, action: result.changed ? 'RESERVED' : 'ALREADY_RESERVED', reservationRows: result.count });
  }
  for (const number of dispatchNumbers) {
    const bill = byNumber.get(number);
    if (bill.status === 'FULFILLED' && bill.sale) {
      stockActions.push({ invoice: number, action: 'ALREADY_DISPENSED' });
      continue;
    }
    const result = await prisma.$transaction(async tx => performPrescriptionDispense(tx, {
      prescriptionId: bill.prescriptionId,
      paymentRequestId: bill.id,
      performedById: pharmacistId,
      notes: 'DEMO ONLY — completed through the standard dispensing workflow to demonstrate inventory deduction.',
      deliveryDispatch: true,
    }));
    stockActions.push({ invoice: number, action: 'DISPENSED', invoiceNumber: result.invoiceNumber, prescriptionStatus: result.prescriptionStatus });
  }
  return stockActions;
};

const createAndProgressReturnDemos = async ({ patients, pharmacist, cashier, medicine }) => {
  const specs = [
    { suffix: '05', finalStatus: 'DELIVERY_FAILED' },
    { suffix: '06', finalStatus: 'RETURNING' },
    { suffix: '07', finalStatus: 'RETURNED' },
    { suffix: '08', finalStatus: 'RESHIP_REQUESTED' },
    { suffix: '09', finalStatus: 'RESHIP_READY' },
    { suffix: '10', finalStatus: 'CANCELLED' },
  ];
  const demoPatient = (suffix) => patients[(Number(suffix) - 1) % patients.length];
  const summaries = [];
  for (const spec of specs) {
    const { suffix, finalStatus } = spec;
    const rxNumber = `DEMO-2026-DLV-RX-${suffix}`;
    const billNumber = `DEMO-DLV-MED-2026-${suffix}`;
    const patient = demoPatient(suffix);
    const profile = await prisma.patientProfile.findUniqueOrThrow({ where: { userId: patient.id }, select: { id: true } });
    let prescription = await prisma.prescription.findUnique({ where: { prescriptionNumber: rxNumber }, select: { id: true } });
    if (!prescription) {
      prescription = await prisma.prescription.create({
        data: {
          prescriptionNumber: rxNumber,
          patientId: profile.id,
          prescriberName: 'Demo Prescriber (Fictional)',
          prescriptionDate: today,
          status: 'VERIFIED',
          isOnline: true,
          notes: 'DEMO ONLY — return / reshipment training scenario; not valid for dispensing.',
          createdById: pharmacist.id,
          verifiedById: pharmacist.id,
          verifiedAt: today,
          items: { create: {
            productId: medicine.id,
            quantityPerDose: 1,
            timesPerDay: 1,
            daysSupply: 1,
            calculatedQuantity: 1,
            prescribedQuantity: 1,
            dosageInstructions: 'DEMO ONLY — not for patient use; pharmacist demonstration record.',
            frequency: 'Demo only',
            duration: 'Demo only',
          } },
        },
        select: { id: true },
      });
    }
    let bill = await prisma.paymentRequest.findUnique({ where: { requestNumber: billNumber }, select: { id: true } });
    if (!bill) {
      const item = await prisma.prescriptionItem.findFirstOrThrow({ where: { prescriptionId: prescription.id }, select: { id: true, productId: true } });
      const amount = Number(medicine.sellingPrice);
      bill = await prisma.paymentRequest.create({
        data: {
          requestNumber: billNumber,
          type: 'PRESCRIPTION',
          prescriptionId: prescription.id,
          patientId: patient.id,
          pharmacistId: pharmacist.id,
          cashierId: cashier.id,
          subtotal: amount,
          total: amount,
          amountPaid: amount,
          paymentMethod: 'CASH',
          status: 'PAID',
          paidAt: today,
          acknowledgedRevision: 1,
          customerAcknowledgedAt: today,
          customerPaymentChoice: 'CASH',
          pharmacyNote: `DEMO ONLY — paid medicine bill for ${finalStatus} delivery; standard dispensing workflow will run.`,
          items: { create: { prescriptionItemId: item.id, productId: item.productId, quantity: 1, unitPrice: amount, lineTotal: amount } },
        },
        select: { id: true },
      });
      await prisma.paymentRequestEvent.create({ data: { paymentRequestId: bill.id, revision: 1, actorId: cashier.id, kind: 'PAYMENT_RECEIVED', amount, details: { demoOnly: true, paymentMethod: 'CASH', stage: 'PAID' } } });
    }
    let delivery = await prisma.deliveryRequest.findUnique({ where: { paymentRequestId: bill.id } });
    if (!delivery) {
      delivery = await prisma.deliveryRequest.create({
        data: {
          paymentRequestId: bill.id,
          recipientName: patient.fullName,
          address: `DEMO ONLY — fictional delivery address ${suffix}`,
          phone: `07000000${suffix}`,
          status: 'REQUESTED',
        },
      });
      await prisma.paymentRequestEvent.create({ data: { paymentRequestId: bill.id, revision: 1, actorId: patient.id, kind: 'DELIVERY_REQUESTED', details: { demoOnly: true, deliveryId: delivery.id } } });
    }

    // Hold paid medicine stock before the service dispatches it.
    await prisma.$transaction(async tx => {
      const live = await tx.paymentRequest.findUniqueOrThrow({ where: { id: bill.id }, include: { items: true } });
      await billQuantitiesReserved(tx, live, batchAllocationOrder((await operationSettingsService.get(tx)).allocationMethod));
    });

    const staffUser = { id: pharmacist.id, role: 'PHARMACIST' };
    const deliveryId = bill.id;
    let liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
    if (finalStatus === 'CANCELLED') {
      if (liveDelivery.status === 'REQUESTED') await actDelivery(deliveryId, { action: 'CANCEL', reason: 'DEMO ONLY — customer cancelled before dispatch.' }, staffUser);
    } else {
      if (liveDelivery.status === 'REQUESTED') await actDelivery(deliveryId, { action: 'CONFIRM' }, staffUser);
      liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
      if (liveDelivery.status === 'AWAITING_FEE' && liveDelivery.feePaymentRequestId) {
        let feeBill = await prisma.paymentRequest.findUniqueOrThrow({ where: { id: liveDelivery.feePaymentRequestId }, select: { id: true, requestNumber: true, status: true } });
        const demoFeeNumber = `DEMO-DLV-FEE-2026-${suffix}`;
        if (feeBill.requestNumber !== demoFeeNumber) {
          feeBill = await prisma.paymentRequest.update({ where: { id: feeBill.id }, data: { requestNumber: demoFeeNumber, pharmacyNote: `DEMO ONLY — delivery fee invoice for scenario ${suffix}; no actual payment is due.` }, select: { id: true, requestNumber: true, status: true } });
        }
        if (feeBill.status === 'AWAITING_PAYMENT') await payDemoDeliveryFee(feeBill.id, suffix, cashier.id);
        liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
        if (liveDelivery.status === 'AWAITING_FEE') {
          await actDelivery(deliveryId, { action: 'DISPATCH', courierService: 'Demo Courier', trackingReference: `DEMO-TRACK-2026-${suffix}` }, staffUser);
        }
      }

      liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
      if (finalStatus === 'DELIVERY_FAILED' && liveDelivery.status === 'DISPATCHED') {
        await actDelivery(deliveryId, { action: 'DELIVERY_FAILED', reason: 'DEMO ONLY — courier could not reach the fictional address.' }, staffUser);
      } else if (finalStatus === 'RETURNING' && liveDelivery.status === 'DISPATCHED') {
        await actDelivery(deliveryId, { action: 'RETURNING', reason: 'DEMO ONLY — parcel is on its way back to the pharmacy.' }, staffUser);
      } else if (['RETURNED', 'RESHIP_REQUESTED', 'RESHIP_READY'].includes(finalStatus)) {
        if (liveDelivery.status === 'DISPATCHED') {
          await actDelivery(deliveryId, { action: 'RETURNING', reason: 'DEMO ONLY — parcel returned after delivery could not be completed.' }, staffUser);
          liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
        }
        if (liveDelivery.status === 'RETURNING' || liveDelivery.status === 'DELIVERY_FAILED') {
          await actDelivery(deliveryId, { action: 'RETURNED', reason: 'DEMO ONLY — returned parcel received; pharmacist stock review is required.' }, staffUser);
          liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
        }
        if (finalStatus !== 'RETURNED' && liveDelivery.status === 'RETURNED') {
          await prisma.$transaction(tx => deliveryService.requestReshipment(deliveryId, { id: patient.id, role: 'PATIENT' }, false, tx), { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' });
          liveDelivery = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId } });
        }
        if (finalStatus === 'RESHIP_READY' && liveDelivery.status === 'RESHIP_REQUESTED') {
          await actDelivery(deliveryId, { action: 'APPROVE_RESHIPMENT', inspectionConfirmed: true, reason: 'DEMO ONLY — pharmacist confirmed the same unrefunded parcel contents are eligible for reshipment.' }, staffUser);
        }
      }
    }
    const final = await prisma.deliveryRequest.findUniqueOrThrow({ where: { paymentRequestId: deliveryId }, select: { status: true, trackingReference: true } });
    summaries.push({ invoice: billNumber, requestedStatus: finalStatus, actualStatus: final.status, trackingReference: final.trackingReference });
  }
  return summaries;
};

const createOfflineOrderDemo = async ({ patient, pharmacist, cashier, medicine, retail }) => {
  const rxNumber = 'DEMO-2026-OFFLINE-RX-01';
  let prescription = await prisma.prescription.findUnique({ where: { prescriptionNumber: rxNumber }, select: { id: true } });
  if (!prescription) {
    const profile = await prisma.patientProfile.findUniqueOrThrow({ where: { userId: patient.id }, select: { id: true } });
    prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber: rxNumber,
        patientId: profile.id,
        prescriberTitle: 'Dr.',
        prescriberName: 'Demo Prescriber (Fictional)',
        prescriberReference: 'DEMO-PAPER-001',
        prescriptionDate: today,
        status: 'VERIFIED',
        isOnline: false,
        notes: 'DEMO ONLY — pharmacist transcribed a fictional paper prescription; no upload image is attached. Not valid for dispensing.',
        createdById: pharmacist.id,
        verifiedById: pharmacist.id,
        verifiedAt: today,
        items: { create: {
          productId: medicine.id,
          quantityPerDose: 1,
          timesPerDay: 1,
          daysSupply: 1,
          calculatedQuantity: 1,
          prescribedQuantity: 1,
          dosageInstructions: 'DEMO ONLY — sample label direction; not for patient use.',
          frequency: 'Demo only',
          duration: 'Demo only',
        } },
        retailItems: { create: { productId: retail.id, quantity: 1 } },
      },
      select: { id: true },
    });
  }
  let bill = await prisma.paymentRequest.findUnique({ where: { requestNumber: 'DEMO-OFFLINE-PAY-2026-01' }, select: { id: true, status: true, sale: { select: { invoiceNumber: true } } } });
  if (!bill) {
    const items = await prisma.prescriptionItem.findMany({ where: { prescriptionId: prescription.id }, select: { id: true, productId: true, prescribedQuantity: true } });
    const medicineItem = items[0];
    const medicineAmount = Number(medicine.sellingPrice);
    const retailAmount = Number(retail.sellingPrice);
    const total = Number((medicineAmount + retailAmount).toFixed(2));
    bill = await prisma.paymentRequest.create({
      data: {
        requestNumber: 'DEMO-OFFLINE-PAY-2026-01',
        type: 'PRESCRIPTION',
        prescriptionId: prescription.id,
        patientId: patient.id,
        pharmacistId: pharmacist.id,
        cashierId: cashier.id,
        subtotal: total,
        total,
        amountPaid: total,
        paymentMethod: 'CASH',
        status: 'PAID',
        paidAt: today,
        acknowledgedRevision: 1,
        customerAcknowledgedAt: today,
        customerPaymentChoice: 'CASH',
        pharmacyNote: 'DEMO ONLY — offline pharmacy order with medicine and retail item; paper source was transcribed, no image attached.',
        items: { create: [
          { prescriptionItemId: medicineItem.id, productId: medicineItem.productId, quantity: medicineItem.prescribedQuantity, unitPrice: medicineAmount, lineTotal: medicineAmount },
          { productId: retail.id, quantity: 1, unitPrice: retailAmount, lineTotal: retailAmount },
        ] },
      },
      select: { id: true, status: true, sale: { select: { invoiceNumber: true } } },
    });
    await prisma.paymentRequestEvent.create({
      data: { paymentRequestId: bill.id, revision: 1, actorId: cashier.id, kind: 'PAYMENT_RECEIVED', amount: total, details: { paymentMethod: 'CASH', demoOnly: true, source: 'OFFLINE_PHARMACY_ORDER' } },
    });
  }
  if (bill.status === 'PAID' && !bill.sale) {
    await prisma.$transaction(async tx => {
      const live = await tx.paymentRequest.findUniqueOrThrow({ where: { id: bill.id }, include: { items: true } });
      await billQuantitiesReserved(tx, live, batchAllocationOrder((await operationSettingsService.get(tx)).allocationMethod));
    }, { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' });
    const result = await prisma.$transaction(tx => performPrescriptionDispense(tx, {
      prescriptionId: prescription.id,
      paymentRequestId: bill.id,
      performedById: pharmacist.id,
      notes: 'DEMO ONLY — offline order completed through the normal payment and dispensing flow.',
    }), { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' });
    return { prescription: rxNumber, bill: 'DEMO-OFFLINE-PAY-2026-01', status: 'FULFILLED', sale: result.invoiceNumber, attachment: 'No uploaded image; transcribed from fictional paper source.' };
  }
  const finalBill = await prisma.paymentRequest.findUniqueOrThrow({ where: { id: bill.id }, select: { status: true, sale: { select: { invoiceNumber: true } } } });
  return { prescription: rxNumber, bill: 'DEMO-OFFLINE-PAY-2026-01', status: finalBill.status, sale: finalBill.sale?.invoiceNumber || null, attachment: 'No uploaded image; transcribed from fictional paper source.' };
};

const createPartiallyDispensedDemo = async ({ patient, pharmacist, cashier }) => {
  const rxNumber = 'DEMO-2026-PARTIAL-RX-01';
  const billNumber = 'DEMO-PARTIAL-PAY-2026-01';
  const submissionKey = 'demo-partial-rx-2026-01';
  const sourceImage = await fs.readFile(path.join(imageDir, 'final-25/MediFlow_Demo_001.png'));
  const productSpecs = [
    { name: 'Paracetamol', brandName: 'Panadol', strength: '500 mg', qty: 12, perDose: 1, times: 4, days: 3,
      instructions: 'Take 1 tablet every 6 hours only if needed for pain or fever, for up to 3 days. Maximum 4 tablets in 24 hours. Do not combine with other paracetamol.' },
    { name: 'Cetirizine Dihydrochloride', brandName: 'Zyrtec', strength: '10 mg', qty: 5, perDose: 1, times: 1, days: 5,
      instructions: 'Take 1 tablet at night once daily for 5 days. May cause drowsiness.' },
    { name: 'Omeprazole', brandName: 'Losec SPMC', strength: '20 mg', qty: 14, perDose: 1, times: 1, days: 14,
      instructions: 'Take 1 capsule every morning before food for 14 days. Swallow whole.' },
  ];
  const products = [];
  for (const spec of productSpecs) {
    const product = await prisma.product.findFirst({
      where: { active: true, productType: 'MEDICINE', genericName: spec.name, brandName: spec.brandName, strength: spec.strength },
      select: { id: true, genericName: true, strength: true, unit: true, sellingPrice: true },
    });
    if (!product) throw new Error(`Missing product for linked demo prescription image: ${spec.name} ${spec.strength}.`);
    products.push({ ...spec, product });
  }

  let upload = await prisma.prescriptionUpload.findUnique({ where: { patientId_submissionKey: { patientId: patient.id, submissionKey } } });
  if (!upload) {
    upload = await prisma.prescriptionUpload.create({
      data: {
        patientId: patient.id,
        originalName: 'DEMO ONLY - MediFlow_Demo_001.png',
        mimeType: 'image/png',
        fileData: sourceImage,
        patientNote: 'DEMO ONLY — fictional prescription image linked to a partial-dispensing workflow. Not valid for dispensing.',
        prepareRequested: true,
        orderedForSelf: true,
        status: 'READY_TO_PREPARE',
        availabilityNotes: 'DEMO ONLY — customer accepted the sample quotation and payment was simulated for this workflow.',
        estimatedTotal: 193.5,
        quoteRevision: 1,
        acknowledgedQuoteRevision: 1,
        quoteSentAt: new Date(today.getTime() - 120_000),
        quoteAcknowledgedAt: new Date(today.getTime() - 60_000),
        reviewedById: pharmacist.id,
        reviewedAt: new Date(today.getTime() - 90_000),
        deleteAt: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        submissionKey,
        submissionHash: crypto.createHash('sha256').update(sourceImage).digest('hex'),
      },
    });
  }

  let prescription = await prisma.prescription.findUnique({ where: { prescriptionNumber: rxNumber }, select: { id: true, sourceUploadId: true, status: true } });
  if (!prescription) {
    prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber: rxNumber,
        patientId: (await prisma.patientProfile.findUniqueOrThrow({ where: { userId: patient.id }, select: { id: true } })).id,
        sourceUploadId: upload.id,
        isOnline: true,
        prescriberTitle: 'Dr.',
        prescriberName: 'Demo Prescriber (Fictional)',
        prescriberReference: 'DEMO-PARTIAL-001',
        prescriptionDate: today,
        status: 'VERIFIED',
        notes: 'DEMO ONLY — partial supply example linked to the fictional uploaded source. Not valid for patient care.',
        createdById: pharmacist.id,
        verifiedById: pharmacist.id,
        verifiedAt: today,
        items: { create: products.map(spec => ({
          productId: spec.product.id,
          quantityPerDose: spec.perDose,
          timesPerDay: spec.times,
          daysSupply: spec.days,
          calculatedQuantity: spec.qty,
          prescribedQuantity: spec.qty,
          dosageInstructions: spec.instructions,
          frequency: `${spec.times} time(s) daily`,
          duration: `${spec.days} days`,
        })) },
      },
      select: { id: true, sourceUploadId: true, status: true },
    });
  } else if (prescription.sourceUploadId !== upload.id) {
    throw new Error(`${rxNumber} already exists without the expected linked image; refusing to silently reassign its source.`);
  }

  let bill = await prisma.paymentRequest.findUnique({ where: { requestNumber: billNumber }, select: { id: true, status: true, prescriptionId: true, sale: { select: { invoiceNumber: true } } } });
  if (!bill) {
    const rxItems = await prisma.prescriptionItem.findMany({ where: { prescriptionId: prescription.id }, orderBy: { id: 'asc' }, select: { id: true, productId: true } });
    // The example invoice supplies only part of the first medicine and all of
    // the second; omitting the third item illustrates “not supplied” clearly.
    const billLines = [
      { item: rxItems[0], product: products[0], quantity: 4 },
      { item: rxItems[1], product: products[1], quantity: 5 },
    ];
    const total = Number(billLines.reduce((sum, row) => sum + Number(row.product.product.sellingPrice) * row.quantity, 0).toFixed(2));
    bill = await prisma.paymentRequest.create({
      data: {
        requestNumber: billNumber,
        type: 'PRESCRIPTION',
        prescriptionId: prescription.id,
        patientId: patient.id,
        pharmacistId: pharmacist.id,
        cashierId: cashier.id,
        subtotal: total,
        total,
        amountPaid: total,
        paymentMethod: 'CASH',
        status: 'PAID',
        paidAt: today,
        acknowledgedRevision: 1,
        customerAcknowledgedAt: today,
        customerPaymentChoice: 'CASH',
        pharmacyNote: 'DEMO ONLY — simulated payment for a partial supply; omitted/cancelled quantities are not charged.',
        items: { create: billLines.map(row => ({
          prescriptionItemId: row.item.id,
          productId: row.item.productId,
          quantity: row.quantity,
          unitPrice: row.product.product.sellingPrice,
          lineTotal: Number((Number(row.product.product.sellingPrice) * row.quantity).toFixed(2)),
        })) },
      },
      select: { id: true, status: true, prescriptionId: true, sale: { select: { invoiceNumber: true } } },
    });
    await prisma.paymentRequestEvent.create({
      data: { paymentRequestId: bill.id, revision: 1, actorId: cashier.id, kind: 'PAYMENT_RECEIVED', amount: total, details: { demoOnly: true, paymentMethod: 'CASH', stage: 'PAID', partialSupply: true } },
    });
  }

  if (bill.prescriptionId !== prescription.id) throw new Error(`${billNumber} is linked to a different prescription; refusing to dispense.`);
  if (bill.status === 'PAID' && !bill.sale) {
    await prisma.$transaction(async tx => {
      const live = await tx.paymentRequest.findUniqueOrThrow({ where: { id: bill.id }, include: { items: true } });
      await billQuantitiesReserved(tx, live, batchAllocationOrder((await operationSettingsService.get(tx)).allocationMethod));
    }, { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' });
    await prisma.$transaction(tx => performPrescriptionDispense(tx, {
      prescriptionId: prescription.id,
      paymentRequestId: bill.id,
      performedById: pharmacist.id,
      notes: 'DEMO ONLY — partially dispensed using the standard cashier payment, stock reservation and dispensing workflow.',
    }), { maxWait: 15000, timeout: 30000, isolationLevel: 'Serializable' });
  }

  const finalRecord = await prisma.prescription.findUniqueOrThrow({
    where: { id: prescription.id },
    include: { items: { include: { product: { select: { genericName: true, strength: true, unit: true } } } }, paymentRequest: { select: { requestNumber: true, status: true, sale: { select: { invoiceNumber: true } } } } },
  });
  if (finalRecord.status !== 'PARTIALLY_DISPENSED') throw new Error(`${rxNumber} did not reach PARTIALLY_DISPENSED; observed ${finalRecord.status}.`);
  return {
    prescription: rxNumber,
    sourceImage: 'MediFlow_Demo_001.png',
    linkedUploadId: upload.id,
    status: finalRecord.status,
    invoice: finalRecord.paymentRequest?.requestNumber,
    invoiceStatus: finalRecord.paymentRequest?.status,
    saleInvoice: finalRecord.paymentRequest?.sale?.invoiceNumber,
    quantities: finalRecord.items.map(item => ({ medicine: `${item.product.genericName} ${item.product.strength}`, prescribed: Number(item.prescribedQuantity), dispensed: Number(item.dispensedQuantity), cancelled: Number(item.cancelledQuantity), notSupplied: Number(item.prescribedQuantity) - Number(item.dispensedQuantity) - Number(item.cancelledQuantity) })),
  };
};

const attachMissingDemoPrescriptionImages = async pharmacist => {
  const demoPrescriptions = await prisma.prescription.findMany({
    where: { prescriptionNumber: { startsWith: 'DEMO-' }, isOnline: true },
    include: { patient: { include: { user: true } }, items: { include: { product: { select: { genericName: true, strength: true, unit: true } } } }, paymentRequest: { select: { status: true, total: true } } },
    orderBy: { prescriptionNumber: 'asc' },
  });
  const linked = [];
  for (const prescription of demoPrescriptions) {
    const imageName = `${prescription.prescriptionNumber.replaceAll(/[^A-Za-z0-9_-]/g, '_')}.png`;
    const fileData = await fs.readFile(path.join(imageDir, 'missing-demo-records', imageName));
    const requestStatus = prescription.paymentRequest?.status;
    let status = 'AVAILABLE';
    if (prescription.status === 'PENDING') status = 'PENDING';
    else if (prescription.status === 'REJECTED') status = 'REJECTED';
    else if (['AWAITING_PAYMENT', 'SLIP_SUBMITTED'].includes(requestStatus)) status = requestStatus === 'SLIP_SUBMITTED' ? 'PAYMENT_SUBMITTED' : 'PAYMENT_PENDING';
    else if (['PAID', 'FULFILLED'].includes(requestStatus)) status = 'READY_TO_PREPARE';
    const note = prescription.status === 'CANCELLED'
      ? 'DEMO ONLY — the linked prescription was cancelled. No active order or stock reservation remains.'
      : prescription.status === 'REJECTED'
        ? prescription.rejectionReason || 'DEMO ONLY — pharmacist rejected this fictional prescription.'
        : prescription.status === 'VERIFIED' && !prescription.paymentRequest
          ? 'DEMO ONLY — availability was reviewed; the final cashier bill still needs to be created.'
          : status === 'PENDING'
            ? null
            : `DEMO ONLY — fictional source linked to ${prescription.status.replaceAll('_', ' ').toLowerCase()} prescription workflow.`;
    const submissionKey = `demo-img-${prescription.prescriptionNumber.replace(/^DEMO-2026-/, '')}`;
    let upload = null;
    if (prescription.sourceUploadId) {
      const linkedUpload = await prisma.prescriptionUpload.findUnique({ where: { id: prescription.sourceUploadId }, select: { id: true, submissionKey: true, originalName: true } });
      if (!linkedUpload || (linkedUpload.submissionKey !== submissionKey && linkedUpload.originalName !== `DEMO ONLY - ${imageName}`)) {
        linked.push({ prescription: prescription.prescriptionNumber, skipped: 'Already linked to a non-demo customer upload; left unchanged.' });
        continue;
      }
      upload = linkedUpload;
    } else {
      upload = await prisma.prescriptionUpload.findUnique({ where: { patientId_submissionKey: { patientId: prescription.patient.user.id, submissionKey } }, select: { id: true, submissionKey: true, originalName: true } });
    }
    const uploadData = {
      status,
      availabilityNotes: note,
      estimatedTotal: prescription.paymentRequest?.total ?? null,
      reviewedById: status === 'PENDING' ? null : pharmacist.id,
      reviewedAt: status === 'PENDING' ? null : prescription.verifiedAt || today,
    };
    if (!upload) {
      upload = await prisma.prescriptionUpload.create({
        data: {
          patientId: prescription.patient.user.id,
          originalName: `DEMO ONLY - ${imageName}`,
          mimeType: 'image/png',
          fileData,
          patientNote: `DEMO ONLY — fictional source image for ${prescription.prescriptionNumber}. Not valid for dispensing.`,
          prepareRequested: true,
          orderedForSelf: true,
          ...uploadData,
          deleteAt: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
          submissionKey,
          submissionHash: crypto.createHash('sha256').update(fileData).digest('hex'),
        },
        select: { id: true },
      });
    } else {
      await prisma.prescriptionUpload.update({ where: { id: upload.id }, data: uploadData });
    }
    const claimed = await prisma.prescription.updateMany({ where: { id: prescription.id, sourceUploadId: null }, data: { sourceUploadId: upload.id } });
    linked.push({ prescription: prescription.prescriptionNumber, image: imageName, uploadId: upload.id, prescriptionStatus: prescription.status, uploadStatus: status, linkedNow: claimed.count === 1 });
  }
  return linked;
};
const states = [
  { status: 'PENDING', note: 'DEMO ONLY — awaiting pharmacist review.' },
  { status: 'AVAILABLE', note: 'DEMO ONLY — requested items shown as available for demonstration.' , total: 860 },
  { status: 'PARTIALLY_AVAILABLE', note: 'DEMO ONLY — one sample item unavailable; contact patient before processing.', total: 540 },
  { status: 'UNAVAILABLE', note: 'DEMO ONLY — sample availability review; no order has been prepared.' },
  { status: 'REJECTED', note: 'DEMO ONLY — sample rejection; see reason before any action.' },
  { status: 'QUOTE_SENT', note: 'DEMO ONLY — rough estimate sent; awaiting customer decision.', total: 1240, quote: 'sent' },
  { status: 'QUOTE_ACCEPTED', note: 'DEMO ONLY — customer accepted the rough estimate; final invoice still required.', total: 1240, quote: 'accepted' },
];

try {
  const pharmacistEmail = 'pharmacy.mediflow+demopharmacist@gmail.com';
  const cashierEmail = 'pharmacy.mediflow+democashier@gmail.com';
  const staff = {};
  for (const [role, email, name] of [
    ['PHARMACIST', pharmacistEmail, 'Demo Pharmacist'],
    ['CASHIER', cashierEmail, 'Demo Cashier'],
  ]) {
    staff[role] = await prisma.user.upsert({
      where: { email },
      update: { fullName: name, role, active: true, passwordHash, mustChangePassword: false },
      create: { email, fullName: name, role, active: true, passwordHash, mustChangePassword: false },
    });
  }
  const firstPatient = await prisma.user.upsert({
    where: { email: 'pharmacy.mediflow+patient1@gmail.com' },
    update: { fullName: 'Demo Patient One', role: 'PATIENT', active: true, passwordHash, mustChangePassword: false },
    create: { email: 'pharmacy.mediflow+patient1@gmail.com', fullName: 'Demo Patient One', role: 'PATIENT', active: true, passwordHash, mustChangePassword: false },
  });
  if (!(await prisma.patientProfile.findUnique({ where: { userId: firstPatient.id }, select: { id: true } }))) {
    await prisma.patientProfile.create({ data: {
      userId: firstPatient.id,
      patientNumber: `PAT-DEMO-WF-${String(firstPatient.id).padStart(6, '0')}`,
      dateOfBirth: new Date('1992-06-15T00:00:00Z'),
      registrationSource: 'ADMIN',
    } });
  }
  const patients = [firstPatient];
  for (const spec of patientSpecs) {
    const user = await prisma.user.upsert({
      where: { email: spec.email },
      update: { fullName: spec.name, role: 'PATIENT', active: true, passwordHash, mustChangePassword: false },
      create: { email: spec.email, fullName: spec.name, role: 'PATIENT', active: true, passwordHash, mustChangePassword: false },
    });
    await prisma.patientProfile.upsert({
      where: { userId: user.id },
      update: { patientNumber: spec.patientNumber, dateOfBirth: new Date('1995-06-15T00:00:00Z') },
      create: { userId: user.id, patientNumber: spec.patientNumber, dateOfBirth: new Date('1995-06-15T00:00:00Z'), registrationSource: 'ADMIN' },
    });
    patients.push(user);
  }

  let addedUploads = 0;
  for (let index = 0; index < states.length; index++) {
    const imagePath = path.join(imageDir, images[index][0]);
    const data = await fs.readFile(imagePath);
    const patient = patients[index];
    const submissionKey = `demo-rx-2026-${String(index + 1).padStart(2, '0')}`;
    const existing = await prisma.prescriptionUpload.findUnique({ where: { patientId_submissionKey: { patientId: patient.id, submissionKey } }, select: { id: true } });
    if (existing) continue;
    const state = states[index];
    const reviewed = state.status !== 'PENDING';
    const quoteSentAt = state.quote ? new Date(today.getTime() - 60_000) : null;
    await prisma.prescriptionUpload.create({
      data: {
        patientId: patient.id,
        originalName: `DEMO ONLY - ${path.basename(images[index][0])}`,
        mimeType: 'image/png',
        fileData: data,
        patientNote: `DEMO ONLY — fictitious training sample ${index + 1}. Not a valid prescription; pharmacist review required.`,
        prepareRequested: index % 2 === 0,
        orderedForSelf: true,
        status: state.status,
        availabilityNotes: reviewed ? state.note : null,
        estimatedTotal: state.total ?? null,
        reviewedById: reviewed ? staff.PHARMACIST.id : null,
        reviewedAt: reviewed ? new Date(today.getTime() - 30_000) : null,
        quoteRevision: state.quote ? 1 : 0,
        acknowledgedQuoteRevision: state.quote === 'accepted' ? 1 : null,
        quoteSentAt,
        quoteAcknowledgedAt: state.quote === 'accepted' ? new Date(today.getTime() - 30_000) : null,
        deleteAt: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        submissionKey,
        submissionHash: crypto.createHash('sha256').update(data).digest('hex'),
      },
    });
    addedUploads++;
  }
  const demoMedicine = await prisma.product.findFirst({
    // The linked DEMO-2026-RX and DLV source images show paracetamol syrup by bottle.
    // Select that exact kind of product so the recorded 1/5 bottle quantities match them.
    where: { active: true, productType: 'MEDICINE', prescriptionRequired: true, genericName: { contains: 'Paracetamol' }, dosageForm: { contains: 'syrup' }, unit: { contains: 'bottle' } },
    select: { id: true, sellingPrice: true },
  });
  if (!demoMedicine) throw new Error('No active prescription medicine is available for the demo prescription records.');
  const prescriptionStates = [
    { number: 'DEMO-2026-RX-01', status: 'PENDING', patientIndex: 0 },
    { number: 'DEMO-2026-RX-02', status: 'VERIFIED', patientIndex: 1 },
    { number: 'DEMO-2026-RX-03', status: 'REJECTED', patientIndex: 2, rejectionReason: 'DEMO ONLY — sample review rejection.' },
    { number: 'DEMO-2026-RX-04', status: 'CANCELLED', patientIndex: 3, notes: 'DEMO ONLY — sample cancellation.' },
  ];
  let addedPrescriptions = 0;
  for (const sample of prescriptionStates) {
    if (await prisma.prescription.findUnique({ where: { prescriptionNumber: sample.number }, select: { id: true } })) continue;
    const profile = await prisma.patientProfile.findUniqueOrThrow({ where: { userId: patients[sample.patientIndex].id }, select: { id: true } });
    const verified = sample.status === 'VERIFIED';
    await prisma.prescription.create({
      data: {
        prescriptionNumber: sample.number,
        patientId: profile.id,
        prescriberName: 'Demo Prescriber (Fictional)',
        prescriptionDate: today,
        status: sample.status,
        rejectionReason: sample.rejectionReason,
        notes: sample.notes || 'DEMO ONLY — fictional training record; not valid for dispensing.',
        isOnline: true,
        createdById: staff.PHARMACIST.id,
        verifiedById: verified ? staff.PHARMACIST.id : null,
        verifiedAt: verified ? today : null,
        items: {
          create: {
            productId: demoMedicine.id,
            quantityPerDose: 1,
            timesPerDay: 1,
            daysSupply: 5,
            calculatedQuantity: 5,
            prescribedQuantity: 5,
            dosageInstructions: 'DEMO ONLY — sample directions; pharmacist must verify. Not for patient use.',
            frequency: 'Once daily',
            duration: '5 days',
          },
        },
      },
    });
    addedPrescriptions++;
  }

  // Seed clearly labelled payment and delivery snapshots for demonstrations.
  // These examples are deliberately recorded without stock reservations, sales,
  // or stock movements, so they cannot change live inventory or sales totals.
  const retailProduct = await prisma.product.findFirst({
    where: { active: true, productType: 'NON_MEDICINAL', prescriptionRequired: false },
    select: { id: true, genericName: true, sellingPrice: true },
    orderBy: { genericName: 'asc' },
  });
  if (!retailProduct) throw new Error('No active non-medicinal product is available for the demo payment examples.');
  const demoPaymentStages = [
    { suffix: 'AWAITING', status: 'AWAITING_PAYMENT', patient: patients[4], paymentChoice: 'CASH' },
    { suffix: 'SLIP', status: 'SLIP_SUBMITTED', patient: patients[5], paymentChoice: 'BANK_TRANSFER' },
    { suffix: 'PAID', status: 'PAID', patient: patients[6], paymentChoice: 'BANK_TRANSFER' },
    { suffix: 'CANCELLED', status: 'CANCELLED', patient: patients[3], paymentChoice: 'CASH' },
  ];
  let addedPaymentDemos = 0;
  for (const [index, sample] of demoPaymentStages.entries()) {
    const requestNumber = `DEMO-PAY-2026-${sample.suffix}`;
    let bill = await prisma.paymentRequest.findUnique({ where: { requestNumber }, select: { id: true } });
    if (bill) continue;
    const amount = Number(retailProduct.sellingPrice);
    bill = await prisma.paymentRequest.create({
      data: {
        requestNumber,
        type: 'RETAIL',
        patientId: sample.patient.id,
        pharmacistId: staff.PHARMACIST.id,
        cashierId: sample.status === 'PAID' ? staff.CASHIER.id : null,
        subtotal: amount,
        total: amount,
        amountPaid: sample.status === 'PAID' ? amount : 0,
        paymentMethod: sample.status === 'PAID' ? 'BANK_TRANSFER' : null,
        paymentReference: sample.status === 'PAID' ? 'DEMO-TRANSFER-2026-PAID' : null,
        status: sample.status,
        acknowledgedRevision: 1,
        customerAcknowledgedAt: today,
        customerPaymentChoice: sample.paymentChoice,
        paidAt: sample.status === 'PAID' ? today : null,
        cancellationReason: sample.status === 'CANCELLED' ? 'DEMO ONLY — customer cancellation example.' : null,
        cancelledById: sample.status === 'CANCELLED' ? sample.patient.id : null,
        cancelledAt: sample.status === 'CANCELLED' ? today : null,
        pharmacyNote: `DEMO ONLY — ${sample.status.replaceAll('_', ' ').toLowerCase()} payment example; no stock was reserved or sold.`,
        items: { create: { productId: retailProduct.id, quantity: 1, unitPrice: amount, lineTotal: amount } },
      },
      select: { id: true, total: true, revision: true },
    });
    await prisma.paymentRequestEvent.create({
      data: {
        paymentRequestId: bill.id,
        revision: bill.revision,
        actorId: sample.status === 'PAID' ? staff.CASHIER.id : sample.patient.id,
        kind: sample.status === 'PAID' ? 'PAYMENT_RECEIVED' : sample.status === 'CANCELLED' ? 'CANCELLED' : 'DEMO_PAYMENT_STAGE',
        amount: sample.status === 'PAID' ? bill.total : 0,
        details: { demoOnly: true, stage: sample.status, item: retailProduct.genericName },
      },
    });
    if (sample.status === 'SLIP_SUBMITTED') {
      const safeDemoSlip = Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420"><rect width="100%" height="100%" fill="#f4f8fa"/><rect x="24" y="24" width="672" height="372" rx="18" fill="white" stroke="#0e8076" stroke-width="3"/><text x="56" y="98" font-family="Arial" font-size="28" font-weight="700" fill="#18324b">MediFlow demo transfer slip</text><text x="56" y="160" font-family="Arial" font-size="22" fill="#a83232">DEMO ONLY — NOT A BANK RECEIPT</text><text x="56" y="225" font-family="Arial" font-size="20" fill="#18324b">Reference: DEMO-TRANSFER-2026-SLIP</text><text x="56" y="275" font-family="Arial" font-size="20" fill="#18324b">Amount: Rs. ' + amount.toFixed(2) + '</text><text x="56" y="330" font-family="Arial" font-size="18" fill="#617486">No real transfer was made. Cashier review example.</text></svg>',
      );
      await prisma.paymentSlip.create({
        data: {
          paymentRequestId: bill.id,
          uploadedById: sample.patient.id,
          originalName: 'DEMO ONLY - sample transfer slip.svg',
          mimeType: 'image/svg+xml',
          fileData: safeDemoSlip,
          declaredAmount: bill.total,
          reference: 'DEMO-TRANSFER-2026-SLIP',
          paidOn: today,
          note: 'DEMO ONLY — no actual money was transferred.',
          status: 'PENDING',
        },
      });
    }
    addedPaymentDemos++;
  }

  const deliveryStageNames = ['REQUESTED', 'AWAITING_FEE', 'DISPATCHED', 'DELIVERED'];
  const deliveryResults = [];
  for (const [index, stage] of deliveryStageNames.entries()) {
    const suffix = String(index + 1).padStart(2, '0');
    const rxNumber = `DEMO-2026-DLV-RX-${suffix}`;
    const medicineRequestNumber = `DEMO-DLV-MED-2026-${suffix}`;
    const feeRequestNumber = `DEMO-DLV-FEE-2026-${suffix}`;
    const sourcePatient = patients[index];
    const profile = await prisma.patientProfile.findUniqueOrThrow({ where: { userId: sourcePatient.id }, select: { id: true } });
    let rx = await prisma.prescription.findUnique({ where: { prescriptionNumber: rxNumber }, select: { id: true } });
    if (!rx) {
      rx = await prisma.prescription.create({
        data: {
          prescriptionNumber: rxNumber,
          patientId: profile.id,
          prescriberName: 'Demo Prescriber (Fictional)',
          prescriptionDate: today,
          status: 'VERIFIED',
          isOnline: true,
          notes: 'DEMO ONLY — fictitious delivery workflow; not a valid prescription and not for dispensing.',
          createdById: staff.PHARMACIST.id,
          verifiedById: staff.PHARMACIST.id,
          verifiedAt: today,
          items: {
            create: {
              productId: demoMedicine.id,
              quantityPerDose: 1,
              timesPerDay: 1,
              daysSupply: 1,
              calculatedQuantity: 1,
              prescribedQuantity: 1,
              dosageInstructions: 'DEMO ONLY — not for patient use; pharmacist demonstration record.',
              frequency: 'Demo only',
              duration: 'Demo only',
            },
          },
        },
        select: { id: true },
      });
    }
    let medicineBill = await prisma.paymentRequest.findUnique({ where: { requestNumber: medicineRequestNumber }, select: { id: true, total: true } });
    if (!medicineBill) {
      const item = await prisma.prescriptionItem.findFirstOrThrow({ where: { prescriptionId: rx.id }, select: { id: true, productId: true } });
      const amount = Number(demoMedicine.sellingPrice);
      medicineBill = await prisma.paymentRequest.create({
        data: {
          requestNumber: medicineRequestNumber,
          type: 'PRESCRIPTION',
          prescriptionId: rx.id,
          patientId: sourcePatient.id,
          pharmacistId: staff.PHARMACIST.id,
          cashierId: staff.CASHIER.id,
          subtotal: amount,
          total: amount,
          amountPaid: amount,
          paymentMethod: 'CASH',
          status: 'PAID',
          paidAt: today,
          acknowledgedRevision: 1,
          customerAcknowledgedAt: today,
          customerPaymentChoice: 'CASH',
          pharmacyNote: `DEMO ONLY — paid medicine invoice for ${stage} delivery status; inventory untouched.`,
          items: { create: { prescriptionItemId: item.id, productId: item.productId, quantity: 1, unitPrice: amount, lineTotal: amount } },
        },
        select: { id: true, total: true },
      });
      await prisma.paymentRequestEvent.create({
        data: { paymentRequestId: medicineBill.id, revision: 1, actorId: staff.CASHIER.id, kind: 'PAYMENT_RECEIVED', amount: medicineBill.total, details: { demoOnly: true, stage: 'PAID', inventoryChanged: false } },
      });
    }
    const deliveryExisting = await prisma.deliveryRequest.findUnique({ where: { paymentRequestId: medicineBill.id }, select: { id: true, feePaymentRequestId: true } });
    if (deliveryExisting) {
      if (deliveryExisting.feePaymentRequestId) {
        const feeBill = await prisma.paymentRequest.findUnique({ where: { id: deliveryExisting.feePaymentRequestId }, select: { id: true, requestNumber: true, status: true, patientId: true, pharmacistId: true, cashierId: true, subtotal: true, total: true, amountPaid: true, paymentMethod: true } });
        if (feeBill?.status === 'FULFILLED' && !(await prisma.sale.findUnique({ where: { paymentRequestId: feeBill.id }, select: { id: true } }))) {
          await prisma.sale.create({
            data: {
              invoiceNumber: `INV-DEMO-DLV-FEE-${suffix}`,
              paymentRequestId: feeBill.id,
              patientId: feeBill.patientId,
              pharmacistId: feeBill.pharmacistId,
              cashierId: feeBill.cashierId,
              subtotal: feeBill.subtotal,
              total: feeBill.total,
              amountPaid: feeBill.amountPaid,
              paymentMethod: feeBill.paymentMethod || 'CASH',
              status: 'PAID',
            },
          });
        }
      }
      const eventKinds = stage === 'REQUESTED'
        ? ['DELIVERY_REQUESTED']
        : stage === 'AWAITING_FEE'
          ? ['DELIVERY_REQUESTED', 'DELIVERY_FEE_ISSUED']
          : stage === 'DISPATCHED'
            ? ['DELIVERY_REQUESTED', 'DELIVERY_FEE_ISSUED', 'DELIVERY_DISPATCH']
            : ['DELIVERY_REQUESTED', 'DELIVERY_FEE_ISSUED', 'DELIVERY_DISPATCH', 'DELIVERY_DELIVERED'];
      for (const kind of eventKinds) {
        if (await prisma.paymentRequestEvent.findFirst({ where: { paymentRequestId: medicineBill.id, revision: 1, actorId: staff.PHARMACIST.id, kind }, select: { id: true } })) continue;
        await prisma.paymentRequestEvent.create({
          data: { paymentRequestId: medicineBill.id, revision: 1, actorId: staff.PHARMACIST.id, kind, details: { demoOnly: true, stage, inventoryChanged: false } },
        });
      }
      deliveryResults.push(stage);
      continue;
    }
    let feeBillId = null;
    if (stage !== 'REQUESTED') {
      let feeBill = await prisma.paymentRequest.findUnique({ where: { requestNumber: feeRequestNumber }, select: { id: true, total: true } });
      if (!feeBill) {
        const configuredFee = await prisma.systemSetting.findUnique({ where: { key: 'standardDeliveryFee' }, select: { value: true } });
        const feeAmount = Number(configuredFee?.value || 400);
        const feeIsPaid = stage === 'DISPATCHED' || stage === 'DELIVERED';
        feeBill = await prisma.paymentRequest.create({
          data: {
            requestNumber: feeRequestNumber,
            type: 'RETAIL',
            patientId: sourcePatient.id,
            pharmacistId: staff.PHARMACIST.id,
            cashierId: feeIsPaid ? staff.CASHIER.id : null,
            subtotal: feeAmount,
            total: feeAmount,
            amountPaid: feeIsPaid ? feeAmount : 0,
            paymentMethod: feeIsPaid ? 'CASH' : null,
            status: feeIsPaid ? 'FULFILLED' : 'AWAITING_PAYMENT',
            paidAt: feeIsPaid ? today : null,
            pharmacyNote: 'DEMO ONLY — delivery service fee example; no actual delivery charge collected.',
          },
          select: { id: true, total: true },
        });
        if (feeIsPaid) {
          await prisma.paymentRequestEvent.create({
            data: { paymentRequestId: feeBill.id, revision: 1, actorId: staff.CASHIER.id, kind: 'PAYMENT_RECEIVED', amount: feeBill.total, details: { demoOnly: true, stage: 'PAID', inventoryChanged: false } },
          });
        }
      }
      const feeIsPaid = stage === 'DISPATCHED' || stage === 'DELIVERED';
      if (feeIsPaid && !(await prisma.sale.findUnique({ where: { paymentRequestId: feeBill.id }, select: { id: true } }))) {
        await prisma.sale.create({
          data: {
            invoiceNumber: `INV-DEMO-DLV-FEE-${suffix}`,
            paymentRequestId: feeBill.id,
            patientId: sourcePatient.id,
            pharmacistId: staff.PHARMACIST.id,
            cashierId: staff.CASHIER.id,
            subtotal: feeBill.total,
            total: feeBill.total,
            amountPaid: feeBill.total,
            paymentMethod: 'CASH',
            status: 'PAID',
          },
        });
      }
      feeBillId = feeBill.id;
    }
    const deliveryData = {
      paymentRequestId: medicineBill.id,
      feePaymentRequestId: feeBillId,
      recipientName: sourcePatient.fullName,
      address: `DEMO ONLY — fictional delivery address ${suffix}`,
      phone: `07000000${suffix}`,
      status: stage,
      ...(stage === 'DISPATCHED' || stage === 'DELIVERED' ? {
        courierService: 'Demo Courier',
        trackingReference: `DEMO-TRACK-2026-${suffix}`,
        dispatchedAt: today,
      } : {}),
      ...(stage === 'DELIVERED' ? { deliveredAt: today } : {}),
    };
    const existingDelivery = await prisma.deliveryRequest.findUnique({ where: { paymentRequestId: medicineBill.id }, select: { id: true } });
    if (!existingDelivery) await prisma.deliveryRequest.create({ data: deliveryData });
    const eventKinds = stage === 'REQUESTED'
      ? ['DELIVERY_REQUESTED']
      : stage === 'AWAITING_FEE'
        ? ['DELIVERY_REQUESTED', 'DELIVERY_FEE_ISSUED']
        : stage === 'DISPATCHED'
          ? ['DELIVERY_REQUESTED', 'DELIVERY_FEE_ISSUED', 'DELIVERY_DISPATCH']
          : ['DELIVERY_REQUESTED', 'DELIVERY_FEE_ISSUED', 'DELIVERY_DISPATCH', 'DELIVERY_DELIVERED'];
    for (const kind of eventKinds) {
      if (await prisma.paymentRequestEvent.findFirst({ where: { paymentRequestId: medicineBill.id, revision: 1, actorId: staff.PHARMACIST.id, kind }, select: { id: true } })) continue;
      await prisma.paymentRequestEvent.create({
        data: {
          paymentRequestId: medicineBill.id,
          revision: 1,
          actorId: staff.PHARMACIST.id,
          kind,
          details: { demoOnly: true, stage, feeInvoice: feeRequestNumber, trackingReference: deliveryData.trackingReference || null, inventoryChanged: false },
        },
      });
    }
    deliveryResults.push(stage);
  }

  const stockActions = await reconcileDemoStock(staff.PHARMACIST.id);
  const returnWorkflowStatuses = await createAndProgressReturnDemos({ patients, pharmacist: staff.PHARMACIST, cashier: staff.CASHIER, medicine: demoMedicine });
  const offlineOrder = await createOfflineOrderDemo({ patient: patients[6], pharmacist: staff.PHARMACIST, cashier: staff.CASHIER, medicine: demoMedicine, retail: retailProduct });
  const partialDispense = await createPartiallyDispensedDemo({ patient: patients[0], pharmacist: staff.PHARMACIST, cashier: staff.CASHIER });
  const linkedDemoImages = await attachMissingDemoPrescriptionImages(staff.PHARMACIST);

  const counts = await Promise.all(states.map(async (state) => {
    const count = await prisma.prescriptionUpload.count({
      where: { status: state.status, patient: { email: { startsWith: 'pharmacy.mediflow+patient' } } },
    });
    return { status: state.status, count };
  }));
  const prescriptionCount = await prisma.prescription.count({ where: { prescriptionNumber: { startsWith: 'DEMO-2026-RX-' } } });
  console.log(JSON.stringify({ host: target.host, createdOrUpdatedDemoAccounts: [pharmacistEmail, cashierEmail, 'pharmacy.mediflow+patient1@gmail.com', ...patientSpecs.map((p) => p.email)], uploadRecordsAdded: addedUploads, prescriptionRecordsAdded: addedPrescriptions, demoPrescriptionCount: prescriptionCount, paymentDemosAdded: addedPaymentDemos, deliveryStatuses: deliveryResults, stockActions, returnWorkflowStatuses, offlineOrder, partialDispense, linkedDemoImages, statusCounts: counts, note: 'DEMO ONLY transactions were added. Cash/bank receipts are fictional; stock holds, dispatch, returns and reshipment use the normal workflow services. Returned goods are not restocked automatically.' }));
} finally {
  await prisma.$disconnect();
}
