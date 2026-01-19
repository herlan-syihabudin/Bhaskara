import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { headers } from "next/headers";

/* ======================
   FETCH PURCHASING DATA
====================== */
async function getPurchasingData() {
  const h = headers();
  const host = h.get("host");

  if (!host) throw new Error("Host not found");

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/purchasing`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch purchasing data");
  }

  return res.json();
}

export default async function PurchasingPage() {
  const data = await getPurchasingData();

  return (
    <section className="container-bbm py-12 space-y-10">
      <DashboardHeader
        title="Purchasing Dashboard"
        subtitle="Daftar permintaan material dari proyek"
      />

      <div className="card p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Project</th>
              <th className="pb-2">Jumlah Item</th>
              <th className="pb-2">Status</th>
              <th className="pb-2"></th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  Belum ada Material Request
                </td>
              </tr>
            )}

            {data.map((row: any) => (
              <tr
                key={row.project_id}
                className="border-b last:border-none"
              >
                <td className="py-3 font-medium">
                  {row.project_id}
                </td>

                <td className="py-3">
                  {row.jumlahItem} item
                </td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      row.status === "DONE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="py-3">
                  <Link
                    href={`/dashboard/purchasing/${row.project_id}`}
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
