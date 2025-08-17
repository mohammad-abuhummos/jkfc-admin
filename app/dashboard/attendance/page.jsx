"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function AttendancePage() {
  const [scheduleId, setScheduleId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAttendance = async () => {
    if (!scheduleId || !sessionDate) return;
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        schedule_id: String(scheduleId),
        date: sessionDate,
      });
      const res = await fetch(`/api/attendance?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed to load");
      const list = Array.isArray(json?.data) ? json.data : [];
      setItems(list.map((i) => ({ ...i })));
    } catch (e) {
      const msg = e?.message || "Failed to load attendance";
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoadingSchedules(true);
      setOptionsError("");
      try {
        const res = await fetch("/api/schedules", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load schedules");
        }
        const list = Array.isArray(json?.data) ? json.data : [];
        setSchedules(list);
      } catch (e) {
        const msg = e?.message || "Failed to load schedules";
        setOptionsError(msg);
        setToast({ id: Date.now(), type: "error", message: msg });
        setTimeout(() => setToast(null), 3000);
      } finally {
        setIsLoadingSchedules(false);
      }
    })();
  }, []);

  const updateLocal = (enrollmentId, field, value) => {
    setItems((rows) =>
      rows.map((r) =>
        r.enrollment_id === enrollmentId ? { ...r, [field]: value } : r
      )
    );
  };

  const save = async () => {
    try {
      const payload = {
        session_date: sessionDate,
        attendances: items.map((r) => ({
          enrollment_id: r.enrollment_id,
          status: r.status || null,
          notes: r.notes || null,
        })),
      };
      const res = await fetch(`/api/attendance`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Save failed");
      showToast("success", json?.message || "Saved");
    } catch (e) {
      showToast("error", e?.message || "Save failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <select
          value={scheduleId}
          onChange={(e) => setScheduleId(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
        >
          <option value="" disabled>
            {isLoadingSchedules ? "Loading…" : "Select a schedule"}
          </option>
          {schedules.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {`${s.name || "Schedule"}${
                s.course?.title ? " — " + s.course.title : ""
              } (#${s.id})`}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
        />
        <button
          onClick={fetchAttendance}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 h-10 text-sm hover:bg-gray-50"
        >
          <ArrowPathIcon
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Load
        </button>
        <button
          onClick={save}
          disabled={isLoading || items.length === 0}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-3 h-10 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
        >
          Save Attendance
        </button>
      </div>
      {optionsError ? (
        <div className="text-xs text-red-600">{optionsError}</div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-3 py-2 px-5">Player</div>
          <div className="col-span-2 py-2 px-5">Status</div>
          <div className="col-span-7 py-2 px-5">Notes</div>
        </div>
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No data
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((r) => (
              <li
                key={r.enrollment_id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-3 text-gray-900 truncate">
                  {r.player_name}
                </div>
                <div className="col-span-2">
                  <select
                    value={r.status || ""}
                    onChange={(e) =>
                      updateLocal(r.enrollment_id, "status", e.target.value)
                    }
                    className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  >
                    <option value="">-</option>
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="excused">excused</option>
                  </select>
                </div>
                <div className="col-span-7">
                  <input
                    value={r.notes || ""}
                    onChange={(e) =>
                      updateLocal(r.enrollment_id, "notes", e.target.value)
                    }
                    className="w-full h-9 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                    placeholder="Notes"
                  />
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
          <div className="col-span-3">
            <div className="h-4 w-40 rounded bg-gray-100" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-24 rounded bg-gray-100" />
          </div>
          <div className="col-span-7">
            <div className="h-4 w-full rounded bg-gray-100" />
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
