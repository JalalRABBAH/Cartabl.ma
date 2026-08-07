import { Package, HeartHandshake, Sparkles, Award } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export default async function AboutPage() {
  const locale = await getLocale();
  const values = [
    { icon: Award, title: t(locale, "home_why1t"), desc: t(locale, "home_why1d") },
    { icon: HeartHandshake, title: t(locale, "footer_pay_cod"), desc: t(locale, "footer_pay_cod_d") },
    { icon: Sparkles, title: t(locale, "home_why3t"), desc: t(locale, "home_why3d") },
    { icon: Package, title: t(locale, "home_why4t"), desc: t(locale, "home_why4d") },
  ];
  return (
    <div className="container-site max-w-4xl py-14">
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-200">
          <Package className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-3xl font-black text-gray-900">{t(locale, "about_title")}</h1>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-gray-600">
        {t(locale, "about_sub")}
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {values.map((v, i) => (
          <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <v.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-bold text-gray-900">{v.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
