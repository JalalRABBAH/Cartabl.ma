import { Store, Boxes, ClipboardList, Banknote, Percent, CircleDollarSign } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { allMerchantsStats, COMMISSION_RATE } from "@/lib/commission";

export const dynamic = "force-dynamic";

export default async function AdminMerchantsPage() {
  const locale = await getLocale();

  const [sellers, statsMap] = await Promise.all([
    prisma.user.findMany({ where: { role: "SELLER" }, orderBy: { createdAt: "desc" } }),
    allMerchantsStats(),
  ]);

  const rows = sellers
    .map((s) => ({ user: s, stats: statsMap[s.id] }))
    .sort((a, b) => b.stats.commission - a.stats.commission);

  const totals = rows.reduce(
    (acc, r) => ({
      sales: acc.sales + r.stats.sales,
      commission: acc.commission + r.stats.commission,
      delivered: acc.delivered + r.stats.deliveredOrders,
    }),
    { sales: 0, commission: 0, delivered: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t(locale, "admin_merchants_title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t(locale, "admin_merchants_sub")}</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">{rows.length}</span>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Percent className="h-5 w-5 text-amber-500" />
          {t(locale, "admin_commission_rate")}
        </h2>
        <p className="mt-1 text-xs text-gray-500">{t(locale, "admin_commission_note")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">{t(locale, "admin_merchant_sales")}</p>
            <p className="text-2xl font-black text-gray-900">{formatMAD(totals.sales)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">{t(locale, "admin_commission_total")}</p>
            <p className="text-2xl font-black text-amber-600">{formatMAD(totals.commission)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">{t(locale, "admin_merchant_delivered")}</p>
            <p className="text-2xl font-black text-gray-900">{totals.delivered}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">{locale === "ar" ? "التاجر" : "Marchand"}</th>
              <th className="px-5 py-3">
                <span className="inline-flex items-center gap-1">
                  <Boxes className="h-3.5 w-3.5" /> {t(locale, "admin_merchant_products_count")}
                </span>
              </th>
              <th className="px-5 py-3">
                <span className="inline-flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5" /> {t(locale, "admin_merchant_delivered")}
                </span>
              </th>
              <th className="px-5 py-3">
                <span className="inline-flex items-center gap-1">
                  <CircleDollarSign className="h-3.5 w-3.5" /> {t(locale, "admin_merchant_sales")}
                </span>
              </th>
              <th className="px-5 py-3">
                <span className="inline-flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5" /> {t(locale, "admin_merchant_commission")}
                </span>
              </th>
              <th className="px-5 py-3 text-right">
                <span className="inline-flex items-center gap-1">
                  <Banknote className="h-3.5 w-3.5" /> {t(locale, "admin_merchant_net")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                  {t(locale, "admin_users_empty")}
                </td>
              </tr>
            )}
            {rows.map(({ user, stats }) => (
              <tr key={user.id} className="transition hover:bg-gray-50/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Store className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-gray-700">{stats.activeProducts}</span>
                  <span className="text-xs text-gray-400"> / {stats.products}</span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-gray-700">{stats.deliveredOrders}</td>
                <td className="px-5 py-3.5 font-bold text-gray-900">{formatMAD(stats.sales)}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                    <Percent className="h-3 w-3" />
                    {Math.round(COMMISSION_RATE * 100)}% · {formatMAD(stats.commission)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-black text-emerald-600">{formatMAD(stats.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <p className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-xs text-amber-700">
          {t(locale, "admin_commission_note")}
        </p>
      )}
    </div>
  );
}
