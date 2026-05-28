import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { documentChunks, documents } from "../db/schema.js";
import type { DocumentStore } from "./document-store.service.js";

type DocumentRow = typeof documents.$inferSelect;
type ChunkRow = typeof documentChunks.$inferSelect;

function toSourceType(value: string): DocumentRecord["sourceType"] {
  if (value === "paste" || value === "file") {
    return value;
  }

  throw new Error(`Unsupported document source type: ${value}`);
}

function toIsoString(value: Date | string) {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function toDocumentRecord(row: DocumentRow): DocumentRecord {
  return {
    id: row.id,
    title: row.title,
    sourceType: toSourceType(row.sourceType),
    createdAt: toIsoString(row.createdAt),
  };
}

function toChunkRecord(row: ChunkRow): ChunkRecord {
  return {
    id: row.id,
    documentId: row.documentId,
    text: row.text,
    index: row.chunkIndex,
  };
}

export const databaseDocumentStore: DocumentStore = {
  async saveDocument(record) {
    await db.transaction(async (transaction) => {
      await transaction.insert(documents).values({
        id: record.document.id,
        title: record.document.title,
        sourceType: record.document.sourceType,
        createdAt: new Date(record.document.createdAt),
      });

      if (record.chunks.length > 0) {
        await transaction.insert(documentChunks).values(
          record.chunks.map((chunk) => ({
            id: chunk.id,
            documentId: chunk.documentId,
            text: chunk.text,
            chunkIndex: chunk.index,
          })),
        );
      }
    });

    return record;
  },

  async listDocuments() {
    const rows = await db
      .select()
      .from(documents)
      .orderBy(desc(documents.createdAt));

    return rows.map(toDocumentRecord);
  },

  async getDocument(documentId) {
    const [documentRow] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!documentRow) {
      return null;
    }

    const chunkRows = await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.documentId, documentId))
      .orderBy(asc(documentChunks.chunkIndex));

    return {
      document: toDocumentRecord(documentRow),
      chunks: chunkRows.map(toChunkRecord),
    };
  },

  async deleteDocument(documentId) {
    const deletedRows = await db
      .delete(documents)
      .where(eq(documents.id, documentId))
      .returning({ id: documents.id });

    return deletedRows.length > 0;
  },
};
