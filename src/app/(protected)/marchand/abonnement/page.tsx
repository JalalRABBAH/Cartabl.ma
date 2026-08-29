import Link from "next/link";
import { CalendarCheck, Sparkles, Store, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getSellerSubscription, subscriptionStatus, daysLeft } from "@/lib/subscription";
import { SubscribeButton } from "@/components/merchant/subscribe-button";

function formatDate(d: Date | null, locale: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function SubscriptionPage() {
  const locale = await getLocale();
  const session = await getSessionUser();
  const sub = await getSellerSubscription(session?.id ?? "");
  const status = subscriptionStatus(sub);
  const left = daysLeft(sub);

  const benefits = [t(locale, "sub_benefit1"), t(locale, "sub_benefit2"), t(locale, "sub_benefit3")];

  const statusMeta = {
    ACTIVE: { icon: CheckCircle2, label: t(locale, "sub_active"), cls: "bg-emerald-50 text-emerald-700" },
    TRIAL: { icon: Sparkles, label: t(locale, "sub_trial"), cls: "bg-sand-50 text-sand-700" },
    EXPIRED: { icon: AlertTriangle, label: t(locale, "sub_expired"), cls: "bg-red-50 text-red-700" },
    NONE: { icon: Store, label: t(locale, "sub_none"), cls: "bg-gray-100 text-gray-600" },
  } as const;
  const meta = statusMeta[status];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/marchand" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> {t(locale, "merchant_overview")}
      </Link>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-sand-500 to-sand-700 px-8 py-10 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sand-100">
            <Store className="h-4 w-4" /> Mbag.ma
          </div>
          <h1 className="mt-2 text-3xl font-black">{t(locale, "sub_page_title")}</h1>
          <p className="mt-1 text-sand-100">{t(locale, "sub_page_desc")}</p>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">{t(locale, "sub_plan_title")}</h2>
              <p className="mt-1 text-3xl font-black text-brand-600">{t(locale, "sub_price")}</p>
              <p className="mt-1 text-sm text-gray-500">{t(locale, "sub_price_desc")}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${meta.cls}`}>
              <meta.icon className="h-4 w-4" /> {meta.label}
            </span>
          </div>

          {status === "TRIAL" && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-sand-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-6 w-6 text-sand-600" />
                <div>
                  <p className="text-sm font-bold text-sand-800">{t(locale, "sub_days_left", { days: left })}</p>
                  <p className="text-xs text-sand-600">
                    {t(locale, "sub_since")} {formatDate(sub?.trialStartedAt ?? null, locale)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "ACTIVE" && sub?.paidUntil && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5" /> {t(locale, "sub_active_until")} {formatDate(sub.paidUntil, locale)}
              </p>
            </div>
          )}

          {status === "EXPIRED" && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="text-sm font-bold text-red-800">{t(locale, "sub_expired_banner")}</p>
            </div>
          )}

          {(status === "TRIAL" || status === "EXPIRED") && (
            <div className="mt-6">
              <SubscribeButton />
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <p className="text-sm font-bold text-gray-700">{t(locale, "sub_vendor_benefits")}</p>
            <ul className="mt-3 space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
