import { Mail, Phone, Clock, MessageCircle, MapPin } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export default async function ContactPage() {
  const locale = await getLocale();
  const cards = [
    { icon: Phone, label: t(locale, "contact_phone"), value: "+212 6 00 00 00 00", sub: t(locale, "contact_hours") },
    { icon: Mail, label: t(locale, "contact_email"), value: "contact@mbag.ma", sub: t(locale, "contact_sub") },
    { icon: MessageCircle, label: t(locale, "contact_whatsapp"), value: "+212 6 00 00 00 00", sub: "24/7" },
    { icon: MapPin, label: t(locale, "account_city"), value: "Casablanca", sub: "Maroc" },
  ];
  return (
    <div className="container-site max-w-4xl py-14">
      <h1 className="text-center text-3xl font-black text-gray-900">{t(locale, "contact_title")}</h1>
      <p className="mx-auto mt-2 max-w-md text-center text-gray-500">{t(locale, "contact_sub")}</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <c.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-400">{c.label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900" dir="ltr">{c.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" /> {c.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
