"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Boxes, Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { LayoutDashboard, ClipboardList, Boxes, Users, Mail } as const;

export type NavTab = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

export function NavTabs({ tabs }: { tabs: NavTab[] }) {
  const pathname = usePathname();
  return (
    <nav className="sticky top-[68px] z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="container-site flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = ICONS[tab.icon];
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition",
                active
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-gray-500 hover:text-brand-700",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-brand-600" : "")} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
