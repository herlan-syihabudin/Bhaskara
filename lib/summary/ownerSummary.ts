import { projects } from "@/lib/data/projects";
import {
  statusFromBudget,
  type BudgetStatus,
} from "@/lib/engine/budget";

export type OwnerSummary = {
  totalProyek: number;
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  status: BudgetStatus;
};

export function getOwnerSummary(): OwnerSummary {
  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((acc, p) => acc + p.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((acc, p) => acc + p.biayaReal, 0);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
    status: statusFromBudget(totalKontrak, totalBiaya),
  };
}
