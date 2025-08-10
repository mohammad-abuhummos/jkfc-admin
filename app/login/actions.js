"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getEnv(name, fallback) {
  const value = process.env[name];
  console.log(name, value);
  return value && value.length > 0 ? value : fallback;
}

export async function login(prevState, formData) {
  const username = formData?.get?.("username");
  const password = formData?.get?.("password");

  const apiBaseUrl = getEnv("API_BASE_URL", "http://localhost:3000");

  try {
    const payload = new FormData();
    payload.append("username", username ?? "");
    payload.append("password", password ?? "");

    const res = await fetch(`${apiBaseUrl}/api/login`, {
      method: "POST",
      body: payload,
      cache: "no-store",
    });

    console.log("res", res);
    if (!res.ok) {
      const message = `Login failed (${res.status})`;
      return { ok: false, message };
    }

    const json = await res.json();
    console.log("json", json);
    const token = json?.data?.original?.token;
    if (!token) {
      return { ok: false, message: "Login response missing token" };
    }

    // Save token as the login proof
    const cookieStore = await cookies();
    cookieStore.set("jkfc_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Return success instead of throwing a redirect to avoid dev overlay
    return { ok: true };
  } catch (error) {
    console.log("error", error);
    return { ok: false, message: "Unable to reach login service" };
  }
}

export async function logout() {
  // Try to notify backend about logout; ignore failures
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jkfc_token")?.value;
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
    if (token) {
      await fetch(`${apiBaseUrl}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
    }
  } catch {}

  const cookieStore = await cookies();
  cookieStore.delete("jkfc_token");
  redirect("/login");
}
