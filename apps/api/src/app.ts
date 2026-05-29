import cors from "@fastify/cors";
import fastify from "fastify";
import { documentRoutes } from "./routes/documents.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { rootRoutes } from "./routes/root.routes.js";
import type { DocumentStore } from "./services/document-store.service.js";
import type { EmbeddingGenerator } from "./services/embedding.service.js";

type BuildAppOptions = {
  logger?: boolean;
  documentStore?: DocumentStore;
  generateEmbedding?: EmbeddingGenerator;
};

async function getDefaultDocumentStore() {
  const { databaseDocumentStore } =
    await import("./services/database-document-store.service.js");

  return databaseDocumentStore;
}

async function getDefaultEmbeddingGenerator() {
  const { generateEmbedding } = await import("./services/embedding.service.js");

  return generateEmbedding;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const app = fastify({
    logger: options.logger ?? true,
  });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "HEAD", "POST", "DELETE"],
  });

  const documentStore =
    options.documentStore ?? (await getDefaultDocumentStore());
  const embeddingGenerator =
    options.generateEmbedding ?? (await getDefaultEmbeddingGenerator());

  await app.register(rootRoutes);
  await app.register(healthRoutes);
  await app.register(documentRoutes, {
    documentStore,
    generateEmbedding: embeddingGenerator,
  });

  return app;
}
