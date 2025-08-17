import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET() {
  try {
    const json = await apiFetch("/api/courses", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const list = Array.isArray(json?.data) ? json.data : [];
    return NextResponse.json({
      success: true,
      message: json?.message ?? "Courses Retrieved Successfully.",
      data: list,
    });
  } catch (error) {
    const message = error?.message || "Failed to fetch courses";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const json = await apiFetch("/api/courses", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to create course";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
