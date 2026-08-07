import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase().trim() } });
    if (!user || !verifyPassword(body.password, user.passwordHash) || !user.active) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    const token = await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    const store = await cookies();
    store.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return NextResponse.json({ ok: true, role: user.role, name: user.name });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
}
