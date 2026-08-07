"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLocale } from "@/app/providers";

export function CopyButton({ value }: { value: string }) {
  const { T } = useLocale();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={copy}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm transition hover:bg-brand-50"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? T("order_copied") : T("order_copy")}
    </button>
  );
}
