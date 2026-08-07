"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <button
      onClick={logout}
      className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}
