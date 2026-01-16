// lib/data/projects.ts

export type ProjectStatus = "ONGOING" | "DONE";

export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;
  biayaReal: number; // ⬅️ WAJIB
  status: ProjectStatus;
};

/**
 * SEMENTARA: data mock
 * nanti diganti DB / API
 */
export const projects: Project[] = [
  {
    id: "cikarang",
    name: "Proyek Gudang Cikarang",
    nilaiKontrak: 2_500_000_000,
    biayaReal: 820_000_000,
    status: "ONGOING",
  },
  {
    id: "karawang",
    name: "Proyek Pabrik Karawang",
    nilaiKontrak: 1_800_000_000,
    biayaReal: 1_450_000_000,
    status: "ONGOING",
  },
];

export function getProjectById(id: string) {
  return projects.find((p) => p.id === id);
}
