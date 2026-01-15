import KpiCard from "@/components/dashboard/KpiCard";
import CostByCategory from "@/components/dashboard/CostByCategory";
import CostByVendor from "@/components/dashboard/CostByVendor";
import { projectBudgets } from "@/lib/dummy/projectBudget";
import { pct, statusFromUsedPct } from "@/lib/budgetEngine";

export default function BudgetPage() {
  // sementara: ambil project pertama
  const data = projectBudgets[0];

  const spentPct = pct(data.biayaReal, data.nilaiKontrak);
  const autoStatus = statusFromUsedPct(spentPct);

  return (
    <section className="container-bbm py-12 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold">{data.name}</h1>
        <p className="text-sm text-gray-500">
          Nilai Kontrak: Rp {data.nilaiKontrak.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Biaya Keluar" value={data.biayaReal} />
        <KpiCard
          title="Sisa Budget"
          value={data.nilaiKontrak - data.biayaReal}
          subtitle={`${(100 - spentPct).toFixed(1)}% tersisa`}
        />
        <KpiCard
          title="Status"
          value={autoStatus}
          type="status"
          statusValue={autoStatus}
          subtitle="Otomatis dari % biaya"
        />
      </div>
    </section>
  );
}
