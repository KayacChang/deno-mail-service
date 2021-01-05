import { RouterContext as Context } from "https://deno.land/x/oak/mod.ts";
import { query } from "../databases/postgres.ts";
import { ok } from "../utils/response.ts";
import { Email } from "../types.ts";

export async function getAll({ response }: Context) {
  const result = await query(`SELECT * from email;`);

  const emails: Email[] = result.rows.map(
    ([, send_from, organization, address, phone, content, created_on]) => ({
      send_from,
      organization,
      address,
      phone,
      content,
      created_on: new Date(created_on),
    })
  );

  return ok(response, emails);
}

export default {
  getAll,
};
