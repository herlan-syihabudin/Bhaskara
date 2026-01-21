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
const RANGE = "KASBON!A:J";

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
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const karyawan_id = searchParams.get("karyawan_id");
    const status = searchParams.get("status");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const [, ...rows] = res.data.values ?? [];

    let data = rows.map((r) => ({
      kasbon_id: r[0],
      karyawan_id: r[1],
      tanggal: r[2],
      total_kasbon: Number(r[3] || 0),
      sisa_kasbon: Number(r[4] || 0),
      potong_per_payroll: Number(r[5] || 0),
      keterangan: r[6] || "",
      status: r[7] || "",
      payroll_id: r[8] || "",
      created_at: r[9] || "",
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
   POST KASBON BARU (CICIL)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const total = Number(body.total_kasbon || body.jumlah);
    const potong = Number(body.potong_per_payroll || 0);

    if (!body.karyawan_id || total <= 0 || potong <= 0) {
      return NextResponse.json(
        { error: "karyawan_id, total_kasbon & potong_per_payroll wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    const row = [
      `KSB-${Date.now()}`,      // kasbon_id
      body.karyawan_id,         // karyawan_id
      body.tanggal || todayISO(),
      total,                    // total_kasbon
      total,                    // sisa_kasbon
      potong,                   // potong_per_payroll
      body.keterangan || "",
      "AKTIF",                  // status
      "",                       // payroll_id
      nowTimestamp(),           // created_at
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
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
   - CICIL / PAYROLL
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

    const idx = rows.findIndex((r) => r[0] === body.kasbon_id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Kasbon tidak ditemukan" },
        { status: 404 }
      );
    }

    const row = rows[idx];
    const sisa = Number(row[4] || 0);
    const potong = Number(row[5] || 0);

    let newSisa = sisa - potong;
    let status = "AKTIF";

    if (newSisa <= 0) {
      newSisa = 0;
      status = "SELESAI";
    }

    const rowNumber = idx + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `KASBON!E${rowNumber}:I${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          newSisa,                       // sisa_kasbon
          potong,                        // potong_per_payroll (keep)
          row[6] || "",                  // keterangan
          status,                        // status
          body.payroll_id || row[8] || "",
        ]],
      },
    });

    return NextResponse.json({
      success: true,
      sisa_kasbon: newSisa,
      status,
    });
  } catch (e) {
    console.error("PUT KASBON ERROR:", e);
    return NextResponse.json(
      { error: "Gagal update kasbon" },
      { status: 500 }
    );
  }
}
