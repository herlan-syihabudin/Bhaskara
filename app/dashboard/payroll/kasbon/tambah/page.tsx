"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* =====================
   PAGE
===================== */
export default function TambahKasbonPage() {
  const router = useRouter();
  const [karyawan, setKaryawan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isCicilan, setIsCicilan] = useState(true);

  const [form, setForm] = useState({
    karyawan_id: "",
    tanggal: new Date().toISOString().slice(0, 10),
    total_kasbon: "",
    potong_per_payroll: "",
    keterangan: "",
  });

  /* =====================
     LOAD KARYAWAN
  ====================== */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/karyawan");
      const data = await res.json();
      setKaryawan((data || []).filter((x: any) => x.status_kerja === "AKTIF"));
    })();
  }, []);

  /* =====================
     SUBMIT
  ====================== */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      karyawan_id: form.karyawan_id,
      tanggal: form.tanggal,
      total_kasbon: Number(form.total_kasbon),
      keterangan: form.keterangan,
    };

    // jika cicilan
    if (isCicilan) {
      payload.potong_per_payroll = Number(form.potong_per_payroll);
    }

    await fetch("/api/kasbon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    router.push("/dashboard/payroll/kasbon");
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <section className="container-bbm py-12 max-w-xl space-y-6">
      {/* HEADER */}
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Tambah Kasbon</h1>
        <p className="text-body mt-1">
          Catat kasbon karyawan (sekali potong atau cicilan)
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="card p-6 space-y-4">
        {/* KARYAWAN */}
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

        {/* TANGGAL */}
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

        {/* TOTAL */}
        <div>
          <label className="text-sm">Total Kasbon</label>
          <input
            type="number"
            className="form-input mt-1"
            placeholder="500000"
            value={form.total_kasbon}
            onChange={(e) =>
              setForm({ ...form, total_kasbon: e.target.value })
            }
            required
          />
        </div>

        {/* MODE */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            checked={isCicilan}
            onChange={(e) => setIsCicilan(e.target.checked)}
          />
          <span className="text-sm">
            Potong bertahap (cicilan payroll)
          </span>
        </div>

        {/* CICILAN */}
        {isCicilan && (
          <div>
            <label className="text-sm">
              Potong per Payroll
            </label>
            <input
              type="number"
              className="form-input mt-1"
              placeholder="100000"
              value={form.potong_per_payroll}
              onChange={(e) =>
                setForm({
                  ...form,
                  potong_per_payroll: e.target.value,
                })
              }
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Akan dipotong otomatis setiap proses payroll
            </p>
          </div>
        )}

        {/* KETERANGAN */}
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

        {/* ACTION */}
        <div className="flex gap-3 pt-4">
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
