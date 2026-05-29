import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ChunkSearchService } from "../services/chunk-search.service.js";
import type { EmbeddingGenerator } from "../services/embedding.service.js";

const searchSchema = z.object({
  query: z.string().trim().min(1, "Search query is required"),
  limit: z.number().int().min(1).max(10).default(5),
  minScore: z.number().min(0).max(1).default(0.2),
});

type SearchRoutesOptions = {
  chunkSearchService: ChunkSearchService;
  generateEmbedding: EmbeddingGenerator;
};

export async function searchRoutes(
  app: FastifyInstance,
  options: SearchRoutesOptions,
) {
  app.post("/search", async (request, reply) => {
    const parsed = searchSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid search request",
        details: parsed.error.flatten(),
      });
    }

    const queryEmbedding = await options.generateEmbedding(parsed.data.query);

    const results = await options.chunkSearchService.searchSimilarChunks({
      queryEmbedding,
      limit: parsed.data.limit,
      minScore: parsed.data.minScore,
    });

    return {
      query: parsed.data.query,
      results,
    };
  });
}
