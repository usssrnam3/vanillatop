import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { normalizeSteamID } from "@/lib/steamid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const message = String(body.message ?? "").trim();
    const donationId = Number(body.id);

    if (!donationId || !amount || !message) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    // Try to match PAY{id} prefix first
    const payIdMatch = message.match(/^PAY(\d+)/);
    if (payIdMatch) {
      const paymentId = Number(payIdMatch[1]);
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId))
        .limit(1);

      if (payment) {
        await db
          .update(payments)
          .set({ status: "completed", donationId, donationMessage: message })
          .where(eq(payments.id, paymentId));
        return NextResponse.json({ ok: true, matched: "pay_id" });
      }
    }

    // Fallback: match by SteamID64 in message
    const sid64 = message.match(/(7656119\d{10})/)?.[1];
    if (!sid64) {
      return NextResponse.json({ ok: false, reason: "no_steamid" }, { status: 200 });
    }

    const norm = normalizeSteamID(sid64);
    if (!norm) {
      return NextResponse.json({ ok: false, reason: "invalid_steamid" }, { status: 200 });
    }

    const existing = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.steamId64, norm.steamId64),
          eq(payments.status, "pending"),
          eq(payments.amount, Math.floor(amount)),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(payments).values({
        steamId: norm.steamId,
        steamId64: norm.steamId64,
        amount: Math.floor(amount),
        status: "completed",
        donationId,
        donationMessage: message,
      });
    } else {
      await db
        .update(payments)
        .set({ status: "completed", donationId, donationMessage: message })
        .where(eq(payments.id, existing[0].id));
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
