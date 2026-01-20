"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* =====================
   TYPES
===================== */
type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: string;
  rate: number;
  status: string;
};

/* =====================
   PAGE
===================== */
export default function KaryawanPage() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/karyawan", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data karyawan");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError("Data karyawan gagal dimuat");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* =====================
     STATES
  ===================== */
  if (loading) {
    return (
      <section className="container-bbm py-12">
        <p className="text-gray-500">Loading data karyawan...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container-bbm py-12">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Data Karyawan</h1>
          <p className="text-body mt-1">
            Tukang harian, mandor, dan staff kantor
          </p>
        </div>

        <Link
          href="/dashboard/payroll/karyawan/tambah"
          className="btn-primary"
        >
          ➕ Tambah Karyawan
        </Link>
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Tipe</th>
              <th className="py-3 px-4 text-right">Rate</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  Belum ada data karyawan
                </td>
              </tr>
            )}

            {data.map((k) => (
              <tr
                key={k.karyawan_id}
                className="border-b last:border-none"
              >
                <td className="px-4 py-3 font-medium">
                  {k.nama}
                </td>

                <td className="px-4 py-3">
                  {k.role}
                </td>

                <td className="px-4 py-3 text-center">
                  {k.type}
                </td>

                <td className="px-4 py-3 text-right">
                  Rp {Number(k.rate || 0).toLocaleString("id-ID")}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      k.status === "AKTIF"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {k.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/payroll/karyawan/edit/${k.karyawan_id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
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
