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
