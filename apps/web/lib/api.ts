import type { ChunkRecord, DocumentRecord } from "@knowledge-atlas/shared";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export type ApiHealthResponse = {
  ok: boolean;
  service: string;
};

export async function getApiHealth(): Promise<ApiHealthResponse> {
  const response = await fetch(`${apiBaseUrl}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API health check failed with status ${response.status}`);
  }

  return response.json();
}

export type CreateDocumentInput = {
  title: string;
  text: string;
};

export type CreateDocumentResponse = {
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

export async function createDocument(
  input: CreateDocumentInput,
): Promise<CreateDocumentResponse> {
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
