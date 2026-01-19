import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import type { ProjectSummary } from "@/lib/types/project";

async function getProjectSummary(): Promise<ProjectSummary[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/project-summary`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed fetch project summary");

  return res.json();
}

export default async function LogistikDashboardPage() {
  const projects = await getProjectSummary();

  const totalProyek = projects.length;
  const proyekAktif = projects.filter(
    (p) => p.statusBudget !== "BAHAYA"
  ).length;

  const proyekSelesai = totalProyek - proyekAktif;

  return (
    <section className="space-y-10">
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          LOGISTIK
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Logistik Dashboard
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Proyek Aktif" value={proyekAktif} type="text" />
        <KpiCard title="Proyek Selesai" value={proyekSelesai} type="text" />
        <KpiCard title="Status Logistik" value="ON TRACK" type="text" />
      </div>

      <ProjectTable projects={projects} />
    </section>
  );
}
