import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";

type StoredDocument = {
  document: DocumentRecord;
  chunks: ChunkRecord[];
};

const documents = new Map<string, StoredDocument>();

export function saveDocument(record: StoredDocument) {
  documents.set(record.document.id, record);

  return record;
}

export function listDocuments() {
  return Array.from(documents.values()).map((record) => record.document);
}

export function getDocument(documentId: string) {
  return documents.get(documentId) ?? null;
}
