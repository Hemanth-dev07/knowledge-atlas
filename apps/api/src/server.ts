import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const app = await buildApp();

await app.listen({
  port: env.apiPort,
  host: "0.0.0.0",
});
