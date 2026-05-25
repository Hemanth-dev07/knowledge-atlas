export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Knowledge Atlas
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight">
          Build a personal AI research assistant with graphs, vectors, and RAG.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          This project helps you learn how a full-stack TypeScript app can
          ingest documents, extract concepts, search by semantic meaning, and
          answer questions using retrieved evidence.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Knowledge Graph</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Stores concepts and relationships so the app understands how ideas
              are connected.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Vector Database</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Stores embeddings so the app can find document chunks by meaning,
              not only exact keywords.
            </p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">RAG Pipeline</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Retrieves relevant evidence before asking an AI model to generate
              an answer.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
