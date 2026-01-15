import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";
import { getOwnerSummary } from "@/lib/summary/ownerSummary";

export default function OwnerPage() {
  const s = getOwnerSummary();

  return (
    <>
      <DashboardHeader
        title="Owner Dashboard"
        subtitle="Ringkasan kondisi proyek & keuangan perusahaan"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <KpiCard title="Total Proyek" value={s.totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={s.totalKontrak} />
        <KpiCard title="Total Biaya" value={s.totalBiaya} />
        <KpiCard title="Total Sisa" value={s.totalSisa} />
        <KpiCard title="Status" type="status" statusValue={s.status} value={s.status} />
      </div>

      <SectionPlaceholder title="Ringkasan Proyek Strategis" />
    </>
  );
}
