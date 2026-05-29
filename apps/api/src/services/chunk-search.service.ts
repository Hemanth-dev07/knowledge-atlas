import type { RetrievedChunk } from "@knowledge-atlas/shared";

export type SearchSimilarChunksInput = {
  queryEmbedding: number[];
  limit: number;
  minScore: number;
};

export type ChunkSearchService = {
  searchSimilarChunks(
    input: SearchSimilarChunksInput,
  ): Promise<RetrievedChunk[]>;
};
