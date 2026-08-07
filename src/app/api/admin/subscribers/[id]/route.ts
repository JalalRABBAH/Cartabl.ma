import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "notfound" }, { status: 404 });

  await prisma.subscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
