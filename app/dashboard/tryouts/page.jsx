"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import ExportMenu from "../../ui/ExportMenu";
import { pushNotification } from "../../ui/Notifications";
import ErrorAlert from "../../ui/ErrorAlert";

export default function TryoutsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
    try {
      pushNotification({
        type,
        title: type === "error" ? "Error" : "Notice",
        message,
      });
    } catch {}
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTryouts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tryouts", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed to load");
      const list = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.data?.data)
        ? json.data.data
        : [];
      setItems(list);
    } catch (e) {
      const msg = e?.message || "Failed to load tryouts";
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTryouts();
  }, []);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((r) => {
      if (!q) return true;
      const en = `${r.first_name_en || ""} ${r.middle_name_en || ""} ${
        r.last_name_en || ""
      }`;
      const ar = `${r.first_name_ar || ""} ${r.middle_name_ar || ""} ${
        r.last_name_ar || ""
      }`;
      return `${en} ${ar} ${r.main_phone || ""}`.toLowerCase().includes(q);
    });
  }, [items, searchQuery]);

  const refresh = () => {
    setIsRefreshing(true);
    fetchTryouts();
  };

  const act = async (id, action) => {
    try {
      const url =
        action === "accept"
          ? `/api/tryouts/${id}/accept`
          : `/api/tryouts/${id}/reject`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Action failed");
      showToast("success", json?.message || "Done");
      await fetchTryouts();
    } catch (e) {
      showToast("error", e?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tryouts</h1>
          <p className="text-sm text-gray-500">Manage pending tryouts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search tryouts"
            />
          </div>
          <ExportMenu
            rows={visible}
            columns={[
              "id",
              "first_name_en",
              "middle_name_en",
              "last_name_en",
              "first_name_ar",
              "middle_name_ar",
              "last_name_ar",
              "main_phone",
              "status",
            ]}
            filename="tryouts"
            title="Export"
          />
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 h-10 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-3 py-2 px-5">Name (EN)</div>
          <div className="col-span-3 py-2 px-5">Name (AR)</div>
          <div className="col-span-2 py-2 px-5">Phone</div>
          <div className="col-span-1 py-2 px-5">Status</div>
          <div className="col-span-2 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : visible.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No tryouts
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-1 text-gray-500">{r.id}</div>
                <div className="col-span-3 text-gray-900 truncate">
                  {`${r.first_name_en || ""} ${r.middle_name_en || ""} ${
                    r.last_name_en || ""
                  }`.trim()}
                </div>
                <div className="col-span-3 text-gray-700 truncate">
                  {`${r.first_name_ar || ""} ${r.middle_name_ar || ""} ${
                    r.last_name_ar || ""
                  }`.trim()}
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {r.main_phone}
                </div>
                <div className="col-span-1 text-gray-700 truncate">
                  {r.status}
                </div>
                <div className="col-span-2 text-right space-x-2">
                  <button
                    onClick={() => act(r.id, "accept")}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => act(r.id, "reject")}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function SkeletonList() {
  const rows = new Array(6).fill(null);
  return (
    <ul className="divide-y divide-gray-100 animate-pulse">
      {rows.map((_, idx) => (
        <li key={idx} className="grid grid-cols-12 items-center px-5 py-3">
          <div className="col-span-1">
            <div className="h-4 w-6 rounded bg-gray-100" />
          </div>
          <div className="col-span-3">
            <div className="h-4 w-40 rounded bg-gray-100" />
          </div>
          <div className="col-span-3">
            <div className="h-4 w-40 rounded bg-gray-100" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-28 rounded bg-gray-100" />
          </div>
          <div className="col-span-1">
            <div className="h-5 w-16 rounded bg-gray-100" />
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <div className="h-7 w-16 rounded bg-gray-100" />
            <div className="h-7 w-16 rounded bg-gray-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Toast({ type, message }) {
  const base =
    "fixed bottom-6 right-6 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2";
  const classes =
    type === "success"
      ? `${base} bg-emerald-600 text-white`
      : type === "error"
      ? `${base} bg-red-600 text-white`
      : `${base} bg-gray-900 text-white`;
  return (
    <div className={`${classes}`}>
      {type === "success" ? (
        <CheckCircleIcon className="h-5 w-5" />
      ) : type === "error" ? (
        <ExclamationTriangleIcon className="h-5 w-5" />
      ) : null}
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
}
