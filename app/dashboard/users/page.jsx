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

// metadata is not supported in client components

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed with ${res.status}`);
      }
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setUsers(list);
    } catch (e) {
      setError(e?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // fetch current user id to disable self-delete
    (async () => {
      try {
        const res = await fetch("/api/self", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        const id = json?.data?.id ?? json?.id ?? null;
        if (id) setCurrentUserId(Number(id));
      } catch {}
    })();
  }, []);

  const visibleUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users
      .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
      .filter((u) => {
        if (!q) return true;
        const hay =
          `${u.name} ${u.username} ${u.email} ${u.role}`.toLowerCase();
        return hay.includes(q);
      });
  }, [users, searchQuery, roleFilter]);

  const refreshList = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const onCreate = async (payload) => {
    try {
      const res = await fetch("/api/users", {
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
      showToast("success", json?.message || "User created");
      setIsCreateOpen(false);
      await fetchUsers();
    } catch (e) {
      showToast("error", e?.message || "Create failed");
    }
  };

  const onUpdate = async (id, payload) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
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
      showToast("success", json?.message || "User updated");
      setIsEditOpen(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (e) {
      showToast("error", e?.message || "Update failed");
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Delete failed");
      }
      showToast("success", json?.message || "User deleted");
      await fetchUsers();
    } catch (e) {
      showToast("error", e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage users and their roles</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search users"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            >
              <option value="all">All roles</option>
              <option value="employee">employee</option>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
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
              New User
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm  tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-3 py-2 px-5">Name</div>
          <div className="col-span-2 py-2 px-5">Username</div>
          <div className="col-span-3 py-2 px-5">Email</div>
          <div className="col-span-1 py-2 px-5">Role</div>
          <div className="col-span-2 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No users
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visibleUsers.map((u) => (
              <li
                key={u.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-1 text-gray-500">{u.id}</div>
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <UserCircle name={u.name} />
                  <span className="font-medium text-gray-900 truncate">
                    {u.name}
                  </span>
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {u.username}
                </div>
                <div className="col-span-3 text-gray-700 truncate">
                  {u.email}
                </div>
                <div className="col-span-1">
                  <RoleBadge role={u.role} />
                </div>
                <div className="col-span-2 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setIsEditOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setUserToDelete(u);
                      setIsConfirmOpen(true);
                    }}
                    disabled={
                      currentUserId != null && Number(u.id) === currentUserId
                    }
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
                      currentUserId != null && Number(u.id) === currentUserId
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-red-200 text-red-700 hover:bg-red-50"
                    }`}
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
        <UserModal
          title="Create User"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
          submitLabel="Create"
        />
      )}

      {isEditOpen && editingUser && (
        <UserModal
          title="Edit User"
          user={editingUser}
          onClose={() => {
            setIsEditOpen(false);
            setEditingUser(null);
          }}
          onSubmit={(payload) => onUpdate(editingUser.id, payload)}
          submitLabel="Save"
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
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

function UserCircle({ name }) {
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

function RoleBadge({ role }) {
  const styleMap = {
    employee: "bg-gray-100 text-gray-700",
    admin: "bg-indigo-50 text-indigo-700",
    superadmin: "bg-emerald-50 text-emerald-700",
  };
  const style = styleMap[role] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {role}
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
          <div className="col-span-2">
            <div className="h-4 w-28 rounded bg-gray-100" />
          </div>
          <div className="col-span-3">
            <div className="h-4 w-40 rounded bg-gray-100" />
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

function UserModal({ title, user, onClose, onSubmit, submitLabel }) {
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role || "employee");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!name || !username || !email || !role) return false;
    return true;
  }, [name, username, email, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = { name, username, email, role };
      if (password) payload.password = password;
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Username"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="employee">employee</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder={
                user ? "Leave blank to keep current" : "Set a password"
              }
            />
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
