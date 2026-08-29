import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Store, Truck, PackageSearch, ArrowRight, Package } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { formatMAD } from "@/lib/utils";
import { StatusBadge } from "@/components/tracking/order-timeline";
import { LogoutButton } from "@/components/storefront/logout-button";
import { ProfileForm } from "@/components/storefront/profile-form";
import { CancelOrderButton } from "@/components/storefront/cancel-order-button";
import { RoleAvatar, RoleBadge } from "@/components/storefront/role-identity";
import { cn } from "@/lib/utils";

export default async function AccountPage() {
  const locale = await getLocale();
  const user = await getSessionUser();
  if (!user) redirect("/compte/connexion");

  const [dbUser, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="container-site max-w-5xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <RoleAvatar role={user.role} initial={dbUser?.name.charAt(0) ?? "?"} size="lg" />
          <div>
            <p className="text-sm text-gray-400">{t(locale, "account_welcome")} 👋</p>
            <h1 className="text-2xl font-black text-gray-900">{dbUser?.name}</h1>
            <p className="text-sm text-gray-500">{dbUser?.email}</p>
            <div className="mt-1.5">
              <RoleBadge role={user.role} locale={locale} />
            </div>
          </div>
        </div>
        <LogoutButton />
      </div>

      {(user.role === "SELLER" || user.role === "ADMIN") && (
        <Link
          href="/marchand"
          className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-5 text-white shadow-md transition hover:opacity-95"
        >
          <span className="flex items-center gap-3">
            <Store className="h-6 w-6" />
            <span className="font-bold">{t(locale, "nav_merchant")}</span>
          </span>
          <ArrowRight className="h-5 w-5 rtl:rotate-180" />
        </Link>
      )}
      {user.role === "DELIVERY" && (
        <Link
          href="/livreur"
          className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-sand-600 to-sand-700 p-5 text-white shadow-md transition hover:opacity-95"
        >
          <span className="flex items-center gap-3">
            <Truck className="h-6 w-6" />
            <span className="font-bold">{t(locale, "nav_delivery")}</span>
          </span>
          <ArrowRight className="h-5 w-5 rtl:rotate-180" />
        </Link>
      )}

      <h2 className="mt-10 flex items-center gap-2 text-xl font-black text-gray-900">
        <Package className="h-5 w-5 text-brand-600" /> {t(locale, "account_my_orders")}
      </h2>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">{t(locale, "account_no_orders")}</p>
          <Link href="/produits" className="mt-4 inline-block text-sm font-bold text-brand-600 hover:underline">
            {t(locale, "cart_empty_cta")} →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-gray-900">{o.number}</span>
                  <StatusBadge status={o.status} locale={locale} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
                      dateStyle: "medium",
                    }).format(o.createdAt)}
                  </span>
                  <span className="text-base font-extrabold text-gray-900">{formatMAD(o.total)}</span>
                  <Link
                    href={`/suivi/${o.trackingCode}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700",
                    )}
                  >
                    {t(locale, "account_track")} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                  {o.status === "PENDING" && (
                    <CancelOrderButton orderNumber={o.number} />
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
                {o.items.map((it) => (
                  <span key={it.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    {it.productName} × {it.quantity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <ProfileForm
          user={{
            name: dbUser?.name ?? "",
            phone: dbUser?.phone ?? null,
            whatsapp: dbUser?.whatsapp ?? null,
            city: dbUser?.city ?? null,
            address: dbUser?.address ?? null,
          }}
        />
      </div>
    </div>
  );
}
