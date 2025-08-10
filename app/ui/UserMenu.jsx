"use client";

import { useMemo, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, PowerIcon } from "@heroicons/react/24/outline";
import { logout } from "../login/actions";

export default function UserMenu({ user }) {
  const displayName = user?.name || user?.username || "User";
  const role = user?.role || "—";
  const initials = useMemo(
    () => (displayName?.[0] || "?").toUpperCase(),
    [displayName]
  );

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 sm:gap-3">
        <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div className="hidden sm:block leading-tight text-left">
          <div className="text-sm font-medium">{displayName}</div>
          <div className="text-[11px] text-gray-500">{role}</div>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-md p-1 z-10">
          <Menu.Item>
            {({ active }) => (
              <form action={logout}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    active ? "bg-gray-50" : ""
                  } text-red-600 hover:text-red-700`}
                >
                  <PowerIcon className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </form>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
