"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* =====================
   TYPES
===================== */
type Kasbon = {
  kasbon_id: string;
  karyawan_id: string;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  status: "BELUM_DIPOTONG" | "DIPOTONG" | string;
  payroll_id: string;
};

/* =====================
   PAGE
===================== */
export default function KasbonPage() {
  const [data, setData] = useState<Kasbon[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadKasbon() {
    try {
      setLoading(true);
      const res = await fetch("/api/kasbon", { cache: "no-store" });
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error("LOAD KASBON ERROR", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKasbon();
  }, []);

  const totalBelumDipotong = data
    .filter((k) => k.status === "BELUM_DIPOTONG")
    .reduce((sum, k) => sum + Number(k.jumlah || 0), 0);

  return (
    <section className="container-bbm py-12 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Kasbon Karyawan</h1>
          <p className="text-body mt-1">
            Pinjaman sementara yang otomatis dipotong saat payroll
          </p>
        </div>

        <Link
          href="/dashboard/payroll/kasbon/tambah"
          className="btn-primary"
        >
          ➕ Tambah Kasbon
        </Link>
      </div>

      {/* KPI */}
      <div className="card p-5">
        <p className="text-sm text-gray-500">
          Total Kasbon Belum Dipotong
        </p>
        <p className="text-2xl font-semibold mt-1">
          Rp {totalBelumDipotong.toLocaleString("id-ID")}
        </p>
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-3 px-3">Tanggal</th>
              <th className="text-left px-3">Karyawan</th>
              <th className="text-right px-3">Jumlah</th>
              <th className="text-left px-3">Keterangan</th>
              <th className="text-center px-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  Belum ada data kasbon
                </td>
              </tr>
            )}

            {!loading &&
              data.map((k) => (
                <tr
                  key={k.kasbon_id}
                  className="border-b last:border-none"
                >
                  <td className="py-3 px-3">{k.tanggal}</td>

                  <td className="px-3 font-medium">
                    {k.karyawan_id}
                  </td>

                  <td className="px-3 text-right">
                    Rp {Number(k.jumlah).toLocaleString("id-ID")}
                  </td>

                  <td className="px-3">
                    {k.keterangan || "-"}
                  </td>

                  <td className="px-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        k.status === "BELUM_DIPOTONG"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
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
