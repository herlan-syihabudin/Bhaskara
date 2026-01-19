import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

/* =====================
   FETCH PAYROLL SUMMARY
===================== */
async function getPayrollSummary() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/payroll/payroll-summary`,
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
      <h1 className="text-2xl font-semibold">Payroll Management</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Karyawan" value={kpi.totalKaryawan} />
        <KpiCard title="Hadir Bulan Ini" value={kpi.hadirBulanIni} />
        <KpiCard
          title="Total Gaji Bulan Ini"
          value={`Rp ${kpi.totalGaji.toLocaleString("id-ID")}`}
        />
        <KpiCard
          title="Belum Dibayar"
          value={`Rp ${kpi.belumDibayar.toLocaleString("id-ID")}`}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/dashboard/payroll/karyawan" className="card p-6">
          👷 Data Karyawan
        </Link>
        <Link href="/dashboard/payroll/absensi" className="card p-6">
          🗓️ Absensi
        </Link>
        <Link href="/dashboard/payroll/gaji" className="card p-6">
          💰 Penggajian
        </Link>
      </div>
    </section>
  );
}
