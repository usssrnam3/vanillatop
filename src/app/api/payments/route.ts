import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.API_KEY}`) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "completed";
  const steamId64 = searchParams.get("steamId64");

  const filters = [eq(payments.status, status)];
  if (steamId64) {
    filters.push(eq(payments.steamId64, steamId64));
  }

  const rows = await db
    .select()
    .from(payments)
    .where(and(...filters))
    .orderBy(desc(payments.createdAt))
    .limit(50);

  return NextResponse.json({ payments: rows });
}
