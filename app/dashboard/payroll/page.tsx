import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

/* =====================
   FETCH PAYROLL SUMMARY
===================== */
async function getPayrollSummary() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const res = await fetch(
    `${baseUrl}/api/payroll/payroll-summary`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load payroll summary");
  }

  return res.json();
}

/* =====================
   PAGE
===================== */
export default async function PayrollPage() {
  const { kpi } = await getPayrollSummary();

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
          Kelola tukang, staff, absensi, dan pembayaran gaji
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Karyawan"
          value={kpi.totalKaryawan}
        />
        <KpiCard
          title="Hadir Bulan Ini"
          value={kpi.hadirBulanIni}
        />
        <KpiCard
          title="Total Gaji Bulan Ini"
          value={`Rp ${kpi.totalGaji.toLocaleString("id-ID")}`}
        />
        <KpiCard
          title="Belum Dibayar"
          value={`Rp ${kpi.belumDibayar.toLocaleString("id-ID")}`}
        />
      </div>

      {/* ACTION */}
      <div className="grid md:grid-cols-3 gap-6">
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
          href="/dashboard/payroll/gaji"
          className="card p-6 hover:border-black transition"
        >
          💰 Penggajian
        </Link>
      </div>
    </section>
  );
}
