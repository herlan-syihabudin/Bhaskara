import { projects } from "@/lib/data/projects";
import { statusFromBudget } from "@/lib/engine/budget";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function PurchasingDashboardPage() {
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);
  const totalSisa = totalKontrak - totalBiaya;

  // Purchasing fokus ke exposure → pakai status global
  const status = statusFromBudget(totalKontrak, totalBiaya);

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PURCHASING
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Purchasing Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitoring komitmen biaya dan potensi risiko pengadaan
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={projects.length} type="text" />
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya Real" value={totalBiaya} />
        <KpiCard title="Sisa Komitmen" value={totalSisa} />
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
          Proyek Aktif
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Digunakan untuk monitoring kebutuhan pengadaan dan kontrol biaya
        </p>

        <ProjectTable projects={projects} />
      </div>
    </section>
  );
}
