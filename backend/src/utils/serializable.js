import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

// Runs a transaction at Serializable isolation, retrying a few times if
// Prisma reports a write conflict (P2034) rather than surfacing a raw 500.
export const serializable = async (operation, attempts = 3) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await prisma.$transaction(operation, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error.code !== 'P2034' || attempt === attempts) throw error;
    }
  }
  return undefined;
};
