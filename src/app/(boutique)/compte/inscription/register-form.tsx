"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, User, Lock, Phone, MapPin, Mail } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const { T } = useLocale();
  const router = useRouter();
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
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 409 ? T("auth_exists") : T("auth_invalid"));
        return;
      }
      router.refresh();
      router.push("/compte");
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
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-500 to-brand-600 text-white shadow-md">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-black text-gray-900">{T("auth_register_title")}</h1>
          <p className="mt-1 text-center text-sm text-gray-500">{T("auth_register_sub")}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
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
