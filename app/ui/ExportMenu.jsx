"use client";

import { Fragment, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function normalize(rows, columns) {
  const cols = columns && columns.length > 0 ? columns : inferColumns(rows);
  const headers = cols.map((c) => (typeof c === "string" ? c : c.header));
  const accessors = cols.map((c) => (typeof c === "string" ? c : c.accessor));
  const data = (rows || []).map((r) => accessors.map((a) => safeGet(r, a)));
  return { headers, data };
}

function inferColumns(rows) {
  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!first || typeof first !== "object") return [];
  return Object.keys(first).map((k) => ({ header: titleCase(k), accessor: k }));
}

function titleCase(s) {
  return String(s)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

function safeGet(obj, path) {
  if (!path) return "";
  return String(
    path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) ?? ""
  );
}

export default function ExportMenu({
  rows,
  columns, // [{header, accessor}] or ["field", ...]
  filename = "export",
  title,
  disabled,
}) {
  const [pending, setPending] = useState(false);
  const resolvedTitle = title || "Export";
  const normalized = useMemo(() => normalize(rows, columns), [rows, columns]);

  const exportExcel = async () => {
    setPending(true);
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [normalized.headers, ...normalized.data];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } finally {
      setPending(false);
    }
  };

  const exportPdf = async () => {
    setPending(true);
    try {
      const doc = new jsPDF({ orientation: "landscape" });
      autoTable(doc, {
        head: [normalized.headers],
        body: normalized.data,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [16, 185, 129] },
        theme: "striped",
        margin: { top: 14 },
      });
      doc.save(`${filename}.pdf`);
    } finally {
      setPending(false);
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        disabled={disabled || pending || (normalized.data || []).length === 0}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 h-10 text-sm hover:bg-gray-50 disabled:opacity-60"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />{" "}
        {pending ? "Preparing…" : resolvedTitle}
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
        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-md p-1 z-10">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={exportExcel}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  active ? "bg-gray-50" : ""
                }`}
              >
                <DocumentArrowDownIcon className="h-4 w-4" /> Excel (.xlsx)
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={exportPdf}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  active ? "bg-gray-50" : ""
                }`}
              >
                <DocumentArrowDownIcon className="h-4 w-4" /> PDF (.pdf)
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
