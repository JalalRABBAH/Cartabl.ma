import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { toCard } from "@/lib/serialize";
import { ProductCard } from "@/components/storefront/product-card";
import { FiltersBar } from "@/components/storefront/filters-bar";
import { SearchX } from "lucide-react";

export const metadata: Metadata = { title: "Boutique" };

type Props = {
  searchParams: Promise<{ q?: string; cat?: string; min?: string; max?: string; level?: string; sort?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const locale = await getLocale();
  const sp = await searchParams;

  const q = sp.q?.trim() ?? "";
  const cat = sp.cat ?? "";
  const level = sp.level ?? "";
  const min = Number(sp.min) || undefined;
  const max = Number(sp.max) || undefined;
  const sort = sp.sort ?? "featured";

  const where: Prisma.ProductWhereInput = { active: true };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { nameAr: { contains: q } },
      { brand: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (cat) where.category = cat as never;
  if (level) where.level = level;
  if (min !== undefined || max !== undefined) {
    where.price = {};
    if (min !== undefined) where.price.gte = min;
    if (max !== undefined) where.price.lte = max;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    sort === "newest"
      ? [{ createdAt: "desc" }]
      : sort === "popular"
        ? [{ sold: "desc" }]
        : sort === "price_asc"
          ? [{ price: "asc" }]
          : sort === "price_desc"
            ? [{ price: "desc" }]
            : [{ featured: "desc" }, { sold: "desc" }];

  const [products, count] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: 60 }),
    prisma.product.count({ where }),
  ]);

  return (
    <div className="container-site py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{t(locale, "nav_products")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {q ? `${t(locale, "filters_search_in")} « ${q} » · ` : ""}
          <span className="font-semibold text-brand-600">{count}</span> {t(locale, "filters_results")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <FiltersBar />
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-24 text-center">
              <SearchX className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">{t(locale, "filters_no_results")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={toCard(p)} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
