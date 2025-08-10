import { getCurrentUser } from "../lib/auth";
import UserMenu from "./UserMenu";
import {
  MagnifyingGlassIcon,
  BellIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function Topbar() {
  const user = await getCurrentUser();
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 gap-3">
      <div className="flex-1 max-w-xl w-full">
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            className="w-full h-10 rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Search users or groups..."
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden sm:inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-50"
        >
          <CalendarDaysIcon
            className="h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
          <span className="text-gray-700">Last Month</span>
          <ChevronDownIcon
            className="h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
