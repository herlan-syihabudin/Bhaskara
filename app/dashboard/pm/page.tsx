import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiPlaceholder from "@/components/dashboard/KpiPlaceholder";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

export default function PMPage() {
  return (
    <>
      <DashboardHeader
        title="Project Manager"
        subtitle="Monitoring progres proyek & isu lapangan"
      />

      <KpiPlaceholder />

      <SectionPlaceholder title="Daftar Proyek Aktif" />
    </>
  );
}
