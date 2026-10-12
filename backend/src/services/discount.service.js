import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

const ruleData = (data, createdById) => ({
  name: data.name, code: data.code ? data.code.trim().toUpperCase() : null, description: data.description || null,
  type: data.type, value: data.value, scope: data.scope, productId: data.scope === 'PRODUCT' ? data.productId : null,
  categoryId: data.scope === 'CATEGORY' ? data.categoryId : null, minimumSubtotal: data.minimumSubtotal,
  minimumQuantity: data.minimumQuantity, maximumDiscount: data.maximumDiscount || null, automatic: data.automatic,
  combinable: data.combinable, priority: data.priority, startsAt: data.startsAt || null, endsAt: data.endsAt || null,
  active: data.active, ...(createdById ? { createdById } : {}),
});

const candidateFor = (rule, allocations, subtotal) => {
  if (subtotal.lessThan(rule.minimumSubtotal)) return null;
  const matching = rule.scope === 'ORDER' ? allocations : allocations.filter((item) => rule.scope === 'PRODUCT' ? item.productId === rule.productId : item.categoryId === rule.categoryId);
  const quantity = matching.reduce((sum, item) => sum.add(item.quantity), new Prisma.Decimal(0));
  if (!matching.length || quantity.lessThan(rule.minimumQuantity)) return null;
  const base = matching.reduce((sum, item) => sum.add(item.lineTotal), new Prisma.Decimal(0));
  let amount = rule.type === 'PERCENTAGE' ? base.mul(rule.value).div(100) : new Prisma.Decimal(rule.value);
  if (rule.maximumDiscount && amount.greaterThan(rule.maximumDiscount)) amount = rule.maximumDiscount;
  amount = Prisma.Decimal.min(amount, base).toDecimalPlaces(2);
  if (amount.lessThanOrEqualTo(0)) return null;
  return { rule, amount };
};

export const calculateDiscounts = async (tx, allocations, subtotal, couponCode) => {
  const now = new Date(); const normalizedCode = couponCode?.trim().toUpperCase();
  const rules = await tx.discountRule.findMany({
    where: { active: true, AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }, { OR: [{ automatic: true }, ...(normalizedCode ? [{ code: normalizedCode }] : [])] }] },
    orderBy: [{ priority: 'desc' }, { id: 'asc' }],
  });
  const candidates = rules.map((rule) => candidateFor(rule, allocations, subtotal)).filter(Boolean);
  const combinable = candidates.filter((candidate) => candidate.rule.combinable);
  const bestSingle = candidates.filter((candidate) => !candidate.rule.combinable).sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  const combinedAmount = combinable.reduce((sum, candidate) => sum.add(candidate.amount), new Prisma.Decimal(0));
  const selected = bestSingle && bestSingle.amount.greaterThan(combinedAmount) ? [bestSingle] : combinable;
  const amount = Prisma.Decimal.min(subtotal, selected.reduce((sum, candidate) => sum.add(candidate.amount), new Prisma.Decimal(0))).toDecimalPlaces(2);
  const couponMatched = !normalizedCode || rules.some((rule) => rule.code === normalizedCode);
  // Allocate the actual capped discount in the query's priority/id order.
  // The application ledger must never record more than the invoice received.
  let remaining = amount;
  const applications = selected.flatMap(({ rule, amount: ruleAmount }) => {
    const applied = Prisma.Decimal.min(ruleAmount, remaining);
    remaining = remaining.sub(applied);
    return applied.greaterThan(0) ? [{ ruleId: rule.id, ruleName: rule.name, ruleType: rule.type, ruleValue: rule.value, amount: applied }] : [];
  });
  return { amount, couponMatched, applications };
};

export const assertCouponMatched = (discountResult) => {
  if (!discountResult.couponMatched) throw new AppError(400, 'This coupon code is invalid, expired, or not yet active.');
  return discountResult;
};

export const discountService = {
  list: () => prisma.discountRule.findMany({ include: { product: { select: { genericName: true, strength: true } }, category: { select: { name: true } }, createdBy: { select: { fullName: true } } }, orderBy: [{ active: 'desc' }, { priority: 'desc' }, { name: 'asc' }] }),
  create: (data, userId) => prisma.discountRule.create({ data: ruleData(data, userId) }),
  update: (id, data) => prisma.discountRule.update({ where: { id }, data: ruleData(data) }),
  remove: (id) => prisma.discountRule.delete({ where: { id } }),
};
