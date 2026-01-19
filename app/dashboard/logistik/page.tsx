import KpiCard from "@/components/dashboard/KpiCard";
import type { LogistikSummary } from "@/lib/types/logistik";

async function getLogistikSummary(): Promise<LogistikSummary[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/logistik`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed fetch logistik summary");
  return res.json();
}

export default async function LogistikDashboardPage() {
  const data = await getLogistikSummary();

  const totalProyek = data.length;
  const proyekBerjalan = data.filter(
    (p) => p.status === "ON DELIVERY" || p.status === "PARTIAL"
  ).length;

  const proyekSelesai = data.filter(
    (p) => p.status === "RECEIVED"
  ).length;

  return (
    <section className="space-y-10">
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          LOGISTIK
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Logistik Dashboard
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Dalam Pengiriman" value={proyekBerjalan} type="text" />
        <KpiCard title="Selesai" value={proyekSelesai} type="text" />
        <KpiCard title="Status Logistik" value="ON TRACK" type="text" />
      </div>

      {/* TABLE LOGISTIK */}
      <div className="card p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Project</th>
              <th className="pb-2">Total Item</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400">
                  Belum ada data logistik
                </td>
              </tr>
            )}

            {data.map((p) => (
              <tr key={p.project_id} className="border-b last:border-none">
                <td className="py-3">{p.project_id}</td>
                <td className="py-3">{p.totalItem}</td>
                <td className="py-3 font-medium">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
