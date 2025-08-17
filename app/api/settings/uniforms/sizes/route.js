import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function POST(request) {
  try {
    const body = await request.json();
    const json = await apiFetch("/api/settings/uniforms/sizes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to create uniform size";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
