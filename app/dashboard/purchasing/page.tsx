import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { materialRequests } from "@/lib/data/materialRequests";

export default function PurchasingPage() {
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
              <th className="pb-2">Tanggal</th>
              <th className="pb-2">Project</th>
              <th className="pb-2">Jumlah Item</th>
              <th className="pb-2">Status</th>
              <th className="pb-2"></th>
            </tr>
          </thead>

          <tbody>
            {materialRequests.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-400"
                >
                  Belum ada Material Request
                </td>
              </tr>
            )}

            {materialRequests.map((mr) => (
              <tr key={mr.id} className="border-b last:border-none">
                <td className="py-3">
                  {new Date(mr.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="py-3">{mr.projectId}</td>
                <td className="py-3">{mr.items.length}</td>
                <td className="py-3 font-medium">{mr.status}</td>
                <td className="py-3">
                  <Link
                    href={`/dashboard/purchasing/${mr.id}`}
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
