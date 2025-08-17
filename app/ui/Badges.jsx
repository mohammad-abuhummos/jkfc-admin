"use client";

export function StatusBadge({ status }) {
  const s = String(status || "-");
  const style = getStatusStyle(s);
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {s}
    </span>
  );
}

export function PaymentBadge({ status }) {
  const s = String(status || "-");
  const style = getPaymentStyle(s);
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {s}
    </span>
  );
}

function getStatusStyle(s) {
  const v = s.toLowerCase();
  if (v === "active" || v === "present" || v === "accepted")
    return "bg-emerald-50 text-emerald-700";
  if (v.includes("pending")) return "bg-amber-50 text-amber-700";
  if (
    v === "rejected" ||
    v === "absent" ||
    v === "cancelled" ||
    v === "canceled"
  )
    return "bg-red-50 text-red-700";
  if (v === "excused") return "bg-indigo-50 text-indigo-700";
  return "bg-gray-100 text-gray-700";
}

function getPaymentStyle(s) {
  const v = s.toLowerCase();
  if (v === "paid" || v === "confirmed" || v === "success")
    return "bg-emerald-50 text-emerald-700";
  if (v.includes("pending")) return "bg-amber-50 text-amber-700";
  if (v === "reverted" || v === "failed" || v === "declined")
    return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
}
