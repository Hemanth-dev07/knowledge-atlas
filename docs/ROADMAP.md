# Knowledge Atlas Roadmap

This roadmap breaks the project into small learning milestones. The goal is to build a portfolio-ready full-stack TypeScript application while understanding the concepts behind each layer.

Knowledge Atlas is becoming a personal AI research assistant where users can save documents, search their knowledge base semantically, chat with retrieved evidence, and later explore concepts through a knowledge graph.

Current checkpoint as of 2026-05-30:

- Monorepo foundation is complete.
- Backend and frontend foundations are complete.
- GitHub remote and CI are active.
- Documents and chunks are persisted in Neon PostgreSQL.
- Chunks can store `pgvector` embeddings.
- New chunks receive local TypeScript-generated embeddings.
- The API supports semantic chunk search.
- The frontend has a working document page and semantic search UI.
- Learning notes are stored locally in `docs/Day*.md` and ignored by Git.

## Phase 1: Project Foundation

Goal: set up the basic project structure and understand why each part exists.

Tasks:

- Create the root Node.js project
- Select the correct Node.js LTS version
- Set the Node.js version with `.nvmrc`
- Initialize Git
- Add `.gitignore`
- Add README documentation
- Create the monorepo folder structure
- Push the project to GitHub

Status: completed.

## Phase 2: Backend Foundation

Goal: create a basic TypeScript API server.

Tasks:

- Create the backend package
- Install backend dependencies
- Add TypeScript configuration
- Add environment configuration
- Create a root API route
- Create a health check endpoint
- Run the API locally
- Verify the API with browser/API requests

Status: completed.

## Phase 3: Frontend Foundation

Goal: create a basic frontend app.

Tasks:

- Create the frontend package with Next.js
- Use TypeScript, Tailwind CSS, ESLint, App Router, and Turbopack
- Rename the frontend workspace package
- Replace the default starter homepage
- Run lint and production build checks

Status: completed.

## Phase 4: Frontend-Backend Connection

Goal: prove that the frontend and backend can communicate through HTTP.

Tasks:

- Add a frontend environment variable for the API base URL
- Create a frontend API helper
- Call the backend health endpoint from the Next.js homepage
- Understand Server Components and dynamic rendering
- Verify the frontend build after adding API communication

Status: completed.

## Phase 5: Document Ingestion And Management

Goal: let users submit documents and understand how raw text becomes smaller chunks.

Tasks:

- Create a document submission API
- Validate request data with Zod
- Create a chunking service
- Split document text into chunks
- Return document/chunk records from the API
- Add a frontend document submission form
- Display generated chunks in the frontend
- List saved documents
- Fetch selected document chunks
- Highlight the selected document
- Delete documents
- Handle browser CORS for `DELETE`

Status: completed for the current single-user scaffold.

Notes:

- The UI is still a learning/scaffold interface, not the final commercial product UI.
- Delete confirmation and final UX polish will be handled later during product polish.

## Phase 6: Testing And CI Foundation

Goal: make the project reliable while it is still small.

Tasks:

- Add unit tests for chunking
- Add unit tests for the in-memory document store
- Add API route tests for document routes
- Add API route tests for search routes
- Use dependency injection to keep tests isolated
- Add GitHub Actions for typecheck, tests, and builds
- Fix CI-only issues caused by local environment assumptions

Status: completed as an initial CI/testing foundation.

Remaining later:

- Add frontend component/user-flow tests
- Add integration tests for selected database behavior when appropriate
- Improve CI caching and deployment checks

## Phase 7: Persistent Documents

Goal: store document data permanently instead of keeping it only in memory.

Tasks:

- Choose a relational database setup
- Create a Neon PostgreSQL project
- Add `DATABASE_URL` environment handling
- Install Drizzle ORM and Drizzle Kit
- Design `documents` and `document_chunks` tables
- Generate and apply migrations
- Create a database client
- Replace runtime in-memory storage with a database-backed document store
- Keep tests using an injected in-memory store
- Update frontend copy to reflect PostgreSQL persistence

Status: completed for documents and chunks.

Remaining later:

- Add users and ownership
- Add chat sessions and chat messages
- Add migration/backfill helpers as the data model evolves

## Phase 8: Vector Database With pgvector

Goal: store and search document chunks by meaning.

Original idea:

- Use a separate vector database such as Qdrant.

Current chosen approach:

- Use PostgreSQL with `pgvector` first.

Reason:

- It keeps the project beginner-friendly.
- It avoids running multiple databases too early.
- It lets one free hosted PostgreSQL database handle app data and vector search.
- A separate vector database can still be explored later as an advanced comparison.

Completed tasks:

