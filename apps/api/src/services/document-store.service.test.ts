import { beforeEach, describe, expect, it } from "vitest";
import {
  createInMemoryDocumentStore,
  type DocumentStore,
} from "./document-store.service.js";

const document = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "RAG Notes",
  sourceType: "paste" as const,
  createdAt: "2026-05-27T00:00:00.000Z",
};

const chunks = [
  {
    id: "22222222-2222-4222-8222-222222222222",
    documentId: document.id,
    text: "RAG retrieves context before generation.",
    index: 0,
  },
];

describe("document store", () => {
  let documentStore: DocumentStore;
  beforeEach(() => {
    documentStore = createInMemoryDocumentStore();
  });

  it("starts with no documents", async () => {
    await expect(documentStore.listDocuments()).resolves.toEqual([]);
  });

  it("saves and lists document metadata", async () => {
    await documentStore.saveDocument({
      document,
      chunks,
    });

    await expect(documentStore.listDocuments()).resolves.toEqual([document]);
  });

  it("gets a stored document with chunks by ID", async () => {
    await documentStore.saveDocument({
      document,
      chunks,
    });

    await expect(documentStore.getDocument(document.id)).resolves.toEqual({
      document,
      chunks,
    });
  });

  it("returns null when a document does not exist", async () => {
    await expect(
      documentStore.getDocument("33333333-3333-4333-8333-333333333333"),
    ).resolves.toBeNull();
  });

  it("deletes a stored document", async () => {
    await documentStore.saveDocument({
      document,
      chunks,
    });

    await expect(documentStore.deleteDocument(document.id)).resolves.toBe(true);
    await expect(documentStore.getDocument(document.id)).resolves.toBeNull();
    await expect(documentStore.listDocuments()).resolves.toEqual([]);
  });

  it("returns false when deleting a missing document", async () => {
    await expect(
      documentStore.deleteDocument("44444444-4444-4444-8444-444444444444"),
    ).resolves.toBe(false);
  });
});
