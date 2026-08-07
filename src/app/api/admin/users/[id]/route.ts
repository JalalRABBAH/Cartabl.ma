import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";

const schema = z.object({
  role: z.nativeEnum(Role).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (id === user.id && (body.role !== undefined || body.active === false)) {
    return NextResponse.json({ error: "self" }, { status: 422 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "notfound" }, { status: 404 });

  await prisma.user.update({ where: { id }, data: body });
  return NextResponse.json({ ok: true });
}
