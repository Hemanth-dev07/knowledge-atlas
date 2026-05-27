import type { FastifyInstance } from "fastify";

export async function rootRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      name: "Knowledge Atlas API",
      status: "running",
      routes: ["/health", "/documents", "/documents/:documentId"],
    };
  });
}
