import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiPlaceholder from "@/components/dashboard/KpiPlaceholder";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

export default function OwnerPage() {
  return (
    <>
      <DashboardHeader
        title="Owner Dashboard"
        subtitle="Ringkasan seluruh proyek & keuangan perusahaan"
      />

      <KpiPlaceholder />

      <SectionPlaceholder title="Ringkasan Proyek" />
    </>
  );
}
