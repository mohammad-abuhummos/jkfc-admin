"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useUi } from "./UiContext";

export function ClientButtons() {
  const { toggleMobileSidebar } = useUi();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-5 w-5 text-gray-600" aria-hidden="true" />
      </button>
      <div className="hidden lg:block text-sm font-medium text-gray-800">
        Admin Panel
      </div>
    </div>
  );
}
