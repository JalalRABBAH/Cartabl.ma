import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale-server";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const locale = await getLocale();
  const session = await getSessionUser();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">{t(locale, "admin_users_page_title")}</h1>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">{users.length}</span>
      </div>
      <UsersTable
        selfId={session?.id ?? ""}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          active: u.active,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
