"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahKaryawanPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    role: "",
    type: "HARIAN",
    rate: "",
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
    <section className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Tambah Karyawan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Nama Karyawan"
          className="input"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
        />

        <input
          placeholder="Role (Tukang / Mandor / Staff)"
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />

        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="HARIAN">Harian</option>
          <option value="BULANAN">Bulanan</option>
        </select>

        <input
          placeholder="Upah / Gaji"
          type="number"
          className="input"
          value={form.rate}
          onChange={(e) => setForm({ ...form, rate: e.target.value })}
          required
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          Simpan
        </button>
      </form>
    </section>
  );
}
