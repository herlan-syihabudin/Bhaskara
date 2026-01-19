import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

/* ======================
   API FETCH
====================== */
async function getProjectSummary() {
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
  const totalKontrak = projects.reduce(
    (sum: number, p: any) => sum + p.nilaiKontrak,
    0
  );
  const totalBiaya = projects.reduce(
    (sum: number, p: any) => sum + p.biayaReal,
    0
  );
  const totalSisa = projects.reduce(
    (sum: number, p: any) => sum + p.sisaBudget,
    0
  );

  const status =
    projects.some((p: any) => p.statusBudget === "BAHAYA")
      ? "BAHAYA"
      : projects.some((p: any) => p.statusBudget === "WARNING")
      ? "WARNING"
      : "AMAN";

  return (
    <section className="container-bbm py-12 space-y-12">
      <DashboardHeader
        title="Owner Dashboard"
        subtitle="Ringkasan seluruh proyek & kondisi biaya"
      />

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya" value={totalBiaya} />
        <KpiCard title="Total Sisa" value={totalSisa} />
        <KpiCard title="Status" type="status" statusValue={status} />
      </div>

      {/* TABLE */}
      <ProjectTable projects={projects} />
    </section>
  );
}
