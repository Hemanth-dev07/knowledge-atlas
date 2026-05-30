import type { RetrievedChunk } from "@knowledge-atlas/shared";
import { desc, eq, isNotNull, sql } from "drizzle-orm";
import { cosineDistance } from "drizzle-orm/sql/functions/vector";
import { db } from "../db/client.js";
import { documentChunks, documents } from "../db/schema.js";
import type { ChunkSearchService } from "./chunk-search.service.js";

export const databaseChunkSearchService: ChunkSearchService = {
  async searchSimilarChunks({ queryEmbedding, limit, minScore }) {
    const similarity = sql<number>`1 - (${cosineDistance(
      documentChunks.embedding,
      queryEmbedding,
    )})`;

    const rows = await db
      .select({
        id: documentChunks.id,
        documentId: documentChunks.documentId,
        documentTitle: documents.title,
        text: documentChunks.text,
        index: documentChunks.chunkIndex,
        score: similarity,
      })
      .from(documentChunks)
      .innerJoin(documents, eq(documentChunks.documentId, documents.id))
      .where(isNotNull(documentChunks.embedding))
      .orderBy(desc(similarity))
      .limit(limit);

    return rows
      .map(
        (row): RetrievedChunk => ({
          ...row,
          score: Number(row.score),
        }),
      )
      .filter((chunk) => chunk.score >= minScore);
  },
};
