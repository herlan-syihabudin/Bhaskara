"use client";

import { useEffect, useState } from "react";

type Mode = "MASUK" | "KELUAR" | "IZIN" | "SAKIT" | "CUTI" | "ALFA";

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: string;
  status_kerja: string;
};

type Proyek = {
  project_id: string;
  project_name: string;
  status: string;
};

export default function AbsensiPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [proyekList, setProyekList] = useState<Proyek[]>([]);

  const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
  const [projectId, setProjectId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================
     LOAD MASTER DATA
  ===================== */
  useEffect(() => {
    fetch("/api/karyawan")
      .then((r) => r.json())
      .then((data) => {
        const aktif = (data || []).filter(
          (k: any) =>
            String(k.status_kerja || "").toUpperCase() === "AKTIF"
        );
        setKaryawanList(aktif);
      })
      .catch(() => setKaryawanList([]));

    const running = (data || []).filter(
  (p: any) =>
    String(p.status || "")
      .trim()
      .toUpperCase() === "RUNNING"
);
      .catch(() => setProyekList([]));
  }, []);

  /* =====================
     ABSEN ACTION
  ===================== */
  async function absen(mode: Mode) {
    if (!karyawan || !projectId) return;

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
          project_id: projectId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mencatat absensi");
      } else {
        setMessage("✅ Absensi berhasil dicatat");
      }
    } catch {
      setError("❌ Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  const canAbsen = Boolean(karyawan && projectId && !loading);

  /* =====================
     UI
  ===================== */
  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Absensi Karyawan</h1>
        <p className="text-body mt-1">
          Nama & proyek wajib sesuai master
        </p>
      </div>

      <div className="card p-6 space-y-6">
        {/* KARYAWAN */}
        <div>
          <label className="text-sm font-medium">Nama Karyawan</label>
          <select
            className="form-input mt-1"
            value={karyawan?.karyawan_id || ""}
            onChange={(e) => {
              const found = karyawanList.find(
                (k) => k.karyawan_id === e.target.value
              );
              setKaryawan(found || null);
            }}
          >
            <option value="">-- pilih nama --</option>
            {karyawanList.map((k) => (
              <option key={k.karyawan_id} value={k.karyawan_id}>
  {k.nama}
</option>
            ))}
          </select>

          {!karyawan && (
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Nama harus terdaftar & aktif di master karyawan
            </p>
          )}
        </div>

        {/* PROYEK */}
        <div>
          <label className="text-sm font-medium">Lokasi Proyek</label>
          <select
            className="form-input mt-1"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">-- pilih proyek --</option>
            {proyekList.map((p) => (
              <option key={p.project_id} value={p.project_id}>
                {p.project_name} ({p.project_id})
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON UTAMA */}
        <div className="flex gap-3">
          <button
            onClick={() => absen("MASUK")}
            disabled={!canAbsen}
            className="btn-primary w-full"
          >
            ⏰ Absen Masuk
          </button>

          <button
            onClick={() => absen("KELUAR")}
            disabled={!canAbsen}
            className="btn-outline w-full"
          >
            🏁 Absen Pulang
          </button>
        </div>

        {/* STATUS */}
        <div className="grid grid-cols-3 gap-3">
          {["IZIN", "SAKIT", "CUTI"].map((m) => (
            <button
              key={m}
              onClick={() => absen(m as Mode)}
              disabled={!canAbsen}
              className="btn-outline"
            >
              {m}
            </button>
          ))}
        </div>

        {/* MESSAGE */}
        {(message || error) && (
          <div
            className={`text-sm p-3 rounded ${
              error
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}
      </div>
    </section>
  );
}
