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

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/players", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed with ${res.status}`);
      }
      const json = await res.json();
      const list = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.data?.data)
        ? json.data.data
        : [];
      setPlayers(list);
      setMeta(json?.meta || json?.data || null);
    } catch (e) {
      setError(e?.message || "Failed to load players");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const visiblePlayers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return players
      .filter((p) =>
        statusFilter === "all" ? true : p.status === statusFilter
      )
      .filter((p) => {
        if (!q) return true;
        const hay = `${p.first_name_en || ""} ${p.middle_name_en || ""} ${
          p.last_name_en || ""
        } ${p.first_name_ar || ""} ${p.middle_name_ar || ""} ${
          p.last_name_ar || ""
        } ${p.main_phone || ""} ${p.secondary_phone || ""}`
          .toLowerCase()
          .trim();
        return hay.includes(q);
      });
  }, [players, searchQuery, statusFilter]);

  const refreshList = () => {
    setIsRefreshing(true);
    fetchPlayers();
  };

  const onCreate = async (payload) => {
    try {
      const res = await fetch("/api/players", {
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
      showToast("success", json?.message || "Player created");
      setIsCreateOpen(false);
      await fetchPlayers();
    } catch (e) {
      showToast("error", e?.message || "Create failed");
    }
  };

  const onUpdate = async (id, payload) => {
    try {
      const res = await fetch(`/api/players/${id}`, {
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
      showToast("success", json?.message || "Player updated");
      setIsEditOpen(false);
      setEditingPlayer(null);
      await fetchPlayers();
    } catch (e) {
      showToast("error", e?.message || "Update failed");
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Delete failed");
      }
      showToast("success", json?.message || "Player deleted");
      await fetchPlayers();
    } catch (e) {
      showToast("error", e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Players</h1>
          <p className="text-sm text-gray-500">
            Manage players and their statuses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search players"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            >
              <option value="all">All statuses</option>
              <option value="active">active</option>
              <option value="pending_registration">pending_registration</option>
              <option value="pending_tryout">pending_tryout</option>
              <option value="rejected">rejected</option>
            </select>
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
              New Player
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm  tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-3 py-2 px-5">Name (EN)</div>
          <div className="col-span-3 py-2 px-5">Name (AR)</div>
          <div className="col-span-2 py-2 px-5">Main Phone</div>
          <div className="col-span-1 py-2 px-5">Status</div>
          <div className="col-span-2 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : visiblePlayers.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No players
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visiblePlayers.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-1 text-gray-500">{p.id}</div>
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <Avatar
                    name={`${p.first_name_en || ""} ${p.last_name_en || ""}`}
                  />
                  <span className="font-medium text-gray-900 truncate">
                    {`${p.first_name_en || ""} ${p.middle_name_en || ""} ${
                      p.last_name_en || ""
                    }`.trim()}
                  </span>
                </div>
                <div className="col-span-3 text-gray-700 truncate">
                  {`${p.first_name_ar || ""} ${p.middle_name_ar || ""} ${
                    p.last_name_ar || ""
                  }`.trim()}
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {p.main_phone || "-"}
                </div>
                <div className="col-span-1">
                  <StatusBadge status={p.status} />
                </div>
                <div className="col-span-2 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingPlayer(p);
                      setIsEditOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setPlayerToDelete(p);
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
        <CreatePlayerModal
          title="Create Player"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={async (payload) => {
            const out = { ...payload };
            if (out.birthdate) out.birthdate = toDMY(out.birthdate);
            await onCreate(out);
          }}
          submitLabel="Create"
        />
      )}

      {isEditOpen && editingPlayer && (
        <EditPlayerModal
          title="Edit Player"
          player={editingPlayer}
          onClose={() => {
            setIsEditOpen(false);
            setEditingPlayer(null);
          }}
          onSubmit={(payload) => onUpdate(editingPlayer.id, payload)}
          submitLabel="Save"
        />
      )}

      {isConfirmOpen && playerToDelete && (
        <ConfirmModal
          title="Delete Player"
          message={`Are you sure you want to delete player #${playerToDelete.id}? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => {
            setIsConfirmOpen(false);
            setPlayerToDelete(null);
          }}
          onConfirm={async () => {
            setIsConfirmOpen(false);
            await onDelete(playerToDelete.id);
            setPlayerToDelete(null);
          }}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function toDMY(yyyyMMdd) {
  // input: YYYY-MM-DD -> output: DD-MM-YYYY
  if (!yyyyMMdd || typeof yyyyMMdd !== "string") return yyyyMMdd;
  const [y, m, d] = yyyyMMdd.split("-");
  if (!y || !m || !d) return yyyyMMdd;
  return `${d}-${m}-${y}`;
}

function toYMD(dateString) {
  // input: '2014-03-12T00:00:00.000000Z' or 'YYYY-MM-DD' -> output: 'YYYY-MM-DD'
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const d = new Date(dateString);
  if (isNaN(d)) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase();
  return (
    <div className="h-7 w-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-semibold">
      {initials || "?"}
    </div>
  );
}

function StatusBadge({ status }) {
  const styleMap = {
    active: "bg-emerald-50 text-emerald-700",
    pending_registration: "bg-amber-50 text-amber-700",
    pending_tryout: "bg-indigo-50 text-indigo-700",
    rejected: "bg-red-50 text-red-700",
  };
  const style = styleMap[status] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
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
          <div className="col-span-3 flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-gray-100" />
            <div className="h-4 w-32 rounded bg-gray-100" />
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

function CreatePlayerModal({ title, onClose, onSubmit, submitLabel }) {
  const [firstNameEn, setFirstNameEn] = useState("");
  const [middleNameEn, setMiddleNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [firstNameAr, setFirstNameAr] = useState("");
  const [middleNameAr, setMiddleNameAr] = useState("");
  const [lastNameAr, setLastNameAr] = useState("");
  const [mainPhone, setMainPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [birthdate, setBirthdate] = useState(""); // YYYY-MM-DD
  const [status, setStatus] = useState("pending_registration");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return (
      firstNameEn &&
      lastNameEn &&
      firstNameAr &&
      lastNameAr &&
      mainPhone &&
      status
    );
  }, [firstNameEn, lastNameEn, firstNameAr, lastNameAr, mainPhone, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = {
        first_name_en: firstNameEn,
        middle_name_en: middleNameEn || undefined,
        last_name_en: lastNameEn,
        first_name_ar: firstNameAr,
        middle_name_ar: middleNameAr || undefined,
        last_name_ar: lastNameAr,
        main_phone: mainPhone,
        secondary_phone: secondaryPhone || undefined,
        birthdate: birthdate || undefined, // transformed by caller to D-M-Y
        status,
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
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                First Name (EN)
              </label>
              <input
                value={firstNameEn}
                onChange={(e) => setFirstNameEn(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Yousef"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Middle Name (EN)
              </label>
              <input
                value={middleNameEn}
                onChange={(e) => setMiddleNameEn(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Zaid"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Last Name (EN)
              </label>
              <input
                value={lastNameEn}
                onChange={(e) => setLastNameEn(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Nayef"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                First Name (AR)
              </label>
              <input
                value={firstNameAr}
                onChange={(e) => setFirstNameAr(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="يوسف"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Middle Name (AR)
              </label>
              <input
                value={middleNameAr}
                onChange={(e) => setMiddleNameAr(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="زيد"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Last Name (AR)
              </label>
              <input
                value={lastNameAr}
                onChange={(e) => setLastNameAr(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="نايف"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Main Phone
              </label>
              <input
                value={mainPhone}
                onChange={(e) => setMainPhone(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="+9627xxxxxxxx"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Secondary Phone
              </label>
              <input
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="+9627xxxxxxxx"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="pending_registration">
                  pending_registration
                </option>
                <option value="pending_tryout">pending_tryout</option>
                <option value="active">active</option>
                <option value="rejected">rejected</option>
              </select>
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

function EditPlayerModal({ title, player, onClose, onSubmit, submitLabel }) {
  const [status, setStatus] = useState(
    player?.status || "pending_registration"
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => Boolean(status), [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = { status };
      await onSubmit(payload);
    } catch (e) {
      setError(e?.message || "Action failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
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
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="pending_registration">
                  pending_registration
                </option>
                <option value="pending_tryout">pending_tryout</option>
                <option value="active">active</option>
                <option value="rejected">rejected</option>
              </select>
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
