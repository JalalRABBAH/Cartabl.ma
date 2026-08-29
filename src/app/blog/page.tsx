import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ChevronRight, ArrowRight } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { BLOG_POSTS, BLOG_RUBRIQUES, rubriqueFor, SITE_URL, type BlogPost } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";
import { ArticleBody } from "@/components/blog/article-body";
import { AdSlot } from "@/components/ads/adsense-slot";
import { ADSENSE_SLOTS } from "@/lib/adsense";
import { NewsletterForm } from "@/components/storefront/newsletter-form";

export const metadata: Metadata = {
  title: "Blog — Conseils & guides d'achat de sacs",
  description:
    "Le blog Mbag.ma : comment choisir votre cartable, sac à dos, sac ordinateur ou sac de voyage. Guides, tendances et conseils pour acheter malin au Maroc.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Le blog Mbag.ma — Sacs & cartables",
    description:
      "Guides, tendances et conseils pour bien choisir vos sacs au Maroc : cartables, sacs à dos, sacs ordinateur, voyage et accessoires.",
    type: "website",
    url: `${SITE_URL}/blog`,
  },
};

type Featured = { post: BlogPost };

async function FeaturedPostCard({ post }: Featured) {
  const locale = await getLocale();
  const rub = BLOG_RUBRIQUES.find((r) => r.slug === post.rubrique)!;
  const content = locale === "ar" ? post.ar : post.fr;
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`} className="block p-7 sm:p-9">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700">
            {rub.emoji} {rubriqueFor(post.rubrique, locale)}
          </span>
          <span className="text-gray-400">
            {new Date(post.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-black leading-tight text-gray-900 transition group-hover:text-brand-700 sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-500 sm:text-lg">{content.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition group-hover:gap-3">
          {t(locale, "blog_read")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      </Link>
    </article>
  );
}

export default async function BlogPage() {
  const locale = await getLocale();
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const rest = BLOG_POSTS.filter((p) => p.slug !== featured.slug);
  const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "ar" ? "مدونة Mbag.ma" : "Le blog Mbag.ma",
    itemListElement: BLOG_POSTS.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: locale === "ar" ? post.ar.title : post.fr.title,
    })),
  };

  return (
    <div className="container-site py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-10 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
            <Newspaper className="h-4 w-4" /> {t(locale, "nav_blog")}
          </span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">{t(locale, "blog_title")}</h1>
          <p className="mt-2 max-w-2xl text-gray-500">{t(locale, "blog_sub")}</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-md">
          {BLOG_RUBRIQUES.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/rubrique/${r.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              <span>{r.emoji}</span> {rubriqueFor(r.slug, locale)}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <FeaturedPostCard post={featured} />

          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((post, i) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          <AdSlot slot={ADSENSE_SLOTS.blogIndex} className="mx-auto max-w-3xl" />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-black text-gray-900">{t(locale, "blog_latest")}</h2>
            <ul className="mt-4 space-y-4">
              {sorted.map((post) => {
                const content = locale === "ar" ? post.ar : post.fr;
                const rub = BLOG_RUBRIQUES.find((r) => r.slug === post.rubrique)!;
                return (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
                      <span className="text-xs font-semibold text-brand-600">
                        {rub.emoji} {rubriqueFor(post.rubrique, locale)}
                      </span>
                      <span className="mt-0.5 text-sm font-bold leading-snug text-gray-800 transition group-hover:text-brand-700">
                        {content.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-black text-gray-900">{t(locale, "blog_by_rubrique")}</h2>
            <ul className="mt-4 space-y-2">
              {BLOG_RUBRIQUES.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/rubrique/${r.slug}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className="flex items-center gap-2">
                      <span>{r.emoji}</span>
                      {rubriqueFor(r.slug, locale)}
                    </span>
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <AdSlot slot={ADSENSE_SLOTS.blogSidebar} />

          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-indigo-900 p-6 text-white shadow-lg">
            <h2 className="text-lg font-black">🛍️ {t(locale, "blog_products")}</h2>
            <p className="mt-2 text-sm text-brand-100">
              {locale === "ar"
                ? "تصفحوا تشكيلتنا الكاملة: حقائب مدرسية، حقائب ظهر، حواسيب وحقائب سفر مع توصيل سريع."
                : "Découvrez toute la collection : cartables, sacs à dos, sacs ordinateur et voyage, livrés rapidement."}
            </p>
            <Link
              href="/produits"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              {t(locale, "blog_products")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-black text-gray-900">✉️ {t(locale, "newsletter_title")}</h2>
            <p className="mt-1 text-sm text-gray-500">{t(locale, "newsletter_sub")}</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}