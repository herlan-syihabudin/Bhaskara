import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiPlaceholder from "@/components/dashboard/KpiPlaceholder";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

export default function LogistikPage() {
  return (
    <>
      <DashboardHeader
        title="Logistik"
        subtitle="Barang masuk, keluar, dan distribusi"
      />

      <KpiPlaceholder />

      <SectionPlaceholder title="Pergerakan Barang" />
    </>
  );
}
