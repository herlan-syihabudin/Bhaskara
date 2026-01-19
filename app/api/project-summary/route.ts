export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { statusFromBudget } from "@/lib/engine/budget";

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
    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get("id");

    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
    });

    const rows = res.data.values || [];
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] || ""]))
    );

    /* =====================
       GROUP BY PROJECT
    ===================== */
    const byProject: Record<string, any[]> = {};

    data.forEach((r: any) => {
      if (!byProject[r.project_id]) {
        byProject[r.project_id] = [];
      }
      byProject[r.project_id].push(r);
    });

    function buildSummary(project_id: string, rows: any[]) {
      const material = rows.filter(
        (r) => r.status === "RECEIVED" && Number(r.total) > 0
      );

      const biayaMaterial = material.reduce(
        (sum, r) => sum + Number(r.total),
        0
      );

      const nilaiKontrak = 2500000000; // TEMP
      const biayaReal = biayaMaterial;
      const sisaBudget = nilaiKontrak - biayaReal;
      const statusBudget = statusFromBudget(nilaiKontrak, biayaReal);

      return {
        project_id,
        project_name: `Proyek ${project_id}`,
        nilaiKontrak,
        biayaMaterial,
        biayaJasa: 0,
        biayaAlat: 0,
        biayaReal,
        sisaBudget,
        statusBudget,
      };
    }

    // 🔹 MODE 1: DETAIL PROJECT
    if (project_id) {
      const rows = byProject[project_id] || [];
      return NextResponse.json({
        project: buildSummary(project_id, rows),
      });
    }

    // 🔹 MODE 2: ALL PROJECTS (PM DASHBOARD)
    const projects = Object.keys(byProject).map((pid) =>
      buildSummary(pid, byProject[pid])
    );

    return NextResponse.json({ projects });
  } catch (err) {
    console.error("PROJECT SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed load project summary" },
      { status: 500 }
    );
  }
}
