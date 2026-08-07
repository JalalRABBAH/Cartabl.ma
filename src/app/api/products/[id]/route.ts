import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ProductCategory } from "@prisma/client";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).optional(),
  nameAr: z.string().min(1).optional(),
  description: z.string().min(5).optional(),
  descriptionAr: z.string().min(1).optional(),
  category: z.nativeEnum(ProductCategory).optional(),
  brand: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  colors: z.array(z.string()).min(1).max(8).optional(),
  level: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "notfound" }, { status: 404 });
  if (user.role === "SELLER" && product.sellerId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const data: Record<string, unknown> = { ...body };
  if (body.colors) data.colorsJson = JSON.stringify(body.colors);
  if (body.name && body.name !== product.name) {
    let slug = slugify(body.name);
    const clash = await prisma.product.findUnique({ where: { slug } });
    if (clash && clash.id !== id) slug = `${slug}-${Math.floor(Math.random() * 999)}`;
    data.slug = slug;
  }

  await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "notfound" }, { status: 404 });
  if (user.role === "SELLER" && product.sellerId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await prisma.product.update({
    where: { id },
    data: { active: false, stock: 0 },
  });
  return NextResponse.json({ ok: true });
}
