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
        <div
          key={mr.id}
          className="card p-6 space-y-4"
        >
          {/* HEADER MR */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-medium">
                Requester: {mr.requester}
              </p>
              {mr.catatan && (
                <p className="text-sm text-gray-500">
                  Catatan: {mr.catatan}
                </p>
              )}
              <p className="text-xs text-gray-400">
                Dibuat:{" "}
                {new Date(mr.createdAt).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded font-medium
                ${
                  mr.status === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : mr.status === "ORDERED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {mr.status}
            </span>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm table-fixed">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="w-10">No</th>
                <th className="w-[35%]">Material</th>
                <th className="w-20 text-center">Qty</th>
                <th className="w-20">Unit</th>
                <th className="w-32">Status</th>
                <th className="w-32 text-center">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {mr.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td className="text-center">
                    {item.qty}
                  </td>
                  <td>{item.unit}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded
                        ${
                          item.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "ORDERED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="text-center">
                    {item.status === "ORDERED" ? (
                      <button
                        onClick={() =>
                          markItemDelivered(
                            mr.id,
                            i
                          )
                        }
                        className="px-3 py-1 text-xs rounded bg-black text-white hover:opacity-90"
                      >
                        Tandai Delivered
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        —
                      </span>
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
