import type { NextRequest } from "next/server";

export type ProductBody = {
  get(key: string): string | null;
  has(key: string): boolean;
  file(): File | null;
  files(): File[];
};

export async function parseProductBody(req: NextRequest): Promise<ProductBody | null> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const j = await req.json();
      return {
        get: (key) => {
          const v = j[key];
          if (v === undefined || v === null) return null;
          if (Array.isArray(v)) return v.join(",");
          return typeof v === "object" ? null : String(v).trim();
        },
        has: (key) => Object.prototype.hasOwnProperty.call(j, key),
        file: () => null,
        files: () => [],
      };
    } catch {
      return null;
    }
  }

  try {
    const form = await req.formData();
    const img = form.get("image");
    const imgs = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
    return {
      get: (key) => {
        const v = form.get(key);
        return typeof v === "string" ? v.trim() : null;
      },
      has: (key) => form.has(key),
      file: () => (img instanceof File && img.size > 0 ? img : null),
      files: () => (imgs.length > 0 ? imgs : (img instanceof File && img.size > 0 ? [img] : [])),
    };
  } catch {
    return null;
  }
}

/** Accepte "299", "299,50", "1 999.00 DH", renvoie un entier arrondi ou null */
export function parseAmount(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  let s = raw.replace(/[^\d.,]/g, "").replace(/,/g, ".");
  const parts = s.split(".");
  if (parts.length > 2) s = parts.slice(0, -1).join("") + "." + parts[parts.length - 1];
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

const CATEGORIES = ["CLASSIQUE", "DOS", "ROULETTES", "COLLEGE", "PC", "TROUSSE", "ACCESSOIRE"] as const;

const CATEGORY_ALIASES: Record<string, string> = {
  PRIMAIRE: "CLASSIQUE",
  PRIMARY: "CLASSIQUE",
  ECOLE: "CLASSIQUE",
  SCHOOL: "CLASSIQUE",
  SAC: "DOS",
  SACADOS: "DOS",
  BACKPACK: "DOS",
  LYCEE: "DOS",
  UNIVERSITE: "DOS",
  ROULETTE: "ROULETTES",
  TROLLEY: "ROULETTES",
  CARTABLE: "CLASSIQUE",
};

export function parseCategory(
  raw: string | null,
): { value: string; mappedFrom?: string } | { error: string } {
  if (raw === null || raw.trim() === "") return { value: "CLASSIQUE" };
  const norm = raw
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if ((CATEGORIES as readonly string[]).includes(norm)) return { value: norm };
  const alias = CATEGORY_ALIASES[norm];
  if (alias) return { value: alias, mappedFrom: norm };
  const KEYWORDS: Array<[string, string]> = [
    ["TROUSSE", "TROUSSE"],
    ["ACCESSOIRE", "ACCESSOIRE"],
    ["ROULETTE", "ROULETTES"],
    ["TROLLEY", "ROULETTES"],
    ["COLLEGE", "COLLEGE"],
    ["CLASSIQUE", "CLASSIQUE"],
    ["DOS", "DOS"],
  ];
  for (const [kw, val] of KEYWORDS) {
    if (norm.includes(kw)) return { value: val, mappedFrom: norm };
  }
  if (norm === "PC") return { value: "PC", mappedFrom: norm };
  return { error: `Catégorie « ${raw} » inconnue` };
}
