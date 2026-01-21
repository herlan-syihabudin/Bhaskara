"use client";

import { useEffect, useState } from "react";

type Mode = "MASUK" | "KELUAR" | "IZIN" | "SAKIT" | "CUTI";

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: string;
  status: string;
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
        setKaryawanList(
          (data || []).filter(
            (k: any) => String(k.status).toUpperCase() === "AKTIF"
          )
        );
      });

    fetch("/api/proyek")
      .then((r) => r.json())
      .then((data) => {
        setProyekList(
          (data || []).filter(
            (p: any) => String(p.status).toUpperCase() === "RUNNING"
          )
        );
      });
  }, []);

  /* =====================
     ABSEN
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
        setError(data.error || "Terjadi kesalahan");
      } else {
        setMessage("✅ Absensi berhasil dicatat");
      }
    } catch {
      setError("❌ Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  const canAbsen = !!karyawan && !!projectId && !loading;

  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Absensi Karyawan</h1>
        <p className="text-body mt-1">Absensi harian (WIB)</p>
      </div>

      <div className="card p-6 space-y-6">
        {/* PILIH KARYAWAN */}
        <div>
          <label className="text-sm font-medium">Nama Karyawan</label>
          <select
            className="form-input mt-1"
            value={karyawan?.karyawan_id || ""}
            onChange={(e) => {
              const k = karyawanList.find(
                (x) => x.karyawan_id === e.target.value
              );
              setKaryawan(k || null);
            }}
          >
            <option value="">-- pilih nama --</option>
            {karyawanList.map((k) => (
              <option key={k.karyawan_id} value={k.karyawan_id}>
                {k.nama} ({k.role} - {k.type})
              </option>
            ))}
          </select>

          {!karyawan && (
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Nama harus terdaftar di master karyawan
            </p>
          )}
        </div>

        {/* PILIH PROYEK */}
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

        {/* BUTTON */}
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

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => absen("IZIN")}
            disabled={!canAbsen}
            className="btn-outline"
          >
            📄 Izin
          </button>
          <button
            onClick={() => absen("SAKIT")}
            disabled={!canAbsen}
            className="btn-outline"
          >
            🤒 Sakit
          </button>
          <button
            onClick={() => absen("CUTI")}
            disabled={!canAbsen}
            className="btn-outline"
          >
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
