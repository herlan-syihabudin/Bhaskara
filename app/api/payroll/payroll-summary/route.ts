export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE SHEETS AUTH (READ ONLY)
===================== */
async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =====================
   GET PAYROLL SUMMARY
===================== */
export async function GET() {
  try {
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: "PAYROLL!A:T", // FULL RANGE
    });

    const [, ...rows] = res.data.values ?? [];

    const uniqKaryawan = new Set<string>();

    let totalGaji = 0;
    let belumDibayar = 0;
    let totalHarianMasuk = 0;

    rows.forEach((r) => {
      const nama = r[5];
      const type = r[7];
      const qtyHari = Number(r[8] || 0);
      const total = Number(r[16] || 0); // TOTAL GAJI
      const status = r[17];             // STATUS

      if (nama) uniqKaryawan.add(nama);

      // hitung kehadiran khusus tukang harian
      if (type === "HARIAN") {
        totalHarianMasuk += qtyHari;
      }

      totalGaji += total;

      if (status === "DRAFT") {
        belumDibayar += total;
      }
    });

    return NextResponse.json({
      kpi: {
        totalKaryawan: uniqKaryawan.size,
        totalHariKerja: totalHarianMasuk,
        totalGaji,
        belumDibayar,
      },
    });
  } catch (e) {
    console.error("PAYROLL SUMMARY ERROR:", e);
    return NextResponse.json(
      { error: "Payroll summary error" },
      { status: 500 }
    );
  }
}
