import cors from "@fastify/cors";
import fastify from "fastify";
import { env } from "./config/env.js";
import { healthRoutes } from "./routes/health.routes.js";
import { rootRoutes } from "./routes/root.routes.js";

const app = fastify({
  logger: true,
});
// CORS config
await app.register(cors, {
  origin: true,
});

// Routes are registered with fastify here
await app.register(rootRoutes);
await app.register(healthRoutes);

await app.listen({
  port: env.apiPort,
  host: "0.0.0.0",
});
