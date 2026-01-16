import { notFound } from "next/navigation";
import Link from "next/link";
import KpiCard from "@/components/dashboard/KpiCard";
import { getProjectById } from "@/lib/data/projects";
import { getMRByProject } from "@/lib/data/materialRequests";
import MaterialRequestSummary from "@/components/material/MaterialRequestSummary";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);
  if (!project) notFound();

  // 🔑 ambil MR berdasarkan project
  const mrList = getMRByProject(project.id);

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PROJECT DETAIL
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          {project.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kontrol proyek & permintaan material
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Nilai Kontrak" value={project.nilaiKontrak} />
        <KpiCard title="Status Proyek" value={project.status} type="text" />
        <KpiCard
          title="Jumlah MR"
          value={mrList.length}
          type="text"
        />
      </div>

      {/* ACTION PM */}
      <div className="border rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-semibold">
          Aksi Project Manager
        </h2>
        <Link
          href={`/dashboard/projects/${project.id}/request-material`}
          className="inline-block px-4 py-2 rounded-lg bg-black text-white text-sm"
        >
          + Request Material
        </Link>
      </div>

      {/* MATERIAL REQUEST (SUMMARY) */}
      <MaterialRequestSummary
        projectId={project.id}
        mrList={mrList}
      />
    </section>
  );
}
