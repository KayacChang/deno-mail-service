import { info } from "https://deno.land/std/log/mod.ts";
import { Middleware } from "https://deno.land/x/oak/mod.ts";

const logger: Middleware = async ({ request, response }, next) => {
  await next();

  const time = response.headers.get("X-Response-Time");
  info(`${request.method} ${request.url.pathname} - ${time}`);
};

export default logger;
