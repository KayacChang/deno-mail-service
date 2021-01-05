import { mergeDeepRight } from "https://deno.land/x/ramda/mod.ts";

export function post(url: string, init: RequestInit = {}) {
  return fetch(url, {
    method: "POST",
    ...init,
  });
}

export function postJSON(url: string, init: RequestInit = {}) {
  return post(
    url,
    mergeDeepRight(init, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
}
