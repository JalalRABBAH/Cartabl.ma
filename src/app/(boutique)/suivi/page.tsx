import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { TrackForm } from "@/components/storefront/track-form";

export const metadata: Metadata = { title: "Suivi de commande" };

export default async function TrackPage() {
  const locale = await getLocale();
  return (
    <div className="container-site max-w-3xl py-16">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-200">
          <PackageSearch className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-gray-900">{t(locale, "track_title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-500">{t(locale, "track_subtitle")}</p>
      </div>

      <div className="mt-10 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
        <TrackForm />
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-sand-50 p-3 text-xs text-sand-800">
          💡 {t(locale, "track_tip")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["CM-AZ7K2Q", "CM-MX9D4T", "CM-BW3H8R"].map((code) => (
          <a
            key={code}
            href={`/suivi/${code}`}
            className="group rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:border-brand-200 hover:shadow-md"
          >
            <p className="font-mono text-sm font-bold tracking-widest text-brand-600 group-hover:underline">
              {code}
            </p>
            <p className="mt-1 text-xs text-gray-400">{t(locale, "track_btn")} →</p>
          </a>
        ))}
      </div>
    </div>
  );
}
