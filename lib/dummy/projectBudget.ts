import { statusFromBudget } from "@/lib/budgetEngine";

export type ProjectBudget = {
  id: string;
  projectName: string;
  nilaiKontrak: number;
  totalPO: number;
  biayaReal: number;
  sisaBudget: number;
  status: "AMAN" | "WARNING" | "BAHAYA";
  byCategory: {
    name: string;
    po: number;
    real: number;
  }[];
  byVendor: {
    name: string;
    po: number;
    real: number;
  }[];
};

export const projectBudgets: ProjectBudget[] = [
  {
    id: "cikarang",
    projectName: "Proyek Gudang Cikarang",
    nilaiKontrak: 2500000000,
    totalPO: 1200000000,
    biayaReal: 820000000,
    sisaBudget: 1680000000,
    status: statusFromBudget(2500000000, 820000000),

    byCategory: [
      { name: "Material", po: 600000000, real: 420000000 },
      { name: "Jasa", po: 400000000, real: 310000000 },
      { name: "Alat", po: 200000000, real: 90000000 },
    ],

    byVendor: [
      { name: "PT Beton Jaya", po: 350000000, real: 290000000 },
      { name: "CV Listrik Abadi", po: 220000000, real: 200000000 },
    ],
  },

  {
    id: "karawang",
    projectName: "Proyek Pabrik Karawang",
    nilaiKontrak: 1800000000,
    totalPO: 1500000000,
    biayaReal: 1450000000,
    sisaBudget: 350000000,
    status: statusFromBudget(1800000000, 1450000000),

    byCategory: [
      { name: "Material", po: 800000000, real: 760000000 },
      { name: "Jasa", po: 500000000, real: 490000000 },
      { name: "Alat", po: 200000000, real: 200000000 },
    ],

    byVendor: [
      { name: "PT Baja Utama", po: 600000000, real: 580000000 },
      { name: "CV Mekanikal Prima", po: 400000000, real: 390000000 },
    ],
  },
];
