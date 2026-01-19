export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { statusFromBudget } from "@/lib/engine/budget";
import type { ProjectSummary } from "@/lib/types/project";

/* =====================
   CONNECT GOOGLE SHEET
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
   GET PROJECT SUMMARY
===================== */
export async function GET() {
  try {
    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

    /* ===== 1️⃣ MASTER PROJECT ===== */
    const projectRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "PROJECTS!A:C",
    });

    const projectRows = projectRes.data.values || [];
    if (projectRows.length <= 1) {
      return NextResponse.json([] as ProjectSummary[]);
    }

    const [, ...projectsData] = projectRows;

    /* ===== 2️⃣ MATERIAL REQUEST ===== */
    const mrRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
    });

    const mrRows = mrRes.data.values || [];
    const [, ...mrData] = mrRows;

    /* ===== 3️⃣ BUILD SUMMARY ===== */
    const summaries: ProjectSummary[] = projectsData.map(
      ([project_id, project_name, nilai_kontrak]) => {
        const biayaReal = mrData
          .filter(
            (r) =>
              r[0] === project_id && // project_id
              r[8] === "RECEIVED" && // status
              Number(r[7]) > 0 // total
          )
          .reduce((sum, r) => sum + Number(r[7]), 0);

        const nilaiKontrak = Number(nilai_kontrak);
        const sisaBudget = nilaiKontrak - biayaReal;

        return {
          project_id,
          project_name,
          nilaiKontrak,
          biayaReal,
          sisaBudget,
          statusBudget: statusFromBudget(nilaiKontrak, biayaReal),
        };
      }
    );

    return NextResponse.json(summaries);
  } catch (err) {
    console.error("PROJECT SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed load project summary" },
      { status: 500 }
    );
  }
}