- Enable the `pgvector` extension in Neon
- Add `embedding vector(384)` to `document_chunks`
- Install `@huggingface/transformers`
- Generate embeddings locally in TypeScript
- Cache the embedding model loader
- Store embeddings for new document chunks
- Keep raw embeddings out of public API responses
- Add semantic chunk search with cosine similarity
- Add `minScore` filtering
- Add frontend semantic search UI
- Show document titles in search results

Status: completed for the first semantic search slice.

Remaining later:

- Add a vector index for larger datasets
- Backfill embeddings for old chunks
- Tune `minScore`
- Add document/user filters to search
- Add better result grouping and citations

## Phase 9: RAG Retrieval And Answering

Goal: answer questions using retrieved evidence instead of guessing.

Next likely milestone.

Tasks:

- Design a RAG request/response shape
- Accept user questions
- Retrieve relevant chunks using semantic search
- Build a grounded context from retrieved chunks
- Choose a free or free-tier JavaScript-friendly answer generation option
- Generate an answer from retrieved context
- Return answer plus evidence chunks
- Handle cases where retrieved context is weak or missing
- Add frontend chat/search-answer UI

Status: planned next.

Notes:

- Retrieval is already working.
- Generation is not implemented yet.
- We should keep citations/evidence visible so the app does not feel like a black box.

## Phase 10: Authentication And User Ownership

Goal: let users log in and ensure each user can access only their own data.

Planned after the first basic RAG slice.

Reason:

- The core AI flow is easier to learn in a single-user system first.
- Once documents, embeddings, search, and first RAG behavior exist, ownership becomes meaningful.
- Auth should protect real private data and retrieval/chat history, not only a placeholder page.

Tasks:

- Choose the authentication approach
- Add user accounts
- Add sessions
- Protect app routes that require login
- Add `userId` ownership to documents
- Add `userId` ownership to chunks/search filters
- Add `userId` ownership to chats and messages
- Ensure API routes check the authenticated user
- Prepare the app for multi-device access

Status: planned.

## Phase 11: Knowledge Graph

Goal: store concepts and relationships so the app can reason over connected information.

Current recommended direction:

- Start with graph-style relational tables in PostgreSQL.
- Add a dedicated graph database such as Neo4j later only if it clearly improves the project.

Reason:

- We already use PostgreSQL.
- Entity and relationship tables are easier to learn first.
- A separate graph database adds operational complexity.

Tasks:

- Design `entities` table
- Design `entity_mentions` table
- Design `relationships` table
- Extract concepts from chunks
- Create relationships such as `DOCUMENT_HAS_CHUNK`, `CHUNK_MENTIONS_ENTITY`, and `ENTITY_RELATED_TO_ENTITY`
- Query related concepts
- Combine graph expansion with vector retrieval
- Visualize graph data in the frontend

Status: planned.

## Phase 12: Chat Persistence

Goal: save user conversations and connect them to retrieved evidence.

Tasks:

- Design `chat_sessions`
- Design `chat_messages`
- Save user questions
- Save generated answers
- Save retrieved evidence used for each answer
- Fetch previous chats
- Prepare chats for authenticated users

Status: planned.

## Phase 13: DevOps, Deployment, And Production Readiness

Goal: make the project deployable and portfolio-ready.

Tasks:

- Decide frontend deployment target
- Decide backend deployment target
- Configure production environment variables
- Connect production API to hosted PostgreSQL
- Add deployment documentation
- Add CI checks for deployable builds
- Add logging and error-handling improvements
- Consider Docker for local infrastructure when useful
- Consider Kubernetes only as an optional advanced learning topic

Status: partially started through CI, otherwise planned.

Notes:

- Docker becomes more useful when we want local PostgreSQL, local services, or repeatable dev environments.
- Kubernetes is not needed for the MVP, but can be explored later as a separate DevOps learning milestone.

## Phase 14: Product Polish And Portfolio Readiness

Goal: make the app feel like a real commercial AI product, not only a technical demo.

Tasks:

- Design a modern AI workspace layout
- Add a proper logo
- Add a custom favicon
- Add light and dark mode
- Add responsive layouts for desktop and mobile
- Add smooth but purposeful animations
- Improve accessibility
- Improve empty, loading, and error states
- Add confirmation dialogs for destructive actions
- Improve search result cards
- Add final project screenshots
- Improve README and architecture documentation
- Write a final learning summary

Status: planned.

## Current Next Steps

Recommended immediate order:

1. Start planning the first RAG endpoint.
2. Decide the answer-generation approach using free/free-tier JavaScript-friendly tooling.
3. Return answers with retrieved evidence.
4. Add a simple frontend RAG/chat surface.
5. Then begin authentication and user ownership.

