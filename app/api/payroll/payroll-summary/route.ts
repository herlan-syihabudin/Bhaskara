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
      range: "PAYROLL!A:L",
    });

    const [, ...rows] = res.data.values ?? [];

    const uniq = new Set<string>();
    let hadir = 0;
    let total = 0;
    let unpaid = 0;

    rows.forEach((r) => {
      if (r[3]) uniq.add(r[3]);
      if (Number(r[6] || 0) > 0) hadir++;
      const val = Number(String(r[10] || "0").replace(/\D/g, ""));
      total += val;
      if (r[11] === "UNPAID") unpaid += val;
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
    return NextResponse.json({ error: "Payroll summary error" }, { status: 500 });
  }
}
