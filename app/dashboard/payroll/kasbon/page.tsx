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

  total_kasbon?: number;
  sisa_kasbon?: number;
  potong_per_payroll?: number;

  jumlah?: number; // legacy
  keterangan?: string;
  status: "BELUM_DIPOTONG" | "DIPOTONG" | string;
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
  const [searchText, setSearchText] = useState("");

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
     HELPERS
  ====================== */
  const isAktif = (s: string) => s === "BELUM_DIPOTONG";
  const uiStatus = (s: string) => (s === "BELUM_DIPOTONG" ? "AKTIF" : "SELESAI");

  const getTotal = (k: Kasbon) =>
    k.total_kasbon ?? k.jumlah ?? 0;

  const getSisa = (k: Kasbon) =>
    k.sisa_kasbon ??
    (k.status === "BELUM_DIPOTONG" ? k.jumlah ?? 0 : 0);

  const isCicilan = (k: Kasbon) =>
    k.total_kasbon !== undefined &&
    k.sisa_kasbon !== undefined &&
    k.potong_per_payroll !== undefined &&
    k.potong_per_payroll > 0;

  /* =====================
     FILTER
  ====================== */
  const filteredKasbon = useMemo(() => {
    let rows = [...kasbon];

    if (statusFilter !== "ALL") {
      rows = rows.filter((r) =>
        statusFilter === "AKTIF"
          ? r.status === "BELUM_DIPOTONG"
          : r.status === "DIPOTONG"
      );
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
     POTONG CICILAN
  ====================== */
  async function potongCicilan(k: Kasbon) {
    if (updating || !isCicilan(k)) return;

    const ok = confirm(
      `Potong kasbon ${k.kasbon_id}\n\nSisa: Rp ${getSisa(k).toLocaleString(
        "id-ID"
      )}\nPotong: Rp ${k.potong_per_payroll!.toLocaleString("id-ID")}`
    );
    if (!ok) return;

    try {
      setUpdating(true);
      await fetch("/api/kasbon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kasbon_id: k.kasbon_id }),
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
          <h1>Kasbon Karyawan</h1>
          <p className="text-body mt-1">
            Kasbon sekali & cicilan payroll
          </p>
        </div>

        <Link
          href="/dashboard/payroll/kasbon/tambah"
          className="btn-primary"
        >
          ➕ Tambah Kasbon
        </Link>
      </div>

      {/* FILTER */}
      <div className="card p-4 flex gap-4">
        <select
          className="form-input w-48"
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
              <th>Progress</th>
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
                const total = getTotal(k);
                const sisa = getSisa(k);
                const pct =
                  total > 0 ? Math.round(((total - sisa) / total) * 100) : 0;

                return (
                  <tr key={k.kasbon_id} className="border-b">
                    <td>{k.tanggal}</td>
                    <td className="font-medium">
                      {emp?.nama} ({k.karyawan_id})
                    </td>
                    <td>Rp {total.toLocaleString("id-ID")}</td>
                    <td className="font-semibold">
                      Rp {sisa.toLocaleString("id-ID")}
                    </td>

                    <td>
                      <div className="w-32">
                        <div className="h-2 bg-gray-200 rounded">
                          <div
                            className="h-2 bg-green-600 rounded"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {pct}%
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          isAktif(k.status)
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {uiStatus(k.status)}
                      </span>
                    </td>

                    <td className="space-x-2">
                      {isAktif(k.status) && (
                        <Link
                          href={`/dashboard/payroll/kasbon/edit/${k.kasbon_id}`}
                          className="text-xs underline text-blue-600"
                        >
                          Edit
                        </Link>
                      )}

                      {isAktif(k.status) && isCicilan(k) && (
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
