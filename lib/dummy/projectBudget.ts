import { statusFromBudget } from "@/lib/budgetEngine";

export type ProjectBudget = {
  id: string;
  projectName: string;
  nilaiKontrak: number;
  biayaReal: number;
};

export const projects: ProjectBudget[] = [
  {
    id: "cikarang",
    projectName: "Proyek Gudang Cikarang",
    nilaiKontrak: 2_500_000_000,
    biayaReal: 820_000_000,
  },
  {
    id: "karawang",
    projectName: "Proyek Pabrik Karawang",
    nilaiKontrak: 1_800_000_000,
    biayaReal: 1_450_000_000,
  },
];
