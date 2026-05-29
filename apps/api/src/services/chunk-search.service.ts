import type { RetrievedChunk } from "@knowledge-atlas/shared";

export type SearchSimilarChunksInput = {
  queryEmbedding: number[];
  limit: number;
};

export type ChunkSearchService = {
  searchSimilarChunks(
    input: SearchSimilarChunksInput,
  ): Promise<RetrievedChunk[]>;
};
