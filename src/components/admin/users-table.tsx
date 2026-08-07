"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, Ban, Check } from "lucide-react";
import { useLocale } from "@/app/providers";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  active: boolean;
  createdAt: string;
};

const ROLES = ["BUYER", "SELLER", "DELIVERY", "ADMIN"] as const;

const roleLabel = (role: string, T: (k: MessageKey) => string) => {
  switch (role) {
    case "SELLER":
      return T("role_seller");
    case "DELIVERY":
      return T("role_delivery");
    case "ADMIN":
      return T("role_admin");
    default:
      return T("role_buyer");
  }
};

export function UsersTable({ users, selfId }: { users: AdminUser[]; selfId: string }) {
  const { T, locale } = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<"" | "ok" | "err">("");

  const save = async (id: string, data: { role?: string; active?: boolean }) => {
    setBusy(id);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 422) {
        setMsg("err");
        return;
      }
      if (!res.ok) {
        setMsg("err");
        return;
      }
      setMsg("ok");
      router.refresh();
    } catch {
      setMsg("err");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">{locale === "ar" ? "الاسم" : "Nom"}</th>
              <th className="px-5 py-3">{T("admin_user_role")}</th>
              <th className="px-5 py-3">{T("admin_user_created")}</th>
              <th className="px-5 py-3">{T("admin_user_status")}</th>
              <th className="px-5 py-3 text-right">{T("merchant_actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="transition hover:bg-gray-50/60">
                <td className="px-5 py-3.5">
                  <p className="font-bold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400" dir="ltr">{u.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={u.role}
                    disabled={u.id === selfId || busy === u.id}
                    onChange={(e) => save(u.id, { role: e.target.value })}
                    className="h-8 cursor-pointer rounded-lg border border-gray-200 bg-white px-2 text-xs font-semibold outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {roleLabel(r, T)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500">
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
                    dateStyle: "medium",
                  }).format(new Date(u.createdAt))}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                      u.active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
                    )}
                  >
                    {u.active ? <Check className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                    {u.active ? T("admin_activate") : T("admin_deactivate")}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    disabled={u.id === selfId || busy === u.id}
                    onClick={() => save(u.id, { active: !u.active })}
                    className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy === u.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : u.active ? (
                      T("admin_deactivate")
                    ) : (
                      T("admin_activate")
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {msg === "ok" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> {T("admin_saved")}
        </p>
      )}
      {msg === "err" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("checkout_error")}
        </p>
      )}
    </div>
  );
}
