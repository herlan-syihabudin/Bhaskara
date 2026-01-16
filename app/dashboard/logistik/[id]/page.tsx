"use client";

import { useParams } from "next/navigation";
import {
  getMRByProject,
  markItemDelivered,
} from "@/lib/data/materialRequests";

export default function LogistikPage() {
  const params = useParams<{ id: string }>();
  const mrList = getMRByProject(params.id);

  return (
    <section className="container-bbm py-10 space-y-8">
      <h1 className="text-2xl font-semibold">
        Logistik – Proyek {params.id}
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

            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
              {mr.status}
            </span>
          </div>

          {/* TABLE ITEM */}
          <table className="w-full text-sm table-fixed">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="w-10">No</th>
                <th className="w-[40%]">Material</th>
                <th className="w-16 text-center">Qty</th>
                <th className="w-16">Unit</th>
                <th className="w-28">Status</th>
                <th className="w-24 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {mr.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td className="text-center">{item.qty}</td>
                  <td>{item.unit}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : item.status === "ORDERED"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="text-center">
                    {item.status !== "DELIVERED" && (
                      <button
                        onClick={() =>
                          markItemDelivered(mr.id, i)
                        }
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Tandai Delivered
                      </button>
                    )}
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
