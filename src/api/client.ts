// vite proxied /api
const API_BASE = "/api/v2";

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = "GET", body } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `API ${method} ${path} failed with ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
};
