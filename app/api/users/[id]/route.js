import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/app/lib/api";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const json = await apiFetch(`/api/users/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to fetch user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await apiFetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to update user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    // Prevent deleting self by comparing with current user id
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("jkfc_token")?.value;
      if (token) {
        const me = await apiFetch("/api/user", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const myId = me?.data?.id ?? me?.id;
        if (myId && String(myId) === String(id)) {
          return NextResponse.json(
            { success: false, message: "You cannot delete your own account." },
            { status: 403 }
          );
        }
      }
    } catch {}
    const json = await apiFetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error?.message || "Failed to delete user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
