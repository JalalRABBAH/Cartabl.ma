import Link from "next/link";
import Image from "next/image";
import { MapPin, Menu, X, User, Truck, Store, Search, ShieldCheck } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { getSessionUser } from "@/lib/auth";
import { homePathFor } from "@/lib/role-nav";
import { SearchBox } from "./search-box";
import { LanguageSwitcher } from "./language-switcher";
import { CartButton } from "./cart-button";

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Mbag.ma"
        width={130}
        height={44}
        className="h-11 w-auto rounded-xl object-contain shadow-md shadow-brand-200 transition-transform group-hover:-rotate-6"
        priority
      />
    </Link>
  );
}

export async function StoreHeader() {
  const locale = await getLocale();
  const user = await getSessionUser();

  const nav = [
    { href: "/", label: t(locale, "nav_home") },
    { href: "/produits", label: t(locale, "nav_products") },
    { href: "/blog", label: t(locale, "nav_blog") },
    { href: "/suivi", label: t(locale, "nav_track") },
    { href: "/contact", label: t(locale, "nav_contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-sand-600 text-white">
        <div className="container-site flex items-center justify-center gap-2 py-1.5 text-xs font-medium">
          <MapPin className="h-3.5 w-3.5" />
          {locale === "ar"
            ? "توصيل سريع إلى المدن الكبرى · الدفع عند الاستلام"
            : "Livraison Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir · Paiement à la livraison"}
        </div>
      </div>
      <div className="container-site flex items-center gap-4 py-3">
        <Logo />
        <div className="hidden flex-1 lg:block">
          <SearchBox className="mx-auto max-w-md" />
        </div>
        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          {user ? (
            <Link
              href={homePathFor(user.role)}
              className="hidden h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-300 sm:flex"
              title={user.name}
            >
              {user.role === "SELLER" ? (
                <Store className="h-4 w-4 text-sand-600" />
              ) : user.role === "DELIVERY" ? (
                <Truck className="h-4 w-4 text-sky-600" />
              ) : user.role === "ADMIN" ? (
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
              ) : (
                <User className="h-4 w-4 text-brand-600" />
              )}
              <span className="max-w-28 truncate">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/compte/connexion"
              className="hidden h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-300 sm:flex"
            >
              <User className="h-4 w-4 text-brand-600" />
              {t(locale, "nav_login")}
            </Link>
          )}
          <CartButton />
          <MobileMenu locale={locale} role={user?.role ?? null} />
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 lg:hidden">
        <SearchBox />
      </div>
    </header>
  );
}

function MobileMenu({ locale, role }: { locale: "fr" | "ar"; role: string | null }) {
  const links = [
    { href: "/", label: t(locale, "nav_home") },
    { href: "/produits", label: t(locale, "nav_products") },
    { href: "/blog", label: t(locale, "nav_blog") },
    { href: "/suivi", label: t(locale, "nav_track") },
    { href: "/contact", label: t(locale, "nav_contact") },
    ...(role === "ADMIN"
      ? [{ href: "/admin", label: t(locale, "nav_admin") }]
      : role === "SELLER"
        ? [{ href: "/marchand", label: t(locale, "nav_merchant") }]
        : role === "DELIVERY"
          ? [{ href: "/livreur", label: t(locale, "nav_delivery") }]
          : [{ href: "/compte", label: t(locale, "nav_account") }]),
  ];
  return (
    <div className="relative xl:hidden">
      <details className="group">
        <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition [&::-webkit-details-marker]:hidden">
          <Menu className="h-5 w-5 group-open:hidden" />
          <X className="hidden h-5 w-5 group-open:block" />
        </summary>
        <div className="absolute end-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
          <div className="flex justify-end px-2 py-1">
            <LanguageSwitcher />
          </div>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {l.href === "/marchand" ? (
                <Store className="h-4 w-4" />
              ) : l.href === "/livreur" ? (
                <Truck className="h-4 w-4" />
              ) : l.href === "/admin" ? (
                <ShieldCheck className="h-4 w-4" />
              ) : l.href === "/compte" ? (
                <User className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {l.label}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
