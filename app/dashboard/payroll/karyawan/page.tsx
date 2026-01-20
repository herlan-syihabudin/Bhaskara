"use client";

import { useEffect, useMemo, useState } from "react";
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
  status_kerja: "AKTIF" | "NONAKTIF" | "RESIGN";
  tanggal_masuk?: string;
};

export default function KaryawanPage() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    fetch("/api/karyawan", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("fetch error");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Data karyawan gagal dimuat"))
      .finally(() => setLoading(false));
  }, []);

  /* =====================
     FILTER
  ===================== */
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((k) => {
      return (
        (k.nama.toLowerCase().includes(q) ||
          k.role.toLowerCase().includes(q)) &&
        (filterRole ? k.role === filterRole : true) &&
        (filterType ? k.type === filterType : true) &&
        (filterStatus ? k.status_kerja === filterStatus : true)
      );
    });
  }, [data, search, filterRole, filterType, filterStatus]);

  /* =====================
     EXPORT CSV
  ===================== */
  function exportCSV() {
    const header = [
      "ID",
      "Nama",
      "Role",
      "Tipe",
      "Rate",
      "Status Kerja",
      "Tanggal Masuk",
    ];

    const rows = filteredData.map((k) => [
      k.karyawan_id,
      k.nama,
      k.role,
      k.type,
      k.rate,
      k.status_kerja,
      k.tanggal_masuk || "",
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "karyawan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* =====================
     STATE
  ===================== */
  if (loading) {
    return <p className="container-bbm py-12">Loading...</p>;
  }

  if (error) {
    return (
      <p className="container-bbm py-12 text-red-600">
        {error}
      </p>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <section className="container-bbm py-12 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Data Karyawan</h1>
          <p className="text-body">Master data tenaga kerja</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
          >
            ⬇ Export Excel
          </button>

          <Link
            href="/dashboard/payroll/karyawan/tambah"
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
          >
            ＋ Tambah
          </Link>
        </div>
      </div>

      {/* FILTER */}
      <div className="card p-4 grid md:grid-cols-4 gap-3">
        <input
          className="form-input"
          placeholder="Cari nama / role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-input"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">Semua Role</option>
          {[...new Set(data.map((d) => d.role))].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <select
          className="form-input"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Semua Tipe</option>
          <option value="HARIAN">Harian</option>
          <option value="BULANAN">Bulanan</option>
        </select>

        <select
          className="form-input"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="AKTIF">Aktif</option>
          <option value="NONAKTIF">Nonaktif</option>
          <option value="RESIGN">Resign</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th>Tipe</th>
              <th>Masuk</th>
              <th className="text-right">Rate</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((k) => (
              <tr key={k.karyawan_id} className="border-b">
                <td className="font-medium">{k.nama}</td>
                <td>{k.role}</td>
                <td className="text-center">{k.type}</td>
                <td className="text-center">{k.tanggal_masuk || "-"}</td>
                <td className="text-right">
                  Rp {k.rate.toLocaleString("id-ID")}
                </td>
                <td className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      k.status_kerja === "AKTIF"
                        ? "bg-green-100 text-green-700"
                        : k.status_kerja === "NONAKTIF"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {k.status_kerja}
                  </span>
                </td>
                <td className="text-right space-x-2">
                  <Link
                    href={`/dashboard/payroll/karyawan/${k.karyawan_id}/absensi`}
                    className="text-xs text-blue-600"
                  >
                    Absensi
                  </Link>
                  <Link
                    href={`/dashboard/payroll/karyawan/${k.karyawan_id}/cuti`}
                    className="text-xs text-purple-600"
                  >
                    Cuti
                  </Link>
                  <Link
                    href={`/dashboard/payroll/karyawan/edit/${k.karyawan_id}`}
                    className="text-xs text-gray-600"
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
