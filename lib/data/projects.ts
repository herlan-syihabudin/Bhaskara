import { getRealCostByProject } from "@/lib/engine/realCost";

export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;
};

export const projects: Project[] = [
  {
    id: "cikarang",
    name: "Proyek Gudang Cikarang",
    nilaiKontrak: 10_000_000,
  },
];

export function getProjectWithRealCost(projectId: string) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const biayaReal = getRealCostByProject(projectId);
  const sisa = project.nilaiKontrak - biayaReal;

  return {
    ...project,
    biayaReal,
    sisa,
  };
}
