// Saves a large number of rows in small groups, so one huge save does not time out.

import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

/**
 * Runs a bulk operation in smaller transactions to limit lock duration.
 * This does not shorten the overall HTTP request or change proxy timeouts.
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
 * @param {(chunk: any[], chunkIndex: number) => Promise<void>} [options.beforeChunk]
 *   Acquire external resources before opening the transaction.
 * @param {(chunk: any[], chunkIndex: number) => Promise<void>} [options.afterChunk]
 *   Release external resources even when acquisition or processing fails.
 * @returns {Promise<any[]>} Array of partial results from each chunk.
 */
export async function chunkedTransaction({ items, chunkSize = 15, timeout = 30000, maxWait = 25000, process, beforeChunk, afterChunk }) {
  if (!items.length) return [];

  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkIndex = Math.floor(i / chunkSize);
    try {
      await beforeChunk?.(chunk, chunkIndex);
      const partial = await prisma.$transaction(
        (tx) => process(tx, chunk, chunkIndex),
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
          maxWait,
          timeout,
        },
      );
      results.push(partial);
    } finally {
      await afterChunk?.(chunk, chunkIndex);
    }
  }
  return results;
}
