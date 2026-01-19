import KpiCard from "@/components/dashboard/KpiCard";
import { headers } from "next/headers";
import Link from "next/link";

/* =====================
   FETCH LOGISTIK API
===================== */
async function getLogistikSummary() {
  const h = headers();
  const host = h.get("host");
  if (!host) throw new Error("Host header not found");

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/logistik`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch logistik summary");
  }

  return res.json();
}

/* =====================
   PAGE
===================== */
export default async function LogistikDashboardPage() {
  const data = await getLogistikSummary();

  const totalProyek = data.length;
  const onDelivery = data.filter(
    (d: any) => d.status === "ON DELIVERY"
  ).length;
  const received = data.filter(
    (d: any) => d.status === "RECEIVED"
  ).length;

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          LOGISTIK
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Logistik Dashboard
        </h1>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="On Delivery" value={onDelivery} type="text" />
        <KpiCard title="Received" value={received} type="text" />
        <KpiCard title="Status Logistik" value="ON TRACK" type="text" />
      </div>

      {/* TABLE */}
      <div className="card p-6">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2 text-left">Project</th>
              <th className="py-2 text-center">Total Item</th>
              <th className="py-2 text-center">Status</th>
              <th className="py-2 text-right">Last Update</th>
              <th className="py-2 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-400"
                >
                  Belum ada data logistik
                </td>
              </tr>
            )}

            {data.map((p: any) => (
              <tr key={p.project_id} className="border-b last:border-none">
                <td className="py-3 font-medium">
                  {p.project_id}
                </td>

                <td className="py-3 text-center">
                  {p.totalItem}
                </td>

                <td className="py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium
                      ${
                        p.status === "ON DELIVERY"
                          ? "bg-blue-100 text-blue-700"
                          : p.status === "RECEIVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="py-3 text-right text-gray-500">
                  {p.lastUpdate || "-"}
                </td>

                <td className="py-3 text-right">
                  <Link
                    href={`/dashboard/logistik/${p.project_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
