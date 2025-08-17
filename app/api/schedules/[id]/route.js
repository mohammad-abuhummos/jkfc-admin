import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/schedules/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to fetch schedule";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await apiFetch(`/api/schedules/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to update schedule";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/schedules/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to delete schedule";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
