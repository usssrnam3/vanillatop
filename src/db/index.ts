import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return pool;
}

function createLazyDb() {
  let _db: ReturnType<typeof drizzle> | null = null;
  return new Proxy({} as ReturnType<typeof drizzle>, {
    get(_, prop) {
      if (!_db) _db = drizzle(getPool());
      return (_db as any)[prop];
    },
  });
}

export const db = createLazyDb();
