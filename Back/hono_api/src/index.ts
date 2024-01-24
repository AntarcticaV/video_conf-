import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import routers_user from "./routers/routers_user";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", logger());

app.use(
  "/user/*",
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.route("/user", routers_user);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
