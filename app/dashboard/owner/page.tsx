import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";
import { getOwnerSummary } from "@/lib/ownerSummary";

export default function OwnerPage() {
  const summary = getOwnerSummary();

  return (
    <>
      <DashboardHeader
        title="Owner Dashboard"
        subtitle="Ringkasan kondisi proyek & keuangan perusahaan"
      />

      {/* KPI REAL */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <KpiCard
          title="Total Proyek"
          value={summary.totalProyek}
          type="text"
        />

        <KpiCard
          title="Total Kontrak"
          value={summary.totalKontrak}
        />

        <KpiCard
          title="Total Biaya"
          value={summary.totalBiaya}
        />

        <KpiCard
          title="Total Sisa"
          value={summary.totalSisa}
        />

        <KpiCard
          title="Status Perusahaan"
          type="status"
          statusValue={summary.status}
          value={summary.status}
        />
      </div>

      {/* NEXT BLOCK */}
      <SectionPlaceholder title="Ringkasan Proyek Strategis" />
    </>
  );
}
