// lib/summary/financeSummary.ts
import { projects } from "@/lib/data/projects";
import { statusFromBudget, type BudgetStatus } from "@/lib/engine/budget";

export type FinanceSummary = {
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  status: BudgetStatus;
  avgUsedPct: number;
};

export function getFinanceSummary(): FinanceSummary {
  const totalKontrak = projects.reduce((a, p) => a + p.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, p) => a + p.biayaReal, 0);
  const totalSisa = totalKontrak - totalBiaya;

  const avgUsedPct =
    projects.length > 0
      ? projects.reduce(
          (a, p) => a + (p.biayaReal / p.nilaiKontrak) * 100,
          0
        ) / projects.length
      : 0;

  return {
    totalKontrak,
    totalBiaya,
    totalSisa,
    status: statusFromBudget(totalKontrak, totalBiaya),
    avgUsedPct,
  };
}
