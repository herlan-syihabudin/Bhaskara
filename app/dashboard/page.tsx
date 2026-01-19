import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import { headers } from "next/headers";

async function getProjectSummary() {
  const headersList = headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Host header not found");
  }

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const url = `${protocol}://${host}/api/project-summary`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project summary");
  }

  return res.json();
}

export default async function DashboardHomePage() {
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
    <section className="space-y-10">
      <h1 className="text-2xl font-semibold">
        Dashboard Overview
      </h1>

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
