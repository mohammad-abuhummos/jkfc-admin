export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex-1">
        <input
          className="w-full max-w-xl h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Search Users or Groups..."
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="leading-tight">
          <div className="text-sm font-medium">Mostafa</div>
          <div className="text-[11px] text-gray-500">Admin</div>
        </div>
      </div>
    </header>
  );
}


