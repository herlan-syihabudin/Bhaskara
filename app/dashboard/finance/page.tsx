import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiPlaceholder from "@/components/dashboard/KpiPlaceholder";
import SectionPlaceholder from "@/components/dashboard/SectionPlaceholder";

export default function FinancePage() {
  return (
    <>
      <DashboardHeader
        title="Finance Dashboard"
        subtitle="Pengelolaan cashflow, invoice, dan pembayaran"
      />

      <KpiPlaceholder />

      <SectionPlaceholder title="Ringkasan Keuangan" />
    </>
  );
}
