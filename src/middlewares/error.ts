import {
  Middleware,
  isHttpError,
  Status,
} from "https://deno.land/x/oak/mod.ts";
import { badRequest, notFound } from "../utils/response.ts";

const error: Middleware = ({ response }, next) => {
  return next().catch((err) => {
    if (!isHttpError(err)) {
      throw err;
    }

    switch (err.status) {
      case Status.NotFound:
        return notFound(response, err.message);
      case Status.BadRequest:
        return badRequest(response, err.message);

      default:
        throw err;
    }
  });
};

export default error;
