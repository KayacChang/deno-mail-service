import {
  RouterContext as Context,
  cond,
  complement,
  has as _has,
  T,
  map as _map,
  curry,
  thunkify,
  QueryResult,
  prop,
  pipe,
} from "../def.ts";

import { query, insert } from "../databases/postgres.ts";
import { badRequest, created, ok } from "../utils/response.ts";
import { Email, toEmail } from "../types.ts";
import SendGrid from "../services/sendgrid.ts";

const map = curry(_map);
const hasNot = complement(_has);

export async function getAll({ response }: Context) {
  await query(`SELECT * from email;`)
    .then(({ rows }: QueryResult) => rows)
    .then(map(toEmail))
    .then(ok(response));
}

function isEmail(email: string) {
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return validRegex.test(email);
}

export async function add({ request, response }: Context) {
  const resp = thunkify(badRequest)(response);

  await Promise.resolve(request.body().value).then(
    cond([
      [hasNot("send_from"), resp("Request body should have [send_from]")],
      // [hasNot("organization"), resp("Request body should have [organization]")],
      [hasNot("address"), resp("Request body should have [address]")],
      [
        pipe(prop("address"), complement(isEmail)),
        resp("Request email format not correct."),
      ],
      // [hasNot("phone"), resp("Request body should have [phone]")],
      [hasNot("content"), resp("Request body should have [content]")],
      [
        T,
        (email: Email) =>
          SendGrid.send(email).then((email) => {
            queueMicrotask(() => insert("email", email));

            created(response, email);
          }),
      ],
    ])
  );
}

export default {
  getAll,
  add,
};
