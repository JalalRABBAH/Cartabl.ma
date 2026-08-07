"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, User, Lock, Sparkles } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const { T } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/compte";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const demo = [
    { label: `${T("auth_demo_buyer")}`, email: "aya@demo.ma", icon: "🛍️" },
    { label: `${T("auth_demo_seller")}`, email: "rachid@demo.ma", icon: "🏪" },
    { label: `${T("auth_demo_delivery")}`, email: "youssef@demo.ma", icon: "🚚" },
  ];

  const submit = async (email = form.email, password = form.password) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(T("auth_invalid"));
        return;
      }
      router.refresh();
      router.push(next);
    } catch {
      setError(T("auth_error"));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="container-site flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-black text-gray-900">{T("auth_login_title")}</h1>
          <p className="mt-1 text-center text-sm text-gray-500">{T("auth_login_sub")}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">{T("auth_email")}</label>
              <div className="relative">
                <User className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className={inputCls} type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="aya@demo.ma" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">{T("auth_password")}</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className={inputCls} type="password" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
              {T("auth_login_btn")}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            {T("auth_no_account")}{" "}
            <Link href="/compte/inscription" className="font-bold text-brand-600 hover:underline">
              {T("auth_register_link")}
            </Link>
          </p>
        </div>

        <div className="mt-6 rounded-[2rem] border border-dashed border-sand-300 bg-sand-50 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-sand-800">
            <Sparkles className="h-4 w-4" /> {T("auth_demo_title")}
          </p>
          <div className="mt-3 grid gap-2">
            {demo.map((d) => (
              <button
                key={d.email}
                onClick={() => submit(d.email, "demo1234")}
                className="flex cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3 text-left shadow-sm transition hover:shadow"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span>{d.icon}</span> {d.label}
                </span>
                <span className="font-mono text-xs text-gray-400">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
