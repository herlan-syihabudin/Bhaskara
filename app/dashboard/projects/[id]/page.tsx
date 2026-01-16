import { notFound } from "next/navigation";
import Link from "next/link";
import KpiCard from "@/components/dashboard/KpiCard";
import { getProjectById } from "@/lib/data/projects";
import { getMRByProject } from "@/lib/data/materialRequests";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);
  if (!project) notFound();

  const materialRequests = getMRByProject(project.id);

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
          value={materialRequests.length}
          type="text"
        />
      </div>

      {/* ACTION */}
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

      {/* MATERIAL REQUEST LIST */}
      <div className="border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Material Request
        </h2>

        {materialRequests.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada material request untuk proyek ini
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="pb-2">Tanggal</th>
                <th className="pb-2">Jumlah Item</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {materialRequests.map((mr) => (
                <tr key={mr.id} className="border-b">
                  <td className="py-2">
                    {new Date(mr.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td>{mr.items.length}</td>
                  <td className="font-medium">{mr.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
