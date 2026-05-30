import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import type { ChunkSearchService } from "../services/chunk-search.service.js";
import { createInMemoryDocumentStore } from "../services/document-store.service.js";

const fakeEmbedding = Array.from({ length: 384 }, () => 0.3);

async function generateFakeEmbedding() {
  return fakeEmbedding;
}

async function generateFakeAnswer() {
  return "RAG retrieves context before generation. [1]";
}

function createFakeChunkSearchService(results = 1): ChunkSearchService {
  return {
    async searchSimilarChunks({ limit }) {
      const chunks = [
        {
          id: "22222222-2222-4222-8222-222222222222",
          documentId: "11111111-1111-4111-8111-111111111111",
          documentTitle: "RAG Notes",
          text: "RAG retrieves context before generation.",
          index: 0,
          score: 0.91,
        },
      ];

      return results > 0 ? chunks.slice(0, limit) : [];
    },
  };
}

describe("RAG routes", () => {
  it("returns a preview answer with retrieved evidence", async () => {
    const app = await buildApp({
      logger: false,
      documentStore: createInMemoryDocumentStore(),
      chunkSearchService: createFakeChunkSearchService(),
      generateEmbedding: generateFakeEmbedding,
      answerGenerator: generateFakeAnswer,
    });

    const response = await app.inject({
      method: "POST",
      url: "/rag/preview",
      payload: {
        question: "How does RAG retrieve context?",
        limit: 3,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      question: "How does RAG retrieve context?",
      answer: "RAG retrieves context before generation. [1]",
      evidence: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          documentId: "11111111-1111-4111-8111-111111111111",
          documentTitle: "RAG Notes",
          text: "RAG retrieves context before generation.",
          index: 0,
          score: 0.91,
        },
      ],
    });

    await app.close();
  });

  it("returns a preview answer when no strong evidence is found", async () => {
    const app = await buildApp({
      logger: false,
      documentStore: createInMemoryDocumentStore(),
      chunkSearchService: createFakeChunkSearchService(0),
      generateEmbedding: generateFakeEmbedding,
      answerGenerator: generateFakeAnswer,
    });

    const response = await app.inject({
      method: "POST",
      url: "/rag/preview",
      payload: {
        question: "What is not in my notes?",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      question: "What is not in my notes?",
      answer: "I could not find strong enough context for this question yet.",
      evidence: [],
    });

    await app.close();
  });

  it("returns 400 for an empty question", async () => {
    const app = await buildApp({
      logger: false,
      documentStore: createInMemoryDocumentStore(),
      chunkSearchService: createFakeChunkSearchService(),
      generateEmbedding: generateFakeEmbedding,
      answerGenerator: generateFakeAnswer,
    });

    const response = await app.inject({
      method: "POST",
      url: "/rag/preview",
      payload: {
        question: "",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("Invalid RAG preview request");

    await app.close();
  });
});
