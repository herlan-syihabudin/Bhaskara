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

    // PRIORITAS STATUS (INI PENTING!)
    const priority: Record<string, number> = {
      "ON DELIVERY": 3,
      "PARTIAL": 2,
      "RECEIVED": 1,
      "READY": 0,
    };

    const grouped: Record<string, any> = {};

    rows.forEach((r) => {
      const project_id = r[2];
      const qty = Number(r[4] || 0);
      const status = r[9];
      const tanggalKirim = r[6];
      const tanggalTerima = r[7];

      if (!project_id) return;

      if (!grouped[project_id]) {
        grouped[project_id] = {
          project_id,
          totalItem: 0,
          status: "READY",
          lastUpdate: "",
        };
      }

      grouped[project_id].totalItem += qty;

      // 🔴 FIX UTAMA: STATUS TIDAK BOLEH KETIMPA
      if (
        priority[status] >
        priority[grouped[project_id].status]
      ) {
        grouped[project_id].status = status;
      }

      // 🔴 FIX LAST UPDATE
      if (tanggalTerima) {
        grouped[project_id].lastUpdate = tanggalTerima;
      } else if (tanggalKirim) {
        grouped[project_id].lastUpdate = tanggalKirim;
      }
    });

    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    console.error("LOGISTIK API ERROR:", error);
    return NextResponse.json(
      { error: "Failed load logistik data" },
      { status: 500 }
    );
  }
}
