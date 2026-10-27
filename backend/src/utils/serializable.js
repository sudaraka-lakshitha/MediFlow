import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { operationContext, recordOperation } from './operationContext.js';

// Runs a transaction at Serializable isolation, retrying a few times if
// Prisma reports a write conflict (P2034) rather than surfacing a raw 500.
export const serializable = async (operation, attempts = 3) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const context = operationContext.getStore();
      return await prisma.$transaction(tx => context ? recordOperation(tx, context, operation) : operation(tx), { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (!['P2034', ...(operationContext.getStore() ? ['P2002'] : [])].includes(error.code) || attempt === attempts) throw error;
    }
  }
  return undefined;
};
