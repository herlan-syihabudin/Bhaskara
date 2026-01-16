import { statusFromBudget, type BudgetStatus } from "@/lib/engine/budget";

/* =========================
   TYPES
========================= */
export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;
  biayaReal: number;
};

/* =========================
   SOURCE DATA
========================= */
export const projects: Project[] = [
  {
    id: "cikarang",
    name: "Proyek Gudang Cikarang",
    nilaiKontrak: 2_500_000_000,
    biayaReal: 820_000_000,
  },
  {
    id: "karawang",
    name: "Proyek Pabrik Karawang",
    nilaiKontrak: 1_800_000_000,
    biayaReal: 1_450_000_000,
  },
];

/* =========================
   DERIVED HELPERS
========================= */
export function getProjectById(id: string) {
  return projects.find((p) => p.id === id);
}

export function getProjectSisa(project: Project) {
  return project.nilaiKontrak - project.biayaReal;
}

export function getProjectUsedPct(project: Project) {
  return project.nilaiKontrak > 0
    ? (project.biayaReal / project.nilaiKontrak) * 100
    : 0;
}

export function getProjectStatus(project: Project): BudgetStatus {
  return statusFromBudget(project.nilaiKontrak, project.biayaReal);
}
