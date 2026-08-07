import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Truck, Home, LayoutDashboard } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { deliveryDaysFor } from "@/lib/shipping";
import { homePathFor, isBuyerFlowRole } from "@/lib/role-nav";
import { OrderTimeline } from "@/components/tracking/order-timeline";
import { CopyButton } from "@/components/storefront/copy-button";
import { Button } from "@/components/ui/button";
import { GuestBanner } from "@/components/storefront/guest-banner";

type Props = { params: Promise<{ number: string }>; searchParams: Promise<{ code?: string }> };

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const locale = await getLocale();
  const session = await getSessionUser();
  const buyerFlow = isBuyerFlowRole(session?.role);
  const { number } = await params;
  const sp = await searchParams;

  const order = await prisma.order.findUnique({
    where: { number },
    include: { items: true, events: true },
  });
  if (!order) notFound();

  const code = sp.code ?? order.trackingCode;
  const [minDays, maxDays] = deliveryDaysFor(order.city);

  return (
    <div className="container-site max-w-4xl py-12">
      <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-gray-900">{t(locale, "order_confirmed")}</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-500">{t(locale, "order_thanks")}</p>

        <div className="mx-auto mt-8 max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {t(locale, "order_tracking_code")}
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="font-mono text-2xl font-black tracking-widest text-brand-700">{code}</span>
            <CopyButton value={code} />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <Truck className="h-4 w-4 text-brand-500" />
            {t(locale, "order_estimate")} : {minDays}–{maxDays} {t(locale, "common_days")}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            <Link href={`/suivi/${code}`} className="flex items-center gap-2">
              {t(locale, "order_track_cta")}
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href={buyerFlow ? "/produits" : homePathFor(session?.role)} className="flex items-center gap-2">
              {buyerFlow ? <Home className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
              {buyerFlow ? t(locale, "order_back_home") : t(locale, "back_to_space")}
            </Link>
          </Button>
        </div>
      </div>

      {!order.userId && (
        <div className="mt-8">
          <GuestBanner />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{t(locale, "track_timeline")}</h2>
          <OrderTimeline
            status={order.status}
            events={order.events}
            locale={locale}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
              {t(locale, "order_number")}
            </h3>
            <p className="mt-1 font-mono text-sm font-bold text-gray-900">{order.number}</p>
            <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-gray-400">
              {t(locale, "order_payment")}
            </h3>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {t(locale, order.paymentMethod === "COD" ? "cod" : "card")}
            </p>
            <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-gray-400">
              {t(locale, "order_items")}
            </h3>
            <ul className="mt-2 space-y-2">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="line-clamp-1 text-gray-700">
                    {locale === "ar" ? "" : ""}
                    {it.productName} × {it.quantity}
                  </span>
                  <span className="shrink-0 font-semibold text-gray-900">{formatMAD(it.total)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">{t(locale, "cart_subtotal")}</dt>
                <dd className="font-semibold">{formatMAD(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t(locale, "cart_shipping")}</dt>
                <dd className="font-semibold">
                  {order.shippingFee === 0 ? t(locale, "cart_shipping_free") : formatMAD(order.shippingFee)}
                </dd>
              </div>
              <div className="flex justify-between pt-1">
                <dt className="font-bold">{t(locale, "cart_total")}</dt>
                <dd className="font-extrabold text-brand-700">{formatMAD(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">
              {t(locale, "track_delivery_contact")}
            </h3>
            <p className="mt-2 font-semibold text-gray-900">{order.customerName}</p>
            <p className="text-gray-600" dir="ltr">{order.customerPhone}</p>
            <p className="mt-2 text-gray-600">
              {order.city} — {order.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
