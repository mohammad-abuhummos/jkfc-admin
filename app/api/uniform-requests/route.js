import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const json = await apiFetch(
      `/api/uniform-requests?status=${encodeURIComponent(status)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );
    const list = Array.isArray(json?.data?.data)
      ? json.data.data
      : Array.isArray(json?.data)
      ? json.data
      : [];
    return NextResponse.json({
      success: true,
      data: list,
      message: json?.message,
      meta: json?.data ?? null,
    });
  } catch (error) {
    const message = error?.message || "Failed to fetch uniform requests";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const json = await apiFetch("/api/uniform-requests", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to create uniform request";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
