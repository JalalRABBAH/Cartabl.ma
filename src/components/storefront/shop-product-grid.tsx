"use client";

import { useState } from "react";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { CardProduct } from "@/lib/serialize";

const STORAGE_KEY = "mbag_grid";
const COLS = [2, 3, 4];
const PER_PAGE = [8, 12, 24, 48];

function readPrefs(): { cols: number; perPage: number } {
  if (typeof window === "undefined") return { cols: 4, perPage: 12 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (COLS.includes(p.cols) && PER_PAGE.includes(p.perPage)) return p;
    }
  } catch {}
  return { cols: 4, perPage: 12 };
}

export function ShopProductGrid({ products }: { products: CardProduct[] }) {
  const [prefs, setPrefs] = useState(readPrefs);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(products.length / prefs.perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = products.slice((safePage - 1) * prefs.perPage, safePage * prefs.perPage);

  const colsClass =
    prefs.cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : prefs.cols === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  const save = (next: { cols: number; perPage: number }) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-400">{products.length} articles</p>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>{prefs.cols} col &middot; {prefs.perPage}/p</span>
          </button>
          {open && (
            <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Colonnes</p>
              <div className="mb-4 flex gap-1.5">
                {COLS.map((n) => (
                  <button key={n} onClick={() => { setPage(1); const next = { ...prefs, cols: n }; setPrefs(next); save(next); setOpen(false); }}
                    className={`flex h-9 w-full items-center justify-center rounded-xl border text-sm font-bold transition ${prefs.cols === n ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {n}
                  </button>
                ))}
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Par page</p>
              <div className="flex flex-wrap gap-1.5">
                {PER_PAGE.map((n) => (
                  <button key={n} onClick={() => { setPage(1); const next = { ...prefs, perPage: n }; setPrefs(next); save(next); setOpen(false); }}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${prefs.perPage === n ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {n}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} className="mt-4 w-full rounded-xl bg-gray-100 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-200">Fermer</button>
            </div>
          )}
        </div>
      </div>

      <div className={`grid ${colsClass} gap-4 sm:gap-6`}>
        {paginated.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700">{safePage} / {totalPages}</span>
          <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
