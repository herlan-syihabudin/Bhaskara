"use client";

import { useEffect, useMemo, useState } from "react";
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

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role?: string;
};

/* =====================
   PAGE
===================== */
export default function KasbonPage() {
  const [kasbon, setKasbon] = useState<Kasbon[]>([]);
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATE
  const [statusFilter, setStatusFilter] = useState<"ALL" | "BELUM_DIPOTONG" | "DIPOTONG">("ALL");
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // DETAIL MODAL
  const [selected, setSelected] = useState<Kasbon | null>(null);
  const [updating, setUpdating] = useState(false);

  /* =====================
     LOAD DATA
  ====================== */
  async function loadAll() {
    try {
      setLoading(true);

      const [kasbonRes, karyawanRes] = await Promise.all([
        fetch("/api/kasbon", { cache: "no-store" }),
        fetch("/api/karyawan", { cache: "no-store" }),
      ]);

      const kasbonJson = await kasbonRes.json();
      const karyawanJson = await karyawanRes.json();

      setKasbon(Array.isArray(kasbonJson) ? kasbonJson : []);
      setKaryawan(Array.isArray(karyawanJson) ? karyawanJson : []);
    } catch (e) {
      console.error("LOAD KASBON/KARYAWAN ERROR", e);
      setKasbon([]);
      setKaryawan([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  /* =====================
     DERIVED: MAP NAMA
  ====================== */
  const karyawanMap = useMemo(() => {
    const m = new Map<string, Karyawan>();
    karyawan.forEach((k) => {
      if (k.karyawan_id) m.set(k.karyawan_id, k);
    });
    return m;
  }, [karyawan]);

  /* =====================
     FILTERED DATA
  ====================== */
  const filteredKasbon = useMemo(() => {
    let rows = [...kasbon];

    // status filter
    if (statusFilter !== "ALL") {
      rows = rows.filter((k) => (k.status || "").toUpperCase() === statusFilter);
    }

    // date range
    if (dateFrom) {
      rows = rows.filter((k) => !k.tanggal || k.tanggal >= dateFrom);
    }
    if (dateTo) {
      rows = rows.filter((k) => !k.tanggal || k.tanggal <= dateTo);
    }

    // search (di karyawan_id / nama / keterangan)
    const q = searchText.trim().toLowerCase();
    if (q) {
      rows = rows.filter((k) => {
        const nama = karyawanMap.get(k.karyawan_id)?.nama || "";
        return (
          k.karyawan_id.toLowerCase().includes(q) ||
          nama.toLowerCase().includes(q) ||
          (k.keterangan || "").toLowerCase().includes(q)
        );
      });
    }

    // sort terbaru di atas
    rows.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

    return rows;
  }, [kasbon, statusFilter, dateFrom, dateTo, searchText, karyawanMap]);

  const totalBelumDipotong = useMemo(
    () =>
      kasbon
        .filter((k) => (k.status || "").toUpperCase() === "BELUM_DIPOTONG")
        .reduce((sum, k) => sum + Number(k.jumlah || 0), 0),
    [kasbon]
  );

  const totalFiltered = useMemo(
    () => filteredKasbon.reduce((sum, k) => sum + Number(k.jumlah || 0), 0),
    [filteredKasbon]
  );

  /* =====================
     ACTION: MARK DIPOTONG
  ====================== */
  async function markAsDipotong(row: Kasbon) {
    if (updating) return;
    const ok = window.confirm(
      `Tandai kasbon ${row.kasbon_id} milik ${row.karyawan_id} sebagai sudah DIPOTONG?`
    );
    if (!ok) return;

    try {
      setUpdating(true);
      const res = await fetch("/api/kasbon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kasbon_id: row.kasbon_id,
          status: "DIPOTONG",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json?.error || "Gagal update kasbon");
        return;
      }

      await loadAll();
      setSelected(null);
    } catch (e) {
      console.error("MARK DIPOTONG ERROR", e);
      alert("Terjadi kesalahan saat update kasbon");
    } finally {
      setUpdating(false);
    }
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <section className="container-bbm py-12 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Kasbon Karyawan</h1>
          <p className="text-body mt-1">
            Pinjaman karyawan yang akan dipotong otomatis saat proses payroll.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={loadAll} className="btn-outline">
            🔄 Refresh
          </button>
          <Link href="/dashboard/payroll/kasbon/tambah" className="btn-primary">
            ➕ Tambah Kasbon
          </Link>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs text-gray-500">Total Kasbon Belum Dipotong</p>
          <p className="text-2xl font-semibold mt-1">
            Rp {totalBelumDipotong.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500">Total Kasbon (sesuai filter)</p>
          <p className="text-2xl font-semibold mt-1">
            Rp {totalFiltered.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500">Jumlah Transaksi (sesuai filter)</p>
          <p className="text-2xl font-semibold mt-1">{filteredKasbon.length}</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="card p-4 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            className="form-input mt-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">Semua</option>
            <option value="BELUM_DIPOTONG">Belum Dipotong</option>
            <option value="DIPOTONG">Sudah Dipotong</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Cari Karyawan / Keterangan</label>
          <input
            className="form-input mt-1"
            placeholder="Nama / ID karyawan / keterangan..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Dari Tanggal</label>
          <input
            type="date"
            className="form-input mt-1"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Sampai Tanggal</label>
          <input
            type="date"
            className="form-input mt-1"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
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
              <th className="text-center px-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filteredKasbon.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Tidak ada kasbon sesuai filter
                </td>
              </tr>
            )}

            {!loading &&
              filteredKasbon.map((k) => {
                const kData = karyawanMap.get(k.karyawan_id);
                const namaLabel = kData ? `${kData.nama} (${k.karyawan_id})` : k.karyawan_id;

                return (
                  <tr key={k.kasbon_id} className="border-b last:border-none">
                    <td className="py-3 px-3 whitespace-nowrap">{k.tanggal}</td>

                    <td className="px-3 font-medium">{namaLabel}</td>

                    <td className="px-3 text-right whitespace-nowrap">
                      Rp {Number(k.jumlah).toLocaleString("id-ID")}
                    </td>

                    <td className="px-3 max-w-xs truncate" title={k.keterangan}>
                      {k.keterangan || "-"}
                    </td>

                    <td className="px-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
                          (k.status || "").toUpperCase() === "BELUM_DIPOTONG"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {k.status || "-"}
                      </span>
                      {k.payroll_id && (
                        <div className="mt-1 text-[10px] text-gray-500">
                          payroll: {k.payroll_id}
                        </div>
                      )}
                    </td>

                    <td className="px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="text-xs underline text-gray-700"
                          onClick={() => setSelected(k)}
                        >
                          Detail
                        </button>

                          {(k.status || "").toUpperCase() === "BELUM_DIPOTONG" && (
                          <button
                            type="button"
                            className="text-xs text-green-700 underline"
                            onClick={() => markAsDipotong(k)}
                            disabled={updating}
                          >
                            Tandai Dipotong
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Detail Kasbon</h2>
              <button
                className="text-sm text-gray-500 hover:text-black"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <DetailRow label="ID Kasbon" value={selected.kasbon_id} />
              <DetailRow label="Tanggal" value={selected.tanggal} />
              <DetailRow
                label="Karyawan"
                value={
                  karyawanMap.get(selected.karyawan_id)?.nama
                    ? `${karyawanMap.get(selected.karyawan_id)?.nama} (${selected.karyawan_id})`
                    : selected.karyawan_id
                }
              />
              <DetailRow
                label="Jumlah"
                value={`Rp ${Number(selected.jumlah).toLocaleString("id-ID")}`}
              />
              <DetailRow label="Keterangan" value={selected.keterangan || "-"} />
              <DetailRow label="Status" value={selected.status || "-"} />
              <DetailRow label="Payroll ID" value={selected.payroll_id || "-"} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="btn-outline text-sm"
                onClick={() => setSelected(null)}
              >
                Tutup
              </button>

              {(selected.status || "").toUpperCase() === "BELUM_DIPOTONG" && (
                <button
                  className="btn-primary text-sm"
                  onClick={() => markAsDipotong(selected)}
                  disabled={updating}
                >
                  {updating ? "Memproses..." : "Tandai Sudah Dipotong"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =====================
   SMALL COMPONENT
===================== */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
