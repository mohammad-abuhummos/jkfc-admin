"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon, TrashIcon } from "@heroicons/react/24/outline";

const STORAGE_KEY = "jkfc_notifications";

export function pushNotification({ type = "info", title, message }) {
  try {
    const list = readStorage();
    const item = {
      id: Date.now(),
      type,
      title: title || (type === "error" ? "Error" : "Notice"),
      message: message || "",
      timestamp: new Date().toISOString(),
    };
    list.unshift(item);
    writeStorage(list.slice(0, 100));
  } catch {}
}

export function useNotifications() {
  const [items, setItems] = useState(() => readStorage());
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(() => setItems(readStorage()), 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  const unreadCount = useMemo(() => items.length, [items]);

  const clearAll = () => {
    writeStorage([]);
    setItems([]);
  };

  return { items, unreadCount, clearAll };
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const val = raw ? JSON.parse(raw) : [];
    return Array.isArray(val) ? val : [];
  } catch {
    return [];
  }
}

function writeStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export default function NotificationsDropdown() {
  const { items, unreadCount, clearAll } = useNotifications();
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : String(unreadCount)}
          </span>
        ) : null}
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
        <Menu.Items className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border border-gray-100 rounded-lg shadow-md p-1 z-20">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="text-xs font-medium text-gray-600">
              Notifications
            </div>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
            >
              <TrashIcon className="h-4 w-4" /> Clear
            </button>
          </div>
          {items.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-gray-500">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((n) => (
                <li key={n.id} className="px-3 py-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${
                        n.type === "success"
                          ? "bg-emerald-500"
                          : n.type === "error"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-800">
                        {n.title}
                      </div>
                      {n.message ? (
                        <div className="text-xs text-gray-600 truncate">
                          {n.message}
                        </div>
                      ) : null}
                      <div className="mt-0.5 text-[10px] text-gray-400">
                        {new Date(n.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
