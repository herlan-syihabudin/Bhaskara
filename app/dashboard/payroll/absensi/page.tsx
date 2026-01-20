"use client";

import { useState } from "react";

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  tipe: string;
};

export default function AbsensiPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ⚠️ sementara hardcode (nanti ambil dari session / select)
  const karyawan: Karyawan = {
    karyawan_id: "EMP-001",
    nama: "Herlan Syihabudin",
    role: "Staff",
    tipe: "BULANAN",
  };

  async function absen(mode: "MASUK" | "KELUAR") {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          karyawan_id: karyawan.karyawan_id,
          nama: karyawan.nama,
          role: karyawan.role,
          tipe: karyawan.tipe,
          project_id: "PRJ-001",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Terjadi kesalahan");
      } else {
        setMessage(
          mode === "MASUK"
            ? `✅ Absen masuk jam ${data.jam_masuk}`
            : `✅ Absen pulang jam ${data.jam_keluar}`
        );
      }
    } catch (err) {
      setMessage("❌ Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Absensi Karyawan</h1>
        <p className="text-body mt-1">
          Absen masuk & pulang realtime (WIB)
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Nama</p>
          <p className="font-medium">{karyawan.nama}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => absen("MASUK")}
            disabled={loading}
            className="btn-primary w-full"
          >
            ⏰ Absen Masuk
          </button>

          <button
            onClick={() => absen("KELUAR")}
            disabled={loading}
            className="btn-outline w-full"
          >
            🏁 Absen Pulang
          </button>
        </div>

        {message && (
          <div className="text-sm mt-3 p-3 rounded bg-gray-50">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
