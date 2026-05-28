import cors from "@fastify/cors";
import fastify from "fastify";
import { documentRoutes } from "./routes/documents.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { rootRoutes } from "./routes/root.routes.js";

type BuildAppOptions = {
  logger?: boolean;
};

export async function buildApp(options: BuildAppOptions = {}) {
  const app = fastify({
    logger: options.logger ?? true,
  });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "HEAD", "POST", "DELETE"],
  });

  await app.register(rootRoutes);
  await app.register(healthRoutes);
  await app.register(documentRoutes);

  return app;
}
