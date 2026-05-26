import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { chunkText } from "../services/chunking.service.js";

const createDocumentSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(20),
});

export async function documentRoutes(app: FastifyInstance) {
  app.post("/documents", async (request, reply) => {
    const parsed = createDocumentSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid document",
        details: parsed.error.flatten(),
      });
    }

    const chunks = chunkText(parsed.data.text);

    return reply.status(201).send({
      document: {
        title: parsed.data.title,
      },
      chunks,
    });
  });
}
