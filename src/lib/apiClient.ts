import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = "";

function getHeaders(): HeadersInit {
  const token = useAuthStore.getState().accessToken;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: getHeaders(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json.message ?? "요청에 실패했습니다." };
    }

    return { data: (json.data ?? json) as T, error: null };
  } catch {
    return { data: null, error: "네트워크 오류가 발생했습니다." };
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
};
