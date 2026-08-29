"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  MapPin,
  CreditCard,
  Banknote,
  Loader2,
  Truck,
  Info,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLocale } from "@/app/providers";
import { formatMAD, cn } from "@/lib/utils";
import { CITIES, FREE_SHIPPING_THRESHOLD, deliveryDaysFor } from "@/lib/shipping";
import { ProductArt } from "@/components/product-art";
import { Button } from "@/components/ui/button";
import { homePathFor, isBuyerFlowRole } from "@/lib/role-nav";
import type { ProductCategory, Role } from "@prisma/client";

export type CheckoutUser = {
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  address: string | null;
};

export function CheckoutForm({ user, role }: { user: CheckoutUser | null; role: Role | null }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { T, locale } = useLocale();
  const buyerFlow = isBuyerFlowRole(role);

  const [form, setForm] = useState({
    customerName: user?.name ?? "",
    customerPhone: user?.phone ?? "",
    customerEmail: user?.email ?? "",
    city: user?.city ?? "Casablanca",
    address: user?.address ?? "",
    notes: "",
    paymentMethod: "COD",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : CITIES.find((c) => c.name === form.city)?.fee ?? 50;
  const total = subtotal + shippingFee;
  const [minDays, maxDays] = deliveryDaysFor(form.city);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (items.length === 0) return;
    if (!form.customerName.trim() || !form.customerPhone.trim() || !form.customerEmail.trim() || !form.city || !form.address.trim()) {
      setError(T("checkout_required"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: "COD",
          items: items.map((i) => ({ productId: i.productId, qty: i.qty, color: i.color })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 409 ? T("product_out_of_stock") : T("checkout_error"));
        return;
      }
      clear();
      router.push(`/confirmation/${data.number}?code=${data.trackingCode}`);
    } catch {
      setError(T("checkout_error"));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const labelCls = "mb-1.5 block text-sm font-semibold text-gray-700";

  return (
    <div className="container-site py-10">
      <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{T("checkout_title")}</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <User className="h-5 w-5 text-brand-600" /> {T("checkout_contact")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>{T("checkout_name")} *</label>
                <input className={inputCls} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{T("checkout_phone")} *</label>
                <input className={inputCls} dir="ltr" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="06 XX XX XX XX" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{T("checkout_email")} *</label>
                <input className={inputCls} type="email" dir="ltr" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <MapPin className="h-5 w-5 text-brand-600" /> {T("checkout_address")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>{T("checkout_city")} *</label>
                <select className={cn(inputCls, "cursor-pointer")} value={form.city} onChange={(e) => set("city", e.target.value)}>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {locale === "ar" ? c.nameAr : c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
                  <Truck className="h-3.5 w-3.5" /> {minDays}–{maxDays} {T("common_days")} · {shippingFee === 0 ? T("cart_shipping_free") : formatMAD(shippingFee)}
                </p>
              </div>
              <div>
                <label className={labelCls}>{T("checkout_address_field")} *</label>
                <textarea className={cn(inputCls, "h-24 resize-none py-3")} value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{T("checkout_notes")}</label>
                <textarea className={cn(inputCls, "h-20 resize-none py-3")} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <CreditCard className="h-5 w-5 text-brand-600" /> {T("checkout_payment")}
            </h2>
            <div className="mt-4 grid gap-3">
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition",
                  form.paymentMethod === "COD" ? "border-brand-600 bg-brand-50/50" : "border-gray-200 hover:border-gray-300",
                )}
              >
                <input type="radio" name="payment" checked={form.paymentMethod === "COD"} onChange={() => set("paymentMethod", "COD")} className="mt-1" />
                <div>
                  <p className="flex items-center gap-2 font-bold text-gray-900">
                    <Banknote className="h-4 w-4 text-emerald-600" /> {T("checkout_cod")}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{T("checkout_cod_desc")}</p>
                </div>
              </label>
              <div className="flex cursor-not-allowed items-start gap-3 rounded-2xl border-2 border-gray-200 p-4 opacity-60">
                <input type="radio" disabled className="mt-1" />
                <div>
                  <p className="flex items-center gap-2 font-bold text-gray-900">
                    <CreditCard className="h-4 w-4 text-brand-600" /> {T("checkout_card")}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{T("checkout_card_desc")}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-32">
          <h2 className="text-lg font-bold text-gray-900">{T("order_items")}</h2>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pe-1">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color ?? "default"}`} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                  <ProductArt category={item.category as ProductCategory} colors={item.color ? [item.color] : undefined} />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                    {locale === "ar" ? item.nameAr : item.name}
                  </p>
                  <p className="text-xs text-gray-400">× {item.qty}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatMAD(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">{T("cart_subtotal")}</dt>
              <dd className="font-semibold text-gray-900">{formatMAD(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">{T("cart_shipping")} ({form.city})</dt>
              <dd className={cn("font-semibold", shippingFee === 0 ? "text-emerald-600" : "text-gray-900")}>
                {shippingFee === 0 ? T("cart_shipping_free") : formatMAD(shippingFee)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-bold text-gray-900">{T("cart_total")}</dt>
              <dd className="font-extrabold text-brand-700">{formatMAD(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            {T("checkout_cod_note")}
          </div>

          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="mt-4 w-full" disabled={loading || items.length === 0}>
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> {T("checkout_placing")}
              </>
            ) : (
              T("checkout_place")
            )}
          </Button>
          <Link href={buyerFlow ? "/panier" : homePathFor(role)} className="mt-3 block text-center text-sm font-semibold text-gray-400 hover:text-brand-600">
            {buyerFlow ? T("checkout_back") : T("back_to_space")}
          </Link>
        </aside>
      </form>
    </div>
  );
}
