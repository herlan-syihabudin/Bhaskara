import { projects } from "@/lib/data/projects";
import { statusFromBudget, BudgetStatus } from "@/lib/engine/budgetEngine";

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
