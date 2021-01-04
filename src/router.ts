import { Router } from "https://deno.land/x/oak/mod.ts";
import { getAll } from "./controllers/email.ts";

const router = new Router();

router.get("/email", getAll);

export default router;
