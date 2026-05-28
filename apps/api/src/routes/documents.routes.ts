import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { chunkText } from "../services/chunking.service.js";
import {
  deleteDocument,
  getDocument,
  listDocuments,
  saveDocument,
} from "../services/document-store.service.js";

const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(20, "Document text must contain at least 20 characters"),
});

export async function documentRoutes(app: FastifyInstance) {
  app.get("/documents", async () => {
    return {
      documents: listDocuments(),
    };
  });

  app.get("/documents/:documentId", async (request, reply) => {
    const paramsSchema = z.object({
      documentId: z.string().uuid("Document ID must be a valid UUID"),
    });

    const parsed = paramsSchema.safeParse(request.params);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid document ID",
        details: parsed.error.flatten(),
      });
    }

    const record = getDocument(parsed.data.documentId);

    if (!record) {
      return reply.status(404).send({
        error: "Document not found",
      });
    }

    return record;
  });

  app.delete("/documents/:documentId", async (request, reply) => {
    const paramsSchema = z.object({
      documentId: z.string().uuid("Document ID must be a valid UUID"),
    });

    const parsed = paramsSchema.safeParse(request.params);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid document ID",
        details: parsed.error.flatten(),
      });
    }

    const wasDeleted = deleteDocument(parsed.data.documentId);

    if (!wasDeleted) {
      return reply.status(404).send({
        error: "Document not found",
      });
    }

    return reply.status(204).send();
  });

  app.post("/documents", async (request, reply) => {
    const parsed = createDocumentSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid document",
        details: parsed.error.flatten(),
      });
    }

    const document: DocumentRecord = {
      id: crypto.randomUUID(),
      title: parsed.data.title,
      sourceType: "paste",
      createdAt: new Date().toISOString(),
    };

    const chunks: ChunkRecord[] = chunkText(parsed.data.text).map((chunk) => ({
      id: crypto.randomUUID(),
      documentId: document.id,
      text: chunk.text,
      index: chunk.index,
    }));

    const saved = saveDocument({
      document,
      chunks,
    });

    return reply.status(201).send(saved);
  });
}
