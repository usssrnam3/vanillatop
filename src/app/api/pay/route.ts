import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { normalizeSteamID } from "@/lib/steamid";

const DA_ALERT = process.env.DONATIONALERTS_ALERT_NAME || "vanillaplusplas";

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

    const norm = normalizeSteamID(steamId);
    if (!norm) {
      return NextResponse.json(
        { error: "Неверный формат Steam ID. Используйте STEAM_0:X:XXXXX или SteamID64" },
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
        steamId: norm.steamId,
        steamId64: norm.steamId64,
        amount: Math.floor(amount),
        status: "pending",
      })
      .returning();

    const message = encodeURIComponent(`PAY${payment.id} ${norm.steamId64}`);
    const donateUrl = `https://www.donationalerts.com/widget/donate?alerts_name=${DA_ALERT}&amount=${Math.floor(amount)}&message=${message}`;

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      steamId64: norm.steamId64,
      donateUrl,
      message: `Заказ #${payment.id} создан. Перенаправляем на DonationAlerts...`,
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте позже." },
      { status: 500 }
    );
  }
}
