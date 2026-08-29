import Link from "next/link";
import {
  Package,
  Truck,
  ShieldCheck,
  CreditCard,
  Search,
  MousePointerClick,
  PackageCheck,
  Home,
  Star,
  ArrowRight,
  BadgePercent,
  Store,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t, type Locale } from "@/lib/i18n";
import { CATEGORY_META, ALL_CATEGORIES } from "@/lib/catalog";
import { toCard, type CardProduct } from "@/lib/serialize";
import { BLOG_POSTS, BLOG_RUBRIQUES, rubriqueFor } from "@/lib/blog";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductArt } from "@/components/product-art";
import { NewsletterForm } from "@/components/storefront/newsletter-form";
import { CampaignSlider } from "@/components/storefront/campaign-slider";
import { formatMAD, toWhatsAppNumber, waLink } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "fill-current" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

async function getData() {
  const [featured, newest, categoryCounts, topSellers] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, active: true },
      orderBy: { sold: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.product.groupBy({
      by: ["category"],
      where: { active: true },
      _count: { _all: true },
    }),
    prisma.user.findMany({
      where: { role: "SELLER", active: true, shopSlug: { not: null } },
      select: {
        id: true,
        name: true,
        shopName: true,
        shopSlug: true,
        city: true,
        whatsapp: true,
        phone: true,
        products: {
          where: { active: true },
          select: { sold: true, id: true },
        },
      },
    }),
  ]);

  const ranked = topSellers
    .map((s) => ({
      ...s,
      totalSold: s.products.reduce((acc, p) => acc + p.sold, 0),
      productCount: s.products.length,
    }))
    .filter((s) => s.productCount > 0)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 6);

  return {
    featured: featured.map(toCard),
    newest: newest.map(toCard),
    counts: Object.fromEntries(categoryCounts.map((c) => [c.category, c._count._all])),
    topSellers: ranked,
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const { featured, newest, counts, topSellers } = await getData();

  return (
    <div>
      <Hero locale={locale} featured={featured} />
      <CampaignSlider />
      <Categories locale={locale} counts={counts} />
      <TopShops locale={locale} sellers={topSellers} />
      <FeaturedSection locale={locale} products={featured} />
      <PromoBanner locale={locale} />
      <HowItWorks locale={locale} />
      <WhyUs locale={locale} />
      <Testimonials locale={locale} />
      <BlogSection locale={locale} />
      <Newsletter locale={locale} />
    </div>
  );
}

