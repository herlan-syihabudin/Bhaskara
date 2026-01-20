"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditKaryawanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/karyawan?id=${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/karyawan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/payroll/karyawan");
  }

  if (!form) return <p className="p-10">Loading...</p>;

  return (
    <section className="container-bbm py-12 max-w-3xl">
      <h1>Edit Karyawan</h1>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6 mt-6">
        <input
          className="form-input"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />

        <input
          className="form-input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <select
          className="form-input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Harian</option>
          <option>Bulanan</option>
        </select>

        <input
          type="number"
          className="form-input"
          value={form.rate}
          onChange={(e) => setForm({ ...form, rate: e.target.value })}
        />

        <select
          className="form-input"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>AKTIF</option>
          <option>NONAKTIF</option>
        </select>

        <textarea
          className="form-input"
          value={form.catatan}
          onChange={(e) => setForm({ ...form, catatan: e.target.value })}
        />

        <div className="flex gap-3">
          <button className="btn-primary">Simpan</button>
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}
