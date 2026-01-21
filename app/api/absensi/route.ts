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
const RANGE_KARYAWAN = "MASTER_KARYAWAN!A:H";

/* =====================
   TIME (WIB)
===================== */
function todayISO() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  ).toISOString().slice(0, 10);
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

function masukStatus(jam: string) {
  if (jam <= "08:00:00") return jam;
  if (jam <= "08:30:00") return `TELAT_RINGAN_${jam}`;
  return `TELAT_BERAT_${jam}`;
}

/* =====================
   GET MASTER KARYAWAN
===================== */
async function getKaryawanById(karyawan_id: string) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE_KARYAWAN,
  });

  const [, ...rows] = res.data.values ?? [];
  const row = rows.find((r) => r[0] === karyawan_id);
  if (!row) return null;

  return {
    karyawan_id: row[0],
    nama: row[1],
    role: row[2],
    tipe: row[3],
    rate: Number(row[4] || 0),
    status: String(row[5] || "").toUpperCase(),
  };
}

/* =====================
   POST ABSENSI
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { karyawan_id, mode, project_id } = body;

    if (!karyawan_id || !mode || !project_id) {
      return NextResponse.json(
        { error: "Data absensi tidak lengkap" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    // 🔒 VALIDASI MASTER KARYAWAN
    const karyawan = await getKaryawanById(karyawan_id);
    if (!karyawan || karyawan.status !== "AKTIF") {
      return NextResponse.json(
        { error: "Karyawan tidak terdaftar / nonaktif" },
        { status: 403 }
      );
    }

    const tanggal = todayISO();
    const waktu = nowTime();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });

    const rows = res.data.values ?? [];
    const existingIndex = rows.findIndex(
      (r, i) => i > 0 && r[1] === tanggal && r[2] === karyawan_id
    );

    /* ===== MASUK ===== */
    if (mode === "MASUK") {
      if (existingIndex !== -1) {
        return NextResponse.json(
          { error: "Sudah absen hari ini" },
          { status: 400 }
        );
      }

      const jamMasuk = masukStatus(waktu);

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE_ABSENSI,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            `ABS-${Date.now()}`,
            tanggal,
            karyawan.karyawan_id,
            karyawan.nama,
            karyawan.role,
            karyawan.tipe,
            project_id,
            jamMasuk,
            "",
          ]],
        },
      });

      return NextResponse.json({ success: true, jam_masuk: jamMasuk });
    }

    /* ===== KELUAR ===== */
    if (mode === "KELUAR") {
      if (existingIndex === -1) {
        return NextResponse.json(
          { error: "Belum absen masuk" },
          { status: 400 }
        );
      }

      if (rows[existingIndex][8]) {
        return NextResponse.json(
          { error: "Sudah absen keluar" },
          { status: 400 }
        );
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `ABSENSI!I${existingIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[waktu]] },
      });

      return NextResponse.json({ success: true });
    }

    /* ===== IZIN / SAKIT / CUTI / ALFA ===== */
    if (["IZIN", "SAKIT", "CUTI", "ALFA"].includes(mode)) {
      if (existingIndex !== -1) {
        return NextResponse.json(
          { error: "Absensi sudah ada hari ini" },
          { status: 400 }
        );
      }

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE_ABSENSI,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            `ABS-${Date.now()}`,
            tanggal,
            karyawan.karyawan_id,
            karyawan.nama,
            karyawan.role,
            karyawan.tipe,
            project_id,
            mode,
            "",
          ]],
        },
      });

      return NextResponse.json({ success: true, status: mode });
    }

    return NextResponse.json(
      { error: "Mode tidak valid" },
      { status: 400 }
    );
  } catch (e) {
    console.error("ABSENSI ERROR", e);
    return NextResponse.json(
      { error: "Gagal proses absensi" },
      { status: 500 }
    );
  }
}
