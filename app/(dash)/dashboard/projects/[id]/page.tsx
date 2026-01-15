import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/projects";
import KpiCard from "@/components/dashboard/KpiCard";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);
  if (!project) notFound();

  const sisa = project.nilaiKontrak - project.biayaReal;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">{project.name}</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Nilai Kontrak" value={project.nilaiKontrak} />
        <KpiCard title="Biaya Real" value={project.biayaReal} />
        <KpiCard title="Sisa Budget" value={sisa} />
      </div>
    </>
  );
}
