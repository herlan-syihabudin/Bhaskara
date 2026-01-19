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

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: "PAYROLL!A:Q", // ⬅️ UPDATE RANGE
    });

    const [, ...rows] = res.data.values ?? [];

    const uniq = new Set<string>();
    let hadir = 0;
    let total = 0;
    let unpaid = 0;

    rows.forEach((r) => {
      const nama = r[5];              // nama
      const qtyHari = Number(r[8] || 0);
      const totalGaji = Number(String(r[13] || "0").replace(/\D/g, ""));
      const status = r[14];           // status

      if (nama) uniq.add(nama);
      if (qtyHari > 0) hadir++;
      total += totalGaji;
      if (status === "UNPAID") unpaid += totalGaji;
    });

    return NextResponse.json({
      kpi: {
        totalKaryawan: uniq.size,
        hadirBulanIni: hadir,
        totalGaji: total,
        belumDibayar: unpaid,
      },
    });
  } catch (e) {
    console.error("PAYROLL SUMMARY ERROR", e);
    return NextResponse.json(
      { error: "Payroll summary error" },
      { status: 500 }
    );
  }
}
