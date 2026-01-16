// app/dashboard/finance/page.tsx
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import UsedPctBar from "@/components/dashboard/UsedPctBar";
import { getFinanceSummary } from "@/lib/summary/financeSummary";

export default function FinancePage() {
  const s = getFinanceSummary();

  return (
    <section className="container-bbm py-12 space-y-12">
      <DashboardHeader
        title="Finance Dashboard"
        subtitle="Ringkasan keuangan seluruh proyek"
      />

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Kontrak" value={s.totalKontrak} />
        <KpiCard title="Total Biaya" value={s.totalBiaya} />
        <KpiCard title="Sisa Dana" value={s.totalSisa} />
        <KpiCard
          title="Status Keuangan"
          type="status"
          statusValue={s.status}
        />
      </div>

      {/* PROGRESS */}
      <UsedPctBar value={s.avgUsedPct} status={s.status} />
    </section>
  );
}
