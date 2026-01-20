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
const RANGE_ABSENSI = "ABSENSI!A:I";

/* =====================
   TIME HELPERS (WIB)
===================== */
function todayISO() {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  return d.toISOString().slice(0, 10);
}

function nowTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
}

function monthKey(tanggal: string) {
  return (tanggal || "").slice(0, 7);
}

/* =====================
   GET ABSENSI
   /api/absensi?month=2026-01&project_id=PRJ-001
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const project_id = searchParams.get("project_id");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });

    const [, ...rows] = res.data.values ?? [];

    let data = rows.map((r, i) => ({
      rowIndex: i + 2, // penting buat update jam keluar
      absensi_id: r[0],
      tanggal: r[1],
      karyawan_id: r[2],
      nama: r[3],
      role: r[4],
      tipe: r[5],
      project_id: r[6],
      jam_masuk: r[7],
      jam_keluar: r[8],
    }));

    if (month) data = data.filter(x => monthKey(x.tanggal) === month);
    if (project_id) data = data.filter(x => x.project_id === project_id);

    data.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET ABSENSI ERROR:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data absensi" },
      { status: 500 }
    );
  }
}

/* =====================
   POST ABSENSI
   mode: "MASUK" | "KELUAR"
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const tanggal = body.tanggal || todayISO();
    const waktu = nowTime();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });

    const rows = res.data.values ?? [];
    const headerOffset = 1;

    const existingIndex = rows.findIndex(
      (r, i) =>
        i >= headerOffset &&
        r[1] === tanggal &&
        r[2] === body.karyawan_id
    );

    /* =====================
       MODE MASUK
    ===================== */
    if (body.mode === "MASUK") {
      if (existingIndex !== -1) {
        return NextResponse.json(
          { error: "Karyawan sudah absen masuk hari ini" },
          { status: 400 }
        );
      }

      const row = [
        `ABS-${Date.now()}`,
        tanggal,
        body.karyawan_id || "",
        body.nama || "",
        body.role || "",
        body.tipe || "",
        body.project_id || "",
        waktu,
        "",
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE_ABSENSI,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [row] },
      });

      return NextResponse.json({
        success: true,
        mode: "MASUK",
        jam_masuk: waktu,
      });
    }

    /* =====================
       MODE KELUAR
    ===================== */
    if (body.mode === "KELUAR") {
      if (existingIndex === -1) {
        return NextResponse.json(
          { error: "Absensi masuk belum ada" },
          { status: 400 }
        );
      }

      const rowNumber = existingIndex + 1;
      const updateRange = `ABSENSI!I${rowNumber}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: updateRange,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[waktu]],
        },
      });

      return NextResponse.json({
        success: true,
        mode: "KELUAR",
        jam_keluar: waktu,
      });
    }

    return NextResponse.json(
      { error: "mode wajib MASUK / KELUAR" },
      { status: 400 }
    );
  } catch (err) {
    console.error("ABSENSI ERROR:", err);
    return NextResponse.json(
      { error: "Gagal proses absensi" },
      { status: 500 }
    );
  }
}
