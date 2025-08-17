import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/courses/${id}/schedules`, {
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
    const message = error?.message || "Failed to fetch course schedules";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await apiFetch(`/api/courses/${id}/schedules`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to create schedule";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
