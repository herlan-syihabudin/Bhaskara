import { projects } from "@/lib/data/projects";
import { statusFromBudget } from "@/lib/engine/budget";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function OwnerDashboardPage() {
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);
  const totalSisa = totalKontrak - totalBiaya;
  const status = statusFromBudget(totalKontrak, totalBiaya);

  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-semibold">Owner Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={projects.length} type="text" />
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya" value={totalBiaya} />
        <KpiCard title="Total Sisa" value={totalSisa} />
        <KpiCard title="Status" type="status" value={status} statusValue={status} />
      </div>

      <ProjectTable projects={projects} />
    </section>
  );
}
