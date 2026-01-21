import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

/* =====================
   GOOGLE AUTH
===================== */
async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    // ⬇️ future-proof (PAID, payment_date, dll)
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE_PAYROLL = "PAYROLL!A:T";

/* =====================
   HELPERS
===================== */
const num = (v: any) =>
  Number(String(v ?? "").replace(/[^\d.-]/g, "")) || 0;

/* =====================
   GET SLIP GAJI BY ID
===================== */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payrollId = params.id;

    if (!payrollId) {
      return NextResponse.json(
        { error: "payroll_id wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
    });

    const [, ...rows] = res.data.values ?? [];

    const row = rows.find((r) => String(r[0]) === payrollId);

    if (!row) {
      return NextResponse.json(
        { error: "Slip gaji tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      payroll_id: row[0],           // A
      periode: row[1],              // B
      tanggal: row[2],              // C
      project_id: row[3],           // D
      karyawan_id: row[4],          // E
      nama: row[5],                 // F
      role: row[6],                 // G
      type: row[7],                 // H

      qty_hari: num(row[8]),        // I
      rate: num(row[9]),            // J
      gaji_bruto: num(row[10]),     // K

      lembur_jam: num(row[11]),     // L
      lembur_rate: num(row[12]),    // M
      lembur_total: num(row[13]),   // N

      potongan_kasbon: num(row[14]),// O
      potongan_lain: num(row[15]),  // P

      total: num(row[16]),          // Q
      status: row[17],              // R
      payment_date: row[18],        // S
      payment_method: row[19],      // T
    });
  } catch (e) {
    console.error("GET SLIP ERROR", e);
    return NextResponse.json(
      { error: "Gagal mengambil slip gaji" },
      { status: 500 }
    );
  }
}
