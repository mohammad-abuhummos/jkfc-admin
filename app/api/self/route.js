import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET() {
  try {
    // Try GET first; if backend expects POST, apiFetch caller can adjust but here we keep GET
    const json = await apiFetch("/api/user", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to fetch current user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
