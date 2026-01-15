import { projectBudgets, getBudgetSummary } from "@/lib/dummy/projectBudget";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function OwnerDashboardPage() {
  const summary = getBudgetSummary();

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Dashboard Proyek</h1>
        <p className="text-sm text-gray-500">
          Ringkasan seluruh proyek berjalan
        </p>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={summary.totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={summary.totalKontrak} />
        <KpiCard title="Total Biaya" value={summary.totalBiaya} />
        <KpiCard title="Total Sisa" value={summary.totalSisa} />
      </div>

      {/* PROJECT LIST */}
      <ProjectTable projects={projectBudgets} />
    </section>
  );
}
