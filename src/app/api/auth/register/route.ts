import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8).optional().or(z.literal("")),
  password: z.string().min(6),
  city: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email,
        phone: body.phone || null,
        passwordHash: hashPassword(body.password),
        role: Role.BUYER,
        city: body.city || null,
        address: body.address || null,
      },
    });
    const token = await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    const store = await cookies();
    store.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return NextResponse.json({ ok: true, role: user.role, name: user.name }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
