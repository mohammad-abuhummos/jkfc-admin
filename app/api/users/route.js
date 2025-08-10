import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function GET() {
  try {
    const json = await apiFetch("/api/users", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to fetch users";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const json = await apiFetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to create user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
