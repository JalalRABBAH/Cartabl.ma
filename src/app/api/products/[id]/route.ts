import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ProductCategory } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { saveProductImage, saveProductImages, deleteProductImage, deleteProductImages } from "@/lib/upload";
import { parseProductBody, parseAmount, parseCategory } from "@/lib/product-body";

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function reject(field: string, message: string) {
  console.warn("[products:update] rejet:", field, "-", message);
  return NextResponse.json({ error: "validation", field, message }, { status: 400 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await parseProductBody(req);
  if (!body) return NextResponse.json({ error: "validation" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "notfound" }, { status: 404 });
  if (user.role === "SELLER" && product.sellerId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const data: Record<string, unknown> = {};

  const name = body.get("name");
  if (name !== null) {
    if (name.length < 2) return reject("name", "Le nom du produit est requis (2 caractères min)");
    data.name = name;
    if (name !== product.name) {
      let slug = slugify(name);
      const clash = await prisma.product.findUnique({ where: { slug } });
      if (clash && clash.id !== id) slug = `${slug}-${Math.floor(Math.random() * 999)}`;
      data.slug = slug;
    }
  }
  const nameAr = body.get("nameAr");
  if (nameAr !== null) data.nameAr = nameAr || (data.name as string) || product.name;

  const description = body.get("description");
  if (description !== null) {
    if (description.length < 5)
      return reject("description", "La description est requise (5 caractères min)");
    data.description = description;
  }
  const descriptionAr = body.get("descriptionAr");
  if (descriptionAr !== null)
    data.descriptionAr = descriptionAr || (data.description as string) || product.description;

  const brand = body.get("brand");
  if (brand !== null) {
    if (!brand) return reject("brand", "La marque est requise");
    data.brand = brand;
  }

  if (body.has("category")) {
    const cat = parseCategory(body.get("category"));
    if ("error" in cat) return reject("category", cat.error);
    data.category = cat.value;
  }

  const priceRaw = body.get("price");
  if (priceRaw !== null) {
    const price = parseAmount(priceRaw);
    if (price === null) return reject("price", "Prix invalide (nombre positif attendu)");
    data.price = price;
  }
  if (body.has("compareAtPrice")) {
    const raw = body.get("compareAtPrice");
    if (!raw || raw.trim() === "") {
      data.compareAtPrice = null;
    } else {
      const compareAtPrice = parseAmount(raw);
      if (compareAtPrice === null) return reject("compareAtPrice", "Prix barré invalide");
      data.compareAtPrice = compareAtPrice;
    }
  }
  const stockRaw = body.get("stock");
  if (stockRaw !== null) {
    const stock =
      stockRaw.trim() === "" ? 0 : Math.max(0, Math.round(Number(stockRaw) || 0));
    data.stock = stock;
  }
  if (body.has("colors")) {
    const colors = (body.get("colors") ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter((c) => HEX.test(c))
      .slice(0, 8);
    data.colorsJson = JSON.stringify(colors);
  }
  if (body.has("level")) data.level = body.get("level") || null;
  const featured = body.get("featured");
  if (featured !== null) data.featured = featured === "true";

  const imgs = body.files();
  if (imgs.length > 0) {
    const urls = await saveProductImages(imgs);
    if (urls.length === 0) return reject("image", "Image invalide (JPG/PNG/WebP/GIF, 4 Mo max)");
    const oldImages: string[] = (() => { try { return JSON.parse(product.imagesJson || "[]"); } catch { return []; } })();
    await deleteProductImages(oldImages);
    if (product.imageUrl) await deleteProductImage(product.imageUrl);
    data.imageUrl = urls[0];
    data.imagesJson = JSON.stringify(urls);
  } else {
    const img = body.file();
    if (img) {
      const imageUrl = await saveProductImage(img);
      if (!imageUrl) return reject("image", "Image invalide (JPG/PNG/WebP/GIF, 4 Mo max)");
      const oldImages: string[] = (() => { try { return JSON.parse(product.imagesJson || "[]"); } catch { return []; } })();
      await deleteProductImages(oldImages);
      await deleteProductImage(product.imageUrl);
      data.imageUrl = imageUrl;
      data.imagesJson = JSON.stringify([imageUrl]);
    }
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
