export const runtime = "nodejs"; // ⬅️ WAJIB

import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      project_id,
      project_name,
      material,
      qty,
      unit,
      requester,
      note,
    } = body;

    // ⬇️ ENV DIBACA DI DALAM FUNCTION
    const SHEET_ID = process.env.GS_SHEET_ID!;
    const CLIENT_EMAIL = process.env.GS_CLIENT_EMAIL!;
    const PRIVATE_KEY = process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const req_id = `MR-${Date.now()}`;
    const created_at = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          req_id,
          project_id,
          project_name,
          material,
          qty,
          unit,
          "",
          "",
          "SUBMITTED",
          requester,
          note,
          created_at,
        ]],
      },
    });

    return NextResponse.json({ success: true, req_id });
  } catch (err) {
    console.error("API MATERIAL ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed submit material request" },
      { status: 500 }
    );
  }
}
