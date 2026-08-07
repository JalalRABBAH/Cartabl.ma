"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useLocale } from "@/app/providers";

export function GuestBanner() {
  const { T } = useLocale();
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setHasAccount(Boolean(data.user));
      })
      .catch(() => {
        if (!cancelled) setHasAccount(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (hasAccount === null || hasAccount === true) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow">
          <UserPlus className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-gray-900">{T("guest_cart_title")}</p>
          <p className="text-xs text-gray-500">{T("guest_cart_desc")}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/compte/connexion" className="text-sm font-bold text-brand-600 hover:underline">
          {T("account_signin_link")}
        </Link>
        <Link
          href="/compte/inscription"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-semibold text-white transition hover:bg-brand-700"
        >
          <UserPlus className="h-4 w-4" /> {T("guest_cart_cta")}
        </Link>
      </div>
    </div>
  );
}
