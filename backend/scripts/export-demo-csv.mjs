// Keep CSV counterparts aligned with the reviewed demonstration workbooks.
import { readFile, writeFile } from 'node:fs/promises';
import { readProductWorkbook } from '../src/services/productWorkbook.service.js';
import { readStockWorkbook } from '../src/services/stockWorkbook.service.js';
import { productBulkFields } from '../src/utils/productBulkFormat.js';
import { toCsv } from '../src/utils/csv.js';
const directory = new URL('../../data/demo/', import.meta.url);
const products = await readProductWorkbook(await readFile(new URL('MediFlow_Demo_Products.xlsx',directory)));
const stock = await readStockWorkbook(await readFile(new URL('MediFlow_Demo_Stock.xlsx',directory)));
const stockFields=['action','sku','batch_number','quantity','purchase_price','expiry_date','supplier_name','reason'];
await writeFile(new URL('MediFlow_Demo_Products.csv',directory),'\uFEFF'+toCsv(productBulkFields.map(c=>({...c,label:c.key})),products));
await writeFile(new URL('MediFlow_Demo_Stock.csv',directory),'\uFEFF'+toCsv(stockFields.map(key=>({key,label:key,numeric:['quantity','purchase_price'].includes(key)})),stock));
console.log(`Wrote CSV equivalents: ${products.length} products and ${stock.length} batches.`);
