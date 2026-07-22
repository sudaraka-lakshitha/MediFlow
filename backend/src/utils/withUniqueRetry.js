import { Prisma } from '@prisma/client';

// Retries a record-creation callback a few times if it collides on a unique
// field (e.g. a generated invoice/request number). The callback must
// regenerate its own unique value on every call.
export const withUniqueRetry = async (create, attempts = 3) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await create();
    } catch (error) {
      const isUniqueClash = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
      if (!isUniqueClash || attempt === attempts) throw error;
    }
  }
  return undefined;
};
