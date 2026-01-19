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

    if (!project_id) {
      return NextResponse.json(
        { error: "project_id required" },
        { status: 400 }
      );
    }

    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

    /* =====================
       MATERIAL COST
    ===================== */
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
    });

    const rows = res.data.values || [];
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] || ""]))
    );

    const materialList = data.filter(
      (r: any) =>
        r.project_id === project_id &&
        r.status === "RECEIVED" &&
        Number(r.total) > 0
    );

    const biayaMaterial = materialList.reduce(
      (sum: number, r: any) => sum + Number(r.total),
      0
    );

    /* =====================
       KONTRAK (TEMP)
    ===================== */
    const nilaiKontrak = 2500000000; // TODO: ambil dari Sheet SPK

    const biayaReal = biayaMaterial;
    const sisaBudget = nilaiKontrak - biayaReal;
    const statusBudget = statusFromBudget(nilaiKontrak, biayaReal);

    return NextResponse.json({
      project: {
        project_id,
        project_name: `Proyek ${project_id}`,
        nilaiKontrak,
        biayaMaterial,
        biayaJasa: 0,
        biayaAlat: 0,
        biayaReal,
        sisaBudget,
        statusBudget,
      },
    });
  } catch (err) {
    console.error("PROJECT SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed load project summary" },
      { status: 500 }
    );
  }
}
