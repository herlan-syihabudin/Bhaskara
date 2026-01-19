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
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const SHEET_NAME = "KARYAWAN";

/* =====================
   GET: LIST KARYAWAN
===================== */
export async function GET() {
  try {
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: `${SHEET_NAME}!A2:G`,
    });

    const rows = res.data.values ?? [];

    const data = rows.map((r) => ({
      karyawan_id: r[0],
      nama: r[1],
      role: r[2],
      type: r[3],
      rate_default: Number(r[4] || 0),
      status: r[5],
      catatan: r[6],
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("GET KARYAWAN ERROR:", e);
    return NextResponse.json({ error: "Gagal load karyawan" }, { status: 500 });
  }
}

/* =====================
   POST: TAMBAH KARYAWAN
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, role, type, rate_default, status, catatan } = body;

    if (!nama || !role || !type || !rate_default) {
      return NextResponse.json(
        { error: "Data wajib belum lengkap" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    // generate karyawan_id
    const id = `KRY-${Date.now().toString().slice(-6)}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          id,
          nama,
          role,
          type,
          rate_default,
          status ?? "AKTIF",
          catatan ?? "",
        ]],
      },
    });

    return NextResponse.json({
      success: true,
      karyawan_id: id,
    });
  } catch (e) {
    console.error("POST KARYAWAN ERROR:", e);
    return NextResponse.json(
      { error: "Gagal tambah karyawan" },
      { status: 500 }
    );
  }
}
