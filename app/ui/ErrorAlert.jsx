"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="mx-5 my-6 rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm flex items-start gap-2">
      <ExclamationTriangleIcon className="h-5 w-5 mt-0.5" />
      <div className="min-w-0">
        <div className="font-medium">Something went wrong</div>
        <div className="text-red-700 break-words">{String(message)}</div>
      </div>
    </div>
  );
}
