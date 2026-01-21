export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE AUTH
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

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE = "KASBON!A:J";

/* =====================
   EDIT KASBON
===================== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    if (!body.kasbon_id) {
      return NextResponse.json(
        { error: "kasbon_id wajib" },
        { status: 400 }
      );
    }

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = res.data.values ?? [];
    const idx = rows.findIndex((r) => r[0] === body.kasbon_id);

    if (idx === -1) {
      return NextResponse.json(
        { error: "Kasbon tidak ditemukan" },
        { status: 404 }
      );
    }

    const row = rows[idx];
    const status = row[7];

    // 🔒 KUNCI JIKA SUDAH DIPOTONG
    if (status !== "BELUM_DIPOTONG") {
      return NextResponse.json(
        { error: "Kasbon sudah diproses payroll dan tidak bisa diedit" },
        { status: 403 }
      );
    }

    const total = parseInt(String(body.total_kasbon || row[3]), 10);
    const potong = parseInt(String(body.potong_per_payroll || row[5] || "0"), 10);

    if (total <= 0) {
      return NextResponse.json(
        { error: "Total kasbon tidak valid" },
        { status: 400 }
      );
    }

    const rowNumber = idx + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `KASBON!C${rowNumber}:G${rowNumber}`,
      valueInputOption: "RAW", // 🔒 ANTI ROUNDING
      requestBody: {
        values: [[
          body.tanggal || row[2],     // tanggal
          total,                      // total_kasbon
          total,                      // sisa_kasbon (reset karena belum dipotong)
          potong > 0 ? potong : "",  // potong_per_payroll
          body.keterangan || row[6], // keterangan
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("EDIT KASBON ERROR:", e);
    return NextResponse.json(
      { error: "Gagal edit kasbon" },
      { status: 500 }
    );
  }
}
