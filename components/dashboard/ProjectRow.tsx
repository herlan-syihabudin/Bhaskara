import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { ProjectBudget } from "@/lib/dummy/projectBudget";

export default function ProjectRow({
  project,
}: {
  project: ProjectBudget;
}) {
  return (
    <tr className="border-b last:border-none hover:bg-gray-50 transition">
      <td className="py-3 font-medium text-gray-900">
        <Link
          href={`/dashboard/budget?id=${project.id}`}
          className="hover:underline"
        >
          {project.projectName}
        </Link>
      </td>

      <td className="py-3">
        Rp {project.nilaiKontrak.toLocaleString("id-ID")}
      </td>

      <td className="py-3">
        Rp {project.biayaReal.toLocaleString("id-ID")}
      </td>

      <td className="py-3 font-medium">
        Rp {project.sisaBudget.toLocaleString("id-ID")}
      </td>

      <td className="py-3">
        <StatusBadge status={project.status} />
      </td>
    </tr>
  );
}
