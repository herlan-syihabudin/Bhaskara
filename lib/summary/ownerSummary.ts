import { projects } from "@/lib/data/projects";
import { statusFromBudget } from "@/lib/engine/budget";
import type { BudgetStatus } from "@/lib/engine/budget";

export function getOwnerSummary(): {
  totalProyek: number;
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  status: BudgetStatus;
} {
  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
    status: statusFromBudget(totalKontrak, totalBiaya),
  };
}
