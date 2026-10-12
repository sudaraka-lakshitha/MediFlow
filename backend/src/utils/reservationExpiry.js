import { prisma } from '../config/prisma.js';
import { serializable } from './serializable.js';
import { releaseReservations } from './stock.js';

export const cleanupExpiredCashReservations = async () => {
  const expired = await prisma.paymentRequest.findMany({
    where: { status: 'AWAITING_PAYMENT', reservationExpiresAt: { lte: new Date() } },
    select: { id: true },
  });
  for (const record of expired) {
    await serializable(async (tx) => {
      const claimed = await tx.paymentRequest.updateMany({
        where: { id: record.id, status: 'AWAITING_PAYMENT', reservationExpiresAt: { lte: new Date() } },
        data: { reservationExpiresAt: null },
      });
      if (claimed.count) await releaseReservations(tx, record.id);
    });
  }
};
