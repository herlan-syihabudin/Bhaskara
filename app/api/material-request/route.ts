export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   HELPER: CONNECT SHEET
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
   POST: LAPANGAN SUBMIT
===================== */
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

    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

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
          note || "",
          created_at,
        ]],
      },
    });

    return NextResponse.json({ success: true, req_id });
  } catch (err) {
    console.error("POST MATERIAL ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/* =====================
   GET: PURCHASING VIEW
===================== */
export async function GET() {
  try {
    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
    });

    const rows = res.data.values || [];
    if (rows.length < 2) return NextResponse.json({ data: [] });

    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] || ""]))
    );

    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET MATERIAL ERROR:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

/* =====================
   PATCH: PURCHASING UPDATE
===================== */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { req_id, harga, status } = body;

    const SHEET_ID = process.env.GS_SHEET_ID!;
    const sheets = await getSheets();

    // ambil semua data
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
    });

    const rows = res.data.values || [];
    const rowIndex = rows.findIndex((r) => r[0] === req_id);
    if (rowIndex === -1) {
      return NextResponse.json({ success: false, message: "Not found" });
    }

    const qty = Number(rows[rowIndex][4] || 0);
    const total = harga ? Number(harga) * qty : "";

    // update harga (G), total (H), status (I)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `MATERIAL_REQUEST!G${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[harga || "", total, status]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH MATERIAL ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
