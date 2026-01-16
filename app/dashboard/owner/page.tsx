import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import UsedPctBar from "@/components/dashboard/UsedPctBar";
import { projects } from "@/lib/data/projects";
import { getOwnerSummary } from "@/lib/summary/ownerSummary";

export default function OwnerPage() {
  const summary = getOwnerSummary();

  return (
    <section className="container-bbm py-12 space-y-12">
      <DashboardHeader
        title="Owner Dashboard"
        subtitle="Ringkasan seluruh proyek & kondisi biaya"
      />

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={summary.totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={summary.totalKontrak} />
        <KpiCard title="Total Biaya" value={summary.totalBiaya} />
        <KpiCard title="Total Sisa" value={summary.totalSisa} />
        <KpiCard title="Status" type="status" statusValue={summary.status} />
      </div>

      {/* PROGRESS */}
      <UsedPctBar value={summary.usedPct} status={summary.status} />

      {/* TABLE */}
      <ProjectTable projects={projects} />
    </section>
  );
}
