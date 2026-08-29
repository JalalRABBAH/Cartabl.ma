import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ProductCategory } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { saveProductImage, saveProductImages } from "@/lib/upload";
import { parseProductBody, parseAmount, parseCategory } from "@/lib/product-body";
import { sendProductPublishedMail } from "@/lib/mailer";

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function reject(field: string, message: string) {
  console.warn("[products:create] rejet:", field, "-", message);
  return NextResponse.json({ error: "validation", field, message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await parseProductBody(req);
  if (!body) {
    console.warn("[products:create] corps de requete illisible");
    return NextResponse.json(
      { error: "validation", message: "Requête illisible" },
      { status: 400 },
    );
  }

  const name = body.get("name") ?? "";
  const brand = body.get("brand") ?? "";
  const description = body.get("description") ?? "";
  const nameAr = body.get("nameAr") || name;
  const descriptionAr = body.get("descriptionAr") || description;
  const level = body.get("level") || null;
  const featured = body.get("featured") === "true";

  if (name.length < 2) return reject("name", "Le nom du produit est requis (2 caractères min)");
  if (!brand) return reject("brand", "La marque est requise");
  if (description.length < 5)
    return reject("description", "La description est requise (5 caractères min)");

  const cat = parseCategory(body.get("category"));
  if ("error" in cat) return reject("category", cat.error);

  const price = parseAmount(body.get("price"));
  if (price === null) return reject("price", "Prix invalide (nombre positif attendu)");

  let compareAtPrice: number | null = null;
  if (body.has("compareAtPrice")) {
    const rawCmp = body.get("compareAtPrice");
    if (rawCmp && rawCmp.trim() !== "") {
      compareAtPrice = parseAmount(rawCmp);
      if (compareAtPrice === null)
        return reject("compareAtPrice", "Prix barré invalide");
    }
  }

  const stockRaw = body.get("stock");
  const stock =
    stockRaw === null || stockRaw.trim() === "" ? 0 : Math.max(0, Math.round(Number(stockRaw) || 0));

  const colors = (body.get("colors") ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => HEX.test(c))
    .slice(0, 8);

  let imageUrl: string | null = null;
  let images: string[] = [];
  const imgs = body.files();
  if (imgs.length > 0) {
    images = await saveProductImages(imgs);
    if (images.length === 0) return reject("image", "Image invalide (JPG/PNG/WebP/GIF, 4 Mo max)");
    imageUrl = images[0];
  } else {
    const img = body.file();
    if (img) {
      imageUrl = await saveProductImage(img);
      if (!imageUrl) return reject("image", "Image invalide (JPG/PNG/WebP/GIF, 4 Mo max)");
      images = [imageUrl];
    }
  }

  let slug = slugify(name);
  let existing = await prisma.product.findUnique({ where: { slug } });
  while (existing) {
    slug = `${slugify(name)}-${Math.floor(Math.random() * 999)}`;
    existing = await prisma.product.findUnique({ where: { slug } });
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      nameAr,
      description,
      descriptionAr,
      category: cat.value as ProductCategory,
      brand,
      price,
      compareAtPrice,
      stock,
      colorsJson: JSON.stringify(colors),
      level,
      imageUrl,
      imagesJson: JSON.stringify(images),
      featured,
      sellerId: user.role === "SELLER" ? user.id : null,
    },
  });

  console.log("[products:create] OK", product.slug, "- vendeur:", user.email);
  if (user.role === "SELLER") {
    sendProductPublishedMail({ name: user.name, email: user.email }, product);
  }
  return NextResponse.json({ ok: true, slug: product.slug }, { status: 201 });
}
