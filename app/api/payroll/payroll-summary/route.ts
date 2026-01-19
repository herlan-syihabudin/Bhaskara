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

    const uniqKaryawan = new Set<string>();
    let hadirBulanIni = 0;
    let totalGaji = 0;
    let belumDibayar = 0;

    rows.forEach((r) => {
      const nama = r[3];
      const qtyHari = Number(r[6] || 0);
      const total = Number(r[10] || 0);
      const status = r[11];

      if (nama) uniqKaryawan.add(nama);
      if (qtyHari > 0) hadirBulanIni++;
      totalGaji += total;
      if (status === "UNPAID") belumDibayar += total;
    });

    return NextResponse.json({
      kpi: {
        totalKaryawan: uniqKaryawan.size,
        hadirBulanIni,
        totalGaji,
        belumDibayar,
      },
    });
  } catch (err) {
    console.error("PAYROLL SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load payroll summary" },
      { status: 500 }
    );
  }
}
