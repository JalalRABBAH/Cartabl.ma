import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { toCard } from "@/lib/serialize";
import { ProductBuyBox } from "@/components/storefront/product-buy-box";
import { ProductCard } from "@/components/storefront/product-card";
import { ReviewForm } from "@/components/storefront/review-form";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  return { title: p?.name ?? "Produit" };
}

export default async function ProductPage({ params }: Props) {
  const locale = await getLocale();
  const { slug } = await params;
  const session = await getSessionUser();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { reviews: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 6 } },
  });
  if (!product || !product.active) notFound();

  const related = await prisma.product.findMany({
    where: { active: true, category: product.category, id: { not: product.id } },
    orderBy: { sold: "desc" },
    take: 4,
  });

  return (
    <div className="container-site py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">{t(locale, "nav_home")}</Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        <Link href="/produits" className="hover:text-brand-600">{t(locale, "nav_products")}</Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        <span className="truncate text-gray-800">{locale === "ar" ? product.nameAr : product.name}</span>
      </nav>

      <ProductBuyBox product={toCard(product)} />

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-black text-gray-900">{t(locale, "product_description")}</h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            {locale === "ar" ? product.descriptionAr : product.description}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { k: t(locale, "product_brand"), v: product.brand },
              { k: t(locale, "product_level"), v: product.level ? t(locale, `level_${product.level}` as never) : "—" },
            ].map((row) => (
              <div key={row.k} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span className="text-gray-500">{row.k}</span>
                <span className="font-semibold text-gray-900">{row.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-black text-gray-900">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            {t(locale, "product_reviews_title")}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-4xl font-black text-gray-900">{product.rating.toFixed(1)}</span>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={i <= Math.round(product.rating) ? "h-4 w-4 fill-current" : "h-4 w-4 text-gray-200"} />
                ))}
              </div>
              <p className="text-xs text-gray-400">{product.ratingCount} {t(locale, "product_reviews")}</p>
            </div>
          </div>
          {product.reviews.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">{t(locale, "product_no_reviews")}</p>
          ) : (
            <div className="mt-5 space-y-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{r.user.name}</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={i < r.rating ? "h-3 w-3 fill-current" : "h-3 w-3 text-gray-200"} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
          <ReviewForm productId={product.id} loggedIn={!!session} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-black text-gray-900">{t(locale, "product_related")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={toCard(p)} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
