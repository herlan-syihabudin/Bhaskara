import { projects } from "@/lib/data/projects";
import { pct, statusFromBudget } from "@/lib/engine/budget";
import type { BudgetStatus } from "@/lib/engine/budget";

export function getFinanceSummary(): {
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  usedPct: number;
  status: BudgetStatus;
} {
  const totalKontrak = projects.reduce(
    (a, b) => a + b.nilaiKontrak,
    0
  );

  const totalBiaya = projects.reduce(
    (a, b) => a + b.biayaReal,
    0
  );

  const usedPct = pct(totalBiaya, totalKontrak);

  return {
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
    usedPct,
    status: statusFromBudget(totalKontrak, totalBiaya),
  };
}
