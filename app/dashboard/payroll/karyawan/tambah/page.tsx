"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type KaryawanType = "HARIAN" | "TETAP" | "KONTRAK";
type StatusKerja = "AKTIF" | "NONAKTIF";

export default function TambahKaryawanPage() {
  const router = useRouter();

  const [form, setForm] = useState<{
    nama: string;
    role: string;
    type: KaryawanType;
    rate: number;
    status_kerja: StatusKerja;
    catatan: string;
  }>({
    nama: "",
    role: "",
    type: "HARIAN",
    rate: 0,
    status_kerja: "AKTIF",
    catatan: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // VALIDASI LOGIKA DASAR
    if (form.rate <= 0) {
      alert("Gaji harus lebih dari 0");
      return;
    }

    await fetch("/api/karyawan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/payroll/karyawan");
  }

  return (
    <section className="container-bbm py-12 space-y-8 max-w-3xl">
      {/* HEADER */}
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Tambah Karyawan</h1>
        <p className="text-body mt-1">
          Data ini digunakan untuk absensi dan payroll
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nama */}
          <div>
            <label className="text-sm font-medium">Nama Karyawan</label>
            <input
              className="form-input mt-1"
              placeholder="Contoh: Budi Santoso"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role / Jabatan</label>
            <input
              className="form-input mt-1"
              placeholder="Tukang / Mandor / Staff"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium">Tipe Karyawan</label>
            <select
              className="form-input mt-1"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as KaryawanType })
              }
            >
              <option value="HARIAN">Harian</option>
              <option value="TETAP">Tetap</option>
              <option value="KONTRAK">Kontrak</option>
            </select>
          </div>

          {/* Rate */}
          <div>
            <label className="text-sm font-medium">
              Gaji{" "}
              {form.type === "HARIAN"
                ? "per Hari"
                : "per Bulan"}
            </label>
            <input
              type="number"
              className="form-input mt-1"
              placeholder="Contoh: 150000"
              value={form.rate}
              onChange={(e) =>
                setForm({ ...form, rate: Number(e.target.value) })
              }
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status Kerja</label>
            <select
              className="form-input mt-1"
              value={form.status_kerja}
              onChange={(e) =>
                setForm({
                  ...form,
                  status_kerja: e.target.value as StatusKerja,
                })
              }
            >
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium">
              Catatan (Opsional)
            </label>
            <textarea
              className="form-input mt-1 min-h-[90px]"
              placeholder="Keterangan tambahan…"
              value={form.catatan}
              onChange={(e) =>
                setForm({ ...form, catatan: e.target.value })
              }
            />
          </div>
        </div>

        {/* ACTION */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary">
            Simpan Karyawan
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
