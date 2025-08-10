import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  LockClosedIcon,
  KeyIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 min-h-screen flex-col border-r border-gray-100 bg-white">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
        <Image src="/logo.svg" alt="JKFC" width={32} height={32} />
        <div>
          <div className="font-semibold leading-tight">J.K.F.C</div>
          <div className="text-[11px] text-gray-500">We Play As One!</div>
        </div>
      </div>
      <nav className="p-3">
        <SidebarLink href="/dashboard" active icon={HomeIcon}>
          Dashboard
        </SidebarLink>
        <div className="mt-2 space-y-1">
          <SidebarLink href="#" icon={LockClosedIcon}>
            Authentication
          </SidebarLink>
          <SidebarLink href="/dashboard/users" icon={UserGroupIcon}>
            Users
          </SidebarLink>
          {/* <SidebarLink href="#" icon={ShieldCheckIcon}>
            Access
          </SidebarLink>
          <SidebarLink href="#" icon={KeyIcon}>
            API Keys
          </SidebarLink>
          <SidebarLink href="#" icon={DocumentTextIcon}>
            API Log
          </SidebarLink>
          <SidebarLink href="#" icon={CalendarDaysIcon}>
            Attendance
          </SidebarLink>
          <SidebarLink href="#" icon={WrenchScrewdriverIcon}>
            Config Variable
          </SidebarLink>
          <SidebarLink href="#" icon={BookOpenIcon}>
            Courses
          </SidebarLink>
          <SidebarLink href="#" icon={UserGroupIcon}>
            Groups
          </SidebarLink>
          <SidebarLink href="#" icon={ClipboardDocumentCheckIcon}>
            Registration
          </SidebarLink>
          <SidebarLink href="#" icon={Cog6ToothIcon}>
            Settings
          </SidebarLink> */}
        </div>
      </nav>
      <div className="mt-auto p-3 text-xs text-gray-400">© JKFC</div>
    </aside>
  );
}

function SidebarLink({ href, icon: Icon, children, active = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}
