import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiPlaceholder from "@/components/dashboard/KpiPlaceholder";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

export default function PurchasingPage() {
  return (
    <>
      <DashboardHeader
        title="Purchasing"
        subtitle="Pengadaan barang, vendor, dan PO"
      />

      <KpiPlaceholder />

      <SectionPlaceholder title="Status Purchase Order" />
    </>
  );
}
