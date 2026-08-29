import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { allowedTransitions, ACTOR } from "@/lib/orders";
import { sendOrderStatusMail } from "@/lib/mailer";
import { OrderStatus } from "@prisma/client";

const schema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { number },
    include: { items: true, user: true },
  });
  if (!order) return NextResponse.json({ error: "notfound" }, { status: 404 });

  const actorType =
    user.role === "SELLER" || user.role === "ADMIN"
      ? "SELLER"
      : user.role === "DELIVERY"
        ? "DELIVERY"
        : user.role === "BUYER"
          ? "BUYER"
          : null;
  if (!actorType) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (actorType === "BUYER" && order.userId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const allowed = allowedTransitions(order.status, actorType);
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "transition" }, { status: 422 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const now = new Date();
    await tx.statusEvent.create({
      data: {
        orderId: order.id,
        status: body.status,
        actor: user.role,
        actorName: user.name,
        note: body.note?.trim() || null,
        createdAt: now,
      },
    });
    if (body.status === OrderStatus.CANCELED) {
      for (const it of order.items) {
        if (!it.productId) continue;
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity }, sold: { decrement: it.quantity } },
        });
      }
    }
    return tx.order.update({
      where: { id: order.id },
      data: {
        status: body.status,
        deliveredAt: body.status === OrderStatus.DELIVERED ? now : null,
      },
    });
  });

  const buyerEmail = order.customerEmail || order.user?.email;
  if (buyerEmail) {
    sendOrderStatusMail(
      buyerEmail,
      {
        number: updated.number,
        trackingCode: updated.trackingCode,
        customerName: updated.customerName,
        subtotal: updated.subtotal,
        shippingFee: updated.shippingFee,
        total: updated.total,
      },
      body.status,
      body.note
    );
  }

  return NextResponse.json({ ok: true, status: updated.status });
}
