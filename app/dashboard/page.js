export const metadata = {
  title: 'Dashboard | JKFC Admin',
};

function StatCard({ title, value, delta, deltaPositive }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className="text-gray-300">→</div>
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className={`mt-1 text-xs ${deltaPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {delta}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Payment" value="9999 JOD" delta="+5% Last Month" deltaPositive />
        <StatCard title="Paid Payment" value="8888 JOD" delta="+18% Last Month" deltaPositive />
        <StatCard title="Pending Payment" value="1111 JOD" delta="-20% Last Month" />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-sm font-medium text-gray-600">Groups</div>
          <div className="mt-2 text-3xl font-bold">Total 17</div>
          <div className="mt-3 space-y-2 text-xs">
            {['JKFC U15 (4 Groups)','JKFC U13 (3 Groups)','JKFC U12 (3 Groups)','JKFC U11 (3 Groups)','JKFC U10 (2 Groups)','Red Knights U15','JKFC Grassroots'].map((g) => (
              <div key={g} className="inline-block bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md mr-2 mb-2">
                {g}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b text-sm font-semibold text-gray-700">Courses</div>
            <div className="divide-y">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-gray-900 font-medium">{['Winter Course 25','Autumn Course 25','Summer Course 25','Spring Course 25'][i-1] ?? 'Course'}</div>
                    <div className="text-gray-500 text-xs">Dates TBD</div>
                  </div>
                  <div className="text-gray-700">{[450,450,350,450][i-1] ?? 450}.00 JOD</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b text-sm font-semibold text-gray-700">Users</div>
            <div className="px-5 py-4 space-y-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div>
                      <div className="text-sm font-medium">Mostafa Emad Elsayed</div>
                      <div className="text-xs text-gray-500">mostafaemad@jkfc.com</div>
                    </div>
                  </div>
                  <div className="text-emerald-600 text-xs font-medium">Verified</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b text-sm font-semibold text-gray-700">Recent Actions</div>
            <div className="px-5 py-4 space-y-3 text-sm">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">abdtest</div>
                    <div className="text-xs text-gray-500">Changed password.</div>
                  </div>
                  <div className="text-xs text-gray-500">1 Week Ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


