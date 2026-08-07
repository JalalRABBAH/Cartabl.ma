import { Truck, MapPin, RotateCcw, ShieldCheck, Clock } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { CITIES, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export default async function DeliveryPage() {
  const locale = await getLocale();
  const steps = [
    { icon: Truck, t: t(locale, "home_how3t"), d: t(locale, "home_how3d") },
    { icon: ShieldCheck, t: t(locale, "home_why2t"), d: t(locale, "home_why2d") },
    { icon: RotateCcw, t: t(locale, "faq4q"), d: t(locale, "faq4a") },
  ];
  return (
    <div className="container-site max-w-4xl py-14">
      <h1 className="text-center text-3xl font-black text-gray-900">{t(locale, "delivery_page_title")}</h1>
      <p className="mx-auto mt-2 max-w-lg text-center text-gray-500">{t(locale, "delivery_page_sub")}</p>

      <div className="mt-10 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-black text-gray-900">
          <MapPin className="h-5 w-5 text-brand-600" /> {t(locale, "checkout_city")}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400 rtl:text-right">
                <th className="pb-3 font-semibold">{t(locale, "checkout_city")}</th>
                <th className="pb-3 font-semibold">{t(locale, "cart_shipping")}</th>
                <th className="pb-3 font-semibold">{t(locale, "order_estimate")}</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((c) => (
                <tr key={c.name} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-semibold text-gray-800">
                    {locale === "ar" ? c.nameAr : c.name}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                      <Clock className="h-3 w-3" />
                      {formatMAD(c.fee)}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{c.deliveryDays[0]}–{c.deliveryDays[1]} {t(locale, "common_days")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded-xl bg-sand-50 p-3 text-sm font-semibold text-sand-800">
          🚚 {t(locale, "home_promo_title")} — {t(locale, "cart_shipping_free")} dès {formatMAD(FREE_SHIPPING_THRESHOLD)}.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-bold text-gray-900">{s.t}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
