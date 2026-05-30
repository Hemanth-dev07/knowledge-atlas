import type { RagPreviewResponse } from "@knowledge-atlas/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ChunkSearchService } from "../services/chunk-search.service.js";
import type { EmbeddingGenerator } from "../services/embedding.service.js";

const ragPreviewSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  limit: z.number().int().min(1).max(10).default(5),
  minScore: z.number().min(0).max(1).default(0.2),
});

type RagRoutesOptions = {
  chunkSearchService: ChunkSearchService;
  generateEmbedding: EmbeddingGenerator;
};

export async function ragRoutes(
  app: FastifyInstance,
  options: RagRoutesOptions,
) {
  app.post("/rag/preview", async (request, reply) => {
    const parsed = ragPreviewSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid RAG preview request",
        details: parsed.error.flatten(),
      });
    }

    const queryEmbedding = await options.generateEmbedding(
      parsed.data.question,
    );

    const evidence = await options.chunkSearchService.searchSimilarChunks({
      queryEmbedding,
      limit: parsed.data.limit,
      minScore: parsed.data.minScore,
    });

    const response: RagPreviewResponse = {
      question: parsed.data.question,
      answer:
        evidence.length > 0
          ? "I found relevant context for this question. Answer generation will be added in the next RAG milestone."
          : "I could not find strong enough context for this question yet.",
      evidence,
    };

    return response;
  });
}
