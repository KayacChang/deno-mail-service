import { Response } from "https://deno.land/x/oak/mod.ts";
import { Status } from "https://deno.land/x/std/http/http_status.ts";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";

export const ok = curry(<T>(response: Response, data: T) => {
  return Object.assign(response, {
    status: Status.OK,
    body: {
      success: true,
      data,
    },
  });
});

export const created = curry(<T>(response: Response, data: T) => {
  return Object.assign(response, {
    status: Status.Created,
    body: {
      success: true,
      data,
    },
  });
});

export const badRequest = curry((response: Response, msg: string) => {
  return Object.assign(response, {
    status: Status.BadRequest,
    body: {
      success: false,
      msg,
    },
  });
});

export const notFound = curry((response: Response, msg: string) => {
  return Object.assign(response, {
    status: Status.NotFound,
    body: {
      success: false,
      msg,
    },
  });
});
