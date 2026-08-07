"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Ban, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/app/providers";

export function CancelOrderButton({ orderNumber }: { orderNumber: string }) {
  const { T } = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<"" | "ok" | "err">("");

  const cancel = async () => {
    if (!window.confirm(T("account_cancel_confirm"))) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELED" }),
      });
      if (!res.ok) {
        setMsg("err");
        return;
      }
      setMsg("ok");
      router.refresh();
    } catch {
      setMsg("err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        onClick={cancel}
        disabled={busy}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
        {T("account_cancel_order")}
      </button>
      {msg === "ok" && (
        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> {T("merchant_status_updated")}
        </p>
      )}
      {msg === "err" && (
        <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("checkout_error")}
        </p>
      )}
    </div>
  );
}
