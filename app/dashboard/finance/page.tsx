import { projects } from "@/lib/data/projects";
import { statusFromBudget } from "@/lib/engine/budget";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function FinanceDashboardPage() {
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);
  const totalSisa = totalKontrak - totalBiaya;
  const status = statusFromBudget(totalKontrak, totalBiaya);

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          FINANCE
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Finance Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan kondisi keuangan seluruh proyek
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={projects.length} type="text" />
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya" value={totalBiaya} />
        <KpiCard title="Total Sisa" value={totalSisa} />
        <KpiCard
          title="Status Risiko"
          type="status"
          value={status}
          statusValue={status}
        />
      </div>

      {/* PROJECT TABLE */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Ringkasan Proyek
        </h2>
        <ProjectTable projects={projects} />
      </div>
    </section>
  );
}
