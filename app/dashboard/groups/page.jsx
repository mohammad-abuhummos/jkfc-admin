"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchGroups = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/groups", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed with ${res.status}`);
      }
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setGroups(list.reverse());
    } catch (e) {
      setError(e?.message || "Failed to load groups");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const visibleGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groups.filter((g) => {
      if (!q) return true;
      const hay = `${g.name || ""} ${g.description || ""} ${g.min_age ?? ""} ${
        g.max_age ?? ""
      } ${g.enrollments_count ?? ""}`
        .toLowerCase()
        .trim();
      return hay.includes(q);
    });
  }, [groups, searchQuery]);

  const refreshList = () => {
    setIsRefreshing(true);
    fetchGroups();
  };

  const onCreate = async (payload) => {
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Create failed");
      }
      showToast("success", json?.message || "Group created");
      setIsCreateOpen(false);
      await fetchGroups();
    } catch (e) {
      showToast("error", e?.message || "Create failed");
    }
  };

  const onUpdate = async (id, payload) => {
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Update failed");
      }
      showToast("success", json?.message || "Group updated");
      setIsEditOpen(false);
      setEditingGroup(null);
      await fetchGroups();
    } catch (e) {
      showToast("error", e?.message || "Update failed");
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Delete failed");
      }
      showToast("success", json?.message || "Group deleted");
      await fetchGroups();
    } catch (e) {
      showToast("error", e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Groups</h1>
          <p className="text-sm text-gray-500">Manage player groups</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search groups"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshList}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 h-10 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 h-10 text-sm font-medium hover:bg-emerald-700"
            >
              <PlusIcon className="h-4 w-4" />
              New Group
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-3 py-2 px-5">Name</div>
          <div className="col-span-2 py-2 px-5">Min Age</div>
          <div className="col-span-2 py-2 px-5">Max Age</div>
          <div className="col-span-2 py-2 px-5">Enrollments</div>
          <div className="col-span-2 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : visibleGroups.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No groups
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visibleGroups.map((g) => (
              <li
                key={g.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-1 text-gray-500">{g.id}</div>
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <span className="font-medium text-gray-900 truncate">
                    {g.name}
                  </span>
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {g.min_age ?? "-"}
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {g.max_age ?? "-"}
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {g.enrollments_count ?? 0}
                </div>
                <div className="col-span-2 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingGroup(g);
                      setIsEditOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setGroupToDelete(g);
                      setIsConfirmOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isCreateOpen && (
        <GroupModal
          title="Create Group"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
          submitLabel="Create"
        />
      )}

      {isEditOpen && editingGroup && (
        <GroupModal
          title="Edit Group"
          group={editingGroup}
          onClose={() => {
            setIsEditOpen(false);
            setEditingGroup(null);
          }}
          onSubmit={(payload) => onUpdate(editingGroup.id, payload)}
          submitLabel="Save"
        />
      )}

      {isConfirmOpen && groupToDelete && (
        <ConfirmModal
          title="Delete Group"
          message={`Are you sure you want to delete group "${groupToDelete.name}" (#${groupToDelete.id})? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => {
            setIsConfirmOpen(false);
            setGroupToDelete(null);
          }}
          onConfirm={async () => {
            setIsConfirmOpen(false);
            await onDelete(groupToDelete.id);
            setGroupToDelete(null);
          }}
        />
      )}

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
          <div className="col-span-2">
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-12 rounded bg-gray-100" />
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

function ConfirmModal({ title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b">
          <div className="text-sm font-semibold text-gray-800">{title}</div>
        </div>
        <div className="p-5 text-sm text-gray-700">{message}</div>
        <div className="px-5 py-3 flex items-center justify-end gap-2 border-t">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 text-white px-3 py-2 text-sm font-medium hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupModal({ title, group, onClose, onSubmit, submitLabel }) {
  const [name, setName] = useState(group?.name || "");
  const [minAge, setMinAge] = useState(group?.min_age ?? "");
  const [maxAge, setMaxAge] = useState(group?.max_age ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!name) return false;
    if (minAge === "" || maxAge === "") return false;
    const minN = Number(minAge);
    const maxN = Number(maxAge);
    return !Number.isNaN(minN) && !Number.isNaN(maxN) && minN <= maxN;
  }, [name, minAge, maxAge]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = {
        name,
        min_age: Number(minAge),
        max_age: Number(maxAge),
        description: description || null,
      };
      await onSubmit(payload);
    } catch (e) {
      setError(e?.message || "Action failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">{title}</div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-gray-200 hover:bg-gray-50"
          >
            <XMarkIcon className="h-4 w-4" />
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="U15"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Min Age
              </label>
              <input
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="14"
                min={0}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Max Age
              </label>
              <input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="15"
                min={0}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-24 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Optional"
              />
            </div>
          </div>

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
              {pending ? "Please wait…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
