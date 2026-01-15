import { statusFromBudget } from "@/lib/budgetEngine";

export type ProjectDetail = {
  id: string;
  projectName: string;
  nilaiKontrak: number;
  totalPO: number;
  biayaReal: number;
  byCategory: { name: string; po: number; real: number }[];
  byVendor: { name: string; po: number; real: number }[];
};

export const projectDetails: ProjectDetail[] = [
  {
    id: "cikarang",
    projectName: "Proyek Gudang Cikarang",
    nilaiKontrak: 2_500_000_000,
    totalPO: 1_200_000_000,
    biayaReal: 820_000_000,
    byCategory: [
      { name: "Material", po: 600_000_000, real: 420_000_000 },
      { name: "Jasa", po: 400_000_000, real: 310_000_000 },
    ],
    byVendor: [
      { name: "PT Beton Jaya", po: 350_000_000, real: 290_000_000 },
    ],
  },
];

export function getProjectDetailById(id: string) {
  return projectDetails.find((p) => p.id === id);
}
