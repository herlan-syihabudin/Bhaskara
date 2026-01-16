"use client";

import { useParams } from "next/navigation";
import {
  getMRById,
  updateItemHarga,
  updateItemStatus,
} from "@/lib/data/materialRequests";
import type { MRItemStatus } from "@/lib/data/materialRequests";

export default function PurchasingDetailPage() {
  const params = useParams<{ id: string }>();

  const mr = getMRById(params.id);

  if (!mr) {
    return (
      <section className="container-bbm py-10">
        <p className="text-gray-500">
          Material Request tidak ditemukan
        </p>
      </section>
    );
  }

  return (
    <section className="container-bbm py-10 space-y-8">
      <h1 className="text-2xl font-semibold">
        Purchasing – MR {mr.id}
      </h1>

      {/* HEADER MR */}
      <div className="card p-6 flex justify-between text-sm">
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

      {/* TABLE ITEM */}
      <div className="card p-6">
        <table className="w-full text-sm table-fixed">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="w-10">No</th>
              <th className="w-[35%]">Material</th>
              <th className="w-16 text-center">Qty</th>
              <th className="w-16">Unit</th>
              <th className="w-28">Harga</th>
              <th className="w-28">Total</th>
              <th className="w-32">Status</th>
            </tr>
          </thead>

          <tbody>
            {mr.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td className="text-center">{item.qty}</td>
                <td>{item.unit}</td>

                <td>
                  <input
                    type="number"
                    className="input w-28"
                    value={item.estimasiHarga}
                    min={0}
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
                        e.target.value as MRItemStatus
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
    </section>
  );
}
