// components/dashboard/ProjectRow.tsx
import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";
import type { Project } from "@/lib/data/projects";
import { statusFromBudget } from "@/lib/engine/budget";

export default function ProjectRow({ project }: { project: Project }) {
  const sisaBudget = project.nilaiKontrak - project.biayaReal;
  const status = statusFromBudget(project.nilaiKontrak, project.biayaReal);

  return (
    <tr className="border-b last:border-none hover:bg-gray-50 transition">
      <td className="py-3 font-medium text-gray-900">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="hover:underline"
        >
          {project.name}
        </Link>
      </td>

      <td className="py-3">
        Rp {project.nilaiKontrak.toLocaleString("id-ID")}
      </td>

      <td className="py-3">
        Rp {project.biayaReal.toLocaleString("id-ID")}
      </td>

      <td className="py-3 font-medium">
        Rp {sisaBudget.toLocaleString("id-ID")}
      </td>

      <td className="py-3">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}
