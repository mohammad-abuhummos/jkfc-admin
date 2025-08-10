import { apiFetch } from "./api";

export async function getCurrentUser() {
  try {
    // Some backends expect POST with empty body, others GET. Try POST then fall back to GET.
    try {
      const json = await apiFetch("/api/user", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      return json?.data ?? null;
    } catch (e) {
      const json = await apiFetch("/api/user", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      return json?.data ?? null;
    }
  } catch (e) {
    return null;
  }
}
