"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/app/providers";
import { LOCALES } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white text-xs font-medium shadow-sm">
        <span className="flex items-center gap-1 pl-2.5 pr-1 text-gray-400">
          <Languages className="h-3.5 w-3.5" />
        </span>
        {LOCALES.map((l, i) => (
          <button
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={cn(
              "cursor-pointer px-2.5 py-2 transition-colors",
              l.code === locale ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50",
              i === 0 && "rounded-l-xl",
              i === LOCALES.length - 1 && "rounded-r-xl",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
