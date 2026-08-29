import Link from "next/link";
import { Package } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { LogoutButton } from "@/components/storefront/logout-button";
import { NavTabs } from "@/components/merchant/nav-tabs";

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const locale = await getLocale();

  const tabs = [
    { href: "/marchand", label: t(locale, "merchant_overview"), icon: "LayoutDashboard" },
    { href: "/marchand/commandes", label: t(locale, "merchant_orders"), icon: "ClipboardList" },
    { href: "/marchand/produits", label: t(locale, "merchant_products"), icon: "Boxes" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="container-site flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-500 to-sand-700 text-white shadow">
              <Package className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-gray-900">
              {t(locale, "nav_merchant")}
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Mbag.ma
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 sm:block">
              {user?.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <NavTabs tabs={[...tabs]} />

      <main className="container-site py-8">{children}</main>
    </div>
  );
}
