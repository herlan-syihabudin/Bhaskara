"use client";

import { useParams, useRouter } from "next/navigation";
import {
  materialRequests,
} from "@/lib/data/materialRequests";

export default function PurchasingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const mr = materialRequests.find((m) => m.id === params.id);

  if (!mr) {
    return <p className="p-10">Material Request tidak ditemukan</p>;
  }

  function updateStatus(status: typeof mr.status) {
    mr.status = status;
    alert(`Status diubah menjadi ${status}`);
    router.push("/dashboard/purchasing");
  }

  const totalEstimasi = mr.items.reduce(
    (acc, i) => acc + i.qty * i.estimasiHarga,
    0
  );

  return (
    <section className="container-bbm py-12 space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          MATERIAL REQUEST DETAIL
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Project: {mr.projectId}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Status: <strong>{mr.status}</strong>
        </p>
      </div>

      {/* ITEMS */}
      <div className="card p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th>Material</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Estimasi</th>
            </tr>
          </thead>

          <tbody>
            {mr.items.map((i, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="py-3">{i.name}</td>
                <td className="py-3">{i.qty}</td>
                <td className="py-3">{i.unit}</td>
                <td className="py-3">
                  Rp {(i.qty * i.estimasiHarga).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="text-sm">
        Total Estimasi:{" "}
        <strong>Rp {totalEstimasi.toLocaleString("id-ID")}</strong>
      </div>

      {/* ACTION */}
      <div className="flex gap-4">
        {mr.status === "SUBMITTED" && (
          <>
            <button
              onClick={() => updateStatus("APPROVED")}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus("REJECTED")}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Reject
            </button>
          </>
        )}

        {mr.status === "APPROVED" && (
          <button
            onClick={() => updateStatus("ORDERED")}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            Order ke Supplier
          </button>
        )}
      </div>
    </section>
  );
}
