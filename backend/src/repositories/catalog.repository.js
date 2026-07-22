import { prisma } from '../config/prisma.js';

export const catalogRepository = {
  categories: () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
  products: (search = '') => {
    const where = { OR: [{ genericName: { contains: search } }, { brandName: { contains: search } }, { sku: { contains: search } }, { barcode: { contains: search } }] };
    return Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          manufacturer: true,
          drugConcept: true,
          lowStockAcknowledgement: {
            include: { acknowledgedBy: { select: { id: true, fullName: true } } },
          },
          batches: { where: { quantityAvailable: { gt: 0 }, restricted: false }, select: { quantityAvailable: true, quantityReserved: true, expiryDate: true } },
        },
        orderBy: { genericName: 'asc' },
        take: 300,
      }),
      prisma.product.count({ where }),
    ]);
  },
  suppliers: () => prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
  manufacturers: () => prisma.manufacturer.findMany({ orderBy: { name: 'asc' } }),
};
