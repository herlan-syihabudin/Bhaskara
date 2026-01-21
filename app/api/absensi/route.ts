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
   TIME (WIB)
===================== */
function todayISO() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  )
    .toISOString()
    .slice(0, 10);
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

/* =====================
   JAM MASUK STATUS
===================== */
function masukStatus(jam: string) {
  if (jam <= "08:00:00") return jam;
  if (jam <= "08:30:00") return `TELAT_RINGAN_${jam}`;
  return `TELAT_BERAT_${jam}`;
}

/* =====================
   GET ABSENSI
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });

    const [, ...rows] = res.data.values ?? [];

    let data = rows.map((r, i) => ({
      rowIndex: i + 2,
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
      data = data.filter((x) =>
        (x.tanggal || "").startsWith(month)
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Gagal load absensi" },
      { status: 500 }
    );
  }
}

/* =====================
   POST ABSENSI
   mode:
   - MASUK
   - KELUAR
   - IZIN | SAKIT | CUTI
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

    const existingIndex = rows.findIndex(
      (r, i) =>
        i > 0 &&
        r[1] === tanggal &&
        r[2] === body.karyawan_id
    );

    /* =====================
       MASUK
    ===================== */
    if (body.mode === "MASUK") {
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
            body.karyawan_id,
            body.nama,
            body.role,
            body.tipe,
            body.project_id || "",
            jamMasuk,
            "",
          ]],
        },
      });

      return NextResponse.json({
        success: true,
        jam_masuk: jamMasuk,
      });
    }

    /* =====================
       KELUAR
    ===================== */
    if (body.mode === "KELUAR") {
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

    /* =====================
       IZIN / SAKIT / CUTI
    ===================== */
    if (["IZIN", "SAKIT", "CUTI"].includes(body.mode)) {
      if (existingIndex !== -1) {
        return NextResponse.json(
          { error: "Absensi sudah ada" },
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
            body.karyawan_id,
            body.nama,
            body.role,
            body.tipe,
            body.project_id || "",
            body.mode,
            "",
          ]],
        },
      });

      return NextResponse.json({
        success: true,
        status: body.mode,
      });
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
