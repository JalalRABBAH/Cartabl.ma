"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  nameAr: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  color?: string;
  qty: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string, color?: string) => void;
  setQty: (productId: string, qty: number, color?: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cartabl_cart_v1";

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && (i.color || undefined) === (item.color || undefined),
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && (i.color || undefined) === (item.color || undefined)
            ? { ...i, qty: Math.min(i.qty + qty, i.stock) }
            : i,
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, item.stock) }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, color?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && (i.color || undefined) === (color || undefined)),
      ),
    );
  }, []);

  const setQty = useCallback((productId: string, qty: number, color?: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && (i.color || undefined) === (color || undefined)
          ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
          : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addItem, removeItem, setQty, clear, isOpen, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
