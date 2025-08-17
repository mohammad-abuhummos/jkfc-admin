import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET() {
  try {
    const json = await apiFetch("/api/schedules", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const list = Array.isArray(json?.data) ? json.data : [];
    return NextResponse.json({
      success: true,
      data: list,
      message: json?.message,
    });
  } catch (error) {
    const message = error?.message || "Failed to fetch schedules";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
