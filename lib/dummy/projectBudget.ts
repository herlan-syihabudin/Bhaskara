import { statusFromBudget } from "@/lib/budgetEngine";

/* ===============================
   TYPE DEFINITIONS (ERP READY)
================================ */
export type BudgetStatus = "AMAN" | "WARNING" | "BAHAYA";

export type CategoryCost = {
  name: string;
  po: number;
  real: number;
};

export type VendorCost = {
  name: string;
  po: number;
  real: number;
};

export type ProjectBudget = {
  id: string;
  projectName: string;
  nilaiKontrak: number;
  totalPO: number;
  biayaReal: number;
  sisaBudget: number;
  status: BudgetStatus;
  byCategory: CategoryCost[];
  byVendor: VendorCost[];
};

/* ===============================
   MULTI PROJECT DATA (DUMMY)
================================ */
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
      { name: "Material", po: 800000000, real: 780000000 },
      { name: "Jasa", po: 500000000, real: 480000000 },
      { name: "Alat", po: 200000000, real: 190000000 },
    ],

    byVendor: [
      { name: "PT Baja Prima", po: 600000000, real: 590000000 },
      { name: "CV Mekanikal Jaya", po: 400000000, real: 395000000 },
    ],
  },
];

/* ===============================
   HELPERS
================================ */

/** ambil 1 project berdasarkan id */
export function getProjectBudgetById(id: string): ProjectBudget {
  const project = projectBudgets.find((p) => p.id === id);
  if (!project) {
    throw new Error(`Project with id "${id}" not found`);
  }
  return project;
}

/** summary untuk owner dashboard */
export function getBudgetSummary() {
  const totalKontrak = projectBudgets.reduce(
    (acc, p) => acc + p.nilaiKontrak,
    0
  );
  const totalBiaya = projectBudgets.reduce(
    (acc, p) => acc + p.biayaReal,
    0
  );
  const totalSisa = projectBudgets.reduce(
    (acc, p) => acc + p.sisaBudget,
    0
  );

  return {
    totalProyek: projectBudgets.length,
    totalKontrak,
    totalBiaya,
    totalSisa,
  };
}

/* ===============================
   BACKWARD COMPATIBILITY
   (BIAR PAGE LAMA TETAP AMAN)
================================ */
export const projectBudget = projectBudgets[0];
