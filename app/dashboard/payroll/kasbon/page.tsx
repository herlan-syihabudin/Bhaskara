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
};

/* =====================
   PAGE
===================== */
export default function KasbonPage() {
  const [kasbon, setKasbon] = useState<Kasbon[]>([]);
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "AKTIF" | "SELESAI">("ALL");

  /* =====================
     LOAD DATA
  ====================== */
  async function loadAll() {
    try {
      setLoading(true);
      const [kRes, eRes] = await Promise.all([
        fetch("/api/kasbon", { cache: "no-store" }),
        fetch("/api/karyawan", { cache: "no-store" }),
      ]);

      setKasbon(await kRes.json());
      setKaryawan(await eRes.json());
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
     MAP NAMA
  ====================== */
  const karyawanMap = useMemo(() => {
    const m = new Map<string, string>();
    karyawan.forEach((k) => m.set(k.karyawan_id, k.nama));
    return m;
  }, [karyawan]);

  /* =====================
     FILTER
  ====================== */
  const rows = useMemo(() => {
    let r = [...kasbon];
    if (statusFilter !== "ALL") {
      r = r.filter((x) => x.status === statusFilter);
    }
    return r.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
  }, [kasbon, statusFilter]);

  /* =====================
     KPI
  ====================== */
  const totalSisa = useMemo(
    () => rows.reduce((s, r) => s + Number(r.sisa_kasbon || 0), 0),
    [rows]
  );

  /* =====================
     CICIL MANUAL (STEP 1)
  ====================== */
  async function potongSekali(row: Kasbon) {
    if (updating) return;

    const ok = confirm(
      `Potong kasbon ${row.kasbon_id}\n\nSisa saat ini: Rp ${row.sisa_kasbon.toLocaleString(
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
            Kasbon dipotong bertahap otomatis saat payroll
          </p>
        </div>

        <Link href="/dashboard/payroll/kasbon/tambah" className="btn-primary">
          ➕ Tambah Kasbon
        </Link>
      </div>

      {/* KPI */}
      <div className="card p-5">
        <p className="text-xs text-gray-500">Total Sisa Kasbon Aktif</p>
        <p className="text-2xl font-semibold">
          Rp {totalSisa.toLocaleString("id-ID")}
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <select
          className="form-input w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="ALL">Semua</option>
          <option value="AKTIF">Aktif</option>
          <option value="SELESAI">Selesai</option>
        </select>

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
              rows.map((r) => (
                <tr key={r.kasbon_id} className="border-b">
                  <td>{r.tanggal}</td>
                  <td className="font-medium">
                    {karyawanMap.get(r.karyawan_id)} ({r.karyawan_id})
                  </td>
                  <td>
                    Rp {r.total_kasbon.toLocaleString("id-ID")}
                  </td>
                  <td className="font-semibold">
                    Rp {r.sisa_kasbon.toLocaleString("id-ID")}
                  </td>
                  <td>
                    Rp {r.potong_per_payroll.toLocaleString("id-ID")}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "AKTIF"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === "AKTIF" && (
                      <button
                        className="text-xs underline text-green-700"
                        onClick={() => potongSekali(r)}
                        disabled={updating}
                      >
                        Potong 1x
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
