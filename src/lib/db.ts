import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

/**
 * Single shared connection pool to Amazon Aurora PostgreSQL.
 * Reused across Fluid Compute invocations (cached on globalThis) so we don't
 * exhaust connections on warm function instances.
 */
export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Aurora requires TLS; the demo cluster uses the AWS RDS CA.
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return global._pgPool;
}
