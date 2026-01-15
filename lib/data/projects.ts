export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;
  biayaReal: number;
};

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

export function getProjectById(id: string) {
  return projects.find(p => p.id === id);
}
