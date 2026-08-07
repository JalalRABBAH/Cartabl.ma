import { prisma } from "@/lib/db";

export const SELLER_TRIAL_DAYS = 7;
export const SELLER_PLAN_PRICE = 200;

export type SubscriptionStatus = "NONE" | "TRIAL" | "ACTIVE" | "EXPIRED";

export type SellerSubscription = {
  plan: string;
  trialStartedAt: Date;
  trialEndsAt: Date;
  paidUntil: Date | null;
  price: number;
};

export function subscriptionStatus(sub: SellerSubscription | null | undefined): SubscriptionStatus {
  if (!sub) return "NONE";
  const now = new Date();
  if (sub.paidUntil && sub.paidUntil.getTime() > now.getTime()) return "ACTIVE";
  if (sub.trialEndsAt.getTime() > now.getTime()) return "TRIAL";
  return "EXPIRED";
}

export function daysLeft(sub: SellerSubscription | null | undefined): number {
  if (!sub) return 0;
  const now = new Date();
  const target = sub.paidUntil && sub.paidUntil.getTime() > sub.trialEndsAt.getTime() ? sub.paidUntil : sub.trialEndsAt;
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000));
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getSellerSubscription(userId: string): Promise<SellerSubscription | null> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (sub) return sub;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SELLER") return null;
  return prisma.subscription.create({
    data: {
      userId,
      plan: "BASIC",
      trialEndsAt: addDays(new Date(), SELLER_TRIAL_DAYS),
      price: SELLER_PLAN_PRICE,
    },
  });
}

export async function activateSellerSubscription(userId: string): Promise<SellerSubscription> {
  const existing = await prisma.subscription.findUnique({ where: { userId } });
  const paidUntil = addDays(new Date(), 365);
  if (existing) {
    return prisma.subscription.update({
      where: { userId },
      data: { paidUntil, updatedAt: new Date() },
    });
  }
  return prisma.subscription.create({
    data: {
      userId,
      plan: "BASIC",
      trialEndsAt: addDays(new Date(), SELLER_TRIAL_DAYS),
      paidUntil,
      price: SELLER_PLAN_PRICE,
    },
  });
}
