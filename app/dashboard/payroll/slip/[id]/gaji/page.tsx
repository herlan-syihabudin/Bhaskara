"use client";

import Link from "next/link";

type Payroll = {
  payroll_id: string;
  nama: string;
  role: string;
  periode: string;
  total: number;
  status: string;
};

export default function PayrollTable({
  data,
}: {
  data: Payroll[];
}) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="text-left py-3 px-4">Nama</th>
            <th className="text-left px-4">Role</th>
            <th className="text-center px-4">Periode</th>
            <th className="text-right px-4">Total</th>
            <th className="text-center px-4">Status</th>
            <th className="text-center px-4">Slip</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr
              key={p.payroll_id}
              className="border-b last:border-none"
            >
              <td className="px-4 py-3 font-medium">
                {p.nama}
              </td>
              <td className="px-4">{p.role}</td>
              <td className="px-4 text-center">
                {p.periode}
              </td>
              <td className="px-4 text-right">
                Rp {Number(p.total || 0).toLocaleString("id-ID")}
              </td>
              <td className="px-4 text-center">
                <span
                  className={`badge ${
                    p.status === "UNPAID"
                      ? "badge-warning"
                      : "badge-success"
                  }`}
                >
                  {p.status}
                </span>
              </td>

              {/* 🔥 TOMBOL SLIP */}
              <td className="px-4 text-center">
                <Link
                  href={`/dashboard/payroll/slip/${p.payroll_id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  🧾 Lihat Slip
                </Link>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-8 text-center text-gray-400"
              >
                Belum ada data payroll
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
