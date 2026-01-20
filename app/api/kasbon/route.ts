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
   TIME HELPERS (WIB)
===================== */
function todayISO() {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  return d.toISOString().slice(0, 10);
}

function nowTimestamp() {
  return new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Jakarta",
  }); // yyyy-mm-dd HH:mm:ss
}

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

    if (!body.karyawan_id || !body.jumlah || Number(body.jumlah) <= 0) {
      return NextResponse.json(
        { error: "karyawan_id & jumlah wajib dan harus > 0" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    const row = [
      `KSB-${Date.now()}`,            // kasbon_id
      body.karyawan_id,               // karyawan_id
      body.tanggal || todayISO(),     // tanggal
      Number(body.jumlah),             // jumlah
      body.keterangan || "",           // keterangan
      "BELUM_DIPOTONG",                // status
      "",                              // payroll_id
      nowTimestamp(),                  // created_at
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
   PUT KASBON
   - dipakai payroll
   - support SINGLE & BATCH
===================== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updates = Array.isArray(body) ? body : [body];

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KASBON,
    });

    const rows = res.data.values ?? [];

    const requests: any[] = [];

    for (const item of updates) {
      if (!item.kasbon_id || !item.status) continue;

      const rowIndex = rows.findIndex((r) => r[0] === item.kasbon_id);
      if (rowIndex === -1) continue;

      const rowNumber = rowIndex + 1;

      requests.push({
        range: `KASBON!F${rowNumber}:G${rowNumber}`,
        values: [[
          item.status,                 // DIPOTONG
          item.payroll_id || "",       // payroll_id
        ]],
      });
    }

    if (requests.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada kasbon valid untuk diupdate" },
        { status: 400 }
      );
    }

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: requests,
      },
    });

    return NextResponse.json({
      success: true,
      updated: requests.length,
    });
  } catch (e) {
    console.error("UPDATE KASBON ERROR:", e);
    return NextResponse.json(
      { error: "Gagal update kasbon" },
      { status: 500 }
    );
  }
}
