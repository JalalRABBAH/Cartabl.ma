"use client";

import Link from "next/link";
import { X, Trash2, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/app/providers";
import { formatMAD } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { ProductArt } from "@/components/product-art";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@prisma/client";

export function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, removeItem, setQty, count } = useCart();
  const { T, locale } = useLocale();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : locale === "ar" ? "-translate-x-full" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-bold">{T("cart_title")}</h2>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
              {count}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label={T("common_close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <ShoppingBag className="h-9 w-9 text-brand-300" />
            </div>
            <p className="text-gray-500">{T("cart_empty")}</p>
            <Button onClick={() => setOpen(false)}>
              <Link href="/produits">{T("cart_empty_cta")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.color ?? "default"}`}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <Link
                    href={`/produits/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  >
                    <ProductArt
                      category={item.category as ProductCategory}
                      colors={item.color ? [item.color] : undefined}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/produits/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-brand-600"
                      >
                        {locale === "ar" ? item.nameAr : item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId, item.color)}
                        className="cursor-pointer rounded p-1 text-gray-300 hover:text-red-500"
                        aria-label={T("cart_remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.color && (
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                        <span
                          className="inline-block h-3 w-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.color}
                      </span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          onClick={() => setQty(item.productId, item.qty - 1, item.color)}
                          className="cursor-pointer px-2 py-1 text-gray-500 hover:text-brand-600"
                          aria-label="moins"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.productId, item.qty + 1, item.color)}
                          className="cursor-pointer px-2 py-1 text-gray-500 hover:text-brand-600"
                          aria-label="plus"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-700">
                        {formatMAD(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <div className="mb-3 rounded-xl bg-sand-50 p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-sand-800">
                  <Truck className="h-4 w-4" />
                  {remaining > 0
                    ? T("cart_free_ship_progress", { amount: formatMAD(remaining) })
                    : T("cart_free_ship_done")}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-sand-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{T("cart_total")}</span>
                <span className="text-xl font-extrabold text-gray-900">{formatMAD(subtotal)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Link href="/commande" className="flex w-full items-center justify-center">
                  {T("cart_checkout")}
                </Link>
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
