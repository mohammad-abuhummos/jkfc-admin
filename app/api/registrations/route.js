import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET() {
  try {
    const json = await apiFetch("/api/registrations", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const list = Array.isArray(json?.data?.data) ? json.data.data : [];
    return NextResponse.json({
      success: true,
      message: json?.message ?? "Registrations Retrieved Successfully.",
      data: list,
      meta: json?.data ?? null,
    });
  } catch (error) {
    const message = error?.message || "Failed to fetch registrations";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
