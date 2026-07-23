const STEAMID64_OFFSET = 76561197960265728n;

export function steamToSteamID64(steamId: string): string | null {
  const match = steamId.trim().toUpperCase().match(/^STEAM_(\d):(\d):(\d+)$/);
  if (!match) return null;
  const y = parseInt(match[3], 10);
  const z = parseInt(match[2], 10);
  return (STEAMID64_OFFSET + BigInt(y) * 2n + BigInt(z)).toString();
}

export function steamID64toSteam(id64: string): string | null {
  const match = id64.trim().match(/^(\d+)$/);
  if (!match) return null;
  const n = BigInt(match[1]);
  const diff = n - STEAMID64_OFFSET;
  if (diff < 0) return null;
  const y = Number(diff / 2n);
  const z = Number(diff % 2n);
  return `STEAM_0:${z}:${y}`;
}

export function isValidSteamID(value: string): boolean {
  return /^STEAM_\d:\d:\d+$/i.test(value.trim());
}

export function isValidSteamID64(value: string): boolean {
  return /^7656119\d{10}$/.test(value.trim());
}

export function normalizeSteamID(value: string): { steamId: string; steamId64: string } | null {
  const trimmed = value.trim();
  if (isValidSteamID64(trimmed)) {
    const sid = steamID64toSteam(trimmed);
    if (!sid) return null;
    return { steamId: sid, steamId64: trimmed };
  }
  if (isValidSteamID(trimmed)) {
    const sid64 = steamToSteamID64(trimmed);
    if (!sid64) return null;
    return { steamId: trimmed.toUpperCase(), steamId64: sid64 };
  }
  return null;
}
