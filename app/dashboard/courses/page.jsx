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

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/courses", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed with ${res.status}`);
      }
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setCourses(list);
    } catch (e) {
      setError(e?.message || "Failed to load courses");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const visibleCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses
      .filter((c) =>
        seasonFilter === "all" ? true : c.season === seasonFilter
      )
      .filter((c) =>
        yearFilter === "all" ? true : String(c.year) === String(yearFilter)
      )
      .filter((c) => {
        if (!q) return true;
        const hay = `${c.title || ""} ${c.season || ""} ${c.year || ""} ${
          c.description || ""
        }`
          .toLowerCase()
          .trim();
        return hay.includes(q);
      });
  }, [courses, searchQuery, seasonFilter, yearFilter]);

  const refreshList = () => {
    setIsRefreshing(true);
    fetchCourses();
  };

  const onCreate = async (payload) => {
    try {
      const res = await fetch("/api/courses", {
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
      showToast("success", json?.message || "Course created");
      setIsCreateOpen(false);
      await fetchCourses();
    } catch (e) {
      showToast("error", e?.message || "Create failed");
    }
  };

  const onUpdate = async (id, payload) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
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
      showToast("success", json?.message || "Course updated");
      setIsEditOpen(false);
      setEditingCourse(null);
      await fetchCourses();
    } catch (e) {
      showToast("error", e?.message || "Update failed");
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Delete failed");
      }
      showToast("success", json?.message || "Course deleted");
      await fetchCourses();
    } catch (e) {
      showToast("error", e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500">Manage courses and branches</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="Search courses"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            >
              <option value="all">All seasons</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            >
              <option value="all">All years</option>
              {[...new Set(courses.map((c) => String(c.year)))].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
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
              New Course
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 text-sm tracking-wide text-gray-500 border-b py-2">
          <div className="col-span-1 py-2 px-5">ID</div>
          <div className="col-span-4 py-2 px-5">Title</div>
          <div className="col-span-2 py-2 px-5">Season</div>
          <div className="col-span-2 py-2 px-5">Year</div>
          <div className="col-span-1 py-2 px-5">Branches</div>
          <div className="col-span-2 py-2 px-5 text-right">Actions</div>
        </div>
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No courses
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visibleCourses.map((c) => (
              <CourseRow
                key={c.id}
                course={c}
                onEdit={() => {
                  setEditingCourse(c);
                  setIsEditOpen(true);
                }}
                onDelete={() => {
                  setCourseToDelete(c);
                  setIsConfirmOpen(true);
                }}
              />
            ))}
          </ul>
        )}
      </div>

      {isCreateOpen && (
        <CourseModal
          title="Create Course"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
          submitLabel="Create"
        />
      )}

      {isEditOpen && editingCourse && (
        <CourseModal
          title="Edit Course"
          course={editingCourse}
          onClose={() => {
            setIsEditOpen(false);
            setEditingCourse(null);
          }}
          onSubmit={(payload) => onUpdate(editingCourse.id, payload)}
          submitLabel="Save"
        />
      )}

      {isConfirmOpen && courseToDelete && (
        <ConfirmModal
          title="Delete Course"
          message={`Are you sure you want to delete course "${courseToDelete.title}" (#${courseToDelete.id})? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => {
            setIsConfirmOpen(false);
            setCourseToDelete(null);
          }}
          onConfirm={async () => {
            setIsConfirmOpen(false);
            await onDelete(courseToDelete.id);
            setCourseToDelete(null);
          }}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function CourseRow({ course, onEdit, onDelete }) {
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  return (
    <li className="px-5 py-3 text-sm">
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-1 text-gray-500">{course.id}</div>
        <div className="col-span-4 font-medium text-gray-900 truncate">
          {course.title}
        </div>
        <div className="col-span-2 text-gray-700 truncate">{course.season}</div>
        <div className="col-span-2 text-gray-700 truncate">{course.year}</div>
        <div className="col-span-1 text-gray-700 truncate">
          {course.course_schedules_count ?? 0}
        </div>
        <div className="col-span-2 text-right space-x-2">
          <button
            onClick={() => setIsBranchesOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
          >
            Branches
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      {isBranchesOpen && (
        <BranchesModal
          courseId={course.id}
          onClose={() => setIsBranchesOpen(false)}
        />
      )}
    </li>
  );
}

function BranchesModal({ courseId, onClose }) {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/courses/${courseId}/schedules`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setSchedules(list);
    } catch (e) {
      setError(e?.message || "Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const onCreate = async (payload) => {
    const res = await fetch(`/api/courses/${courseId}/schedules`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false)
      throw new Error(json?.message || "Create failed");
    await fetchSchedules();
    setIsCreateOpen(false);
  };

  const onUpdate = async (id, payload) => {
    const res = await fetch(`/api/schedules/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false)
      throw new Error(json?.message || "Update failed");
    await fetchSchedules();
    setEditing(null);
  };

  const onDelete = async (id) => {
    const res = await fetch(`/api/schedules/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    const json = await res.json();
    if (!res.ok || json?.success === false)
      throw new Error(json?.message || "Delete failed");
    await fetchSchedules();
    setToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-5xl max-h-[85vh] rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-5 py-3 border-b flex items-center justify-between shrink-0">
          <div className="text-sm font-semibold text-gray-800">Branches</div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSchedules}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 h-8 text-xs font-medium hover:bg-emerald-700"
            >
              <PlusIcon className="h-4 w-4" />
              New Branch
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-gray-200 hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
        <div className="p-5 flex-1 min-h-0 overflow-y-auto">
          {isLoading ? (
            <BranchSkeletonGrid />
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : schedules.length === 0 ? (
            <div className="text-sm text-gray-500">No branches</div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((s) => (
                <BranchCard
                  key={s.id}
                  schedule={s}
                  onEdit={() => setEditing(s)}
                  onDelete={() => setToDelete(s)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <ScheduleModal
          title="Create Branch"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
          submitLabel="Create"
        />
      )}

      {editing && (
        <ScheduleModal
          title="Edit Branch"
          schedule={editing}
          onClose={() => setEditing(null)}
          onSubmit={(payload) => onUpdate(editing.id, payload)}
          submitLabel="Save"
        />
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete Branch"
          message={`Delete branch "${toDelete.name}" (#${toDelete.id})? This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setToDelete(null)}
          onConfirm={() => onDelete(toDelete.id)}
        />
      )}
    </div>
  );
}

function BranchCard({ schedule, onEdit, onDelete }) {
  const yes = (
    <span className="inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium">
      Yes
    </span>
  );
  const no = (
    <span className="inline-flex items-center rounded-md bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px] font-medium">
      No
    </span>
  );
  return (
    <li className="rounded-lg border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {schedule.name}
          </div>
          <div className="text-[11px] text-gray-500">ID #{schedule.id}</div>
        </div>
        <div className="shrink-0 space-x-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
          >
            <PencilSquareIcon className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-700">
        <Info label="Sessions" value={schedule.number_of_sessions} />
        <Info label="Max players" value={schedule.max_players} />
        <Info label="Total price" value={`${schedule.total_price} JOD`} />
        <Info
          label="Partial allowed"
          value={schedule.is_partial_payment_allowed ? yes : no}
        />
        <Info label="First %" value={schedule.first_payment_percentage} />
        <Info label="Second %" value={schedule.second_payment_percentage} />
        <Info label="Start" value={toYMD(schedule.start_date)} />
        <Info label="End" value={toYMD(schedule.end_date)} />
      </div>
      <div className="mt-3">
        <div className="text-xs font-medium text-gray-700">Weekly schedule</div>
        <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-gray-700">
          {(schedule.schedule_data || []).map((row, idx) => (
            <li key={idx} className="rounded border border-gray-100 px-2 py-1">
              <span className="font-medium">{row.day}</span>: {row.start_time} –{" "}
              {row.end_time}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="text-gray-900 font-medium">{value ?? "-"}</div>
    </div>
  );
}

function BranchSkeletonGrid() {
  const items = new Array(4).fill(null);
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((_, i) => (
        <li
          key={i}
          className="rounded-lg border border-gray-100 shadow-sm p-4 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-6 w-24 rounded bg-gray-100" />
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="h-3 w-20 rounded bg-gray-100" />
            <div className="h-3 w-16 rounded bg-gray-100" />
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="h-3 w-28 rounded bg-gray-100" />
            <div className="h-3 w-16 rounded bg-gray-100" />
            <div className="h-3 w-16 rounded bg-gray-100" />
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="h-8 w-full rounded bg-gray-100" />
            <div className="h-8 w-full rounded bg-gray-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function CourseSchedules({ courseId }) {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/courses/${courseId}/schedules`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setSchedules(list);
    } catch (e) {
      setError(e?.message || "Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const onCreate = async (payload) => {
    const res = await fetch(`/api/courses/${courseId}/schedules`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false)
      throw new Error(json?.message || "Create failed");
    await fetchSchedules();
    setIsCreateOpen(false);
  };

  const onUpdate = async (id, payload) => {
    const res = await fetch(`/api/schedules/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false)
      throw new Error(json?.message || "Update failed");
    await fetchSchedules();
    setEditing(null);
  };

  const onDelete = async (id) => {
    const res = await fetch(`/api/schedules/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    const json = await res.json();
    if (!res.ok || json?.success === false)
      throw new Error(json?.message || "Delete failed");
    await fetchSchedules();
    setIsConfirmOpen(false);
    setToDelete(null);
  };

  return (
    <div className="mt-3 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        <div className="text-sm font-medium text-gray-700">Branches</div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 h-8 text-xs font-medium hover:bg-emerald-700"
        >
          <PlusIcon className="h-4 w-4" /> New Branch
        </button>
      </div>
      {isLoading ? (
        <div className="px-4 py-6 text-sm text-gray-500">Loading…</div>
      ) : error ? (
        <div className="px-4 py-6 text-sm text-red-600">{error}</div>
      ) : schedules.length === 0 ? (
        <div className="px-4 py-6 text-sm text-gray-500">No branches</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {schedules.map((s) => (
            <li key={s.id} className="px-4 py-3 text-sm">
              <div className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 font-medium text-gray-900 truncate">
                  {s.name}
                </div>
                <div className="col-span-3 text-gray-700 truncate">
                  {s.number_of_sessions} sessions
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  max {s.max_players}
                </div>
                <div className="col-span-2 text-gray-700 truncate">
                  {s.total_price} JOD
                </div>
                <div className="col-span-2 text-right space-x-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setToDelete(s);
                      setIsConfirmOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isCreateOpen && (
        <ScheduleModal
          title="Create Branch"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
          submitLabel="Create"
        />
      )}

      {editing && (
        <ScheduleModal
          title="Edit Branch"
          schedule={editing}
          onClose={() => setEditing(null)}
          onSubmit={(payload) => onUpdate(editing.id, payload)}
          submitLabel="Save"
        />
      )}

      {isConfirmOpen && toDelete && (
        <ConfirmModal
          title="Delete Branch"
          message={`Delete branch "${toDelete.name}" (#${toDelete.id})? This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => {
            setIsConfirmOpen(false);
            setToDelete(null);
          }}
          onConfirm={() => onDelete(toDelete.id)}
        />
      )}
    </div>
  );
}

function CourseModal({ title, course, onClose, onSubmit, submitLabel }) {
  const [titleValue, setTitleValue] = useState(course?.title || "");
  const [season, setSeason] = useState(course?.season || "Summer");
  const [year, setYear] = useState(
    String(course?.year || new Date().getFullYear())
  );
  const [description, setDescription] = useState(course?.description ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(titleValue && season && year);
  }, [titleValue, season, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = {
        title: titleValue,
        season,
        year: String(year),
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
              <label className="text-xs font-medium text-gray-700">Title</label>
              <input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Summer Training"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Year</label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="2025"
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

function ScheduleModal({ title, schedule, onClose, onSubmit, submitLabel }) {
  const [name, setName] = useState(schedule?.name || "");
  const [numberOfSessions, setNumberOfSessions] = useState(
    schedule?.number_of_sessions ?? ""
  );
  const [maxPlayers, setMaxPlayers] = useState(schedule?.max_players ?? "");
  const [totalPrice, setTotalPrice] = useState(schedule?.total_price ?? "");
  const [isPartialAllowed, setIsPartialAllowed] = useState(
    Boolean(schedule?.is_partial_payment_allowed ?? true)
  );
  const [firstPercent, setFirstPercent] = useState(
    schedule?.first_payment_percentage ?? ""
  );
  const [secondPercent, setSecondPercent] = useState(
    schedule?.second_payment_percentage ?? ""
  );
  const [startDate, setStartDate] = useState(
    schedule?.start_date ? toYMD(schedule.start_date) : ""
  );
  const [endDate, setEndDate] = useState(
    schedule?.end_date ? toYMD(schedule.end_date) : ""
  );
  const [scheduleData, setScheduleData] = useState(
    schedule?.schedule_data || [
      { day: "Sunday", start_time: "12:00", end_time: "14:00" },
    ]
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!name || !numberOfSessions || !maxPlayers || !totalPrice) return false;
    if (!startDate || !endDate) return false;
    if (String(firstPercent) === "" || String(secondPercent) === "")
      return false;
    return true;
  }, [
    name,
    numberOfSessions,
    maxPlayers,
    totalPrice,
    startDate,
    endDate,
    firstPercent,
    secondPercent,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError("");
    try {
      const payload = {
        name,
        number_of_sessions: Number(numberOfSessions),
        max_players: Number(maxPlayers),
        total_price: String(totalPrice),
        is_partial_payment_allowed: Boolean(isPartialAllowed),
        first_payment_percentage: Number(firstPercent),
        second_payment_percentage: Number(secondPercent),
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        schedule_data: scheduleData.map((s) => ({
          day: s.day,
          start_time: s.start_time,
          end_time: s.end_time,
        })),
      };
      await onSubmit(payload);
    } catch (e) {
      setError(e?.message || "Action failed");
    } finally {
      setPending(false);
    }
  };

  const addRow = () =>
    setScheduleData((rows) => [
      ...rows,
      { day: "Sunday", start_time: "12:00", end_time: "14:00" },
    ]);
  const removeRow = (idx) =>
    setScheduleData((rows) => rows.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) =>
    setScheduleData((rows) =>
      rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="Evening Group"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Total Price
              </label>
              <input
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="150.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Sessions
              </label>
              <input
                type="number"
                value={numberOfSessions}
                onChange={(e) => setNumberOfSessions(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Max Players
              </label>
              <input
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Partial Payment Allowed
              </label>
              <select
                value={String(isPartialAllowed)}
                onChange={(e) => setIsPartialAllowed(e.target.value === "true")}
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                First Payment %
              </label>
              <input
                type="number"
                value={firstPercent}
                onChange={(e) => setFirstPercent(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="70"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Second Payment %
              </label>
              <input
                type="number"
                value={secondPercent}
                onChange={(e) => setSecondPercent(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">
              Weekly Schedule
            </div>
            {scheduleData.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
              >
                <select
                  value={row.day}
                  onChange={(e) => updateRow(idx, "day", e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={row.start_time}
                  onChange={(e) => updateRow(idx, "start_time", e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                />
                <input
                  type="time"
                  value={row.end_time}
                  onChange={(e) => updateRow(idx, "end_time", e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="rounded-lg border border-red-200 text-red-700 px-3 py-2 text-sm hover:bg-red-50"
                  >
                    Remove
                  </button>
                  {idx === scheduleData.length - 1 && (
                    <button
                      type="button"
                      onClick={addRow}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
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

function SkeletonList() {
  const rows = new Array(6).fill(null);
  return (
    <ul className="divide-y divide-gray-100 animate-pulse">
      {rows.map((_, idx) => (
        <li key={idx} className="grid grid-cols-12 items-center px-5 py-3">
          <div className="col-span-1">
            <div className="h-4 w-6 rounded bg-gray-100" />
          </div>
          <div className="col-span-4">
            <div className="h-4 w-40 rounded bg-gray-100" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="col-span-2">
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="col-span-1">
            <div className="h-5 w-10 rounded bg-gray-100" />
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

const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function toYMD(dateString) {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const d = new Date(dateString);
  if (isNaN(d)) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
