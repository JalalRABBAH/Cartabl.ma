"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2, CheckCircle2, AlertCircle, Store, Link2 } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

type Initial = { shopName: string | null; shopSlug: string | null; whatsapp: string | null };

export function ShopSettings({ initial }: { initial: Initial }) {
  const { T } = useLocale();
  const router = useRouter();
  const [shopName, setShopName] = useState(initial.shopName ?? "");
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp ?? "");
  const [shopSlug, setShopSlug] = useState(initial.shopSlug);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<"" | "ok" | "err" | "taken">("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopName: shopName, whatsapp: whatsapp }),
      });
      if (res.status === 409) {
        setMsg("taken");
        return;
      }
      if (!res.ok) {
        setMsg("err");
        return;
      }
      const body = await res.json();
      if (body.shopSlug) setShopSlug(body.shopSlug);
      setMsg("ok");
      router.refresh();
    } catch {
      setMsg("err");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const labelCls = "mb-1 block text-xs font-semibold text-gray-600";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Store className="h-5 w-5 text-brand-600" /> {T("merchant_shop_title")}
      </h2>
      <p className="mt-1 text-xs leading-snug text-gray-500">{T("merchant_shop_hint")}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{T("merchant_shop_name_label")}</label>
          <input
            className={inputCls}
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder={T("merchant_shop_name_placeholder")}
            maxLength={40}
          />
        </div>
        <div>
          <label className={labelCls}>
            <MessageCircle className="me-1 inline h-3 w-3 text-emerald-500" />
            {T("account_whatsapp")}
          </label>
          <input className={inputCls} dir="ltr" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="06xxxxxxxx" />
        </div>
      </div>

      {shopSlug && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
          <Link2 className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" />
          <span dir="ltr" className="truncate">
            /{shopSlug}
          </span>
        </p>
      )}

      {msg === "ok" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> {T("account_updated")}
        </p>
      )}
      {msg === "taken" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("merchant_shop_taken")}
        </p>
      )}
      {msg === "err" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("account_update_error")}
        </p>
      )}

      <Button type="submit" disabled={busy} className="mt-4">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {T("account_save")}
      </Button>
    </form>
  );
}
