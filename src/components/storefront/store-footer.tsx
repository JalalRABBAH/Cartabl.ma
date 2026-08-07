import Link from "next/link";
import { Package, Phone, Mail, MapPin, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function StoreFooter() {
  const locale = await getLocale();

  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-950 text-gray-300">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Package className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-white">
              Cartabl<span className="text-brand-400">.ma</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">{t(locale, "footer_about")}</p>
          <p className="mt-4 text-xs text-gray-500">{t(locale, "footer_made")}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {t(locale, "footer_shop")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/produits" className="text-gray-400 transition hover:text-brand-400">{t(locale, "cat_classique")}</Link></li>
            <li><Link href="/produits?cat=DOS" className="text-gray-400 transition hover:text-brand-400">{t(locale, "cat_dos")}</Link></li>
            <li><Link href="/produits?cat=ROULETTES" className="text-gray-400 transition hover:text-brand-400">{t(locale, "cat_roulettes")}</Link></li>
            <li><Link href="/produits?cat=TROUSSE" className="text-gray-400 transition hover:text-brand-400">{t(locale, "cat_trousse")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {t(locale, "footer_help")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/suivi" className="text-gray-400 transition hover:text-brand-400">{t(locale, "nav_track")}</Link></li>
            <li><Link href="/livraison" className="text-gray-400 transition hover:text-brand-400">{t(locale, "footer_delivery_link")}</Link></li>
            <li><Link href="/faq" className="text-gray-400 transition hover:text-brand-400">{t(locale, "footer_faq_link")}</Link></li>
            <li><Link href="/apropos" className="text-gray-400 transition hover:text-brand-400">{t(locale, "footer_about_link")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {t(locale, "footer_contact_t")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-brand-400" /> +212 6 00 00 00 00</li>
            <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-brand-400" /> contact@cartabl.ma</li>
            <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-brand-400" /> Casablanca, Maroc</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300">
              <Truck className="h-3.5 w-3.5 text-brand-400" /> {t(locale, "footer_pay_cod")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> {t(locale, "footer_pay_cod_d")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300">
              <CreditCard className="h-3.5 w-3.5 text-sand-400" /> 6 villes
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Cartabl.ma — {t(locale, "footer_rights")}</p>
          <p className="flex items-center gap-1.5">{t(locale, "brandName")}</p>
        </div>
      </div>
    </footer>
  );
}
