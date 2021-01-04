import { Application } from "https://deno.land/x/oak/mod.ts";
import { info, error } from "https://deno.land/std/log/mod.ts";

import logger from "./middlewares/logger.ts";
import timer from "./middlewares/timer.ts";
import router from "./router.ts";

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protoc = secure ? "https" : "http";
  const addr = hostname ? `${protoc}://${hostname}` : `port ${port}`;

  info(`Listening on ${addr}`);
});

app.addEventListener("error", (event) => error(event.error));

app.use(logger);
app.use(timer);
app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(Deno.env.get("PORT") || 3000);
await app.listen({ port });
