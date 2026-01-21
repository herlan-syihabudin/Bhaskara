"use client";

import { useState } from "react";

type PreviewRow = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: string;
  gaji_bruto: number;
  potongan_kasbon: number;
  total: number;
};

export default function GeneratePayrollPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectId, setProjectId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    periode: string;
    total_karyawan: number;
    rows: PreviewRow[];
  } | null>(null);

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
          periode: `${startDate} s.d ${endDate}`,
          project_id: projectId || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Gagal generate payroll");

      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Generate Payroll</h1>
        <p className="text-body mt-1">
          Payroll massal otomatis + potongan kasbon
        </p>
      </div>

      {/* FORM */}
      <div className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm">Tanggal Mulai</label>
            <input
              type="date"
              className="form-input mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Tanggal Akhir</label>
            <input
              type="date"
              className="form-input mt-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Project ID (opsional)</label>
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

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
            ❌ {error}
          </div>
        )}
      </div>

      {/* PREVIEW RESULT */}
      {result && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">
            Preview Payroll – {result.periode}
          </h2>

          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th>Nama</th>
                <th>Role</th>
                <th>Tipe</th>
                <th className="text-right">Gaji Bruto</th>
                <th className="text-right">Kasbon</th>
                <th className="text-right">Total Dibayar</th>
              </tr>
            </thead>

            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i} className="border-b">
                  <td>{r.nama}</td>
                  <td>{r.role}</td>
                  <td>{r.type}</td>
                  <td className="text-right">
                    Rp {r.gaji_bruto.toLocaleString("id-ID")}
                  </td>
                  <td className="text-right text-red-600">
                    - Rp {r.potongan_kasbon.toLocaleString("id-ID")}
                  </td>
                  <td className="text-right font-semibold">
                    Rp {r.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-gray-500">
            💡 Kasbon otomatis dipotong dan dicatat ke payroll
          </div>
        </div>
      )}
    </section>
  );
}
