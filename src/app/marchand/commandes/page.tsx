import Link from "next/link";
import { PackageSearch, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { StatusBadge } from "@/components/tracking/order-timeline";
import { OrderActions } from "@/components/merchant/order-actions";

export default async function MerchantOrdersPage() {
  const locale = await getLocale();

  const [orders, deliveries] = await Promise.all([
    prisma.order.findMany({
      include: { items: true, delivery: { include: { delivery: true } } },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.user.findMany({ where: { role: "DELIVERY", active: true }, select: { id: true, name: true } }),
  ]);

  const deliveryOptions = deliveries.map((d) => ({ id: d.id, name: d.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">{t(locale, "merchant_orders")}</h1>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">{t(locale, "merchant_orders_empty")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-gray-900">{o.number}</span>
                  <StatusBadge status={o.status} locale={locale} />
                  {o.delivery && (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                      🚚 {o.delivery.delivery.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(o.createdAt)}
                  </span>
                  <span className="text-base font-extrabold text-gray-900">{formatMAD(o.total)}</span>
                  <Link
                    href={`/suivi/${o.trackingCode}`}
                    className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-brand-300 hover:text-brand-600"
                  >
                    {t(locale, "merchant_view")} <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              <div className="mt-3 grid gap-3 border-t border-gray-50 pt-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {o.customerName} <span className="font-normal text-gray-400" dir="ltr">· {o.customerPhone}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {o.city} — {o.address}
                    {o.deliveryNote ? ` · ${t(locale, "merchant_delivery_note")}: ${o.deliveryNote}` : ""}
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
                  <OrderActions
                    orderNumber={o.number}
                    status={o.status}
                    actorType="SELLER"
                    deliveries={deliveryOptions}
                    assignedDeliveryId={o.delivery?.deliveryId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
