import { Pool } from "https://deno.land/x/postgres/mod.ts";
import { QueryConfig } from "https://deno.land/x/postgres@v0.4.6/query.ts";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";

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

  queueMicrotask(() => client.release());

  return result;
}

export const insert = curry(<T>(table: string, data: T) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  return query({
    text: `
        INSERT INTO ${table} 
          ( ${keys.join()} ) 
        VALUES
          ( ${keys.map((_, idx) => `$${idx + 1}`).join()} )
        RETURNING
          *
        ;
      `,
    args: values,
  });
});

export default { query, insert };
