"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full h-11 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useFormState(login, { ok: true });

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          name="username"
          required
          className="w-full h-11 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
          placeholder="Enter username"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full h-11 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
          placeholder="Enter password"
        />
      </div>

      {state?.ok === false && (
        <div className="text-sm text-red-600">
          {state.message ?? "Login failed"}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
