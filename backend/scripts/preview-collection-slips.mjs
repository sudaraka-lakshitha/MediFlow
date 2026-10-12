import fs from 'node:fs/promises';
import { createCollectionSlipPdf } from '../src/utils/collectionSlipPdf.js';

const directory = new URL('../../outputs/receipt-layout-checks/',import.meta.url);
await fs.mkdir(directory,{recursive:true});
for (const width of [58,80]) for (const long of [false,true]) {
  const filename=`collection-${width}${long?'-long':''}.pdf`;
  const pdf=await createCollectionSlipPdf({patient:{fullName:long?'Alexandra Samantha Wijesinghe Jayawardena Example Customer':'Sample Customer'},requestNumber:'PAY-20261009-ABC123',pickupPin:'123456'},width);
  await fs.writeFile(new URL(filename,directory),pdf);
  console.log(filename);
}
