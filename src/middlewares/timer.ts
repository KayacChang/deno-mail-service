import { Middleware } from "https://deno.land/x/oak/mod.ts";

const timer: Middleware = async ({ response }, next) => {
  const start = Date.now();

  await next();

  response.headers.set("X-Response-Time", `${Date.now() - start}ms`);
};

export default timer;
