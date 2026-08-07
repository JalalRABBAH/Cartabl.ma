import Link from "next/link";
import { Users, Boxes, ClipboardList, Wallet, Mail, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { StatusBadge } from "@/components/tracking/order-timeline";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const locale = await getLocale();

  const [userCount, productCount, orderCount, revenueAgg, subscriberCount, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { total: true },
      }),
      prisma.subscriber.count(),
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const stats = [
    { icon: Users, label: t(locale, "admin_total_users"), value: String(userCount), color: "bg-brand-50 text-brand-600" },
    { icon: Boxes, label: t(locale, "admin_total_products"), value: String(productCount), color: "bg-violet-50 text-violet-600" },
    { icon: ClipboardList, label: t(locale, "admin_total_orders"), value: String(orderCount), color: "bg-amber-50 text-amber-600" },
    { icon: Wallet, label: t(locale, "admin_total_revenue"), value: formatMAD(revenueAgg._sum.total ?? 0), color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-gray-900">{t(locale, "admin_overview")}</h1>
        <Link
          href="/admin/abonnes"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition hover:border-brand-300 hover:text-brand-600"
        >
          <Mail className="h-4 w-4 text-brand-600" />
          {t(locale, "admin_subscribers_count")}: {subscriberCount}
        </Link>
      </div>

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

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t(locale, "admin_recent_orders")}</h2>
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
              <Link
                href={`/suivi/${o.trackingCode}`}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                {t(locale, "merchant_view")} <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
