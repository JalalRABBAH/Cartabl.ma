import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const { token, password } = schema.parse(await req.json());

    const record = await prisma.passwordReset.findUnique({
      where: { token },
      select: { id: true, userId: true, expiresAt: true, used: true },
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashPassword(password) },
    });

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
