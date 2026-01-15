export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;
  biayaReal: number;
};

export const PROJECTS: Project[] = [
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

// helpers
export function getProjectById(id: string) {
  return PROJECTS.find(p => p.id === id);
}

export function getOwnerSummary() {
  const totalProyek = PROJECTS.length;
  const totalKontrak = PROJECTS.reduce((a,b)=>a+b.nilaiKontrak,0);
  const totalBiaya = PROJECTS.reduce((a,b)=>a+b.biayaReal,0);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
  };
}
