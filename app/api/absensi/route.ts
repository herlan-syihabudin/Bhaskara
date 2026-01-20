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

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE_ABSENSI = "ABSENSI!A:I";

/* =====================
   TIME HELPERS (REALTIME)
===================== */
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function nowTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
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

    const values = res.data.values ?? [];
    const [, ...rows] = values;

    let data = rows.map((r) => ({
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

    if (month) {
      data = data.filter((x) => monthKey(x.tanggal) === month);
    }

    if (project_id) {
      data = data.filter((x) => x.project_id === project_id);
    }

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
   POST ABSENSI (REALTIME JAM MASUK)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const tanggal = body.tanggal || todayISO();
    const jamMasukRealtime = nowTime();

    const row = [
      `ABS-${Date.now()}`,        // absensi_id
      tanggal,                    // tanggal
      body.karyawan_id || "",     // karyawan_id
      body.nama || "",            // nama
      body.role || "",            // role
      body.tipe || "",            // tipe
      body.project_id || "",      // project_id
      jamMasukRealtime,           // 🔥 JAM MASUK REALTIME
      "",                          // jam_keluar (kosong dulu)
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({
      success: true,
      jam_masuk: jamMasukRealtime,
    });
  } catch (err) {
    console.error("ADD ABSENSI ERROR:", err);
    return NextResponse.json(
      { error: "Gagal menambah absensi" },
      { status: 500 }
    );
  }
}
