import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Store, MapPin, MessageCircle, PackageSearch, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { toCard } from "@/lib/serialize";
import { toWhatsAppNumber, waLink } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/product-card";
import { GridControls } from "@/components/storefront/shop-grid-controls";
import { WhatsAppFloat } from "@/components/storefront/whatsapp-float";

type Props = { params: Promise<{ boutique: string }>; searchParams: Promise<{ cols?: string; per_page?: string; page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { boutique } = await params;
  const seller = await prisma.user.findFirst({
    where: { shopSlug: boutique, role: "SELLER", active: true },
    select: { shopName: true },
  });
  return { title: seller?.shopName ?? "Boutique" };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const locale = await getLocale();
  const { boutique } = await params;
  const sp = await searchParams;

  const cols = [2, 3, 4].includes(Number(sp.cols)) ? Number(sp.cols) : 4;
  const perPage = [8, 12, 24, 48].includes(Number(sp.per_page)) ? Number(sp.per_page) : 12;
  const page = Math.max(1, Number(sp.page) || 1);

  const seller = await prisma.user.findFirst({
    where: { shopSlug: boutique, role: "SELLER", active: true },
    select: {
      id: true,
      name: true,
      shopName: true,
      city: true,
      whatsapp: true,
      phone: true,
    },
  });
  if (!seller) notFound();

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id, active: true },
    orderBy: { sold: "desc" },
  });

  const waNumber = toWhatsAppNumber(seller.whatsapp) ?? toWhatsAppNumber(seller.phone);
  const displayName = seller.shopName ?? seller.name;

  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = products.slice((safePage - 1) * perPage, safePage * perPage);

  const colsClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="container-site py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">{t(locale, "nav_home")}</Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        <span className="truncate text-gray-800">{displayName}</span>
      </nav>

      <section className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-sand-50 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-md">
              <Store className="h-8 w-8" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                {t(locale, "product_sold_by")}
              </p>
              <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{displayName}</h1>
              {seller.city && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" /> {seller.city}
                </p>
              )}
            </div>
          </div>
          {waNumber && (
            <a
              href={waLink(waNumber, locale === "ar"
                ? `مرحبا، لدي سؤال بخصوص متجر « ${displayName} » على Mbag.ma.`
                : `Bonjour, j'ai une question concernant la boutique « ${displayName} » sur Mbag.ma.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600"
            >
              <MessageCircle className="h-4 w-4" />
              {t(locale, "product_whatsapp_cta")}
            </a>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-gray-900">
          {t(locale, "shop_products_title")}
          <span className="rounded-full bg-brand-50 px-3 py-0.5 text-sm font-bold text-brand-700">
            {products.length}
          </span>
        </h2>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <PackageSearch className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">{t(locale, "shop_products_empty")}</p>
            <Link href="/produits" className="mt-3 inline-block text-sm font-bold text-brand-600 hover:underline">
              {t(locale, "shop_back_to_store")}
            </Link>
          </div>
        ) : (
          <>
            <GridControls total={products.length} />
            <div className={`grid ${colsClass} gap-4 sm:gap-6`}>
              {paginated.map((p, i) => (
                <ProductCard key={p.id} product={toCard(p)} index={i} />
              ))}
            </div>
          </>
        )}
      </section>

      <WhatsAppFloat
        number={waNumber ?? ""}
        message={
          locale === "ar"
            ? `مرحبا، لدي سؤال بخصوص متجر « ${displayName} » على Mbag.ma.`
            : `Bonjour, j'ai une question concernant la boutique « ${displayName} » sur Mbag.ma.`
        }
      />
    </div>
  );
}
