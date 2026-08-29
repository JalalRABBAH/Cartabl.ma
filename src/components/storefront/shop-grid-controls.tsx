"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";

const COLS = [2, 3, 4];
const PER_PAGE = [8, 12, 24, 48];

export function GridControls({ total }: { total: number }) {
  const router = useRouter();
  const sp = useSearchParams();

  const cols = COLS.includes(Number(sp.get("cols"))) ? Number(sp.get("cols")) : 4;
  const perPage = PER_PAGE.includes(Number(sp.get("per_page"))) ? Number(sp.get("per_page")) : 12;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, Number(sp.get("page")) || 1), totalPages);

  if (total <= Math.min(...PER_PAGE)) return null;

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set(key, value);
    next.delete("page");
    if (key !== "page") next.delete("page");
    router.push(`?${next.toString()}`, { scroll: false });
  };

  const goTo = (p: number) => {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(p));
    router.push(`?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-400">{total} articles</p>

      <div className="flex items-center gap-3">
        {/* Colonnes */}
        <div className="flex items-center gap-1.5">
          {COLS.map((n) => (
            <button
              key={n}
              onClick={() => setParam("cols", String(n))}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold transition ${
                cols === n
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
              title={`${n} colonnes`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Par page */}
        <select
          value={perPage}
          onChange={(e) => setParam("per_page", e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-brand-300 focus:border-brand-500 focus:outline-none"
        >
          {PER_PAGE.map((n) => (
            <option key={n} value={n}>{n}/page</option>
          ))}
        </select>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => goTo(page - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-gray-700">{page}/{totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => goTo(page + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
