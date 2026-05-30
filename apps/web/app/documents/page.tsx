"use client";

import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import type {
  CreateDocumentResponse,
  GetDocumentResponse,
  ListDocumentsResponse,
  SearchDocumentsResponse,
} from "@/lib/api";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  searchDocuments,
} from "@/lib/api";

export default function DocumentsPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<CreateDocumentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<
    ListDocumentsResponse["documents"]
  >([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [selectedDocument, setSelectedDocument] =
    useState<GetDocumentResponse | null>(null);
  const [isLoadingSelectedDocument, setIsLoadingSelectedDocument] =
    useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<SearchDocumentsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await listDocuments();
        setDocuments(response.documents);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to load documents",
        );
      } finally {
        setIsLoadingDocuments(false);
      }
    }

    void loadDocuments();
  }, []);

  async function handleSelectDocument(documentId: string) {
    setError(null);
    setIsLoadingSelectedDocument(true);

    try {
      const response = await getDocument(documentId);
      setSelectedDocument(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load document",
      );
    } finally {
      setIsLoadingSelectedDocument(false);
    }
  }

  async function handleDeleteDocument(documentId: string) {
    setError(null);
    setDeletingDocumentId(documentId);

    try {
      await deleteDocument(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== documentId),
      );

      if (selectedDocument?.document.id === documentId) {
        setSelectedDocument(null);
      }

      if (result?.document.id === documentId) {
        setResult(null);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to delete document",
      );
    } finally {
      setDeletingDocumentId(null);
    }
  }

  async function handleSearch(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSearchResults(null);
    setIsSearching(true);

    try {
      const response = await searchDocuments({
        query: searchQuery,
        limit: 5,
      });

      setSearchResults(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Search failed",
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await createDocument({
        title,
        text,
      });

      setResult(response);
      setSelectedDocument(response);
      setDocuments((currentDocuments) => [
        response.document,
        ...currentDocuments,
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Documents
        </p>

        <h1 className="mt-4 text-4xl font-bold leading-tight">
          Add documents to your knowledge base.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          Paste text below to store it in the knowledge base. The backend will
          validate the input, split it into chunks, and persist the document in
          PostgreSQL.
        </p>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Semantic search</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search by meaning across document chunks stored with vector
            embeddings.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Ask about RAG, embeddings, or your saved notes"
            />

            <button
              type="submit"
              disabled={isSearching}
              className="rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchResults ? (
            <div className="mt-5 grid gap-3">
              {searchResults.results.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No strong semantic matches found.
                </p>
              ) : (
                searchResults.results.map((chunk) => (
                  <article
                    key={chunk.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-700">
                        Chunk {chunk.index + 1}
                      </p>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {chunk.text}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      From {chunk.documentTitle}
                    </p>
                  </article>
                ))
              )}
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Current documents</h2>

          {isLoadingDocuments ? (
            <p className="mt-3 text-sm text-slate-600">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">
              No documents have been added to the knowledge base yet.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {documents.map((document) => (
                <li
                  key={document.id}
                  className={`rounded-lg border p-4 transition ${
                    selectedDocument?.document.id === document.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => void handleSelectDocument(document.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="font-medium">{document.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Added on {new Date(document.createdAt).toLocaleString()}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDeleteDocument(document.id)}
                      disabled={deletingDocumentId === document.id}
                      className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingDocumentId === document.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        {isLoadingSelectedDocument ? (
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-600">
              Loading selected document...
            </p>
          </section>
        ) : selectedDocument ? (
          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">
              {selectedDocument.document.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Document ID: {selectedDocument.document.id}
            </p>

            <div className="mt-5 grid gap-4">
              {selectedDocument.chunks.map((chunk) => (
                <article
                  key={chunk.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-medium text-slate-700">
                    Chunk {chunk.index + 1}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {chunk.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Example: RAG Notes"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">
              Document text
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-56 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Paste your notes or article text here."
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Processing..." : "Create document"}
          </button>
        </form>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {result ? (
          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Generated chunks</h2>
            <p className="mt-2 text-sm text-slate-600">
              Document ID: {result.document.id}
            </p>

            <div className="mt-5 grid gap-4">
              {result.chunks.map((chunk) => (
                <article
                  key={chunk.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-medium text-slate-700">
                    Chunk {chunk.index + 1}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {chunk.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
