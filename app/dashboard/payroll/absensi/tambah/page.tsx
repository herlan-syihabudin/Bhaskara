"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "IZIN" | "SAKIT" | "CUTI" | "ALFA";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TambahAbsensiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [karyawanList, setKaryawanList] = useState<any[]>([]);
  const [form, setForm] = useState({
    tanggal: todayISO(),
    project_id: "PRJ-001",
    karyawan_id: "",
    nama: "",
    role: "",
    tipe: "",
    mode: "IZIN" as Mode,
    catatan: "",
  });

  /* =====================
     LOAD KARYAWAN AKTIF
  ===================== */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/karyawan");
      const data = await res.json();
      setKaryawanList(
        (data || []).filter(
          (x: any) => x.status?.toUpperCase() === "AKTIF"
        )
      );
    })();
  }, []);

  function pickKaryawan(id: string) {
    const k = karyawanList.find((x) => x.karyawan_id === id);
    if (!k) return;

    setForm((prev) => ({
      ...prev,
      karyawan_id: k.karyawan_id,
      nama: k.nama,
      role: k.role,
      tipe: k.type || k.tipe || "",
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan absensi");
        return;
      }

      router.push("/dashboard/payroll/absensi");
    } catch {
      setError("Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-bbm py-12 space-y-8 max-w-3xl">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Input Absensi Manual</h1>
        <p className="text-body mt-1">
          Untuk izin, sakit, cuti, atau alfa (admin)
        </p>
      </div>

      <form onSubmit={submit} className="card p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Tanggal</label>
            <input
              type="date"
              className="form-input mt-1"
              value={form.tanggal}
              onChange={(e) =>
                setForm({ ...form, tanggal: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Project ID</label>
            <input
              className="form-input mt-1"
              value={form.project_id}
              onChange={(e) =>
                setForm({ ...form, project_id: e.target.value })
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Pilih Karyawan (Aktif)
            </label>
            <select
              className="form-input mt-1"
              value={form.karyawan_id}
              onChange={(e) => pickKaryawan(e.target.value)}
              required
            >
              <option value="">-- pilih --</option>
              {karyawanList.map((k) => (
                <option key={k.karyawan_id} value={k.karyawan_id}>
                  {k.nama} ({k.role} - {k.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Status Absensi</label>
            <select
              className="form-input mt-1"
              value={form.mode}
              onChange={(e) =>
                setForm({ ...form, mode: e.target.value as Mode })
              }
            >
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="CUTI">CUTI</option>
              <option value="ALFA">ALFA</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Catatan</label>
            <input
              className="form-input mt-1"
              value={form.catatan}
              onChange={(e) =>
                setForm({ ...form, catatan: e.target.value })
              }
              placeholder="Opsional"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}
