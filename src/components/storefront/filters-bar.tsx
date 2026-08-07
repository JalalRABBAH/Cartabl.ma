"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useLocale } from "@/app/providers";
import { CATEGORY_META, ALL_CATEGORIES } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FiltersBar() {
  const { T, locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cat, setCat] = useState(searchParams.get("cat") ?? "");
  const [level, setLevel] = useState(searchParams.get("level") ?? "");
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "featured");

  useEffect(() => {
    setCat(searchParams.get("cat") ?? "");
    setLevel(searchParams.get("level") ?? "");
    setMin(searchParams.get("min") ?? "");
    setMax(searchParams.get("max") ?? "");
    setSort(searchParams.get("sort") ?? "featured");
  }, [searchParams]);

  const apply = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    const all = { q: searchParams.get("q") ?? "", ...overrides };
    for (const [k, v] of Object.entries(all)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const reset = () => router.push(pathname);

  const levels = [
    { v: "primaire", l: T("level_primaire") },
    { v: "college", l: T("level_college") },
    { v: "lycee", l: T("level_lycee") },
    { v: "universite", l: T("level_universite") },
  ];

  const sorts = [
    { v: "featured", l: T("sort_featured") },
    { v: "newest", l: T("sort_newest") },
    { v: "popular", l: T("sort_popular") },
    { v: "price_asc", l: T("sort_price_asc") },
    { v: "price_desc", l: T("sort_price_desc") },
  ];

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          {T("filters_title")}
        </h3>
        <button
          onClick={reset}
          className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-gray-400 hover:text-brand-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {T("filters_reset")}
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
          {T("filters_categories")}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => apply({ cat: "" })}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition",
              !cat ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {T("filters_all")}
          </button>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => apply({ cat: cat === c ? "" : c })}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition",
                cat === c ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {CATEGORY_META[c].emoji} {T(CATEGORY_META[c].key)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
          {T("filters_level")}
        </p>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l.v}
              onClick={() => apply({ level: level === l.v ? "" : l.v })}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition",
                level === l.v ? "bg-sand-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {l.l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
            {T("filters_price")} min
          </p>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={() => apply({ min: min || undefined })}
            onKeyDown={(e) => e.key === "Enter" && apply({ min: min || undefined })}
            placeholder="0"
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
            {T("filters_price")} max
          </p>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={() => apply({ max: max || undefined })}
            onKeyDown={(e) => e.key === "Enter" && apply({ max: max || undefined })}
            placeholder="600"
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
          {T("filters_sort")}
        </p>
        <div className="flex flex-wrap gap-2">
          {sorts.map((s) => (
            <button
              key={s.v}
              onClick={() => apply({ sort: s.v })}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition",
                sort === s.v ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {s.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
