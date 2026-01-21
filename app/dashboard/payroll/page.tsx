import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

/* =====================
   FETCHERS
===================== */
async function getKaryawan() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/karyawan`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load karyawan");
  return res.json();
}

async function getPayrollSummary() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/payroll/payroll-summary`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load payroll summary");
  return res.json();
}

async function getKasbonSummary() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/kasbon?status=BELUM_DIPOTONG`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { totalKasbon: 0, totalOrang: 0 };
  }

  const data = await res.json();

  const totalKasbon = data.reduce(
    (acc: number, k: any) =>
      acc + Number(k.sisa_kasbon ?? k.jumlah ?? 0),
    0
  );

  const uniq = new Set(data.map((k: any) => k.karyawan_id));

  return {
    totalKasbon,
    totalOrang: uniq.size,
  };
}

/* =====================
   PAGE
===================== */
export default async function PayrollPage() {
  const [karyawan, payroll, kasbon] = await Promise.all([
    getKaryawan(),
    getPayrollSummary(),
    getKasbonSummary(),
  ]);

  const { kpi } = payroll;

  /* =====================
     NORMALIZE KARYAWAN
  ====================== */
  const aktif = karyawan.filter(
    (k: any) => (k.status_kerja || "").toUpperCase() === "AKTIF"
  );

  const normalizeType = (t?: string) => {
    const v = (t || "").toUpperCase();
    if (v === "HARIAN") return "HARIAN";
    if (v === "KONTRAK") return "KONTRAK";
    if (v === "TETAP" || v === "BULANAN") return "TETAP";
    return "UNKNOWN";
  };

  const totalAktif = aktif.length;
  const totalHarian = aktif.filter((k: any) => normalizeType(k.type) === "HARIAN").length;
  const totalKontrak = aktif.filter((k: any) => normalizeType(k.type) === "KONTRAK").length;
  const totalTetap = aktif.filter((k: any) => normalizeType(k.type) === "TETAP").length;

  /* =====================
     RENDER
  ====================== */
  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          HR & PAYROLL
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Payroll Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola karyawan, absensi, kasbon, dan penggajian
        </p>
      </div>

      {/* ALERT KASBON */}
      {kasbon.totalKasbon > 0 && (
        <div className="card border-l-4 border-yellow-500 bg-yellow-50 p-4 text-sm">
          ⚠️ Terdapat <b>{kasbon.totalOrang}</b> karyawan dengan kasbon aktif
          sebesar{" "}
          <b>Rp {kasbon.totalKasbon.toLocaleString("id-ID")}</b>.  
          Kasbon akan otomatis dipotong saat proses payroll.
        </div>
      )}

      {/* KPI SDM */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Karyawan Aktif" value={totalAktif} />
        <KpiCard title="Karyawan Tetap" value={totalTetap} />
        <KpiCard title="Karyawan Kontrak" value={totalKontrak} />
        <KpiCard title="Pekerja Harian" value={totalHarian} />
      </div>

      {/* KPI PAYROLL */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Total Gaji Periode Ini"
          value={kpi.totalGaji}
          type="money"
        />
        <KpiCard
          title="Belum Dibayar"
          value={kpi.belumDibayar}
          type="money"
        />
        <KpiCard
          title="Kasbon Aktif"
          value={kasbon.totalKasbon}
          subtitle={`${kasbon.totalOrang} karyawan`}
          type="money"
        />
      </div>

      {/* QUICK ACTION */}
      <div className="grid md:grid-cols-4 gap-6">
        <Link
          href="/dashboard/payroll/karyawan"
          className="card p-6 hover:border-black transition"
        >
          👷 Data Karyawan
        </Link>

        <Link
          href="/dashboard/payroll/absensi"
          className="card p-6 hover:border-black transition"
        >
          🗓️ Absensi
        </Link>

        <Link
          href="/dashboard/payroll/kasbon"
          className="card p-6 hover:border-black transition"
        >
          💸 Kasbon
        </Link>

        <Link
          href="/dashboard/payroll/gaji"
          className="card p-6 border-2 border-dashed hover:border-black transition"
        >
          💰 Penggajian
        </Link>
      </div>

      {/* QUICK PAYROLL */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-lg">Quick Payroll Action</h3>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/payroll/gaji/process" className="btn-primary">
            ▶ Proses Payroll
          </Link>

          <Link href="/dashboard/payroll/gaji" className="btn-outline">
            📄 Rekap Payroll
          </Link>

          <Link href="/dashboard/payroll/gaji/export" className="btn-outline">
            📤 Export Payroll CSV
          </Link>
        </div>
      </div>
    </section>
  );
}
