"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function TrackForm({ defaultValue = "" }: { defaultValue?: string }) {
  const { T } = useLocale();
  const router = useRouter();
  const [code, setCode] = useState(defaultValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (c) router.push(`/suivi/${c}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={T("track_placeholder")}
          dir="ltr"
          className="h-14 w-full rounded-2xl border border-gray-200 bg-white ps-12 pe-4 text-base font-bold uppercase tracking-widest shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <Button type="submit" size="lg" className="h-14">
        {T("track_btn")}
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Button>
    </form>
  );
}
