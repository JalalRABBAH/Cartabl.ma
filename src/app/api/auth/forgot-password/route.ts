import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { sendResetPasswordMail } from "@/lib/mailer";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordReset.deleteMany({ where: { userId: user.id, used: false } });
    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    });

    sendResetPasswordMail(email.toLowerCase().trim(), token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
