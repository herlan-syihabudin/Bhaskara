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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: "KARYAWAN!A:H",
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === params.id);

    if (rowIndex === -1)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const rowNumber = rowIndex + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: `KARYAWAN!B${rowNumber}:G${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
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
  } catch (e) {
    console.error("UPDATE KARYAWAN ERROR:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
