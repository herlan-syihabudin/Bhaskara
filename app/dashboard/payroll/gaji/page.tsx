"use client";

import { useEffect, useMemo, useState } from "react";

type Karyawan = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: "HARIAN" | "BULANAN" | string;
  rate: number;
  status: "AKTIF" | "NONAKTIF" | string;
};

type Absensi = {
  absensi_id: string;
  tanggal: string; // yyyy-mm-dd
  karyawan_id: string;
  nama: string;
  role: string;
  tipe: string;
  project_id: string;
  jam_masuk: string;
  jam_keluar: string;
};

type RowPreview = {
  karyawan_id: string;
  nama: string;
  role: string;
  type: string;
  qty_hari: number;
  rate: number;
  lembur_jam: number;
  lembur: number;
  potongan: number;
  total: number;
  project_id: string;
};

function toISODateOnly(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function monthKey(isoDate: string) {
  return (isoDate || "").slice(0, 7); // yyyy-mm
}

function withinRange(dateStr: string, start: string, end: string) {
  // string compare safe for yyyy-mm-dd
  return dateStr >= start && dateStr <= end;
}

export default function GenerateGajiPage() {
  const today = new Date();
  const defaultStart = useMemo(() => {
    // default: awal bulan ini
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return toISODateOnly(d);
  }, []);
  const defaultEnd = useMemo(() => toISODateOnly(today), []);

  const [periode, setPeriode] = useState<"DUA_MINGGU" | "BULANAN" | "CUSTOM">(
    "BULANAN"
  );
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [projectId, setProjectId] = useState("");

  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);

  const [preview, setPreview] = useState<RowPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // helper: set range otomatis dari pilihan periode
  useEffect(() => {
    const now = new Date();
    if (periode === "BULANAN") {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(toISODateOnly(s));
      setEndDate(toISODateOnly(e));
    }
    if (periode === "DUA_MINGGU") {
      // 14 hari terakhir
      const e = new Date();
      const s = new Date();
      s.setDate(e.getDate() - 13);
      setStartDate(toISODateOnly(s));
      setEndDate(toISODateOnly(e));
    }
    // CUSTOM biarin manual
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periode]);

  async function loadMaster() {
    const [kRes] = await Promise.all([fetch("/api/karyawan", { cache: "no-store" })]);
    if (!kRes.ok) throw new Error("Gagal load master karyawan");
    const kJson = await kRes.json();
    setKaryawan(kJson);
  }

  async function loadAbsensi() {
    // API kamu pakai month=yyyy-mm, jadi kita ambil month dari startDate
    // (kalau range lintas bulan, sementara ambil 2 bulan: start & end)
    const m1 = monthKey(startDate);
    const m2 = monthKey(endDate);
    const months = Array.from(new Set([m1, m2])).filter(Boolean);

    const all: Absensi[] = [];
    for (const m of months) {
      const url = new URL("/api/absensi", window.location.origin);
      url.searchParams.set("month", m);
      if (projectId.trim()) url.searchParams.set("project_id", projectId.trim());

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal load absensi");
      const json = await res.json();
      all.push(...json);
    }

    // filter range yang tepat (start-end)
    const filtered = all.filter((a) => withinRange(a.tanggal, startDate, endDate));
    setAbsensi(filtered);
  }

  async function handleHitung() {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      await loadMaster();
      await loadAbsensi();

      // map absensi per karyawan_id
      const mapHari: Record<string, number> = {};
      absensi.forEach((a) => {
        if (!a.karyawan_id) return;
        mapHari[a.karyawan_id] = (mapHari[a.karyawan_id] || 0) + 1;
      });

      // hanya karyawan AKTIF
      const aktif = karyawan.filter((k) => (k.status || "").toUpperCase() === "AKTIF");

      const rows: RowPreview[] = aktif.map((k) => {
        const qty = mapHari[k.karyawan_id] || 0;
        const rate = Number(k.rate || 0);

        const lembur_jam = 0;
        const lembur = 0;
        const potongan = 0;

        const total =
          String(k.type).toUpperCase() === "HARIAN"
            ? qty * rate + lembur - potongan
            : rate + lembur - potongan;

        return {
          karyawan_id: k.karyawan_id,
          nama: k.nama,
          role: k.role,
          type: k.type,
          qty_hari: qty,
          rate,
          lembur_jam,
          lembur,
          potongan,
          total,
          project_id: projectId.trim() || "-",
        };
      });

      setPreview(rows);
      setInfo(`Preview siap: ${rows.length} karyawan`);
    } catch (e: any) {
      setError(e?.message || "Gagal hitung payroll");
    } finally {
      setLoading(false);
    }
  }

  async function handleSimpan() {
    setSaving(true);
    setError(null);
    setInfo(null);

    try {
      if (preview.length === 0) throw new Error("Preview masih kosong. Klik Hitung dulu.");

      const payload = {
        startDate,
        endDate,
        periode: `${startDate}..${endDate}`,
        project_id: projectId.trim() || "",
        rows: preview,
      };

      const res = await fetch("/api/payroll/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal simpan payroll");

      setInfo(`✅ Berhasil simpan ${json.inserted} baris ke PAYROLL`);
    } catch (e: any) {
      setError(e?.message || "Gagal simpan payroll");
    } finally {
      setSaving(false);
    }
  }

  const totalPreview = useMemo(() => {
    return preview.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  }, [preview]);

  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Generate Penggajian</h1>
          <p className="text-body mt-1">
            Hitung otomatis dari Absensi + Master Karyawan, lalu simpan ke sheet PAYROLL
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="card p-6 space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Periode</label>
            <select
              className="form-input mt-1"
              value={periode}
              onChange={(e) => setPeriode(e.target.value as any)}
            >
              <option value="DUA_MINGGU">2 Mingguan (14 hari)</option>
              <option value="BULANAN">Bulanan (bulan ini)</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Dari Tanggal</label>
            <input
              type="date"
              className="form-input mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={periode !== "CUSTOM" ? false : false}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sampai Tanggal</label>
            <input
              type="date"
              className="form-input mt-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Project ID (opsional)</label>
            <input
              className="form-input mt-1"
              placeholder="PRJ-001"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleHitung} className="btn-primary" disabled={loading}>
            {loading ? "Menghitung..." : "🔄 Hitung Payroll"}
          </button>
          <button onClick={handleSimpan} className="btn-outline" disabled={saving || preview.length === 0}>
            {saving ? "Menyimpan..." : "💾 Simpan ke PAYROLL"}
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600">
            ❌ {error}
          </div>
        )}
        {info && (
          <div className="text-sm text-green-700">
            {info}
          </div>
        )}
      </div>

      {/* PREVIEW */}
      <div className="card overflow-x-auto">
        <div className="p-5 border-b flex items-center justify-between">
          <p className="font-medium">Preview Payroll</p>
          <p className="text-sm text-gray-600">
            Total: <b>Rp {totalPreview.toLocaleString("id-ID")}</b>
          </p>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-center">Tipe</th>
              <th className="px-4 py-3 text-center">Hari</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {preview.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Klik <b>Hitung Payroll</b> untuk melihat preview.
                </td>
              </tr>
            )}

            {preview.map((r) => (
              <tr key={r.karyawan_id} className="border-b last:border-none">
                <td className="px-4 py-3 font-medium">{r.nama}</td>
                <td className="px-4 py-3">{r.role}</td>
                <td className="px-4 py-3 text-center">{r.type}</td>
                <td className="px-4 py-3 text-center">{r.qty_hari}</td>
                <td className="px-4 py-3 text-right">
                  Rp {Number(r.rate || 0).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-right">
                  Rp {Number(r.total || 0).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOTE */}
      <div className="text-sm text-gray-600">
        💡 Catatan: untuk lembur & potongan masih default 0. Nanti kita tambah input modal/edit inline.
      </div>
    </section>
  );
}
