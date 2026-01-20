import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

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

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE_PAYROLL = "PAYROLL!A:T";

const num = (v: any) =>
  Number(String(v || "").replace(/[^\d.-]/g, "")) || 0;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payrollId = params.id;

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
    });

    const [, ...rows] = res.data.values ?? [];

    const row = rows.find((r) => r[0] === payrollId);

    if (!row) {
      return NextResponse.json(
        { error: "Slip gaji tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      payroll_id: row[0],
      periode: row[1],
      tanggal: row[2],
      project_id: row[3],
      karyawan_id: row[4],
      nama: row[5],
      role: row[6],
      type: row[7],
      qty_hari: num(row[8]),
      rate: num(row[9]),
      gaji_bruto: num(row[10]),
      lembur_jam: num(row[11]),
      lembur_rate: num(row[12]),
      lembur_total: num(row[13]),
      potongan_kasbon: num(row[14]),
      potongan_lain: num(row[15]),
      total: num(row[16]),
      status: row[17],
      payment_date: row[18],
      payment_method: row[19],
    });
  } catch (e) {
    console.error("GET SLIP ERROR", e);
    return NextResponse.json(
      { error: "Gagal mengambil slip gaji" },
      { status: 500 }
    );
  }
}
