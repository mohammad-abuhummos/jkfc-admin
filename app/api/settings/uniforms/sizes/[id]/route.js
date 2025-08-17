import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/api";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await apiFetch(`/api/settings/uniforms/sizes/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to update uniform size";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/settings/uniforms/sizes/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to delete uniform size";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
