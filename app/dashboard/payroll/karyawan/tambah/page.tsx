"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahKaryawanPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    role: "",
    tipe: "HARIAN",
    rate: "",
    status: "AKTIF",
    keterangan: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/karyawan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/payroll/karyawan");
  }

  return (
    <section className="max-w-4xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">➕ Tambah Karyawan</h1>
        <p className="text-sm text-gray-500">
          Input data karyawan untuk kebutuhan absensi & payroll
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Nama */}
        <div>
          <label className="label">Nama Karyawan</label>
          <input
            className="input"
            placeholder="Contoh: Budi Santoso"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="label">Role / Jabatan</label>
          <input
            className="input"
            placeholder="Tukang / Mandor / Staff"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          />
        </div>

        {/* Tipe */}
        <div>
          <label className="label">Tipe Karyawan</label>
          <select
            className="input"
            value={form.tipe}
            onChange={(e) => setForm({ ...form, tipe: e.target.value })}
          >
            <option value="HARIAN">Harian</option>
            <option value="BULANAN">Bulanan</option>
          </select>
        </div>

        {/* Rate */}
        <div>
          <label className="label">
            Upah / Gaji ({form.tipe === "HARIAN" ? "per Hari" : "per Bulan"})
          </label>
          <input
            type="number"
            className="input"
            placeholder="Contoh: 150000"
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="AKTIF">Aktif</option>
            <option value="NONAKTIF">Nonaktif</option>
          </select>
        </div>

        {/* Keterangan */}
        <div className="md:col-span-2">
          <label className="label">Keterangan (Opsional)</label>
          <textarea
            className="input min-h-[80px]"
            placeholder="Catatan tambahan..."
            value={form.keterangan}
            onChange={(e) =>
              setForm({ ...form, keterangan: e.target.value })
            }
          />
        </div>

        {/* ACTION */}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            💾 Simpan Karyawan
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border"
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}
