import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/payments/${id}/revert`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to revert payment";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
