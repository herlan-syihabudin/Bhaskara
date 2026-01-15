// app/dashboard/finance/page.tsx
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { projects } from "@/lib/data/projects";
import { statusFromBudget } from "@/lib/engine/budget";

export default function FinanceDashboardPage() {
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);
  const totalSisa = totalKontrak - totalBiaya;

  const status = statusFromBudget(totalKontrak, totalBiaya);

  return (
    <section className="container-bbm py-12 space-y-12">
      <DashboardHeader
        title="Finance Dashboard"
        subtitle="Kontrol biaya, kontrak, dan kondisi keuangan proyek"
      />

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya Keluar" value={totalBiaya} />
        <KpiCard title="Total Sisa Budget" value={totalSisa} />
        <KpiCard
          title="Status Keuangan"
          type="status"
          statusValue={status}
          value={status}
        />
      </div>

      {/* TABLE */}
      <ProjectTable projects={projects} />
    </section>
  );
}
