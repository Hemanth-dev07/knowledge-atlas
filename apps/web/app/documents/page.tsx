"use client";

import { useState } from "react";
import type { CreateDocumentResponse } from "@/lib/api";
import { createDocument } from "@/lib/api";

export default function DocumentsPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<CreateDocumentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
          Paste text below to send it to the backend document ingestion API. The
          backend will validate the input, split it into chunks, and return the
          generated document and chunk records.
        </p>

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
