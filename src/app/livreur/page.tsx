import Link from "next/link";
import { PackageCheck, Truck, CircleDollarSign, PackageX } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { StatusBadge } from "@/components/tracking/order-timeline";
import { OrderActions } from "@/components/merchant/order-actions";

export const dynamic = "force-dynamic";

export default async function DeliveryOverviewPage() {
  const user = await getSessionUser();
  const locale = await getLocale();

  const assignments = user
    ? await prisma.deliveryAssignment.findMany({
        where: { deliveryId: user.id },
        include: {
          order: { include: { items: true } },
        },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const terminalStatuses: OrderStatus[] = [
    OrderStatus.DELIVERED,
    OrderStatus.CANCELED,
    OrderStatus.RETURNED,
  ];
  const active = assignments.filter((a) => !terminalStatuses.includes(a.order.status));
  const completedToday = assignments.filter(
    (a) =>
      a.order.status === OrderStatus.DELIVERED &&
      a.order.deliveredAt &&
      new Date(a.order.deliveredAt).toDateString() === new Date().toDateString(),
  );
  const toCollect = active.reduce((sum, a) => sum + a.order.total, 0);

  const stats = [
    { icon: Truck, label: t(locale, "delivery_active"), value: String(active.length), color: "bg-brand-50 text-brand-600" },
    { icon: PackageCheck, label: t(locale, "delivery_done_today"), value: String(completedToday.length), color: "bg-emerald-50 text-emerald-600" },
    { icon: CircleDollarSign, label: t(locale, "delivery_to_collect"), value: formatMAD(toCollect), color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">{t(locale, "delivery_my_route")}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
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

      {active.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <PackageX className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">{t(locale, "delivery_empty")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((a) => {
            const o = a.order;
            return (
              <div key={a.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-900">{o.number}</span>
                    <StatusBadge status={o.status} locale={locale} />
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                      {t(locale, "delivery_payment")}: {formatMAD(o.total)}
                    </span>
                  </div>
                  <Link href={`/suivi/${o.trackingCode}`} className="text-xs font-bold text-brand-600 hover:underline">
                    {t(locale, "delivery_track_link")}
                  </Link>
                </div>

                <div className="mt-3 grid gap-3 border-t border-gray-50 pt-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {o.customerName} <span className="font-normal text-gray-400" dir="ltr">· {o.customerPhone}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {o.city} — {o.address}
                      {o.deliveryNote ? ` · 📝 ${o.deliveryNote}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {o.items.map((it) => (
                        <span key={it.id} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                          {it.productName} × {it.quantity}
                          {it.color ? ` (${it.color})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="sm:w-64">
                    <OrderActions orderNumber={o.number} status={o.status} actorType="DELIVERY" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
