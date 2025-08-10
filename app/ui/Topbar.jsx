import { getCurrentUser } from "../lib/auth";
import UserMenu from "./UserMenu";

export const dynamic = "force-dynamic";

export default async function Topbar() {
  const user = await getCurrentUser();
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex-1">
        <input
          className="w-full max-w-xl h-10 rounded-lg border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Search Users or Groups..."
        />
      </div>
      <UserMenu user={user} />
    </header>
  );
}
