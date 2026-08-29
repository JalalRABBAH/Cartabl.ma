import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { BLOG_RUBRIQUES, postsByRubrique, SITE_URL, type RubriqueSlug } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { AdSlot } from "@/components/ads/adsense-slot";
import { ADSENSE_SLOTS } from "@/lib/adsense";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_RUBRIQUES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rub = BLOG_RUBRIQUES.find((r) => r.slug === slug as RubriqueSlug);
  if (!rub) return { title: "Rubrique introuvable" };

  const url = `${SITE_URL}/blog/rubrique/${rub.slug}`;
  return {
    title: `${rub.fr.name} — Blog Mbag.ma`,
    description: rub.fr.desc,
    alternates: { canonical: url },
    openGraph: { title: rub.fr.name, description: rub.fr.desc, type: "website", url },
  };
}

export default async function BlogRubriquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const rub = BLOG_RUBRIQUES.find((r) => r.slug === slug as RubriqueSlug);
  if (!rub) notFound();

  const posts = postsByRubrique(slug as RubriqueSlug);
  const meta = locale === "ar" ? rub.ar : rub.fr;
  const url = `${SITE_URL}/blog/rubrique/${rub.slug}`;
  const fromProducts = locale === "ar" ? "المتجر" : "la boutique";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    mainEntity: {
      "@type": "ItemList",
      name: meta.name,
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: locale === "ar" ? p.ar.title : p.fr.title,
      })),
    },
  };

  return (
    <div className="container-site py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/" className="transition hover:text-brand-600">{t(locale, "nav_home")}</Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" />
        <ChevronRight className="hidden h-3.5 w-3.5 rtl:block" />
        <Link href="/blog" className="transition hover:text-brand-600">{t(locale, "blog_title")}</Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" />
        <ChevronRight className="hidden h-3.5 w-3.5 rtl:block" />
        <span className="text-gray-500">{meta.name}</span>
      </nav>

      <div className="mb-10 flex flex-col gap-6 rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-sand-50 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-4xl">{rub.emoji}</span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">{meta.name}</h1>
          <p className="mt-2 max-w-2xl text-gray-500">{meta.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
            {BLOG_RUBRIQUES.filter((r) => r.slug !== rub.slug).map((r) => (
              <Link
                key={r.slug}
                href={`/blog/rubrique/${r.slug}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 font-semibold text-gray-600 transition hover:border-brand-300 hover:text-brand-700"
              >
                {r.emoji} {locale === "ar" ? r.ar.name : r.fr.name}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href={rub.productCat ? `/produits?cat=${rub.productCat}` : "/produits"}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
        >
          {t(locale, "blog_products")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i + 1} />
          ))}
        </div>

        <AdSlot slot={ADSENSE_SLOTS.blogRubrique} className="mx-auto max-w-3xl" />

        <p className="max-w-3xl text-sm leading-relaxed text-gray-500">
          {locale === "ar"
            ? `كل مقالات الفئة «${meta.name}» قادمة من ${fromProducts} Mbag.ma : محتوى مصمَّم لمساعدتك على الشراء براحة تامة، مع توصيل سريع ودفع عند الاستلام في كبريات المدن المغربية.`
            : `Retrouvez ici tous nos articles dans la catégorie « ${meta.name.toLowerCase()} », rédigés par la boutique Mbag.ma pour vous aider à acheter en toute confiance, avec livraison rapide et paiement à la livraison dans les grandes villes du Maroc.`}
        </p>
      </div>
    </div>
  );
}