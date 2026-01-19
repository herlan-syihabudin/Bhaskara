import { useEffect, useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import { statusFromBudget } from "@/lib/engine/budget";

export default function PMDashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/project-summary")
      .then(res => res.json())
      .then(data => setProjects(data.projects || []));
  }, []);

  const totalProyek = projects.length;

  const proyekAktif = projects.filter(
    (p) => p.biayaReal < p.nilaiKontrak
  );

  const proyekRisiko = proyekAktif.filter(
    (p) => statusFromBudget(p.nilaiKontrak, p.biayaReal) !== "AMAN"
  );

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PROJECT MANAGER
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          PM Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kontrol progres biaya & risiko proyek berjalan
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Proyek Aktif" value={proyekAktif.length} type="text" />
        <KpiCard title="Proyek Risiko" value={proyekRisiko.length} type="text" />
        <KpiCard title="Fokus Hari Ini" value="Kontrol Biaya" type="text" />
      </div>

      {/* PROJECT LIST */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Proyek Aktif
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Prioritas pengawasan lapangan & realisasi biaya
        </p>

        <ProjectTable projects={proyekAktif} />
      </div>
    </section>
  );
}
