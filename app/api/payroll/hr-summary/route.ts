import { NextResponse } from "next/server";
import { getKaryawan } from "@/lib/data/karyawan"; // sesuaikan path

export async function GET() {
  const data = await getKaryawan(); // ambil semua karyawan

  const aktif = data.filter(
    (k: any) => k.status_kerja === "AKTIF"
  );

  const totalAktif = aktif.length;
  const totalHarian = aktif.filter(
    (k: any) => k.type === "HARIAN"
  ).length;

  const totalBulanan = aktif.filter(
    (k: any) => k.type === "BULANAN"
  );

  const totalKontrak = totalBulanan.filter(
    (k: any) =>
      (k.role || "").toLowerCase().includes("kontrak")
  ).length;

  const totalTetap = totalBulanan.length - totalKontrak;

  return NextResponse.json({
    totalAktif,
    totalTetap,
    totalKontrak,
    totalHarian,
  });
}
