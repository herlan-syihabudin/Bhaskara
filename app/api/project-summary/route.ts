export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { statusFromBudget } from "@/lib/engine/budget";

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

    /* ===== MASTER PROYEK ===== */
    const projectRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "'Master proyek'!A:E",
    });

    const projectRows = projectRes.data.values ?? [];
    const [, ...projects] = projectRows;

    /* ===== MATERIAL REQUEST ===== */
    const mrRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:G",
    });

    const mrRows = mrRes.data.values ?? [];
    const [, ...materials] = mrRows;

    const summaries = projects.map((row) => {
      const project_id = row[0];
      const project_name = row[1];

      // nilai kontrak HARUS number
      const nilaiKontrak = Number(row[3]) || 0;

      const biayaReal = materials
        .filter(
          (r) =>
            r[1] === project_id &&
            r[6] === "RECEIVED"
        )
        .reduce((sum, r) => sum + (Number(r[5]) || 0), 0);

      const sisaBudget = nilaiKontrak - biayaReal;

      return {
        project_id,
        project_name,
        nilaiKontrak,
        biayaReal,
        sisaBudget,
        statusBudget: statusFromBudget(nilaiKontrak, biayaReal),
      };
    });

    return NextResponse.json(summaries);
  } catch (err) {
    console.error("PROJECT SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed load project summary" },
      { status: 500 }
    );
  }
}
