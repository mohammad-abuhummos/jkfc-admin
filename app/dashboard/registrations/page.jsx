"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StatusBadge } from "../../ui/Badges";
import ExportMenu from "../../ui/ExportMenu";
import { pushNotification } from "../../ui/Notifications";
import ErrorAlert from "../../ui/ErrorAlert";

export default function RegistrationsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

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

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/registrations", {
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
      const msg = e?.message || "Failed to load registrations";
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
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
      const hay = `${en} ${ar} ${r.main_phone || ""} ${
        r.secondary_phone || ""
      } ${r.status || ""}`
        .toLowerCase()
        .trim();
      return hay.includes(q);
    });
  }, [items, searchQuery]);

  const refresh = () => {
    setIsRefreshing(true);
    fetchRegistrations();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Registrations
          </h1>
          <p className="text-sm text-gray-500">Manage pending registrations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search registrations"
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
            filename="registrations"
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
            No registrations
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
                  <StatusBadge status={r.status} />
                </div>
                <div className="col-span-2 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelected(r);
                      setIsEnrollOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Enroll
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEnrollOpen && selected && (
        <EnrollModal
          registration={selected}
          onClose={() => {
            setIsEnrollOpen(false);
            setSelected(null);
          }}
          onSuccess={() => {
            showToast("success", "Enrollment created");
            fetchRegistrations();
          }}
          onError={(msg) => showToast("error", msg)}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function EnrollModal({ registration, onClose, onSuccess, onError }) {
  const [courseScheduleId, setCourseScheduleId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [optionsError, setOptionsError] = useState("");
  const [requestUniform, setRequestUniform] = useState("false");
  const [uniformType, setUniformType] = useState("");
  const [uniformSizeId, setUniformSizeId] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!courseScheduleId || !groupId) return false;
    if (requestUniform === "true" && (!uniformType || !uniformSizeId))
      return false;
    return true;
  }, [courseScheduleId, groupId, requestUniform, uniformType, uniformSizeId]);

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
        setOptionsError(e?.message || "Failed to load schedules");
      } finally {
        setIsLoadingSchedules(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!courseScheduleId) return;
    setGroupId("");
    (async () => {
      setIsLoadingGroups(true);
      try {
        const res = await fetch("/api/groups", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load groups");
        }
        const list = Array.isArray(json?.data) ? json.data : [];
        setGroups(list);
      } catch (e) {
        setOptionsError(e?.message || "Failed to load groups");
      } finally {
        setIsLoadingGroups(false);
      }
    })();
  }, [courseScheduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = {
        course_schedule_id: Number(courseScheduleId),
        group_id: Number(groupId),
        request_uniform: requestUniform === "true" ? true : null,
        uniform_type: requestUniform === "true" ? uniformType || null : null,
        uniform_size_id:
          requestUniform === "true" && uniformSizeId
            ? Number(uniformSizeId)
            : null,
      };
      const res = await fetch(`/api/registrations/${registration.id}/enroll`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Enroll failed");
      }
      onSuccess();
      onClose();
    } catch (e) {
      const message = e?.message || "Enroll failed";
      setError(message);
      onError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">
            Enroll Registration #{registration.id}
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-gray-200 hover:bg-gray-50"
          >
            <XMarkIcon className="h-4 w-4" /> Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Course Schedule
              </label>
              <select
                value={courseScheduleId}
                onChange={(e) => setCourseScheduleId(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
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
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Group</label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                required
                disabled={!courseScheduleId || isLoadingGroups}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="" disabled>
                  {!courseScheduleId
                    ? "Select schedule first"
                    : isLoadingGroups
                    ? "Loading…"
                    : "Select a group"}
                </option>
                {groups.map((g) => (
                  <option key={g.id} value={String(g.id)}>
                    {`${g.name || "Group"} (#${g.id})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Request Uniform?
              </label>
              <select
                value={requestUniform}
                onChange={(e) => setRequestUniform(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            {requestUniform === "true" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Uniform Type
                  </label>
                  <input
                    value={uniformType}
                    onChange={(e) => setUniformType(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                    placeholder="Full / T-shirt / Short"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Uniform Size ID
                  </label>
                  <input
                    value={uniformSizeId}
                    onChange={(e) => setUniformSizeId(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                    placeholder="e.g. 5"
                  />
                </div>
              </>
            )}
          </div>
          {optionsError ? (
            <div className="text-xs text-red-600">{optionsError}</div>
          ) : null}
          {error ? <div className="text-xs text-red-600">{error}</div> : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending || !canSubmit}
              className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? "Please wait…" : "Enroll"}
            </button>
          </div>
        </form>
      </div>
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
