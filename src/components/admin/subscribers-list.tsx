"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Mail } from "lucide-react";
import { useLocale } from "@/app/providers";

export type AdminSubscriber = { id: string; email: string; createdAt: string };

export function SubscribersList({ subscribers }: { subscribers: AdminSubscriber[] }) {
  const { T, locale } = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const remove = async (id: string) => {
    if (!window.confirm(T("admin_delete_subscriber"))) return;
    setBusy(id);
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    setBusy(null);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {subscribers.length === 0 ? (
        <div className="py-16 text-center text-gray-500">{T("admin_subscribers_empty")}</div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {subscribers.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="font-semibold text-gray-800" dir="ltr">{s.email}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
                    dateStyle: "medium",
                  }).format(new Date(s.createdAt))}
                </span>
                <button
                  onClick={() => remove(s.id)}
                  disabled={busy === s.id}
                  className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label={T("admin_delete")}
                >
                  {busy === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
