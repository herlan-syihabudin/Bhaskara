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
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =====================
   GET PAYROLL
   - summary
   - filter by project
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("project_id");

    const sheets = await getSheets();
    const SHEET_ID = process.env.GS_SHEET_ID!;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "PAYROLL!A:L",
    });

    const [, ...rows] = res.data.values ?? [];

    /* =====================
       DETAIL MODE (PER PROJECT)
    ===================== */
    if (projectId) {
      const detail = rows
        .filter((r) => r[2] === projectId)
        .map((r) => ({
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
          total: Number(r[10] || 0),
          status: r[11],
        }));

      return NextResponse.json(detail);
    }

    /* =====================
       SUMMARY MODE (DASHBOARD)
    ===================== */
    const summary: Record<string, any> = {};

    rows.forEach((r) => {
      const project_id = r[2];
      const total = Number(r[10] || 0);
      const status = r[11];

      if (!project_id) return;

      if (!summary[project_id]) {
        summary[project_id] = {
          project_id,
          totalGaji: 0,
          jumlahOrang: 0,
          unpaid: 0,
        };
      }

      summary[project_id].totalGaji += total;
      summary[project_id].jumlahOrang += 1;

      if (status !== "PAID") {
        summary[project_id].unpaid += total;
      }
    });

    return NextResponse.json(Object.values(summary));
  } catch (err) {
    console.error("PAYROLL API ERROR:", err);
    return NextResponse.json(
      { error: "Failed load payroll data" },
      { status: 500 }
    );
  }
}
