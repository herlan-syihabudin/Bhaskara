import { projects } from "@/lib/data/projects";

export function getOwnerSummary() {
  const totalProyek = projects.length;
  const totalKontrak = projects.reduce((a, b) => a + b.nilaiKontrak, 0);
  const totalBiaya = projects.reduce((a, b) => a + b.biayaReal, 0);

  return {
    totalProyek,
    totalKontrak,
    totalBiaya,
    totalSisa: totalKontrak - totalBiaya,
    status:
      totalBiaya / totalKontrak > 0.9
        ? "BAHAYA"
        : totalBiaya / totalKontrak > 0.75
        ? "WARNING"
        : "AMAN",
  };
}
