import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

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
  const body = await req.json();

  const sheets = await getSheets();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GS_SHEET_ID!,
    range: "KARYAWAN!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          Date.now().toString(), // karyawan_id
          body.nama,
          body.role,
          body.type,
          body.rate,
        ],
      ],
    },
  });

  return NextResponse.json({ success: true });
}
