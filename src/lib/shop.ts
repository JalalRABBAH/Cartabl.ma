import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const RESERVED_SHOP_SLUGS = new Set([
  "api",
  "produits",
  "produit",
  "panier",
  "commande",
  "confirmation",
  "compte",
  "connexion",
  "inscription",
  "suivi",
  "contact",
  "apropos",
  "faq",
  "livraison",
  "boutique",
  "admin",
  "marchand",
  "livreur",
  "login",
  "register",
]);

export function isReservedShopSlug(slug: string): boolean {
  return RESERVED_SHOP_SLUGS.has(slug);
}

export async function resolveShopSlug(userId: string, name: string): Promise<string | null> {
  const base = slugify(name);
  if (!base || base.length < 2) return null;
  if (isReservedShopSlug(base)) return null;

  let candidate = base;
  for (let i = 2; i < 50; i++) {
    const existing = await prisma.user.findUnique({ where: { shopSlug: candidate } });
    if (!existing || existing.id === userId) return candidate;
    candidate = `${base}-${i}`;
  }
  return null;
}
