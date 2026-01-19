export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE SHEETS AUTH
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
   GET LOGISTIK SUMMARY
===================== */
export async function GET() {
  try {
    const sheets = await getSheets();
    const SHEET_ID = process.env.GS_SHEET_ID!;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "LOGISTIK!A:M",
    });

    const [, ...rows] = res.data.values ?? [];

    /**
     * GROUP PER PROJECT
     */
    const grouped: Record<string, any> = {};

    rows.forEach(
      ([
        log_id,
        req_id,
        project_id,
        item,
        qty,
        satuan,
        tanggal_kirim,
        tanggal_terima,
        lokasi,
        status_logistik,
      ]) => {
        if (!project_id) return;

        if (!grouped[project_id]) {
          grouped[project_id] = {
            project_id,
            totalItem: 0,
            status: "READY",
            lastUpdate: tanggal_kirim || "",
          };
        }

        grouped[project_id].totalItem += Number(qty || 0);

        // STATUS PRIORITY
        if (status_logistik === "ON DELIVERY") {
          grouped[project_id].status = "ON DELIVERY";
        } else if (status_logistik === "PARTIAL") {
          grouped[project_id].status = "PARTIAL";
        } else if (status_logistik === "RECEIVED") {
          grouped[project_id].status = "RECEIVED";
        }
      }
    );

    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    console.error("LOGISTIK API ERROR:", error);
    return NextResponse.json(
      { error: "Failed load logistik data" },
      { status: 500 }
    );
  }
}
