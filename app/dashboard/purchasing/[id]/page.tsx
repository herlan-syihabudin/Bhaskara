"use client";

import { useParams } from "next/navigation";
import {
  getMRByProject,
  updateItemHarga,
  updateItemStatus,
} from "@/lib/data/materialRequests";
import type { MRStatus } from "@/lib/data/materialRequests";

export default function PurchasingPage() {
  const params = useParams<{ id: string }>();
  const mrList = getMRByProject(params.id);

  return (
    <section className="container-bbm py-10 space-y-8">
      <h1 className="text-2xl font-semibold">
        Purchasing – Proyek {params.id}
      </h1>

      {mrList.length === 0 && (
        <p className="text-gray-500">
          Belum ada Material Request
        </p>
      )}

      {mrList.map((mr) => (
        <div key={mr.id} className="card p-6 space-y-4">
          {/* HEADER MR */}
          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium">
                Requester: {mr.requester}
              </p>
              {mr.catatan && (
                <p className="text-gray-500">
                  Catatan: {mr.catatan}
                </p>
              )}
            </div>

            <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
              {mr.status}
            </span>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm table-fixed">
            <thead className="border-b text-gray-500">
              <tr>
                <th>No</th>
                <th>Material</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Harga</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {mr.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.unit}</td>

                  <td>
                    <input
                      type="number"
                      className="input w-28"
                      value={item.estimasiHarga}
                      onChange={(e) =>
                        updateItemHarga(
                          mr.id,
                          i,
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td className="font-medium">
                    Rp{" "}
                    {(item.qty * item.estimasiHarga).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    <select
                      className="input w-32"
                      value={item.status}
                      onChange={(e) =>
                        updateItemStatus(
                          mr.id,
                          i,
                          e.target.value as MRStatus
                        )
                      }
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="ORDERED">ORDERED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
