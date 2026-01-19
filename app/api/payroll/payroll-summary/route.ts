export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE SHEETS AUTH
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
    const SHEET_ID = process.env.GS_SHEET_ID!;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "PAYROLL!A:L",
    });

    const [, ...rows] = res.data.values ?? [];

    let totalKaryawan = 0;
    let hadirBulanIni = 0;
    let totalGaji = 0;
    let belumDibayar = 0;

    const uniqKaryawan = new Set<string>();

    rows.forEach((r) => {
      const nama = r[3];
      const qtyHari = Number(r[6] || 0);
      const total = Number(r[10] || 0);
      const status = r[11];

      if (nama) uniqKaryawan.add(nama);

      if (qtyHari > 0) hadirBulanIni += 1;

      totalGaji += total;

      if (status === "UNPAID") {
        belumDibayar += total;
      }
    });

    totalKaryawan = uniqKaryawan.size;

    return NextResponse.json({
      kpi: {
        totalKaryawan,
        hadirBulanIni,
        totalGaji,
        belumDibayar,
      },
    });
  } catch (error) {
    console.error("PAYROLL SUMMARY ERROR:", error);
    return NextResponse.json(
      { error: "Failed load payroll summary" },
      { status: 500 }
    );
  }
}
