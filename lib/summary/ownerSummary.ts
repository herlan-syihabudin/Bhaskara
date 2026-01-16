import { projects } from "@/lib/data/projects";
import { statusFromBudget, type BudgetStatus } from "@/lib/engine/budget";

export type OwnerSummary = {
  totalProyek: number;
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  status: BudgetStatus;
  usedPct: number;
};

export function getOwnerSummary(): OwnerSummary {
  const totalProyek = projects.length;

  const totalKontrak = projects.reduce((acc, p) => acc + p.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((acc, p) => acc + (p.biayaReal ?? 0), 0);
  const totalSisa = totalKontrak - totalBiaya;

  const usedPct = totalKontrak > 0 ? (totalBiaya / totalKontrak) * 100 : 0;

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa,
    status: statusFromBudget(totalKontrak, totalBiaya),
    usedPct,
  };
}
