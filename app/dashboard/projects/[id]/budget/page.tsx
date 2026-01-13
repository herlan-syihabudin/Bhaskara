import KpiCard from "@/components/dashboard/KpiCard";
import CostByCategory from "@/components/dashboard/CostByCategory";
import CostByVendor from "@/components/dashboard/CostByVendor";
import { projectBudget } from "@/lib/dummy/projectBudget";

export default function BudgetPage() {
  const data = projectBudget;

  return (
    <section className="container-bbm py-12 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold">
          {data.projectName}
        </h1>
        <p className="text-sm text-gray-500">
          Nilai Kontrak: Rp {data.nilaiKontrak.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total PO" value={data.totalPO} />
        <KpiCard title="Biaya Keluar" value={data.biayaReal} />
        <KpiCard title="Sisa Budget" value={data.sisaBudget} />
        <KpiCard title="Status" value={data.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <CostByCategory data={data.byCategory} />
        <CostByVendor data={data.byVendor} />
      </div>
    </section>
  );
}
