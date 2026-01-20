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
   CONFIG
===================== */
const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE = "MASTER_KARYAWAN!A:H";

/* =====================
   HELPERS
===================== */
function normalizeType(v: string) {
  const t = (v || "").toUpperCase();
  if (t === "BULANAN") return "TETAP"; // legacy
  if (["HARIAN", "TETAP", "KONTRAK"].includes(t)) return t;
  return "HARIAN";
}

function normalizeStatus(v: string) {
  const s = (v || "").toUpperCase();
  if (["AKTIF", "NONAKTIF", "RESIGN"].includes(s)) return s;
  return "AKTIF";
}

/* =====================
   UPDATE KARYAWAN (FINAL)
===================== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex(
      (r) => r[0] === body.karyawan_id
    );

    if (rowIndex === -1) {
      return NextResponse.json(
        { error: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    const rowNumber = rowIndex + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `MASTER_KARYAWAN!A${rowNumber}:H${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          body.karyawan_id,
          body.nama || "",
          body.role || "",
          normalizeType(body.type),
          Number(body.rate || 0),
          normalizeStatus(body.status_kerja),
          body.tanggal_masuk || "",
          body.catatan || "",
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("UPDATE KARYAWAN ERROR:", e);
    return NextResponse.json(
      { error: "Gagal update karyawan" },
      { status: 500 }
    );
  }
}
