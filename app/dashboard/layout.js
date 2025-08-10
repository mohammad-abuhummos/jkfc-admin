import Sidebar from '../ui/Sidebar';
import Topbar from '../ui/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-gray-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}


