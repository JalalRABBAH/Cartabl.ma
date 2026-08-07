"use client";

import { useCart } from "@/lib/cart-context";
import { ShoppingBag } from "lucide-react";

export function CartButton() {
  const { count, setOpen } = useCart();

  return (
    <button
      onClick={() => setOpen(true)}
      className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
      aria-label="Panier"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white shadow">
          {count}
        </span>
      )}
    </button>
  );
}
