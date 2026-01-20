export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE AUTH
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

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE_KASBON = "KASBON!A:H";

/* =====================
   GET KASBON
   /api/kasbon
   /api/kasbon?karyawan_id=EMP-001
   /api/kasbon?status=BELUM_DIPOTONG
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const karyawan_id = searchParams.get("karyawan_id");
    const status = searchParams.get("status");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KASBON,
    });

    const [, ...rows] = res.data.values ?? [];

    let data = rows.map((r) => ({
      kasbon_id: r[0],
      karyawan_id: r[1],
      tanggal: r[2],
      jumlah: Number(r[3] || 0),
      keterangan: r[4] || "",
      status: r[5] || "",
      payroll_id: r[6] || "",
      created_at: r[7] || "",
    }));

    if (karyawan_id) {
      data = data.filter((x) => x.karyawan_id === karyawan_id);
    }

    if (status) {
      data = data.filter((x) => x.status === status);
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("GET KASBON ERROR:", e);
    return NextResponse.json(
      { error: "Gagal mengambil data kasbon" },
      { status: 500 }
    );
  }
}

/* =====================
   POST KASBON BARU
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.karyawan_id || !body.jumlah) {
      return NextResponse.json(
        { error: "karyawan_id & jumlah wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    const now = new Date();
    const tanggal = body.tanggal || now.toISOString().slice(0, 10);
    const created_at = now.toISOString().replace("T", " ").slice(0, 19);

    const row = [
      `KSB-${Date.now()}`,          // kasbon_id
      body.karyawan_id,             // karyawan_id
      tanggal,                      // tanggal
      Number(body.jumlah),           // jumlah
      body.keterangan || "",         // keterangan
      "BELUM_DIPOTONG",              // status
      "",                            // payroll_id
      created_at,                    // created_at
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_KASBON,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST KASBON ERROR:", e);
    return NextResponse.json(
      { error: "Gagal tambah kasbon" },
      { status: 500 }
    );
  }
}

/* =====================
   UPDATE KASBON
   (dipakai payroll)
===================== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.kasbon_id || !body.status) {
      return NextResponse.json(
        { error: "kasbon_id & status wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KASBON,
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === body.kasbon_id);

    if (rowIndex === -1) {
      return NextResponse.json(
        { error: "Kasbon tidak ditemukan" },
        { status: 404 }
      );
    }

    const rowNumber = rowIndex + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `KASBON!F${rowNumber}:G${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          body.status,                 // DIPOTONG
          body.payroll_id || "",       // payroll_id
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("UPDATE KASBON ERROR:", e);
    return NextResponse.json(
      { error: "Gagal update kasbon" },
      { status: 500 }
    );
  }
}
