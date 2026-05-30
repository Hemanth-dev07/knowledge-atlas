export type DocumentRecord = {
  id: string;
  title: string;
  sourceType: "paste" | "file";
  createdAt: string;
};

export type ChunkRecord = {
  id: string;
  documentId: string;
  text: string;
  index: number;
};

export type RetrievedChunk = ChunkRecord & {
  documentTitle: string;
  score: number;
};

export type GraphNode = {
  id: string;
  label: string;
  type: "Document" | "Chunk" | "Concept";
};

export type GraphEdge = {
  source: string;
  target: string;
  label: string;
};
