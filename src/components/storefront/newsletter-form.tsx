"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const { T } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("err");
      return;
    }
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "ok" : "err");
    if (res.ok) setEmail("");
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={T("newsletter_placeholder")}
          className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur transition focus:border-white/50 focus:bg-white/15"
        />
        <Button
          type="submit"
          variant="white"
          size="lg"
          className="h-12 shrink-0"
        >
          <Send className="h-4 w-4" />
          {T("newsletter_btn")}
        </Button>
      </div>
      {status === "ok" && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> {T("newsletter_success")}
        </p>
      )}
      {status === "err" && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-amber-300">
          <AlertCircle className="h-4 w-4" /> {T("newsletter_error")}
        </p>
      )}
    </form>
  );
}
