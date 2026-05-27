import { beforeEach, describe, expect, it } from "vitest";
import {
  clearDocuments,
  getDocument,
  listDocuments,
  saveDocument,
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
  beforeEach(() => {
    clearDocuments();
  });

  it("starts with no documents", () => {
    expect(listDocuments()).toEqual([]);
  });

  it("saves and lists document metadata", () => {
    saveDocument({
      document,
      chunks,
    });

    expect(listDocuments()).toEqual([document]);
  });

  it("gets a stored document with chunks by ID", () => {
    saveDocument({
      document,
      chunks,
    });

    expect(getDocument(document.id)).toEqual({
      document,
      chunks,
    });
  });

  it("returns null when a document does not exist", () => {
    expect(getDocument("33333333-3333-4333-8333-333333333333")).toBeNull();
  });
});
