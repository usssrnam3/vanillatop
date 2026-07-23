import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = _request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.API_KEY}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const [updated] = await db
    .update(payments)
    .set({ status: "fulfilled", fulfilledAt: new Date() })
    .where(eq(payments.id, numId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, payment: updated });
}
