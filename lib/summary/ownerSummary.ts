// lib/summary/financeSummary.ts
import { projects } from "@/lib/data/projects";
import {
  statusFromBudget,
  type BudgetStatus,
} from "@/lib/engine/budget";

export type FinanceSummary = {
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  status: BudgetStatus;
  avgUsedPct: number; // rata-rata % pemakaian budget
};

export function getFinanceSummary(): FinanceSummary {
  const totalKontrak = projects.reduce(
    (acc, p) => acc + p.nilaiKontrak,
    0
  );
  const totalBiaya = projects.reduce(
    (acc, p) => acc + p.biayaReal,
    0
  );
  const totalSisa = totalKontrak - totalBiaya;

  const status = statusFromBudget(totalKontrak, totalBiaya);

  // rata-rata prosentase pemakaian per proyek
  const avgUsedPct =
    projects.length > 0
      ? projects.reduce(
          (acc, p) => acc + (p.biayaReal / p.nilaiKontrak) * 100,
          0
        ) / projects.length
      : 0;

  return {
    totalKontrak,
    totalBiaya,
    totalSisa,
    status,
    avgUsedPct,
  };
}
