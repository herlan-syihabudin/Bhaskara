// app/(dash)/dashboard/[projectId]/page.tsx
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/dummy/projectBudget";
import KpiCard from "@/components/dashboard/KpiCard";
import CostByCategory from "@/components/dashboard/CostByCategory";
import CostByVendor from "@/components/dashboard/CostByVendor";
import { pct, statusFromUsedPct } from "@/lib/budgetEngine";

export default function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = getProjectById(params.projectId);

  if (!project) return notFound();

  const spentPct = pct(project.biayaReal, project.nilaiKontrak);
  const autoStatus = statusFromUsedPct(spentPct);

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">{project.projectName}</h1>
        <p className="text-sm text-gray-500">
          Nilai Kontrak: Rp {project.nilaiKontrak.toLocaleString("id-ID")}
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total PO" value={project.totalPO} />

        <KpiCard
          title="Biaya Keluar"
          value={project.biayaReal}
          subtitle={`${spentPct.toFixed(1)}% dari kontrak`}
        />

        <KpiCard
          title="Sisa Budget"
          value={project.sisaBudget}
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

      {/* DETAIL */}
      <div className="grid md:grid-cols-2 gap-8">
        <CostByCategory data={project.byCategory} />
        <CostByVendor data={project.byVendor} />
      </div>
    </section>
  );
}
