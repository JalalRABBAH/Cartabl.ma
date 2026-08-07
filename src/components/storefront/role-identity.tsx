import { ShoppingBag, Store, Truck, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Role } from "@prisma/client";

const roleStyles: Record<Role, { gradient: string; chip: string; icon: typeof ShoppingBag }> = {
  BUYER: { gradient: "bg-gradient-to-br from-brand-500 to-brand-700", chip: "bg-brand-50 text-brand-700", icon: ShoppingBag },
  SELLER: { gradient: "bg-gradient-to-br from-sand-500 to-sand-700", chip: "bg-sand-50 text-sand-700", icon: Store },
  DELIVERY: { gradient: "bg-gradient-to-br from-sky-500 to-sky-700", chip: "bg-sky-50 text-sky-700", icon: Truck },
  ADMIN: { gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700", chip: "bg-indigo-50 text-indigo-700", icon: ShieldCheck },
};

export function RoleAvatar({ role, initial, size = "md" }: { role: Role; initial?: string; size?: "md" | "lg" }) {
  const s = roleStyles[role];
  const cls = size === "lg" ? "h-16 w-16 rounded-3xl text-2xl" : "h-10 w-10 rounded-2xl text-sm";
  return (
    <span className={`flex ${cls} items-center justify-center font-black text-white shadow-lg ${s.gradient}`}>
      {initial || <s.icon className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} />}
    </span>
  );
}

export function RoleBadge({ role, locale }: { role: Role; locale: Locale }) {
  const s = roleStyles[role];
  const label = t(locale, `role_${role.toLowerCase()}` as never);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${s.chip}`}>
      <s.icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
