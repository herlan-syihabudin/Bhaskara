// app/dashboard/projects/[id]/page.tsx
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectDetailClient from "./ProjectDetailClient";

async function getProject(projectId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/project-summary?id=${projectId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    return <p className="p-8 text-red-500">Project tidak ditemukan</p>;
  }

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PROJECT DETAIL
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          {project.project_name}
        </h1>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Nilai Kontrak" value={project.nilaiKontrak} />
        <KpiCard title="Status Budget" value={project.statusBudget} type="text" />
      </div>

      {/* CLIENT SECTION */}
      <ProjectDetailClient projectId={params.id} />
    </section>
  );
}
