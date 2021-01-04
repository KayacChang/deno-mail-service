import { RouterContext as Context } from "https://deno.land/x/oak/mod.ts";
import { ok } from "../utils/response.ts";

export function getAll({ response }: Context) {
  return ok(response, "ok");
}
