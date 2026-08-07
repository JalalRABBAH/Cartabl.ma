"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Loader2, User, Lock, Phone, MapPin, Mail, ShoppingBag, Store, Truck, Check } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

type AccountType = "BUYER" | "SELLER" | "DELIVERY";

const accountTypes: { value: AccountType; labelKey: "reg_role_buyer" | "reg_role_seller" | "reg_role_delivery"; descKey: "reg_role_buyer_desc" | "reg_role_seller_desc" | "reg_role_delivery_desc"; icon: typeof ShoppingBag; badge: "reg_free" | "reg_seller_free"; cardCls: string; chipCls: string }[] = [
  {
    value: "BUYER",
    labelKey: "reg_role_buyer",
    descKey: "reg_role_buyer_desc",
    icon: ShoppingBag,
    badge: "reg_free",
    cardCls: "data-[active=true]:border-brand-500 data-[active=true]:ring-2 data-[active=true]:ring-brand-100",
    chipCls: "bg-brand-50 text-brand-700",
  },
  {
    value: "SELLER",
    labelKey: "reg_role_seller",
    descKey: "reg_role_seller_desc",
    icon: Store,
    badge: "reg_seller_free",
    cardCls: "data-[active=true]:border-sand-500 data-[active=true]:ring-2 data-[active=true]:ring-sand-100",
    chipCls: "bg-sand-50 text-sand-700",
  },
  {
    value: "DELIVERY",
    labelKey: "reg_role_delivery",
    descKey: "reg_role_delivery_desc",
    icon: Truck,
    badge: "reg_free",
    cardCls: "data-[active=true]:border-sky-500 data-[active=true]:ring-2 data-[active=true]:ring-sky-100",
    chipCls: "bg-sky-50 text-sky-700",
  },
];

export function RegisterForm() {
  const { T } = useLocale();
  const [role, setRole] = useState<AccountType>("BUYER");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", city: "Casablanca", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 409 ? T("auth_exists") : T("auth_invalid"));
        return;
      }
      window.location.href = data.role === "SELLER" ? "/marchand" : data.role === "DELIVERY" ? "/livreur" : "/compte";
    } catch {
      setError(T("auth_error"));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-xl border border-gray-200 bg-white ps-11 pe-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const labelCls = "mb-1.5 block text-sm font-semibold text-gray-700";
  const iconCls = "pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400";

  return (
    <div className="container-site flex justify-center py-16">
      <div className="w-full max-w-2xl">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-500 to-brand-600 text-white shadow-md">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-black text-gray-900">{T("auth_register_title")}</h1>
          <p className="mt-1 text-center text-sm text-gray-500">{T("auth_register_sub")}</p>

          <p className="mt-6 mb-3 text-sm font-semibold text-gray-700">{T("reg_role_title")}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {accountTypes.map((acc) => {
              const Icon = acc.icon;
              const active = role === acc.value;
              return (
                <button
                  key={acc.value}
                  type="button"
                  data-active={active}
                  onClick={() => setRole(acc.value)}
                  className={`group relative rounded-2xl border-2 p-4 text-start transition ${acc.cardCls} ${
                    active ? "border-transparent" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${acc.chipCls}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {active && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-bold text-gray-900">{T(acc.labelKey)}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{T(acc.descKey)}</p>
                  <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${acc.chipCls}`}>
                    {acc.value === "SELLER" ? (
                      <>
                        {T("reg_seller_free")}
                        <span className="mx-1 text-gray-400">·</span>
                        {T("reg_seller_plan")}
                      </>
                    ) : (
                      T(acc.badge)
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>{T("auth_name")} *</label>
                <div className="relative">
                  <User className={iconCls} />
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelCls}>{T("auth_email")} *</label>
                <div className="relative">
                  <Mail className={iconCls} />
                  <input className={inputCls} type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>{T("auth_phone")} *</label>
                <div className="relative">
                  <Phone className={iconCls} />
                  <input className={inputCls} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 XX XX XX XX" />
                </div>
              </div>
              <div>
                <label className={labelCls}>{T("auth_password")} *</label>
                <div className="relative">
                  <Lock className={iconCls} />
                  <input className={inputCls} type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6 caractères min" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>{T("auth_city")}</label>
              <div className="relative">
                <MapPin className={iconCls} />
                <select className={`${inputCls} cursor-pointer`} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  {["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>{T("auth_address")}</label>
              <textarea className={`${inputCls} h-20 resize-none py-3`} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
              {T("auth_register_btn")}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            {T("auth_has_account")}{" "}
            <Link href="/compte/connexion" className="font-bold text-brand-600 hover:underline">
              {T("auth_login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