function Hero({ locale, featured }: { locale: Locale; featured: CardProduct[] }) {
  const heroBags = featured.slice(0, 3);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-indigo-950 text-white">
      <div className="zellige absolute inset-0" />
      <div className="pointer-events-none absolute -start-24 -top-24 h-96 w-96 rounded-full bg-sand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 bottom-0 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />

      <div className="container-site relative grid items-center gap-6 py-6 lg:grid-cols-2 lg:py-8">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <BadgePercent className="h-4 w-4 text-sand-300" />
            {t(locale, "hero_badge")}
          </span>
          <h1 className="mt-4 text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            {t(locale, "hero_title")}{" "}
            <span className="bg-gradient-to-r from-sand-300 to-amber-200 bg-clip-text text-transparent">
              {t(locale, "hero_title_highlight")}
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-brand-100/90">{t(locale, "hero_subtitle")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/produits"
              className="group inline-flex h-13 items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-brand-700 shadow-lg shadow-brand-900/30 transition hover:bg-brand-50"
            >
              {t(locale, "hero_cta1")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/suivi"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Truck className="h-5 w-5" />
              {t(locale, "hero_cta2")}
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            {[
              { v: t(locale, "hero_stat1"), l: t(locale, "hero_stat1l") },
              { v: t(locale, "hero_stat2"), l: t(locale, "hero_stat2l") },
              { v: t(locale, "hero_stat3"), l: t(locale, "hero_stat3l") },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold text-sand-300">{s.v}</p>
                <p className="text-sm text-brand-100/80">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="grid grid-cols-2 gap-5">
            {heroBags.map((p, i) => (
              <Link
                key={p.slug}
                href={`/produits/${p.slug}`}
                className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur transition hover:scale-[1.03] ${
                  i === 1 ? "translate-y-8" : ""
                } ${i === 2 ? "-translate-y-4" : ""}`}
              >
                <div className="aspect-square w-full overflow-hidden bg-white/5 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0] ?? p.imageUrl ?? ""}
                    alt={p.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-sm font-bold">{locale === "ar" ? p.nameAr : p.name}</p>
                  <p className="text-xs text-sand-300">{formatMAD(p.price)}</p>
                </div>
              </Link>
            ))}
            <div className="absolute -bottom-4 -end-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-gray-900 shadow-xl">
              <StarRating rating={4.8} />
              <span className="text-sm font-bold">4,8/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories({ locale, counts }: { locale: Locale; counts: Record<string, number> }) {
  return (
    <section className="container-site py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
            {t(locale, "home_categories_title")}
          </h2>
          <p className="mt-1 text-gray-500">{t(locale, "home_categories_sub")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {ALL_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <Link
              key={cat}
              href={`/produits?cat=${cat}`}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-2xl shadow-md transition group-hover:scale-110`}>
                {meta.emoji}
              </span>
              <span className="text-sm font-semibold text-gray-800">{t(locale, meta.key)}</span>
              <span className="text-xs text-gray-400">
                {counts[cat] ?? 0} {t(locale, "cart_items")}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

type TopSeller = {
  id: string;
  name: string;
  shopName: string | null;
  shopSlug: string | null;
  city: string | null;
  whatsapp: string | null;
  phone: string | null;
  totalSold: number;
  productCount: number;
};

const SELLER_COLORS = [
  "from-brand-500 to-brand-700",
  "from-sand-500 to-sand-700",
  "from-emerald-500 to-emerald-700",
  "from-violet-500 to-violet-700",
  "from-sky-500 to-sky-700",
  "from-rose-500 to-rose-700",
];

function TopShops({ locale, sellers }: { locale: Locale; sellers: TopSeller[] }) {
  if (sellers.length === 0) return null;

  return (
    <section className="container-site py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
            {t(locale, "home_shops_title")}
          </h2>
          <p className="mt-1 text-gray-500">{t(locale, "home_shops_sub")}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller, i) => {
          const displayName = seller.shopName ?? seller.name;
          const colorClass = SELLER_COLORS[i % SELLER_COLORS.length];
          return (
            <Link
              key={seller.id}
              href={`/${seller.shopSlug}`}
              className="group relative flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} text-xl font-black text-white shadow-md transition group-hover:scale-110`}>
                {displayName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-gray-900 group-hover:text-brand-700">
                  {displayName}
                </h3>
                {seller.city && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" /> {seller.city}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-semibold text-brand-600">{seller.productCount} {t(locale, "home_shops_products")}</span>
                  <span>·</span>
                  <span>{seller.totalSold} vendus</span>
                </div>
              </div>
              {seller.whatsapp && (
                <a
                  href={waLink(
                    seller.whatsapp,
                    locale === "ar"
                      ? `مرحبا، لدي سؤال بخصوص متجر « ${displayName} » على Mbag.ma.`
                      : `Bonjour, j'ai une question concernant la boutique « ${displayName} » sur Mbag.ma.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedSection({ locale, products }: { locale: Locale; products: CardProduct[] }) {
  return (
    <section className="bg-sand-50/60 py-8">
      <div className="container-site">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
              {t(locale, "home_featured_title")}
            </h2>
            <p className="mt-1 text-gray-500">{t(locale, "home_featured_sub")}</p>
          </div>
          <Link
            href="/produits"
            className="hidden items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 sm:flex"
          >
            {t(locale, "nav_products")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner({ locale }: { locale: Locale }) {
  return (
    <section className="container-site py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-sand-500 via-sand-600 to-brand-700 p-10 text-white shadow-xl sm:p-14">
        <div className="zellige absolute inset-0" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              <Truck className="h-4 w-4" /> {t(locale, "home_promo_title")}
            </span>
            <h2 className="mt-5 text-3xl font-black sm:text-4xl">{t(locale, "home_promo_sub")}</h2>
            <Link
              href="/produits"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-sand-700 shadow-lg transition hover:bg-sand-50"
            >
              {t(locale, "home_promo_cta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="relative h-48 w-48">
              <ProductArt category="TROUSSE" colors={["#fff7ed", "#f59e0b"]} variant="front" className="rounded-full" />
              <span className="absolute -bottom-2 -start-2 rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-gray-900 shadow-lg">
                {t(locale, "filters_best_price")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ locale }: { locale: Locale }) {
  const steps = [
    { icon: MousePointerClick, title: t(locale, "home_how1t"), desc: t(locale, "home_how1d") },
    { icon: Package, title: t(locale, "home_how2t"), desc: t(locale, "home_how2d") },
    { icon: Search, title: t(locale, "home_how3t"), desc: t(locale, "home_how3d") },
    { icon: PackageCheck, title: t(locale, "home_how4t"), desc: t(locale, "home_how4d") },
  ];
  return (
    <section className="container-site py-16">
      <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
        {t(locale, "home_how_title")}
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg">
            <span className="absolute -top-3 -end-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white shadow">
              {i + 1}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-gray-900">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyUs({ locale }: { locale: Locale }) {
  const items = [
    { icon: ShieldCheck, title: t(locale, "home_why1t"), desc: t(locale, "home_why1d"), color: "bg-emerald-50 text-emerald-600" },
    { icon: CreditCard, title: t(locale, "home_why2t"), desc: t(locale, "home_why2d"), color: "bg-sand-50 text-sand-600" },
    { icon: Search, title: t(locale, "home_why3t"), desc: t(locale, "home_why3d"), color: "bg-brand-50 text-brand-600" },
    { icon: Truck, title: t(locale, "home_why4t"), desc: t(locale, "home_why4d"), color: "bg-violet-50 text-violet-600" },
  ];
  return (
    <section className="bg-gradient-to-b from-white to-brand-50/50 py-16">
      <div className="container-site">
        <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
          {t(locale, "home_why_title")}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${it.color}`}>
                <it.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">{it.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ locale }: { locale: Locale }) {
  const list = [
    { text: t(locale, "testimonial1"), name: t(locale, "testimonial1n"), rating: 5 },
    { text: t(locale, "testimonial2"), name: t(locale, "testimonial2n"), rating: 5 },
    { text: t(locale, "testimonial3"), name: t(locale, "testimonial3n"), rating: 4 },
  ];
  return (
    <section className="container-site py-16">
      <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
        {t(locale, "home_testimonials_title")}
      </h2>
      <p className="mt-1 text-center text-gray-500">{t(locale, "home_testimonials_sub")}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {list.map((item, i) => (
          <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-1">
              {[...Array(item.rating)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{item.text}</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                {item.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-gray-800">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogSection({ locale }: { locale: Locale }) {
  const latest = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <section className="bg-sand-50/60 py-8">
      <div className="container-site">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
              📖 {t(locale, "nav_blog")}
            </h2>
            <p className="mt-1 text-gray-500">{t(locale, "blog_sub")}</p>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 sm:flex"
          >
            {t(locale, "blog_see_all")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {latest.map((post) => {
            const content = locale === "ar" ? post.ar : post.fr;
            const rub = BLOG_RUBRIQUES.find((r) => r.slug === post.rubrique)!;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <span className="flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  <span>{rub.emoji}</span>
                  {rubriqueFor(post.rubrique, locale)}
                </span>
                <h3 className="mt-3 text-base font-bold leading-snug text-gray-900 transition group-hover:text-brand-700">
                  {content.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">{content.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                  {t(locale, "blog_read")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Newsletter({ locale }: { locale: Locale }) {
  return (
    <section className="container-site pb-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-700 to-indigo-900 p-10 text-center text-white shadow-xl sm:p-14">
        <div className="zellige absolute inset-0" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            ✉️ {t(locale, "newsletter_title")}
          </span>
          <h2 className="mx-auto mt-4 max-w-xl text-2xl font-black sm:text-3xl">
            {t(locale, "newsletter_sub")}
          </h2>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
