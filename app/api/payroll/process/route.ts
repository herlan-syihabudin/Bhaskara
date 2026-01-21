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
const RANGE_PAYROLL = "PAYROLL!A:U";

/* =====================
   HELPERS
===================== */
function nowWIB() {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });
}

function genPayrollId(periode: string, index: number) {
  const p = periode.replace("-", "");
  return `PAY-${p}-${String(index).padStart(3, "0")}`;
}

/* =====================
   POST PROCESS PAYROLL (MASSAL)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { periode, payrollRows } = body;

    if (!periode || !Array.isArray(payrollRows)) {
      return NextResponse.json(
        { error: "periode & payrollRows wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    /* ===== LOAD KASBON ===== */
    const kasbonRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KASBON,
    });

    const kasbonRows = kasbonRes.data.values ?? [];

    const payrollValues: any[] = [];
    let payrollIndex = 1;

    /* ===== LOOP PAYROLL ===== */
    for (const row of payrollRows) {
      const {
        karyawan_id,
        nama,
        role,
        type,
        gaji_bruto,
        project_id,
      } = row;

      let potonganKasbon = 0;
      const payroll_id = genPayrollId(periode, payrollIndex++);

      /* ===== FILTER KASBON AKTIF ===== */
      const kasbonAktif = kasbonRows
        .map((r, i) => ({ r, i }))
        .filter(
          ({ r }) =>
            r[1] === karyawan_id && r[7] === "BELUM_DIPOTONG"
        );

      let sisaGaji = gaji_bruto;

      /* ===== POTONG KASBON DENGAN LIMIT ===== */
      for (const { r, i } of kasbonAktif) {
        if (sisaGaji <= 0) break;

        const sisa = Number(r[4] || 0);
        const cicilan = Number(r[5] || sisa);
        const potong = Math.min(cicilan, sisa, sisaGaji);

        const newSisa = sisa - potong;
        const status = newSisa === 0 ? "DIPOTONG" : "BELUM_DIPOTONG";

        potonganKasbon += potong;
        sisaGaji -= potong;

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

      const total = gaji_bruto - potonganKasbon;

      payrollValues.push([
        payroll_id,
        periode,
        periode,
        project_id || "",
        karyawan_id,
        nama,
        role,
        type,
        "",
        "",
        gaji_bruto,
        "",
        "",
        "",
        potonganKasbon,
        "",
        total,
        "PROCESSED",
        "",
        "",
      ]);
    }

    /* ===== INSERT PAYROLL ===== */
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: payrollValues,
      },
    });

    return NextResponse.json({
      success: true,
      processed: payrollValues.length,
    });
  } catch (e) {
    console.error("PAYROLL PROCESS ERROR", e);
    return NextResponse.json(
      { error: "Gagal proses payroll" },
      { status: 500 }
    );
  }
}
