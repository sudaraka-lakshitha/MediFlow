import { z } from 'zod';

const optionalAge = z.preprocess((value) => value === '' || value == null ? null : value, z.coerce.number().int().min(0).max(130).nullable());

export const categorySchema = z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(300).optional().nullable() });
export const supplierSchema = z.object({
  name: z.string().trim().min(2).max(150), contactPerson: z.string().trim().max(150).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(), email: z.string().email().max(190).optional().nullable().or(z.literal('')),
  address: z.string().trim().max(300).optional().nullable(),
});
export const productSchema = z.object({
  sku: z.string().trim().min(2).max(40), productType: z.enum(['MEDICINE', 'NON_MEDICINAL']).default('MEDICINE'), genericName: z.string().trim().min(2).max(150),
  brandName: z.string().trim().max(150).optional().nullable(), strength: z.string().trim().max(80).optional().default(''),
  dosageForm: z.string().trim().max(80).optional().default(''), unit: z.string().trim().min(1).max(40),
  manufacturerId: z.coerce.number().int().positive().optional().nullable(), activeIngredient: z.string().trim().max(180).optional().nullable(),
  variantGroup: z.string().trim().max(100).optional().nullable(), barcode: z.string().trim().max(80).optional().nullable().or(z.literal('')),
  rxNormCui: z.string().trim().max(30).optional().nullable(), pubchemCid: z.coerce.number().int().positive().max(2147483647).optional().nullable(),
  smiles: z.string().trim().max(2000).optional().nullable(), storageInstructions: z.string().trim().max(300).optional().nullable(), sellingPrice: z.coerce.number().nonnegative().max(9999999999.99).multipleOf(0.01),
  reorderLevel: z.coerce.number().int().nonnegative().max(2147483647), prescriptionRequired: z.boolean().default(true),
  minimumAgeYears: optionalAge.optional(),
  maximumAgeYears: optionalAge.optional(),
  categoryId: z.coerce.number().int().positive(),
}).superRefine((data, context) => {
  if (data.productType === 'MEDICINE' && !data.strength) context.addIssue({ code: 'custom', path: ['strength'], message: 'Strength is required for medicines.' });
  if (data.productType === 'MEDICINE' && !data.dosageForm) context.addIssue({ code: 'custom', path: ['dosageForm'], message: 'Dosage form is required for medicines.' });
  if (data.productType === 'NON_MEDICINAL' && data.prescriptionRequired) context.addIssue({ code: 'custom', path: ['prescriptionRequired'], message: 'Non-medicinal items cannot require a prescription.' });
  if (data.minimumAgeYears != null && data.maximumAgeYears != null && data.minimumAgeYears > data.maximumAgeYears) context.addIssue({ code: 'custom', path: ['maximumAgeYears'], message: 'Maximum age must be greater than or equal to minimum age.' });
});

export const manufacturerSchema = z.object({
  name: z.string().trim().min(2).max(150), country: z.string().trim().max(100).optional().nullable(),
  website: z.string().url().max(250).optional().nullable().or(z.literal('')), phone: z.string().trim().max(40).optional().nullable(),
  email: z.string().email().max(190).optional().nullable().or(z.literal('')),
});

export const bulkProductsSchema = z.object({
  dryRun: z.boolean().default(true),
  previewToken: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  fileName: z.string().trim().max(180).optional(),
  rows: z.array(z.record(z.string(), z.unknown())).min(1).max(2000),
}).refine((data) => data.dryRun || Boolean(data.previewToken), { path: ['previewToken'], message: 'Validate the file before applying changes.' });
