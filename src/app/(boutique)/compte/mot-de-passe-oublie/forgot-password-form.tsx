"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, Mail, CheckCircle } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const { T } = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError(T("auth_error"));
        return;
      }
      setSent(true);
    } catch {
      setError(T("auth_error"));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-xl border border-gray-200 bg-white ps-11 pe-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="container-site flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-500 to-brand-600 text-white shadow-md">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-black text-gray-900">{T("auth_forgot_title")}</h1>
          <p className="mt-1 text-center text-sm text-gray-500">{T("auth_forgot_sub")}</p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
              <p className="mt-3 text-sm font-medium text-green-700">{T("auth_forgot_sent")}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">{T("auth_email")}</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className={inputCls}
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.ma"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />}
                {T("auth_forgot_btn")}
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-gray-500">
            <Link href="/compte/connexion" className="font-bold text-brand-600 hover:underline">
              {T("auth_login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
