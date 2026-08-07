import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { activateSellerSubscription } from "@/lib/subscription";

export async function POST() {
  const user = await getSessionUser();
  if (!user || user.role !== "SELLER") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sub = await activateSellerSubscription(user.id);
  return NextResponse.json({ ok: true, paidUntil: sub.paidUntil }, { status: 200 });
}
