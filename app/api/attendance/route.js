import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get("schedule_id");
    const date = searchParams.get("date");
    const path = `/api/attendance?schedule_id=${encodeURIComponent(
      scheduleId || ""
    )}&date=${encodeURIComponent(date || "")}`;
    const json = await apiFetch(path, {
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
    const message = error?.message || "Failed to fetch attendance";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const json = await apiFetch("/api/attendance", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to save attendance";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
