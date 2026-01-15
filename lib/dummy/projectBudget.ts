import { statusFromBudget } from "@/lib/budgetEngine";

/* =========================
   TYPE
========================= */
export type ProjectBudget = {
  id: string;
  projectName: string;
  nilaiKontrak: number;
  totalPO: number;
  biayaReal: number;
  sisaBudget: number;
  status: "AMAN" | "WARNING" | "BAHAYA";
  byCategory: { name: string; po: number; real: number }[];
  byVendor: { name: string; po: number; real: number }[];
};

/* =========================
   DATA (MULTI PROJECT)
========================= */
export const projects: ProjectBudget[] = [
  {
    id: "cikarang",
    projectName: "Proyek Gudang Cikarang",
    nilaiKontrak: 2_500_000_000,
    totalPO: 1_200_000_000,
    biayaReal: 820_000_000,
    sisaBudget: 1_680_000_000,
    status: statusFromBudget(2_500_000_000, 820_000_000),
    byCategory: [
      { name: "Material", po: 600_000_000, real: 420_000_000 },
      { name: "Jasa", po: 400_000_000, real: 310_000_000 },
      { name: "Alat", po: 200_000_000, real: 90_000_000 },
    ],
    byVendor: [
      { name: "PT Beton Jaya", po: 350_000_000, real: 290_000_000 },
      { name: "CV Listrik Abadi", po: 220_000_000, real: 200_000_000 },
    ],
  },
  {
    id: "karawang",
    projectName: "Proyek Pabrik Karawang",
    nilaiKontrak: 1_800_000_000,
    totalPO: 1_400_000_000,
    biayaReal: 1_450_000_000,
    sisaBudget: 350_000_000,
    status: statusFromBudget(1_800_000_000, 1_450_000_000),
    byCategory: [],
    byVendor: [],
  },
];

/* =========================
   HELPERS (ERP STYLE)
========================= */
export function getProjectById(id: string) {
  return projects.find((p) => p.id === id);
}

export function getBudgetSummary() {
  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
  };
}
