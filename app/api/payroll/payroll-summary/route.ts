export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE SHEETS AUTH (READ ONLY)
===================== */
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

/* =====================
   HELPERS
===================== */
const num = (v: any) =>
  Number(String(v || "").replace(/[^\d.-]/g, "")) || 0;

const upper = (v: any) => String(v || "").trim().toUpperCase();

/* =====================
   GET PAYROLL SUMMARY
===================== */
export async function GET() {
  try {
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
    });

    const [, ...rows] = res.data.values ?? [];

    const uniqKaryawan = new Set<string>();

    let totalGaji = 0;
    let belumDibayar = 0;
    let totalHariKerjaHarian = 0;

    for (const r of rows) {
      /*
        INDEX PAYROLL (konsisten dengan sistem lu):
        4  karyawan_id
        7  type
        8  qty_hari
        13 total (atau 16 kalau versi lama)
        14 status (atau 17 versi lama)
      */

      const karyawanId = r[4];
      const type = upper(r[7]);
      const qtyHari = num(r[8]);

      // support 2 versi kolom total
      const total =
        r[16] !== undefined ? num(r[16]) : num(r[13]);

      const status =
        r[17] !== undefined ? upper(r[17]) : upper(r[14]);

      if (karyawanId) uniqKaryawan.add(karyawanId);

      if (type === "HARIAN") {
        totalHariKerjaHarian += qtyHari;
      }

      totalGaji += total;

      if (status === "DRAFT" || status === "UNPAID") {
        belumDibayar += total;
      }
    }

    return NextResponse.json({
      kpi: {
        totalKaryawan: uniqKaryawan.size,
        totalHariKerjaHarian,
        totalGaji,
        belumDibayar,
      },
    });
  } catch (e) {
    console.error("PAYROLL SUMMARY ERROR:", e);
    return NextResponse.json(
      { error: "Payroll summary error" },
      { status: 500 }
    );
  }
}
