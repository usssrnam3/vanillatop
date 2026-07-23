import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const steamId = String(body.steamId ?? "").trim();
    const amount = Number(body.amount);

    if (!steamId) {
      return NextResponse.json(
        { error: "Укажите Steam ID" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount < 10) {
      return NextResponse.json(
        { error: "Минимальная сумма пополнения — 10 рублей" },
        { status: 400 }
      );
    }

    const [payment] = await db
      .insert(payments)
      .values({
        steamId,
        amount: Math.floor(amount),
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      message: `Заказ на пополнение ${payment.amount} ₽ создан`,
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте позже." },
      { status: 500 }
    );
  }
}
