import { Pool } from "https://deno.land/x/postgres/mod.ts";
import { QueryConfig } from "https://deno.land/x/postgres/query.ts";

const env = Deno.env;

const pool = new Pool(
  {
    user: env.get("PG_USER"),
    database: env.get("PG_DATABASE"),
    password: env.get("PG_PASSWORD"),
    hostname: env.get("PG_HOST"),
    port: Number(env.get("PG_PORT") || 5432),
  },
  Number(env.get("PG_CONNECTIONS") || 20)
);

export async function query(sql: string | QueryConfig) {
  const client = await pool.connect();

  const result = await client.query(sql);

  client.release();

  return result;
}

export default { query };
