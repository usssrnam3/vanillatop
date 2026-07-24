import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [topDonators, recentDonations] = await Promise.all([
    db
      .select({
        steamId: payments.steamId,
        steamId64: payments.steamId64,
        total: sql<number>`sum(${payments.amount})`,
        count: sql<number>`count(*)`,
      })
      .from(payments)
      .where(eq(payments.status, "completed"))
      .groupBy(payments.steamId, payments.steamId64)
      .orderBy(desc(sql`sum(${payments.amount})`))
      .limit(50),
    db
      .select()
      .from(payments)
      .where(
        sql`${payments.fulfilledAt} >= ${sevenDaysAgo.toISOString()} OR (${payments.fulfilledAt} IS NULL AND ${payments.createdAt} >= ${sevenDaysAgo.toISOString()})`,
      )
      .orderBy(desc(payments.createdAt))
      .limit(100),
  ]);

  return NextResponse.json({ topDonators, recentDonations });
}