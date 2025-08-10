import { cookies } from "next/headers";

function getEnv(name, fallback) {
  const value = process.env[name];
  return value && value.length > 0 ? value : fallback;
}

export async function apiFetch(path, options = {}) {
  const baseUrl = getEnv("API_BASE_URL", "http://localhost:3000");
  const token = cookies().get("jkfc_token")?.value;

  if (!token) {
    throw new Error("Not authenticated: missing token");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}
