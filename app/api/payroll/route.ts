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

    const data = rows.map((r) => ({
      payroll_id: r[0],
      tanggal: r[1],
      project_id: r[2],
      nama: r[3],
      role: r[4],
      tipe: r[5],
      qty_hari: Number(r[6] || 0),
      rate: Number(r[7] || 0),
      lembur: Number(r[8] || 0),
      potongan: Number(r[9] || 0),
      total: Number(String(r[10] || "0").replace(/[^0-9]/g, "")),
      status: r[11],
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("PAYROLL API ERROR:", e);
    return NextResponse.json({ error: "Payroll error" }, { status: 500 });
  }
}
