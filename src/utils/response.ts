import { Response } from "https://deno.land/x/oak/mod.ts";
import { Status } from "https://deno.land/x/std/http/http_status.ts";

export function ok<T>(response: Response, data: T) {
  return Object.assign(response, {
    status: Status.OK,
    body: {
      success: true,
      data,
    },
  });
}

export function created<T>(response: Response, data: T) {
  return Object.assign(response, {
    status: Status.Created,
    body: {
      success: true,
      data,
    },
  });
}

export function badRequest(response: Response, msg: string) {
  return Object.assign(response, {
    status: Status.BadRequest,
    body: {
      success: false,
      msg,
    },
  });
}
