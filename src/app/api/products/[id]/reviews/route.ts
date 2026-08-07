import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(500),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "notfound" }, { status: 404 });
  }

  const existing = await prisma.review.findFirst({
    where: { productId: id, userId: user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "already" }, { status: 409 });
  }

  const created = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        productId: id,
        userId: user.id,
        rating: body.rating,
        comment: body.comment.trim(),
      },
    });
    const agg = await tx.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await tx.product.update({
      where: { id },
      data: { rating: Math.round((agg._avg.rating ?? 0) * 10) / 10, ratingCount: agg._count.rating },
    });
    return review;
  });

  return NextResponse.json({ ok: true, id: created.id });
}
