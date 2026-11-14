const BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const REQUEST_TIMEOUT_MS = 35_000;

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`${BASE}${path}${query}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`GET ${path} falhou (${res.status})`);
  return (await res.json()) as T;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`POST ${path} falhou (${res.status})`);
  return (await res.json()) as T;
}
