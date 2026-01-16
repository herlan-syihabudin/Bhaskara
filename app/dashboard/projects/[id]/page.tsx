import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/projects";
import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);
  if (!project) notFound();

  const sisa = project.nilaiKontrak - project.biayaReal;

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
          Kontrol proyek, biaya, dan permintaan material
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Nilai Kontrak" value={project.nilaiKontrak} />
        <KpiCard title="Biaya Real" value={project.biayaReal} />
        <KpiCard title="Sisa Budget" value={sisa} />
      </div>

      {/* ACTION PM */}
      <div className="border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Aksi Project Manager
        </h2>
        <p className="text-sm text-gray-500">
          Gunakan aksi di bawah untuk request material ke purchasing
        </p>

        <div className="flex gap-4">
          <Link
            href={`/dashboard/projects/${project.id}/request-material`}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800"
          >
            + Request Material
          </Link>
        </div>
      </div>

      {/* NEXT (PLACEHOLDER) */}
      <div className="border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">
          Status Material Request
        </h2>
        <p className="text-sm text-gray-500">
          Belum ada request material untuk proyek ini
        </p>
      </div>
    </section>
  );
}
