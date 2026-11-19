import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { operationContext, recordOperation } from './operationContext.js';

// Hosted MySQL round-trips can exceed Prisma's 5 second interactive default.
// Use bounded defaults for business transactions throughout the API; callers
// with known heavier work can supply a longer timeout explicitly.
export const DEFAULT_TRANSACTION_OPTIONS = Object.freeze({
  maxWait: 10_000,
  timeout: 15_000,
});

// Stock fulfillment touches the payment request, inventory batches, stock
// movements, dispensing rows, and the sale in one atomic transaction. Aiven
// round-trips can exceed the general window when a bill has several batches,
// so give fulfillment flows a bounded longer window.
export const stockFulfillmentTransactionOptions = Object.freeze({
  ...DEFAULT_TRANSACTION_OPTIONS,
  timeout: 30_000,
});

// Upload edits and bank-slip writes store attachment bytes in MySQL. A remote
// database may need more time to transfer those bounded files than a normal
// metadata update, while this limit remains below the API client's timeout.
export const attachmentTransactionOptions = Object.freeze({
  ...DEFAULT_TRANSACTION_OPTIONS,
  timeout: 25_000,
});

// Runs a transaction at Serializable isolation, retrying a few times if
// Prisma reports a write conflict (P2034) rather than surfacing a raw 500.
export const serializable = async (operation, attempts = 3, transactionOptions = DEFAULT_TRANSACTION_OPTIONS) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const context = operationContext.getStore();
      return await prisma.$transaction(tx => context ? recordOperation(tx, context, operation) : operation(tx), {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        ...DEFAULT_TRANSACTION_OPTIONS,
        ...transactionOptions,
      });
    } catch (error) {
      if (!['P2034', ...(operationContext.getStore() ? ['P2002'] : [])].includes(error.code) || attempt === attempts) throw error;
    }
  }
  return undefined;
};
