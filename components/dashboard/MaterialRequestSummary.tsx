"use client";

import Link from "next/link";
import { MaterialRequest } from "@/lib/data/materialRequests";

export default function MaterialRequestSummary({
  projectId,
  mrList,
}: {
  projectId: string;
  mrList: MaterialRequest[];
}) {
  if (mrList.length === 0) {
    return (
      <div className="card p-6 text-sm text-gray-500">
        Belum ada material request untuk proyek ini
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-4">
      <h3 className="font-semibold">Material Request</h3>

      <table className="w-full text-sm table-fixed">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="w-32">Tanggal</th>
            <th className="w-32">Requester</th>
            <th className="w-24 text-center">Item</th>
            <th className="w-36">Total Estimasi</th>
            <th className="w-32">Status</th>
            <th className="w-24 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {mrList.map((mr) => {
            const total = mr.items.reduce(
              (sum, i) => sum + i.qty * i.estimasiHarga,
              0
            );

            return (
              <tr key={mr.id} className="border-b">
                <td>
                  {new Date(mr.createdAt).toLocaleDateString(
                    "id-ID"
                  )}
                </td>

                <td>{mr.requester}</td>

                <td className="text-center">
                  {mr.items.length}
                </td>

                <td className="font-medium">
                  {total > 0
                    ? `Rp ${total.toLocaleString("id-ID")}`
                    : "—"}
                </td>

                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium
                      ${
                        mr.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : mr.status === "ORDERED"
                          ? "bg-blue-100 text-blue-700"
                          : mr.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {mr.status}
                  </span>
                </td>

                <td className="text-center">
                  <Link
                    href={`/dashboard/material-request/${mr.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Detail →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ACTION */}
      <div className="pt-4">
        <Link
          href={`/dashboard/projects/${projectId}/request-material`}
          className="inline-flex px-4 py-2 text-sm rounded bg-black text-white"
        >
          + Request Material
        </Link>
      </div>
    </div>
  );
}
