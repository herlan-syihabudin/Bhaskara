"use client";

import { useState } from "react";

export default function GeneratePayrollPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectId, setProjectId] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!startDate || !endDate) {
      setError("Tanggal awal & akhir wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/payroll/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          periode: `${startDate} s/d ${endDate}`,
          project_id: projectId || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Gagal generate payroll");
      }

      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-bbm py-12 max-w-3xl space-y-8">
      {/* HEADER */}
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Generate Penggajian</h1>
        <p className="text-body mt-1">
          Hitung gaji otomatis dari absensi + kasbon
        </p>
      </div>

      {/* FORM */}
      <div className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Tanggal Mulai</label>
            <input
              type="date"
              className="form-input mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tanggal Akhir</label>
            <input
              type="date"
              className="form-input mt-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Project ID (opsional)
            </label>
            <input
              className="form-input mt-1"
              placeholder="PRJ-001"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "⏳ Menghitung Payroll..." : "💰 Generate Payroll"}
        </button>

        {/* ERROR */}
        {error && (
          <div className="text-sm bg-red-50 text-red-700 p-3 rounded">
            ❌ {error}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="text-sm bg-green-50 text-green-800 p-4 rounded space-y-2">
            <p className="font-medium">✅ Payroll berhasil digenerate</p>
            <p>Periode: {result.periode}</p>
            <p>Total Karyawan: {result.total_karyawan}</p>
          </div>
        )}
      </div>

      {/* NOTE */}
      <div className="text-xs text-gray-500">
        💡 Catatan:
        <ul className="list-disc ml-4 mt-1">
          <li>Kasbon otomatis dipotong</li>
          <li>Status payroll default <b>UNPAID</b></li>
          <li>Data tersimpan di Google Sheet PAYROLL</li>
        </ul>
      </div>
    </section>
  );
}
