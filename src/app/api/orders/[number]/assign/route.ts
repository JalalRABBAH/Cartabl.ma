import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ACTOR } from "@/lib/orders";
import { OrderStatus } from "@prisma/client";

const schema = z.object({ deliveryId: z.string() });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
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

  const order = await prisma.order.findUnique({ where: { number } });
  if (!order) return NextResponse.json({ error: "notfound" }, { status: 404 });

  const delivery = await prisma.user.findUnique({ where: { id: body.deliveryId } });
  if (!delivery || delivery.role !== "DELIVERY") {
    return NextResponse.json({ error: "delivery" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.deliveryAssignment.upsert({
      where: { orderId: order.id },
      update: { deliveryId: delivery.id },
      create: { orderId: order.id, deliveryId: delivery.id },
    });
    if (order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) {
      await tx.statusEvent.create({
        data: {
          orderId: order.id,
          status: OrderStatus.CONFIRMED,
          actor: ACTOR.SYSTEM,
          actorName: user.name,
          note: "Livreur assigné à la commande",
        },
      });
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CONFIRMED },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
