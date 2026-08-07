"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, ShieldCheck, Check } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function SubscribeButton() {
  const { T } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const pay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscription/activate", { method: "POST" });
      if (!res.ok) {
        setError(T("auth_error"));
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError(T("auth_error"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
        <Check className="h-5 w-5" /> {T("sub_activated")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-xs font-semibold text-gray-400">
        <ShieldCheck className="h-4 w-4" /> {T("sub_trial_desc")}
      </p>
      <Button type="button" size="lg" className="w-full" onClick={pay} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
        {T("sub_pay_now")}
      </Button>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
