import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { resolveShopSlug } from "@/lib/shop";

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

const schema = z.object({
  name: z.string().min(2).optional(),
  phone: z.preprocess(emptyToNull, z.string().min(8).nullable().optional()),
  whatsapp: z.preprocess(
    emptyToNull,
    z.string().regex(/^[0-9+\-\s().]{8,20}$/, "invalid whatsapp").nullable().optional()
  ),
  shopName: z.preprocess(
    emptyToNull,
    z.string().min(2).max(40, "invalid shop name").nullable().optional()
  ),
  city: z.string().min(2).optional().nullable(),
  address: z.string().min(3).optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return NextResponse.json({ error: "notfound" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name.trim();
  if (body.phone !== undefined) data.phone = body.phone?.trim() || null;
  if (body.whatsapp !== undefined) data.whatsapp = body.whatsapp?.trim() || null;
  if (body.city !== undefined) data.city = body.city?.trim() || null;
  if (body.address !== undefined) data.address = body.address?.trim() || null;

  if (body.shopName !== undefined) {
    const name = body.shopName?.trim() || null;
    if (!name) {
      data.shopName = null;
      data.shopSlug = null;
    } else {
      const slug = await resolveShopSlug(user.id, name);
      if (!slug) {
        return NextResponse.json({ error: "shop_slug_unavailable" }, { status: 409 });
      }
      data.shopName = name;
      data.shopSlug = slug;
    }
  }

  if (body.newPassword) {
    if (!body.currentPassword || !verifyPassword(body.currentPassword, dbUser.passwordHash)) {
      return NextResponse.json({ error: "password" }, { status: 422 });
    }
    const { hashPassword } = await import("@/lib/password");
    data.passwordHash = hashPassword(body.newPassword);
  }

  await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({
    ok: true,
    shopSlug: (data.shopSlug as string | null | undefined) ?? dbUser.shopSlug ?? null,
  });
}
