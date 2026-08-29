"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Home, KeyRound, Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { useLocale } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { CITIES } from "@/lib/shipping";

export type ProfileUser = {
  name: string;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  address: string | null;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const { T } = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    whatsapp: user.whatsapp ?? "",
    city: user.city ?? "Casablanca",
    address: user.address ?? "",
    currentPassword: "",
    newPassword: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<"" | "ok" | "err" | "pwd">("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp,
          city: form.city,
          address: form.address,
          ...(form.newPassword
            ? { currentPassword: form.currentPassword, newPassword: form.newPassword }
            : {}),
        }),
      });
      if (res.status === 422) {
        setMsg("pwd");
        return;
      }
      if (!res.ok) {
        setMsg("err");
        return;
      }
      setMsg("ok");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
      router.refresh();
    } catch {
      setMsg("err");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const labelCls = "mb-1 block text-xs font-semibold text-gray-600";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-black text-gray-900">
        <User className="h-5 w-5 text-brand-600" /> {T("account_profile")}
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{T("auth_name")}</label>
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>
            <Phone className="me-1 inline h-3 w-3 text-gray-400" />
            {T("account_phone")}
          </label>
          <input className={inputCls} dir="ltr" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="06xxxxxxxx" />
        </div>
        <div>
          <label className={labelCls}>
            <MessageCircle className="me-1 inline h-3 w-3 text-emerald-500" />
            {T("account_whatsapp")}
          </label>
          <input className={inputCls} dir="ltr" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="06xxxxxxxx" />
          <p className="mt-1 text-[11px] leading-snug text-gray-400">{T("account_whatsapp_hint")}</p>
        </div>
        <div>
          <label className={labelCls}>
            <MapPin className="me-1 inline h-3 w-3 text-gray-400" />
            {T("account_city")}
          </label>
          <select className={`${inputCls} cursor-pointer`} value={form.city} onChange={(e) => set("city", e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>
            <Home className="me-1 inline h-3 w-3 text-gray-400" />
            {T("account_address")}
          </label>
          <input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
            <KeyRound className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-bold text-gray-800">{T("account_change_password")}</p>
          </div>
        </div>
        <div>
          <label className={labelCls}>{T("account_current_password")}</label>
          <input className={inputCls} type="password" dir="ltr" value={form.currentPassword} onChange={(e) => set("currentPassword", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{T("account_new_password")}</label>
          <input className={inputCls} type="password" dir="ltr" value={form.newPassword} onChange={(e) => set("newPassword", e.target.value)} />
        </div>
      </div>

      {msg === "ok" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> {T("account_updated")}
        </p>
      )}
      {msg === "err" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("account_update_error")}
        </p>
      )}
      {msg === "pwd" && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-600">
          <AlertCircle className="h-3.5 w-3.5" /> {T("account_password_error")}
        </p>
      )}

      <Button type="submit" disabled={busy} className="mt-5">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {T("account_save")}
      </Button>
    </form>
  );
}
