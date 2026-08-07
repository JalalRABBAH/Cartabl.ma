import Link from "next/link";
import { Wallet, ClipboardList, Clock, PackageCheck, TrendingUp, AlertTriangle, Star, Percent, Banknote } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { StatusBadge } from "@/components/tracking/order-timeline";
import { StatusDonut } from "@/components/merchant/status-donut";
import { merchantStats, COMMISSION_RATE } from "@/lib/commission";

export default async function MerchantOverviewPage() {
  const locale = await getLocale();
  const session = await getSessionUser();
  const commission = await merchantStats(session?.id ?? "");

  const [deliveredAgg, totalOrders, pendingCount, inFlow, recentOrders, topProducts, lowStock] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] } } }),
      prisma.order.count({
        where: {
          status: {
            in: [
              OrderStatus.PREPARING,
              OrderStatus.HANDED_TO_DELIVERY,
              OrderStatus.IN_TRANSIT,
              OrderStatus.OUT_FOR_DELIVERY,
            ],
          },
        },
      }),
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.product.findMany({ where: { active: true }, orderBy: { sold: "desc" }, take: 5 }),
      prisma.product.findMany({ where: { active: true, stock: { lt: 10 } }, orderBy: { stock: "asc" }, take: 5 }),
    ]);

  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const stats = [
    {
      icon: Wallet,
      label: t(locale, "merchant_revenue"),
      value: formatMAD(deliveredAgg._sum.total ?? 0),
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: ClipboardList,
      label: t(locale, "merchant_total_orders"),
      value: String(totalOrders),
      color: "bg-brand-50 text-brand-600",
    },
    {
      icon: Clock,
      label: t(locale, "merchant_pending"),
      value: String(pendingCount),
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: PackageCheck,
      label: t(locale, "merchant_in_flow"),
      value: String(inFlow),
      color: "bg-violet-50 text-violet-600",
    },
  ];

  const statusLabels: Record<string, string> = {};
  for (const s of Object.values(OrderStatus)) {
    statusLabels[s] = t(locale, `status_${s.toLowerCase()}` as never);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">{t(locale, "merchant_overview")}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Percent className="h-5 w-5 text-amber-500" /> {t(locale, "merchant_commission_title")}
            </h2>
            <p className="mt-1 text-xs text-gray-500">{t(locale, "merchant_commission_rate")}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">
            {Math.round(COMMISSION_RATE * 100)}%
          </span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">{t(locale, "merchant_my_sales")}</p>
            <p className="mt-0.5 text-2xl font-black text-gray-900">{formatMAD(commission.sales)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">{t(locale, "merchant_commission_amount")}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-2xl font-black text-amber-600">
              <Percent className="h-5 w-5" /> {formatMAD(commission.commission)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">{t(locale, "merchant_net_revenue")}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-2xl font-black text-emerald-600">
              <Banknote className="h-5 w-5" /> {formatMAD(commission.net)}
            </p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-amber-100/60 px-3 py-2 text-xs font-semibold text-amber-700">
          {t(locale, "admin_commission_note")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t(locale, "merchant_sales_funnel")}</h2>
          <div className="mt-4">
            <StatusDonut data={statusCounts.map((c) => ({ status: c.status, count: c._count._all }))} labels={statusLabels} />
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <TrendingUp className="h-5 w-5 text-brand-600" /> {t(locale, "merchant_top_products")}
          </h2>
          <ul className="mt-4 space-y-3">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-black text-brand-700">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm font-semibold text-gray-800">
                  {locale === "ar" ? p.nameAr : p.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {p.sold}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{t(locale, "merchant_recent_orders")}</h2>
            <Link href="/marchand/commandes" className="text-sm font-bold text-brand-600 hover:underline">
              {t(locale, "merchant_orders")} →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-gray-50">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-3">
                <span className="font-mono text-xs font-bold text-gray-900">{o.number}</span>
                <span className="flex-1 truncate text-sm text-gray-600">{o.customerName}</span>
                <span className="hidden text-sm text-gray-400 sm:block">{o.city}</span>
                <StatusBadge status={o.status} locale={locale} />
                <span className="text-sm font-extrabold text-gray-900">{formatMAD(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> {t(locale, "merchant_low_stock")}
          </h2>
          <p className="mt-1 text-xs text-gray-400">{t(locale, "merchant_low_stock_note")}</p>
          <ul className="mt-4 space-y-3">
            {lowStock.length === 0 && <li className="text-sm text-gray-400">—</li>}
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm font-semibold text-gray-800">
                  {locale === "ar" ? p.nameAr : p.name}
                </span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                  {p.stock}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
