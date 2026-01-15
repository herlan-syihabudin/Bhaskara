import CostByCategory from "@/components/dashboard/CostByCategory";
import CostByVendor from "@/components/dashboard/CostByVendor";
import { projects } from "@/lib/dummy/projectBudget";
import { pct, statusFromUsedPct } from "@/lib/budgetEngine";

export default function BudgetPage() {
  const data = projects[0]; // sementara ambil project pertama

  const spentPct = pct(data.biayaReal, data.nilaiKontrak);
  const autoStatus = statusFromUsedPct(spentPct);

  return (
    <section className="container-bbm py-12 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold">{data.projectName}</h1>
        <p className="text-sm text-gray-500">
          Nilai Kontrak: Rp {data.nilaiKontrak.toLocaleString("id-ID")}
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>…</div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <CostByCategory data={data.byCategory} />
        <CostByVendor data={data.byVendor} />
      </div>
    </section>
  );
}
