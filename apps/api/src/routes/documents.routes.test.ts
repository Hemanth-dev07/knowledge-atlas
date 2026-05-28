import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import { clearDocuments } from "../services/document-store.service.js";

describe("document routes", () => {
  beforeEach(() => {
    clearDocuments();
  });

  it("lists no documents initially", async () => {
    const app = await buildApp({ logger: false });

    const response = await app.inject({
      method: "GET",
      url: "/documents",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      documents: [],
    });

    await app.close();
  });

  it("creates a document and lists it", async () => {
    const app = await buildApp({ logger: false });

    const createResponse = await app.inject({
      method: "POST",
      url: "/documents",
      payload: {
        title: "RAG Notes",
        text: "RAG retrieves relevant context before generation. Vector databases store embeddings.",
      },
    });

    expect(createResponse.statusCode).toBe(201);

    const createdBody = createResponse.json();

    expect(createdBody.document.title).toBe("RAG Notes");
    expect(createdBody.chunks).toHaveLength(1);

    const listResponse = await app.inject({
      method: "GET",
      url: "/documents",
    });

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json().documents).toEqual([createdBody.document]);

    await app.close();
  });

  it("returns a stored document by ID", async () => {
    const app = await buildApp({ logger: false });

    const createResponse = await app.inject({
      method: "POST",
      url: "/documents",
      payload: {
        title: "Graph Notes",
        text: "Knowledge graphs store entities and relationships between concepts.",
      },
    });

    const createdBody = createResponse.json();

    const detailsResponse = await app.inject({
      method: "GET",
      url: `/documents/${createdBody.document.id}`,
    });

    expect(detailsResponse.statusCode).toBe(200);
    expect(detailsResponse.json()).toEqual(createdBody);

    await app.close();
  });

  it("returns 400 for an invalid document ID", async () => {
    const app = await buildApp({ logger: false });

    const response = await app.inject({
      method: "GET",
      url: "/documents/not-a-valid-id",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("Invalid document ID");

    await app.close();
  });

  it("returns 404 for a missing document", async () => {
    const app = await buildApp({ logger: false });

    const response = await app.inject({
      method: "GET",
      url: "/documents/00000000-0000-4000-8000-000000000000",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "Document not found",
    });

    await app.close();
  });

  it("deletes a stored document by ID", async () => {
    const app = await buildApp({ logger: false });

    const createResponse = await app.inject({
      method: "POST",
      url: "/documents",
      payload: {
        title: "Delete Me",
        text: "This document exists long enough to test deletion behavior.",
      },
    });

    const createdBody = createResponse.json();

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/documents/${createdBody.document.id}`,
    });

    expect(deleteResponse.statusCode).toBe(204);

    const detailResponse = await app.inject({
      method: "GET",
      url: `/documents/${createdBody.document.id}`,
    });

    expect(detailResponse.statusCode).toBe(404);

    await app.close();
  });

  it("returns 400 when deleting with an invalid document ID", async () => {
    const app = await buildApp({ logger: false });

    const response = await app.inject({
      method: "DELETE",
      url: "/documents/not-a-valid-id",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("Invalid document ID");

    await app.close();
  });

  it("returns 404 when deleting a missing document", async () => {
    const app = await buildApp({ logger: false });

    const response = await app.inject({
      method: "DELETE",
      url: "/documents/00000000-0000-4000-8000-000000000000",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "Document not found",
    });

    await app.close();
  });
});
