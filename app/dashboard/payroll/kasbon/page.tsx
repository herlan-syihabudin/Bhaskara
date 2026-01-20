"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Kasbon = {
  kasbon_id: string;
  karyawan_id: string;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  status: string;
  payroll_id: string;
};

export default function KasbonPage() {
  const [data, setData] = useState<Kasbon[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/kasbon", { cache: "no-store" });
    const json = await res.json();
    setData(json || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const totalBelum = data
    .filter((x) => x.status === "BELUM_DIPOTONG")
    .reduce((a, b) => a + b.jumlah, 0);

  return (
    <section className="container-bbm py-12 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Kasbon Karyawan</h1>
          <p className="text-body mt-1">
            Pinjaman sementara yang akan dipotong payroll
          </p>
        </div>

        <Link href="/dashboard/payroll/kasbon/tambah" className="btn-primary">
          ➕ Tambah Kasbon
        </Link>
      </div>

      <div className="card p-5">
        <p className="text-sm text-gray-600">
          Total Kasbon Belum Dipotong:
        </p>
        <p className="text-xl font-semibold">
          Rp {totalBelum.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Tanggal</th>
              <th className="text-left">Karyawan</th>
              <th className="text-right">Jumlah</th>
              <th className="text-left">Keterangan</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  Belum ada kasbon
                </td>
              </tr>
            )}

            {data.map((k) => (
              <tr key={k.kasbon_id} className="border-b">
                <td className="py-2">{k.tanggal}</td>
                <td>{k.karyawan_id}</td>
                <td className="text-right">
                  Rp {k.jumlah.toLocaleString("id-ID")}
                </td>
                <td>{k.keterangan}</td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      k.status === "BELUM_DIPOTONG"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {k.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
