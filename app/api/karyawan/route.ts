export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const karyawan_id = `EMP-${Date.now()}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: "KARYAWAN!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          karyawan_id,
          body.nama,
          body.role,
          body.tipe_gaji,
          body.rate,
          body.status,
          body.join_date,
          "",
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("KARYAWAN ERROR", e);
    return NextResponse.json({ error: "Insert karyawan gagal" }, { status: 500 });
  }
}
