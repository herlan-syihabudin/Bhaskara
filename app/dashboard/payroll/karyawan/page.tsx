"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* =====================
   TYPES
===================== */
type StatusKerja = "AKTIF" | "NONAKTIF" | "RESIGN";
type TipeKaryawan = "HARIAN" | "BULANAN";

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: TipeKaryawan | string;
  rate: number;
  status_kerja: StatusKerja | string;
  tanggal_masuk?: string;
  catatan?: string;
};

function csvEscape(v: any) {
  const s = String(v ?? "");
  // escape quotes, wrap with quotes if contains comma/newline/quote
  const need = /[",\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return need ? `"${escaped}"` : escaped;
}

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
    let alive = true;

    fetch("/api/karyawan", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("fetch error");
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        setData(Array.isArray(json) ? json : []);
      })
      .catch(() => {
        if (!alive) return;
        setError("Data karyawan gagal dimuat");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  /* =====================
     FILTER
  ===================== */
  const roles = useMemo(() => {
    return [...new Set(data.map((d) => (d.role || "").trim()).filter(Boolean))].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((k) => {
      const nama = (k.nama || "").toLowerCase();
      const role = (k.role || "").toLowerCase();

      const matchSearch = q ? nama.includes(q) || role.includes(q) : true;
      const matchRole = filterRole ? k.role === filterRole : true;
      const matchType = filterType ? k.type === filterType : true;
      const matchStatus = filterStatus ? k.status_kerja === filterStatus : true;

      return matchSearch && matchRole && matchType && matchStatus;
    });
  }, [data, search, filterRole, filterType, filterStatus]);

  /* =====================
     EXPORT CSV (Excel-safe)
  ===================== */
  function exportCSV() {
    const header = [
      "karyawan_id",
      "nama",
      "role",
      "type",
      "rate_default",
      "status_kerja",
      "tanggal_masuk",
      "catatan",
    ];

    const rows = filteredData.map((k) => [
      k.karyawan_id,
      k.nama,
      k.role,
      k.type,
      k.rate,
      k.status_kerja,
      k.tanggal_masuk || "",
      k.catatan || "",
    ]);

    // Add BOM for Excel UTF-8
    const csv =
      "\uFEFF" +
      [header, ...rows]
        .map((r) => r.map(csvEscape).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `karyawan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* =====================
     STATE
  ===================== */
  if (loading) return <p className="container-bbm py-12">Loading...</p>;
  if (error) return <p className="container-bbm py-12 text-red-600">{error}</p>;

  /* =====================
     UI
  ===================== */
  return (
    <section className="container-bbm py-12 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Data Karyawan</h1>
          <p className="text-body">Master data tenaga kerja</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="btn-outline">
            ⬇ Export
          </button>

          <Link href="/dashboard/payroll/karyawan/tambah" className="btn-primary">
            ＋ Tambah Karyawan
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

        <select className="form-input" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">Semua Role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select className="form-input" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Semua Tipe</option>
          <option value="HARIAN">Harian</option>
          <option value="BULANAN">Bulanan</option>
        </select>

        <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
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
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-center">Tipe</th>
              <th className="px-4 py-3 text-center">Masuk</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  Data tidak ditemukan
                </td>
              </tr>
            )}

            {filteredData.map((k) => {
              const status = (k.status_kerja || "AKTIF") as StatusKerja;

              const badge =
                status === "AKTIF"
                  ? "bg-green-100 text-green-700"
                  : status === "NONAKTIF"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700";

              return (
                <tr key={k.karyawan_id} className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium">{k.nama}</td>
                  <td className="px-4 py-3">{k.role}</td>
                  <td className="px-4 py-3 text-center">{k.type}</td>
                  <td className="px-4 py-3 text-center">{k.tanggal_masuk || "-"}</td>
                  <td className="px-4 py-3 text-right">Rp {Number(k.rate || 0).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>{status}</span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/dashboard/payroll/karyawan/${k.karyawan_id}`} className="text-xs text-blue-600 hover:underline">
                      Detail
                    </Link>
                    <Link href={`/dashboard/payroll/karyawan/edit/${k.karyawan_id}`} className="text-xs text-gray-600 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
