"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type KaryawanType = "HARIAN" | "TETAP" | "KONTRAK";
type StatusKerja = "AKTIF" | "NONAKTIF";

type KaryawanForm = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: KaryawanType;
  rate: number;
  status_kerja: StatusKerja;
  catatan: string;
};

export default function EditKaryawanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<KaryawanForm | null>(null);

  useEffect(() => {
    fetch(`/api/karyawan?id=${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form) return;

    if (form.rate <= 0) {
      alert("Gaji harus lebih dari 0");
      return;
    }

    await fetch("/api/karyawan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/payroll/karyawan");
  }

  if (!form) return <p className="p-10">Loading...</p>;

  return (
    <section className="container-bbm py-12 max-w-3xl space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Edit Karyawan</h1>
        <p className="text-body">
          Perubahan akan memengaruhi absensi & payroll
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <input
          className="form-input"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
          required
        />

        <input
          className="form-input"
          placeholder="Role / Jabatan"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          required
        />

        <select
          className="form-input"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as KaryawanType,
            })
          }
        >
          <option value="HARIAN">Harian</option>
          <option value="TETAP">Tetap</option>
          <option value="KONTRAK">Kontrak</option>
        </select>

        <input
          type="number"
          className="form-input"
          placeholder="Gaji"
          value={form.rate}
          onChange={(e) =>
            setForm({
              ...form,
              rate: Number(e.target.value),
            })
          }
          required
        />

        <select
          className="form-input"
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

        <textarea
          className="form-input"
          placeholder="Catatan"
          value={form.catatan}
          onChange={(e) =>
            setForm({ ...form, catatan: e.target.value })
          }
        />

        <div className="flex gap-3">
          <button className="btn-primary">Simpan</button>
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
