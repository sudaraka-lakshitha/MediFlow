import { personNameSchema, optionalPersonNameSchema } from './personName.js';
import { z } from 'zod';
import { notFutureCalendarDate } from './calendar.js';

const item = z.object({
  id: z.coerce.number().int().positive().optional(),
  productId: z.coerce.number().int().positive(), quantityPerDose: z.coerce.number().positive(),
  doseInputAmount: z.coerce.number().positive().optional().nullable(), doseInputUnit: z.string().trim().max(20).optional().nullable(),
  concentrationAmount: z.coerce.number().positive().optional().nullable(), concentrationUnit: z.string().trim().max(20).optional().nullable(),
  concentrationVolume: z.coerce.number().positive().optional().nullable(),
  timesPerDay: z.coerce.number().int().min(1).max(24), daysSupply: z.coerce.number().int().min(1).max(365),
  overrideQuantity: z.coerce.number().positive().optional().nullable(), overrideReason: z.string().trim().max(300).optional().nullable(),
  dosageInstructions: z.string().trim().min(2).max(250), frequency: z.string().trim().max(100).optional().nullable(),
  duration: z.string().trim().max(100).optional().nullable(), notes: z.string().trim().max(300).optional().nullable(),
  administrationRoute: z.string().trim().min(2).max(80).default('Oral'), mealTiming: z.enum(['ANY_TIME', 'BEFORE_FOOD', 'WITH_FOOD', 'AFTER_FOOD', 'EMPTY_STOMACH']).default('ANY_TIME'),
  asNeeded: z.boolean().default(false), specialInstructions: z.string().trim().max(500).optional().nullable(),
}).superRefine((data, context) => {
  if (data.overrideQuantity != null && !data.overrideReason) context.addIssue({ code: 'custom', path: ['overrideReason'], message: 'An override reason is required.' });
  if (data.doseInputUnit && data.doseInputUnit.toLowerCase() !== 'ml' && (!data.doseInputAmount || !data.concentrationAmount || !data.concentrationUnit || !data.concentrationVolume)) context.addIssue({ code: 'custom', path: ['concentrationAmount'], message: 'Dose amount, concentration amount, unit, and volume are required for strength-based liquid doses.' });
});
const retailItem = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().positive().max(1_000_000),
});
const recipientBirthDate = notFutureCalendarDate('Recipient date of birth cannot be in the future.', { earliest: '1895-01-01', earliestMessage: 'Enter a valid recipient date of birth.' });
const prescriptionDate = z.coerce.date()
  .refine((value) => value <= new Date(Date.now() + 5 * 60 * 1000), 'Prescription date and time cannot be in the future.');

