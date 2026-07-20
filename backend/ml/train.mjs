import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv } from '../src/utils/csvParse.js';
import { normalizeDrugName } from '../src/utils/drug.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(directory, '../data/ddinter');
const outputPath = path.join(directory, 'model.json');
const dimensions = 12; const hiddenOne = 20; const hiddenTwo = 10;
let randomState = 20260715;
const random = () => { randomState = (1664525 * randomState + 1013904223) >>> 0; return randomState / 4294967296; };
const randomWeight = (scale = 0.08) => (random() * 2 - 1) * scale;
const sigmoid = (value) => 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, value))));
const activate = (value) => value >= 0 ? value : value * 0.1;
const activationDerivative = (value) => value >= 0 ? 1 : 0.1;
const shuffled = (values) => { const result = [...values]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };

const positiveNames = new Set(); const drugNames = new Set();
for (const file of (await fs.readdir(dataDirectory)).filter((name) => name.endsWith('.csv'))) {
  for (const row of parseCsv(await fs.readFile(path.join(dataDirectory, file), 'utf8')).slice(1)) {
    const first = normalizeDrugName(row[1]); const second = normalizeDrugName(row[3]);
    if (!first || !second || first === second) continue;
    drugNames.add(first); drugNames.add(second);
    positiveNames.add(first < second ? `${first}|${second}` : `${second}|${first}`);
  }
}
const names = [...drugNames].sort(); const indexes = new Map(names.map((name, index) => [name, index]));
const positives = shuffled([...positiveNames]).slice(0, 30000).map((pair) => { const [first, second] = pair.split('|'); return { a: indexes.get(first), b: indexes.get(second), y: 1 }; });
const negativeKeys = new Set();
while (negativeKeys.size < positives.length) {
  let a = Math.floor(random() * names.length); let b = Math.floor(random() * names.length);
  if (a === b) continue; if (a > b) [a, b] = [b, a];
  const key = `${names[a]}|${names[b]}`;
  if (!positiveNames.has(key)) negativeKeys.add(`${a}|${b}`);
}
const negatives = [...negativeKeys].map((pair) => { const [a, b] = pair.split('|').map(Number); return { a, b, y: 0 }; });
const samples = shuffled([...positives, ...negatives]);
const split = Math.floor(samples.length * 0.8); const training = samples.slice(0, split); const testing = samples.slice(split);

const embeddings = names.map(() => Array.from({ length: dimensions }, () => randomWeight(0.12)));
const w1 = Array.from({ length: dimensions * 2 }, () => Array.from({ length: hiddenOne }, () => randomWeight()));
const b1 = Array(hiddenOne).fill(0);
const w2 = Array.from({ length: hiddenOne }, () => Array.from({ length: hiddenTwo }, () => randomWeight()));
const b2 = Array(hiddenTwo).fill(0);
const w3 = Array.from({ length: hiddenTwo }, () => randomWeight()); let b3 = 0;

const forward = (a, b) => {
  const first = embeddings[a]; const second = embeddings[b];
  const x = [...first.map((value, index) => value * second[index]), ...first.map((value, index) => Math.abs(value - second[index]))];
  const z1 = b1.map((bias, column) => bias + x.reduce((sum, value, row) => sum + value * w1[row][column], 0));
  const h1 = z1.map(activate);
  const z2 = b2.map((bias, column) => bias + h1.reduce((sum, value, row) => sum + value * w2[row][column], 0));
  const h2 = z2.map(activate);
  const probability = sigmoid(b3 + h2.reduce((sum, value, index) => sum + value * w3[index], 0));
  return { first, second, x, z1, h1, z2, h2, probability };
};

