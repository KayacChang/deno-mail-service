import { Router } from "https://deno.land/x/oak/mod.ts";
import Email from "./controllers/email.ts";

const router = new Router();

router.get("/email", Email.getAll);

export default router;
