export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

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

export async function GET() {
  try {
    const sheets = await getSheets();
    const SHEET_ID = process.env.GS_SHEET_ID!;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "PAYROLL!A:L",
    });

    const [, ...rows] = res.data.values ?? [];

    const uniq = new Set<string>();
    let hadir = 0;
    let totalGaji = 0;
    let belumDibayar = 0;

    rows.forEach((r) => {
      const nama = r[3];
      const qtyHari = Number(r[6] || 0);
      const total = Number(String(r[10] || "0").replace(/[^0-9]/g, ""));
      const status = r[11];

      if (nama) uniq.add(nama);
      if (qtyHari > 0) hadir++;
      totalGaji += total;
      if (status === "UNPAID") belumDibayar += total;
    });

    return NextResponse.json({
      kpi: {
        totalKaryawan: uniq.size,
        hadirBulanIni: hadir,
        totalGaji,
        belumDibayar,
      },
    });
  } catch (e) {
    console.error("PAYROLL SUMMARY ERROR:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