export const prescriptionSchema = z.object({
  patientId: z.coerce.number().int().positive(),
  prescriberTitle: z.enum(['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.', 'Rev.']).optional().nullable(),
  prescriberName: personNameSchema,
  sourceUploadId: z.coerce.number().int().positive().optional().nullable(),
  prescriberReference: z.string().trim().max(100).optional().nullable(), prescriptionDate,
  orderedForSelf: z.boolean().default(true), recipientName: optionalPersonNameSchema,
  recipientRelationship: z.string().trim().max(100).optional().nullable(),
  recipientDateOfBirth: recipientBirthDate.optional().nullable(),
  recipientAllergies: z.string().trim().max(500).optional().nullable(),
  recipientConditions: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  pickupNote: z.string().trim().max(500).optional().nullable(),
  plannedPickupAt: z.coerce.date().optional().nullable(),
  items: z.array(item).min(1).max(30),
  retailItems: z.array(retailItem).max(50).default([]),
  refillsAllowed: z.coerce.number().int().min(0).max(12).default(0),
  autoVerify: z.boolean().optional().default(false),
  sendToCashier: z.boolean().optional().default(false),
  couponCode: z.string().trim().max(40).optional().nullable(),
  containerFee: z.coerce.number().nonnegative().optional().default(0),
  tax: z.coerce.number().nonnegative().optional().default(0),
}).superRefine((data,context)=>{
  if(!data.orderedForSelf){if(!data.recipientName)context.addIssue({code:'custom',path:['recipientName'],message:'Recipient name is required.'});if(!data.recipientRelationship)context.addIssue({code:'custom',path:['recipientRelationship'],message:'Relationship is required.'});if(!data.recipientDateOfBirth)context.addIssue({code:'custom',path:['recipientDateOfBirth'],message:'Recipient date of birth is required for medicine age checks.'})}
  if(new Set(data.retailItems.map((retail)=>retail.productId)).size!==data.retailItems.length)context.addIssue({code:'custom',path:['retailItems'],message:'Each retail item can appear only once.'});
});
export const refillSchema = z.object({ notes: z.string().trim().max(1000).optional().nullable() });
export const pickupDetailsSchema = z.object({
  pickupNote: z.string().trim().max(500).nullable().optional(),
  plannedPickupAt: z.coerce.date().nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Provide at least one pickup detail.');
export const rejectSchema = z.object({ reason: z.string().trim().min(3).max(500) });
const dispensingBase = {
  revision: z.coerce.number().int().positive().optional(),
  revisionReason: z.string().trim().max(500).optional().nullable(),
  items: z.array(z.object({ prescriptionItemId: z.coerce.number().int().positive(), quantity: z.coerce.number().positive() })),
  retailItems: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().positive() })).max(50).default([]),
  notes: z.string().trim().max(500).optional().nullable(), couponCode: z.string().trim().max(40).optional().nullable(),
  containerFee: z.coerce.number().nonnegative().max(100_000_000).default(0),
  tax: z.coerce.number().nonnegative().default(0),
  reservationHours: z.coerce.number().int().min(1).max(168).optional().nullable(),
  // Walk-in partial supply: why less is issued, and whether the rest is issued later.
  partialSupply: z.array(z.object({
    prescriptionItemId: z.coerce.number().int().positive(),
    reason: z.enum(['OUT_OF_STOCK', 'CANNOT_AFFORD', 'CUSTOMER_REQUEST']),
    issueLater: z.boolean(),
  })).max(100).default([]),
};
const uniqueItems = (data) => new Set(data.items.map((itemValue) => itemValue.prescriptionItemId)).size === data.items.length;
const hasItems = (data) => data.items.length + data.retailItems.length > 0;
const uniqueRetailItems = (data) => new Set(data.retailItems.map((itemValue) => itemValue.productId)).size === data.retailItems.length;
export const paymentRequestSchema = z.object(dispensingBase)
  .refine(hasItems, { path: ['items'], message: 'At least one medicine or retail item is required.' })
  .refine(uniqueItems, { path: ['items'], message: 'Each prescription item can appear only once.' })
  .refine(uniqueRetailItems, { path: ['retailItems'], message: 'Each retail item can appear only once.' });
export const dispenseQuoteSchema = z.object({
  ...dispensingBase,
  amountPaid: z.coerce.number().nonnegative().default(0),
  paymentMethod: z.enum(['CASH', 'CARD', 'OTHER']).default('CASH'),
})
  .refine(hasItems, { path: ['items'], message: 'At least one medicine or retail item is required.' })
  .refine(uniqueItems, { path: ['items'], message: 'Each prescription item can appear only once.' })
  .refine(uniqueRetailItems, { path: ['retailItems'], message: 'Each retail item can appear only once.' });
export const dispenseSchema = z.object({
  ...dispensingBase, amountPaid: z.coerce.number().nonnegative().default(0),
  paymentMethod: z.enum(['CASH', 'CARD', 'OTHER']).default('CASH'),
  paymentRequestId: z.coerce.number().int().positive().optional().nullable(),
  pickupPin: z.string().regex(/^\d{6}$/, 'Enter the six-digit PIN from the paid receipt.').optional().nullable(),
})
  .refine(hasItems, { path: ['items'], message: 'At least one medicine or retail item is required.' })
  .refine(uniqueItems, { path: ['items'], message: 'Each prescription item can appear only once.' })
  .refine(uniqueRetailItems, { path: ['retailItems'], message: 'Each retail item can appear only once.' });
