import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { parseCsv } from '../src/utils/csvParse.js';
import { normalizeDrugName } from '../src/utils/drug.js';

const prisma = new PrismaClient();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/ddinter');
const severityRank = { Unknown: 0, Minor: 1, Moderate: 2, Major: 3 };
const files = (await fs.readdir(root)).filter((name) => name.endsWith('.csv'));
const concepts = new Map(); const pairs = new Map();

for (const file of files) {
  const rows = parseCsv(await fs.readFile(path.join(root, file), 'utf8')).slice(1);
  for (const [idA, displayA, idB, displayB, rawLevel] of rows) {
    const nameA = normalizeDrugName(displayA); const nameB = normalizeDrugName(displayB);
    if (!nameA || !nameB || nameA === nameB) continue;
    concepts.set(nameA, { normalizedName: nameA, displayName: displayA.trim(), ddinterId: idA.trim() });
    concepts.set(nameB, { normalizedName: nameB, displayName: displayB.trim(), ddinterId: idB.trim() });
    const [first, second] = nameA < nameB ? [nameA, nameB] : [nameB, nameA];
    const level = ['Major', 'Moderate', 'Minor'].includes(rawLevel?.trim()) ? rawLevel.trim() : 'Unknown';
    const key = `${first}|${second}`; const current = pairs.get(key);
    if (!current || severityRank[level] > severityRank[current.level]) pairs.set(key, { first, second, level });
  }
}

console.log(`Parsed ${concepts.size} drugs and ${pairs.size} unique interaction pairs from ${files.length} DDInter files.`);
await prisma.drugConcept.createMany({ data: [...concepts.values()], skipDuplicates: true });
for (const concept of concepts.values()) {
  await prisma.drugConcept.update({ where: { normalizedName: concept.normalizedName }, data: { displayName: concept.displayName, ddinterId: concept.ddinterId } });
}
const stored = await prisma.drugConcept.findMany({ select: { id: true, normalizedName: true } });
const ids = new Map(stored.map((concept) => [concept.normalizedName, concept.id]));
const interactionRows = [...pairs.values()].map((pair) => {
  const firstId = ids.get(pair.first); const secondId = ids.get(pair.second);
  return {
    drugAId: Math.min(firstId, secondId), drugBId: Math.max(firstId, secondId), severity: pair.level.toUpperCase(),
    source: 'DDInter', sourceUrl: 'https://ddinter.scbdd.com/inter-checker/', version: 'downloaded-2026-07-15',
    description: `DDInter reports a ${pair.level.toLowerCase()} interaction for this drug pair.`,
    management: 'Review the cited interaction source and patient-specific factors before verifying or dispensing.',
  };
});
for (let index = 0; index < interactionRows.length; index += 1000) {
  await prisma.drugInteraction.createMany({ data: interactionRows.slice(index, index + 1000), skipDuplicates: true });
}
const products = await prisma.product.findMany({ select: { id: true, activeIngredient: true, genericName: true } });
let linked = 0;
for (const product of products) {
  const conceptId = ids.get(normalizeDrugName(product.activeIngredient || product.genericName));
  if (conceptId) { await prisma.product.update({ where: { id: product.id }, data: { drugConceptId: conceptId } }); linked += 1; }
}
console.log(`Imported ${interactionRows.length} interactions and linked ${linked}/${products.length} catalogue products.`);
await prisma.$disconnect();
