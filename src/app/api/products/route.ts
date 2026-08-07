import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ProductCategory } from "@prisma/client";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  nameAr: z.string().min(1),
  description: z.string().min(5),
  descriptionAr: z.string().min(1),
  category: z.nativeEnum(ProductCategory),
  brand: z.string().min(1),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0),
  colors: z.array(z.string()).min(1).max(8),
  level: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  let slug = slugify(body.name);
  let existing = await prisma.product.findUnique({ where: { slug } });
  while (existing) {
    slug = `${slugify(body.name)}-${Math.floor(Math.random() * 999)}`;
    existing = await prisma.product.findUnique({ where: { slug } });
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: body.name.trim(),
      nameAr: body.nameAr.trim(),
      description: body.description.trim(),
      descriptionAr: body.descriptionAr.trim(),
      category: body.category,
      brand: body.brand.trim(),
      price: body.price,
      compareAtPrice: body.compareAtPrice ?? null,
      stock: body.stock,
      colorsJson: JSON.stringify(body.colors),
      level: body.level || null,
      featured: body.featured,
      sellerId: user.role === "SELLER" ? user.id : null,
    },
  });

  return NextResponse.json({ ok: true, slug: product.slug }, { status: 201 });
}
