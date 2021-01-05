import { Status } from "https://deno.land/x/std/http/http_status.ts";
import { Email } from "../types.ts";
import { postJSON } from "../utils/request.ts";

const API = Deno.env.get("SENDGRID_API") || "";
const KEY = `Bearer ${Deno.env.get("SENDGRID_KEY")}`;
const SENDER = Deno.env.get("SENDGRID_SENDER") || "";
const RECEIVER = Deno.env.get("SENDGRID_RECEIVER") || "";
const TITLE = Deno.env.get("SENDGRID_TITLE") || "";

const fillInTemplate = ({
  send_from,
  organization,
  address,
  phone,
  content,
  created_on,
}: Email) => `
Send From: ${send_from}
Organization: ${organization}
Email Address: ${address}
Phone Number: ${phone}
Date: ${created_on.toLocaleString()}
======================================

${content}
`;

export async function send(email: Email) {
  email.created_on = new Date();

  const result = await postJSON(API, {
    headers: {
      Authorization: KEY,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: RECEIVER }] }],
      from: { email: SENDER },
      subject: TITLE,
      content: [{ type: "text/plain", value: fillInTemplate(email) }],
    }),
  });

  if (result.status !== Status.Accepted) {
    throw new Error(String(result.status));
  }

  return email;
}

export default { send };
