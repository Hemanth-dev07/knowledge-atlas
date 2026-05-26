# Knowledge Atlas Roadmap

This roadmap breaks the project into small learning milestones. The goal is to build a portfolio-ready full-stack TypeScript application while understanding the concepts behind each layer.

Knowledge Atlas will become a personal AI research assistant where authenticated users can save documents, chats, graph knowledge, and retrieval results across devices.

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

## Phase 5: Document Ingestion

Goal: let users submit documents and understand how raw text becomes smaller chunks.

Tasks:

- Create a document submission API
- Validate request data with Zod
- Create a chunking service
- Split document text into chunks
- Return chunks from the API
- Add a frontend document submission form
- Display generated chunks in the frontend

Status: planned next.

## Phase 6: Authentication And User Ownership

Goal: let users log in and ensure each user can access only their own data.

Tasks:

- Choose the authentication approach
- Add user accounts
- Add sessions
- Protect app routes that require login
- Add `userId` ownership to documents and chats
- Ensure API routes check the authenticated user
- Prepare the app for multi-device access

Status: planned.

## Phase 7: Persistent Documents And Chats

Goal: store user data permanently instead of keeping it only in memory.

Tasks:

- Choose the relational database setup
- Design tables for users, documents, chunks, chats, and messages
- Add database migrations
- Save submitted documents
- Save generated chunks
- Save chat sessions and messages
- Fetch saved documents and chats after login

Status: planned.

## Phase 8: Vector Database

Goal: store and search document chunks by meaning.

Tasks:

- Set up Qdrant locally
- Choose a JavaScript/TypeScript embedding approach
- Generate embeddings for document chunks
- Store chunk vectors in Qdrant
- Store metadata payloads with user, document, and chunk identifiers
- Search similar chunks for a user question
- Filter vector search by authenticated user

Status: planned.

## Phase 9: Knowledge Graph

Goal: store concepts and relationships so the app can reason over connected information.

Tasks:

- Set up Neo4j locally
- Design graph nodes for users, documents, chunks, concepts, and chats
- Extract concepts from chunks
- Create graph relationships such as `HAS_CHUNK` and `MENTIONS`
- Query related concepts
- Ensure graph queries are scoped to the authenticated user
- Visualize the graph in the frontend

Status: planned.

## Phase 10: RAG Chat

Goal: answer questions using retrieved evidence instead of guessing.

Tasks:

- Accept user questions
- Retrieve relevant chunks from Qdrant
- Expand context with Neo4j relationships
- Build a grounded RAG prompt
- Generate an answer with citations
- Store chat messages
- Show retrieved evidence in the frontend
- Handle cases where the retrieved context is not enough

Status: planned.

## Phase 11: Testing, CI/CD, And Deployment

Goal: make the project reliable and portfolio-ready.

Tasks:

- Add unit tests for services
- Add API tests for backend routes
- Add frontend tests for important user flows
- Add GitHub Actions for lint, typecheck, test, and build
- Deploy the frontend
- Deploy the backend
- Connect hosted database services
- Document deployment limitations and free-tier tradeoffs

Status: planned.

## Phase 12: Product Polish And Portfolio Readiness

Goal: make the app feel like a real commercial AI product, not only a technical demo.

Tasks:

- Design a modern AI workspace layout
- Add a proper logo
- Add a custom favicon
- Add light and dark mode
- Add responsive layouts for desktop and mobile
- Add smooth but purposeful animations
- Improve accessibility
- Create polished empty, loading, and error states
- Add final project screenshots
- Improve README and architecture documentation
- Write a final learning summary

Status: planned.
