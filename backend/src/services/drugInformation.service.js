// Searches drug information for the Drug Research page. It only reads data; nothing here changes
// stock or prescriptions.

import { AppError } from '../utils/AppError.js';
import { prisma } from '../config/prisma.js';

const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;
const excerpt = (value, maximum = 4000) => value ? String(value).replace(/\s+/g, ' ').trim().slice(0, maximum) : null;

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'MediFlow-Academic-Prototype/1.0' }, signal: AbortSignal.timeout(8000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${new URL(url).hostname} returned ${response.status}`);
  return response.json();
};

const settledValue = (result) => result.status === 'fulfilled' ? result.value : null;

export const drugInformationService = {
  async suggestions(rawQuery) {
    const query = rawQuery.trim().slice(0, 80);
    if (query.length < 2) return [];
    const [products, concepts] = await Promise.all([
      prisma.product.findMany({ where: { productType: 'MEDICINE', active: true, OR: [{ genericName: { contains: query } }, { brandName: { contains: query } }, { activeIngredient: { contains: query } }] }, select: { genericName: true, brandName: true, strength: true, id: true }, take: 12 }),
      prisma.drugConcept.findMany({ where: { OR: [{ displayName: { contains: query } }, { normalizedName: { contains: query } }] }, select: { displayName: true }, take: 8 }),
    ]);
    return [...new Map([...products.map((item) => ({ value: item.genericName, label: `${item.genericName} ${item.strength}`, description: item.brandName || 'Local catalogue', productId: item.id })), ...concepts.map((item) => ({ value: item.displayName, label: item.displayName, description: 'Medicine reference' }))].map((item) => [item.label.toLowerCase(), item])).values()].slice(0, 15);
  },
  async search(rawQuery) {
    const query = rawQuery.trim().replace(/[^\p{L}\p{N}\s().,+\/'’-]/gu, '').slice(0, 100);
    if (query.length < 2) throw new AppError(400, 'Enter at least two characters to search drug information.');
    const key = query.toLowerCase(); const cached = cache.get(key);
    if (cached && Date.now() - cached.at < CACHE_MS) return { ...cached.data, cached: true };

    const encoded = encodeURIComponent(query);
    const labelSearch = new URLSearchParams({ search: `openfda.generic_name:"${query.replaceAll('"', '')}"`, limit: '3' });
    const [rxResult, pubchemResult, labelResult, localProducts] = await Promise.allSettled([
      fetchJson(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encoded}&maxEntries=10&option=1`),
      fetchJson(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encoded}/property/Title,MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey/JSON`),
      fetchJson(`https://api.fda.gov/drug/label.json?${labelSearch}`),
      prisma.product.findMany({ where: { productType: 'MEDICINE', active: true, OR: [{ genericName: { contains: query } }, { brandName: { contains: query } }, { activeIngredient: { contains: query } }] }, include: { manufacturer: true, category: true }, take: 10 }),
    ]);

    const rx = settledValue(rxResult); const pubchem = settledValue(pubchemResult); const labels = settledValue(labelResult);
    const candidates = (rx?.approximateGroup?.candidate || []).map((item) => ({ name: item.name, rxcui: item.rxcui, score: Number(item.score || 0), rank: Number(item.rank || 0) })).filter((item) => item.name).slice(0, 10);
    const compounds = (pubchem?.PropertyTable?.Properties || []).map((item) => ({
      cid: item.CID, title: item.Title, molecularFormula: item.MolecularFormula, molecularWeight: item.MolecularWeight,
      canonicalSmiles: item.ConnectivitySMILES || item.CanonicalSMILES, inchiKey: item.InChIKey,
      sourceUrl: item.CID ? `https://pubchem.ncbi.nlm.nih.gov/compound/${item.CID}` : `https://pubchem.ncbi.nlm.nih.gov/#query=${encoded}`,
    }));
    const labelRecords = (labels?.results || []).map((item) => ({
      brandNames: item.openfda?.brand_name || [], genericNames: item.openfda?.generic_name || [], manufacturerNames: item.openfda?.manufacturer_name || [],
      indications: excerpt(item.indications_and_usage?.[0]), dosage: excerpt(item.dosage_and_administration?.[0]), warnings: excerpt(item.warnings?.[0]),
      interactions: excerpt(item.drug_interactions?.[0]), storage: excerpt(item.storage_and_handling?.[0]), updated: item.effective_time || null,
      sourceUrl: item.id ? `https://labels.fda.gov/?id=${encodeURIComponent(item.id)}` : 'https://open.fda.gov/apis/drug/label/',
    }));
    const unavailable = [rxResult.status === 'rejected' && 'RxNorm', pubchemResult.status === 'rejected' && 'PubChem', labelResult.status === 'rejected' && 'openFDA'].filter(Boolean);
    const data = {
      query, candidates, compounds, labels: labelRecords, localProducts: settledValue(localProducts) || [], unavailable, cached: false, searchedAt: new Date().toISOString(),
      sources: [
        { name: 'RxNorm', url: 'https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html' },
        { name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest' },
        { name: 'openFDA drug labels', url: 'https://open.fda.gov/apis/drug/label/' },
      ],
      disclaimer: 'Reference search only. Online records may be incomplete, delayed, product-specific, or unavailable outside the United States. Do not use this page alone to prescribe, verify, or dispense medicines.',
    };
    cache.set(key, { at: Date.now(), data });
    return data;
  },
};
