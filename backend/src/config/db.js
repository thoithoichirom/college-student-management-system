import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Issue #2 — SSL: on in production, off in local dev
  ssl: isProduction ? { rejectUnauthorized: true } : false,

  // Issue #5 — Pool limits
  max: 10,                     // max 10 simultaneous DB connections
  idleTimeoutMillis: 30000,    // close idle connections after 30s
  connectionTimeoutMillis: 5000 // fail fast if no connection in 5s
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
