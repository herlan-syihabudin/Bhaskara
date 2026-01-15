import ProjectRow from "./ProjectRow";
import type { Project } from "@/lib/data/projects";

export default function ProjectTable({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Daftar Proyek
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Proyek</th>
            <th className="pb-2">Nilai Kontrak</th>
            <th className="pb-2">Biaya Real</th>
            <th className="pb-2">Sisa</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
