# Knowledge Atlas Roadmap

This roadmap breaks the project into small learning milestones.

## Phase 1: Project Foundation

Goal: set up the basic project structure and understand why each part exists.

Tasks:

- Create the root Node.js project
- Set the Node.js version with `.nvmrc`
- Initialize Git
- Add `.gitignore`
- Add README documentation
- Create the monorepo folder structure

## Phase 2: Backend Foundation

Goal: create a basic TypeScript API server.

Tasks:

- Create the backend package
- Install backend dependencies
- Add TypeScript configuration
- Create a health check endpoint
- Run the API locally

## Phase 3: Frontend Foundation

Goal: create a basic frontend app.

Tasks:

- Create the frontend package
- Install frontend dependencies
- Add basic pages
- Connect the frontend to the backend health endpoint

## Phase 4: Document Ingestion

Goal: let users add documents.

Tasks:

- Create a document submission API
- Validate request data
- Split document text into chunks
- Return chunks to the frontend

## Phase 5: Vector Database

Goal: store and search document chunks by meaning.

Tasks:

- Set up Qdrant
- Generate embeddings
- Store chunk vectors
- Search similar chunks for a question

## Phase 6: Knowledge Graph

Goal: store concepts and relationships.

Tasks:

- Set up Neo4j
- Extract concepts from chunks
- Create graph nodes and relationships
- Query related concepts

## Phase 7: RAG Chat

Goal: answer questions using retrieved evidence.

Tasks:

- Retrieve relevant chunks from Qdrant
- Expand context with Neo4j
- Build a RAG prompt
- Generate an answer with citations

## Phase 8: Testing, CI/CD, and Deployment

Goal: make the project reliable and portfolio-ready.

Tasks:

- Add unit tests
- Add integration tests
- Add GitHub Actions
- Deploy the frontend
- Deploy the backend
- Connect hosted database services
