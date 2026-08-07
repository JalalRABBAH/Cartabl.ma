import { Plus } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export default async function FaqPage() {
  const locale = await getLocale();
  const faqs = [
    { q: t(locale, "faq1q"), a: t(locale, "faq1a") },
    { q: t(locale, "faq2q"), a: t(locale, "faq2a") },
    { q: t(locale, "faq3q"), a: t(locale, "faq3a") },
    { q: t(locale, "faq4q"), a: t(locale, "faq4a") },
    { q: t(locale, "faq5q"), a: t(locale, "faq5a") },
    { q: t(locale, "faq6q"), a: t(locale, "faq6a") },
  ];
  return (
    <div className="container-site max-w-3xl py-14">
      <h1 className="text-center text-3xl font-black text-gray-900">{t(locale, "faq_title")}</h1>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-3xl border border-gray-100 bg-white shadow-sm open:border-brand-200 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
