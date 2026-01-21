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
      range: "'Master project'!A:E",
    });

    const [, ...rows] = res.data.values ?? [];

    const data = rows
      .filter((r) => String(r[4]).toUpperCase() === "RUNNING")
      .map((r) => ({
        project_id: r[0],
        project_name: r[1],
        status: r[4],
      }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET PROYEK ERROR:", err);
    return NextResponse.json(
      { error: "Gagal load master proyek" },
      { status: 500 }
    );
  }
}
