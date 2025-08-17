import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET() {
  try {
    const json = await apiFetch("/api/players", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    // Normalize to { data: Player[] }
    const list = Array.isArray(json?.data?.data) ? json.data.data : [];
    return NextResponse.json({
      success: true,
      message: json?.message ?? "Players Retrieved Successfully.",
      data: list,
      meta: json?.data ?? null,
    });
  } catch (error) {
    const message = error?.message || "Failed to fetch players";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const json = await apiFetch("/api/players", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to create player";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