for (let epoch = 0; epoch < 12; epoch += 1) {
  const learningRate = 0.018 / (1 + epoch * 0.22); let loss = 0;
  for (const sample of shuffled(training)) {
    const state = forward(sample.a, sample.b); const probability = state.probability;
    loss += -(sample.y * Math.log(probability + 1e-8) + (1 - sample.y) * Math.log(1 - probability + 1e-8));
    const outputDelta = probability - sample.y;
    const oldW3 = [...w3];
    for (let index = 0; index < hiddenTwo; index += 1) w3[index] -= learningRate * outputDelta * state.h2[index];
    b3 -= learningRate * outputDelta;
    const deltaTwo = state.z2.map((value, index) => activationDerivative(value) * oldW3[index] * outputDelta);
    const oldW2 = w2.map((row) => [...row]);
    for (let row = 0; row < hiddenOne; row += 1) for (let column = 0; column < hiddenTwo; column += 1) w2[row][column] -= learningRate * deltaTwo[column] * state.h1[row];
    for (let column = 0; column < hiddenTwo; column += 1) b2[column] -= learningRate * deltaTwo[column];
    const deltaOne = state.z1.map((value, row) => activationDerivative(value) * deltaTwo.reduce((sum, delta, column) => sum + oldW2[row][column] * delta, 0));
    const oldW1 = w1.map((row) => [...row]);
    for (let row = 0; row < dimensions * 2; row += 1) for (let column = 0; column < hiddenOne; column += 1) w1[row][column] -= learningRate * deltaOne[column] * state.x[row];
    for (let column = 0; column < hiddenOne; column += 1) b1[column] -= learningRate * deltaOne[column];
    const dx = state.x.map((_, row) => deltaOne.reduce((sum, delta, column) => sum + oldW1[row][column] * delta, 0));
    for (let index = 0; index < dimensions; index += 1) {
      const firstValue = state.first[index]; const secondValue = state.second[index]; const sign = firstValue === secondValue ? 0 : firstValue > secondValue ? 1 : -1;
      embeddings[sample.a][index] -= learningRate * (dx[index] * secondValue + dx[dimensions + index] * sign);
      embeddings[sample.b][index] -= learningRate * (dx[index] * firstValue - dx[dimensions + index] * sign);
    }
  }
  console.log(`Epoch ${epoch + 1}: loss ${(loss / training.length).toFixed(4)}`);
}

const predictions = testing.map((sample) => ({ y: sample.y, p: forward(sample.a, sample.b).probability })).sort((a, b) => a.p - b.p);
let truePositive = 0; let falsePositive = 0; let trueNegative = 0; let falseNegative = 0; let rankSum = 0; let positivesSeen = 0; let negativesSeen = 0;
predictions.forEach((prediction, index) => { if (prediction.y) { positivesSeen += 1; rankSum += index + 1; } else negativesSeen += 1; const positive = prediction.p >= 0.5; if (positive && prediction.y) truePositive += 1; else if (positive) falsePositive += 1; else if (prediction.y) falseNegative += 1; else trueNegative += 1; });
const auc = (rankSum - positivesSeen * (positivesSeen + 1) / 2) / (positivesSeen * negativesSeen);
const metrics = { pairSplitAuc: auc, accuracy: (truePositive + trueNegative) / predictions.length, precision: truePositive / Math.max(1, truePositive + falsePositive), recall: truePositive / Math.max(1, truePositive + falseNegative), testPairs: predictions.length };
const model = {
  modelType: 'neural-collaborative-filtering', architecture: `${dimensions * 2}-${hiddenOne}-${hiddenTwo}-1`, activation: 'leaky-relu-0.1', trainedAt: new Date().toISOString(),
  trainingSource: 'DDInter CC BY-NC-SA 4.0', disclaimer: 'Experimental research indicator only. Unknown pairs were sampled as training negatives and are not verified safe combinations.', metrics,
  recommendedThreshold: 0.85, names, embeddings, weights: { w1, b1, w2, b2, w3, b3 },
};
await fs.writeFile(outputPath, JSON.stringify(model));
console.log(`Saved ${outputPath}. Pair-split AUC=${metrics.pairSplitAuc.toFixed(3)}, precision=${metrics.precision.toFixed(3)}, recall=${metrics.recall.toFixed(3)}.`);
