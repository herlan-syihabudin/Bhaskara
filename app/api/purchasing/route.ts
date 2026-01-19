export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

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

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:G",
    });

    const [, ...rows] = res.data.values ?? [];

    const grouped: Record<string, any> = {};

    rows.forEach(([req_id, project_id, , , , , status]) => {
      if (!grouped[project_id]) {
        grouped[project_id] = {
          project_id,
          jumlahItem: 0,
          status: "PENDING",
        };
      }

      grouped[project_id].jumlahItem += 1;

      if (status === "RECEIVED") {
        grouped[project_id].status = "DONE";
      }
    });

    return NextResponse.json(Object.values(grouped));
  } catch (err) {
    console.error("PURCHASING ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
