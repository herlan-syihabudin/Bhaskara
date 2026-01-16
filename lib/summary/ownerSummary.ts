import { projects } from "@/lib/data/projects";
import { getRealCostByProject } from "@/lib/engine/realCost";
import { statusFromBudget } from "@/lib/engine/budget";

export function getOwnerSummary() {
  const totalProyek = projects.length;

  const totalKontrak = projects.reduce(
    (a, p) => a + p.nilaiKontrak,
    0
  );

  const totalBiaya = projects.reduce(
    (a, p) => a + getRealCostByProject(p.id),
    0
  );

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
    status: statusFromBudget(totalKontrak, totalBiaya),
  };
}
