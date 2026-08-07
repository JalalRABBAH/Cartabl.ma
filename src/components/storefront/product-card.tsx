"use client";

import Link from "next/link";
import { useState } from "react";
import { Star, Heart, ShoppingCart, Check } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { useLocale } from "@/app/providers";
import { useCart } from "@/lib/cart-context";
import { formatMAD, cn, discountFor } from "@/lib/utils";
import type { CardProduct } from "@/lib/serialize";
import { t, type Locale } from "@/lib/i18n";

const WISHLIST_KEY = "cartabl_wishlist_v1";

function levelLabel(locale: Locale, level: string | null) {
  if (!level) return "";
  return t(locale, `level_${level}` as never);
}

export function ProductCard({ product, index = 0 }: { product: CardProduct; index?: number }) {
  const { locale } = useLocale();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const toggleWish = () => {
    const list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    const next = wished ? list.filter((s: string) => s !== product.slug) : [...list, product.slug];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setWished(!wished);
  };

  const discount = discountFor(product.price, product.compareAtPrice);
  const name = locale === "ar" ? product.nameAr : product.name;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/produits/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl animate-fade-up",
      )}
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden">
          <ProductArt
            category={product.category as never}
            colors={product.colors}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute start-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
              {t(locale, "product_out_of_stock")}
            </span>
          )}
        </div>
        <button
          onClick={toggleWish}
          className={cn(
            "absolute end-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110",
            wished ? "text-red-500" : "text-gray-400",
          )}
          aria-label="favori"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-gray-900/70 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-gray-900 shadow-lg transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {added ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" /> {t(locale, "product_added")}
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> {t(locale, "product_add_to_cart")}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold uppercase tracking-wide text-sand-600">
            {product.brand}
          </span>
          {product.ratingCount > 0 && (
            <span className="flex items-center gap-1 text-gray-500">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)} · {product.ratingCount}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-gray-900 group-hover:text-brand-700">
          {name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-gray-900">{formatMAD(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatMAD(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400">
              {levelLabel(locale, product.level)} {product.sold > 0 && `· ${product.sold} ${t(locale, "product_sold")}`}
            </span>
          </div>
          {product.colors.length > 0 && (
            <div className="flex -space-x-1.5">
              {product.colors.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
