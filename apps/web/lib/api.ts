import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return apiBaseUrl;
}

export type ApiHealthResponse = {
  ok: boolean;
  service: string;
};

export type ListDocumentsResponse = {
  documents: DocumentRecord[];
};

export type CreateDocumentInput = {
  title: string;
  text: string;
};

export type CreateDocumentResponse = {
  document: DocumentRecord;
  chunks: ChunkRecord[];
};

export type GetDocumentResponse = {
  document: DocumentRecord;
  chunks: ChunkRecord[];
};

type ApiErrorResponse = {
  error: string;
  details?: {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };
};

export async function getApiHealth(): Promise<ApiHealthResponse> {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API health check failed with status ${response.status}`);
  }

  return response.json();
}

export async function listDocuments(): Promise<ListDocumentsResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/documents`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`List documents failed with status ${response.status}`);
  }

  return response.json();
}

export async function getDocument(
  documentId: string,
): Promise<GetDocumentResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/documents/${documentId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Get document failed with status ${response.status}`);
  }

  return response.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/documents/${documentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Delete document failed with status ${response.status}`);
  }
}

export async function createDocument(
  input: CreateDocumentInput,
): Promise<CreateDocumentResponse> {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ApiErrorResponse;

    const fieldMessages = Object.values(errorBody.details?.fieldErrors ?? {})
      .flat()
      .filter(Boolean);

    const formMessages = errorBody.details?.formErrors ?? [];

    const message =
      [...fieldMessages, ...formMessages].join(" ") ||
      errorBody.error ||
      `Create document failed with status ${response.status}`;

    throw new Error(message);
  }

  return response.json();
}
