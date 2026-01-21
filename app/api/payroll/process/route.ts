export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   AUTH
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
const RANGE_KASBON = "KASBON!A:J";
const RANGE_PAYROLL = "PAYROLL!A:G";

/* =====================
   POST PROCESS PAYROLL
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { karyawan_id, gaji_pokok, periode } = body;

    if (!karyawan_id || !gaji_pokok || !periode) {
      return NextResponse.json(
        { error: "karyawan_id, gaji_pokok, periode wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    /* ===== GET KASBON ===== */
    const kasbonRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KASBON,
    });

    const rows = kasbonRes.data.values ?? [];
    const data = rows
      .map((r, i) => ({ r, i }))
      .filter(
        ({ r }) =>
          r[1] === karyawan_id && r[7] === "BELUM_DIPOTONG"
      );

    let totalPotongan = 0;
    const payroll_id = `PAY-${Date.now()}`;

    /* ===== POTONG KASBON ===== */
    for (const { r, i } of data) {
      const sisa = Number(r[4] || 0);
      const potong = Number(r[5] || sisa);

      const newSisa = Math.max(0, sisa - potong);
      const status = newSisa === 0 ? "DIPOTONG" : "BELUM_DIPOTONG";

      totalPotongan += potong;

      const rowNumber = i + 1;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `KASBON!E${rowNumber}:I${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            newSisa,
            r[5] || "",
            r[6] || "",
            status,
            payroll_id,
          ]],
        },
      });
    }

    const gajiBersih = gaji_pokok - totalPotongan;

    /* ===== INSERT PAYROLL ===== */
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          payroll_id,
          karyawan_id,
          periode,
          gaji_pokok,
          totalPotongan,
          gajiBersih,
          new Date().toISOString(),
        ]],
      },
    });

    return NextResponse.json({
      success: true,
      payroll_id,
      potongan_kasbon: totalPotongan,
      gaji_bersih: gajiBersih,
    });
  } catch (e) {
    console.error("PAYROLL PROCESS ERROR", e);
    return NextResponse.json(
      { error: "Gagal proses payroll" },
      { status: 500 }
    );
  }
}
