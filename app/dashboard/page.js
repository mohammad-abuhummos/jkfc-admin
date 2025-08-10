import Image from "next/image";
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  BookOpenIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Dashboard | JKFC Admin",
};

function StatCard({ title, value, delta, deltaPositive, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon ? (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
              <Icon className="h-4 w-4 text-gray-600" aria-hidden="true" />
            </span>
          ) : null}
          <div className="text-sm font-medium text-gray-600">{title}</div>
        </div>
        <ChevronRightIcon
          className="h-4 w-4 text-gray-300"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div
        className={`mt-1 text-xs ${
          deltaPositive ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const courses = [
    { no: 4, name: "Winter Course 25", price: 450, dates: "Dates TBD" },
    { no: 3, name: "Autumn Course 25", price: 450, dates: "Dates TBD" },
    { no: 2, name: "Summer Course 25", price: 350, dates: "Dates TBD" },
    { no: 1, name: "Spring Course 25", price: 450, dates: "Dates TBD" },
    { no: 0, name: "Course", price: 450, dates: "Dates TBD" },
  ];

  const users = [
    {
      name: "Mostafa Emad Elsayed",
      email: "mostafaemad1@jkfc.com",
      imageUrl: null,
      verified: true,
    },
    {
      name: "Mostafa Emad Elsayed",
      email: "mostafaemad2@jkfc.com",
      imageUrl: null,
      verified: true,
    },
    {
      name: "Mostafa Emad Elsayed",
      email: "mostafaemad3@jkfc.com",
      imageUrl: null,
      verified: true,
    },
    {
      name: "Mostafa Emad Elsayed",
      email: "mostafaemad@4jkfc.com",
      imageUrl: null,
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI + Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Payment"
          value="9999 JOD"
          delta="+5% Last Month"
          deltaPositive
          icon={BanknotesIcon}
        />
        <StatCard
          title="Paid Payment"
          value="8888 JOD"
          delta="+18% Last Month"
          deltaPositive
          icon={CurrencyDollarIcon}
        />
        <StatCard
          title="Pending Payment"
          value="1111 JOD"
          delta="-20% Last Month"
          icon={ClockIcon}
        />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-0 overflow-hidden lg:row-span-2">
          <div className="px-5 pt-5">
            <div className="text-sm font-medium text-gray-600">Groups</div>
            <div className="mt-2 text-3xl font-bold">Total 17</div>
          </div>
          <div className="px-5 pb-4 mt-3 space-y-2 text-xs">
            {[
              "JKFC U15 (4 Groups)",
              "JKFC U13 (3 Groups)",
              "JKFC U12 (3 Groups)",
              "JKFC U11 (3 Groups)",
              "JKFC U10 (2 Groups)",
              "Red Knights U15",
              "JKFC Grassroots",
            ].map((g) => (
              <div
                key={g}
                className="inline-block bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md mr-2 mb-2"
              >
                {g}
              </div>
            ))}
          </div>
        </div>
        <StatCard
          title="Total Players"
          value="500"
          delta="+5% Last Month"
          deltaPositive
          icon={UserIcon}
        />
        <StatCard
          title="New Players This Month"
          value="10"
          delta="-20% Last Month"
          icon={UserPlusIcon}
        />
        <StatCard
          title="Joining Requests"
          value="15"
          delta="+6% Last Month"
          deltaPositive
          icon={UserGroupIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className=" space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
                  <BookOpenIcon className="h-4 w-4 text-gray-600" />
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  Courses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden sm:inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs hover:bg-gray-50">
                  <FunnelIcon className="h-4 w-4 text-gray-500" />
                  Filter
                </button>
                <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs hover:bg-gray-50">
                  <ArrowDownTrayIcon className="h-4 w-4 text-gray-500" />
                  Export
                </button>
              </div>
            </div>
            <div className="grid grid-cols-12 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 border-b">
              <div className="col-span-6 py-2 px-5">Course</div>
              <div className="col-span-3 py-2 px-5">Dates</div>
              <div className="col-span-3 py-2 px-5 text-right">Price</div>
            </div>
            <ul className="divide-y divide-gray-100">
              {courses.map((c) => (
                <li
                  key={c.name + c.no}
                  className="grid grid-cols-12 items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <span className="w-7 shrink-0 text-[12px] text-gray-500">
                      {c.no ? `#${c.no}` : "#"}
                    </span>
                    <span className="truncate font-medium text-gray-900">
                      {c.name}
                    </span>
                  </div>
                  <div className="col-span-3 text-gray-500 text-sm truncate">
                    {c.dates}
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">
                      {c.price.toFixed(2)} JOD
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
              <UserGroupIcon className="h-4 w-4 text-gray-600" />
            </span>
            <span className="text-sm font-semibold text-gray-700">Users</span>
          </div>
          <div className="grid grid-cols-12 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 border-b">
            <div className="col-span-8 py-2 px-5">User</div>
            <div className="col-span-4 py-2 px-5 text-right">Status</div>
          </div>
          <ul>
            {users.map((u) => (
              <li
                key={u.email}
                className="grid grid-cols-12 items-center px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-8 flex items-center gap-3 min-w-0">
                  <UserAvatar
                    name={u.name}
                    imageUrl={u.imageUrl}
                    ring={u.verified}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {u.email}
                    </div>
                  </div>
                </div>
                <div className="col-span-4 text-right">
                  {u.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      Unverified
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function UserAvatar({ name, imageUrl, ring = false }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={36}
        height={36}
        className={`h-9 w-9 rounded-full object-cover ${
          ring ? "ring-2 ring-emerald-500" : ""
        }`}
      />
    );
  }

  return (
    <div
      className={`h-9 w-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold ${
        ring ? "ring-2 ring-emerald-500" : ""
      }`}
    >
      {initials || "?"}
    </div>
  );
}
