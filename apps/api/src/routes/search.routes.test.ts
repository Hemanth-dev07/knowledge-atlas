import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import type { ChunkSearchService } from "../services/chunk-search.service.js";
import { createInMemoryDocumentStore } from "../services/document-store.service.js";

const fakeEmbedding = Array.from({ length: 384 }, () => 0.2);

async function generateFakeEmbedding() {
  return fakeEmbedding;
}

function createFakeChunkSearchService(): ChunkSearchService {
  return {
    async searchSimilarChunks({ limit }) {
      return [
        {
          id: "22222222-2222-4222-8222-222222222222",
          documentId: "11111111-1111-4111-8111-111111111111",
          text: "RAG retrieves context before generation.",
          index: 0,
          score: 0.91,
        },
      ].slice(0, limit);
    },
  };
}

describe("search routes", () => {
  it("returns semantically similar chunks", async () => {
    const app = await buildApp({
      logger: false,
      documentStore: createInMemoryDocumentStore(),
      chunkSearchService: createFakeChunkSearchService(),
      generateEmbedding: generateFakeEmbedding,
    });

    const response = await app.inject({
      method: "POST",
      url: "/search",
      payload: {
        query: "How does RAG retrieve context?",
        limit: 3,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      query: "How does RAG retrieve context?",
      results: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          documentId: "11111111-1111-4111-8111-111111111111",
          text: "RAG retrieves context before generation.",
          index: 0,
          score: 0.91,
        },
      ],
    });

    await app.close();
  });

  it("returns 400 for an empty search query", async () => {
    const app = await buildApp({
      logger: false,
      documentStore: createInMemoryDocumentStore(),
      chunkSearchService: createFakeChunkSearchService(),
      generateEmbedding: generateFakeEmbedding,
    });

    const response = await app.inject({
      method: "POST",
      url: "/search",
      payload: {
        query: "",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("Invalid search request");

    await app.close();
  });
});
