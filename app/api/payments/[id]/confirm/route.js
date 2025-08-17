import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/payments/${id}/confirm`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to confirm payment";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
