"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/app/providers";
import { formatMAD } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { ProductArt } from "@/components/product-art";
import { Button } from "@/components/ui/button";
import { GuestBanner } from "@/components/storefront/guest-banner";
import { homePathFor, isBuyerFlowRole } from "@/lib/role-nav";
import type { ProductCategory, Role } from "@prisma/client";

export function CartView({ role }: { role: Role | null }) {
  const { items, subtotal, removeItem, setQty, count } = useCart();
  const { T, locale } = useLocale();
  const buyerFlow = isBuyerFlowRole(role);
  const backHref = buyerFlow ? "/produits" : homePathFor(role);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="container-site flex flex-col items-center justify-center py-28 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50">
          <ShoppingBag className="h-11 w-11 text-brand-300" />
        </div>
        <h1 className="mt-6 text-2xl font-black text-gray-900">{T("cart_empty")}</h1>
        <Button size="lg" className="mt-6">
          <Link href={backHref} className="flex items-center gap-2">
            {buyerFlow ? (
              <>
                <ShoppingBag className="h-5 w-5" /> {T("cart_empty_cta")}
              </>
            ) : (
              <>
                <LayoutDashboard className="h-5 w-5" /> {T("back_to_space")}
              </>
            )}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-site py-10">
      <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
        {T("cart_title")} <span className="text-lg font-semibold text-gray-400">({count} {T("cart_items")})</span>
      </h1>

      <div className="mt-6">
        <GuestBanner />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color ?? "default"}`}
              className="flex gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <Link
                href={`/produits/${item.slug}`}
                className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl"
              >
                <ProductArt
                  category={item.category as ProductCategory}
                  colors={item.color ? [item.color] : undefined}
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/produits/${item.slug}`}
                      className="font-semibold text-gray-900 hover:text-brand-600"
                    >
                      {locale === "ar" ? item.nameAr : item.name}
                    </Link>
                    {item.color && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                        <span
                          className="inline-block h-3 w-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.color}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm text-gray-500">
                      {formatMAD(item.price)} / {T("cart_items")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.color)}
                    className="cursor-pointer rounded-lg p-2 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={T("cart_remove")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-xl border border-gray-200">
                    <button
                      onClick={() => setQty(item.productId, item.qty - 1, item.color)}
                      className="cursor-pointer p-2.5 text-gray-500 hover:text-brand-600"
                      aria-label="moins"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center font-bold">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.productId, item.qty + 1, item.color)}
                      className="cursor-pointer p-2.5 text-gray-500 hover:text-brand-600"
                      aria-label="plus"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-lg font-extrabold text-gray-900">
                    {formatMAD(item.price * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            {buyerFlow ? <ShoppingBag className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
            {buyerFlow ? T("cart_continue") : T("back_to_space")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-32">
          <div className="rounded-2xl bg-sand-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-sand-800">
              <Truck className="h-4 w-4" />
              {remaining > 0
                ? T("cart_free_ship_progress", { amount: formatMAD(remaining) })
                : T("cart_free_ship_done")}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-sand-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">{T("cart_subtotal")}</dt>
              <dd className="font-semibold text-gray-900">{formatMAD(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">{T("cart_shipping")}</dt>
              <dd className="font-semibold text-emerald-600">{T("cart_shipping_free")}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-bold text-gray-900">{T("cart_total")}</dt>
              <dd className="font-extrabold text-brand-700">{formatMAD(subtotal)}</dd>
            </div>
          </dl>
          <Button size="lg" className="mt-5 w-full">
            <Link href="/commande" className="flex w-full items-center justify-center">
              {T("cart_checkout")}
            </Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
