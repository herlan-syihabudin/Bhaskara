import { getBudgetStatus } from "@/lib/budgetEngine";

export const projectBudget = {
  projectName: "Proyek Gudang Cikarang",
  nilaiKontrak: 2500000000,
  totalPO: 1200000000,
  biayaReal: 820000000,

  get sisaBudget() {
    return this.nilaiKontrak - this.biayaReal;
  },

  get status() {
    return getBudgetStatus(this.nilaiKontrak, this.biayaReal);
  },

  byCategory: [
    { name: "Material", po: 600000000, real: 420000000 },
    { name: "Jasa", po: 400000000, real: 310000000 },
    { name: "Alat", po: 200000000, real: 90000000 },
  ],

  byVendor: [
    { name: "PT Beton Jaya", po: 350000000, real: 290000000 },
    { name: "CV Listrik Abadi", po: 220000000, real: 200000000 },
  ],
};
