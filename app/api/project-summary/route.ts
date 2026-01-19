export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { statusFromBudget } from "@/lib/engine/budget";
import type { ProjectSummary } from "@/lib/types/project";

/* =====================
   CONNECT GOOGLE SHEET
===================== */
async function getSheets() {
  const CLIENT_EMAIL = process.env.GS_CLIENT_EMAIL!;
  const PRIVATE_KEY = process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =====================
   GET PROJECT SUMMARY
===================== */
export async function GET(req: Request) {
  try {
    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
    });

    const rows = res.data.values || [];
    if (rows.length <= 1) {
      // tidak ada data
      return NextResponse.json([] as ProjectSummary[]);
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] || ""]))
    );

    /* =====================
       GROUP BY PROJECT
    ===================== */
    const byProject: Record<string, any[]> = {};

    data.forEach((r: any) => {
      if (!r.project_id) return;

      if (!byProject[r.project_id]) {
        byProject[r.project_id] = [];
      }
      byProject[r.project_id].push(r);
    });

    /* =====================
       BUILD SUMMARY
    ===================== */
    function buildSummary(
      project_id: string,
      rows: any[]
    ): ProjectSummary {
      const material = rows.filter(
        (r) => r.status === "RECEIVED" && Number(r.total) > 0
      );

      const biayaReal = material.reduce(
        (sum, r) => sum + Number(r.total),
        0
      );

      // ⚠️ sementara hardcode (nanti ambil dari master project)
      const nilaiKontrak = 2_500_000_000;

      const sisaBudget = nilaiKontrak - biayaReal;
      const statusBudget = statusFromBudget(nilaiKontrak, biayaReal);

      return {
        project_id,
        project_name: `Proyek ${project_id}`,
        nilaiKontrak,
        biayaReal,
        sisaBudget,
        statusBudget,
      };
    }

    /* =====================
       RETURN ALL PROJECTS
       ⚠️ PENTING:
       - LANGSUNG ARRAY
       - BUKAN { projects }
    ===================== */
    const projects: ProjectSummary[] = Object.keys(byProject).map((pid) =>
      buildSummary(pid, byProject[pid])
    );

    return NextResponse.json(projects);
  } catch (err) {
    console.error("PROJECT SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed load project summary" },
      { status: 500 }
    );
  }
}
