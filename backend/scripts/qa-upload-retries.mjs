import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { prisma } from '../src/config/prisma.js';
import { prescriptionUploadService } from '../src/services/prescriptionUpload.service.js';
const url = new URL(process.env.AIVEN_PRISMA_URL || process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL);
assert(['localhost', '127.0.0.1', '::1'].includes(url.hostname));
assert(process.argv.includes('--confirm-local'));
const submissionKey = crypto.randomUUID();
let patient;
try {
  patient = await prisma.user.findFirst({ where: { role: 'PATIENT', active: true }, select: { id: true } });
  assert(patient, 'Local patient account required');
  const input = { submissionKey, originalName: `QA-retry-${submissionKey}.txt`, mimeType: 'text/plain', fileBase64: Buffer.from('QA test only. No medicines requested.').toString('base64'), prepareRequested: false, orderedForSelf: true };
  const results = await Promise.all(Array.from({ length: 5 }, () => prescriptionUploadService.create(input, patient.id)));
  assert.equal(new Set(results.map(result => result.id)).size, 1);
  assert.equal(await prisma.prescriptionUpload.count({ where: { patientId: patient.id, submissionKey } }), 1);
  assert.equal((await prescriptionUploadService.create(input, patient.id)).id, results[0].id);
  await assert.rejects(() => prescriptionUploadService.create({ ...input, patientNote: 'Different content' }, patient.id), { statusCode: 409 });
  console.log('PASS: five concurrent submissions and a later retry produce exactly one upload; changed payload is rejected');
} finally {
  if (patient) await prisma.prescriptionUpload.deleteMany({ where: { patientId: patient.id, submissionKey } });
  await prisma.$disconnect();
  console.log('Temporary QA upload removed; existing uploads were not changed.');
}
