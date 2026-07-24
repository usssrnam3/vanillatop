import { NextResponse } from "next/server";
import { normalizeSteamID } from "@/lib/steamid";

export const dynamic = "force-dynamic";

interface DaDonation {
  id: number;
  amount: number;
  message: string;
  created_at: string;
}

interface DonorInfo {
  steamId: string;
  steamId64: string | null;
}

function extractSteamId(message: string): DonorInfo | null {
  const payMatch = message.match(/^PAY(\d+)\s+(7656119\d{10})/);
  if (payMatch) {
    const norm = normalizeSteamID(payMatch[2]);
    if (norm) return { steamId: norm.steamId, steamId64: norm.steamId64 };
  }
  const sid64 = message.match(/(7656119\d{10})/)?.[1];
  if (sid64) {
    const norm = normalizeSteamID(sid64);
    if (norm) return { steamId: norm.steamId, steamId64: norm.steamId64 };
  }
  return null;
}

async function fetchDaDonations(): Promise<DaDonation[]> {
  const token = process.env.DONATIONALERTS_TOKEN;
  if (!token) return [];

  const all: DaDonation[] = [];
  let page = 1;
  const limit = 100;

  for (let attempt = 0; attempt < 10; attempt++) {
    const url = `https://www.donationalerts.com/api/v1/alerts/donations?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) break;
    const json = await res.json();
    const data: DaDonation[] = json.data ?? [];
    if (data.length === 0) break;
    all.push(...data);
    if (data.length < limit) break;
    page++;
  }

  return all;
}

export async function GET() {
  const donations = await fetchDaDonations();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const donorMap = new Map<string, { steamId: string; steamId64: string | null; total: number; count: number }>();
  const recent: { id: number; steamId: string; amount: number; createdAt: string }[] = [];

  for (const d of donations) {
    const info = extractSteamId(d.message);
    if (!info) continue;

    const key = info.steamId64 ?? info.steamId;
    const existing = donorMap.get(key);
    if (existing) {
      existing.total += Math.floor(d.amount);
      existing.count++;
    } else {
      donorMap.set(key, {
        steamId: info.steamId,
        steamId64: info.steamId64,
        total: Math.floor(d.amount),
        count: 1,
      });
    }

    if (new Date(d.created_at).getTime() > sevenDaysAgo) {
      recent.push({
        id: d.id,
        steamId: info.steamId,
        amount: Math.floor(d.amount),
        createdAt: d.created_at,
      });
    }
  }

  const topDonators = Array.from(donorMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  recent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ topDonators, recentDonations: recent.slice(0, 100) });
}