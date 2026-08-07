import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { generateTrackingCode, generateOrderNumber } from "@/lib/utils";
import { shippingFeeFor, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { OrderStatus } from "@prisma/client";

const itemSchema = z.object({
  productId: z.string(),
  qty: z.number().int().min(1).max(20),
  color: z.string().optional(),
});

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email().optional().or(z.literal("")),
  city: z.string().min(2),
  address: z.string().min(5),
  notes: z.string().optional(),
  paymentMethod: z.enum(["COD", "CARD"]).default("COD"),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const user = await getSessionUser();

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.items.map((i) => i.productId) } },
  });

  const orderItems: {
    productId: string;
    productName: string;
    productSlug: string;
    color?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[] = [];
  let subtotal = 0;

  for (const it of parsed.items) {
    const p = products.find((x) => x.id === it.productId);
    if (!p || p.stock < it.qty) {
      return NextResponse.json(
        { error: "stock", slug: p?.slug },
        { status: 409 },
      );
    }
    const total = p.price * it.qty;
    subtotal += total;
    orderItems.push({
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      color: it.color,
      quantity: it.qty,
      unitPrice: p.price,
      total,
    });
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingFeeFor(parsed.city);
  const total = subtotal + shippingFee;

  const orderNumber = generateOrderNumber();
  const tracking = generateTrackingCode();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number: orderNumber,
        trackingCode: tracking,
        userId: user?.id ?? null,
        customerName: parsed.customerName.trim(),
        customerPhone: parsed.customerPhone.trim(),
        customerEmail: parsed.customerEmail || null,
        city: parsed.city,
        address: parsed.address.trim(),
        notes: parsed.notes?.trim() || null,
        paymentMethod: parsed.paymentMethod,
        subtotal,
        shippingFee,
        discount: 0,
        total,
        status: OrderStatus.PENDING,
        items: { create: orderItems },
        events: {
          create: {
            status: OrderStatus.PENDING,
            actor: "SYSTEM",
            actorName: "Cartabl.ma",
            note: "Commande reçue via le site",
          },
        },
      },
    });

    for (const it of orderItems) {
      await tx.product.update({
        where: { id: it.productId! },
        data: { stock: { decrement: it.quantity }, sold: { increment: it.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json(
    {
      number: order.number,
      trackingCode: order.trackingCode,
      total,
      shippingFee,
    },
    { status: 201 },
  );
}
