import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { chunkText } from "../services/chunking.service.js";
import type { DocumentStore } from "../services/document-store.service.js";

const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(20, "Document text must contain at least 20 characters"),
});

type DocumentRoutesOptions = {
  documentStore: DocumentStore;
};

export async function documentRoutes(
  app: FastifyInstance,
  options: DocumentRoutesOptions,
) {
  app.get("/documents", async () => {
    return {
      documents: await options.documentStore.listDocuments(),
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

    const record = await options.documentStore.getDocument(
      parsed.data.documentId,
    );

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

    const wasDeleted = await options.documentStore.deleteDocument(
      parsed.data.documentId,
    );

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

    const saved = await options.documentStore.saveDocument({
      document,
      chunks,
    });

    return reply.status(201).send(saved);
  });
}
