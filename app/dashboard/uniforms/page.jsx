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
import ExportMenu from "../../ui/ExportMenu";
import { pushNotification } from "../../ui/Notifications";
import ErrorAlert from "../../ui/ErrorAlert";
import { StatusBadge, PaymentBadge } from "../../ui/Badges";

export default function UniformsPage() {
  return (
    <div className="space-y-6">
      <UniformRequests />
      <UniformSizes />
    </div>
  );
}

function UniformRequests() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

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

  const fetchList = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/uniform-requests?status=${encodeURIComponent(statusFilter)}`,
        { headers: { Accept: "application/json" }, cache: "no-store" }
      );
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
      const msg = e?.message || "Failed to load";
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [statusFilter]);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((r) => {
      if (!q) return true;
      const player = `${r?.player?.first_name_en || ""} ${
        r?.player?.last_name_en || ""
      }`;
      return `${r.type || ""} ${r.status || ""} ${player}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, searchQuery]);

  const refresh = () => {
    setIsRefreshing(true);
    fetchList();
  };

  const createOrUpdate = async (payload, id) => {
    try {
      const url = id ? `/api/uniform-requests/${id}` : "/api/uniform-requests";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
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
      setIsCreateOpen(false);
      setEditing(null);
      await fetchList();
    } catch (e) {
      showToast("error", e?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`/api/uniform-requests/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Delete failed");
      showToast("success", json?.message || "Deleted");
      await fetchList();
    } catch (e) {
      showToast("error", e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Uniform Requests
          </h2>
          <p className="text-sm text-gray-500">
            Create, update, and manage uniform requests
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search requests"
            />
          </div>
          <ExportMenu
            rows={visible}
            columns={[
              "id",
              "player.first_name_en",
              "type",
              "uniform_size.name",
              "quantity",
              "status",
              "payment.status",
            ]}
            filename="uniform_requests"
            title="Export"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
          >
            <option value="all">all</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
          </select>
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
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 h-10 text-sm font-medium hover:bg-emerald-700"
          >
            <PlusIcon className="h-4 w-4" /> New Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-2 py-2 px-5">Player</div>
          <div className="col-span-1 py-2 px-5">Type</div>
          <div className="col-span-1 py-2 px-5">Size</div>
          <div className="col-span-1 py-2 px-5">Qty</div>
          <div className="col-span-2 py-2 px-5">Status</div>
          <div className="col-span-2 py-2 px-5">Payment</div>
          <div className="col-span-3 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList cols={[1, 2, 1, 1, 1, 2, 2, 3]} />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : visible.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No requests
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-1 text-gray-500">{r.id}</div>
                <div className="col-span-2 text-gray-900 truncate">
                  {`${r?.player?.first_name_en || ""} ${
                    r?.player?.last_name_en || ""
                  }`.trim()}
                </div>
                <div className="col-span-1 text-gray-700 truncate">
                  {r.type}
                </div>
                <div className="col-span-1 text-gray-700 truncate">
                  {r?.uniform_size?.name || r.uniform_size_id}
                </div>
                <div className="col-span-1 text-gray-700 truncate">
                  {r.quantity}
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  <StatusBadge status={r.status} />
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  <PaymentBadge status={r?.payment?.status || "-"} />
                </div>
                <div className="col-span-3 text-right space-x-2">
                  <button
                    onClick={() => setEditing(r)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setToDelete(r)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isCreateOpen && (
        <UniformRequestModal
          title="Create Uniform Request"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(payload) => createOrUpdate(payload)}
          submitLabel="Create"
        />
      )}
      {editing && (
        <UniformRequestModal
          title="Edit Uniform Request"
          request={editing}
          onClose={() => setEditing(null)}
          onSubmit={(payload) => createOrUpdate(payload, editing.id)}
          submitLabel="Save"
        />
      )}
      {toDelete && (
        <ConfirmModal
          title="Delete Request"
          message={`Delete request #${toDelete.id}?`}
          confirmLabel="Delete"
          onCancel={() => setToDelete(null)}
          onConfirm={() => remove(toDelete.id)}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function UniformSizes() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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

  const fetchSizes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/settings/uniforms", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed to load");
      // Expect sizes at json.data.sizes or json.data
      const sizes = Array.isArray(json?.data?.sizes)
        ? json.data.sizes
        : Array.isArray(json?.data)
        ? json.data
        : [];
      setItems(sizes);
    } catch (e) {
      const msg = e?.message || "Failed to load sizes";
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const createOrUpdate = async (payload, id) => {
    try {
      const url = id
        ? `/api/settings/uniforms/sizes/${id}`
        : "/api/settings/uniforms/sizes";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
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
      setIsCreateOpen(false);
      setEditing(null);
      await fetchSizes();
    } catch (e) {
      showToast("error", e?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`/api/settings/uniforms/sizes/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Delete failed");
      showToast("success", json?.message || "Deleted");
      await fetchSizes();
    } catch (e) {
      showToast("error", e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Uniform Sizes</h2>
          <p className="text-sm text-gray-500">Manage sizes and prices</p>
        </div>
        <div className="space-x-2 flex items-center">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 h-9 text-xs font-medium hover:bg-emerald-700"
          >
            <PlusIcon className="h-4 w-4" /> New Size
          </button>
          <UpdatePricesButton
            onSaved={fetchSizes}
            onError={(m) =>
              setToast({ id: Date.now(), type: "error", message: m })
            }
          />
          <ExportMenu
            rows={items}
            columns={["id", "name"]}
            filename="uniform_sizes"
            title="Export"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-6 py-2 px-5">Name</div>
          <div className="col-span-5 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList cols={[1, 6, 5]} />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : items.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No sizes
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((s) => (
              <li
                key={s.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-1 text-gray-500">{s.id}</div>
                <div className="col-span-6 text-gray-900 truncate">
                  {s.name}
                </div>
                <div className="col-span-5 text-right space-x-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isCreateOpen && (
        <SizeModal
          title="Create Size"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(payload) => createOrUpdate(payload)}
          submitLabel="Create"
        />
      )}
      {editing && (
        <SizeModal
          title="Edit Size"
          size={editing}
          onClose={() => setEditing(null)}
          onSubmit={(payload) => createOrUpdate(payload, editing.id)}
          submitLabel="Save"
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function UniformRequestModal({
  title,
  request,
  onClose,
  onSubmit,
  submitLabel,
}) {
  const [playerId, setPlayerId] = useState(request?.player_id || "");
  const [type, setType] = useState(request?.type || "Full");
  const [uniformSizeId, setUniformSizeId] = useState(
    request?.uniform_size_id || ""
  );
  const [quantity, setQuantity] = useState(request?.quantity || 1);
  const [shirtName, setShirtName] = useState(request?.shirt_name || "");
  const [shirtNumber, setShirtNumber] = useState(request?.shirt_number || "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => Boolean(playerId && type && uniformSizeId && quantity),
    [playerId, type, uniformSizeId, quantity]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = {
        player_id: Number(playerId),
        type,
        uniform_size_id: Number(uniformSizeId),
        quantity: Number(quantity),
      };
      if (shirtName) payload.shirt_name = shirtName;
      if (shirtNumber) payload.shirt_number = Number(shirtNumber);
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
            <XMarkIcon className="h-4 w-4" /> Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Player ID
              </label>
              <input
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="e.g. 1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="Full">Full</option>
                <option value="T-shirt">T-shirt</option>
                <option value="Short">Short</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Uniform Size ID
              </label>
              <input
                value={uniformSizeId}
                onChange={(e) => setUniformSizeId(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="e.g. 3"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Shirt Name
              </label>
              <input
                value={shirtName}
                onChange={(e) => setShirtName(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Shirt Number
              </label>
              <input
                type="number"
                value={shirtNumber}
                onChange={(e) => setShirtNumber(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
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

function SizeModal({ title, size, onClose, onSubmit, submitLabel }) {
  const [name, setName] = useState(size?.name || "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => Boolean(name), [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      await onSubmit({ name });
    } catch (e) {
      setError(e?.message || "Action failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">{title}</div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-gray-200 hover:bg-gray-50"
          >
            <XMarkIcon className="h-4 w-4" /> Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Size name"
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

function UpdatePricesButton({ onSaved, onError }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [pricesText, setPricesText] = useState(
    '[\n  { "id": 1, "price": "30" }\n]'
  );

  const submit = async () => {
    setPending(true);
    try {
      const prices = JSON.parse(pricesText);
      const res = await fetch("/api/settings/uniforms/prices", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prices }),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed");
      setOpen(false);
      if (onSaved) onSaved();
    } catch (e) {
      if (onError) onError(e?.message || "Failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 h-9 text-xs hover:bg-gray-50"
      >
        Update Prices
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-800">
                Update Prices
              </div>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-gray-200 hover:bg-gray-50"
              >
                <XMarkIcon className="h-4 w-4" /> Close
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-xs text-gray-600">
                Enter JSON array of prices (id, price)
              </div>
              <textarea
                value={pricesText}
                onChange={(e) => setPricesText(e.target.value)}
                className="w-full min-h-40 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  disabled={pending}
                  className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
                >
                  {pending ? "Please wait…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SkeletonList({ cols = [3, 3, 3, 3] }) {
  const rows = new Array(6).fill(null);
  return (
    <ul className="divide-y divide-gray-100 animate-pulse">
      {rows.map((_, idx) => (
        <li key={idx} className="grid grid-cols-12 items-center px-5 py-3">
          {cols.map((span, i) => (
            <div key={i} className={`col-span-${span}`}>
              <div className="h-4 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
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
