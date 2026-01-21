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
  total_kasbon: number;
  sisa_kasbon: number;
  potong_per_payroll: number;
  keterangan: string;
  status: "AKTIF" | "SELESAI" | string;
  payroll_id: string;
  created_at: string;
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
  const [updating, setUpdating] = useState(false);

  // FILTER
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "AKTIF" | "SELESAI">("ALL");
  const [searchText, setSearchText] = useState("");

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

      setKasbon(await kasbonRes.json());
      setKaryawan(await karyawanRes.json());
    } catch (e) {
      console.error(e);
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
     MAP KARYAWAN
  ====================== */
  const karyawanMap = useMemo(() => {
    const m = new Map<string, Karyawan>();
    karyawan.forEach((k) => m.set(k.karyawan_id, k));
    return m;
  }, [karyawan]);

  /* =====================
     FILTERED DATA
  ====================== */
  const filteredKasbon = useMemo(() => {
    let rows = [...kasbon];

    if (statusFilter !== "ALL") {
      rows = rows.filter((r) => r.status === statusFilter);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      rows = rows.filter((r) => {
        const nama = karyawanMap.get(r.karyawan_id)?.nama || "";
        return (
          r.karyawan_id.toLowerCase().includes(q) ||
          nama.toLowerCase().includes(q) ||
          (r.keterangan || "").toLowerCase().includes(q)
        );
      });
    }

    return rows.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
  }, [kasbon, statusFilter, searchText, karyawanMap]);

  /* =====================
     KPI
  ====================== */
  const totalSisaKasbon = useMemo(
    () => filteredKasbon.reduce((s, r) => s + Number(r.sisa_kasbon || 0), 0),
    [filteredKasbon]
  );

  /* =====================
     ACTION: POTONG CICILAN
  ====================== */
  async function potongCicilan(row: Kasbon) {
    if (updating) return;

    const ok = confirm(
      `Potong kasbon ${row.kasbon_id}\n\nSisa: Rp ${row.sisa_kasbon.toLocaleString(
        "id-ID"
      )}\nPotong: Rp ${row.potong_per_payroll.toLocaleString("id-ID")}`
    );
    if (!ok) return;

    try {
      setUpdating(true);
      await fetch("/api/kasbon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kasbon_id: row.kasbon_id,
          action: "CICIL",
        }),
      });

      await loadAll();
    } catch (e) {
      alert("Gagal memotong kasbon");
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
      <div className="flex justify-between items-center">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Kasbon Karyawan (Cicilan)</h1>
          <p className="text-body mt-1">
            Kasbon dipotong bertahap otomatis melalui payroll
          </p>
        </div>

        <Link href="/dashboard/payroll/kasbon/tambah" className="btn-primary">
          ➕ Tambah Kasbon
        </Link>
      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs text-gray-500">Total Sisa Kasbon</p>
          <p className="text-2xl font-semibold">
            Rp {totalSisaKasbon.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500">Jumlah Transaksi</p>
          <p className="text-2xl font-semibold">
            {filteredKasbon.length}
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <select
          className="form-input md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="ALL">Semua Status</option>
          <option value="AKTIF">Aktif</option>
          <option value="SELESAI">Selesai</option>
        </select>

        <input
          className="form-input flex-1"
          placeholder="Cari nama / ID / keterangan..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button onClick={loadAll} className="btn-outline">
          🔄 Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th>Tanggal</th>
              <th>Karyawan</th>
              <th>Total</th>
              <th>Sisa</th>
              <th>Cicilan / Payroll</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-10 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              filteredKasbon.map((k) => {
                const emp = karyawanMap.get(k.karyawan_id);
                return (
                  <tr key={k.kasbon_id} className="border-b">
                    <td>{k.tanggal}</td>
                    <td className="font-medium">
                      {emp?.nama} ({k.karyawan_id})
                    </td>
                    <td>
                      Rp {k.total_kasbon.toLocaleString("id-ID")}
                    </td>
                    <td className="font-semibold">
                      Rp {k.sisa_kasbon.toLocaleString("id-ID")}
                    </td>
                    <td>
                      Rp {k.potong_per_payroll.toLocaleString("id-ID")}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          k.status === "AKTIF"
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {k.status}
                      </span>
                    </td>
                    <td>
                      {k.status === "AKTIF" && (
                        <button
                          className="text-xs underline text-green-700"
                          onClick={() => potongCicilan(k)}
                          disabled={updating}
                        >
                          Potong 1x
                        </button>
                      )}
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
