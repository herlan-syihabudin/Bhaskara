"use client";

import { useState } from "react";

type Mode = "MASUK" | "KELUAR" | "IZIN" | "SAKIT" | "CUTI";

export default function AbsensiPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
          project_id: "PRJ-001", // opsional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
      } else {
        if (mode === "MASUK") {
          setMessage(`✅ Absen masuk jam ${data.jam}`);
        } else if (mode === "KELUAR") {
          setMessage("✅ Absen pulang berhasil");
        } else {
          setMessage(`✅ ${mode} berhasil dicatat`);
        }
      }
    } catch {
      setError("❌ Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Absensi Karyawan</h1>
        <p className="text-body mt-1">Absensi harian (WIB)</p>
      </div>

      <div className="card p-6 space-y-6">
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

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => absen("IZIN")} className="btn-outline">
            📄 Izin
          </button>
          <button onClick={() => absen("SAKIT")} className="btn-outline">
            🤒 Sakit
          </button>
          <button onClick={() => absen("CUTI")} className="btn-outline">
            🏖️ Cuti
          </button>
        </div>

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
