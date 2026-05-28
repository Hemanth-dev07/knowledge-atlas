import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";

export type StoredDocument = {
  document: DocumentRecord;
  chunks: ChunkRecord[];
};

export type DocumentStore = {
  saveDocument(record: StoredDocument): Promise<StoredDocument>;
  listDocuments(): Promise<DocumentRecord[]>;
  getDocument(documentId: string): Promise<StoredDocument | null>;
  deleteDocument(documentId: string): Promise<boolean>;
};

export function createInMemoryDocumentStore(): DocumentStore {
  const documents = new Map<string, StoredDocument>();

  return {
    async saveDocument(record) {
      documents.set(record.document.id, record);
      return record;
    },

    async listDocuments() {
      return Array.from(documents.values()).map((record) => record.document);
    },

    async getDocument(documentId) {
      return documents.get(documentId) ?? null;
    },

    async deleteDocument(documentId) {
      return documents.delete(documentId);
    },
  };
}
