import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await apiFetch(`/api/registrations/${id}/enroll`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to enroll registration";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
