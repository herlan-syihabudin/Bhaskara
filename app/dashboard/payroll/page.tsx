import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

async function getHrSummary() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/hr/summary`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load HR summary");
  return res.json();
}

export default async function HrDashboardPage() {
  const kpi = await getHrSummary();

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          HR
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          HR Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Control panel tenaga kerja
        </p>
      </div>

      {/* KPI SDM */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Karyawan Aktif" value={kpi.totalAktif} />
        <KpiCard title="Karyawan Tetap" value={kpi.totalTetap} />
        <KpiCard title="Karyawan Kontrak" value={kpi.totalKontrak} />
        <KpiCard title="Pekerja Harian" value={kpi.totalHarian} />
      </div>

      {/* ACTION */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/dashboard/payroll/karyawan" className="card p-6 hover:border-black transition">
          👷 Data Karyawan
        </Link>

        <Link href="/dashboard/payroll/absensi" className="card p-6 hover:border-black transition">
          🗓️ Absensi
        </Link>

        <Link href="/dashboard/hr/report" className="card p-6 hover:border-black transition">
          📊 HR Report
        </Link>
      </div>
    </section>
  );
}
