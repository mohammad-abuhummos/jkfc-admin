import Link from 'next/link';
import { logout } from '../login/actions';

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 min-h-screen flex-col border-r border-gray-100 bg-white">
      <div className="h-16 flex items-center gap-3 px-5 border-b">
        <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">JK</div>
        <div>
          <div className="font-semibold leading-tight">J.K.F.C</div>
          <div className="text-[11px] text-gray-500">We Play As One!</div>
        </div>
      </div>
      <nav className="p-3">
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
          <span>🏠</span>
          <span>Dashboard</span>
        </Link>
      </nav>
      <form action={logout} className="mt-auto p-3">
        <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">Logout</button>
      </form>
    </aside>
  );
}


