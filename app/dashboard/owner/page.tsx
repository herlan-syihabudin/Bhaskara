import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import type { ProjectSummary } from "@/lib/types/project";

/* ======================
   API FETCH
====================== */
async function getProjectSummary(): Promise<ProjectSummary[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/project-summary`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch project summary");
  }

  return res.json();
}

export default async function OwnerPage() {
  const projects = await getProjectSummary();

  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((a, p) => a + p.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, p) => a + p.biayaReal, 0);
  const totalSisa = projects.reduce((a, p) => a + p.sisaBudget, 0);

  const status =
    projects.some((p) => p.statusBudget === "BAHAYA")
      ? "BAHAYA"
      : projects.some((p) => p.statusBudget === "WARNING")
      ? "WARNING"
      : "AMAN";

  return (
    <section className="container-bbm py-12 space-y-12">
      <DashboardHeader
        title="Owner Dashboard"
        subtitle="Ringkasan seluruh proyek & kondisi biaya"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya" value={totalBiaya} />
        <KpiCard title="Total Sisa" value={totalSisa} />
        <KpiCard title="Status" type="status" statusValue={status} />
      </div>

      <ProjectTable projects={projects} />
    </section>
  );
}
