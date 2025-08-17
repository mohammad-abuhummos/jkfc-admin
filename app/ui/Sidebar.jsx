"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  Bars3BottomLeftIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { useUi } from "./UiContext";

export default function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    toggleSidebarCollapse,
    mobileSidebarOpen,
    closeMobileSidebar,
  } = useUi();

  const content = (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } min-h-screen flex-col border-r border-gray-100 bg-white hidden lg:flex`}
    >
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
        <Image src="/logo.svg" alt="JKFC" width={32} height={32} />
        {!sidebarCollapsed && (
          <div>
            <div className="font-semibold leading-tight">J.K.F.C</div>
            <div className="text-[11px] text-gray-500">We Play As One!</div>
          </div>
        )}
      </div>
      <nav className="p-3">
        <SidebarLink
          href="/dashboard"
          active={pathname === "/dashboard"}
          icon={HomeIcon}
          collapsed={sidebarCollapsed}
        >
          Dashboard
        </SidebarLink>
        <div className="mt-2 space-y-1">
          <SidebarLink
            href="/dashboard/users"
            icon={UserGroupIcon}
            active={pathname?.startsWith("/dashboard/users")}
            collapsed={sidebarCollapsed}
          >
            Users
          </SidebarLink>
          <SidebarLink
            href="/dashboard/players"
            icon={UserGroupIcon}
            active={pathname?.startsWith("/dashboard/players")}
            collapsed={sidebarCollapsed}
          >
            Players
          </SidebarLink>
          <SidebarLink
            href="/dashboard/groups"
            icon={UserGroupIcon}
            active={pathname?.startsWith("/dashboard/groups")}
            collapsed={sidebarCollapsed}
          >
            Groups
          </SidebarLink>
          <SidebarLink
            href="/dashboard/courses"
            icon={BookOpenIcon}
            active={pathname?.startsWith("/dashboard/courses")}
            collapsed={sidebarCollapsed}
          >
            Courses
          </SidebarLink>
          <SidebarLink
            href="/dashboard/registrations"
            icon={ClipboardDocumentCheckIcon}
            active={pathname?.startsWith("/dashboard/registrations")}
            collapsed={sidebarCollapsed}
          >
            Registrations
          </SidebarLink>
          <SidebarLink
            href="/dashboard/tryouts"
            icon={ClipboardDocumentCheckIcon}
            active={pathname?.startsWith("/dashboard/tryouts")}
            collapsed={sidebarCollapsed}
          >
            Tryouts
          </SidebarLink>
          <SidebarLink
            href="/dashboard/payments"
            icon={DocumentTextIcon}
            active={pathname?.startsWith("/dashboard/payments")}
            collapsed={sidebarCollapsed}
          >
            Payments
          </SidebarLink>
          <SidebarLink
            href="/dashboard/attendance"
            icon={CalendarDaysIcon}
            active={pathname?.startsWith("/dashboard/attendance")}
            collapsed={sidebarCollapsed}
          >
            Attendance
          </SidebarLink>
          <SidebarLink
            href="/dashboard/uniforms"
            icon={ClipboardDocumentCheckIcon}
            active={pathname?.startsWith("/dashboard/uniforms")}
            collapsed={sidebarCollapsed}
          >
            Uniforms
          </SidebarLink>
        </div>
      </nav>
      <div className="mt-auto p-3 text-xs text-gray-400 flex items-center justify-between">
        <span className={`${sidebarCollapsed ? "hidden" : "block"}`}>
          © JKFC
        </span>
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] hover:bg-gray-50"
        >
          <ArrowsRightLeftIcon className="h-4 w-4" />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar with collapse */}
      {content}
      {/* Mobile overlay sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 min-h-full bg-white border-r border-gray-100 shadow-xl">
            <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
              <Image src="/logo.svg" alt="JKFC" width={32} height={32} />
              <div>
                <div className="font-semibold leading-tight">J.K.F.C</div>
                <div className="text-[11px] text-gray-500">We Play As One!</div>
              </div>
            </div>
            <nav className="p-3">
              <SidebarLink
                href="/dashboard"
                active={pathname === "/dashboard"}
                icon={HomeIcon}
                onNavigate={closeMobileSidebar}
              >
                Dashboard
              </SidebarLink>
              <div className="mt-2 space-y-1">
                <SidebarLink
                  href="/dashboard/users"
                  icon={UserGroupIcon}
                  active={pathname?.startsWith("/dashboard/users")}
                  onNavigate={closeMobileSidebar}
                >
                  Users
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/players"
                  icon={UserGroupIcon}
                  active={pathname?.startsWith("/dashboard/players")}
                  onNavigate={closeMobileSidebar}
                >
                  Players
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/groups"
                  icon={UserGroupIcon}
                  active={pathname?.startsWith("/dashboard/groups")}
                  onNavigate={closeMobileSidebar}
                >
                  Groups
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/courses"
                  icon={BookOpenIcon}
                  active={pathname?.startsWith("/dashboard/courses")}
                  onNavigate={closeMobileSidebar}
                >
                  Courses
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/registrations"
                  icon={ClipboardDocumentCheckIcon}
                  active={pathname?.startsWith("/dashboard/registrations")}
                  onNavigate={closeMobileSidebar}
                >
                  Registrations
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/tryouts"
                  icon={ClipboardDocumentCheckIcon}
                  active={pathname?.startsWith("/dashboard/tryouts")}
                  onNavigate={closeMobileSidebar}
                >
                  Tryouts
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/payments"
                  icon={DocumentTextIcon}
                  active={pathname?.startsWith("/dashboard/payments")}
                  onNavigate={closeMobileSidebar}
                >
                  Payments
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/attendance"
                  icon={CalendarDaysIcon}
                  active={pathname?.startsWith("/dashboard/attendance")}
                  onNavigate={closeMobileSidebar}
                >
                  Attendance
                </SidebarLink>
                <SidebarLink
                  href="/dashboard/uniforms"
                  icon={ClipboardDocumentCheckIcon}
                  active={pathname?.startsWith("/dashboard/uniforms")}
                  onNavigate={closeMobileSidebar}
                >
                  Uniforms
                </SidebarLink>
              </div>
            </nav>
            <div className="mt-auto p-3 text-xs text-gray-400">© JKFC</div>
          </div>
          <div className="flex-1 bg-black/40" onClick={closeMobileSidebar} />
        </div>
      )}
    </>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  children,
  active = false,
  collapsed = false,
  onNavigate,
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className={`${collapsed ? "hidden" : "inline"}`}>{children}</span>
    </Link>
  );
}
