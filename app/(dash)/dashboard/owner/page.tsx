import KpiCard from "@/components/dashboard/KpiCard";
import { getOwnerSummary } from "@/lib/dummy/projects";

export default function OwnerPage() {
  const summary = getOwnerSummary();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Owner Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={summary.totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={summary.totalKontrak} />
        <KpiCard title="Total Biaya" value={summary.totalBiaya} />
        <KpiCard title="Total Sisa" value={summary.totalSisa} />
      </div>
    </>
  );
}
