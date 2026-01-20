"use client";

import { useState } from "react";

type Mode =
  | "MASUK"
  | "KELUAR"
  | "IZIN"
  | "SAKIT"
  | "ALFA"
  | "CUTI";

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  tipe: string;
};

export default function AbsensiPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ⚠️ SEMENTARA HARDCODE
  // nanti ganti dari session / auth
  const karyawan: Karyawan = {
    karyawan_id: "EMP-001",
    nama: "Herlan Syihabudin",
    role: "Staff",
    tipe: "BULANAN",
  };

  async function absen(mode: Mode) {
    setLoading(true);
    setMessage("");
    setError("");

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
        setError(data.error || "Terjadi kesalahan");
      } else {
        // response dari API absensi
        if (mode === "MASUK") {
          setMessage(
            data.status?.startsWith("TELAT")
              ? `⚠️ Absen masuk TELAT (${data.status.replace("TELAT_", "")})`
              : `✅ Absen masuk jam ${data.status}`
          );
        } else if (mode === "KELUAR") {
          setMessage("✅ Absen pulang berhasil");
        } else {
          setMessage(`✅ Absen ${mode} berhasil dicatat`);
        }
      }
    } catch (err) {
      setError("❌ Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      {/* HEADER */}
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Absensi Karyawan</h1>
        <p className="text-body mt-1">
          Sistem absensi realtime (WIB)
        </p>
      </div>

      {/* CARD */}
      <div className="card p-6 space-y-6">
        {/* INFO KARYAWAN */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Nama</p>
            <p className="font-medium">{karyawan.nama}</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium">{karyawan.role}</p>
          </div>
        </div>

        {/* ABSEN MASUK / KELUAR */}
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

        {/* MODE KHUSUS */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => absen("IZIN")}
            disabled={loading}
            className="btn-outline"
          >
            📄 Izin
          </button>

          <button
            onClick={() => absen("SAKIT")}
            disabled={loading}
            className="btn-outline"
          >
            🤒 Sakit
          </button>

          <button
            onClick={() => absen("CUTI")}
            disabled={loading}
            className="btn-outline"
          >
            🏖️ Cuti
          </button>

          <button
            onClick={() => absen("ALFA")}
            disabled={loading}
            className="btn-danger"
          >
            ❌ Alfa
          </button>
        </div>

        {/* MESSAGE */}
        {(message || error) && (
          <div
            className={`text-sm p-3 rounded ${
              error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}
      </div>
    </section>
  );
}
