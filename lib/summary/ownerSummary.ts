import { projects } from "@/lib/data/projects";

export function getOwnerSummary() {
  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((a,b)=>a+b.nilaiKontrak,0);
  const totalBiaya = projects.reduce((a,b)=>a+b.biayaReal,0);

  const usedPct = totalBiaya / totalKontrak;

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
    status:
      usedPct >= 0.9 ? "BAHAYA" :
      usedPct >= 0.75 ? "WARNING" :
      "AMAN",
  };
}
