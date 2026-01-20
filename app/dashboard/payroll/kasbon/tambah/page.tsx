"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahKasbonPage() {
  const router = useRouter();
  const [karyawan, setKaryawan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    karyawan_id: "",
    jumlah: "",
    keterangan: "",
    tanggal: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/karyawan");
      const data = await res.json();
      setKaryawan((data || []).filter((x: any) => x.status_kerja === "AKTIF"));
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/kasbon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        jumlah: Number(form.jumlah),
      }),
    });

    setLoading(false);
    router.push("/dashboard/payroll/kasbon");
  }

  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Tambah Kasbon</h1>
        <p className="text-body mt-1">
          Catat pinjaman karyawan
        </p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="text-sm">Karyawan</label>
          <select
            className="form-input mt-1"
            value={form.karyawan_id}
            onChange={(e) =>
              setForm({ ...form, karyawan_id: e.target.value })
            }
            required
          >
            <option value="">-- pilih --</option>
            {karyawan.map((k) => (
              <option key={k.karyawan_id} value={k.karyawan_id}>
                {k.nama} ({k.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Tanggal</label>
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
          <label className="text-sm">Jumlah</label>
          <input
            type="number"
            className="form-input mt-1"
            placeholder="500000"
            value={form.jumlah}
            onChange={(e) =>
              setForm({ ...form, jumlah: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-sm">Keterangan</label>
          <textarea
            className="form-input mt-1"
            placeholder="Kasbon makan / darurat"
            value={form.keterangan}
            onChange={(e) =>
              setForm({ ...form, keterangan: e.target.value })
            }
          />
        </div>

        <div className="flex gap-3 pt-3">
          <button className="btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Kasbon"}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => router.back()}
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}
