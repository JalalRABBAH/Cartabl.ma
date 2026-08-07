import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { SubscribersList } from "@/components/admin/subscribers-list";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const locale = await getLocale();

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">{t(locale, "admin_subscribers_title")}</h1>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
          {subscribers.length}
        </span>
      </div>
      <SubscribersList
        subscribers={subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
