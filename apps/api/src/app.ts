import cors from "@fastify/cors";
import fastify from "fastify";
import { documentRoutes } from "./routes/documents.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { rootRoutes } from "./routes/root.routes.js";
import { databaseDocumentStore } from "./services/database-document-store.service.js";
import type { DocumentStore } from "./services/document-store.service.js";

type BuildAppOptions = {
  logger?: boolean;
  documentStore?: DocumentStore;
};

export async function buildApp(options: BuildAppOptions = {}) {
  const app = fastify({
    logger: options.logger ?? true,
  });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "HEAD", "POST", "DELETE"],
  });

  const documentStore = options.documentStore ?? databaseDocumentStore;

  await app.register(rootRoutes);
  await app.register(healthRoutes);
  await app.register(documentRoutes, {
    documentStore,
  });

  return app;
}
