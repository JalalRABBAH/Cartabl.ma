import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageSearch, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { deliveryDaysFor } from "@/lib/shipping";
import { OrderTimeline, StatusBadge } from "@/components/tracking/order-timeline";
import { TrackForm } from "@/components/storefront/track-form";
import { CopyButton } from "@/components/storefront/copy-button";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return { title: `Suivi ${code.toUpperCase()}` };
}

export default async function TrackCodePage({ params }: Props) {
  const locale = await getLocale();
  const { code } = await params;
  const normalized = code.toUpperCase();

  const order = await prisma.order.findUnique({
    where: { trackingCode: normalized },
    include: { items: true, events: true },
  });
  if (!order) notFound();

  const [minDays, maxDays] = deliveryDaysFor(order.city);

  return (
    <div className="container-site max-w-4xl py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
          {t(locale, "track_title")}
        </span>
        <div className="mt-4 flex items-center gap-3">
          <h1 className="font-mono text-3xl font-black tracking-widest text-gray-900">{normalized}</h1>
          <CopyButton value={normalized} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {order.number} · {order.customerName} · {order.city}
        </p>
        <div className="mt-3">
          <StatusBadge status={order.status} locale={locale} />
        </div>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <TrackForm defaultValue={normalized} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <OrderTimeline status={order.status} events={order.events} locale={locale} />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
              <Truck className="h-4 w-4 text-brand-500" />
              {t(locale, "track_latest")}
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              {new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(order.events.length ? new Date(order.events[order.events.length - 1].createdAt) : new Date(order.createdAt))}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {t(locale, "order_estimate")} : {minDays}–{maxDays} {t(locale, "common_days")}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
              {t(locale, "track_order_summary")}
            </h3>
            <ul className="mt-3 space-y-2">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="line-clamp-1 text-gray-700">{it.productName} × {it.quantity}</span>
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

          <Link
            href="/produits"
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:border-brand-300 hover:text-brand-600"
          >
            <PackageSearch className="h-4 w-4" /> {t(locale, "cart_continue")}
          </Link>
        </div>
      </div>
    </div>
  );
}
