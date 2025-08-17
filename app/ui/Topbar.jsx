import { getCurrentUser } from "../lib/auth";
import UserMenu from "./UserMenu";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import NotificationsDropdown from "./Notifications";
import { ClientButtons } from "./TopbarClient";

export const dynamic = "force-dynamic";

export default async function Topbar() {
  const user = await getCurrentUser();
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 gap-3">
      <ClientButtons />
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
        <NotificationsDropdown />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
