import type { Product } from "@prisma/client";
import { parseColors } from "./utils";

export type CardProduct = {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  colors: string[];
  level: string | null;
  rating: number;
  ratingCount: number;
  sold: number;
  featured: boolean;
};

export function toCard(p: Product): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameAr: p.nameAr,
    description: p.description,
    descriptionAr: p.descriptionAr,
    category: p.category,
    brand: p.brand,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    colors: parseColors(p.colorsJson),
    level: p.level,
    rating: p.rating,
    ratingCount: p.ratingCount,
    sold: p.sold,
    featured: p.featured,
  };
}
