export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE_PAYROLL = "PAYROLL!A:Q";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { startDate, endDate, periode, project_id, rows } = body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "rows kosong" }, { status: 400 });
    }

    const sheets = await getSheets();

    const tanggal = startDate || new Date().toISOString().slice(0, 10);
    const periodeText = periode || `${startDate}..${endDate}`;

    const values = rows.map((r: any) => {
      const payroll_id = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const qty_hari = Number(r.qty_hari || 0);
      const rate = Number(r.rate || 0);
      const lembur_jam = Number(r.lembur_jam || 0);
      const lembur = Number(r.lembur || 0);
      const potongan = Number(r.potongan || 0);
      const total = Number(r.total || 0);

      return [
        payroll_id,
        tanggal,
        periodeText,
        project_id || r.project_id || "",
        r.karyawan_id || "",
        r.nama || "",
        r.role || "",
        r.type || "",
        qty_hari,
        rate,
        lembur_jam,
        lembur,
        potongan,
        total,
        "UNPAID",   // status default
        "",         // payment_date
        "",         // payment_method
      ];
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return NextResponse.json({ success: true, inserted: values.length });
  } catch (e: any) {
    console.error("PAYROLL GENERATE ERROR:", e);
    return NextResponse.json(
      { error: "Gagal generate payroll" },
      { status: 500 }
    );
  }
}
