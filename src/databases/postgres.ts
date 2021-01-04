import { Pool } from "https://deno.land/x/postgres/mod.ts";

const env = Deno.env;

export default new Pool(
  {
    user: env.get("PG_USER"),
    database: env.get("PG_DATABASE"),
    password: env.get("PG_PASSWORD"),
    hostname: env.get("PG_HOSTNAME"),
    port: Number(env.get("PG_PORT") || 5432),
  },
  Number(env.get("PG_CONNECTIONS") || 20)
);
