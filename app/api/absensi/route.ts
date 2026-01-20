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

// TAB NAME (samakan dgn sheet kamu)
const RANGE_ABSENSI = "ABSENSI!A:I";

/* =====================
   HELPERS
===================== */
function toISODateOnly(d: Date) {
  // yyyy-mm-dd
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function monthKeyFromTanggal(tanggal: string) {
  // input: yyyy-mm-dd -> yyyy-mm
  return (tanggal || "").slice(0, 7);
}

/* =====================
   GET LIST ABSENSI
   /api/absensi?month=2026-01&project_id=PRJ-001
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // yyyy-mm
    const project_id = searchParams.get("project_id");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });

    const values = res.data.values ?? [];
    const [, ...rows] = values; // skip header

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
      data = data.filter((x) => monthKeyFromTanggal(x.tanggal) === month);
    }
    if (project_id) {
      data = data.filter((x) => x.project_id === project_id);
    }

    // sort terbaru dulu
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
   POST ADD ABSENSI
   body:
   {
     tanggal: "2026-01-20",
     karyawan_id:"KRY-001",
     nama:"Herlan...",
     role:"Staff",
     tipe:"Bulanan",
     project_id:"PRJ-001",
     jam_masuk:"08:00",
     jam_keluar:"17:00"
   }
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    const tanggal = body.tanggal || toISODateOnly(new Date());

    const row = [
      `ABS-${Date.now()}`,           // absensi_id
      tanggal,                       // tanggal
      body.karyawan_id || "",         // karyawan_id
      body.nama || "",               // nama
      body.role || "",               // role
      body.tipe || "",               // tipe
      body.project_id || "",         // project_id
      body.jam_masuk || "08:00",     // jam_masuk
      body.jam_keluar || "17:00",    // jam_keluar
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD ABSENSI ERROR:", err);
    return NextResponse.json(
      { error: "Gagal menambah absensi" },
      { status: 500 }
    );
  }
}
