import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export const COMMISSION_RATE = 0.05;

export function commissionFor(amount: number): number {
  return Math.round(amount * COMMISSION_RATE);
}

export function netFor(amount: number): number {
  return amount - commissionFor(amount);
}

export type MerchantStats = {
  products: number;
  activeProducts: number;
  deliveredOrders: number;
  sales: number;
  commission: number;
  net: number;
};

export const EMPTY_MERCHANT_STATS: MerchantStats = {
  products: 0,
  activeProducts: 0,
  deliveredOrders: 0,
  sales: 0,
  commission: 0,
  net: 0,
};

export async function merchantStats(sellerId: string): Promise<MerchantStats> {
  const [productAgg, rows] = await Promise.all([
    prisma.product.groupBy({
      by: ["active"],
      where: { sellerId },
      _count: { _all: true },
    }),
    prisma.orderItem.findMany({
      where: { product: { sellerId }, order: { status: OrderStatus.DELIVERED } },
      select: { total: true, orderId: true },
    }),
  ]);

  const sales = rows.reduce((s, r) => s + r.total, 0);
  return {
    products: productAgg.reduce((s, g) => s + g._count._all, 0),
    activeProducts: productAgg.find((g) => g.active)?._count._all ?? 0,
    deliveredOrders: new Set(rows.map((r) => r.orderId)).size,
    sales,
    commission: commissionFor(sales),
    net: netFor(sales),
  };
}

export async function allMerchantsStats(): Promise<Record<string, MerchantStats>> {
  const [sellers, rows] = await Promise.all([
    prisma.user.findMany({
      where: { role: "SELLER" },
      select: { id: true, products: { select: { active: true } } },
    }),
    prisma.orderItem.findMany({
      where: {
        product: { sellerId: { not: null } },
        order: { status: OrderStatus.DELIVERED },
      },
      select: { total: true, orderId: true, product: { select: { sellerId: true } } },
    }),
  ]);

  const map: Record<string, MerchantStats> = {};
  const orderIds = new Map<string, Set<string>>();
  for (const s of sellers) {
    map[s.id] = {
      products: s.products.length,
      activeProducts: s.products.filter((p) => p.active).length,
      deliveredOrders: 0,
      sales: 0,
      commission: 0,
      net: 0,
    };
    orderIds.set(s.id, new Set());
  }

  for (const r of rows) {
    const id = r.product?.sellerId;
    if (!id || !map[id]) continue;
    map[id].sales += r.total;
    orderIds.get(id)!.add(r.orderId);
  }

  for (const id of Object.keys(map)) {
    map[id].deliveredOrders = orderIds.get(id)?.size ?? 0;
    map[id].commission = commissionFor(map[id].sales);
    map[id].net = netFor(map[id].sales);
  }
  return map;
}

export async function platformCommission(): Promise<{ sales: number; commission: number; net: number }> {
  const agg = await prisma.orderItem.aggregate({
    where: { order: { status: OrderStatus.DELIVERED } },
    _sum: { total: true },
  });
  const sales = agg._sum.total ?? 0;
  return { sales, commission: commissionFor(sales), net: netFor(sales) };
}
