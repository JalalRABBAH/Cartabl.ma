"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocale } from "@/app/providers";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  const { T } = useLocale();
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/produits?q=${encodeURIComponent(q)}` : "/produits");
  };

  return (
    <form onSubmit={submit} className={cn("relative", className)} role="search">
      <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={T("nav_search_placeholder")}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white ps-10 pe-4 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </form>
  );
}
