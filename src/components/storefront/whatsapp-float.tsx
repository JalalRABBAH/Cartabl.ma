"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat({
  number,
  message,
  label = "WhatsApp",
}: {
  number: string;
  message?: string;
  label?: string;
}) {
  if (!number) return null;

  const href = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:bg-[#1da851] hover:shadow-xl sm:bottom-8 sm:right-8"
      aria-label={label}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
