import Link from "next/link";
import { Package, Truck } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { LogoutButton } from "@/components/storefront/logout-button";

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const locale = await getLocale();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="container-site flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-500 to-sand-700 text-white shadow">
              <Truck className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-gray-900">
              {t(locale, "nav_delivery")}
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Mbag.ma
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-sand-50 px-3 py-1.5 text-xs font-bold text-sand-700 sm:block">
              {user?.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container-site py-8">{children}</main>
    </div>
  );
}
