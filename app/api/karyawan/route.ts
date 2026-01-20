import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

/* =====================
   GOOGLE SHEETS AUTH
===================== */
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

/* =====================
   GET ALL KARYAWAN
===================== */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const sheets = await getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GS_SHEET_ID!,
    range: "MASTER_KARYAWAN!A:G",
  });

  const [header, ...rows] = res.data.values ?? [];

  const data = rows.map((r) => ({
    karyawan_id: r[0],
    nama: r[1],
    role: r[2],
    type: r[3],
    rate: Number(r[4]),
    status: r[5],
    catatan: r[6] || "",
  }));

  // 👉 GET BY ID
  if (id) {
    const found = data.find((k) => k.karyawan_id === id);
    if (!found) {
      return NextResponse.json({ error: "Karyawan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  return NextResponse.json(data);
}

/* =====================
   UPDATE KARYAWAN
===================== */
export async function PUT(req: Request) {
  const body = await req.json();
  const sheets = await getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GS_SHEET_ID!,
    range: "MASTER_KARYAWAN!A:G",
  });

  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r) => r[0] === body.karyawan_id);

  if (rowIndex === -1) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  const rowNumber = rowIndex + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GS_SHEET_ID!,
    range: `MASTER_KARYAWAN!A${rowNumber}:G${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        body.karyawan_id,
        body.nama,
        body.role,
        body.type,
        body.rate,
        body.status,
        body.catatan || "",
      ]],
    },
  });

  return NextResponse.json({ success: true });
}
