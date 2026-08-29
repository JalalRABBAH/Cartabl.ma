import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { rubriqueFor, type BlogPost } from "@/lib/blog";
import { BLOG_RUBRIQUES } from "@/lib/blog";

export async function PostCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const locale = await getLocale();
  const rub = BLOG_RUBRIQUES.find((r) => r.slug === post.rubrique);
  const content = locale === "ar" ? post.ar : post.fr;

  return (
    <article
      className={`group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg ${
        index === 0 && post.featured ? "lg:col-span-2 lg:grid lg:grid-cols-2" : ""
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`flex flex-1 flex-col gap-4 p-6 ${index === 0 && post.featured ? "lg:gap-6 lg:p-8" : ""}`}
      >
        {rub && (
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            <span>{rub.emoji}</span>
            {rubriqueFor(post.rubrique, locale)}
          </span>
        )}
        <div className="flex flex-1 flex-col">
          <h3 className={`font-black text-gray-900 transition group-hover:text-brand-700 ${index === 0 && post.featured ? "text-xl lg:text-2xl" : "text-lg"}`}>
            {content.title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed text-gray-500 ${index === 0 && post.featured ? "text-base" : ""}`}>
            {content.excerpt}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime} {t(locale, "blog_min")}
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-brand-600 transition group-hover:gap-2">
            {t(locale, "blog_read")}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </span>
        </div>
      </Link>
    </article>
  );
}