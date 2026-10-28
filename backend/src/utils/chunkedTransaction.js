import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

/**
 * Runs a bulk operation in smaller transactional chunks to avoid gateway
 * timeouts on hosting platforms with short proxy limits (e.g. Render free-tier
 * enforces ~30 s).
 *
 * Each chunk is processed inside its own Prisma interactive transaction with
 * ReadCommitted isolation and a conservative per-chunk timeout.
 *
 * @param {object} options
 * @param {Array} options.items       – The full list of items to process.
 * @param {number} [options.chunkSize=15] – Items per transaction chunk.
 * @param {number} [options.timeout=30000] – Per-chunk transaction timeout (ms).
 * @param {number} [options.maxWait=25000] – Max time to wait for connection from pool (ms).
 * @param {(tx: import('@prisma/client').Prisma.TransactionClient, chunk: any[], chunkIndex: number) => Promise<any>} options.process
 *   Callback invoked once per chunk with the transaction client and the items
 *   in that chunk.  Must return a partial result (or void).
 * @returns {Promise<any[]>} Array of partial results from each chunk.
 */
export async function chunkedTransaction({ items, chunkSize = 15, timeout = 30000, maxWait = 25000, process }) {
  if (!items.length) return [];

  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkIndex = Math.floor(i / chunkSize);
    const partial = await prisma.$transaction(
      (tx) => process(tx, chunk, chunkIndex),
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        maxWait,
        timeout,
      },
    );
    results.push(partial);
  }
  return results;
}
