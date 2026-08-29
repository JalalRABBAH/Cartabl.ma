import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(amount: number): string {
  return `${new Intl.NumberFormat("fr-MA").format(amount)} DH`;
}

export function parseColors(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((c) => typeof c === "string") : [];
  } catch {
    return [];
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CM-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function generateOrderNumber(): string {
  const n = 1000 + Math.floor(Math.random() * 9000);
  return `CMD-${new Date().getFullYear()}-${n}`;
}

export function discountFor(price: number, compareAt?: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function toWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let n = raw.replace(/[\s\-().]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  else if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = "212" + n.slice(1);
  return /^\d{10,15}$/.test(n) ? n : null;
}

export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
