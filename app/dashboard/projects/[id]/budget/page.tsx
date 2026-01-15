// /app/dashboard/projects/[id]/budget/page.tsx
import KpiCard from "@/components/dashboard/KpiCard";
import CostByCategory from "@/components/dashboard/CostByCategory";
import CostByVendor from "@/components/dashboard/CostByVendor";
import { getProjectById } from "@/lib/dummy/projectBudget";

type Props = {
  params: { id: string };
};

export default function BudgetPage({ params }: Props) {
  const data = getProjectById(params.id);

  if (!data) {
    return (
      <section className="container-bbm py-12">
        <h1 className="text-xl font-semibold">Proyek tidak ditemukan</h1>
      </section>
    );
  }

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
        <KpiCard title="Total PO" value={data.totalPO} />
        <KpiCard title="Biaya Keluar" value={data.biayaReal} />
        <KpiCard title="Sisa Budget" value={data.sisaBudget} />
        <KpiCard
          title="Status"
          type="status"
          statusValue={data.status}
          value=""
        />
      </div>

      {/* DETAIL */}
      <div className="grid md:grid-cols-2 gap-8">
        <CostByCategory data={data.byCategory} />
        <CostByVendor data={data.byVendor} />
      </div>
    </section>
  );
}
