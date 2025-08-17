"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // persist collapse preference
  useEffect(() => {
    try {
      const raw = localStorage.getItem("jkfc_sidebar_collapsed");
      if (raw != null) setSidebarCollapsed(raw === "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("jkfc_sidebar_collapsed", String(sidebarCollapsed));
    } catch {}
  }, [sidebarCollapsed]);

  const toggleSidebarCollapse = useCallback(
    () => setSidebarCollapsed((v) => !v),
    []
  );

  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(
    () => setMobileSidebarOpen((v) => !v),
    []
  );

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      mobileSidebarOpen,
      setSidebarCollapsed,
      toggleSidebarCollapse,
      openMobileSidebar,
      closeMobileSidebar,
      toggleMobileSidebar,
    }),
    [
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebarCollapse,
      openMobileSidebar,
      closeMobileSidebar,
      toggleMobileSidebar,
    ]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
