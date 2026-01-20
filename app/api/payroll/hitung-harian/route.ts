import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

/* =====================
   GOOGLE SHEETS
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
const RANGE_KARYAWAN = "KARYAWAN!A:H";
const RANGE_ABSENSI = "ABSENSI!A:I";

/* =====================
   HELPER
===================== */
function inRange(tgl: string, start: string, end: string) {
  return tgl >= start && tgl <= end;
}

/* =====================
   HITUNG GAJI HARIAN
   ?start=2026-01-15&end=2026-01-28
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { error: "start & end wajib diisi" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    // === ambil karyawan ===
    const karyawanRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KARYAWAN,
    });

    const [, ...karyawanRows] = karyawanRes.data.values ?? [];

    // === ambil absensi ===
    const absensiRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });

    const [, ...absensiRows] = absensiRes.data.values ?? [];

    const hasil = [];

    for (const k of karyawanRows) {
      const [
        karyawan_id,
        nama,
        role,
        tipe,
        rate,
        status,
      ] = k;

      if (tipe !== "HARIAN" || status !== "AKTIF") continue;

      const hariKerja = absensiRows.filter(
        (a) =>
          a[2] === karyawan_id &&
          inRange(a[1], start, end)
      ).length;

      const gaji = hariKerja * Number(rate || 0);

      hasil.push({
        karyawan_id,
        nama,
        periode: `${start} s/d ${end}`,
        hari_kerja: hariKerja,
        rate_harian: Number(rate),
        gaji_bruto: gaji,
      });
    }

    return NextResponse.json(hasil);
  } catch (err) {
    console.error("HITUNG GAJI ERROR:", err);
    return NextResponse.json(
      { error: "Gagal hitung gaji" },
      { status: 500 }
    );
  }
}
