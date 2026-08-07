"use client";

import { useState } from "react";
import { Star, ShoppingCart, Check, Truck, ShieldCheck, RotateCcw, Minus, Plus, Heart } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { useLocale } from "@/app/providers";
import { useCart } from "@/lib/cart-context";
import { formatMAD, cn, discountFor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CardProduct } from "@/lib/serialize";
import { t, type Locale } from "@/lib/i18n";

const WISHLIST_KEY = "cartabl_wishlist_v1";

function levelLabel(locale: Locale, level: string | null) {
  if (!level) return "";
  return t(locale, `level_${level}` as never);
}

export function ProductBuyBox({ product }: { product: CardProduct }) {
  const { locale, T } = useLocale();
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<"front" | "side" | "detail">("front");
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(
    typeof window !== "undefined" &&
      (JSON.parse(window.localStorage.getItem(WISHLIST_KEY) || "[]") as string[]).includes(product.slug),
  );

  const discount = discountFor(product.price, product.compareAtPrice);
  const name = locale === "ar" ? product.nameAr : product.name;

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        nameAr: product.nameAr,
        category: product.category,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        color,
        stock: product.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const toggleWish = () => {
    const list = JSON.parse(window.localStorage.getItem(WISHLIST_KEY) || "[]");
    const next = wished ? list.filter((s: string) => s !== product.slug) : [...list, product.slug];
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setWished(!wished);
  };

  const views: { v: "front" | "side" | "detail"; label: string }[] = [
    { v: "front", label: locale === "ar" ? "أمامي" : "Face" },
    { v: "side", label: locale === "ar" ? "جانبي" : "Profil" },
    { v: "detail", label: locale === "ar" ? "تفاصيل" : "Détail" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <div className="aspect-square">
            <ProductArt category={product.category as never} colors={product.colors} variant={view} />
          </div>
          <button
            onClick={toggleWish}
            className={cn(
              "absolute end-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition hover:scale-110",
              wished ? "text-red-500" : "text-gray-400",
            )}
            aria-label="favori"
          >
            <Heart className={cn("h-5 w-5", wished && "fill-current")} />
          </button>
          {discount > 0 && (
            <span className="absolute start-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow">
              -{discount}%
            </span>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {views.map((v) => (
            <button
              key={v.v}
              onClick={() => setView(v.v)}
              className={cn(
                "cursor-pointer overflow-hidden rounded-2xl border-2 transition",
                view === v.v ? "border-brand-600" : "border-transparent hover:border-gray-200",
              )}
            >
              <div className="aspect-square">
                <ProductArt category={product.category as never} colors={product.colors} variant={v.v} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sand-700">
            {product.brand}
          </span>
          {product.level && (
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {levelLabel(locale, product.level)}
            </span>
          )}
          {product.stock === 0 ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              {T("product_out_of_stock")}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {T("product_in_stock")}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">{name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={cn("h-4 w-4", i <= Math.round(product.rating) ? "fill-current" : "text-gray-200")} />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {product.rating.toFixed(1)} · {product.ratingCount} {T("product_reviews")}
          </span>
          {product.sold > 0 && (
            <span className="text-sm text-gray-400">· {product.sold} {T("product_sold")}</span>
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-4xl font-black text-gray-900">{formatMAD(product.price)}</span>
          {product.compareAtPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">{formatMAD(product.compareAtPrice)}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                {T("product_save")} {formatMAD(product.compareAtPrice - product.price)}
              </span>
            </>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          {locale === "ar" ? product.descriptionAr : product.description}
        </p>

        {product.colors.length > 1 && (
          <div className="mt-6">
            <p className="text-sm font-bold text-gray-800">{T("product_colors")}</p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-9 w-9 cursor-pointer rounded-full border-2 transition",
                    color === c ? "border-brand-600 ring-2 ring-brand-100" : "border-gray-200 hover:border-gray-300",
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-gray-200">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="cursor-pointer p-3 text-gray-500 hover:text-brand-600"
              aria-label="moins"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center text-lg font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="cursor-pointer p-3 text-gray-500 hover:text-brand-600"
              aria-label="plus"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button size="lg" className="flex-1 sm:flex-none sm:min-w-56" onClick={handleAdd} disabled={product.stock === 0}>
            {added ? (
              <>
                <Check className="h-5 w-5" /> {T("product_added")}
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" /> {T("product_add_to_cart")}
              </>
            )}
          </Button>
        </div>
        {product.stock > 0 && product.stock <= 10 && (
          <p className="mt-2 text-xs font-medium text-amber-600">
            ⚡ {T("product_only")} {product.stock} {T("product_pieces")}
          </p>
        )}

        <div className="mt-7 grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 text-sm">
            <Truck className="h-5 w-5 shrink-0 text-brand-600" />
            <span className="text-gray-600">{T("product_free_ship")}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <span className="text-gray-600">{T("footer_pay_cod")}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <RotateCcw className="h-5 w-5 shrink-0 text-sand-600" />
            <span className="text-gray-600">7 {T("common_days")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
