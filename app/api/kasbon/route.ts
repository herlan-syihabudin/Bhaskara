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
      total_kasbon: parseInt(String(r[3] || "0"), 10),
      sisa_kasbon: parseInt(String(r[4] || "0"), 10),
      potong_per_payroll: parseInt(String(r[5] || "0"), 10),
      keterangan: r[6] || "",
      status: r[7] || "", // BELUM_DIPOTONG | DIPOTONG
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
   POST KASBON
   - SEKALI POTONG
   - CICILAN
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const total = parseInt(String(body.total_kasbon || body.jumlah || "0"), 10);
    const potong = parseInt(String(body.potong_per_payroll || "0"), 10);

    if (!body.karyawan_id || total <= 0) {
      return NextResponse.json(
        { error: "karyawan_id & jumlah wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    const row = [
      `KSB-${Date.now()}`,          // kasbon_id
      body.karyawan_id,             // karyawan_id
      body.tanggal || todayISO(),   // tanggal
      total,                        // total_kasbon
      total,                        // sisa_kasbon
      potong > 0 ? potong : "",     // potong_per_payroll
      body.keterangan || "",        // keterangan
      "BELUM_DIPOTONG",             // status
      "",                           // payroll_id
      nowTimestamp(),               // created_at
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: "RAW", // 🔒 PENTING: ANTI ROUNDING
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
   - POTONG CICILAN (PAYROLL)
===================== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    if (!body.kasbon_id) {
      return NextResponse.json(
        { error: "kasbon_id wajib" },
        { status: 400 }
      );
    }

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

    const sisa = parseInt(String(row[4] || "0"), 10);
    const potong = parseInt(String(row[5] || "0"), 10);

    if (potong <= 0) {
      return NextResponse.json(
        { error: "Kasbon ini bukan cicilan" },
        { status: 400 }
      );
    }

    let newSisa = sisa - potong;

    // 🔒 PENGAMAN FINAL
    newSisa = Math.max(0, Math.trunc(newSisa));

    const status = newSisa === 0 ? "DIPOTONG" : "BELUM_DIPOTONG";
    const rowNumber = idx + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `KASBON!E${rowNumber}:I${rowNumber}`,
      valueInputOption: "RAW", // 🔒 ANTI AUTO FORMAT
      requestBody: {
        values: [[
          newSisa,                         // sisa_kasbon
          potong,                          // potong_per_payroll
          row[6] || "",                    // keterangan
          status,                          // status
          body.payroll_id || row[8] || "", // payroll_id
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
