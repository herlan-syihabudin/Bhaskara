import { projects } from "@/lib/data/projects";
import {
  pct,
  statusFromUsedPct,
  type BudgetStatus,
} from "@/lib/engine/budget";

/* =========================
   TYPES
========================= */
export type OwnerSummary = {
  totalProyek: number;
  totalKontrak: number;
  totalBiaya: number;
  totalSisa: number;
  usedPct: number;
  status: BudgetStatus;
};

/* =========================
   ENGINE
========================= */
export function getOwnerSummary(): OwnerSummary {
  const totalProyek = projects.length;

  const totalKontrak = projects.reduce(
    (sum, p) => sum + p.nilaiKontrak,
    0
  );

  const totalBiaya = projects.reduce(
    (sum, p) => sum + p.biayaReal,
    0
  );

  const totalSisa = totalKontrak - totalBiaya;
  const usedPct = pct(totalBiaya, totalKontrak);
  const status = statusFromUsedPct(usedPct);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa,
    usedPct,
    status,
  };
}
