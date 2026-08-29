import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronRight, ChevronLeft, ChevronDown, ArrowUpRight, ArrowRight as ArrowRightIcon } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import {
  BLOG_POSTS,
  BLOG_RUBRIQUES,
  rubriqueFor,
  relatedPosts,
  getPost,
  SITE_URL,
} from "@/lib/blog";
import { ArticleBody } from "@/components/blog/article-body";
import { PostCard } from "@/components/blog/post-card";
import { AdSlot } from "@/components/ads/adsense-slot";
import { ADSENSE_SLOTS } from "@/lib/adsense";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article introuvable" };

  const locale = "fr";
  const content = post.fr;
  const rub = BLOG_RUBRIQUES.find((r) => r.slug === post.rubrique)!;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: content.title,
    description: content.excerpt,
    alternates: { canonical: url },
    keywords: [rub.fr.name, "sacs", "cartables", "Mbag.ma", "Maroc"],
    authors: [{ name: "Mbag.ma" }],
    openGraph: {
      title: content.title,
      description: content.excerpt,
      type: "article",
      url,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: ["Mbag.ma"],
      tags: [rub.fr.name],
      siteName: "Mbag.ma",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.excerpt,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getPost(slug);
  if (!post) notFound();

  const rub = BLOG_RUBRIQUES.find((r) => r.slug === post.rubrique)!;
  const content = locale === "ar" ? post.ar : post.fr;
  const related = relatedPosts(post);
  const published = new Date(post.date);
  const updated = post.updated ? new Date(post.updated) : undefined;
  const faq = locale === "ar" ? post.faq?.ar : post.faq?.fr;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: content.title,
    description: content.excerpt,
    image: `${SITE_URL}/logo.png`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Organization", name: "Mbag.ma", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Mbag.ma",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    articleSection: rubriqueFor(post.rubrique, "fr"),
    keywords: `${rubriqueFor(post.rubrique, "fr")}, sacs, cartables, Maroc`,
    inLanguage: locale === "ar" ? "ar" : "fr",
    about: "Sacs, cartables et accessoires scolaires",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t(locale, "blog_title"), item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 2,
        name: rubriqueFor(post.rubrique, locale),
        item: `${SITE_URL}/blog/rubrique/${rub.slug}`,
      },
      { "@type": "ListItem", position: 3, name: content.title, item: url },
    ],
  };
  const faqJsonLd = faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="container-site py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd, faqJsonLd].filter(Boolean)) }}
      />

      <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/" className="transition hover:text-brand-600">{t(locale, "nav_home")}</Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" />
        <ChevronRight className="hidden h-3.5 w-3.5 rtl:block" />
        <Link href="/blog" className="transition hover:text-brand-600">{t(locale, "blog_title")}</Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" />
        <ChevronRight className="hidden h-3.5 w-3.5 rtl:block" />
        <Link href={`/blog/rubrique/${rub.slug}`} className="transition hover:text-brand-600">
          {rubriqueFor(post.rubrique, locale)}
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:hidden" />
        <ChevronRight className="hidden h-3.5 w-3.5 rtl:block" />
        <span className="text-gray-500">{content.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          <header className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              {rub.emoji} {rubriqueFor(post.rubrique, locale)}
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-gray-500">{content.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-500" />
                {t(locale, "blog_published")}{" "}
                {published.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
              </span>
              {updated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-sand-500" />
                  {t(locale, "blog_updated")}{" "}
                  {updated.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readTime} {t(locale, "blog_min")}
              </span>
            </div>
          </header>

          <div className="border-t border-gray-100 py-8">
            <ArticleBody blocks={content.body} />
          </div>

          <AdSlot slot={ADSENSE_SLOTS.blogArticle} className="mx-auto mb-8 max-w-3xl" />

          {faq && faq.length > 0 && (
            <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black text-gray-900">{t(locale, "blog_faq")}</h2>
              <div className="mt-4 space-y-3">
                {faq.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-gray-100 bg-gray-50/60" open={false}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-gray-800 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="h-4 w-4 shrink-0 text-brand-600 transition group-open:rotate-180" />
                    </summary>
                    <p className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-500">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/blog/rubrique/${rub.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:text-brand-700"
            >
              <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
              {rubriqueFor(post.rubrique, locale)}
            </Link>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
            >
              {t(locale, "blog_products")}
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <AdSlot slot={ADSENSE_SLOTS.blogSidebar} />

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(locale, "blog_by_rubrique")}</span>
            <ul className="mt-3 space-y-2">
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
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {related.length > 0 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="font-black text-gray-900">{t(locale, "blog_related")}</h2>
              <ul className="mt-4 space-y-4">
                {related.map((p) => {
                  const c = locale === "ar" ? p.ar : p.fr;
                  const r = BLOG_RUBRIQUES.find((x) => x.slug === p.rubrique)!;
                  return (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="group flex flex-col">
                        <span className="text-xs font-semibold text-brand-600">
                          {r.emoji} {rubriqueFor(p.rubrique, locale)}
                        </span>
                        <span className="mt-0.5 text-sm font-bold leading-snug text-gray-800 transition group-hover:text-brand-700">
                          {c.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}