import Link from "next/link";
import Image from "next/image";
import { logout } from "../login/actions";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 min-h-screen flex-col border-r border-gray-100 bg-white">
      <div className="h-16 flex items-center gap-3 px-5 border-b">
        <Image src="/logo.svg" alt="JKFC" width={32} height={32} />
        <div>
          <div className="font-semibold leading-tight">J.K.F.C</div>
          <div className="text-[11px] text-gray-500">We Play As One!</div>
        </div>
      </div>
      <nav className="p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium"
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </Link>
      </nav>
      <div className="mt-auto p-3 text-xs text-gray-400">© JKFC</div>
    </aside>
  );
}
