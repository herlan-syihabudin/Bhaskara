import { projects } from "@/lib/dummy/projectBudget";
import { statusFromBudget } from "@/lib/budgetEngine";

export function getOwnerSummary() {
  const totalProyek = projects.length;

  const totalKontrak = projects.reduce(
    (a, b) => a + b.nilaiKontrak,
    0
  );

  const totalBiaya = projects.reduce(
    (a, b) => a + b.biayaReal,
    0
  );

  const totalSisa = totalKontrak - totalBiaya;

  const status = statusFromBudget(totalKontrak, totalBiaya);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa,
    status,
  };
}
