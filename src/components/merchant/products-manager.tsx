"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Package } from "lucide-react";
import { useLocale } from "@/app/providers";
import { ProductArt } from "@/components/product-art";
import { Button } from "@/components/ui/button";
import { formatMAD, cn } from "@/lib/utils";
import { CATEGORY_META, ALL_CATEGORIES } from "@/lib/catalog";
import type { ProductCategory } from "@prisma/client";

type ProductClient = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  colors: string[];
  level: string | null;
  featured: boolean;
};

const EMPTY = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  brand: "",
  category: "CLASSIQUE" as ProductCategory,
  price: "",
  compareAtPrice: "",
  stock: "10",
  colorsText: "",
  level: "",
  featured: false,
};

function ProductForm({
  initial,
  onDone,
}: {
  initial?: ProductClient | null;
  onDone: () => void;
}) {
  const { T, locale } = useLocale();
  const router = useRouter();
  const [form, setForm] = useState(
    initial
      ? {
          ...EMPTY,
          name: initial.name,
          nameAr: initial.nameAr,
          brand: initial.brand,
          category: initial.category as ProductCategory,
          price: String(initial.price),
          compareAtPrice: initial.compareAtPrice ? String(initial.compareAtPrice) : "",
          stock: String(initial.stock),
          colorsText: initial.colors.join(", "),
          level: initial.level ?? "",
          featured: initial.featured,
        }
      : EMPTY,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const colors = form.colorsText
      .split(",")
      .map((c) => c.trim().replace(/\s/g, ""))
      .filter((c) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c));
    if (colors.length === 0) {
      setError(T("checkout_error"));
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name,
      nameAr: form.nameAr,
      description: form.description,
      descriptionAr: form.descriptionAr,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock) || 0,
      colors,
      level: form.level || null,
      featured: form.featured,
    };
    try {
      const res = initial
        ? await fetch(`/api/products/${initial.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        setError(T("checkout_error"));
        return;
      }
      router.refresh();
      onDone();
    } catch {
      setError(T("checkout_error"));
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const labelCls = "mb-1 block text-xs font-semibold text-gray-600";

  return (
    <form onSubmit={save} className="rounded-3xl border border-brand-200 bg-brand-50/40 p-6">
      <h3 className="text-lg font-black text-gray-900">
        {initial ? T("merchant_edit_product") : T("merchant_new_product")}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{T("merchant_name_fr")} *</label>
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_name_ar")} *</label>
          <input className={inputCls} dir="rtl" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_brand")} *</label>
          <input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_category")}</label>
          <select className={cn(inputCls, "cursor-pointer")} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_META[c].emoji} {T(CATEGORY_META[c].key)}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>{T("merchant_desc_fr")} *</label>
          <textarea className={cn(inputCls, "h-20 resize-none py-2")} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>{T("merchant_desc_ar")} *</label>
          <textarea className={cn(inputCls, "h-20 resize-none py-2")} dir="rtl" value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_price")} *</label>
          <input className={inputCls} type="number" dir="ltr" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="299" />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_compare_price")}</label>
          <input className={inputCls} type="number" dir="ltr" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_stock")}</label>
          <input className={inputCls} type="number" dir="ltr" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("merchant_level")}</label>
          <select className={cn(inputCls, "cursor-pointer")} value={form.level} onChange={(e) => set("level", e.target.value)}>
            <option value="">{T("merchant_level_none")}</option>
            <option value="primaire">{T("level_primaire")}</option>
            <option value="college">{T("level_college")}</option>
            <option value="lycee">{T("level_lycee")}</option>
            <option value="universite">{T("level_universite")}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>{T("merchant_colors")}</label>
          <input className={inputCls} dir="ltr" value={form.colorsText} onChange={(e) => set("colorsText", e.target.value)} placeholder="#e11d48, #2563eb, #f59e0b" />
          {form.colorsText.trim() && (
            <div className="mt-2 flex gap-1.5">
              {form.colorsText.split(",").map((c, i) => {
                const hex = c.trim();
                return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex) ? (
                  <span key={i} className="h-6 w-6 rounded-full border border-gray-200" style={{ backgroundColor: hex }} />
                ) : null;
              })}
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-brand-600" />
          {T("merchant_featured")}
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <div className="mt-5 flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {T("merchant_save")}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          {T("merchant_cancel")}
        </Button>
      </div>
    </form>
  );
}

export function ProductsManager({ products }: { products: ProductClient[] }) {
  const { T, locale } = useLocale();
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "create" | { edit: ProductClient }>("list");

  const remove = async (p: ProductClient) => {
    if (!window.confirm(`${T("merchant_delete_confirm")} « ${locale === "ar" ? p.nameAr : p.name} »`)) return;
    const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">{T("merchant_products")}</h1>
        <Button onClick={() => setMode("create")}>
          <Plus className="h-4 w-4" /> {T("merchant_add_product")}
        </Button>
      </div>

      {mode !== "list" && (
        <ProductForm
          initial={mode === "create" ? null : mode.edit}
          onDone={() => setMode("list")}
        />
      )}

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">{T("merchant_products_empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                  <ProductArt category={p.category as ProductCategory} colors={p.colors} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {locale === "ar" ? p.nameAr : p.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {p.brand} · {CATEGORY_META[p.category as ProductCategory].emoji} {T(CATEGORY_META[p.category as ProductCategory].key)}
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-gray-900">
                    {formatMAD(p.price)}
                    {p.compareAtPrice && (
                      <span className="ms-1.5 text-xs font-normal text-gray-400 line-through">
                        {formatMAD(p.compareAtPrice)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                    p.stock === 0
                      ? "bg-red-50 text-red-600"
                      : p.stock < 10
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600",
                  )}
                >
                  {p.stock} {T("merchant_stock")}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setMode({ edit: p })}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-brand-50 hover:text-brand-600"
                    aria-label={T("merchant_edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={T("merchant_delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {p.featured && <X className="mt-2 h-4 w-4 text-sand-500" aria-label={T("merchant_featured")} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
