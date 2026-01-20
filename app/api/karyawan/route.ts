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
   GET KARYAWAN (ALL / BY ID)
   /api/karyawan
   /api/karyawan?id=EMP-xxx
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const [, ...rows] = res.data.values ?? [];

    const data = rows.map((r) => ({
      karyawan_id: r[0],
      nama: r[1],
      role: r[2],
      type: r[3], // HARIAN / BULANAN
      rate: Number(r[4] || 0),
      status_kerja: r[5] || "AKTIF", // AKTIF | NONAKTIF | RESIGN
      tanggal_masuk: r[6] || "",
      catatan: r[7] || "",
    }));

    if (id) {
      const found = data.find((k) => k.karyawan_id === id);
      if (!found) {
        return NextResponse.json(
          { error: "Karyawan tidak ditemukan" },
          { status: 404 }
        );
      }
      return NextResponse.json(found);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET KARYAWAN ERROR:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data karyawan" },
      { status: 500 }
    );
  }
}

/* =====================
   ADD KARYAWAN (FINAL)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const row = [
      `EMP-${Date.now()}`,                 // karyawan_id
      body.nama || "",
      body.role || "",
      body.type || "HARIAN",
      Number(body.rate || 0),
      body.status_kerja || "AKTIF",
      body.tanggal_masuk || "",
      body.catatan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD KARYAWAN ERROR:", err);
    return NextResponse.json(
      { error: "Gagal menambah karyawan" },
      { status: 500 }
    );
  }
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
    const rowIndex = rows.findIndex((r) => r[0] === body.karyawan_id);

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
          body.nama,
          body.role,
          body.type,
          Number(body.rate || 0),
          body.status_kerja,
          body.tanggal_masuk,
          body.catatan || "",
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE KARYAWAN ERROR:", err);
    return NextResponse.json(
      { error: "Gagal update karyawan" },
      { status: 500 }
    );
  }
}
