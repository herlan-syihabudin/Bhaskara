// /app/(dash)/dashboard/page.tsx
import { projects } from "@/lib/dummy/projectBudget";
import type { ProjectBudget } from "@/lib/dummy/projectBudget";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

/* ===============================
   SUMMARY CALCULATOR (OWNER)
================================ */
function getSummary(projects: ProjectBudget[]) {
  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
  };
}

export default function OwnerDashboardPage() {
  const summary = getSummary(projects);

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* HEADER */}
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase mb-2">
          OWNER DASHBOARD
        </p>

        <h1 className="text-3xl font-semibold">Dashboard Proyek</h1>

        <p className="mt-2 text-sm text-gray-500">
          Ringkasan seluruh proyek berjalan beserta kondisi biaya dan kontrak.
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={summary.totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={summary.totalKontrak} />
        <KpiCard title="Total Biaya" value={summary.totalBiaya} />
        <KpiCard title="Total Sisa" value={summary.totalSisa} />
      </div>

      {/* TABLE */}
      <ProjectTable projects={projects} />
    </section>
  );
}
