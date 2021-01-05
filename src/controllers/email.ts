import { RouterContext as Context } from "https://deno.land/x/oak/mod.ts";
import { query, insert } from "../databases/postgres.ts";
import { badRequest, created, ok } from "../utils/response.ts";
import { Email, toEmail } from "../types.ts";
import {
  cond,
  complement,
  has as _has,
  T,
  head,
  map as _map,
  curry,
} from "https://deno.land/x/ramda/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres@v0.4.6/query.ts";

const map = curry(_map);
const hasNot = complement(_has);

export async function getAll({ response }: Context) {
  await query(`SELECT * from email;`)
    .then(({ rows }: QueryResult) => rows)
    .then(map(toEmail))
    .then(ok(response));
}

export async function add({ request, response }: Context) {
  const resp = (msg: string) => () => badRequest(response, msg);

  await Promise.resolve(request.body().value).then(
    cond([
      [hasNot("send_from"), resp("Request body should have [send_from]")],
      [hasNot("organization"), resp("Request body should have [organization]")],
      [hasNot("address"), resp("Request body should have [address]")],
      [hasNot("phone"), resp("Request body should have [phone]")],
      [hasNot("content"), resp("Request body should have [content]")],
      [
        T,
        (body: Email) =>
          fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              Authorization:
                "Bearer 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",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: "egg734631@gmail.com" }] }],
              from: { email: "info@em1217.lexionlu.xyz" },
              subject: "Hello, World!",
              content: [{ type: "text/plain", value: JSON.stringify(body) }],
            }),
          })
            .then(() => insert("email", body))
            .then(({ rows }: QueryResult) => rows)
            .then(map(toEmail))
            .then(head)
            .then(created(response)),
      ],
    ])
  );
}

export default {
  getAll,
  add,
};
